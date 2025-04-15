/**
 * Simple Novel Reader PWA Script (Overhauled & Final Fixes)
 * Features: CRUD for Novels/Chapters, IndexedDB, Light/Dark Mode, Font Size,
 * Import/Export (w/ relationship fix & gzip compression), Last Read Chapter,
 * Event Delegation, Enhanced Animations & UI Feedback, Chapter Download (Individual & Bulk TXT).
 * Focus on Robustness, Optimization, and Maintainability.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Novel Reader App...");

    // --- Constants ---
    const DB_NAME = 'NovelReaderDB_v3';
    const DB_VERSION = 1;
    const NOVELS_STORE = 'novels';
    const CHAPTERS_STORE = 'chapters';
    const CHAPTER_NOVEL_ID_INDEX = 'novelIdIndex';
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 28;
    const DEFAULT_FONT_SIZE = 16;

    // --- State Variables ---
    let db;
    let currentNovelId = null;
    let currentView = 'list'; // Use keys from 'views' object: 'list', 'detail', 'read', 'novelForm', 'chapterForm'
    let currentFontSize = DEFAULT_FONT_SIZE;

    // --- DOM Element Cache ---
    const appContainer = document.getElementById('app-container');
    const errorDisplay = document.getElementById('error-display');
    const views = {
        list: document.getElementById('view-novel-list'),
        detail: document.getElementById('view-novel-detail'),
        read: document.getElementById('view-chapter-read'),
        novelForm: document.getElementById('view-novel-form'),
        chapterForm: document.getElementById('view-chapter-form'),
    };
    const lists = {
        novel: document.getElementById('novel-list-ul'),
        chapter: document.getElementById('chapter-list-ul'),
    };
    const headerControls = {
        themeToggle: document.getElementById('theme-toggle-btn'),
        fontDecrease: document.getElementById('font-decrease-btn'),
        fontIncrease: document.getElementById('font-increase-btn'),
        fontSizeDisplay: document.getElementById('font-size-display'),
        exportBtn: document.getElementById('export-data-btn'),
        importLabel: document.querySelector('.import-button'),
        importInput: document.getElementById('import-file-input'),
    };
    const detailElements = {
        title: document.getElementById('detail-novel-title-h2'),
        author: document.getElementById('detail-novel-author-span'),
        genre: document.getElementById('detail-novel-genre-span'),
        description: document.getElementById('detail-novel-description-div'),
        continueReading: document.getElementById('continue-reading-container-div'),
        editBtn: document.getElementById('edit-novel-show-form-btn'),
        deleteBtn: document.getElementById('delete-novel-btn'),
        addChapterBtn: document.getElementById('add-chapter-show-form-btn'),
        downloadAllBtn: document.getElementById('download-all-chapters-btn'),
    };
    const readElements = {
        title: document.getElementById('read-chapter-title-h2'),
        content: document.getElementById('read-chapter-content-div'),
    };
    const novelForm = {
        form: document.getElementById('novel-form-element'),
        title: document.getElementById('novel-form-title-h2'),
        editId: document.getElementById('novel-form-edit-id'),
        titleInput: document.getElementById('novel-form-title-input'),
        authorInput: document.getElementById('novel-form-author-input'),
        genreInput: document.getElementById('novel-form-genre-input'),
        descriptionTextarea: document.getElementById('novel-form-description-textarea'),
        cancelBtn: document.getElementById('cancel-novel-form-btn'),
        saveBtn: document.getElementById('novel-form-save-btn'),
    };
    const chapterForm = {
        form: document.getElementById('chapter-form-element'),
        title: document.getElementById('chapter-form-title-h2'),
        editId: document.getElementById('chapter-form-edit-id'),
        novelIdInput: document.getElementById('chapter-form-novel-id-input'),
        titleInput: document.getElementById('chapter-form-title-input'),
        contentTextarea: document.getElementById('chapter-form-content-textarea'),
        cancelBtn: document.getElementById('cancel-chapter-form-btn'),
        saveBtn: document.getElementById('chapter-form-save-btn'),
    };
    const actionButtons = {
        addNovel: document.getElementById('add-novel-show-form-btn'),
    };

    // === Core Application Logic ===

    async function initializeApp() {
        console.log("App: Initializing...");
        showError(null);
        try {
            if (!appContainer || !views.list || !lists.novel) {
                throw new Error("Essential DOM elements are missing. HTML structure might be incorrect.");
            }
            loadPreferences();
            await openDB();
            setupEventListeners();
            await renderNovelList();
            showView('list');
            console.log("App: Initialized Successfully.");
        } catch (error) {
            console.error('FATAL: App initialization failed:', error);
            showError(`Initialization failed: ${error.message || error}. Please refresh or clear site data.`, true);
            if (appContainer) {
                appContainer.style.pointerEvents = 'none';
                appContainer.style.opacity = '0.7';
            }
        }
    }

    function setupEventListeners() {
        console.log("App: Setting up listeners...");

        // Header Controls
        headerControls.themeToggle?.addEventListener('click', handleThemeToggle);
        headerControls.fontIncrease?.addEventListener('click', handleFontIncrease);
        headerControls.fontDecrease?.addEventListener('click', handleFontDecrease);
        headerControls.exportBtn?.addEventListener('click', handleExportData);
        headerControls.importInput?.addEventListener('change', handleImportData);

        // View Action Buttons (Direct)
        actionButtons.addNovel?.addEventListener('click', () => showNovelForm());
        detailElements.editBtn?.addEventListener('click', () => handleEditNovelShowForm());
        detailElements.deleteBtn?.addEventListener('click', () => handleDeleteNovel());
        detailElements.addChapterBtn?.addEventListener('click', () => {
            if (currentNovelId) showChapterForm(currentNovelId);
            else showError("Cannot add chapter: No novel selected.");
        });
        detailElements.downloadAllBtn?.addEventListener('click', handleDownloadAllChapters);

        // Form Submissions
        novelForm.form?.addEventListener('submit', handleNovelFormSubmit);
        chapterForm.form?.addEventListener('submit', handleChapterFormSubmit);

        // Back/Cancel Buttons (using delegation on appContainer)
        appContainer?.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                 const button = event.target.closest('.back-btn, .cancel-form-btn');
                 if (button) {
                     handleBackCancelClick(event, button);
                 }
            }
        });

        // Event Delegation for Lists
        lists.novel?.addEventListener('click', handleNovelListClick);
        lists.chapter?.addEventListener('click', handleChapterListClick);

        console.log("App: Listeners setup complete.");
    }

    // === IndexedDB Logic ===
    function openDB() {
        return new Promise((resolve, reject) => {
            console.log(`DB: Opening ${DB_NAME} v${DB_VERSION}...`);
            if (!window.indexedDB) { reject(new Error("IndexedDB is not supported.")); return; }
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = (e) => { console.error("DB: Open failed", e.target.error); reject(`Database error: ${e.target.error?.message || e.target.error}`); };
            request.onsuccess = (e) => { db = e.target.result; console.log("DB: Open success"); db.onerror = (ev) => { console.error("DB: Uncaught DB Error:", ev.target.error); showError(`Database error: ${ev.target.error?.message || ev.target.error}. Please refresh.`, true); }; resolve(db); };

            // --- START OF CORRECTED onupgradeneeded ---
            request.onupgradeneeded = (e) => {
                console.log('DB: Upgrading...');
                db = e.target.result;
                const tx = e.target.transaction; // Get the upgrade transaction
                if (!tx) {
                    reject(new Error("DB upgrade failed: Transaction missing."));
                    return;
                }
                try {
                    // Handle Novels Store
                    if (!db.objectStoreNames.contains(NOVELS_STORE)) {
                        db.createObjectStore(NOVELS_STORE, { keyPath: 'id', autoIncrement: true });
                        console.log(`DB: Created ${NOVELS_STORE}`);
                    }

                    // Handle Chapters Store
                    let chaptersStore; // Variable to hold the object store reference

                    // 1. Check if the store exists
                    if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
                        // 2. If not, create it
                        chaptersStore = db.createObjectStore(CHAPTERS_STORE, { keyPath: 'id', autoIncrement: true });
                        console.log(`DB: Created ${CHAPTERS_STORE}`);
                    } else {
                        // 3. If it exists, get a reference via the transaction
                        chaptersStore = tx.objectStore(CHAPTERS_STORE);
                        console.log(`DB: Found existing ${CHAPTERS_STORE}`);
                    }

                    // Now it's safe to work with chaptersStore to check/create the index
                    if (!chaptersStore.indexNames.contains(CHAPTER_NOVEL_ID_INDEX)) {
                        chaptersStore.createIndex(CHAPTER_NOVEL_ID_INDEX, 'novelId', { unique: false });
                        console.log(`DB: Created index ${CHAPTER_NOVEL_ID_INDEX} on ${CHAPTERS_STORE}`);
                    }

                } catch (err) {
                    console.error("DB: Upgrade schema error:", err);
                    // Make sure to abort the transaction on error during upgrade
                    if (tx && tx.abort) {
                        tx.abort();
                    }
                    reject(new Error(`DB upgrade failed: ${err.message || err}`)); // Pass error message
                    return; // Stop further execution in this handler
                }

                // Transaction completion/error handlers
                tx.oncomplete = () => console.log("DB: Upgrade complete.");
                tx.onerror = (ev) => {
                    console.error("DB: Upgrade tx error", ev.target.error);
                    // Reject the main promise if the transaction fails
                    reject(new Error(`DB upgrade transaction failed: ${ev.target.error?.message || ev.target.error}`));
                };
                tx.onabort = (ev) => {
                     console.error("DB: Upgrade tx aborted", ev.target.error);
                     reject(new Error(`DB upgrade transaction aborted: ${ev.target.error?.message || ev.target.error}`));
                };
            };
            // --- END OF CORRECTED onupgradeneeded ---
        });
    }
    function performDBOperation(storeNames, mode, operation) {
        // Simplified robust wrapper from previous steps
        return new Promise((resolve, reject) => {
            if (!db) return reject(new Error("DB_NOT_INITIALIZED"));
            let tx; try { tx = db.transaction(storeNames, mode); } catch (e) { console.error("DB Op TX Error:", e); return reject(e); }
            let opCompleted = false, opResult = undefined;
            tx.onerror = (e) => reject(e.target.error || 'TX_FAILED'); tx.onabort = (e) => { if (!opCompleted) reject(e.target.error || 'TX_ABORTED'); }; tx.oncomplete = () => { if (opCompleted) resolve(opResult); };
            try {
                const result = operation(tx);
                if (result?.onsuccess === null && result?.onerror === null) { result.onsuccess = (e) => { opResult = e.target.result; opCompleted = true; }; result.onerror = (e) => { console.error("DB Op Req Error:", e.target.error); opCompleted = false; }; }
                else if (result instanceof Promise) { result.then(res => { opResult = res; opCompleted = true; }).catch(err => { console.error("DB Op Promise Error:", err); opCompleted = false; reject(err); if (tx.readyState !== 'done') tx.abort(); }); }
                else { opResult = result; opCompleted = true; }
            } catch (err) { console.error("DB Op Exec Error:", err); opCompleted = false; reject(err); if (tx.readyState !== 'done') tx.abort(); }
        });
    }

    // === CRUD Functions ===
    function addNovel(novel) { return performDBOperation(NOVELS_STORE, 'readwrite', tx => tx.objectStore(NOVELS_STORE).add(novel)); }
    function getAllNovels() { return performDBOperation(NOVELS_STORE, 'readonly', tx => tx.objectStore(NOVELS_STORE).getAll()); }
    function getNovel(id) { return performDBOperation(NOVELS_STORE, 'readonly', tx => tx.objectStore(NOVELS_STORE).get(id)); }
    function updateNovel(novel) { return performDBOperation(NOVELS_STORE, 'readwrite', tx => tx.objectStore(NOVELS_STORE).put(novel)); }
    function addChapter(chapter) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => tx.objectStore(CHAPTERS_STORE).add(chapter)); }
    function getChapter(id) { return performDBOperation(CHAPTERS_STORE, 'readonly', tx => tx.objectStore(CHAPTERS_STORE).get(id)); }
    function getChaptersForNovel(novelId) { return performDBOperation(CHAPTERS_STORE, 'readonly', tx => tx.objectStore(CHAPTERS_STORE).index(CHAPTER_NOVEL_ID_INDEX).getAll(novelId)); }
    function updateChapter(chapter) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => tx.objectStore(CHAPTERS_STORE).put(chapter)); }
    function deleteChapter(id) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => tx.objectStore(CHAPTERS_STORE).delete(id)); }
    async function deleteNovelAndChapters(novelId) {
        console.log(`DB: Deleting novel ${novelId} & chapters...`);
        return performDBOperation([NOVELS_STORE, CHAPTERS_STORE], 'readwrite', (tx) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const chapStore = tx.objectStore(CHAPTERS_STORE); const novelStore = tx.objectStore(NOVELS_STORE);
                    const keysReq = chapStore.index(CHAPTER_NOVEL_ID_INDEX).getAllKeys(IDBKeyRange.only(novelId));
                    const keys = await new Promise((res, rej) => { keysReq.onsuccess = e => res(e.target.result); keysReq.onerror = e => rej(e.target.error); });
                    const delChapPromises = keys.map(key => new Promise((res, rej) => { const r = chapStore.delete(key); r.onsuccess = res; r.onerror = rej; }));
                    const delNovelPromise = new Promise((res, rej) => { const r = novelStore.delete(novelId); r.onsuccess = res; r.onerror = rej; });
                    await Promise.all([...delChapPromises, delNovelPromise]);
                    console.log(`DB: Queued deletion novel ${novelId}, ${keys.length} chapters.`); resolve(true);
                } catch (error) { reject(error); }
            });
        });
    }
    async function clearStaleLastRead(novelId) {
        console.log(`DB: Checking stale lastRead for novel ${novelId}.`);
        try {
            const novel = await getNovel(novelId);
            if (novel?.lastReadChapterId) {
                const chapterReq = db.transaction(CHAPTERS_STORE,'readonly').objectStore(CHAPTERS_STORE).get(novel.lastReadChapterId);
                const exists = await new Promise((res, rej) => { chapterReq.onsuccess = e => res(e.target.result); chapterReq.onerror = e => rej(e.target.error); });
                if (!exists) { console.log(`DB: Stale lastRead ${novel.lastReadChapterId} found. Clearing.`); novel.lastReadChapterId = null; await updateNovel(novel); }
                else { console.log(`DB: lastRead ${novel.lastReadChapterId} valid.`); }
            }
        } catch (error) { console.error(`DB: Error clearing stale lastRead for ${novelId}:`, error); }
    }
    async function markChapterAsLastRead(novelId, chapterId) {
        if (!novelId || !chapterId) return;
        console.log(`DB: Mark chapter ${chapterId} last read for novel ${novelId}`);
        try {
            const novel = await getNovel(novelId);
            if (novel && novel.lastReadChapterId !== chapterId) {
                novel.lastReadChapterId = chapterId; await updateNovel(novel);
                console.log(`DB: Marked chapter ${chapterId} last read.`);
                if (currentView === 'detail' && currentNovelId === novelId) { await renderChapterList(novelId, chapterId); await renderContinueReadingButton(novel); }
            } else if (!novel) { console.warn(`DB: Novel ${novelId} not found for markChapterAsLastRead.`); }
        } catch (err) { console.error("DB: Failed mark chapter last read:", err); }
    }

    // === UI Rendering Functions ===

    // --- Includes fix for author position ---
    async function renderNovelList() {
        console.log("UI: Rendering novel list...");
        if (!lists.novel) { console.error("UI Error: Novel list UL not found!"); return; }
        lists.novel.innerHTML = '<li class="placeholder" role="listitem">Loading novels...</li>';
        showError(null);
        try {
            const novels = await getAllNovels();
            console.log(`UI: Fetched ${novels?.length ?? 0} novels.`);
            lists.novel.innerHTML = '';
            if (!novels || novels.length === 0) { lists.novel.innerHTML = '<li class="placeholder" role="listitem">No novels found. Add one!</li>'; return; }
            novels.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            const fragment = document.createDocumentFragment();
            novels.forEach(novel => {
                const li = document.createElement('li'); li.dataset.novelId = novel.id; li.setAttribute('role', 'listitem');
                const novelInfoDiv = document.createElement('div'); novelInfoDiv.className = 'novel-info';
                const titleSpan = document.createElement('span'); titleSpan.className = 'title'; titleSpan.textContent = novel.title || 'Untitled Novel';
                const titleLink = document.createElement('a'); titleLink.href = '#'; titleLink.className = 'novel-title-link'; titleLink.dataset.novelId = novel.id;
                titleLink.appendChild(titleSpan);
                novelInfoDiv.appendChild(titleLink);
                if (novel.author) { const authorSpan = document.createElement('span'); authorSpan.className = 'author'; authorSpan.textContent = `by ${novel.author}`; novelInfoDiv.appendChild(authorSpan); }
                const actionsDiv = document.createElement('div'); actionsDiv.className = 'list-item-actions';
                const safeTitle = (novel.title || 'Untitled Novel').replace(/"/g, '"');
                actionsDiv.innerHTML = `<button type="button" class="edit-novel-btn small-btn" data-novel-id="${novel.id}" title="Edit Info" aria-label="Edit ${safeTitle} Info">Edit</button> <button type="button" class="delete-novel-btn danger small-btn" data-novel-id="${novel.id}" data-novel-title="${safeTitle}" title="Delete Novel" aria-label="Delete ${safeTitle}">Delete</button>`;
                li.appendChild(novelInfoDiv); li.appendChild(actionsDiv); fragment.appendChild(li);
            });
            lists.novel.appendChild(fragment);
            console.log("UI: Novel list rendered.");
        } catch (error) { console.error('UI: Error rendering novel list:', error); lists.novel.innerHTML = '<li class="placeholder error" role="listitem">Error loading novels.</li>'; showError("Failed to load novel list."); }
    }

    async function renderNovelDetail(novelId) {
        console.log(`UI: Rendering detail for novel ${novelId}`);
        if (!detailElements.title) { console.error("UI Error: Detail view elements missing!"); return; }
        detailElements.title.textContent = 'Loading...'; detailElements.author.textContent = '...'; detailElements.genre.textContent = '...'; detailElements.description.textContent = ''; detailElements.continueReading.innerHTML = ''; lists.chapter.innerHTML = '<li class="placeholder" role="listitem">Loading chapters...</li>';
        showError(null);
        try {
            const novel = await getNovel(novelId);
            if (!novel) { console.warn(`UI: Novel ${novelId} not found.`); showError(`Novel not found.`); currentNovelId = null; await renderNovelList(); showView('list'); return; }
            currentNovelId = novelId;
            detailElements.title.textContent = novel.title || 'Untitled Novel'; detailElements.author.textContent = novel.author || 'N/A'; detailElements.genre.textContent = novel.genre || 'N/A'; detailElements.description.textContent = novel.description || 'No description.';
            await clearStaleLastRead(novel.id);
            const updatedNovel = await getNovel(novel.id);
            if (!updatedNovel) { console.warn(`UI: Novel ${novelId} disappeared.`); showError(`Novel data unavailable.`); currentNovelId = null; await renderNovelList(); showView('list'); return; }
            await renderContinueReadingButton(updatedNovel); await renderChapterList(novelId, updatedNovel.lastReadChapterId);
            console.log("UI: Novel detail rendered.");
        } catch (error) { console.error(`UI: Error rendering novel detail ${novelId}:`, error); showError(`Failed load novel details: ${error.message}`); currentNovelId = null; await renderNovelList(); showView('list'); }
    }
    async function renderContinueReadingButton(novel) {
        if (!detailElements.continueReading) return; detailElements.continueReading.innerHTML = '';
        if (novel?.lastReadChapterId) {
            try {
                const lastChapter = await getChapter(novel.lastReadChapterId);
                if (lastChapter) { const btn = document.createElement('button'); btn.id = 'continue-reading-btn'; btn.type = 'button'; btn.className = 'primary-action small-btn'; btn.textContent = `Continue Reading: "${lastChapter.title || 'Last Chapter'}"`; btn.dataset.chapterId = lastChapter.id; btn.addEventListener('click', () => showChapterView(lastChapter.id)); detailElements.continueReading.appendChild(btn); }
            } catch (err) { console.warn("UI: Could not fetch last read chapter details:", err); }
        }
    }
    async function renderChapterList(novelId, lastReadChapterId = null) {
        console.log(`UI: Rendering chapter list for novel ${novelId}`);
        if (!lists.chapter) { console.error("UI Error: Chapter list UL not found!"); return; }
        lists.chapter.innerHTML = '<li class="placeholder" role="listitem">Loading chapters...</li>';
        try {
            const chapters = await getChaptersForNovel(novelId); console.log(`UI: Fetched ${chapters?.length ?? 0} chapters.`); lists.chapter.innerHTML = '';
            if (!chapters || chapters.length === 0) { lists.chapter.innerHTML = '<li class="placeholder" role="listitem">No chapters added yet.</li>'; return; }
            chapters.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            const fragment = document.createDocumentFragment();
            chapters.forEach(chapter => {
                const li = document.createElement('li'); li.dataset.chapterId = chapter.id; li.setAttribute('role', 'listitem'); if (lastReadChapterId && chapter.id === lastReadChapterId) li.classList.add('last-read');
                const safeTitle = (chapter.title || 'Untitled Chapter').replace(/"/g, '"');
                const link = document.createElement('a'); link.href = '#'; link.className = 'chapter-title-link'; link.dataset.chapterId = chapter.id; link.textContent = safeTitle;
                const actionsDiv = document.createElement('div'); actionsDiv.className = 'list-item-actions';
                actionsDiv.innerHTML = `<button type="button" class="download-chapter-btn small-btn" data-chapter-id="${chapter.id}" title="Download Chapter" aria-label="Download ${safeTitle}">↓</button> <button type="button" class="edit-chapter-btn small-btn" data-chapter-id="${chapter.id}" title="Edit Chapter" aria-label="Edit ${safeTitle}">Edit</button> <button type="button" class="delete-chapter-btn danger small-btn" data-chapter-id="${chapter.id}" data-chapter-title="${safeTitle}" title="Delete Chapter" aria-label="Delete ${safeTitle}">Delete</button>`;
                li.appendChild(link); li.appendChild(actionsDiv); fragment.appendChild(li);
            });
            lists.chapter.appendChild(fragment); console.log("UI: Chapter list rendered.");
        } catch (error) { console.error(`UI: Error rendering chapter list ${novelId}:`, error); lists.chapter.innerHTML = '<li class="placeholder error" role="listitem">Error loading chapters.</li>'; showError("Failed load chapter list."); }
    }
    async function renderChapterView(chapterId) {
        console.log(`UI: Rendering chapter view ${chapterId}`);
        if (!readElements.title || !readElements.content) { console.error("UI Error: Chapter read elements missing!"); return; }
        readElements.title.textContent = "Loading..."; readElements.content.textContent = ""; showError(null);
        try {
            const chapter = await getChapter(chapterId);
            if (!chapter) { console.warn(`UI: Chapter ${chapterId} not found.`); showError(`Chapter not found.`); if (currentNovelId) { await renderNovelDetail(currentNovelId); showView('detail'); } else { await renderNovelList(); showView('list'); } return; }
            readElements.title.textContent = chapter.title || 'Untitled Chapter'; readElements.content.textContent = chapter.content || '(No content)';
            if (chapter.novelId) markChapterAsLastRead(chapter.novelId, chapter.id);
            console.log("UI: Chapter view rendered.");
        } catch (error) { console.error(`UI: Error rendering chapter view ${chapterId}:`, error); readElements.title.textContent = "Error"; readElements.content.textContent = "Could not load chapter."; showError(`Failed load chapter: ${error.message}`); }
    }

    // === View Switching & Navigation ===
    function showView(viewId) { // viewId should be 'list', 'detail', etc.
        const targetViewKey = viewId; // Assume valid key passed
        if (!views[targetViewKey]) { console.error(`View: Invalid view key '${viewId}'. Defaulting to list.`); viewId = 'list'; targetViewKey = 'list'; }
        console.log(`View: Switching to '${viewId}'`); currentView = viewId;
        Object.entries(views).forEach(([key, viewElement]) => { if (viewElement) { const isActive = key === viewId; viewElement.classList.toggle('active', isActive); viewElement.hidden = !isActive; viewElement.setAttribute('aria-hidden', String(!isActive)); } });
        const targetViewElement = views[viewId];
        if (targetViewElement) { const focusTarget = targetViewElement.querySelector('h2, h3') || targetViewElement.querySelector('.primary-action') || targetViewElement; if (focusTarget?.focus) setTimeout(() => focusTarget.focus({ preventScroll: true }), 50); }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Includes fix for back button logic ---
    async function handleBackCancelClick(event, button) {
        event.preventDefault();
        const targetViewAttr = button.dataset.targetView; // 'novel-list', 'novel-detail' etc. from HTML
        // Convert HTML attribute value to view key ('list', 'detail')
        const targetViewId = targetViewAttr?.startsWith('novel-') ? targetViewAttr.split('-')[1] : targetViewAttr;

        console.log(`View: Back/Cancel clicked, targetViewAttr: '${targetViewAttr}', resolved targetViewId: '${targetViewId}', currentNovelId: ${currentNovelId}`);

        if (!targetViewId || !views[targetViewId]) { // Check if resolved key is valid
             console.warn(`View: Back/Cancel target resolved to invalid key '${targetViewId}'. Defaulting to list.`);
             await renderNovelList(); showView('list'); return;
        }

        button.disabled = true;
        try {
            if (targetViewId === 'detail') {
                if (currentNovelId) { console.log(`View: Navigating back to detail view for novel ${currentNovelId}`); await renderNovelDetail(currentNovelId); showView('detail'); }
                else { console.warn("View: Back target 'detail', but currentNovelId missing. Going list."); await renderNovelList(); showView('list'); }
            }
            else if (targetViewId === 'list') { console.log("View: Navigating back to list view."); await renderNovelList(); showView('list'); }
            else { console.log(`View: Navigating back to other view: ${targetViewId}`); showView(targetViewId); } // Navigate to other valid views like forms
        } catch (error) { console.error("Error during back/cancel nav:", error); showError("Navigation failed."); await renderNovelList(); showView('list'); }
        finally { button.disabled = false; }
    }

    async function showNovelDetailView(novelId) { if (!novelId) return; console.log(`View: Nav to detail ${novelId}`); try { await renderNovelDetail(novelId); showView('detail'); } catch (err) { console.error("View: Failed show detail:", err); } }
    async function showChapterView(chapterId) { if (!chapterId) return; console.log(`View: Nav to read ${chapterId}`); try { await renderChapterView(chapterId); showView('read'); } catch (err) { console.error("View: Failed show chapter:", err); } }
    function showNovelForm(novelToEdit = null) { console.log("UI: Show novel form", novelToEdit ? `(Edit ${novelToEdit.id})` : '(Add)'); if (!novelForm.form) return; novelForm.form.reset(); novelForm.editId.value = ''; showError(null); if (novelToEdit) { novelForm.title.textContent = 'Edit Novel'; novelForm.editId.value = novelToEdit.id; novelForm.titleInput.value = novelToEdit.title || ''; novelForm.authorInput.value = novelToEdit.author || ''; novelForm.genreInput.value = novelToEdit.genre || ''; novelForm.descriptionTextarea.value = novelToEdit.description || ''; novelForm.cancelBtn.dataset.targetView = 'novel-detail'; novelForm.saveBtn.textContent = 'Update Novel'; } else { novelForm.title.textContent = 'Add New Novel'; novelForm.cancelBtn.dataset.targetView = 'novel-list'; novelForm.saveBtn.textContent = 'Save Novel'; } showView('novelForm'); novelForm.titleInput.focus(); }
    function showChapterForm(novelId, chapterToEdit = null) { if (!novelId) { showError("Novel ID missing."); return; } if (!chapterForm.form) return; console.log("UI: Show chapter form", chapterToEdit ? `(Edit ${chapterToEdit.id})` : `(Add to ${novelId})`); chapterForm.form.reset(); chapterForm.editId.value = ''; chapterForm.novelIdInput.value = novelId; showError(null); if (chapterToEdit) { chapterForm.title.textContent = 'Edit Chapter'; chapterForm.editId.value = chapterToEdit.id; chapterForm.titleInput.value = chapterToEdit.title || ''; chapterForm.contentTextarea.value = chapterToEdit.content || ''; chapterForm.saveBtn.textContent = 'Update Chapter'; } else { chapterForm.title.textContent = 'Add New Chapter'; chapterForm.saveBtn.textContent = 'Save Chapter'; } chapterForm.cancelBtn.dataset.targetView = 'novel-detail'; showView('chapterForm'); chapterForm.titleInput.focus(); }

    // === Event Handlers ===
    function handleNovelListClick(event) { const link = event.target.closest('a.novel-title-link'); const editBtn = event.target.closest('button.edit-novel-btn'); const deleteBtn = event.target.closest('button.delete-novel-btn'); if (link) { event.preventDefault(); const id = parseInt(link.dataset.novelId, 10); if (id) showNovelDetailView(id); } else if (editBtn) { const id = parseInt(editBtn.dataset.novelId, 10); if (id) handleEditNovelShowForm(id); } else if (deleteBtn) { const id = parseInt(deleteBtn.dataset.novelId, 10); const title = deleteBtn.dataset.novelTitle || 'this novel'; if (id) handleDeleteNovel(id, title); } }
    async function handleChapterListClick(event) { const target = event.target; const link = target.closest('a.chapter-title-link'); const downloadBtn = target.closest('button.download-chapter-btn'); const editBtn = target.closest('button.edit-chapter-btn'); const deleteBtn = target.closest('button.delete-chapter-btn'); const li = target.closest('li[data-chapter-id]'); if (!li) return; const id = parseInt(li.dataset.chapterId, 10); if (!id) return; if (link) { event.preventDefault(); showChapterView(id); } else if (downloadBtn) { event.preventDefault(); showError(null); console.log(`UI: Download chapter ${id}`); downloadBtn.disabled = true; try { const chapter = await getChapter(id); if (chapter?.novelId) { const novel = await getNovel(chapter.novelId); const filename = sanitizeFilename(`${novel?.title || 'n'}_ch_${chapter.title || id}.txt`); triggerTextDownload(chapter.content || '', filename); } else if (chapter) { const filename = sanitizeFilename(`ch_${chapter.title || id}.txt`); triggerTextDownload(chapter.content || '', filename); } else { showError("Chapter not found."); } } catch (e) { console.error("UI: DL error:", e); showError("DL failed."); } finally { downloadBtn.disabled = false; } } else if (editBtn) { event.preventDefault(); if (!currentNovelId) { showError("Novel context lost."); return; } showError(null); editBtn.disabled = true; try { const chapter = await getChapter(id); if (chapter) { showChapterForm(currentNovelId, chapter); } else { showError("Chapter not found."); await renderChapterList(currentNovelId, null); } } catch (e) { console.error("UI: Edit error:", e); showError("Load failed."); } finally { editBtn.disabled = false; } } else if (deleteBtn) { event.preventDefault(); const title = deleteBtn.dataset.chapterTitle || 'this chapter'; if (confirm(`Delete chapter "${title}"?`)) { showError(null); deleteBtn.disabled = true; li.style.opacity = '0.5'; try { await deleteChapter(id); console.log(`UI: Deleted chapter ${id}`); li.remove(); const novel = await getNovel(currentNovelId); let refreshContinue = false; if (novel?.lastReadChapterId === id) { await clearStaleLastRead(currentNovelId); refreshContinue = true; } if (refreshContinue) { const updatedNovel = await getNovel(currentNovelId); await renderContinueReadingButton(updatedNovel); } if (lists.chapter && !lists.chapter.querySelector('li')) { lists.chapter.innerHTML = '<li class="placeholder">No chapters added.</li>'; } showSuccess(`Chapter "${title}" deleted.`); } catch (e) { console.error("UI: Delete error:", e); showError("Delete failed."); li.style.opacity = '1'; deleteBtn.disabled = false; } } } }
    function handleThemeToggle() { const isDark = document.body.classList.contains('dark-mode'); applyTheme(isDark ? 'light' : 'dark'); }
    function handleFontIncrease() { applyFontSize(currentFontSize + 1); }
    function handleFontDecrease() { applyFontSize(currentFontSize - 1); }
    async function handleEditNovelShowForm(novelId = null) { const id = novelId || currentNovelId; if (!id) { showError("No novel selected."); return; } showError(null); const btn = novelId ? document.querySelector(`.edit-novel-btn[data-novel-id="${id}"]`) : detailElements.editBtn; if (btn) btn.disabled = true; try { const novel = await getNovel(id); if (novel) { showNovelForm(novel); } else { showError("Novel not found."); if (novelId) await renderNovelList(); } } catch (e) { console.error("UI: Edit fetch error:", e); showError("Load failed."); } finally { if (btn) btn.disabled = false; } }
    async function handleDeleteNovel(novelId = null, novelTitle = null) { const id = novelId || currentNovelId; if (!id) { showError("No novel selected."); return; } let title = novelTitle; if (!title) { try { const n = await getNovel(id); title = n?.title || 'this novel'; } catch { title = 'this novel'; } } if (confirm(`⚠️ DELETE "${title}" & ALL chapters?\n\nCannot be undone.`)) { console.log(`UI: Deleting novel ${id}`); showError(null); const btns = document.querySelectorAll(`.delete-novel-btn[data-novel-id="${id}"]`); btns.forEach(b => b.disabled = true); if (detailElements.deleteBtn && currentNovelId === id) detailElements.deleteBtn.disabled = true; try { await deleteNovelAndChapters(id); console.log(`UI: Deletion complete ${id}.`); if (currentNovelId === id) currentNovelId = null; await renderNovelList(); showView('list'); showSuccess(`Novel "${title}" deleted.`); } catch (error) { console.error("UI: Delete novel error:", error); showError(`Delete failed: ${error.message || error}`); btns.forEach(b => b.disabled = false); if (detailElements.deleteBtn && currentNovelId === id) detailElements.deleteBtn.disabled = false; await renderNovelList(); showView('list'); } } else { console.log("UI: Deletion cancelled."); } }
    async function handleNovelFormSubmit(event) { event.preventDefault(); if (!novelForm.form) return; const form = novelForm.form; const saveBtn = novelForm.saveBtn; const fd = new FormData(form); const data = { title: fd.get('title')?.trim() || '', author: fd.get('author')?.trim() || '', genre: fd.get('genre')?.trim() || '', description: fd.get('description')?.trim() || '', }; if (!data.title) { showError("Title required."); novelForm.titleInput?.focus(); return; } const editId = fd.get('editId'); showError(null); if(saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; } try { if (editId) { data.id = parseInt(editId, 10); const existing = await getNovel(data.id); if (!existing) throw new Error("Novel not found."); data.lastReadChapterId = existing.lastReadChapterId || null; await updateNovel(data); console.log(`UI: Updated novel ${data.id}`); showSuccess(`Novel "${data.title}" updated.`); await renderNovelDetail(data.id); showView('detail'); } else { data.lastReadChapterId = null; const newId = await addNovel(data); console.log(`UI: Added novel ${newId}`); showSuccess(`Novel "${data.title}" added.`); await renderNovelList(); showView('list'); } form.reset(); } catch (e) { console.error("UI: Save novel error:", e); showError(`Save failed: ${e.message || e}`); } finally { if(saveBtn) { saveBtn.disabled = false; saveBtn.textContent = editId ? 'Update Novel' : 'Save Novel'; } } }
    async function handleChapterFormSubmit(event) { event.preventDefault(); if (!chapterForm.form) return; const form = chapterForm.form; const saveBtn = chapterForm.saveBtn; const fd = new FormData(form); const data = { novelId: parseInt(fd.get('novelId'), 10), title: fd.get('title')?.trim() || '', content: fd.get('content') || '', }; if (!data.novelId || !data.title) { showError("Title required."); chapterForm.titleInput?.focus(); return; } if (!data.content?.trim() && !confirm("Content empty. Save anyway?")) { chapterForm.contentTextarea?.focus(); return; } const editId = fd.get('editId'); showError(null); if(saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; } const returnId = data.novelId; try { if (editId) { data.id = parseInt(editId, 10); await updateChapter(data); console.log(`UI: Updated chapter ${data.id}`); showSuccess(`Chapter "${data.title}" updated.`); } else { const newId = await addChapter(data); console.log(`UI: Added chapter ${newId} to novel ${data.novelId}`); showSuccess(`Chapter "${data.title}" added.`); } form.reset(); await renderNovelDetail(returnId); showView('detail'); } catch (e) { console.error("UI: Save chapter error:", e); showError(`Save failed: ${e.message || e}`); } finally { if(saveBtn) { saveBtn.disabled = false; saveBtn.textContent = editId ? 'Update Chapter' : 'Save Chapter'; } } }

    // --- Import / Export / Download All Handlers ---
    async function handleExportData() { if (typeof CompressionStream === "undefined") { if (!confirm("Compression unsupported. Export uncompressed?")) return; await exportDataUncompressed(); return; } if (!confirm("Create compressed backup? (.json.gz)")) return; showError(null); if(headerControls.exportBtn) { headerControls.exportBtn.disabled = true; headerControls.exportBtn.textContent = 'Exporting...'; } try { const [novels, chapters] = await Promise.all([ getAllNovels(), performDBOperation(CHAPTERS_STORE, 'readonly', tx => tx.objectStore(CHAPTERS_STORE).getAll()) ]); if (!novels?.length && !chapters?.length) { alert("Nothing to export."); return; } const exportData = { exportFormatVersion: 2, timestamp: new Date().toISOString(), data: { novels, chapters } }; const jsonString = JSON.stringify(exportData); const stream = new Blob([new TextEncoder().encode(jsonString)]).stream(); const compressedStream = stream.pipeThrough(new CompressionStream('gzip')); const compressedBlob = await new Response(compressedStream).blob(); const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); const filename = `novelReaderBackup_${dateStr}.json.gz`; triggerBlobDownload(compressedBlob, filename); showSuccess("Backup exported."); } catch (e) { console.error('Export error:', e); showError(`Export failed: ${e.message || e}`); } finally { if(headerControls.exportBtn) { headerControls.exportBtn.disabled = false; headerControls.exportBtn.textContent = 'Export'; } } }
    async function exportDataUncompressed() { showError(null); if(headerControls.exportBtn) { headerControls.exportBtn.disabled = true; headerControls.exportBtn.textContent = 'Exporting...'; } try { const [novels, chapters] = await Promise.all([ getAllNovels(), performDBOperation(CHAPTERS_STORE, 'readonly', tx => tx.objectStore(CHAPTERS_STORE).getAll()) ]); if (!novels?.length && !chapters?.length) { alert("Nothing to export."); return; } const exportData = { exportFormatVersion: 1, timestamp: new Date().toISOString(), data: { novels, chapters } }; const jsonString = JSON.stringify(exportData, null, 2); const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); const filename = `novelReaderBackup_${dateStr}_uncompressed.json`; triggerTextDownload(jsonString, filename); showSuccess("Uncompressed backup exported."); } catch (e) { console.error('Uncompressed export error:', e); showError(`Export failed: ${e.message || e}`); } finally { if(headerControls.exportBtn) { headerControls.exportBtn.disabled = false; headerControls.exportBtn.textContent = 'Export'; } } }
    async function handleImportData(event) { const file = event.target.files[0]; if (!file || !headerControls.importInput || !headerControls.importLabel) return; const isCompressed = file.name.endsWith('.gz'); if (isCompressed && typeof DecompressionStream === "undefined") { showError("Decompression unsupported."); headerControls.importInput.value = ''; return; } if (!confirm(`⚠️ WARNING: DELETE ALL data & replace with "${file.name}"?\n\nCannot be undone.`)) { headerControls.importInput.value = ''; return; } showError(null); showSuccess("Importing...", true); headerControls.importLabel.style.pointerEvents = 'none'; headerControls.importLabel.style.opacity = '0.6'; try { let jsonString; if (isCompressed) { const ds = new DecompressionStream('gzip'); const dStream = file.stream().pipeThrough(ds); jsonString = await new Response(dStream).text(); } else { jsonString = await file.text(); } const importedData = JSON.parse(jsonString); if (!importedData?.data?.novels || !Array.isArray(importedData.data.novels) || !importedData.data.chapters || !Array.isArray(importedData.data.chapters)) throw new Error("Invalid backup structure."); const novelsToImport = importedData.data.novels; const chaptersToImport = importedData.data.chapters; console.log(`Import: Parsed ${novelsToImport.length} novels, ${chaptersToImport.length} chapters.`); console.log(`Import: Clearing existing data...`); await performDBOperation([NOVELS_STORE, CHAPTERS_STORE], 'readwrite', async tx => { const clN = new Promise((r,j)=>{const q=tx.objectStore(NOVELS_STORE).clear(); q.onsuccess=r; q.onerror=j;}); const clC = new Promise((r,j)=>{const q=tx.objectStore(CHAPTERS_STORE).clear(); q.onsuccess=r; q.onerror=j;}); await Promise.all([clN, clC]); }); console.log("Import: Data cleared."); const novelIdMap = new Map(); const chapterIdMap = new Map(); const newNovelsData = new Map(); let novelsAdded = 0, novelsSkipped = 0; console.log("Import: Importing novels..."); for (const novel of novelsToImport) { const oldId = novel.id; if (oldId === undefined || oldId === null) { novelsSkipped++; continue; } const { id, lastReadChapterId, ...addData } = novel; try { addData.lastReadChapterId = null; const newId = await addNovel(addData); novelIdMap.set(oldId, newId); newNovelsData.set(newId, { originalLastReadChapterId: lastReadChapterId, title: novel.title }); novelsAdded++; } catch (err) { novelsSkipped++; console.error(`Novel import fail ${oldId}:`, err); } } console.log(`Import: Novels - Added:${novelsAdded}, Skipped:${novelsSkipped}`); let chaptersAdded = 0, chaptersSkipped = 0; console.log("Import: Importing chapters..."); for (const chapter of chaptersToImport) { const oldChapId = chapter.id; const oldNovId = chapter.novelId; if (oldChapId === undefined || oldChapId === null) { chaptersSkipped++; continue; } const newNovId = novelIdMap.get(oldNovId); if (newNovId === undefined) { chaptersSkipped++; console.warn(`Chap skip ${oldChapId} - Novel map missing ${oldNovId}`); continue; } const { id, novelId, ...addData } = chapter; const chapToAdd = { ...addData, novelId: newNovId }; try { const newChapId = await addChapter(chapToAdd); chapterIdMap.set(oldChapId, newChapId); chaptersAdded++; } catch (err) { chaptersSkipped++; console.error(`Chap import fail ${oldChapId}:`, err); } } console.log(`Import: Chapters - Added:${chaptersAdded}, Skipped:${chaptersSkipped}`); let lastReadUpdated = 0, lastReadFailed = 0; console.log("Import: Updating lastRead..."); for (const [newNovId, novelInfo] of newNovelsData.entries()) { const oldLastReadId = novelInfo.originalLastReadChapterId; if (oldLastReadId !== undefined && oldLastReadId !== null) { const newLastReadId = chapterIdMap.get(oldLastReadId); if (newLastReadId !== undefined) { try { const novelRec = await getNovel(newNovId); if (novelRec) { novelRec.lastReadChapterId = newLastReadId; await updateNovel(novelRec); lastReadUpdated++; } else { lastReadFailed++; } } catch (err) { lastReadFailed++; console.error(`LastRead update fail ${newNovId}:`, err); } } else { lastReadFailed++; console.warn(`No chapter map for oldLastRead ${oldLastReadId}`); } } } console.log(`Import: LastRead - Updated:${lastReadUpdated}, Failed:${lastReadFailed}`); showSuccess(`Import Complete! ${novelsAdded} novels, ${chaptersAdded} chapters. ${lastReadUpdated} last read updated.`); await renderNovelList(); showView('list'); } catch (error) { console.error('Import error:', error); showError(`Import FAILED: ${error.message || error}. Check console.`, true); await renderNovelList(); showView('list'); } finally { headerControls.importInput.value = ''; headerControls.importLabel.style.pointerEvents = 'auto'; headerControls.importLabel.style.opacity = '1'; } }
    async function handleDownloadAllChapters() { if (!currentNovelId) { showError("No novel selected."); return; } if (!detailElements.downloadAllBtn) return; showError(null); console.log(`UI: Bulk download novel ${currentNovelId}`); detailElements.downloadAllBtn.disabled = true; detailElements.downloadAllBtn.textContent = 'Preparing...'; try { const [novel, chapters] = await Promise.all([ getNovel(currentNovelId), getChaptersForNovel(currentNovelId) ]); if (!novel) { showError("Novel not found."); return; } if (!chapters || chapters.length === 0) { showError("No chapters found."); return; } chapters.sort((a, b) => (a.title || '').localeCompare(b.title || '')); let bulkContent = `Novel: ${novel.title || 'Untitled'}\nAuthor: ${novel.author || 'N/A'}\nGenre: ${novel.genre || 'N/A'}\n\n====================\n\n`; chapters.forEach((ch, i) => { bulkContent += `Chapter ${i + 1}: ${ch.title || 'Untitled'}\n--------------------\n\n${ch.content || '(No Content)'}\n\n====================\n\n`; }); const filename = sanitizeFilename(`${novel.title || 'n_' + novel.id}_all.txt`); triggerTextDownload(bulkContent, filename); showSuccess("Bulk download started."); } catch (e) { console.error("UI: Bulk DL error:", e); showError("Bulk DL failed."); } finally { detailElements.downloadAllBtn.disabled = false; detailElements.downloadAllBtn.textContent = 'Download All'; } }

    // --- Preferences ---
    function applyTheme(theme) { const isDark = theme === 'dark'; document.body.classList.toggle('dark-mode', isDark); if(headerControls.themeToggle) { headerControls.themeToggle.textContent = isDark ? '☀️' : '🌙'; headerControls.themeToggle.title = isDark ? 'Light Mode' : 'Dark Mode'; } try { localStorage.setItem('novelReaderTheme', theme); } catch (e) { console.warn("Pref: Save theme fail.", e); } }
    function applyFontSize(size) { const newSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size)); if (newSize !== currentFontSize && appContainer && headerControls.fontSizeDisplay) { appContainer.style.fontSize = `${newSize}px`; currentFontSize = newSize; headerControls.fontSizeDisplay.textContent = newSize; try { localStorage.setItem('novelReaderFontSize', newSize); } catch (e) { console.warn("Pref: Save font size fail.", e); } } if(headerControls.fontDecrease) headerControls.fontDecrease.disabled = (newSize <= MIN_FONT_SIZE); if(headerControls.fontIncrease) headerControls.fontIncrease.disabled = (newSize >= MAX_FONT_SIZE); }
    function loadPreferences() { console.log("Pref: Loading..."); let theme = 'light', size = DEFAULT_FONT_SIZE; try { theme = localStorage.getItem('novelReaderTheme') || 'light'; size = parseInt(localStorage.getItem('novelReaderFontSize') || DEFAULT_FONT_SIZE.toString(), 10); if (isNaN(size)) size = DEFAULT_FONT_SIZE; } catch (e) { console.warn("Pref: Load fail.", e); } applyTheme(theme); applyFontSize(size); }

    // === Utility Functions ===
    let messageTimeout;
    function showError(message, isSticky = false) { showMessage(message, 'error', isSticky); }
    function showSuccess(message, isSticky = false) { showMessage(message, 'success', isSticky); }
    function showMessage(message, type = 'error', isSticky = false) { if (!errorDisplay) return; clearTimeout(messageTimeout); const isError = type === 'error'; errorDisplay.classList.toggle('error-box', isError); errorDisplay.classList.toggle('success-box', !isError); if (message) { const logFn = isError ? console.error : console.log; logFn(`${type.toUpperCase()} Displayed:`, message); errorDisplay.textContent = message; errorDisplay.hidden = false; errorDisplay.setAttribute('aria-live', isError ? 'assertive' : 'polite'); if (!isSticky) { const duration = isError ? 5000 : 3000; messageTimeout = setTimeout(() => { errorDisplay.hidden = true; errorDisplay.textContent = ''; errorDisplay.setAttribute('aria-live', 'off'); errorDisplay.classList.remove('error-box', 'success-box'); }, duration); } } else { errorDisplay.hidden = true; errorDisplay.textContent = ''; errorDisplay.setAttribute('aria-live', 'off'); errorDisplay.classList.remove('error-box', 'success-box'); } }
    function sanitizeFilename(name) { if (!name) return 'download'; let s = name.replace(/[/\\?%*:|"<>]/g, '_').replace(/[\s_]+/g, '_').replace(/^_+|_+$/g, ''); s = s.substring(0, 100); return (s && s !== '.' && s !== '..') ? s : 'download'; }
    function triggerTextDownload(content, filename) { const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); triggerBlobDownload(blob, filename); }
    function triggerBlobDownload(blob, filename) { try { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100); console.log(`Download triggered: ${filename} (${blob.size} bytes)`); } catch (e) { console.error("DL trigger error:", e); showError("DL failed."); } }

    // --- Start the App ---
    initializeApp();

}); // End DOMContentLoaded