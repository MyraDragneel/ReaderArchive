// db.js - IndexedDB Operations Module
'use strict';

const DB_NAME = 'NovelReaderDB_v4'; // Keep version consistent unless schema *changes*
const DB_VERSION = 1;
const NOVELS_STORE = 'novels';
const CHAPTERS_STORE = 'chapters';
const NOVEL_ID_INDEX = 'novelIdIndex'; // Index on chapters store

let db = null;

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            console.log("DB: Already initialized.");
            return resolve(db);
        }
        console.log(`DB: Initializing ${DB_NAME} v${DB_VERSION}...`);
        if (!window.indexedDB) {
            return reject(new Error("IndexedDB is not supported by this browser."));
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("DB: Initialization request error", event.target.error);
            reject(new Error(`Database initialization error: ${event.target.error?.message || event.target.error}`));
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("DB: Initialization successful (onsuccess).");
            // Generic error handler for the active connection
            db.onerror = (event) => {
                console.error("DB: Generic database connection error:", event.target.error);
                // Maybe trigger UI notification here if needed
            };
            db.onclose = () => {
                console.warn("DB: Connection closed unexpectedly.");
                db = null; // Reset db instance
            };
            db.onversionchange = () => {
                console.warn("DB: Version change detected. Closing connection.");
                if (db) {
                    db.close(); // Close the connection to allow upgrade
                }
                alert("Database needs an update. Please refresh the page.");
            };
            resolve(db);
        };

        // --- CORRECTED onupgradeneeded ---
        request.onupgradeneeded = (event) => {
            console.log('DB: Upgrade needed or initial setup...');
            const tempDb = event.target.result;
            const tx = event.target.transaction; // Get transaction for safety

            if (!tx) {
                 console.error("DB Upgrade Error: Transaction is missing!");
                 // Attempt to get the error from the event if possible
                 const error = event.target.error || new Error("Upgrade transaction missing");
                 // Reject the main promise if possible or just log heavily
                 console.error("DB Upgrade failed critically.", error);
                 // Cannot proceed with schema creation
                 return;
            }

            // Add transaction lifecycle logs *within* the single handler
             tx.oncomplete = () => console.log("DB: Upgrade transaction completed.");
             tx.onerror = (ev) => console.error("DB: Upgrade transaction error:", ev.target.error);
             tx.onabort = (ev) => console.warn("DB: Upgrade transaction aborted:", ev.target.error);


            try {
                console.log("DB: Starting schema creation/update...");
                // Novels Store
                if (!tempDb.objectStoreNames.contains(NOVELS_STORE)) {
                    tempDb.createObjectStore(NOVELS_STORE, { keyPath: 'id', autoIncrement: true });
                    console.log(`DB: Created store '${NOVELS_STORE}'`);
                }

                // Chapters Store & Index
                let chaptersStore;
                if (!tempDb.objectStoreNames.contains(CHAPTERS_STORE)) {
                    chaptersStore = tempDb.createObjectStore(CHAPTERS_STORE, { keyPath: 'id', autoIncrement: true });
                    console.log(`DB: Created store '${CHAPTERS_STORE}'`);
                } else {
                     // If store exists, get reference via transaction
                     chaptersStore = tx.objectStore(CHAPTERS_STORE);
                     console.log(`DB: Store '${CHAPTERS_STORE}' already exists.`);
                }

                // Create index if it doesn't exist on the store
                if (chaptersStore && !chaptersStore.indexNames.contains(NOVEL_ID_INDEX)) {
                    chaptersStore.createIndex(NOVEL_ID_INDEX, 'novelId', { unique: false });
                    console.log(`DB: Created index '${NOVEL_ID_INDEX}' on '${CHAPTERS_STORE}'`);
                } else if (chaptersStore) {
                     console.log(`DB: Index '${NOVEL_ID_INDEX}' already exists on '${CHAPTERS_STORE}'.`);
                } else {
                    console.warn("DB: Could not access chapters store to check/create index.");
                }

                console.log('DB: Schema creation/update finished within upgrade.');

            } catch (err) {
                console.error("DB Upgrade Error during schema creation:", err);
                 // Don't necessarily abort tx here, let tx.onerror handle it,
                 // but log the specific point of failure.
            }
        };
        // --- END OF CORRECTED onupgradeneeded ---


        request.onblocked = () => {
            console.warn("DB: Open request blocked. Close other tabs using this app.");
            // Reject the promise or alert the user
             reject(new Error("Database connection blocked. Please close other instances of this application and refresh."));
             alert("Database update blocked. Please close any other tabs running this application and refresh the page.");
        };
    });
}

/**
 * Performs a database operation using a transaction. (INTERNAL HELPER)
 * Ensures DB is initialized before proceeding.
 * @param {string|string[]} storeNames - The object store(s) to access.
 * @param {'readonly'|'readwrite'} mode - The transaction mode.
 * @param {(tx: IDBTransaction) => Promise<any>|IDBRequest<any>|any} operation - The function performing the DB operations.
 * @returns {Promise<any>} A promise resolving with the result of the operation.
 */
function performOperation(storeNames, mode, operation) {
    return new Promise(async (resolve, reject) => {
        // Check and initialize DB if needed
        if (!db) {
            try {
                console.log(`DB: performOperation for ${mode} on ${storeNames} - DB not ready, initializing...`);
                await initDB();
                console.log(`DB: performOperation for ${mode} on ${storeNames} - DB init finished.`);
            } catch (initError) {
                console.error(`DB: performOperation for ${mode} on ${storeNames} - DB init failed:`, initError);
                // Reject the specific operation if DB init fails
                return reject(new Error(`Database not available: ${initError.message}`));
            }
        }
        // At this point, `db` should be a valid IDBDatabase instance

        let tx;
        try {
            tx = db.transaction(storeNames, mode);
            // console.log(`DB: Transaction started for ${mode} on ${storeNames}`);
        } catch (e) {
            console.error(`DB: Transaction creation failed for ${mode} on ${storeNames}`, e);
            // Check if the error is due to the DB connection being closed
            if (e.name === 'InvalidStateError') {
                 console.error("DB Error: Connection may be closed. Attempting re-init.");
                 db = null; // Reset db instance
                 // Optionally try initDB again and retry operation, or just reject
                 return reject(new Error("Database connection closed unexpectedly. Please refresh."));
            }
            return reject(e); // Reject with the original error
        }

        tx.onerror = (event) => {
            console.error(`DB: Transaction error on ${storeNames} (${mode})`, event.target.error);
            reject(event.target.error || new Error(`Transaction failed on ${storeNames}`));
        };
        tx.onabort = (event) => {
            console.warn(`DB: Transaction aborted on ${storeNames} (${mode})`, event.target.error);
             // Check if it was aborted due to version change
            if (event.target.error && event.target.error.name === 'VersionError') {
                 reject(new Error("Database version change detected. Please refresh."));
            } else {
                 reject(event.target.error || new Error(`Transaction aborted on ${storeNames}`));
            }
        };

        try {
            // Execute the actual DB logic passed to this wrapper
            const result = operation(tx);

            // Handle different return types from operation
            if (result instanceof Promise) {
                result.then(resolve).catch(reject);
            } else if (result instanceof IDBRequest) {
                result.onsuccess = (event) => resolve(event.target.result);
                result.onerror = (event) => reject(event.target.error); // Reject with the request's error
            } else {
                // For synchronous operations (like tx.commit() implicitly) or operations
                // returning direct values (though less common with IDB requests),
                // resolve when the transaction completes.
                tx.oncomplete = () => {
                    // console.log(`DB: Transaction completed for ${mode} on ${storeNames}`);
                    resolve(result);
                };
            }
        } catch (err) {
            console.error(`DB: Error during operation execution callback on ${storeNames} (${mode})`, err);
            reject(err);
            // Attempt to abort the transaction if it's still active and an error occurred within the callback
            try {
                if (tx.readyState !== 'done') {
                    console.warn("DB: Aborting transaction due to error in operation callback.");
                    tx.abort();
                }
            } catch (abortErr) {
                console.error("DB: Error attempting to abort transaction after operation error:", abortErr);
            }
        }
    });
}


// --- CRUD Functions ---
// (Keep all CRUD functions like addNovelDB, getNovelDB, getAllNovelsDB, updateNovelDB,
// addChapterDB, getChapterDB, getAllChaptersForNovelDB, getAllChaptersDB, updateChapterDB,
// deleteChapterDB, deleteNovelAndChaptersDB, importDataDB exactly as they were
// in the previous "Fully Updated" answer. They rely on the corrected performOperation.)

function addNovelDB(novelData) {
    return performOperation(NOVELS_STORE, 'readwrite', (tx) => tx.objectStore(NOVELS_STORE).add(novelData));
}

function getNovelDB(id) {
    if (typeof id !== 'number' || isNaN(id)) return Promise.reject(new Error(`Invalid key type for getNovelDB: ${typeof id}`));
    return performOperation(NOVELS_STORE, 'readonly', (tx) => tx.objectStore(NOVELS_STORE).get(id));
}

function getAllNovelsDB() {
    return performOperation(NOVELS_STORE, 'readonly', (tx) => tx.objectStore(NOVELS_STORE).getAll());
}

function updateNovelDB(novelData) {
    return performOperation(NOVELS_STORE, 'readwrite', (tx) => tx.objectStore(NOVELS_STORE).put(novelData));
}

function addChapterDB(chapterData) {
    return performOperation(CHAPTERS_STORE, 'readwrite', (tx) => tx.objectStore(CHAPTERS_STORE).add(chapterData));
}

function getChapterDB(id) {
     if (typeof id !== 'number' || isNaN(id)) return Promise.reject(new Error(`Invalid key type for getChapterDB: ${typeof id}`));
    return performOperation(CHAPTERS_STORE, 'readonly', (tx) => tx.objectStore(CHAPTERS_STORE).get(id));
}

function getAllChaptersForNovelDB(novelId) {
     if (typeof novelId !== 'number' || isNaN(novelId)) return Promise.reject(new Error(`Invalid key type for getAllChaptersForNovelDB: ${typeof novelId}`));
    return performOperation(CHAPTERS_STORE, 'readonly', (tx) => tx.objectStore(CHAPTERS_STORE).index(NOVEL_ID_INDEX).getAll(novelId));
}

function getAllChaptersDB() {
    console.log("DB: getAllChaptersDB() called");
    return performOperation(CHAPTERS_STORE, 'readonly', (tx) => {
        console.log("DB: Getting all chapters from store...");
        const store = tx.objectStore(CHAPTERS_STORE);
        return store.getAll();
    });
}

function updateChapterDB(chapterData) {
    return performOperation(CHAPTERS_STORE, 'readwrite', (tx) => tx.objectStore(CHAPTERS_STORE).put(chapterData));
}

function deleteChapterDB(id) {
     if (typeof id !== 'number' || isNaN(id)) return Promise.reject(new Error(`Invalid key type for deleteChapterDB: ${typeof id}`));
    return performOperation(CHAPTERS_STORE, 'readwrite', (tx) => tx.objectStore(CHAPTERS_STORE).delete(id));
}

async function deleteNovelAndChaptersDB(novelId) {
     if (typeof novelId !== 'number' || isNaN(novelId)) return Promise.reject(new Error(`Invalid key type for deleteNovelAndChaptersDB: ${typeof novelId}`));
    console.log(`DB: Deleting novel ${novelId} and its chapters...`);
    return performOperation([NOVELS_STORE, CHAPTERS_STORE], 'readwrite', async (tx) => {
        const novelStore = tx.objectStore(NOVELS_STORE);
        const chapterStore = tx.objectStore(CHAPTERS_STORE);
        const chapterIndex = chapterStore.index(NOVEL_ID_INDEX);
        const chapterKeysRequest = chapterIndex.getAllKeys(IDBKeyRange.only(novelId));
        const chapterKeys = await new Promise((resolve, reject) => {
            chapterKeysRequest.onsuccess = e => resolve(e.target.result);
            chapterKeysRequest.onerror = e => reject(e.target.error);
        });
        const chapterDeletePromises = chapterKeys.map(key => new Promise((resolve, reject) => { const req = chapterStore.delete(key); req.onsuccess = resolve; req.onerror = (e) => reject(e.target.error); }));
        const novelDeletePromise = new Promise((resolve, reject) => { const req = novelStore.delete(novelId); req.onsuccess = resolve; req.onerror = (e) => reject(e.target.error); });
        await Promise.all([...chapterDeletePromises, novelDeletePromise]);
        console.log(`DB: Deleted novel ${novelId} and ${chapterKeys.length} chapters.`);
        return true;
    });
}

async function importDataDB(novelsToImport, chaptersToImport) {
    console.log(`DB: Starting import - ${novelsToImport.length} novels, ${chaptersToImport.length} chapters`);
    const results = { novelsAdded: 0, novelsSkipped: 0, chaptersAdded: 0, chaptersSkipped: 0, lastReadUpdated: 0, lastReadFailed: 0 };
    const novelIdMap = new Map();
    const chapterIdMap = new Map();
    const newNovelsData = new Map();
    return performOperation([NOVELS_STORE, CHAPTERS_STORE], 'readwrite', async (tx) => {
        const novelStore = tx.objectStore(NOVELS_STORE);
        const chapterStore = tx.objectStore(CHAPTERS_STORE);
        console.log("DB Import: Clearing existing data...");
        const clearNovelsReq = novelStore.clear(); const clearChaptersReq = chapterStore.clear();
        await Promise.all([ new Promise((res, rej) => { clearNovelsReq.onsuccess = res; clearNovelsReq.onerror = (e) => rej(e.target.error); }), new Promise((res, rej) => { clearChaptersReq.onsuccess = res; clearChaptersReq.onerror = (e) => rej(e.target.error); }) ]);
        console.log("DB Import: Data cleared."); console.log("DB Import: Importing novels...");
        for (const novel of novelsToImport) { /* ... (import novel logic as before) ... */
            const oldId = novel.id; if (oldId === undefined || oldId === null) { results.novelsSkipped++; continue; }
            const { id, lastReadChapterId, ...addData } = novel; addData.lastReadChapterId = null;
            const addNovelReq = novelStore.add(addData);
            try { const newId = await new Promise((res, rej) => { addNovelReq.onsuccess = (e) => res(e.target.result); addNovelReq.onerror = (e) => rej(e.target.error); }); novelIdMap.set(oldId, newId); newNovelsData.set(newId, { originalLastReadChapterId: lastReadChapterId, title: novel.title || 'Untitled' }); results.novelsAdded++; } catch (err) { results.novelsSkipped++; console.error(`DB Import: Failed to add novel (Old ID ${oldId}):`, err); }
        }
        console.log(`DB Import: Novels - Added: ${results.novelsAdded}, Skipped: ${results.novelsSkipped}`); console.log("DB Import: Importing chapters...");
        for (const chapter of chaptersToImport) { /* ... (import chapter logic as before) ... */
             const oldChapId = chapter.id; const oldNovId = chapter.novelId; if (oldChapId === undefined || oldChapId === null) { results.chaptersSkipped++; continue; } const newNovId = novelIdMap.get(oldNovId); if (newNovId === undefined) { results.chaptersSkipped++; console.warn(`DB Import: Skipping chapter (Old ID ${oldChapId}) - Parent novel (Old ID ${oldNovId}) not found or skipped.`); continue; } const { id, novelId, ...addData } = chapter; const chapToAdd = { ...addData, novelId: newNovId }; const addChapReq = chapterStore.add(chapToAdd); try { const newChapId = await new Promise((res, rej) => { addChapReq.onsuccess = (e) => res(e.target.result); addChapReq.onerror = (e) => rej(e.target.error); }); chapterIdMap.set(oldChapId, newChapId); results.chaptersAdded++; } catch (err) { results.chaptersSkipped++; console.error(`DB Import: Failed to add chapter (Old ID ${oldChapId}):`, err); }
        }
        console.log(`DB Import: Chapters - Added: ${results.chaptersAdded}, Skipped: ${results.chaptersSkipped}`); console.log("DB Import: Updating last read chapter references...");
        for (const [newNovId, novelInfo] of newNovelsData.entries()) { /* ... (update last read logic as before) ... */
            const oldLastReadId = novelInfo.originalLastReadChapterId; if (oldLastReadId !== undefined && oldLastReadId !== null) { const newLastReadId = chapterIdMap.get(oldLastReadId); if (newLastReadId !== undefined) { const getNovelReq = novelStore.get(newNovId); try { const novelRec = await new Promise((res, rej) => { getNovelReq.onsuccess = (e) => res(e.target.result); getNovelReq.onerror = (e) => rej(e.target.error); }); if (novelRec) { novelRec.lastReadChapterId = newLastReadId; const updateReq = novelStore.put(novelRec); await new Promise((res, rej) => { updateReq.onsuccess = res; updateReq.onerror = (e) => rej(e.target.error); }); results.lastReadUpdated++; } else { results.lastReadFailed++; console.warn(`DB Import: Failed to find newly added novel ${newNovId} to update last read.`); } } catch(err) { results.lastReadFailed++; console.error(`DB Import: Error updating last read for novel ${newNovId} (Old LastRead ID ${oldLastReadId}):`, err); } } else { results.lastReadFailed++; console.warn(`DB Import: Could not find mapping for old last read chapter ID ${oldLastReadId} for novel ${newNovId} (${novelInfo.title})`); } }
        }
        console.log(`DB Import: LastRead - Updated: ${results.lastReadUpdated}, Failed/Skipped: ${results.lastReadFailed}`);
        return results;
    });
}


// Export the functions needed by script.js
export {
    initDB, // Make sure initDB is exported
    addNovelDB,
    getNovelDB,
    getAllNovelsDB,
    updateNovelDB,
    addChapterDB,
    getChapterDB,
    getAllChaptersForNovelDB, // Get chapters for ONE novel
    getAllChaptersDB,       // Get ALL chapters (for export)
    updateChapterDB,
    deleteChapterDB,
    deleteNovelAndChaptersDB,
    importDataDB,
};