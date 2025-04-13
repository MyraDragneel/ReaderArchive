/**
 * Simple Novel Reader PWA Script (Optimized Version)
 * Features: CRUD for Novels/Chapters, IndexedDB, Light/Dark Mode, Font Size,
 * Import/Export (w/ relationship fix), Last Read Chapter, Event Delegation, Animations.
 * Fixes: Delete redirect, Stale 'Continue' button, Font consistency.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing app...");

    // --- Essential DOM Elements ---
    const appContainer = document.getElementById('app-container');
    const errorDisplay = document.getElementById('error-display');
    // Views
    const novelListView = document.getElementById('view-novel-list');
    const novelDetailView = document.getElementById('view-novel-detail');
    const chapterReadView = document.getElementById('view-chapter-read');
    const novelFormView = document.getElementById('view-novel-form');
    const chapterFormView = document.getElementById('view-chapter-form');
    const allViews = document.querySelectorAll('.view'); // Use querySelectorAll for easier iteration
    // Lists
    const novelListUl = document.getElementById('novel-list-ul');
    const chapterListUl = document.getElementById('chapter-list-ul');
    // Header Controls
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const fontDecreaseBtn = document.getElementById('font-decrease-btn');
    const fontIncreaseBtn = document.getElementById('font-increase-btn');
    const fontSizeDisplay = document.getElementById('font-size-display');
    const exportBtn = document.getElementById('export-data-btn');
    const importLabel = document.querySelector('.import-button');
    const importFileInput = document.getElementById('import-file-input');
    // Novel Detail Elements
    const detailNovelTitleH2 = document.getElementById('detail-novel-title-h2');
    const detailNovelAuthorSpan = document.getElementById('detail-novel-author-span');
    const detailNovelGenreSpan = document.getElementById('detail-novel-genre-span');
    const detailNovelDescriptionDiv = document.getElementById('detail-novel-description-div');
    const continueReadingContainerDiv = document.getElementById('continue-reading-container-div');
    // Chapter Read Elements
    const readChapterTitleH2 = document.getElementById('read-chapter-title-h2');
    const readChapterContentDiv = document.getElementById('read-chapter-content-div');
    // Novel Form Elements
    const novelFormElement = document.getElementById('novel-form-element');
    const novelFormTitleH2 = document.getElementById('novel-form-title-h2');
    const novelFormEditId = document.getElementById('novel-form-edit-id');
    const novelFormTitleInput = document.getElementById('novel-form-title-input');
    const novelFormAuthorInput = document.getElementById('novel-form-author-input');
    const novelFormGenreInput = document.getElementById('novel-form-genre-input');
    const novelFormDescriptionTextarea = document.getElementById('novel-form-description-textarea');
    const cancelNovelFormBtn = document.getElementById('cancel-novel-form-btn');
    // Chapter Form Elements
    const chapterFormElement = document.getElementById('chapter-form-element');
    const chapterFormTitleH2 = document.getElementById('chapter-form-title-h2');
    const chapterFormEditId = document.getElementById('chapter-form-edit-id');
    const chapterFormNovelIdInput = document.getElementById('chapter-form-novel-id-input');
    const chapterFormTitleInput = document.getElementById('chapter-form-title-input');
    const chapterFormContentTextarea = document.getElementById('chapter-form-content-textarea');
    const cancelChapterFormBtn = document.getElementById('cancel-chapter-form-btn');
    // View Action Buttons
    const addNovelShowFormBtn = document.getElementById('add-novel-show-form-btn');
    const editNovelShowFormBtn = document.getElementById('edit-novel-show-form-btn');
    const deleteNovelBtn = document.getElementById('delete-novel-btn');
    const addChapterShowFormBtn = document.getElementById('add-chapter-show-form-btn');

    // --- State Variables ---
    let db; // IndexedDB database object
    let currentNovelId = null; // ID of the novel currently being viewed/edited
    let currentView = 'novel-list'; // Tracks the current visible view ('novel-list', 'novel-detail', etc.)
    let currentFontSize = 16; // Default font size

    // --- Constants ---
    const DB_NAME = 'NovelReaderDB_v2'; // Changed name slightly
    const DB_VERSION = 1;
    const NOVELS_STORE = 'novels';
    const CHAPTERS_STORE = 'chapters';
    const CHAPTER_NOVEL_ID_INDEX = 'novelIdIndex';

    // === Core Application Logic ===

    /** Initialize the application */
    async function initializeApp() {
        console.log("App: Initializing...");
        showError(null); // Clear any previous errors
        try {
            loadPreferences();
            await openDB();
            setupEventListeners(); // Setup listeners after DB connection attempt
            await renderNovelList(); // Render initial list
            showView('novel-list'); // Show initial view
            console.log("App: Initialized Successfully.");
        } catch (error) {
            console.error('FATAL: App initialization failed:', error);
            showError(`Could not initialize application. Database might be inaccessible or corrupted. Please try refreshing or clearing site data. Error: ${error.message || error}`);
            appContainer.style.pointerEvents = 'none'; // Prevent interaction if init fails
        }
    }

    /** Setup all static event listeners */
    function setupEventListeners() {
        console.log("App: Setting up listeners...");
        // Header Controls
        themeToggleBtn.addEventListener('click', handleThemeToggle);
        fontIncreaseBtn.addEventListener('click', handleFontIncrease);
        fontDecreaseBtn.addEventListener('click', handleFontDecrease);
        exportBtn.addEventListener('click', handleExportData);
        importFileInput.addEventListener('change', handleImportData);

        // View Action Buttons
        addNovelShowFormBtn.addEventListener('click', () => showNovelForm());
        editNovelShowFormBtn.addEventListener('click', handleEditNovelShowForm);
        deleteNovelBtn.addEventListener('click', handleDeleteNovel); // Use named handler
        addChapterShowFormBtn.addEventListener('click', () => { if(currentNovelId) showChapterForm(currentNovelId); else showError("No novel selected."); });

        // Form Submissions
        novelFormElement.addEventListener('submit', handleNovelFormSubmit);
        chapterFormElement.addEventListener('submit', handleChapterFormSubmit);

        // Back/Cancel Buttons
        document.querySelectorAll('.back-btn, .cancel-form-btn').forEach(btn => {
            btn.addEventListener('click', handleBackCancelClick);
        });

        // Event Delegation for Lists
        novelListUl.addEventListener('click', handleNovelListClick);
        chapterListUl.addEventListener('click', handleChapterListClick);
        console.log("App: Listeners setup complete.");
    }

    // === IndexedDB Logic ===

    /** Open and upgrade IndexedDB */
    function openDB() {
        return new Promise((resolve, reject) => {
            console.log(`DB: Opening ${DB_NAME} v${DB_VERSION}...`);
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = (event) => { console.error("DB: Open failed", event.target.error); reject('DB Open failed: ' + event.target.error); };
            request.onsuccess = (event) => { db = event.target.result; console.log("DB: Open success"); resolve(db); };
            request.onupgradeneeded = (event) => {
                db = event.target.result; const tx = event.target.transaction;
                console.log('DB: Upgrading...');
                if (!db.objectStoreNames.contains(NOVELS_STORE)) { db.createObjectStore(NOVELS_STORE, { keyPath: 'id', autoIncrement: true }); console.log(`DB: Created ${NOVELS_STORE}`); }
                if (!db.objectStoreNames.contains(CHAPTERS_STORE)) { const cs = db.createObjectStore(CHAPTERS_STORE, { keyPath: 'id', autoIncrement: true }); if (!cs.indexNames.contains(CHAPTER_NOVEL_ID_INDEX)) { cs.createIndex(CHAPTER_NOVEL_ID_INDEX, 'novelId', { unique: false }); console.log(`DB: Created index ${CHAPTER_NOVEL_ID_INDEX}`); } console.log(`DB: Created ${CHAPTERS_STORE}`); }
                tx.onerror = (e) => console.error("DB: Upgrade error", e.target.error); tx.oncomplete = () => console.log("DB: Upgrade complete.");
            };
        });
    }

    /** Generic wrapper for DB operations, assumes operation returns a Promise */
    function performDBOperation(storeNames, mode, operation) {
        return new Promise((resolve, reject) => {
            if (!db) { console.error("DB Op: DB not initialized!"); return reject("DB_NOT_INITIALIZED"); }
            let tx; try { const s = Array.isArray(storeNames) ? storeNames : [storeNames]; tx = db.transaction(s, mode); } catch (e) { console.error("DB Op: TX creation error:", e); return reject("TX_ERROR: " + e); }
            tx.onerror = (e) => { console.error("DB Op: TX Error:", e.target.error); reject(e.target.error || 'TX_FAILED'); }; tx.onabort = (e) => { console.warn("DB Op: TX Aborted:", e.target.error); reject(e.target.error || 'TX_ABORTED'); };
            tx.oncomplete = () => { /* Optional success log */ };
            try { operation(tx).then(resolve).catch(reject); } // Execute operation which returns a promise
            catch (err) { console.error("DB Op: Operation function error:", err); reject("OP_FUNC_ERROR: " + err); tx.abort(); }
        });
    }

    // === CRUD Functions (using the wrapper) ===
    // Each function passed to performDBOperation now returns a Promise for its specific IDBRequest

    function addNovel(novel) { return performDBOperation(NOVELS_STORE, 'readwrite', tx => new Promise((res, rej) => { const req = tx.objectStore(NOVELS_STORE).add(novel); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function getAllNovels() { return performDBOperation(NOVELS_STORE, 'readonly', tx => new Promise((res, rej) => { const req = tx.objectStore(NOVELS_STORE).getAll(); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function getNovel(id) { return performDBOperation(NOVELS_STORE, 'readonly', tx => new Promise((res, rej) => { const req = tx.objectStore(NOVELS_STORE).get(id); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function updateNovel(novel) { return performDBOperation(NOVELS_STORE, 'readwrite', tx => new Promise((res, rej) => { const req = tx.objectStore(NOVELS_STORE).put(novel); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function addChapter(chapter) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => new Promise((res, rej) => { const req = tx.objectStore(CHAPTERS_STORE).add(chapter); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function getChapter(id) { return performDBOperation(CHAPTERS_STORE, 'readonly', tx => new Promise((res, rej) => { const req = tx.objectStore(CHAPTERS_STORE).get(id); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function getChaptersForNovel(novelId) { return performDBOperation(CHAPTERS_STORE, 'readonly', tx => new Promise((res, rej) => { const req = tx.objectStore(CHAPTERS_STORE).index(CHAPTER_NOVEL_ID_INDEX).getAll(novelId); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function updateChapter(chapter) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => new Promise((res, rej) => { const req = tx.objectStore(CHAPTERS_STORE).put(chapter); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }
    function deleteChapter(id) { return performDBOperation(CHAPTERS_STORE, 'readwrite', tx => new Promise((res, rej) => { const req = tx.objectStore(CHAPTERS_STORE).delete(id); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); })); }

    /** Deletes a novel and all its associated chapters using a single transaction */
    async function deleteNovelAndChapters(novelId) {
        console.log(`DB: Deleting novel ${novelId} and chapters...`);
        return performDBOperation([NOVELS_STORE, CHAPTERS_STORE], 'readwrite', async (tx) => {
            const chapterStore = tx.objectStore(CHAPTERS_STORE);
            const chapterIndex = chapterStore.index(CHAPTER_NOVEL_ID_INDEX);
            const novelStore = tx.objectStore(NOVELS_STORE);
            // Get all keys for chapters belonging to the novel
            const chapterKeysToDelete = await new Promise((res, rej) => { const req = chapterIndex.getAllKeys(IDBKeyRange.only(novelId)); req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); });
            // Create delete promises for all chapters
            const deleteChapterPromises = chapterKeysToDelete.map(key =>
                new Promise((res, rej) => { const req = chapterStore.delete(key); req.onsuccess = res; req.onerror = rej; })
            );
            // Wait for all chapters to be deleted
            await Promise.all(deleteChapterPromises);
            // Delete the novel itself
            await new Promise((res, rej) => { const req = novelStore.delete(novelId); req.onsuccess = res; req.onerror = rej; });
            console.log(`DB: Deletion complete for novel ${novelId}`);
            // The result of the main promise isn't crucial here, just that it resolves
            return true;
        });
    }

    /** Clears a stale lastReadChapterId from a novel object */
    async function clearStaleLastRead(novelId) {
        console.warn(`DB: Clearing stale lastRead for novel ${novelId}.`);
        try {
            const novel = await getNovel(novelId);
            if (novel?.lastReadChapterId) { // Check if novel exists and has the property
                novel.lastReadChapterId = null; // Clear the ID
                await updateNovel(novel); // Save the change
                console.log(`DB: Cleared stale lastRead ID for novel ${novelId}.`);
            }
        } catch (error) { console.error(`DB: Error trying to clear stale lastRead for novel ${novelId}:`, error); }
    }

    /** Updates the last read chapter ID for a novel (fire and forget style) */
    async function markChapterAsLastRead(novelId, chapterId) {
        console.log(`DB: Attempt mark ch ${chapterId} last read for novel ${novelId}`);
        try {
            const novel = await getNovel(novelId);
            if (novel && novel.lastReadChapterId !== chapterId) { // Only update if different
                novel.lastReadChapterId = chapterId;
                await updateNovel(novel);
                console.log(`DB: Marked ch ${chapterId} last read for novel ${novelId}`);
            }
        } catch (err) { console.error("DB: Failed mark last read:", err); }
    }

    // === UI Rendering Functions ===

    /** Renders the list of novels */
    async function renderNovelList() {
        console.log("UI: Rendering novel list...");
        if (!novelListUl) { console.error("UI Error: novelListUl missing!"); return; }
        novelListUl.innerHTML = '<li class="placeholder">Loading...</li>'; showError(null);
        try {
            const novels = await getAllNovels(); console.log("UI: Fetched novels:", novels?.length);
            novelListUl.innerHTML = ''; // Clear only after fetch success
            if (!novels?.length) { novelListUl.innerHTML = '<li class="placeholder">No novels found. Add one!</li>'; return; }
            const fragment = document.createDocumentFragment();
            novels.sort((a, b) => a.title.localeCompare(b.title)).forEach(novel => {
                const li = document.createElement('li'); li.dataset.novelId = novel.id;
                li.innerHTML = `<span class="novel-title">${novel.title || 'Untitled'}</span> ${novel.author ? `<span style="font-size:0.85em;color:var(--text-secondary);margin-left:10px;">by ${novel.author}</span>` : ''}`;
                fragment.appendChild(li);
            });
            novelListUl.appendChild(fragment); console.log("UI: Novel list rendered.");
        } catch (error) { console.error('UI: Error rendering novel list:', error); novelListUl.innerHTML = '<li class="placeholder">Error loading novels.</li>'; showError("Failed load novel list."); }
    }

    /** Renders the novel detail view */
    async function renderNovelDetail(novelId) {
        console.log(`UI: Rendering detail for novel ${novelId}`);
        detailNovelTitleH2.textContent = 'Loading...'; detailNovelAuthorSpan.textContent = '...'; detailNovelGenreSpan.textContent = '...'; detailNovelDescriptionDiv.innerHTML = ''; chapterListUl.innerHTML = '<li class="placeholder">Loading...</li>'; if (continueReadingContainerDiv) continueReadingContainerDiv.innerHTML = ''; showError(null);
        try {
            const novel = await getNovel(novelId);
            if (!novel) { throw new Error(`Novel ${novelId} not found.`); }
            currentNovelId = novelId;
            detailNovelTitleH2.textContent = novel.title || 'Untitled'; detailNovelAuthorSpan.textContent = novel.author || 'N/A'; detailNovelGenreSpan.textContent = novel.genre || 'N/A';
            const descHtml = (novel.description || '').trim().replace(/\n\s*\n/g, '</p><p>').replace(/\n/g, '<br>'); detailNovelDescriptionDiv.innerHTML = `<p>${descHtml || 'No description.'}</p>`;
            if (novel.lastReadChapterId && continueReadingContainerDiv) {
                try { const lastChapter = await getChapter(novel.lastReadChapterId); if (lastChapter) { const btn = document.createElement('button'); btn.id = 'continue-reading-btn'; btn.className = 'primary-action small-btn'; btn.textContent = `Continue: Ch. "${lastChapter.title || 'Last Read'}"`; btn.addEventListener('click', () => showChapterView(novel.lastReadChapterId)); continueReadingContainerDiv.appendChild(btn); } else { await clearStaleLastRead(novel.id); } } catch (err) { console.warn("Could not get last read chapter details:", err); }
            }
            await renderChapterList(novelId, novel.lastReadChapterId);
            console.log("UI: Novel detail rendered.");
        } catch (error) { console.error(`UI: Error rendering novel detail ${novelId}:`, error); showError(`Failed load details: ${error.message}`); currentNovelId = null; showView('novel-list'); }
    }

    /** Renders the chapter list for a novel */
    async function renderChapterList(novelId, lastReadChapterId = null) {
        console.log(`UI: Rendering chapter list for novel ${novelId}`);
        if (!chapterListUl) { console.error("UI Error: chapterListUl missing!"); return; }
        chapterListUl.innerHTML = '<li class="placeholder">Loading...</li>'; showError(null);
        try {
            const chapters = await getChaptersForNovel(novelId); console.log(`UI: Fetched ${chapters?.length} chapters.`);
            chapterListUl.innerHTML = '';
            if (!chapters?.length) { chapterListUl.innerHTML = '<li class="placeholder">No chapters added.</li>'; return; }
            const fragment = document.createDocumentFragment();
            chapters.sort((a, b) => a.title.localeCompare(b.title)).forEach(chapter => {
                const li = document.createElement('li'); li.dataset.chapterId = chapter.id;
                if (lastReadChapterId && chapter.id === lastReadChapterId) { li.classList.add('last-read'); }
                li.innerHTML = `<a href="#" class="chapter-title-link" style="flex-grow: 1; text-decoration: none; color: inherit;">${chapter.title || 'Untitled'}</a><div class="list-item-actions"><button class="edit-chapter-btn small-btn" data-chapter-id="${chapter.id}">Edit</button><button class="delete-chapter-btn danger small-btn" data-chapter-id="${chapter.id}" data-chapter-title="${chapter.title || ''}">Delete</button></div>`;
                fragment.appendChild(li);
            });
            chapterListUl.appendChild(fragment); console.log("UI: Chapter list rendered.");
        } catch (error) { console.error(`UI: Err render ch list ${novelId}:`, error); chapterListUl.innerHTML = '<li class="placeholder">Error loading chapters.</li>'; showError("Failed load chapter list."); }
    }

    /** Renders the chapter reading view */
    async function renderChapterView(chapterId) {
        console.log(`UI: Rendering chapter view ${chapterId}`);
        readChapterTitleH2.textContent="Loading..."; readChapterContentDiv.textContent=""; showError(null);
        try {
            const chapter = await getChapter(chapterId);
            if (!chapter) { throw new Error(`Chapter ${chapterId} not found.`); }
            readChapterTitleH2.textContent=chapter.title || 'Untitled'; readChapterContentDiv.textContent=chapter.content || '';
            if(chapter.novelId){ markChapterAsLastRead(chapter.novelId, chapter.id); } // Fire and forget update
            console.log("UI: Chapter view rendered.");
        } catch(e){ console.error(`UI: Err render chapter ${chapterId}:`,e); showError(`Failed load chapter: ${e.message}`); readChapterTitleH2.textContent="Error"; readChapterContentDiv.textContent="Could not load."; }
    }

    // === View Switching & Navigation ===

    /** Shows the specified view */
    function showView(viewId) {
        console.log("View: Switching to", viewId);
        if (!viewId) { console.error("showView called with null/undefined viewId"); return; }
        currentView = viewId; // Update state
        let foundView = false;
        allViews.forEach(view => {
            if (!view) return; // Safety check
            const isActive = view.dataset.viewId === viewId;
            if (isActive) foundView = true;
            // Use classList.toggle for potentially cleaner state management
            view.classList.toggle('active', isActive);
        });
        if (!foundView) {
             console.error(`View element for '${viewId}' not found! Defaulting to list.`);
             document.getElementById('view-novel-list')?.classList.add('active');
             currentView = 'novel-list';
        }
        window.scrollTo(0, 0); // Scroll top
        showError(null); // Clear errors on view change
    }

    /** Handles back/cancel clicks */
    function handleBackCancelClick(event) {
        event.preventDefault();
        const targetViewId = event.currentTarget.dataset.targetView;
        console.log("View: Back/Cancel to:", targetViewId);
        if (targetViewId === 'novel-detail' && currentNovelId) {
            showNovelDetailView(currentNovelId); // Re-render detail
        } else if (targetViewId === 'novel-list') {
            renderNovelList().then(() => showView('novel-list')); // Re-render list
        } else if (targetViewId) {
            showView(targetViewId);
        } else { console.warn("Back/Cancel target unclear"); renderNovelList().then(() => showView('novel-list')); }
    }
    /** Navigates to detail view */
    function showNovelDetailView(novelId) { if (!novelId) return; console.log("View: Nav to detail:", novelId); renderNovelDetail(novelId).then(() => showView('novel-detail')).catch(err => { console.error("Fail show detail:", err); showView('novel-list'); }); }
    /** Navigates to chapter view */
    function showChapterView(chapterId) { if (!chapterId) return; console.log("View: Nav to chapter:", chapterId); renderChapterView(chapterId).then(() => showView('chapter-read')).catch(err => { console.error("Fail show chapter:", err); if (currentNovelId) showNovelDetailView(currentNovelId); else showView('novel-list'); }); }
    /** Shows novel form */
    function showNovelForm(novelToEdit = null) { console.log("UI: Showing novel form", novelToEdit ? `(Edit ${novelToEdit.id})` : '(Add)'); novelFormElement.reset(); novelFormEditId.value = ''; showError(null); if (novelToEdit) { novelFormTitleH2.textContent = 'Edit'; novelFormEditId.value = novelToEdit.id; novelFormTitleInput.value=novelToEdit.title||''; novelFormAuthorInput.value=novelToEdit.author||''; novelFormGenreInput.value=novelToEdit.genre||''; novelFormDescriptionTextarea.value=novelToEdit.description||''; cancelNovelFormBtn.dataset.targetView = 'novel-detail'; } else { novelFormTitleH2.textContent = 'Add'; cancelNovelFormBtn.dataset.targetView = 'novel-list'; } showView('novel-form'); novelFormTitleInput.focus(); }
    /** Shows chapter form */
    function showChapterForm(novelId, chapterToEdit = null) { console.log("UI: Showing chapter form", chapterToEdit ? `(Edit ${chapterToEdit.id})` : `(Add to N:${novelId})`); if (!novelId) { showError("Cannot open chapter form: Novel ID missing."); return; } chapterFormElement.reset(); chapterFormEditId.value = ''; chapterFormNovelIdInput.value = novelId; showError(null); if (chapterToEdit) { chapterFormTitleH2.textContent = 'Edit'; chapterFormEditId.value = chapterToEdit.id; chapterFormTitleInput.value = chapterToEdit.title || ''; chapterFormContentTextarea.value = chapterToEdit.content || ''; } else { chapterFormTitleH2.textContent = 'Add'; } cancelChapterFormBtn.dataset.targetView = 'novel-detail'; showView('chapter-form'); chapterFormTitleInput.focus(); }


    // === Event Handlers ===

    // -- Event Delegation Handlers --
    /** Handles clicks within the novel list UL */
    function handleNovelListClick(event) { const li = event.target.closest('li[data-novel-id]'); if (li) { const novelId = parseInt(li.dataset.novelId, 10); if (novelId) showNovelDetailView(novelId); } }
    /** Handles clicks within the chapter list UL */
    async function handleChapterListClick(event) {
        const target = event.target;
        const button = target.closest('button'); // Button takes precedence
        const link = target.closest('a.chapter-title-link');
        const li = target.closest('li[data-chapter-id]');
        if (!li) return;
        const chapterId = parseInt(li.dataset.chapterId, 10); if (!chapterId) return;

        if (button?.matches('.edit-chapter-btn')) { // Clicked Edit
            if (!currentNovelId) { showError("Novel context lost."); return; }
            showError(null); // Clear errors before trying to fetch
            try { const chapter = await getChapter(chapterId); if (chapter) showChapterForm(currentNovelId, chapter); else showError("Chapter not found."); }
            catch (e) { console.error("Err fetch ch edit:", e); showError("Failed to load chapter data."); }
        } else if (button?.matches('.delete-chapter-btn')) { // Clicked Delete
            const title = button.dataset.chapterTitle || 'this chapter';
            if (confirm(`Delete "${title}"?`)) {
                showError(null); // Clear errors
                try {
                    await deleteChapter(chapterId);
                    const novel = await getNovel(currentNovelId); // Get novel again for last read ID
                    await renderChapterList(currentNovelId, novel?.lastReadChapterId); // Refresh list
                    if (novel?.lastReadChapterId === chapterId) { // Check if deleted was last read
                        await clearStaleLastRead(currentNovelId);
                        // Re-render detail after a short delay to ensure state updated
                         setTimeout(() => renderNovelDetail(currentNovelId), 50);
                    }
                } catch (e) { console.error("Err del ch:", e); showError("Failed to delete chapter."); }
            }
        } else if (link) { // Clicked title link to read
            event.preventDefault(); showChapterView(chapterId);
        }
    }

    // -- Direct Button/Form Handlers --
    function handleThemeToggle() { const isDark = document.body.classList.contains('dark-mode'); applyTheme(isDark ? 'light' : 'dark'); }
    function handleFontIncrease() { applyFontSize(currentFontSize + 1); }
    function handleFontDecrease() { applyFontSize(currentFontSize - 1); }
    async function handleEditNovelShowForm() { if (!currentNovelId) return; showError(null); try { const novel = await getNovel(currentNovelId); if (novel) showNovelForm(novel); else showError("Novel not found."); } catch (e) { console.error("Err fetch novel edit:", e); showError("Error loading novel data."); } }
    /** Handler for the Delete Novel Button */
    async function handleDeleteNovel() {
        if (!currentNovelId) { console.warn("Delete clicked, no currentNovelId"); return; }
        const novelIdToDelete = currentNovelId;
        let novelTitle = 'this novel';
        try { const n = await getNovel(novelIdToDelete); if (n?.title) novelTitle = `"${n.title}"`; } catch { /* Use default */ }

        if (confirm(`⚠️ DELETE ${novelTitle} and ALL chapters?\nCannot be undone.`)) {
            console.log(`Starting deletion for novel ${novelIdToDelete}`);
            showError(null); // Clear previous errors
            try {
                await deleteNovelAndChapters(novelIdToDelete);
                console.log(`Deletion completed for ${novelIdToDelete}. Navigating...`);
                currentNovelId = null; // Clear context *immediately*

                // Navigate back to list view *sequentially* and robustly
                await renderNovelList(); // Attempt to render list first
                showView('novel-list'); // Then show the view
                console.log("Navigation to list view complete.");

            } catch (error) {
                console.error("Error during novel deletion process:", error);
                showError(`Failed to delete novel: ${error.message || error}`);
                // Don't automatically refresh detail view on failure, stick to list or show error
                showView('novel-list'); // Go to list even on error
            }
        } else { console.log("Deletion cancelled."); }
    }
    async function handleNovelFormSubmit(event) { event.preventDefault(); const data={title: novelFormTitleInput.value.trim(), author: novelFormAuthorInput.value.trim(), genre: novelFormGenreInput.value.trim(), description: novelFormDescriptionTextarea.value.trim()}; if(!data.title){showError("Title required."); return;} const editId = novelFormEditId.value; showError(null); try { if(editId){ data.id = parseInt(editId, 10); await updateNovel(data); showNovelDetailView(data.id); } else { await addNovel(data); await renderNovelList(); showView('novel-list'); } novelFormElement.reset();} catch(e){console.error("Err save novel:",e); showError(`Failed save: ${e.message||e}`);}}
    async function handleChapterFormSubmit(event) { event.preventDefault(); const data={novelId: parseInt(chapterFormNovelIdInput.value, 10), title: chapterFormTitleInput.value.trim(), content: chapterFormContentTextarea.value}; if(!data.novelId || !data.title){showError("Novel ID/Title required."); return;} const editId = chapterFormEditId.value; showError(null); try { const novelIdToReturnTo = data.novelId; if(editId){ data.id = parseInt(editId, 10); await updateChapter(data); } else { await addChapter(data); } chapterFormElement.reset(); showNovelDetailView(novelIdToReturnTo); } catch(e){console.error("Err save chapter:",e); showError(`Failed save: ${e.message||e}`);}}
    async function handleExportData() { if(!confirm("Backup?"))return; showError(null); try {const n=await getAllNovels(); const c=await performDBOperation(CHAPTERS_STORE,'readonly', tx => new Promise((res, rej)=>{const r=tx.objectStore(CHAPTERS_STORE).getAll(); r.onsuccess=e=>res(e.target.result); r.onerror=e=>rej(e.target.error);})); if(n.length===0&&c.length===0){alert("Nothing to export.");return;} const dE={exportFormatVersion:1,timestamp:new Date().toISOString(),data:{novels:n,chapters:c}}; const s=JSON.stringify(dE,null,2); const b=new Blob([s],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a');a.href=u;const dt=new Date().toISOString().slice(0,10);a.download=`nr_backup_${dt}.json`;a.click();URL.revokeObjectURL(u);a.remove();}catch(e){console.error('Err export:',e);showError(`Export failed: ${e.message||e}`);}}
    async function handleImportData(event) { const file=event.target.files[0]; if (!file || file.type !== 'application/json') { alert("Invalid file."); importFileInput.value=''; return; } showError(null); const reader = new FileReader(); reader.onload = async (e) => { try { const imp=JSON.parse(e.target.result); if (!imp?.data?.novels || !Array.isArray(imp.data.novels) || !imp.data.chapters || !Array.isArray(imp.data.chapters)) throw new Error("Invalid structure."); const d = imp.data; if (!confirm(`⚠️ WARNING: DELETE ALL current data?`)) { importFileInput.value = ''; return; } console.log(`Importing ${d.novels.length} N, ${d.chapters.length} C...`); await performDBOperation([NOVELS_STORE,CHAPTERS_STORE],'readwrite',async tx => { await Promise.all([new Promise((rs,rj)=>{const r=tx.objectStore(NOVELS_STORE).clear();r.onsuccess=rs;r.onerror=rj;}), new Promise((rs,rj)=>{const r=tx.objectStore(CHAPTERS_STORE).clear();r.onsuccess=rs;r.onerror=rj;})]); }); console.log("Cleared."); const map=new Map(); const nProm=d.novels.map(n=>new Promise(async(res)=>{const oId=n.id;if(!oId){console.warn("Skip N - no ID:",n);return res();} const{id,...nWId}=n; try{const nId=await addNovel(nWId);map.set(oId, nId);}catch(er){console.error(`Fail N (orig ${oId}):`,er);}finally{res();}})); await Promise.all(nProm); console.log("Novels done, map:", map); let cAdd=0,cSkip=0; const cProm=d.chapters.map(c=>new Promise(async(res)=>{const oCId=c.id,oNId=c.novelId; const{id,novelId,...cWIds}=c; const nNId=map.get(oNId); if(nNId===undefined){console.warn(`Skip C "${c.title}"(orig ${oCId}) - missing map ${oNId}`); cSkip++; return res();} const cAddData={...cWIds,novelId:nNId}; try{await addChapter(cAddData);cAdd++;}catch(er){console.error(`Fail C "${c.title}"(orig ${oCId}):`,er);}finally{res();}})); await Promise.all(cProm); alert(`Import done!\nNovels: ${map.size}\nChapters Added: ${cAdd}\nSkipped: ${cSkip}`); await renderNovelList();showView('novel-list'); } catch (er) { console.error('Critical import err:', er); showError(`Import FAILED: ${er.message||er}`); await renderNovelList();showView('novel-list'); } finally { importFileInput.value=''; } }; reader.onerror=(e)=>{console.error("File read err:",e);alert("Failed read backup.");importFileInput.value='';}; reader.readAsText(file); }

    // === Preferences ===
    function applyTheme(theme) { const isDark = theme === 'dark'; document.body.classList.toggle('dark-mode', isDark); themeToggleBtn.textContent = isDark ? '☀️' : '🌙'; themeToggleBtn.title = isDark ? 'Light Mode' : 'Dark Mode'; localStorage.setItem('novelReaderTheme', theme); }
    function applyFontSize(size) { const newSize = Math.max(12, Math.min(28, size)); appContainer.style.fontSize = `${newSize}px`; currentFontSize = newSize; fontSizeDisplay.textContent = newSize; localStorage.setItem('novelReaderFontSize', newSize); }
    function loadPreferences() { console.log("App: Loading preferences..."); const savedTheme = localStorage.getItem('novelReaderTheme') || 'light'; applyTheme(savedTheme); const savedFontSize = parseInt(localStorage.getItem('novelReaderFontSize') || '16', 10); applyFontSize(savedFontSize); }

    // === Utility ===
    function showError(message) { if(!errorDisplay) return; if (message) { console.error("Error Displayed:", message); errorDisplay.textContent = message; errorDisplay.hidden = false; } else { errorDisplay.textContent = ''; errorDisplay.hidden = true; } }

    // --- Start the App ---
    initializeApp();

}); // End DOMContentLoaded
