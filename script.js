document.addEventListener('DOMContentLoaded', () => {

    let currentNovelId = null;
    let currentChapterIndex = -1;
    let novelsMetadata = [];
    let opfsRoot = null;

    const pages = document.querySelectorAll('.page');
    const novelList = document.getElementById('novel-list');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const novelModal = document.getElementById('novel-modal');
    const chapterModal = document.getElementById('chapter-modal');
    const readerSettingsModal = document.getElementById('reader-settings-modal');
    const readerMainContent = document.getElementById('reader-main-content');
    const readerContent = document.getElementById('reader-content');
    const readerChapterTitle = document.getElementById('reader-chapter-title');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const lineHeightValueSpan = document.getElementById('line-height-value');
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
    const novelModalTitleHeading = document.getElementById('novel-modal-title-heading');
    const novelModalIdInput = document.getElementById('novel-modal-id');
    const novelModalTitleInput = document.getElementById('novel-modal-title-input');
    const novelModalAuthorInput = document.getElementById('novel-modal-author-input');
    const novelModalGenreInput = document.getElementById('novel-modal-genre-input');
    const novelModalDescriptionInput = document.getElementById('novel-modal-description-input');
    const chapterModalTitleHeading = document.getElementById('chapter-modal-title-heading');
    const chapterModalNovelIdInput = document.getElementById('chapter-modal-novel-id');
    const chapterModalIndexInput = document.getElementById('chapter-modal-index');
    const chapterModalTitleInput = document.getElementById('chapter-modal-title-input');
    const chapterModalContentInput = document.getElementById('chapter-modal-content-input');

    const METADATA_KEY = 'novelsMetadata';
    const THEME_KEY = 'novelReaderTheme';
    const FONT_KEY = 'novelReaderFont';
    const FONT_SIZE_KEY = 'novelReaderFontSize';
    const LINE_SPACING_KEY = 'novelReaderLineSpacing';

    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT = 'Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_LINE_SPACING = '1.6';

    const MODAL_CLOSE_DELAY = 180;

    async function initializeApp() {
        registerServiceWorker();
        const opfsReady = await initOPFS();
        if (!opfsReady) {
             alert("Warning: Origin Private File System (OPFS) is not available or could not be initialized. Saving/loading chapter content may not work on this browser/platform.");
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
                console.log("OPFS Root acquired via navigator.storage.getDirectory().");
                return true;
            } else {
                console.warn('OPFS API (navigator.storage.getDirectory) not supported.');
                opfsRoot = null;
                return false;
            }
        } catch (error) {
            console.error('OPFS Initialization Error:', error);
            opfsRoot = null;
            return false;
        }
    }

    function showPage(pageId) {
        let activePage = null;
        pages.forEach(page => {
            const isActive = page.id === pageId;
            page.classList.toggle('active', isActive);
            if (isActive) activePage = page;
        });

        if (activePage) {
            const contentArea = pageId === 'reader-page' ? readerMainContent : activePage.querySelector('.page-content');
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

    function loadSettings() {
        const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        const font = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        const fontSize = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        const lineSpacing = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;

        applyTheme(theme, false);
        applyReaderStyles(font, fontSize, lineSpacing, false);

        fontSelect.value = font;
        fontSizeSelect.value = fontSize;
        lineHeightSlider.value = lineSpacing;
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';

        if (lineHeightValueSpan) lineHeightValueSpan.textContent = lineSpacing;
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Failed to save setting ${key}:`, error);
            alert(`Error saving setting: ${key}. Storage might be full.`);
        }
    }

    function applyTheme(theme, save = true) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`);

        const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const metaThemeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        const lightColor = "#f8f9fa";
        const darkColor = "#1e1e1e";

        const effectiveColor = theme === 'dark' ? darkColor : lightColor;
        if (metaThemeColorLight) metaThemeColorLight.content = effectiveColor;
        if (metaThemeColorDark) metaThemeColorDark.content = effectiveColor;

        if (save) saveSetting(THEME_KEY, theme);
    }

    function applyReaderStyles(font, size, lineHeight, save = true) {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--font-family-reader', font);
        rootStyle.setProperty('--font-size-reader', size);
        rootStyle.setProperty('--line-height-reader', lineHeight);

        if (lineHeightValueSpan) lineHeightValueSpan.textContent = lineHeight;

        if (save) {
            saveSetting(FONT_KEY, font);
            saveSetting(FONT_SIZE_KEY, size);
            saveSetting(LINE_SPACING_KEY, lineHeight);
        }
    }

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
                     console.warn("Stored metadata is not an array. Resetting.");
                     localStorage.removeItem(METADATA_KEY);
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
        const chapter = novel?.chapters?.[chapterIndex];
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
                console.warn(`Attempted delete file ${fileName} (chapter ${chapterIndex}, novel ${novelId}), not found. Considered success.`);
                return true;
            }
            console.error(`Error deleting file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}):`, error);
            return false;
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.warn(`Attempted delete non-existent novel metadata: ${novelId}`);
            return;
        }
        if (opfsRoot) {
            try {
                console.log(`Attempting to remove OPFS directory: ${novelId}`);
                await opfsRoot.removeEntry(novelId, { recursive: true });
                console.log(`Successfully removed OPFS directory: ${novelId}`);
            } catch (error) {
                if (error.name !== 'NotFoundError') {
                    console.error(`Error deleting OPFS directory ${novelId}:`, error);
                    alert(`Warning: Could not delete all files for novel "${novel.title}". Some data may remain.`);
                } else {
                    console.log(`OPFS directory ${novelId} not found, skipping removal.`);
                }
            }
        } else {
            console.warn("OPFS not available, cannot delete novel directory data.");
        }
        const novelIndex = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIndex > -1) {
            novelsMetadata.splice(novelIndex, 1);
            saveNovelsMetadata();
            console.log(`Removed metadata for novel: ${novelId}`);
        }
    }

    async function deleteAllData() {
        if (!confirm('⚠️ WARNING! ⚠️\n\nThis will permanently delete ALL novels, chapters, reading progress, and display settings stored by this app in your browser.\n\nThis action CANNOT BE UNDONE.\n\nAre you absolutely sure you want to proceed?')) {
            return;
        }
        try {
            localStorage.removeItem(METADATA_KEY);
            localStorage.removeItem(THEME_KEY);
            localStorage.removeItem(FONT_KEY);
            localStorage.removeItem(FONT_SIZE_KEY);
            localStorage.removeItem(LINE_SPACING_KEY);
            novelsMetadata = [];
            console.log("Cleared localStorage data.");
        } catch (e) {
            console.error("Error clearing localStorage:", e);
            alert("An error occurred while clearing settings data.");
        }
        if (opfsRoot) {
            console.log("Attempting to clear OPFS directories...");
            let opfsClearFailed = false;
            const entriesToRemove = [];
            try {
                 if (opfsRoot.values) {
                    for await (const entry of opfsRoot.values()) {
                        if (entry.kind === 'directory') {
                            entriesToRemove.push(entry.name);
                        }
                    }
                 } else {
                     console.warn("Cannot list OPFS entries: opfsRoot.values() not available.");
                     opfsClearFailed = true;
                 }
                console.log(`Found OPFS directories to remove: ${entriesToRemove.join(', ') || 'None'}`);
                const removalPromises = entriesToRemove.map(name =>
                    opfsRoot.removeEntry(name, { recursive: true })
                        .then(() => console.log(`Removed OPFS dir: ${name}`))
                        .catch(err => {
                            console.error(`Failed to remove OPFS dir ${name}:`, err);
                            opfsClearFailed = true;
                        })
                );
                await Promise.all(removalPromises);
                if (!opfsClearFailed) {
                    console.log("Finished OPFS clearing successfully.");
                } else {
                    console.warn("Finished OPFS clearing with one or more errors.");
                    alert('Warning: Could not automatically clear all stored novel files. Some data might remain.');
                }
            } catch (error) {
                console.error('Error during OPFS clearing process:', error);
                alert('An error occurred while clearing stored novel files.');
                opfsClearFailed = true;
            }
        } else {
            console.warn("OPFS not available, skipping OPFS clear operation.");
        }
        applyTheme(DEFAULT_THEME);
        applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING);
        fontSelect.value = DEFAULT_FONT;
        fontSizeSelect.value = DEFAULT_FONT_SIZE;
        lineHeightSlider.value = DEFAULT_LINE_SPACING;
        if (lineHeightValueSpan) lineHeightValueSpan.textContent = DEFAULT_LINE_SPACING;
        renderNovelList();
        showPage('home-page');
        alert('All application data has been deleted.');
    }

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
            const itemContent = document.createElement('div');
            itemContent.className = 'item-content';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'title';
            titleSpan.textContent = novel.title || 'Untitled Novel';
            const subtitleSpan = document.createElement('span');
            subtitleSpan.className = 'subtitle';
            subtitleSpan.textContent = novel.author || 'Unknown Author';
            itemContent.appendChild(titleSpan);
            itemContent.appendChild(subtitleSpan);
            const arrowSpan = document.createElement('span');
            arrowSpan.setAttribute('aria-hidden', 'true');
            arrowSpan.style.marginLeft = 'auto';
            arrowSpan.style.color = 'var(--text-muted)';
            arrowSpan.style.fontSize = '1.2em';
            arrowSpan.textContent = '›';
            li.appendChild(itemContent);
            li.appendChild(arrowSpan);
            const navigate = () => {
                currentNovelId = novel.id;
                showPage('novel-info-page');
            };
            li.addEventListener('click', navigate);
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate();
                }
            });
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

        const lastReadChapterIndex = novel.lastReadChapterIndex;
        const lastReadChapter = findChapter(novelId, lastReadChapterIndex);
        if (lastReadChapter) {
            const chapterTitle = lastReadChapter.title || `Chapter ${lastReadChapterIndex + 1}`;
            novelInfoLastRead.textContent = chapterTitle;
            novelInfoLastRead.classList.add('clickable');
            novelInfoLastRead.setAttribute('role', 'link');
            novelInfoLastRead.tabIndex = 0;
            novelInfoLastRead.setAttribute('aria-label', `Continue reading: ${chapterTitle}`);
            const continueReadingHandler = (e) => {
                 if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                     e.preventDefault();
                    currentChapterIndex = lastReadChapterIndex;
                    showPage('reader-page');
                }
            };
            novelInfoLastRead.onclick = null;
            novelInfoLastRead.onkeydown = null;
            novelInfoLastRead.addEventListener('click', continueReadingHandler);
            novelInfoLastRead.addEventListener('keydown', continueReadingHandler);
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
        const hasChapters = chapters.length > 0;
        bulkDownloadBtn.disabled = !hasChapters;
        bulkDownloadBtn.setAttribute('aria-disabled', String(!hasChapters));
        if (!hasChapters) {
            chapterListEl.innerHTML = '<li class="placeholder">No chapters added yet.</li>';
            return;
        }
        chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.dataset.chapterIndex = index;
            const chapterTitle = chapter.title || `Chapter ${index + 1}`;
            const itemContent = document.createElement('div');
            itemContent.className = 'item-content chapter-title-container';
            itemContent.setAttribute('role', 'button');
            itemContent.tabIndex = 0;
            itemContent.setAttribute('aria-label', `Read ${chapterTitle}`);
            const titleSpan = document.createElement('span');
            titleSpan.className = 'title';
            titleSpan.textContent = chapterTitle;
            itemContent.appendChild(titleSpan);
            const itemActions = document.createElement('div');
            itemActions.className = 'item-actions chapter-controls';
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-chapter-btn icon-btn';
            editBtn.setAttribute('aria-label', `Edit ${chapterTitle}`);
            editBtn.textContent = '✏️';
            editBtn.addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, index); });
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-chapter-btn icon-btn';
            downloadBtn.setAttribute('aria-label', `Download ${chapterTitle}`);
            downloadBtn.textContent = '💾';
            downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, index).catch(err => console.warn("Download failed:", err)); });
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-chapter-btn icon-btn danger';
            deleteBtn.setAttribute('aria-label', `Delete ${chapterTitle}`);
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete chapter: "${chapterTitle}"?\nThis action removes its content permanently and cannot be undone.`)) {
                    try {
                        const fileDeleteSuccess = await deleteChapterFile(novelId, index);
                        if (fileDeleteSuccess) {
                            const deletedIndex = index;
                            novel.chapters.splice(deletedIndex, 1);
                            if (novel.lastReadChapterIndex === deletedIndex) {
                                novel.lastReadChapterIndex = -1;
                            } else if (novel.lastReadChapterIndex > deletedIndex) {
                                novel.lastReadChapterIndex--;
                            }
                            saveNovelsMetadata();
                            renderChapterList(novelId);
                            loadNovelInfoPage(novelId);
                            console.log(`Deleted chapter ${deletedIndex} for novel ${novelId}`);
                        } else {
                            alert(`Failed to delete the file for chapter "${chapterTitle}". Metadata was not removed.`);
                        }
                    } catch(error) {
                         console.error(`Error during chapter deletion process:`, error);
                         alert(`An error occurred while trying to delete the chapter "${chapterTitle}".`);
                    }
                }
            });
            itemActions.appendChild(editBtn);
            itemActions.appendChild(downloadBtn);
            itemActions.appendChild(deleteBtn);
            const navigateToReader = () => {
                currentChapterIndex = index;
                showPage('reader-page');
            };
            itemContent.addEventListener('click', navigateToReader);
            itemContent.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToReader();
                }
            });
            li.appendChild(itemContent);
            li.appendChild(itemActions);
            chapterListEl.appendChild(li);
        });
    }

    async function loadReaderPage(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);
        if (!chapter || !novel) {
            console.error(`Reader load failed: Novel (${novelId}) or Chapter (${chapterIndex}) not found.`);
            readerChapterTitle.textContent = "Error";
            readerContent.textContent = "Error: Could not load chapter data. Novel or chapter metadata missing.";
            prevChapterBtn.disabled = true; prevChapterBtn.setAttribute('aria-disabled', 'true');
            nextChapterBtn.disabled = true; nextChapterBtn.setAttribute('aria-disabled', 'true');
            return;
        }
        readerChapterTitle.textContent = chapter.title || `Chapter ${chapterIndex + 1}`;
        readerContent.textContent = 'Loading chapter content...';

        if (novel.lastReadChapterIndex !== chapterIndex) {
             novel.lastReadChapterIndex = chapterIndex;
            saveNovelsMetadata();
            const novelInfoPage = document.getElementById('novel-info-page');
            if (novelInfoPage && novelInfoPage.classList.contains('active') && findNovel(novelId)) {
                 loadNovelInfoPage(novelId);
            }
        }

        const rawContent = await readChapterContent(novelId, chapterIndex);

        if (rawContent.startsWith("Error:")) {
            readerContent.textContent = rawContent;
            readerContent.style.color = 'var(--danger-color)';
        } else {
            readerContent.textContent = rawContent;
            readerContent.style.color = '';
        }

        prevChapterBtn.disabled = (chapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', String(prevChapterBtn.disabled));
        nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', String(nextChapterBtn.disabled));

        readerMainContent.scrollTop = 0;
    }

    function closeModal(modalElement) {
        if (!modalElement || modalElement.style.display === 'none') return;
        modalElement.classList.add('closing');
        const animationHandler = () => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
            modalElement.removeEventListener('animationend', animationHandler);
        };
         modalElement.addEventListener('animationend', animationHandler);
         setTimeout(() => { if (modalElement.classList.contains('closing')) { animationHandler(); } }, MODAL_CLOSE_DELAY + 50);
    }

    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;
        if (isEditing && !novel) {
            console.error(`Cannot edit novel: ID ${novelIdToEdit} not found.`);
            alert("Error: The novel you are trying to edit could not be found.");
            return;
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
        if (!title) {
            alert("Novel Title is required.");
            novelModalTitleInput.focus();
            return;
        }
        const author = novelModalAuthorInput.value.trim();
        const genre = novelModalGenreInput.value.trim();
        const description = novelModalDescriptionInput.value.trim();
        const isEditing = !!id;
        let novelToUpdate;
        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) {
                console.error(`Save Error: Novel with ID ${id} not found during update.`);
                alert("Error: Could not find the novel to update. Please try again.");
                closeNovelModal();
                return;
            }
            Object.assign(novelToUpdate, { title, author, genre, description });
            console.log(`Updated novel: ${id}`);
        } else {
            novelToUpdate = {
                id: crypto.randomUUID(),
                title,
                author,
                genre,
                description,
                chapters: [],
                lastReadChapterIndex: -1
            };
            novelsMetadata.push(novelToUpdate);
            currentNovelId = novelToUpdate.id;
            console.log(`Added new novel: ${novelToUpdate.id}`);
        }
        saveNovelsMetadata();
        closeNovelModal();
        renderNovelList();
        if (isEditing) {
            if (document.getElementById('novel-info-page').classList.contains('active') && currentNovelId === id) {
                loadNovelInfoPage(id);
            }
        } else {
            showPage('novel-info-page');
        }
    }

    async function openChapterModal(novelId, chapterIndex = null) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.error(`Cannot open chapter modal: Novel ID ${novelId} not found.`);
            alert("Error: Could not find the associated novel."); return;
        }
        const isEditing = chapterIndex !== null && chapterIndex >= 0;
        const chapter = isEditing ? findChapter(novelId, chapterIndex) : null;
        if (isEditing && chapter === null) {
            console.error(`Cannot edit chapter: Index ${chapterIndex} invalid for novel ${novelId}.`);
            alert("Error: The chapter you are trying to edit could not be found."); return;
        }
        chapterModalTitleHeading.textContent = isEditing ? "Edit Chapter" : "Add New Chapter";
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = isEditing ? chapterIndex : '';
        chapterModalTitleInput.value = chapter?.title || '';
        chapterModalContentInput.value = '';
        chapterModalContentInput.disabled = true;
        chapterModal.style.display = 'block';
        chapterModalTitleInput.focus();

        if (isEditing) {
            chapterModalContentInput.value = 'Loading chapter content...';
            try {
                const rawContent = await readChapterContent(novelId, chapterIndex);
                if (rawContent.startsWith("Error:")) {
                     chapterModalContentInput.value = `Could not load existing content.\n${rawContent}\n\nYou can still edit the title or enter new content below and save.`;
                     chapterModalContentInput.disabled = false;
                } else {
                    chapterModalContentInput.value = rawContent;
                    chapterModalContentInput.disabled = false;
                }
            } catch(e) {
                console.error(`Error loading chapter content in modal:`, e);
                chapterModalContentInput.value = `Critical error loading content: ${e.message}`;
                chapterModalContentInput.disabled = false;
            }
        } else {
            chapterModalContentInput.disabled = false;
        }
    }

    function closeChapterModal() { closeModal(chapterModal); }

    async function saveChapterFromModal() {
        const novelId = chapterModalNovelIdInput.value;
        const indexStr = chapterModalIndexInput.value;
        const title = chapterModalTitleInput.value.trim();
        const content = chapterModalContentInput.value;
        const novel = findNovel(novelId);
        if (!title) { alert("Chapter Title is required."); chapterModalTitleInput.focus(); return; }
        if (!novel) { console.error(`Chapter save failed: Associated novel ${novelId} missing.`); alert("Error: Could not find the novel this chapter belongs to."); closeChapterModal(); return; }
        if (!content && !confirm("The chapter content is empty. Do you want to save it anyway?")) {
            chapterModalContentInput.focus();
            return;
        }

        const isNewChapter = indexStr === '';
        const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10);

        if (!isNewChapter && (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= novel.chapters.length)) {
            console.error(`Chapter save failed: Invalid index ${indexStr} for novel ${novelId}.`);
            alert("Error: Invalid chapter index provided for editing."); closeChapterModal(); return;
        }

        let chapterData;
        let temporaryMetadataAdded = false;

        if (isNewChapter) {
            chapterData = { title: title, opfsFileName: '' };
            novel.chapters.push(chapterData);
            temporaryMetadataAdded = true;
        } else {
            chapterData = novel.chapters[chapterIndex];
            chapterData.title = title;
        }

        try {
            await saveChapterContent(novelId, chapterIndex, content);
            saveNovelsMetadata();
            console.log(`Successfully saved chapter ${chapterIndex} file and metadata for novel ${novelId}.`);
            closeChapterModal();
            renderChapterList(novelId);
        } catch (error) {
            console.error(`Failed to save chapter ${chapterIndex} content for novel ${novelId}:`, error);
            alert(`Chapter save failed: ${error.message}\n\nPlease check storage permissions or try again.`);
            if (temporaryMetadataAdded) {
                novel.chapters.pop();
                console.log("Rolled back temporary metadata addition due to save failure.");
            }
        }
    }

    function openReaderSettingsModal() {
        fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        lineHeightSlider.value = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;
        if (lineHeightValueSpan) lineHeightValueSpan.textContent = lineHeightSlider.value;
        readerSettingsModal.style.display = 'block';
    }
    function closeReaderSettingsModal() { closeModal(readerSettingsModal); }

    async function exportAllData() {
        if (!novelsMetadata?.length) { alert("There are no novels to export."); return; }
        if (!opfsRoot || typeof window.CompressionStream === 'undefined') {
             alert("Export failed: Storage system not ready or CompressionStream API not supported by your browser.");
             return;
        }
        const originalButtonText = exportButton.textContent;
        const originalButtonLabel = exportButton.ariaLabel;
        exportButton.textContent = '📤';
        exportButton.disabled = true;
        exportButton.ariaLabel = 'Exporting novels...';

        try {
            console.log("Starting data export process...");
            const exportObject = {
                version: 1,
                metadata: [],
                chapters: {}
            };

            exportObject.metadata = JSON.parse(JSON.stringify(novelsMetadata));

            let chapterReadErrors = 0;
            let successfullyReadChapters = 0;

            for (const novel of exportObject.metadata) {
                 exportObject.chapters[novel.id] = {};
                 if (novel.chapters?.length) {
                    for (let i = 0; i < novel.chapters.length; i++) {
                        try {
                            const content = await readChapterContent(novel.id, i);
                             if (content.startsWith("Error:")) throw new Error(content);
                             exportObject.chapters[novel.id][i] = content;
                             successfullyReadChapters++;
                        } catch (readError) {
                            console.error(`Export Read Error - Novel ${novel.id}, Chapter ${i}:`, readError);
                            exportObject.chapters[novel.id][i] = `###EXPORT_READ_ERROR### Could not read chapter content: ${readError.message}`;
                            chapterReadErrors++;
                        }
                    }
                }
            }

            console.log(`Chapter export summary: ${successfullyReadChapters} read successfully, ${chapterReadErrors} failed.`);
            if (chapterReadErrors > 0) {
                alert(`Warning: ${chapterReadErrors} chapter(s) could not be read and will be marked as errors in the backup file.`);
            }

            const jsonString = JSON.stringify(exportObject);
            const dataBlob = new Blob([jsonString], { type: 'application/json' });
            const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(compressedStream).blob();

            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14);
            a.download = `novels_backup_${timestamp}.novelarchive.gz`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("Export complete. File download initiated.");
            alert("Export complete! Your backup file should be downloading now.");

        } catch (error) {
            console.error("Export process failed:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            exportButton.textContent = originalButtonText;
            exportButton.disabled = false;
            exportButton.ariaLabel = originalButtonLabel;
        }
    }

    function triggerImport() {
        if (!opfsRoot || typeof window.DecompressionStream === 'undefined') {
            alert("Import failed: Storage system not ready or DecompressionStream API not supported by your browser.");
            return;
        }
        if (novelsMetadata.length > 0 || localStorage.length > Object.keys(DEFAULT_THEME).length) {
            if (!confirm('Importing a backup will REPLACE all current novels, chapters, and settings.\n\nAre you sure you want to continue?')) {
                return;
            }
        }
        importFileInput.click();
    }

    async function importData(file) {
        if (!file) return;
        if (!file.name.endsWith('.novelarchive.gz')) {
            alert("Invalid file type. Please select a '.novelarchive.gz' backup file.");
            importFileInput.value = null;
            return;
        }
         if (!opfsRoot) {
             alert("Import failed: Storage system is not ready.");
             importFileInput.value = null;
             return;
         }

        const originalButtonText = importButton.textContent;
        const originalButtonLabel = importButton.ariaLabel;
        importButton.textContent = '📥';
        importButton.disabled = true;
        importButton.ariaLabel = 'Importing backup...';
        importFileInput.disabled = true;

        console.log(`Starting import from file: ${file.name}`);
        let previousState = null;

        try {
             console.log("Backing up current state before import...");
             previousState = {
                 metadata: localStorage.getItem(METADATA_KEY),
                 theme: localStorage.getItem(THEME_KEY),
                 font: localStorage.getItem(FONT_KEY),
                 fontSize: localStorage.getItem(FONT_SIZE_KEY),
                 lineSpacing: localStorage.getItem(LINE_SPACING_KEY)
             };

            console.log("Decompressing and parsing backup file...");
            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const jsonString = await new Response(decompressedStream).text();
            const importObject = JSON.parse(jsonString);

            if (!importObject || typeof importObject !== 'object' || !Array.isArray(importObject.metadata) || typeof importObject.chapters !== 'object') {
                throw new Error("Invalid backup file format. Required 'metadata' array or 'chapters' object is missing.");
            }
            console.log(`Backup file version: ${importObject.version || 'Unknown'}`);
            if (importObject.version !== 1) { console.warn(`Importing data from a potentially incompatible version (${importObject.version}).`); }

            console.log("Clearing existing application data (localStorage and OPFS)...");
            localStorage.removeItem(METADATA_KEY);
            novelsMetadata = [];

            if (opfsRoot) {
                let opfsClearFailed = false;
                const entriesToRemove = [];
                try {
                    if (opfsRoot.values) {
                        for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entriesToRemove.push(entry.name); }
                    } else { console.warn("Cannot list OPFS entries for clearing."); opfsClearFailed = true; }

                    await Promise.all(entriesToRemove.map(name =>
                         opfsRoot.removeEntry(name, { recursive: true }).catch(err => { console.warn(`Old OPFS clear error ${name}:`, err); opfsClearFailed = true; })
                     ));
                    if (opfsClearFailed) console.warn("Could not fully clear old OPFS data during import."); else console.log("Cleared old OPFS directories successfully.");
                 } catch (clearError) { console.error("OPFS clearing error during import:", clearError); alert("Warning: Could not fully clear old data before import."); }
            }

            console.log("Restoring novels and chapters from backup...");
            let importedNovelsCount = 0;
            let chapterSaveErrors = 0;

             novelsMetadata = importObject.metadata.map(novel => ({
                id: novel.id || crypto.randomUUID(),
                title: novel.title || 'Untitled Novel',
                author: novel.author || '',
                genre: novel.genre || '',
                description: novel.description || '',
                chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                    title: ch.title || 'Untitled Chapter',
                    opfsFileName: ''
                 })) : [],
                lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
            }));

            for (const novel of novelsMetadata) {
                const novelChapterData = importObject.chapters[novel.id];
                if (novelChapterData && typeof novelChapterData === 'object') {
                     for (let i = 0; i < novel.chapters.length; i++) {
                        const content = novelChapterData[i];
                        const chapterMeta = novel.chapters[i];
                        if (typeof content === 'string' && !content.startsWith('###EXPORT_READ_ERROR###')) {
                            try {
                                await saveChapterContent(novel.id, i, content);
                            }
                            catch (saveError) {
                                console.error(`Import Save Error - Novel ${novel.id}, Chapter ${i}:`, saveError);
                                chapterSaveErrors++;
                                chapterMeta.opfsFileName = '';
                            }
                        } else if (content?.startsWith('###EXPORT_READ_ERROR###')) {
                            console.warn(`Skipping content import for Novel ${novel.id}, Chapter ${i} due to previous export error.`);
                            chapterMeta.opfsFileName = '';
                        } else {
                             console.warn(`Missing or invalid content for Novel ${novel.id}, Chapter ${i}. Saving as empty.`);
                             try {
                                 await saveChapterContent(novel.id, i, '');
                             }
                             catch(saveEmptyError) {
                                 console.error(`Import Save Empty Error - Novel ${novel.id}, Chapter ${i}:`, saveEmptyError);
                                 chapterSaveErrors++;
                                 chapterMeta.opfsFileName = '';
                             }
                        }
                    }
                } else {
                    console.warn(`No chapter content data found in backup for Novel ${novel.id}. Chapters will be empty.`);
                    novel.chapters.forEach(ch => ch.opfsFileName = '');
                }
                importedNovelsCount++;
            }

            saveNovelsMetadata();
            loadSettings();
            renderNovelList();
            showPage('home-page');

            let successMessage = `Import successful! ${importedNovelsCount} novel(s) loaded.`;
            if (chapterSaveErrors > 0) {
                successMessage += `\n\nWarning: ${chapterSaveErrors} chapter(s) could not be saved correctly due to errors. Their content might be missing or empty.`;
            }
            alert(successMessage);
            console.log("Import process finished.");

        } catch (error) {
            console.error("Import process failed:", error);
            alert(`Import failed: ${error.message}\n\nAttempting to restore previous state...`);

            if (previousState) {
                console.log("Rolling back to previous state...");
                try {
                    if (previousState.metadata) localStorage.setItem(METADATA_KEY, previousState.metadata); else localStorage.removeItem(METADATA_KEY);
                    if (previousState.theme) localStorage.setItem(THEME_KEY, previousState.theme); else localStorage.removeItem(THEME_KEY);
                    if (previousState.font) localStorage.setItem(FONT_KEY, previousState.font); else localStorage.removeItem(FONT_KEY);
                    if (previousState.fontSize) localStorage.setItem(FONT_SIZE_KEY, previousState.fontSize); else localStorage.removeItem(FONT_SIZE_KEY);
                    if (previousState.lineSpacing) localStorage.setItem(LINE_SPACING_KEY, previousState.lineSpacing); else localStorage.removeItem(LINE_SPACING_KEY);

                    loadNovelsMetadata();
                    loadSettings();
                    renderNovelList();
                    showPage('home-page');
                     alert("Previous state restored. Note: Chapter content might be missing if OPFS data was cleared.");
                     console.log("Rollback successful (metadata and settings only).");
                 } catch (rollbackError) {
                     console.error("Rollback failed:", rollbackError);
                     alert("Critical error: Could not restore previous state after import failure. Data may be inconsistent or lost. Please try refreshing the application or clearing data manually if issues persist.");
                 }
            } else {
                 alert("Critical error: Could not restore previous state as it wasn't backed up. Application state might be inconsistent.");
                 loadNovelsMetadata();
                 loadSettings();
                 renderNovelList();
                 showPage('home-page');
            }
        } finally {
            importButton.textContent = originalButtonText;
            importButton.disabled = false;
            importButton.ariaLabel = originalButtonLabel;
            importFileInput.disabled = false;
            importFileInput.value = null;
        }
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]+/g, '_').replace(/\s+/g, ' ').trim() || 'Untitled';
    }

    async function downloadChapter(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);
        if (!chapter || !novel) {
            console.error("Download failed: Novel or Chapter metadata missing.", { novelId, chapterIndex });
            alert("Error: Could not find chapter data to download.");
            throw new Error("Chapter or novel data missing for download.");
        }

        const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        const downloadName = `${sanitizeFilename(novel.title)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapter.title)}.txt`;

        if (!opfsRoot) {
             alert("Download failed: Storage system is not available.");
             throw new Error("OPFS not available for download.");
        }

        try {
             const novelDirHandle = await getNovelDir(novelId, false);
             const fileHandle = await novelDirHandle.getFileHandle(opfsFileName);
             const file = await fileHandle.getFile();

            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log(`Download initiated successfully: ${downloadName}`);
        } catch (error) {
            if (error.name === 'NotFoundError') {
                 alert(`Download failed for "${chapter.title}": The chapter file (${opfsFileName}) was not found in storage.`);
                 console.warn(`Download failed: File ${opfsFileName} not found for chapter ${chapterIndex}, novel ${novelId}.`);
             }
            else {
                 console.error(`Download error for chapter ${chapterIndex} (Novel ${novelId}, File ${opfsFileName}):`, error);
                 alert(`Download failed for "${chapter.title}": An error occurred (${error.message})`);
            }
            throw error;
        }
    }

    async function downloadAllChapters(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) { alert("This novel has no chapters to download."); return; }

        const totalChapters = novel.chapters.length;
        if (!confirm(`This will start ${totalChapters} separate file downloads, one for each chapter.\n\nDo you want to proceed?`)) { return; }

        const originalText = bulkDownloadBtn.textContent;
        bulkDownloadBtn.textContent = 'Starting...';
        bulkDownloadBtn.disabled = true;
        bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        bulkDownloadBtn.setAttribute('aria-live', 'polite');

        let successCount = 0;
        let errorCount = 0;

        console.log(`Starting bulk download of ${totalChapters} chapters for: ${novel.title}`);

        for (let i = 0; i < totalChapters; i++) {
            const chapter = novel.chapters[i];
            const chapterTitle = chapter.title || `Chapter ${i + 1}`;
            bulkDownloadBtn.textContent = `Downloading ${i + 1}/${totalChapters}...`;
            try {
                await downloadChapter(novelId, i);
                successCount++;
            }
            catch (e) {
                errorCount++;
                console.warn(`Bulk download: Failed chapter ${i} - ${chapterTitle}`);
            }
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        console.log(`Bulk download finished. Success: ${successCount}, Failed: ${errorCount}`);

         let finalMessage = `Bulk download finished for "${novel.title}".\n\nSuccessfully downloaded: ${successCount} chapter(s)`;
         if (errorCount > 0) {
             finalMessage += `\nFailed to download: ${errorCount} chapter(s). Check console for details.`;
         }
         alert(finalMessage);

        bulkDownloadBtn.textContent = originalText;
        bulkDownloadBtn.disabled = false;
        bulkDownloadBtn.setAttribute('aria-disabled', 'false');
        bulkDownloadBtn.removeAttribute('aria-live');
    }

    function setupEventListeners() {
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page'));
        });
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (event) => {
            if (event.target.files?.length) {
                 importData(event.target.files[0]);
            }
            event.target.value = null;
        });
        exportButton.addEventListener('click', exportAllData);

        deleteAllDataBtn.addEventListener('click', deleteAllData);

        document.getElementById('edit-novel-btn').addEventListener('click', () => {
            if (currentNovelId) openNovelModal(currentNovelId);
        });
        document.getElementById('delete-novel-btn').addEventListener('click', async () => {
            if (!currentNovelId) return;
            const novel = findNovel(currentNovelId);
            if (novel && confirm(`⚠️ Delete Novel ⚠️\n\nAre you sure you want to permanently delete the novel "${novel.title || 'Untitled'}" and all its chapters?\n\nThis action cannot be undone.`)) {
                 const titleToDelete = novel.title || 'Untitled';
                 try {
                     await deleteNovelData(currentNovelId);
                     currentNovelId = null;
                     renderNovelList();
                     showPage('home-page');
                     alert(`Novel "${titleToDelete}" has been deleted.`);
                } catch (error) {
                     console.error("Error during novel deletion flow:", error);
                }
             }
        });
        document.getElementById('add-chapter-btn').addEventListener('click', () => {
            if (currentNovelId) openChapterModal(currentNovelId);
        });
        bulkDownloadBtn.addEventListener('click', () => {
            if (currentNovelId) downloadAllChapters(currentNovelId);
        });

        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (event) => { if (event.target === novelModal) closeNovelModal(); });

        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (event) => { if (event.target === chapterModal) closeChapterModal(); });
         chapterModalTitleInput.addEventListener('keydown', (e) => {
             if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 chapterModalContentInput.focus();
             }
         });

        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (event) => { if (event.target === readerSettingsModal) closeReaderSettingsModal(); });

        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value, lineHeightSlider.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value, lineHeightSlider.value));
        lineHeightSlider.addEventListener('input', (e) => applyReaderStyles(fontSelect.value, fontSizeSelect.value, e.target.value));

        prevChapterBtn.addEventListener('click', () => {
            if (currentNovelId !== null && currentChapterIndex > 0) {
                currentChapterIndex--;
                loadReaderPage(currentNovelId, currentChapterIndex);
            }
        });
        nextChapterBtn.addEventListener('click', () => {
            const novel = findNovel(currentNovelId);
            if (novel && currentChapterIndex < novel.chapters.length - 1) {
                currentChapterIndex++;
                loadReaderPage(currentNovelId, currentChapterIndex);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (readerSettingsModal.style.display === 'block') closeReaderSettingsModal();
                else if (chapterModal.style.display === 'block') closeChapterModal();
                else if (novelModal.style.display === 'block') closeNovelModal();
            }
        });
    }

    initializeApp();

});