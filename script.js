document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    let currentNovelId = null;
    let currentChapterIndex = -1;
    let novelsMetadata = [];
    let opfsRoot = null;

    // --- DOM References (Cached) ---
    const pages = document.querySelectorAll('.page');
    const novelList = document.getElementById('novel-list');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const novelModal = document.getElementById('novel-modal');
    const chapterModal = document.getElementById('chapter-modal');
    const readerSettingsModal = document.getElementById('reader-settings-modal');
    const readerContentContainer = document.getElementById('reader-content-container');
    const readerContent = document.getElementById('reader-content');
    const readerChapterTitle = document.getElementById('reader-chapter-title');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const importFileInput = document.getElementById('import-file-input');
    const exportButton = document.getElementById('export-btn');
    const importButton = document.getElementById('import-btn');
    const deleteAllDataBtn = document.getElementById('delete-all-data-btn');
    const prevChapterBtn = document.getElementById('prev-chapter-btn');
    const nextChapterBtn = document.getElementById('next-chapter-btn');
    const novelInfoTitle = document.getElementById('novel-info-title');
    const novelInfoAuthor = document.getElementById('novel-info-author');
    const novelInfoGenre = document.getElementById('novel-info-genre');
    const novelInfoDescription = document.getElementById('novel-info-description');
    const novelInfoLastRead = document.getElementById('novel-info-last-read');
    const chapterListEl = document.getElementById('chapter-list');
    const bulkDownloadBtn = document.getElementById('bulk-download-chapters-btn');
    // Novel Modal Inputs
    const novelModalTitleHeading = document.getElementById('novel-modal-title-heading');
    const novelModalIdInput = document.getElementById('novel-modal-id');
    const novelModalTitleInput = document.getElementById('novel-modal-title-input');
    const novelModalAuthorInput = document.getElementById('novel-modal-author-input');
    const novelModalGenreInput = document.getElementById('novel-modal-genre-input');
    const novelModalDescriptionInput = document.getElementById('novel-modal-description-input');
    // Chapter Modal Inputs
    const chapterModalTitleHeading = document.getElementById('chapter-modal-title-heading');
    const chapterModalNovelIdInput = document.getElementById('chapter-modal-novel-id');
    const chapterModalIndexInput = document.getElementById('chapter-modal-index');
    const chapterModalTitleInput = document.getElementById('chapter-modal-title-input');
    const chapterModalContentInput = document.getElementById('chapter-modal-content-input');

    // --- Constants ---
    const METADATA_KEY = 'novelsMetadata';
    const THEME_KEY = 'novelReaderTheme';
    const FONT_KEY = 'novelReaderFont';
    const FONT_SIZE_KEY = 'novelReaderFontSize';
    const DEFAULT_FONT = 'Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_THEME = 'light';
    const MODAL_CLOSE_DELAY = 180;

    // --- Initialization ---
    async function initializeApp() {
        registerServiceWorker();
        const opfsReady = await initOPFS();
        if (!opfsReady) {
            alert("Warning: Origin Private File System (OPFS) is not available or could not be initialized. Saving/loading chapters might not work correctly.");
        }
        loadSettings();
        loadNovelsMetadata();
        renderNovelList();
        setupEventListeners();
        showPage('home-page');
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered:', reg.scope))
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }

    async function initOPFS() {
        try {
            if (navigator.storage && navigator.storage.getDirectory) {
                opfsRoot = await navigator.storage.getDirectory();
                console.log("OPFS Root acquired.");
                return true;
            } else {
                console.warn('OPFS API (navigator.storage.getDirectory) not supported.');
                return false;
            }
        } catch (error) {
            console.error('OPFS Initialization Error:', error);
            opfsRoot = null;
            return false;
        }
    }

    // --- Navigation ---
    function showPage(pageId) {
        let activePage = null;
        pages.forEach(page => {
            const isActive = page.id === pageId;
            page.classList.toggle('active', isActive);
            if (isActive) activePage = page;
        });

        if (activePage) {
            const contentArea = activePage.querySelector('.page-content');
            if (contentArea) {
                contentArea.scrollTop = 0;
            } else {
                 activePage.scrollTop = 0;
            }
        } else {
            window.scrollTo(0, 0);
        }

        if (pageId === 'novel-info-page' && currentNovelId) {
            loadNovelInfoPage(currentNovelId);
        }
        if (pageId === 'reader-page' && currentNovelId !== null && currentChapterIndex !== -1) {
            loadReaderPage(currentNovelId, currentChapterIndex);
        }
    }

    // --- Settings (Theme, Font, Size) ---
    function loadSettings() {
        const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        const font = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        const fontSize = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        applyTheme(theme, false);
        applyReaderStyles(font, fontSize, false);
        fontSelect.value = font;
        fontSizeSelect.value = fontSize;
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Failed to save setting ${key}:`, error);
            alert(`Error saving setting: ${key}`);
        }
    }

    function applyTheme(theme, save = true) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`);
        const lightMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const darkMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        const lightColor = "#f8f9fa";
        const darkColor = "#1e1e1e";
        if (theme === 'dark') {
             if (lightMatcher) lightMatcher.content = darkColor;
             if (darkMatcher) darkMatcher.content = darkColor;
        } else {
            if (lightMatcher) lightMatcher.content = lightColor;
            if (darkMatcher) darkMatcher.content = lightColor;
        }
        if (save) saveSetting(THEME_KEY, theme);
    }

    function applyReaderStyles(font, size, save = true) {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--font-family-reader', font);
        rootStyle.setProperty('--font-size-reader', size);
        const sizePx = parseInt(size, 10);
        rootStyle.setProperty('--line-height-reader', sizePx > 20 ? '1.8' : '1.7');
        if (save) {
            saveSetting(FONT_KEY, font);
            saveSetting(FONT_SIZE_KEY, size);
        }
    }

    // --- Metadata Handling (localStorage) ---
    function loadNovelsMetadata() {
        const storedMetadata = localStorage.getItem(METADATA_KEY);
        novelsMetadata = [];
        if (storedMetadata) {
            try {
                const parsed = JSON.parse(storedMetadata);
                if (Array.isArray(parsed)) {
                    novelsMetadata = parsed.map(novel => ({
                        id: novel.id || crypto.randomUUID(),
                        title: novel.title || 'Untitled Novel',
                        author: novel.author || '',
                        genre: novel.genre || '',
                        description: novel.description || '',
                        chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                            title: ch.title || 'Untitled Chapter',
                            opfsFileName: ch.opfsFileName || ''
                        })) : [],
                        lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
                    }));
                } else {
                     throw new Error("Stored metadata is not an array.");
                }
            } catch (e) {
                console.error("Failed parsing novels metadata:", e);
                localStorage.removeItem(METADATA_KEY);
                alert("Could not load novel list due to corrupted data. The list has been reset.");
            }
        }
        novelsMetadata.sort((a, b) => a.title.localeCompare(b.title));
    }

    function saveNovelsMetadata() {
        try {
            novelsMetadata.sort((a, b) => a.title.localeCompare(b.title));
            localStorage.setItem(METADATA_KEY, JSON.stringify(novelsMetadata));
        } catch (error) {
            console.error("Failed saving novels metadata:", error);
            alert("Error saving novel list. Storage might be full.");
        }
    }

    function findNovel(novelId) {
        return novelsMetadata.find(n => n.id === novelId);
    }

    function findChapter(novelId, chapterIndex) {
        const novel = findNovel(novelId);
        return (novel?.chapters && chapterIndex >= 0 && chapterIndex < novel.chapters.length)
               ? novel.chapters[chapterIndex]
               : null;
    }

    // --- OPFS File Operations ---
    async function getNovelDir(novelId, create = false) {
        if (!opfsRoot) throw new Error("OPFS not initialized or available.");
        try {
            return await opfsRoot.getDirectoryHandle(novelId, { create });
        } catch (error) {
            console.error(`Error getting directory handle for novel ${novelId} (create: ${create}):`, error);
            throw error;
        }
    }

    async function saveChapterContent(novelId, chapterIndex, content) {
        if (!opfsRoot) throw new Error("OPFS not ready for saving.");
        const novel = findNovel(novelId);
        const chapter = novel?.chapters?.[chapterIndex]; // Use optional chaining
        if (!chapter) throw new Error(`Chapter metadata missing for novel ${novelId}, index ${chapterIndex}.`);
        const fileName = `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        chapter.opfsFileName = fileName;
        try {
            const novelDirHandle = await getNovelDir(novelId, true);
            const fileHandle = await novelDirHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            return true;
        } catch (error) {
            console.error(`Error saving chapter ${chapterIndex} content (file: ${fileName}):`, error);
            throw new Error(`Failed to save chapter file: ${error.message}`);
        }
    }

    async function readChapterContent(novelId, chapterIndex) {
        if (!opfsRoot) return "Error: File storage unavailable.";
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter) return "Error: Chapter metadata not found.";
        const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return "Error: Chapter file information missing.";
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            const fileHandle = await novelDirHandle.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            return await file.text();
        } catch (error) {
            if (error.name === 'NotFoundError') {
                console.warn(`File not found for chapter ${chapterIndex} (Novel ${novelId}, File: ${fileName}).`);
                return `Error: Chapter file (${fileName}) not found in storage.`;
            }
            console.error(`Error reading chapter ${chapterIndex} (file: ${fileName}):`, error);
            return `Error reading file: ${error.message}`;
        }
    }

    async function deleteChapterFile(novelId, chapterIndex) {
        if (!opfsRoot) {
            console.warn("OPFS not available, cannot delete chapter file.");
            return false;
        }
        const chapter = findChapter(novelId, chapterIndex);
        const fileName = chapter?.opfsFileName;
        if (!fileName) {
            console.warn(`Skipping file deletion for chapter ${chapterIndex} (Novel ${novelId}): No filename stored.`);
            return true;
        }
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(fileName);
            console.log(`Deleted file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}).`);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') {
                console.warn(`Attempted delete file ${fileName} (chapter ${chapterIndex}, novel ${novelId}), not found.`);
                return true;
            }
            console.error(`Error deleting file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}):`, error);
            return false;
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) return;
        if (opfsRoot) {
            try {
                console.log(`Attempting remove OPFS dir: ${novelId}`);
                await opfsRoot.removeEntry(novelId, { recursive: true });
                console.log(`Removed OPFS dir: ${novelId}`);
            } catch (error) {
                if (error.name !== 'NotFoundError') {
                    console.error(`Error deleting OPFS dir ${novelId}:`, error);
                    alert(`Warning: Could not delete all files for novel "${novel.title}".`);
                } else {
                    console.log(`OPFS dir ${novelId} not found, skipping removal.`);
                }
            }
        } else {
            console.warn("OPFS not available, cannot delete novel dir.");
        }
        const novelIndex = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIndex > -1) {
            novelsMetadata.splice(novelIndex, 1);
            saveNovelsMetadata();
            console.log(`Removed metadata for novel: ${novelId}`);
        }
    }

    async function deleteAllData() {
        if (!confirm('⚠️ WARNING! ⚠️\n\nDelete ALL novels, chapters, progress, and settings?\nThis CANNOT be undone.\n\nProceed?')) return;
        localStorage.removeItem(METADATA_KEY);
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem(FONT_KEY);
        localStorage.removeItem(FONT_SIZE_KEY);
        novelsMetadata = [];
        console.log("Cleared localStorage data.");
        if (opfsRoot) {
            console.log("Clearing OPFS directories...");
            try {
                const entries = [];
                for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entries.push(entry.name); }
                console.log(`Found OPFS dirs to remove: ${entries.join(', ')}`);
                await Promise.all(
                    entries.map(name => opfsRoot.removeEntry(name, { recursive: true })
                            .then(() => console.log(`Removed OPFS dir: ${name}`))
                            .catch(err => console.error(`Failed remove OPFS dir ${name}:`, err)))
                );
                console.log("Finished OPFS clearing.");
            } catch (error) {
                console.error('Error listing/clearing OPFS:', error);
                alert('Could not auto-clear all stored novel files.');
            }
        } else {
            console.warn("OPFS not available, skipping OPFS clear.");
        }
        applyTheme(DEFAULT_THEME);
        applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE);
        fontSelect.value = DEFAULT_FONT;
        fontSizeSelect.value = DEFAULT_FONT_SIZE;
        renderNovelList();
        showPage('home-page');
        alert('All application data deleted.');
    }

    // --- UI Rendering ---
    function renderNovelList() {
        novelList.innerHTML = '';
        if (novelsMetadata.length === 0) {
            novelList.innerHTML = '<li class="placeholder">No novels yet. Use ➕ to add one!</li>';
            exportButton.disabled = true;
            exportButton.setAttribute('aria-disabled', 'true');
            return;
        }
        exportButton.disabled = false;
        exportButton.setAttribute('aria-disabled', 'false');
        novelsMetadata.forEach(novel => {
            const li = document.createElement('li');
            li.dataset.novelId = novel.id;
            li.setAttribute('role', 'button');
            li.tabIndex = 0;
            li.setAttribute('aria-label', `Open novel: ${novel.title || 'Untitled Novel'}`);
            li.innerHTML = `
                <div class="item-content">
                    <span class="title"></span>
                    <span class="subtitle"></span>
                </div>
                <span aria-hidden="true" style="margin-left: auto; color: var(--text-muted); font-size: 1.2em;">›</span>
            `;
            li.querySelector('.title').textContent = novel.title || 'Untitled Novel';
            li.querySelector('.subtitle').textContent = novel.author || 'Unknown Author';
            const navigate = () => { currentNovelId = novel.id; showPage('novel-info-page'); };
            li.addEventListener('click', navigate);
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); } });
            novelList.appendChild(li);
        });
    }

    function loadNovelInfoPage(novelId) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.error(`Novel info load failed: ID ${novelId} not found.`);
            alert("Error: Could not find selected novel.");
            showPage('home-page');
            return;
        }
        novelInfoTitle.textContent = novel.title || 'Untitled Novel';
        novelInfoAuthor.textContent = novel.author || 'N/A';
        novelInfoGenre.textContent = novel.genre || 'N/A';
        novelInfoDescription.textContent = novel.description || 'No description provided.';
        const lastReadChapter = findChapter(novelId, novel.lastReadChapterIndex);
        if (lastReadChapter) {
            novelInfoLastRead.textContent = lastReadChapter.title || `Chapter ${novel.lastReadChapterIndex + 1}`;
            novelInfoLastRead.classList.add('clickable');
            novelInfoLastRead.setAttribute('role', 'link');
            novelInfoLastRead.tabIndex = 0;
            novelInfoLastRead.setAttribute('aria-label', `Continue reading: ${novelInfoLastRead.textContent}`);
            novelInfoLastRead.onclick = () => { currentChapterIndex = novel.lastReadChapterIndex; showPage('reader-page'); };
             novelInfoLastRead.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); novelInfoLastRead.click(); } };
        } else {
            novelInfoLastRead.textContent = 'Never';
            novelInfoLastRead.classList.remove('clickable');
            novelInfoLastRead.removeAttribute('role');
            novelInfoLastRead.tabIndex = -1;
            novelInfoLastRead.removeAttribute('aria-label');
            novelInfoLastRead.onclick = null;
            novelInfoLastRead.onkeydown = null;
        }
        renderChapterList(novelId);
    }

    function renderChapterList(novelId) {
        const novel = findNovel(novelId);
        chapterListEl.innerHTML = '';
        const chapters = novel?.chapters || [];
        bulkDownloadBtn.disabled = chapters.length === 0;
        bulkDownloadBtn.setAttribute('aria-disabled', chapters.length === 0 ? 'true' : 'false');
        if (chapters.length === 0) {
            chapterListEl.innerHTML = '<li class="placeholder">No chapters added yet.</li>';
            return;
        }
        chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.dataset.chapterIndex = index;
            li.innerHTML = `
                <div class="item-content chapter-title-container" role="button" tabIndex="0">
                    <span class="title"></span>
                </div>
                <div class="item-actions chapter-controls">
                    <button class="edit-chapter-btn icon-btn" aria-label="Edit Chapter">✏️</button>
                    <button class="download-chapter-btn icon-btn" aria-label="Download Chapter">💾</button>
                    <button class="delete-chapter-btn icon-btn danger" aria-label="Delete Chapter">🗑️</button>
                </div>`;
            const chapterTitle = chapter.title || `Chapter ${index + 1}`;
            li.querySelector('.title').textContent = chapterTitle;
            const titleContainer = li.querySelector('.chapter-title-container');
            titleContainer.setAttribute('aria-label', `Read ${chapterTitle}`);
            const navigateToReader = () => { currentChapterIndex = index; showPage('reader-page'); };
            titleContainer.addEventListener('click', navigateToReader);
            titleContainer.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToReader(); } });
            li.querySelector('.edit-chapter-btn').addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, index); });
            li.querySelector('.download-chapter-btn').addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, index); });
            li.querySelector('.delete-chapter-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Delete chapter: "${chapterTitle}"?\nThis removes its content permanently.`)) {
                    const deleteSuccess = await deleteChapterFile(novelId, index);
                    if (deleteSuccess) {
                        novel.chapters.splice(index, 1);
                        if (novel.lastReadChapterIndex === index) novel.lastReadChapterIndex = -1;
                        else if (novel.lastReadChapterIndex > index) novel.lastReadChapterIndex--;
                        saveNovelsMetadata();
                        renderChapterList(novelId);
                        loadNovelInfoPage(novelId); // Update last read potentially
                    } else {
                        alert(`Failed to delete file for chapter "${chapterTitle}". Metadata not removed.`);
                    }
                }
            });
            chapterListEl.appendChild(li);
        });
    }

    async function loadReaderPage(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);
        if (!chapter || !novel) {
            console.error(`Reader load failed: Novel (${novelId}) or Chapter (${chapterIndex}) not found.`);
            readerContent.innerHTML = '<p>Error: Could not load chapter data.</p>';
            readerChapterTitle.textContent = "Error";
            prevChapterBtn.disabled = true; prevChapterBtn.setAttribute('aria-disabled', 'true');
            nextChapterBtn.disabled = true; nextChapterBtn.setAttribute('aria-disabled', 'true');
            return;
        }
        readerChapterTitle.textContent = chapter.title || `Chapter ${chapterIndex + 1}`;
        readerContent.innerHTML = '<p>Loading...</p>';
        novel.lastReadChapterIndex = chapterIndex;
        saveNovelsMetadata();
        if (document.getElementById('novel-info-page')) loadNovelInfoPage(novelId);
        const content = await readChapterContent(novelId, chapterIndex);
        if (content.startsWith("Error:")) {
            readerContent.innerHTML = `<p style="color: var(--danger-color);">${content}</p>`;
        } else {
            readerContent.innerHTML = `<p>${content.replace(/\n/g, '</p><p>')}</p>`; // Simple paragraph wrap
        }
        prevChapterBtn.disabled = (chapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', prevChapterBtn.disabled ? 'true' : 'false');
        nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', nextChapterBtn.disabled ? 'true' : 'false');
        readerContentContainer.scrollTo(0, 0);
    }

    // --- Modal Handling ---
    function closeModal(modalElement) {
        if (!modalElement) return;
        modalElement.classList.add('closing');
        setTimeout(() => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
        }, MODAL_CLOSE_DELAY);
    }

    // --- Novel Modal ---
    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;
        if (isEditing && !novel) {
            alert("Error: Novel to edit not found."); return;
        }
        novelModalTitleHeading.textContent = isEditing ? "Edit Novel Details" : "Add New Novel";
        novelModalIdInput.value = novelIdToEdit || '';
        novelModalTitleInput.value = novel?.title || '';
        novelModalAuthorInput.value = novel?.author || '';
        novelModalGenreInput.value = novel?.genre || '';
        novelModalDescriptionInput.value = novel?.description || '';
        novelModal.style.display = 'block';
        novelModalTitleInput.focus();
    }

    function closeNovelModal() { closeModal(novelModal); }

    function saveNovelFromModal() {
        const id = novelModalIdInput.value;
        const title = novelModalTitleInput.value.trim();
        if (!title) { alert("Novel Title required."); novelModalTitleInput.focus(); return; }
        const author = novelModalAuthorInput.value.trim();
        const genre = novelModalGenreInput.value.trim();
        const description = novelModalDescriptionInput.value;
        let novelToUpdate;
        const isEditing = !!id;
        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) { alert("Error: Could not find novel to update."); closeNovelModal(); return; }
            Object.assign(novelToUpdate, { title, author, genre, description });
        } else {
            novelToUpdate = { id: crypto.randomUUID(), title, author, genre, description, chapters: [], lastReadChapterIndex: -1 };
            novelsMetadata.push(novelToUpdate);
            currentNovelId = novelToUpdate.id;
        }
        saveNovelsMetadata();
        closeNovelModal();
        renderNovelList();
        if (isEditing) { if (document.getElementById('novel-info-page').classList.contains('active')) loadNovelInfoPage(id); }
        else { showPage('novel-info-page'); }
    }

    // --- Chapter Modal ---
    async function openChapterModal(novelId, chapterIndex = null) {
        const novel = findNovel(novelId);
        if (!novel) { alert("Error: Novel not found."); return; }
        const isEditing = chapterIndex !== null;
        const chapter = isEditing ? findChapter(novelId, chapterIndex) : null;
        if (isEditing && chapter === null) { alert("Error: Chapter to edit not found."); return; }
        chapterModalTitleHeading.textContent = isEditing ? "Edit Chapter" : "Add New Chapter";
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = chapterIndex !== null ? chapterIndex : '';
        chapterModalTitleInput.value = chapter?.title || '';
        if (isEditing) {
            chapterModalContentInput.value = 'Loading content...';
            chapterModalContentInput.disabled = true;
            chapterModal.style.display = 'block';
            try {
                const rawContent = await readChapterContent(novelId, chapterIndex);
                if (rawContent.startsWith("Error:")) {
                     chapterModalContentInput.value = `Load error.\n${rawContent}\n\nYou can edit title or save new content.`;
                     chapterModalContentInput.disabled = false;
                } else {
                    chapterModalContentInput.value = rawContent;
                    chapterModalContentInput.disabled = false;
                }
            } catch(e) {
                chapterModalContentInput.value = `Error loading: ${e.message}`;
                chapterModalContentInput.disabled = true;
            }
        } else {
            chapterModalContentInput.value = '';
            chapterModalContentInput.disabled = false;
            chapterModal.style.display = 'block';
        }
        chapterModalTitleInput.focus();
    }

    function closeChapterModal() {
        closeModal(chapterModal);
        chapterModalTitleInput.value = '';
        chapterModalContentInput.value = '';
        chapterModalNovelIdInput.value = '';
        chapterModalIndexInput.value = '';
        chapterModalContentInput.disabled = false;
    }

    async function saveChapterFromModal() {
        const novelId = chapterModalNovelIdInput.value;
        const indexStr = chapterModalIndexInput.value;
        const title = chapterModalTitleInput.value.trim();
        const content = chapterModalContentInput.value;
        const novel = findNovel(novelId);

        if (!title) { alert("Chapter Title required."); chapterModalTitleInput.focus(); return; }
        if (!content && !confirm("Content empty. Save anyway?")) { chapterModalContentInput.focus(); return; }
        if (!novel) { alert("Error: Associated novel missing."); closeChapterModal(); return; }

        const isNewChapter = indexStr === '';
        const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10);

        if (!isNewChapter && (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= novel.chapters.length)) {
            alert("Error: Invalid chapter index."); closeChapterModal(); return;
        }

        let chapterData;
        let addedTemporarily = false;

        try {
            if (isNewChapter) {
                chapterData = { title: title, opfsFileName: '' };
                novel.chapters.push(chapterData); // Add metadata temporarily
                addedTemporarily = true;
            } else {
                chapterData = novel.chapters[chapterIndex];
                chapterData.title = title;
            }

            await saveChapterContent(novelId, chapterIndex, content); // Saves file & updates opfsFileName
            saveNovelsMetadata(); // Persist metadata changes
            closeChapterModal();
            renderChapterList(novelId);
            console.log(`Saved chapter ${chapterIndex} for novel ${novelId}.`);

        } catch (error) {
            console.error(`Failed save chapter ${chapterIndex}, novel ${novelId}:`, error);
            alert(`Chapter save failed: ${error.message}`);
            if (addedTemporarily) {
                novel.chapters.pop(); // Rollback temporary metadata add
                console.log("Rolled back temp metadata add.");
            }
        }
    }

    // --- Reader Settings Modal ---
    function openReaderSettingsModal() {
        fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        readerSettingsModal.style.display = 'block';
    }
    function closeReaderSettingsModal() { closeModal(readerSettingsModal); }

    // --- Import / Export ---
    async function exportAllData() {
        if (!novelsMetadata?.length) { alert("No novels to export."); return; }
        if (!window.CompressionStream || !opfsRoot) { alert("Export failed: Browser support missing."); return; }
        exportButton.textContent = '📤';
        exportButton.disabled = true;
        exportButton.ariaLabel = 'Exporting...';
        try {
            const exportObject = { version: 1, metadata: [], chapters: {} };
            let chapterReadErrors = 0;
            console.log("Starting export...");
            exportObject.metadata = JSON.parse(JSON.stringify(novelsMetadata));
            for (const novel of novelsMetadata) {
                exportObject.chapters[novel.id] = {};
                if (novel.chapters?.length) {
                    for (let i = 0; i < novel.chapters.length; i++) {
                        try {
                            const content = await readChapterContent(novel.id, i);
                            if (content.startsWith("Error:")) throw new Error(content);
                            exportObject.chapters[novel.id][i] = content;
                        } catch (readError) {
                            console.error(`Export Read Error Ch ${i} (Novel ${novel.id}):`, readError);
                            exportObject.chapters[novel.id][i] = `###EXPORT_READ_ERROR### ${readError.message}`;
                            chapterReadErrors++;
                        }
                    }
                }
            }
            if (chapterReadErrors > 0) alert(`Warning: ${chapterReadErrors} chapter(s) couldn't be read.`);
            const jsonString = JSON.stringify(exportObject);
            const dataBlob = new Blob([jsonString], { type: 'application/json' });
            const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(compressedStream).blob();
            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14);
            a.download = `novels_backup_${timestamp}.novelarchive.gz`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Export complete.");
            alert("Export complete! File downloading.");
        } catch (error) {
            console.error("Export failed:", error); alert(`Export failed: ${error.message}`);
        } finally {
            exportButton.textContent = '📤'; exportButton.disabled = false; exportButton.ariaLabel = 'Export All Novels';
        }
    }

    function triggerImport() {
        if (!window.DecompressionStream || !opfsRoot) { alert("Import failed: Browser support missing."); return; }
        if (novelsMetadata.length > 0 || localStorage.length > 2) { if (!confirm('Import replaces current data.\nContinue?')) return; }
        importFileInput.click();
    }

    async function importData(file) {
        if (!file) return;
        if (!file.name.endsWith('.novelarchive.gz')) { alert("Invalid file type."); importFileInput.value = null; return; }
        if (!opfsRoot) { alert("Import failed: Storage not ready."); importFileInput.value = null; return; }
        importButton.textContent = '📥'; importButton.disabled = true; importButton.ariaLabel = 'Importing...'; importFileInput.disabled = true;
        console.log(`Starting import: ${file.name}`);
        try {
            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const jsonString = await new Response(decompressedStream).text();
            const importObject = JSON.parse(jsonString);
            if (!importObject || typeof importObject !== 'object' || !Array.isArray(importObject.metadata) || typeof importObject.chapters !== 'object') throw new Error("Invalid backup format.");
            if (importObject.version !== 1) console.warn(`Importing v${importObject.version}.`);
            console.log("Clearing existing data...");
            localStorage.removeItem(METADATA_KEY); novelsMetadata = [];
            if (opfsRoot) {
                 try { const entries = []; for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entries.push(entry.name); }
                     await Promise.all(entries.map(name => opfsRoot.removeEntry(name, { recursive: true }).catch(err => console.warn(`Old OPFS clear error ${name}:`, err)) ));
                     console.log("Cleared OPFS.");
                 } catch (clearError) { console.error("OPFS clear error:", clearError); alert("Warning: Couldn't fully clear old data."); }
            }
            console.log("Restoring data...");
            let importedNovelsCount = 0; let chapterSaveErrors = 0;
            novelsMetadata = importObject.metadata.map(novel => ({ id: novel.id || crypto.randomUUID(), title: novel.title || 'Untitled Novel', author: novel.author || '', genre: novel.genre || '', description: novel.description || '', chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({ title: ch.title || 'Untitled Chapter', opfsFileName: '' })) : [], lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1, }));
            for (const novel of novelsMetadata) {
                const novelChapterData = importObject.chapters[novel.id];
                if (novelChapterData && typeof novelChapterData === 'object') {
                    for (let i = 0; i < novel.chapters.length; i++) {
                        const content = novelChapterData[i]; const chapterMeta = novel.chapters[i];
                        if (typeof content === 'string' && !content.startsWith('###EXPORT_READ_ERROR###')) {
                            try { await saveChapterContent(novel.id, i, content); } catch (saveError) { console.error(`Import Save Err Ch ${i} (Novel ${novel.id}):`, saveError); chapterSaveErrors++; chapterMeta.opfsFileName = ''; }
                        } else if (content?.startsWith('###EXPORT_READ_ERROR###')) { console.warn(`Skip Ch ${i} (Novel ${novel.id}) due to export error.`); chapterMeta.opfsFileName = '';
                        } else { console.warn(`Missing/invalid Ch ${i} (Novel ${novel.id}). Saving empty.`); try { await saveChapterContent(novel.id, i, ''); } catch(saveError) { console.error(`Import Save Empty Ch ${i} (Novel ${novel.id}):`, saveError); chapterSaveErrors++; chapterMeta.opfsFileName = ''; } }
                    }
                } else { console.warn(`No chapter data for Novel ${novel.id}.`); novel.chapters.forEach(ch => ch.opfsFileName = ''); }
                importedNovelsCount++;
            }
            saveNovelsMetadata(); loadSettings(); renderNovelList(); showPage('home-page');
            let successMessage = `Import ok! ${importedNovelsCount} novel(s) loaded.`;
            if (chapterSaveErrors > 0) successMessage += `\nWarning: ${chapterSaveErrors} chapter(s) failed import.`;
            alert(successMessage); console.log("Import finished.");
        } catch (error) {
            console.error("Import failed:", error); alert(`Import failed: ${error.message}\nRestoring previous state...`);
            loadNovelsMetadata(); loadSettings(); renderNovelList(); showPage('home-page');
        } finally {
            importButton.textContent = '📥'; importButton.disabled = false; importButton.ariaLabel = 'Import Novels Archive'; importFileInput.disabled = false; importFileInput.value = null;
        }
    }

    // --- Chapter Downloads ---
    function sanitizeFilename(name) { return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim() || 'Untitled'; }
    async function downloadChapter(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex); const novel = findNovel(novelId);
        if (!chapter || !novel) { console.error("Download fail data missing:", novelId, chapterIndex); alert("Data missing."); throw new Error("Data missing"); }
        const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        const downloadName = `${sanitizeFilename(novel.title)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapter.title)}.txt`;
        if (!opfsRoot) { alert("Download fail: Storage unavailable."); throw new Error("OPFS unavailable"); }
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            const fileHandle = await novelDirHandle.getFileHandle(opfsFileName);
            const file = await fileHandle.getFile();
            const url = URL.createObjectURL(file); const a = document.createElement('a');
            a.href = url; a.download = downloadName;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url); console.log(`Download init: ${downloadName}`);
        } catch (error) {
            if (error.name === 'NotFoundError') { alert(`Download fail "${chapter.title}": File not found.`); console.warn(`Download fail: File ${opfsFileName} not found.`); }
            else { console.error(`Download error ch ${chapterIndex}:`, error); alert(`Download fail "${chapter.title}": ${error.message}`); }
            throw error;
        }
    }
    async function downloadAllChapters(novelId) {
        const novel = findNovel(novelId); if (!novel?.chapters?.length) { alert("No chapters."); return; }
        if (!confirm(`Start ${novel.chapters.length} separate downloads?`)) return;
        const originalText = bulkDownloadBtn.textContent; bulkDownloadBtn.textContent = 'Starting...'; bulkDownloadBtn.disabled = true; bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        let successCount = 0; let errorCount = 0; const totalChapters = novel.chapters.length;
        console.log(`Starting bulk download ${totalChapters} chaps: ${novel.title}`);
        try {
            for (let i = 0; i < totalChapters; i++) {
                bulkDownloadBtn.textContent = `Downloading ${i + 1}/${totalChapters}...`;
                try { await downloadChapter(novelId, i); successCount++; }
                catch (e) { errorCount++; }
                await new Promise(resolve => setTimeout(resolve, 200)); // Delay
            }
            alert(`Bulk download finished.\nSuccess: ${successCount}\nFailed: ${errorCount}`); console.log(`Bulk download done. S:${successCount}, F:${errorCount}`);
        } catch (error) { alert("Unexpected bulk download error."); console.error("Bulk download error:", error); }
        finally { bulkDownloadBtn.textContent = originalText; bulkDownloadBtn.disabled = false; bulkDownloadBtn.setAttribute('aria-disabled', 'false'); }
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page')));
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));
        themeToggleBtn.addEventListener('click', () => { const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light'; applyTheme(current === 'dark' ? 'light' : 'dark'); });
        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (event) => { if (event.target.files?.length) importData(event.target.files[0]); });
        exportButton.addEventListener('click', exportAllData);
        deleteAllDataBtn.addEventListener('click', deleteAllData);
        document.getElementById('edit-novel-btn').addEventListener('click', () => { if (currentNovelId) openNovelModal(currentNovelId); });
        document.getElementById('delete-novel-btn').addEventListener('click', async () => {
             if (!currentNovelId) return; const novel = findNovel(currentNovelId);
             if (novel && confirm(`Delete "${novel.title || 'Untitled'}" and chapters?`)) {
                 await deleteNovelData(currentNovelId); currentNovelId = null; renderNovelList(); showPage('home-page'); alert(`Novel "${novel.title || 'Untitled'}" deleted.`); } });
        document.getElementById('add-chapter-btn').addEventListener('click', () => { if (currentNovelId) openChapterModal(currentNovelId); });
        bulkDownloadBtn.addEventListener('click', () => { if (currentNovelId) downloadAllChapters(currentNovelId); });
        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (event) => { if (event.target === novelModal) closeNovelModal(); });
        novelModalTitleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveNovelFromModal(); } });
        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (event) => { if (event.target === chapterModal) closeChapterModal(); });
        chapterModalTitleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); chapterModalContentInput.focus(); } });
        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (event) => { if (event.target === readerSettingsModal) closeReaderSettingsModal(); });
        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value));
        prevChapterBtn.addEventListener('click', () => { if (currentNovelId !== null && currentChapterIndex > 0) { currentChapterIndex--; loadReaderPage(currentNovelId, currentChapterIndex); } });
        nextChapterBtn.addEventListener('click', () => { const novel = findNovel(currentNovelId); if (novel && currentChapterIndex < novel.chapters.length - 1) { currentChapterIndex++; loadReaderPage(currentNovelId, currentChapterIndex); } });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (readerSettingsModal.style.display === 'block') closeReaderSettingsModal(); else if (chapterModal.style.display === 'block') closeChapterModal(); else if (novelModal.style.display === 'block') closeNovelModal(); } });
    }

    // --- Start App ---
    initializeApp();

}); // End DOMContentLoaded