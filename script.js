// script.js - Main Application Logic
'use strict';

// Import database functions
import * as db from './db.js'; // This import relies on db.js exporting correctly

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Novel Reader App v4...");

    // --- Constants ---
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 28;
    const DEFAULT_FONT_SIZE = 16;
    const EXPORT_VERSION = 3; // Increment if export format changes significantly

    // --- State Variables ---
    let currentNovelId = null;
    let currentView = 'list'; // 'list', 'detail', 'read', 'novelForm', 'chapterForm'
    let currentFontSize = DEFAULT_FONT_SIZE;
    let messageTimeout;

    // --- DOM Element Cache ---
    const appContainer = document.getElementById('app-container');
    const messageDisplay = document.getElementById('message-display');
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
        importLabel: document.querySelector('.import-button'), // The label acts as the button
        importInput: document.getElementById('import-file-input'),
    };
    const detailElements = {
        title: document.getElementById('detail-novel-title-h2'),
        author: document.getElementById('detail-novel-author-span'),
        genre: document.getElementById('detail-novel-genre-span'),
        description: document.getElementById('detail-novel-description-div'),
        continueReadingContainer: document.getElementById('continue-reading-container-div'),
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
        hideMessage(); // Clear any previous messages
        try {
            if (!appContainer || !views.list || !lists.novel) {
                throw new Error("Essential DOM elements are missing. HTML structure might be incorrect.");
            }
            loadPreferences();
            // Check if db object and initDB function exist before calling
            if (db && typeof db.initDB === 'function') {
                await db.initDB(); // Initialize database from the module
            } else {
                 console.error("Critical Error: db object or db.initDB function not found after import.", db);
                 throw new Error("Database module failed to load correctly.");
            }
            setupEventListeners();
            await renderNovelList();
            showView('list'); // Start at the list view
            console.log("App: Initialized Successfully.");
        } catch (error) {
            console.error('FATAL: App initialization failed:', error);
            displayMessage(`Initialization failed: ${error.message || 'Unknown error'}. Please refresh or clear site data.`, 'error', true); // Sticky error
            if (appContainer) { // Disable interaction on fatal error
                appContainer.style.pointerEvents = 'none';
                appContainer.style.opacity = '0.7';
            }
        }
    }

    function setupEventListeners() {
        console.log("App: Setting up listeners...");

        // --- Header Controls ---
        headerControls.themeToggle?.addEventListener('click', handleThemeToggle);
        headerControls.fontIncrease?.addEventListener('click', handleFontIncrease);
        headerControls.fontDecrease?.addEventListener('click', handleFontDecrease);
        headerControls.exportBtn?.addEventListener('click', handleExportData);
        headerControls.importInput?.addEventListener('change', handleImportFileSelect); // Listen for file selection
        headerControls.importLabel?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); headerControls.importInput?.click(); } });

        // --- View Action Buttons (Direct) ---
        actionButtons.addNovel?.addEventListener('click', () => showNovelForm());
        // EDIT NOVEL (Detail Page) - Use anonymous function
        detailElements.editBtn?.addEventListener('click', () => { handleEditNovelShowForm(); });
        // DELETE NOVEL (Detail Page) - Use anonymous function
        detailElements.deleteBtn?.addEventListener('click', () => { handleDeleteNovel(); }); // Relies on currentNovelId, validation inside handler
        detailElements.addChapterBtn?.addEventListener('click', () => { if (currentNovelId) { showChapterForm(currentNovelId); } else { displayMessage("Cannot add chapter: No novel selected.", "error"); } });
        detailElements.downloadAllBtn?.addEventListener('click', handleDownloadAllChapters);

        // --- Form Submissions ---
        novelForm.form?.addEventListener('submit', handleNovelFormSubmit);
        chapterForm.form?.addEventListener('submit', handleChapterFormSubmit);

        // --- Navigation (Back/Cancel/View Links) - Using Delegation ---
        appContainer.addEventListener('click', async (event) => {
            const button = event.target.closest('button.back-btn, button.cancel-form-btn');
            const novelLink = event.target.closest('.novel-title-link');
            const chapterLink = event.target.closest('.chapter-title-link');
            const continueBtn = event.target.closest('#continue-reading-btn');

            if (button) { event.preventDefault(); await handleBackCancelClick(button); }
            else if (novelLink && novelLink.classList.contains('novel-title-link')) { event.preventDefault(); const novelId = parseInt(novelLink.closest('li[data-novel-id]')?.dataset.novelId, 10); if (!isNaN(novelId)) { await showNovelDetailView(novelId); } }
            else if (chapterLink && chapterLink.classList.contains('chapter-title-link')) { event.preventDefault(); const chapterId = parseInt(chapterLink.closest('li[data-chapter-id]')?.dataset.chapterId, 10); if (!isNaN(chapterId)) { await showChapterView(chapterId); } }
            else if (continueBtn) { event.preventDefault(); const chapterId = parseInt(continueBtn.dataset.chapterId, 10); if (!isNaN(chapterId)) { await showChapterView(chapterId); } }
        });

        // --- List Item Actions (Edit/Delete/Download) - Using Delegation ---
        lists.novel?.addEventListener('click', handleNovelListItemActions);
        lists.chapter?.addEventListener('click', handleChapterListItemActions);

        console.log("App: Listeners setup complete.");
    }

    // === UI Rendering Functions === (Keep as before)

    async function renderNovelList() {
        console.log("UI: Rendering novel list...");
        const listElement = lists.novel; if (!listElement) { console.error("UI Error: Novel list UL not found!"); return; }
        listElement.innerHTML = '<li class="placeholder" role="listitem">Loading novels...</li>'; hideMessage();
        try {
            const novels = await db.getAllNovelsDB(); console.log(`UI: Fetched ${novels?.length ?? 0} novels.`); listElement.innerHTML = '';
            if (!novels || novels.length === 0) { listElement.innerHTML = '<li class="placeholder" role="listitem">No novels found. Add one!</li>'; return; }
            novels.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }));
            const fragment = document.createDocumentFragment();
            novels.forEach((novel, index) => {
                const li = document.createElement('li'); li.dataset.novelId = novel.id; li.setAttribute('role', 'listitem'); li.style.setProperty('--item-index', index);
                const contentDiv = document.createElement('div'); contentDiv.className = 'list-item-content';
                const titleLink = document.createElement('button'); titleLink.type = 'button'; titleLink.className = 'novel-title-link'; titleLink.textContent = novel.title || 'Untitled Novel'; contentDiv.appendChild(titleLink);
                if (novel.author) { const authorSpan = document.createElement('span'); authorSpan.className = 'author'; authorSpan.textContent = `by ${novel.author}`; contentDiv.appendChild(authorSpan); }
                const actionsDiv = document.createElement('div'); actionsDiv.className = 'list-item-actions'; const safeTitle = (novel.title || 'Untitled Novel').replace(/"/g, '"');
                actionsDiv.innerHTML = ` <button type="button" class="edit-novel-btn small-btn" data-action="edit" title="Edit Info" aria-label="Edit ${safeTitle} Info">Edit</button> <button type="button" class="delete-novel-btn danger small-btn" data-action="delete" data-novel-title="${safeTitle}" title="Delete Novel" aria-label="Delete ${safeTitle}">Delete</button> `;
                li.appendChild(contentDiv); li.appendChild(actionsDiv); fragment.appendChild(li);
            });
            listElement.appendChild(fragment); console.log("UI: Novel list rendered.");
        } catch (error) { console.error('UI: Error rendering novel list:', error); listElement.innerHTML = '<li class="placeholder error" role="listitem">Error loading novels.</li>'; displayMessage("Failed to load the novel list.", "error"); }
    }
    async function renderNovelDetail(novelId) {
        console.log(`UI: Rendering detail for novel ${novelId}`); if (!detailElements.title) { console.error("UI Error: Detail view elements missing!"); return; }
        detailElements.title.textContent = 'Loading...'; detailElements.author.textContent = '...'; detailElements.genre.textContent = '...'; detailElements.description.textContent = ''; detailElements.continueReadingContainer.innerHTML = ''; lists.chapter.innerHTML = '<li class="placeholder" role="listitem">Loading chapters...</li>'; hideMessage();
        try {
            const idToFetch = parseInt(novelId, 10); if (isNaN(idToFetch)) { throw new Error("Invalid Novel ID provided for detail view."); }
            const novel = await db.getNovelDB(idToFetch); if (!novel) { console.warn(`UI: Novel ${idToFetch} not found.`); displayMessage(`Novel not found. It might have been deleted.`, "error"); currentNovelId = null; await renderNovelList(); showView('list'); return; }
            currentNovelId = idToFetch; detailElements.title.textContent = novel.title || 'Untitled Novel'; detailElements.author.textContent = novel.author || 'N/A'; detailElements.genre.textContent = novel.genre || 'N/A'; detailElements.description.textContent = novel.description || 'No description provided.';
            const updatedNovel = await checkAndClearStaleLastRead(novel); if (!updatedNovel) { console.warn(`UI: Novel ${idToFetch} disappeared after stale check.`); displayMessage(`Novel data became unavailable.`, "error"); currentNovelId = null; await renderNovelList(); showView('list'); return; }
            await renderContinueReadingButton(updatedNovel); await renderChapterList(idToFetch, updatedNovel.lastReadChapterId); console.log("UI: Novel detail rendered.");
        } catch (error) { console.error(`UI: Error rendering novel detail ${novelId}:`, error); displayMessage(`Failed to load novel details: ${error.message}`, "error"); currentNovelId = null; showView('list'); }
     }
    async function checkAndClearStaleLastRead(novel) {
        if (!novel?.lastReadChapterId) { return novel; } try { const chapterExists = await db.getChapterDB(novel.lastReadChapterId); if (!chapterExists) { console.log(`UI: Stale lastRead chapter ${novel.lastReadChapterId} found for novel ${novel.id}. Clearing.`); novel.lastReadChapterId = null; await db.updateNovelDB(novel); return novel; } } catch (error) { console.error(`UI: Error checking stale lastRead for novel ${novel.id}:`, error); } return novel;
     }
    async function renderContinueReadingButton(novel) {
        const container = detailElements.continueReadingContainer; if (!container) return; container.innerHTML = '';
        if (novel?.lastReadChapterId) { try { const lastChapter = await db.getChapterDB(novel.lastReadChapterId); if (lastChapter) { const btn = document.createElement('button'); btn.id = 'continue-reading-btn'; btn.type = 'button'; btn.className = 'primary-action small-btn'; const chapterTitle = lastChapter.title || 'Unnamed Chapter'; const btnText = chapterTitle.length > 40 ? chapterTitle.substring(0, 37) + '...' : chapterTitle; btn.textContent = `Continue: "${btnText}"`; btn.dataset.chapterId = lastChapter.id; btn.title = `Continue reading: ${chapterTitle}`; container.appendChild(btn); } else { console.warn("UI: Last read chapter ID set, but chapter not found."); } } catch (err) { console.warn("UI: Could not fetch last read chapter details for button:", err); } }
     }
    async function renderChapterList(novelId, lastReadChapterId = null) {
        console.log(`UI: Rendering chapter list for novel ${novelId}`); const listElement = lists.chapter; if (!listElement) { console.error("UI Error: Chapter list UL not found!"); return; } listElement.innerHTML = '<li class="placeholder" role="listitem">Loading chapters...</li>';
        try { const idToFetch = parseInt(novelId, 10); if (isNaN(idToFetch)) { throw new Error("Invalid Novel ID provided for chapter list."); } let chapters = await db.getAllChaptersForNovelDB(idToFetch); console.log(`UI: Fetched ${chapters?.length ?? 0} chapters.`); listElement.innerHTML = ''; if (!chapters || chapters.length === 0) { listElement.innerHTML = '<li class="placeholder" role="listitem">No chapters added yet.</li>'; return; } chapters.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' })); const fragment = document.createDocumentFragment(); chapters.forEach((chapter, index) => { const li = document.createElement('li'); li.dataset.chapterId = chapter.id; li.setAttribute('role', 'listitem'); li.style.setProperty('--item-index', index); if (lastReadChapterId && chapter.id === lastReadChapterId) { li.classList.add('last-read'); } const contentDiv = document.createElement('div'); contentDiv.className = 'list-item-content'; const link = document.createElement('button'); link.type = 'button'; link.className = 'chapter-title-link'; link.textContent = chapter.title || 'Untitled Chapter'; contentDiv.appendChild(link); const actionsDiv = document.createElement('div'); actionsDiv.className = 'list-item-actions'; const safeTitle = (chapter.title || 'Untitled Chapter').replace(/"/g, '"'); actionsDiv.innerHTML = ` <button type="button" class="download-chapter-btn small-btn" data-action="download" title="Download Chapter (.txt.gz)" aria-label="Download ${safeTitle}">↓</button> <button type="button" class="edit-chapter-btn small-btn" data-action="edit" title="Edit Chapter" aria-label="Edit ${safeTitle}">Edit</button> <button type="button" class="delete-chapter-btn danger small-btn" data-action="delete" data-chapter-title="${safeTitle}" title="Delete Chapter" aria-label="Delete ${safeTitle}">Delete</button> `; li.appendChild(contentDiv); li.appendChild(actionsDiv); fragment.appendChild(li); }); listElement.appendChild(fragment); console.log("UI: Chapter list rendered."); } catch (error) { console.error(`UI: Error rendering chapter list ${novelId}:`, error); listElement.innerHTML = '<li class="placeholder error" role="listitem">Error loading chapters.</li>'; displayMessage("Failed to load the chapter list.", "error"); }
     }
    async function renderChapterView(chapterId) {
        console.log(`UI: Rendering chapter view ${chapterId}`); if (!readElements.title || !readElements.content) { console.error("UI Error: Chapter read elements missing!"); return; } readElements.title.textContent = "Loading..."; readElements.content.textContent = ""; hideMessage();
        try { const idToFetch = parseInt(chapterId, 10); if (isNaN(idToFetch)) { throw new Error("Invalid Chapter ID provided for read view."); } const chapter = await db.getChapterDB(idToFetch); if (!chapter) { console.warn(`UI: Chapter ${idToFetch} not found.`); displayMessage(`Chapter not found. It might have been deleted.`, "error"); if (currentNovelId) { await showNovelDetailView(currentNovelId); } else { await showNovelListView(); } return; } readElements.title.textContent = chapter.title || 'Untitled Chapter'; readElements.content.textContent = chapter.content || '(This chapter has no content)'; if (chapter.novelId) { await markChapterAsLastRead(chapter.novelId, chapter.id); } else { console.warn(`UI: Chapter ${idToFetch} has no novelId, cannot mark as last read.`); } console.log("UI: Chapter view rendered."); window.scrollTo({ top: 0, behavior: 'instant' }); } catch (error) { console.error(`UI: Error rendering chapter view ${chapterId}:`, error); readElements.title.textContent = "Error Loading Chapter"; readElements.content.textContent = "Could not load the chapter content due to an error."; displayMessage(`Failed load chapter: ${error.message}`, "error"); }
     }
    async function markChapterAsLastRead(novelId, chapterId) {
        if (!novelId || !chapterId) return; const numNovelId = parseInt(novelId, 10); const numChapterId = parseInt(chapterId, 10); if (isNaN(numNovelId) || isNaN(numChapterId)) { console.warn(`UI: Invalid ID types for markChapterAsLastRead (Novel: ${novelId}, Chapter: ${chapterId})`); return; }
        try { const novel = await db.getNovelDB(numNovelId); if (novel && novel.lastReadChapterId !== numChapterId) { novel.lastReadChapterId = numChapterId; await db.updateNovelDB(novel); console.log(`DB: Marked chapter ${numChapterId} as last read for novel ${numNovelId}.`); if (currentView === 'detail' && currentNovelId === numNovelId) { await renderContinueReadingButton(novel); const listElement = lists.chapter; if (listElement) { listElement.querySelector('.last-read')?.classList.remove('last-read'); listElement.querySelector(`li[data-chapter-id="${numChapterId}"]`)?.classList.add('last-read'); } } } else if (!novel) { console.warn(`UI: Novel ${numNovelId} not found when trying to mark last read.`); } } catch (err) { console.error("UI: Failed to mark chapter as last read:", err); }
     }

    // === View Switching & Navigation === (Keep as before)

    function showView(viewId) {
        if (!views[viewId]) { console.error(`View: Invalid view key '${viewId}'. Defaulting to list.`); viewId = 'list'; } if (currentView === viewId) { return; } console.log(`View: Switching from '${currentView}' to '${viewId}'`); const previousView = currentView; currentView = viewId; Object.values(views).forEach(viewElement => { if (viewElement) { viewElement.classList.remove('active'); viewElement.hidden = true; viewElement.setAttribute('aria-hidden', 'true'); } }); const targetViewElement = views[viewId]; if (targetViewElement) { targetViewElement.classList.add('active'); targetViewElement.hidden = false; targetViewElement.setAttribute('aria-hidden', 'false'); const focusTarget = targetViewElement.querySelector('h2.view-title, h3') || targetViewElement.querySelector('.primary-action') || targetViewElement.querySelector('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])') || targetViewElement; if (focusTarget && typeof focusTarget.focus === 'function') { setTimeout(() => { if (currentView === viewId) { focusTarget.focus({ preventScroll: false }); } }, 100); } if (!(previousView === 'read' && viewId === 'detail')) { window.scrollTo({ top: 0, behavior: 'smooth' }); } } else { console.error(`View: Target view element for '${viewId}' not found in DOM.`); showView('list'); }
    }
    async function handleBackCancelClick(button) {
        const targetViewId = button.dataset.targetView; console.log(`View: Back/Cancel clicked. Target view ID: '${targetViewId}', Current Novel ID: ${currentNovelId}`); if (!targetViewId || !views[targetViewId]) { console.warn(`View: Back/Cancel target view ID '${targetViewId}' is invalid or missing. Defaulting to list.`); await showNovelListView(); return; } button.disabled = true; const originalText = button.textContent; if (originalText && originalText.length > 1) button.textContent = 'Loading...';
        try { switch (targetViewId) { case 'list': await showNovelListView(); break; case 'detail': if (currentNovelId) { await showNovelDetailView(currentNovelId); } else { console.warn("View: Attempted to navigate back to 'detail' but currentNovelId is missing. Going to list."); await showNovelListView(); } break; default: console.warn(`View: Unknown target view '${targetViewId}' for back/cancel. Going to list.`); await showNovelListView(); break; } } catch (error) { console.error("View: Error during back/cancel navigation:", error); displayMessage("Navigation failed. Please try again.", "error"); await showNovelListView(); } finally { button.disabled = false; if (originalText && originalText.length > 1) button.textContent = originalText; }
    }
    async function showNovelListView() { currentNovelId = null; await renderNovelList(); showView('list'); }
    async function showNovelDetailView(novelId) { if (!novelId) return; console.log(`View: Navigating to detail view for novel ${novelId}`); await renderNovelDetail(novelId); if (currentNovelId) { showView('detail'); } else { if (currentView !== 'list') { await showNovelListView(); } } }
    async function showChapterView(chapterId) { if (!chapterId) return; console.log(`View: Navigating to read view for chapter ${chapterId}`); await renderChapterView(chapterId); if (document.getElementById('view-chapter-read').contains(readElements.title) && readElements.title.textContent !== "Error Loading Chapter") { showView('read'); } }

    // === Form Display Logic === (Keep as before)

    function showNovelForm(novelToEdit = null) { console.log("UI: Showing novel form", novelToEdit ? `(Edit ID: ${novelToEdit.id})` : '(Add New)'); if (!novelForm.form) { console.error("UI Error: Novel form element not found!"); return; } novelForm.form.reset(); novelForm.editId.value = ''; hideMessage(); if (novelToEdit) { novelForm.title.textContent = 'Edit Novel'; novelForm.editId.value = novelToEdit.id; novelForm.titleInput.value = novelToEdit.title || ''; novelForm.authorInput.value = novelToEdit.author || ''; novelForm.genreInput.value = novelToEdit.genre || ''; novelForm.descriptionTextarea.value = novelToEdit.description || ''; novelForm.saveBtn.textContent = 'Update Novel'; novelForm.cancelBtn.dataset.targetView = 'detail'; } else { novelForm.title.textContent = 'Add New Novel'; novelForm.saveBtn.textContent = 'Save Novel'; novelForm.cancelBtn.dataset.targetView = 'list'; } showView('novelForm'); novelForm.titleInput.focus(); }
    function showChapterForm(novelId, chapterToEdit = null) { if (!novelId) { displayMessage("Cannot open chapter form: Novel ID is missing.", "error"); return; } const numNovelId = parseInt(novelId, 10); if (isNaN(numNovelId)) { displayMessage("Cannot open chapter form: Invalid Novel ID.", "error"); return; } console.log("UI: Showing chapter form", chapterToEdit ? `(Edit ID: ${chapterToEdit.id})` : `(Add New to Novel ID: ${numNovelId})`); if (!chapterForm.form) { console.error("UI Error: Chapter form element not found!"); return; } chapterForm.form.reset(); chapterForm.editId.value = ''; chapterForm.novelIdInput.value = numNovelId; hideMessage(); if (chapterToEdit) { chapterForm.title.textContent = 'Edit Chapter'; chapterForm.editId.value = chapterToEdit.id; chapterForm.titleInput.value = chapterToEdit.title || ''; chapterForm.contentTextarea.value = chapterToEdit.content || ''; chapterForm.saveBtn.textContent = 'Update Chapter'; } else { chapterForm.title.textContent = 'Add New Chapter'; chapterForm.saveBtn.textContent = 'Save Chapter'; } chapterForm.cancelBtn.dataset.targetView = 'detail'; showView('chapterForm'); chapterForm.titleInput.focus(); }

    // === Event Handlers ===

    // --- Delegated List Actions --- (Keep as before)

    function handleNovelListItemActions(event) { const targetButton = event.target.closest('.list-item-actions button'); if (!targetButton) return; const action = targetButton.dataset.action; const listItem = targetButton.closest('li[data-novel-id]'); const novelId = parseInt(listItem?.dataset.novelId, 10); if (!action || isNaN(novelId)) return; event.preventDefault(); if (action === 'edit') { handleEditNovelShowForm(novelId); } else if (action === 'delete') { const title = targetButton.dataset.novelTitle || 'this novel'; handleDeleteNovel(novelId, title); } }
    async function handleChapterListItemActions(event) { const targetButton = event.target.closest('.list-item-actions button'); if (!targetButton) return; const action = targetButton.dataset.action; const listItem = targetButton.closest('li[data-chapter-id]'); const chapterId = parseInt(listItem?.dataset.chapterId, 10); if (!action || isNaN(chapterId) || !currentNovelId) { console.warn("Chapter action skipped: Missing action, chapter ID, or novel context.", {action, chapterId, currentNovelId}); return; } event.preventDefault(); targetButton.disabled = true; try { switch (action) { case 'download': await handleDownloadSingleChapter(chapterId, targetButton); break; case 'edit': const chapter = await db.getChapterDB(chapterId); if (chapter) { showChapterForm(currentNovelId, chapter); } else { displayMessage("Chapter not found. It might have been deleted.", "error"); await renderChapterList(currentNovelId, (await db.getNovelDB(currentNovelId))?.lastReadChapterId); } break; case 'delete': const title = targetButton.dataset.chapterTitle || 'this chapter'; if (confirm(`Are you sure you want to permanently delete the chapter "${title}"?`)) { listItem.style.opacity = '0.5'; await db.deleteChapterDB(chapterId); console.log(`UI: Deleted chapter ${chapterId}`); listItem.remove(); displayMessage(`Chapter "${title}" deleted.`, "success"); const novel = await db.getNovelDB(currentNovelId); if (novel?.lastReadChapterId === chapterId) { console.log("UI: Deleted chapter was the last read. Clearing reference."); novel.lastReadChapterId = null; await db.updateNovelDB(novel); await renderContinueReadingButton(novel); } if (lists.chapter && !lists.chapter.querySelector('li:not(.placeholder)')) { lists.chapter.innerHTML = '<li class="placeholder">No chapters added yet.</li>'; } } else { targetButton.disabled = false; } break; } } catch (error) { console.error(`UI: Error performing chapter action '${action}' on ID ${chapterId}:`, error); displayMessage(`Failed to ${action} chapter: ${error.message}`, "error"); if(listItem) listItem.style.opacity = '1'; } finally { if (action !== 'delete' || !listItem?.isConnected) { if (targetButton && document.body.contains(targetButton)) { targetButton.disabled = false; } } } }

    // --- Header Control Handlers --- (Keep as before)
    function handleThemeToggle() { const isDark = document.body.classList.contains('dark-mode'); applyTheme(isDark ? 'light' : 'dark'); }
    function handleFontIncrease() { applyFontSize(currentFontSize + 1); }
    function handleFontDecrease() { applyFontSize(currentFontSize - 1); }

    // --- Edit/Delete Button Handlers ---

    // EDIT Novel (called from list item OR detail button)
    async function handleEditNovelShowForm(novelId = null) {
        const idToEdit = parseInt(novelId ?? currentNovelId, 10);
        if (isNaN(idToEdit)) { displayMessage("No novel selected to edit.", "error"); return; }
        const isListContext = novelId !== null;
        const btnSelector = isListContext ? `.list-item-actions button[data-action="edit"][data-novel-id="${idToEdit}"]` : '#edit-novel-show-form-btn';
        const btn = document.querySelector(btnSelector); if (btn) btn.disabled = true;
        hideMessage();
        try { const novel = await db.getNovelDB(idToEdit); if (novel) { showNovelForm(novel); } else { displayMessage("Novel not found. It might have been deleted.", "error"); if (isListContext && currentView === 'list') { await renderNovelList(); } else if (!isListContext && currentView === 'detail') { await showNovelListView(); } } } catch (error) { console.error(`UI: Error fetching novel ${idToEdit} for edit:`, error); if (error instanceof DOMException && error.name === 'DataError') { displayMessage("Failed to load novel data: Invalid ID.", "error"); } else { displayMessage("Failed to load novel data for editing.", "error"); } } finally { if (btn && document.body.contains(btn)) btn.disabled = false; }
    }

    // DELETE Novel (called from list item OR detail button) - Includes FIX
    async function handleDeleteNovel(novelId = null, novelTitle = null) {
        let idToDelete;
        const sourceId = novelId ?? currentNovelId;

        if (sourceId !== null && sourceId !== undefined) {
            idToDelete = parseInt(sourceId, 10);
        } else {
             idToDelete = NaN;
        }

        // --- FIX: Explicit check for valid number ID ---
        if (isNaN(idToDelete)) {
            console.error(`UI: Delete cancelled - Invalid or missing Novel ID. Argument: ${novelId}, State: ${currentNovelId}`);
            // Show user-friendly message instead of previous "No novel selected"
            displayMessage("Cannot delete: Novel ID is missing or invalid.", "error");
            return; // Stop execution
        }
        // --- End of FIX ---

        let title = novelTitle;
        if (!title) {
            console.log(`UI: Fetching title for novel ID ${idToDelete} for delete confirmation.`);
            try {
                const novel = await db.getNovelDB(idToDelete);
                if (novel) { title = novel.title || 'this novel'; console.log(`UI: Found title: "${title}"`); }
                else { console.warn(`UI: Novel ${idToDelete} not found when fetching title for confirmation.`); title = 'this novel (details unavailable)'; }
            } catch(error) { console.error(`UI: Error fetching title for novel ${idToDelete}:`, error); title = `novel ID ${idToDelete} (error fetching title)`; }
        }

        if (confirm(`⚠️ PERMANENTLY DELETE novel "${title}" and ALL its chapters?\n\nThis action cannot be undone.`)) {
            console.log(`UI: Initiating deletion for novel ${idToDelete}`); hideMessage();
            const listBtnSelector = `.list-item-actions button[data-action="delete"][data-novel-id="${idToDelete}"]`;
            document.querySelectorAll(listBtnSelector).forEach(b => b.disabled = true);
            if (detailElements.deleteBtn && currentNovelId === idToDelete) { detailElements.deleteBtn.disabled = true; }
            const listItem = lists.novel?.querySelector(`li[data-novel-id="${idToDelete}"]`); if (listItem) listItem.style.opacity = '0.5';
            try {
                await db.deleteNovelAndChaptersDB(idToDelete);
                console.log(`UI: Deletion complete for novel ${idToDelete}.`); displayMessage(`Novel "${title}" and its chapters deleted.`, "success");
                if (currentNovelId === idToDelete) { currentNovelId = null; }
                await showNovelListView();
            } catch (error) {
                console.error(`UI: Error deleting novel ${idToDelete}:`, error);
                let errorMsg = `Failed to delete novel: ${error.message || error}`;
                if (error.message && error.message.includes("not found")) { errorMsg = `Failed to delete novel: The novel with ID ${idToDelete} could not be found (already deleted?).`; }
                displayMessage(errorMsg, "error");
                document.querySelectorAll(listBtnSelector).forEach(b => { if(document.body.contains(b)) b.disabled = false; });
                if (detailElements.deleteBtn && document.body.contains(detailElements.deleteBtn) && currentNovelId === idToDelete) { detailElements.deleteBtn.disabled = false; }
                if (listItem && document.body.contains(listItem)) listItem.style.opacity = '1';
                await showNovelListView();
            }
        } else { console.log(`UI: Deletion cancelled for novel ${idToDelete}.`); }
    }


    // --- Form Submission Handlers --- (Keep as before)
    async function handleNovelFormSubmit(event) { event.preventDefault(); if (!novelForm.form || !novelForm.saveBtn) return; const form = novelForm.form; const saveBtn = novelForm.saveBtn; const formData = new FormData(form); const editId = formData.get('editId') ? parseInt(formData.get('editId'), 10) : null; const novelData = { title: formData.get('title')?.trim() || '', author: formData.get('author')?.trim() || '', genre: formData.get('genre')?.trim() || '', description: formData.get('description')?.trim() || '', }; if (!novelData.title) { displayMessage("Novel title is required.", "error"); novelForm.titleInput?.focus(); return; } hideMessage(); saveBtn.disabled = true; const originalButtonText = saveBtn.textContent; saveBtn.textContent = 'Saving...'; try { if (editId && !isNaN(editId)) { novelData.id = editId; const existingNovel = await db.getNovelDB(editId); if (!existingNovel) throw new Error("Novel not found for update (ID: " + editId + "). It might have been deleted."); novelData.lastReadChapterId = existingNovel.lastReadChapterId || null; await db.updateNovelDB(novelData); console.log(`UI: Updated novel ${editId}`); displayMessage(`Novel "${novelData.title}" updated successfully.`, "success"); await showNovelDetailView(editId); } else { novelData.lastReadChapterId = null; const newId = await db.addNovelDB(novelData); console.log(`UI: Added new novel with ID ${newId}`); displayMessage(`Novel "${novelData.title}" added successfully.`, "success"); await showNovelListView(); } form.reset(); } catch (error) { console.error("UI: Error saving novel:", error); displayMessage(`Failed to save novel: ${error.message || error}`, "error"); } finally { saveBtn.disabled = false; saveBtn.textContent = originalButtonText; } }
    async function handleChapterFormSubmit(event) { event.preventDefault(); if (!chapterForm.form || !chapterForm.saveBtn) return; const form = chapterForm.form; const saveBtn = chapterForm.saveBtn; const formData = new FormData(form); const editId = formData.get('editId') ? parseInt(formData.get('editId'), 10) : null; const novelId = parseInt(formData.get('novelId'), 10); if (isNaN(novelId)) { displayMessage("Error: Associated Novel ID is missing or invalid.", "error"); return; } const chapterData = { novelId: novelId, title: formData.get('title')?.trim() || '', content: formData.get('content') || '', }; if (!chapterData.title) { displayMessage("Chapter title is required.", "error"); chapterForm.titleInput?.focus(); return; } if (!chapterData.content?.trim()) { if (!confirm("Chapter content is empty. Save anyway?")) { chapterForm.contentTextarea?.focus(); return; } } hideMessage(); saveBtn.disabled = true; const originalButtonText = saveBtn.textContent; saveBtn.textContent = 'Saving...'; try { if (editId && !isNaN(editId)) { chapterData.id = editId; await db.updateChapterDB(chapterData); console.log(`UI: Updated chapter ${editId}`); displayMessage(`Chapter "${chapterData.title}" updated successfully.`, "success"); } else { const newId = await db.addChapterDB(chapterData); console.log(`UI: Added new chapter ${newId} to novel ${novelId}`); displayMessage(`Chapter "${chapterData.title}" added successfully.`, "success"); } form.reset(); await showNovelDetailView(novelId); } catch (error) { console.error("UI: Error saving chapter:", error); displayMessage(`Failed to save chapter: ${error.message || error}`, "error"); } finally { saveBtn.disabled = false; saveBtn.textContent = originalButtonText; } }

    // --- Import / Export / Download Handlers --- (Keep as before)
    async function handleExportData() { const exportButton = headerControls.exportBtn; if (!exportButton || exportButton.disabled) return; hideMessage(); exportButton.disabled = true; exportButton.textContent = 'Exporting...'; console.log("Export: Checking imported db object:", db); try { if (typeof db.getAllNovelsDB !== 'function' || typeof db.getAllChaptersDB !== 'function') { throw new Error("Database functions (getAllNovelsDB or getAllChaptersDB) are not available. Check db.js export."); } const [novels, chapters] = await Promise.all([ db.getAllNovelsDB(), db.getAllChaptersDB() ]); console.log(`Export: Fetched ${novels?.length ?? 0} novels and ${chapters?.length ?? 0} chapters.`); if (!novels?.length && !chapters?.length) { displayMessage("Nothing to export. Add some novels first!", "info"); } else { const exportData = { exportFormatVersion: EXPORT_VERSION, timestamp: new Date().toISOString(), data: { novels, chapters } }; const jsonString = JSON.stringify(exportData); const dataBlob = new Blob([jsonString], { type: 'application/json' }); const now = new Date(); const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`; const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`; const baseFilename = `NRBackup_${dateStr}_${timeStr}`; if (typeof CompressionStream === "undefined") { displayMessage("Browser lacks compression support. Exporting uncompressed JSON.", "warning"); triggerBlobDownload(dataBlob, `${baseFilename}.json`); } else { try { const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip')); const compressedBlob = await new Response(compressedStream).blob(); triggerBlobDownload(compressedBlob, `${baseFilename}.json.gz`); displayMessage("Backup exported successfully (compressed).", "success"); } catch (compressionError) { console.error("Export: Compression failed:", compressionError); displayMessage("Compression failed. Exporting uncompressed JSON.", "warning"); triggerBlobDownload(dataBlob, `${baseFilename}.json`); } } } } catch (error) { console.error('UI: Export error:', error); displayMessage(`Export failed: ${error.message || error}`, "error"); } finally { exportButton.disabled = false; exportButton.textContent = 'Export'; } }
    function handleImportFileSelect(event) { const file = event.target.files?.[0]; const inputElement = headerControls.importInput; const labelElement = headerControls.importLabel; if (!file || !inputElement || !labelElement) { if (inputElement) inputElement.value = ''; return; } const isCompressed = file.name.endsWith('.gz'); const isJson = file.name.endsWith('.json') || file.name.endsWith('.json.gz'); if (!isJson) { displayMessage("Import failed: File must be a .json or .json.gz backup file.", "error"); inputElement.value = ''; return; } if (isCompressed && typeof DecompressionStream === "undefined") { displayMessage("Import failed: Browser cannot decompress .gz files.", "error"); inputElement.value = ''; return; } if (!confirm(`⚠️ WARNING: This will DELETE ALL existing novels and chapters and replace them with data from "${file.name}".\n\nThis action cannot be undone. Continue?`)) { inputElement.value = ''; return; } importData(file, isCompressed); }
    async function importData(file, isCompressed) { const importLabel = headerControls.importLabel; const importInput = headerControls.importInput; hideMessage(); displayMessage("Importing data... Please wait.", "info", true); if (importLabel) { importLabel.style.pointerEvents = 'none'; importLabel.style.opacity = '0.6'; importLabel.setAttribute('aria-disabled', 'true'); } try { let jsonString; if (isCompressed) { console.log("Import: Decompressing file..."); const ds = new DecompressionStream('gzip'); const decompressedStream = file.stream().pipeThrough(ds); jsonString = await new Response(decompressedStream).text(); console.log("Import: Decompression complete."); } else { jsonString = await file.text(); } console.log("Import: Parsing JSON..."); const importedObject = JSON.parse(jsonString); console.log("Import: JSON parsed."); if (!importedObject?.data || !Array.isArray(importedObject.data.novels) || !Array.isArray(importedObject.data.chapters)) { throw new Error("Invalid backup file structure. Missing 'data', 'novels', or 'chapters' array."); } const fileVersion = importedObject.exportFormatVersion; if (fileVersion && fileVersion > EXPORT_VERSION) { console.warn(`Import: Backup file version (${fileVersion}) is newer than app's expected version (${EXPORT_VERSION}). Compatibility issues may arise.`); } const novelsToImport = importedObject.data.novels; const chaptersToImport = importedObject.data.chapters; console.log(`Import: Found ${novelsToImport.length} novels and ${chaptersToImport.length} chapters.`); const importResults = await db.importDataDB(novelsToImport, chaptersToImport); console.log("Import: Database operation complete.", importResults); displayMessage(`Import Complete! Added ${importResults.novelsAdded} novels, ${importResults.chaptersAdded} chapters. Skipped ${importResults.novelsSkipped} novels, ${importResults.chaptersSkipped} chapters. Last read updated/failed: ${importResults.lastReadUpdated}/${importResults.lastReadFailed}.`, "success"); currentNovelId = null; await showNovelListView(); } catch (error) { console.error('UI: Import error:', error); let errorMessage = `Import FAILED: ${error.message || error}.`; if (error instanceof SyntaxError) { errorMessage += " The file might be corrupted or not valid JSON."; } errorMessage += " Data may be in an inconsistent state. Consider re-importing or clearing data."; displayMessage(errorMessage, "error", true); await showNovelListView(); } finally { if (importInput) importInput.value = ''; if (importLabel) { importLabel.style.pointerEvents = 'auto'; importLabel.style.opacity = '1'; importLabel.removeAttribute('aria-disabled'); } } }
    async function handleDownloadSingleChapter(chapterId, buttonElement) { const idToDownload = parseInt(chapterId, 10); if (isNaN(idToDownload)) { displayMessage("Invalid chapter ID for download.", "error"); if(buttonElement) buttonElement.disabled = false; return; } console.log(`UI: Downloading single chapter ${idToDownload}`); hideMessage(); const originalText = buttonElement?.textContent || '↓'; if(buttonElement) buttonElement.textContent = '...'; try { const chapter = await db.getChapterDB(idToDownload); if (!chapter) { throw new Error("Chapter not found."); } const novel = chapter.novelId ? await db.getNovelDB(chapter.novelId) : null; const novelTitleSafe = sanitizeFilename(novel?.title || 'UnknownNovel'); const chapterTitleSafe = sanitizeFilename(chapter.title || `Chapter_${chapter.id}`); const baseFilename = `${novelTitleSafe}_${chapterTitleSafe}`; const content = chapter.content || ''; const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); if (typeof CompressionStream === "undefined") { displayMessage("Compression not supported, downloading as .txt", "warning"); triggerBlobDownload(blob, `${baseFilename}.txt`); } else { try { const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip')); const compressedBlob = await new Response(compressedStream).blob(); triggerBlobDownload(compressedBlob, `${baseFilename}.txt.gz`); } catch(compressionError) { console.error(`UI: Compression failed for chapter ${idToDownload}:`, compressionError); displayMessage("Compression failed. Downloading as .txt", "warning"); triggerBlobDownload(blob, `${baseFilename}.txt`); } } } catch(error) { console.error(`UI: Error downloading chapter ${idToDownload}:`, error); displayMessage(`Download failed: ${error.message}`, "error"); } finally { if(buttonElement && document.body.contains(buttonElement)) { buttonElement.textContent = originalText; buttonElement.disabled = false; } } }
    async function handleDownloadAllChapters() { if (!currentNovelId) { displayMessage("No novel selected.", "error"); return; } const downloadBtn = detailElements.downloadAllBtn; if (!downloadBtn || downloadBtn.disabled) return; const idToDownload = parseInt(currentNovelId, 10); if (isNaN(idToDownload)) { displayMessage("Invalid novel ID for bulk download.", "error"); return; } hideMessage(); console.log(`UI: Starting bulk download for novel ${idToDownload}`); downloadBtn.disabled = true; downloadBtn.textContent = 'Preparing...'; try { const [novel, chapters] = await Promise.all([ db.getNovelDB(idToDownload), db.getAllChaptersForNovelDB(idToDownload) ]); if (!novel) { throw new Error("Novel not found."); } if (!chapters || chapters.length === 0) { displayMessage("This novel has no chapters to download.", "info"); } else { chapters.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' })); console.log(`UI: Assembling content for ${chapters.length} chapters...`); let bulkContent = `Novel: ${novel.title || 'Untitled Novel'}\n`; if (novel.author) bulkContent += `Author: ${novel.author}\n`; if (novel.genre) bulkContent += `Genre: ${novel.genre}\n`; bulkContent += `Exported: ${new Date().toLocaleString()}\n\n========================================\n\n`; chapters.forEach((ch, index) => { bulkContent += `CHAPTER ${index + 1}: ${ch.title || 'Untitled Chapter'}\n----------------------------------------\n\n`; bulkContent += (ch.content || '(This chapter has no content)'); bulkContent += "\n\n========================================\n\n"; }); const filenameBase = sanitizeFilename(novel.title || `Novel_${novel.id}`); const blob = new Blob([bulkContent], { type: 'text/plain;charset=utf-8' }); if (typeof CompressionStream === "undefined") { displayMessage("Compression not supported, downloading as .txt", "warning"); triggerBlobDownload(blob, `${filenameBase}_AllChapters.txt`); } else { try { const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip')); const compressedBlob = await new Response(compressedStream).blob(); triggerBlobDownload(compressedBlob, `${filenameBase}_AllChapters.txt.gz`); displayMessage("Bulk chapter download started.", "success"); } catch (compressionError) { console.error(`UI: Compression failed for bulk download novel ${idToDownload}:`, compressionError); displayMessage("Compression failed. Downloading as .txt", "warning"); triggerBlobDownload(blob, `${filenameBase}_AllChapters.txt`); } } } } catch (error) { console.error(`UI: Bulk download error for novel ${idToDownload}:`, error); displayMessage(`Bulk download failed: ${error.message}`, "error"); } finally { downloadBtn.disabled = false; downloadBtn.textContent = 'Download All (.txt.gz)'; } }

    // --- Preferences --- (Keep as before)
    function applyTheme(theme) { const isDark = theme === 'dark'; document.body.classList.toggle('dark-mode', isDark); if (headerControls.themeToggle) { headerControls.themeToggle.textContent = isDark ? '☀️' : '🌙'; headerControls.themeToggle.title = `Switch to ${isDark ? 'Light' : 'Dark'} Mode`; headerControls.themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'Light' : 'Dark'} Mode`); } try { localStorage.setItem('novelReaderTheme', theme); } catch (e) { console.warn("Prefs: Failed to save theme preference to localStorage.", e); } }
    function applyFontSize(size) { const newSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size)); if (newSize !== currentFontSize && appContainer && headerControls.fontSizeDisplay) { appContainer.style.fontSize = `${newSize}px`; currentFontSize = newSize; headerControls.fontSizeDisplay.textContent = newSize; try { localStorage.setItem('novelReaderFontSize', newSize.toString()); } catch (e) { console.warn("Prefs: Failed to save font size preference to localStorage.", e); } } if (headerControls.fontDecrease) headerControls.fontDecrease.disabled = (newSize <= MIN_FONT_SIZE); if (headerControls.fontIncrease) headerControls.fontIncrease.disabled = (newSize >= MAX_FONT_SIZE); }
    function loadPreferences() { console.log("Prefs: Loading preferences..."); let theme = 'light'; let size = DEFAULT_FONT_SIZE; try { theme = localStorage.getItem('novelReaderTheme') || 'light'; const storedSize = localStorage.getItem('novelReaderFontSize'); size = storedSize ? parseInt(storedSize, 10) : DEFAULT_FONT_SIZE; if (isNaN(size) || size < MIN_FONT_SIZE || size > MAX_FONT_SIZE) { size = DEFAULT_FONT_SIZE; } } catch (e) { console.warn("Prefs: Failed to load preferences from localStorage.", e); } console.log(`Prefs: Applying theme='${theme}', fontSize=${size}`); applyTheme(theme); applyFontSize(size); }

    // === Utility Functions === (Keep as before)
    function displayMessage(message, type = 'info', isSticky = false) { if (!messageDisplay) return; clearTimeout(messageTimeout); let cssClass = ''; let ariaLive = 'polite'; switch (type) { case 'error': cssClass = 'error-box'; ariaLive = 'assertive'; break; case 'success': cssClass = 'success-box'; break; case 'info': case 'warning': cssClass = type === 'warning' ? 'error-box' : 'success-box'; break; default: cssClass = 'success-box'; break; } const logFn = type === 'error' || type === 'warning' ? console.error : console.log; logFn(`UI Message (${type}):`, message); messageDisplay.className = `message-box ${cssClass}`; messageDisplay.textContent = message; messageDisplay.setAttribute('aria-live', ariaLive); messageDisplay.hidden = false; void messageDisplay.offsetWidth; if (!isSticky) { const duration = (type === 'error' || type === 'warning') ? 6000 : 4000; messageTimeout = setTimeout(hideMessage, duration); } }
    function hideMessage() { if (!messageDisplay) return; clearTimeout(messageTimeout); messageDisplay.hidden = true; messageDisplay.textContent = ''; messageDisplay.className = 'message-box'; messageDisplay.setAttribute('aria-live', 'off'); }
    function sanitizeFilename(name) { if (!name) return 'download'; let s = name.replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, ''); s = s.substring(0, 150); return (s && s !== '.' && s !== '..') ? s : 'download'; }
    function triggerBlobDownload(blob, filename) { try { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { if(document.body.contains(a)) { document.body.removeChild(a); } URL.revokeObjectURL(url); console.log(`Download triggered and cleanup initiated for: ${filename} (${blob.size} bytes)`); }, 150); } catch (e) { console.error("UI: Download trigger error:", e); displayMessage("Download could not be initiated.", "error"); } }

    // --- Start the App ---
    initializeApp();

}); // End DOMContentLoaded