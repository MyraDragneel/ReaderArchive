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
    const readerPage = document.getElementById('reader-page');
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
    const novelSearchInput = document.getElementById('novel-search');
    const chapterSearchInput = document.getElementById('chapter-search');
    const readerFullscreenBtn = document.getElementById('reader-fullscreen-btn');

    const METADATA_KEY = 'novelsMetadata';
    const THEME_KEY = 'novelReaderTheme';
    const FONT_KEY = 'novelReaderFont';
    const FONT_SIZE_KEY = 'novelReaderFontSize';
    const LINE_SPACING_KEY = 'novelReaderLineSpacing';

    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT = 'Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_LINE_SPACING = '1.6';

    const MODAL_CLOSE_DELAY = 180; // ms to wait before hiding modal after closing animation starts

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

    function saveReaderPosition() {
        if (!readerPage.classList.contains('active') || currentNovelId === null || currentChapterIndex === -1 || !readerMainContent) {
            return;
        }
        const novel = findNovel(currentNovelId);
        if (!novel) {
            console.warn(`saveReaderPosition: Novel not found (ID: ${currentNovelId})`);
            return;
        }
        const currentScrollTop = Math.round(readerMainContent.scrollTop);
        novel.lastReadChapterIndex = currentChapterIndex;
        novel.lastReadScrollTop = currentScrollTop;
        saveNovelsMetadata();
    }

    function showPage(pageId) {
        // Exit fullscreen if navigating away from the reader page
        if (document.fullscreenElement && readerPage.classList.contains('active') && pageId !== 'reader-page') {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
            }
        }

        if (readerPage.classList.contains('active') && pageId !== 'reader-page') {
            saveReaderPosition();
        }

        let activePage = null;
        pages.forEach(page => {
            const isActive = page.id === pageId;
            page.classList.toggle('active', isActive);
            if (isActive) activePage = page;
        });

        // Reset scroll position for non-reader pages
        if (pageId !== 'reader-page' || !readerMainContent) {
            if (activePage) {
                const contentArea = activePage.querySelector('.page-content');
                if (contentArea) contentArea.scrollTop = 0;
                else activePage.scrollTop = 0;
            } else {
                window.scrollTo(0, 0);
            }
        }

        // Clear search inputs when leaving relevant pages
        if (pageId !== 'home-page') novelSearchInput.value = '';
        if (pageId !== 'novel-info-page') chapterSearchInput.value = '';

        // Load page content if necessary
        if (pageId === 'home-page') renderNovelList();
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
                    // Basic validation and default values for each novel and chapter
                    novelsMetadata = parsed.map(novel => ({
                        id: novel.id || crypto.randomUUID(),
                        title: novel.title || 'Untitled Novel',
                        author: novel.author || '',
                        genre: novel.genre || '',
                        description: novel.description || '',
                        chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                            title: ch.title || 'Untitled Chapter',
                            opfsFileName: ch.opfsFileName || '', // Will be generated if missing on save
                            lastModified: ch.lastModified || null // ISO string or null
                        })) : [],
                        lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
                        lastReadScrollTop: (typeof novel.lastReadScrollTop === 'number' && novel.lastReadScrollTop >= 0) ? novel.lastReadScrollTop : 0
                    }));
                } else {
                     console.warn("Stored metadata is not an array. Resetting.");
                     localStorage.removeItem(METADATA_KEY);
                }
            } catch (e) {
                console.error("Failed parsing novels metadata:", e);
                localStorage.removeItem(METADATA_KEY); // Clear corrupted data
                alert("Could not load novel list due to corrupted data. The list has been reset.");
            }
        }
        novelsMetadata.sort((a, b) => a.title.localeCompare(b.title)); // Ensure sorted order
    }

    function saveNovelsMetadata() {
        try {
            novelsMetadata.sort((a, b) => a.title.localeCompare(b.title)); // Ensure sorted before save
            localStorage.setItem(METADATA_KEY, JSON.stringify(novelsMetadata));
        } catch (error) {
            console.error("Failed saving novels metadata:", error);
            if (error.name === 'QuotaExceededError') {
                 alert("Error saving novel list/progress. Storage might be full.");
            } else {
                 alert("Error saving novel list/progress.");
            }
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
            throw error; // Re-throw to be handled by caller
        }
    }

    async function saveChapterContent(novelId, chapterIndex, content) {
        if (!opfsRoot) throw new Error("OPFS not ready for saving.");
        const novel = findNovel(novelId);
        const chapter = novel?.chapters?.[chapterIndex];
        if (!chapter) throw new Error(`Chapter metadata missing for novel ${novelId}, index ${chapterIndex}.`);

        // Ensure consistent filename based on index
        const fileName = `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        chapter.opfsFileName = fileName; // Update metadata with the correct filename

        try {
            const novelDirHandle = await getNovelDir(novelId, true); // Ensure directory exists
            const fileHandle = await novelDirHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            return true; // Indicate success
        } catch (error) {
            console.error(`Error saving chapter ${chapterIndex} content (file: ${fileName}):`, error);
            throw new Error(`Failed to save chapter file: ${error.message}`); // Propagate error
        }
    }

    async function readChapterContent(novelId, chapterIndex) {
        if (!opfsRoot) return "Error: File storage unavailable.";
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter) return "Error: Chapter metadata not found.";

        // Use consistent filename based on index, fallback to stored name only if necessary (legacy?)
        const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return "Error: Chapter file information missing."; // Should not happen if saved correctly

        try {
            const novelDirHandle = await getNovelDir(novelId, false); // Don't create if reading
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
            return false; // Indicate failure or inability
        }
        const chapter = findChapter(novelId, chapterIndex);
        // Determine filename consistently
        const fileName = chapter?.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;

        if (!fileName) {
            console.warn(`Skipping file deletion for chapter ${chapterIndex} (Novel ${novelId}): No filename identifiable.`);
            return true; // Consider it 'success' as there's nothing to delete
        }

        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(fileName);
            console.log(`Deleted file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}).`);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') {
                console.warn(`Attempted delete file ${fileName} (chapter ${chapterIndex}, novel ${novelId}), not found. Considered success.`);
                return true; // File already gone, goal achieved
            }
            console.error(`Error deleting file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}):`, error);
            return false; // Indicate actual deletion error
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.warn(`Attempted delete non-existent novel metadata: ${novelId}`);
            return; // Nothing to do
        }

        // Attempt to delete OPFS directory first
        if (opfsRoot) {
            try {
                console.log(`Attempting to remove OPFS directory: ${novelId}`);
                await opfsRoot.removeEntry(novelId, { recursive: true });
                console.log(`Successfully removed OPFS directory: ${novelId}`);
            } catch (error) {
                if (error.name !== 'NotFoundError') {
                    // Log error but proceed to remove metadata
                    console.error(`Error deleting OPFS directory ${novelId}:`, error);
                    alert(`Warning: Could not delete all files for novel "${novel.title}". Some data may remain.`);
                } else {
                    console.log(`OPFS directory ${novelId} not found, skipping removal.`);
                }
            }
        } else {
            console.warn("OPFS not available, cannot delete novel directory data.");
        }

        // Remove metadata from the array
        const novelIndex = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIndex > -1) {
            novelsMetadata.splice(novelIndex, 1);
            saveNovelsMetadata(); // Save the updated list
            console.log(`Removed metadata for novel: ${novelId}`);
        }
    }

    async function deleteAllData() {
        if (!confirm('⚠️ WARNING! ⚠️\n\nThis will permanently delete ALL novels, chapters, reading progress, and display settings stored by this app in your browser.\n\nThis action CANNOT BE UNDONE.\n\nAre you absolutely sure you want to proceed?')) {
            return;
        }

        // Clear localStorage
        try {
            localStorage.removeItem(METADATA_KEY);
            localStorage.removeItem(THEME_KEY);
            localStorage.removeItem(FONT_KEY);
            localStorage.removeItem(FONT_SIZE_KEY);
            localStorage.removeItem(LINE_SPACING_KEY);
            novelsMetadata = []; // Clear in-memory array
            console.log("Cleared localStorage data.");
        } catch (e) {
            console.error("Error clearing localStorage:", e);
            alert("An error occurred while clearing settings data.");
            // Continue to attempt OPFS clear even if localStorage fails
        }

        // Clear OPFS
        if (opfsRoot) {
            console.log("Attempting to clear OPFS directories...");
            let opfsClearFailed = false;
            const entriesToRemove = [];
            try {
                 // Check if the async iterator method exists
                 if (opfsRoot.values) {
                    for await (const entry of opfsRoot.values()) {
                        // Only target directories (novel data)
                        if (entry.kind === 'directory') {
                            entriesToRemove.push(entry.name);
                        }
                    }
                 } else {
                     // Fallback or warning if listing isn't supported (less likely now)
                     console.warn("Cannot list OPFS entries: opfsRoot.values() not available.");
                     opfsClearFailed = true; // Assume failure if we can't list
                 }

                console.log(`Found OPFS directories to remove: ${entriesToRemove.join(', ') || 'None'}`);

                const removalPromises = entriesToRemove.map(name =>
                    opfsRoot.removeEntry(name, { recursive: true })
                        .then(() => console.log(`Removed OPFS dir: ${name}`))
                        .catch(err => {
                            console.error(`Failed to remove OPFS dir ${name}:`, err);
                            opfsClearFailed = true; // Mark failure if any removal fails
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
                opfsClearFailed = true; // Mark failure on general error
            }
        } else {
            console.warn("OPFS not available, skipping OPFS clear operation.");
        }

        // Reset UI and settings to defaults
        applyTheme(DEFAULT_THEME);
        applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING);
        fontSelect.value = DEFAULT_FONT;
        fontSizeSelect.value = DEFAULT_FONT_SIZE;
        lineHeightSlider.value = DEFAULT_LINE_SPACING;
        if (lineHeightValueSpan) lineHeightValueSpan.textContent = DEFAULT_LINE_SPACING;

        renderNovelList(); // Update UI
        showPage('home-page');
        alert('All application data has been deleted.');
    }

    function renderNovelList(filterTerm = '') {
        novelList.innerHTML = ''; // Clear previous list
        const lowerFilterTerm = filterTerm.toLowerCase().trim();

        const filteredNovels = novelsMetadata.filter(novel => {
            if (!lowerFilterTerm) return true; // Show all if no filter
            // Check against title and author
            return (novel.title?.toLowerCase().includes(lowerFilterTerm) ||
                    novel.author?.toLowerCase().includes(lowerFilterTerm));
        });

        if (filteredNovels.length === 0) {
            if (novelsMetadata.length === 0) {
                // No novels at all
                novelList.innerHTML = '<li class="placeholder">No novels yet. Use ➕ to add one!</li>';
            } else {
                // Novels exist, but none match filter
                novelList.innerHTML = `<li class="placeholder">No novels found matching "${filterTerm}".</li>`;
            }
            // Disable export if no novels exist overall
            exportButton.disabled = novelsMetadata.length === 0;
            exportButton.setAttribute('aria-disabled', String(novelsMetadata.length === 0));
            return;
        }

        // Enable export if there are any novels (even if filtered list is empty temporarily)
        exportButton.disabled = novelsMetadata.length === 0;
        exportButton.setAttribute('aria-disabled', String(novelsMetadata.length === 0));

        // Create list items for filtered novels
        filteredNovels.forEach(novel => {
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

            // Simple visual cue for navigation
            const arrowSpan = document.createElement('span');
            arrowSpan.setAttribute('aria-hidden', 'true');
            arrowSpan.style.marginLeft = 'auto'; // Push to the right
            arrowSpan.style.color = 'var(--text-muted)';
            arrowSpan.style.fontSize = '1.2em';
            arrowSpan.textContent = '›';

            li.appendChild(itemContent);
            li.appendChild(arrowSpan);

            // Event listener for navigation
            const navigate = () => {
                currentNovelId = novel.id;
                showPage('novel-info-page');
            };
            li.addEventListener('click', navigate);
            li.addEventListener('keydown', (e) => {
                // Allow activation with Enter or Space
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent space from scrolling page
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
            showPage('home-page'); // Go back home if novel is missing
            return;
        }

        // Populate metadata fields
        novelInfoTitle.textContent = novel.title || 'Untitled Novel';
        novelInfoAuthor.textContent = novel.author || 'N/A';
        novelInfoGenre.textContent = novel.genre || 'N/A';
        novelInfoDescription.textContent = novel.description || 'No description provided.';

        // Update "Last Read" section
        const lastReadChapterIndex = novel.lastReadChapterIndex;
        const lastReadChapter = findChapter(novelId, lastReadChapterIndex);

        if (lastReadChapter) {
            const chapterTitle = lastReadChapter.title || `Chapter ${lastReadChapterIndex + 1}`;
            novelInfoLastRead.textContent = chapterTitle;
            novelInfoLastRead.classList.add('clickable');
            novelInfoLastRead.setAttribute('role', 'link');
            novelInfoLastRead.tabIndex = 0; // Make focusable
            novelInfoLastRead.setAttribute('aria-label', `Continue reading: ${chapterTitle}`);

            // Clear previous listeners before adding new ones
            novelInfoLastRead.onclick = null;
            novelInfoLastRead.onkeydown = null;

            // Add event listener for click and keyboard activation
            const continueReadingHandler = (e) => {
                 if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                     e.preventDefault(); // Prevent default link/button behavior
                    currentChapterIndex = lastReadChapterIndex;
                    showPage('reader-page');
                }
            };
            novelInfoLastRead.addEventListener('click', continueReadingHandler);
            novelInfoLastRead.addEventListener('keydown', continueReadingHandler);

        } else {
            // No last read chapter recorded
            novelInfoLastRead.textContent = 'Never';
            novelInfoLastRead.classList.remove('clickable');
            novelInfoLastRead.removeAttribute('role');
            novelInfoLastRead.tabIndex = -1; // Make non-focusable
            novelInfoLastRead.removeAttribute('aria-label');
            novelInfoLastRead.onclick = null; // Remove any potential old listeners
            novelInfoLastRead.onkeydown = null;
        }

        // Render the chapter list for this novel
        renderChapterList(novelId, chapterSearchInput.value); // Use current search term
    }

    function formatTimestamp(isoString) {
        if (!isoString) return 'N/A';
        try {
            const date = new Date(isoString);
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            // Format nicely using locale settings
            return date.toLocaleString(undefined, {
                dateStyle: 'short',
                timeStyle: 'short'
            });
        } catch (e) {
            console.error("Error formatting timestamp:", isoString, e);
            return 'Error'; // Fallback for unexpected errors
        }
    }

    function renderChapterList(novelId, filterTerm = '') {
        const novel = findNovel(novelId);
        chapterListEl.innerHTML = ''; // Clear previous list
        const chapters = novel?.chapters || [];
        const lowerFilterTerm = filterTerm.toLowerCase().trim();

        // Filter chapters based on title, keeping original index
        const filteredChapters = chapters
            .map((chapter, index) => ({ ...chapter, originalIndex: index })) // Add original index
            .filter(chapter => {
                if (!lowerFilterTerm) return true; // Show all if no filter
                return chapter.title?.toLowerCase().includes(lowerFilterTerm);
            });

        // Enable/disable bulk download based on whether *any* chapters exist
        const hasAnyChapters = chapters.length > 0;
        bulkDownloadBtn.disabled = !hasAnyChapters;
        bulkDownloadBtn.setAttribute('aria-disabled', String(!hasAnyChapters));

        if (filteredChapters.length === 0) {
            if (hasAnyChapters) {
                // Chapters exist, but none match filter
                chapterListEl.innerHTML = `<li class="placeholder">No chapters found matching "${filterTerm}".</li>`;
            } else {
                // No chapters added yet
                chapterListEl.innerHTML = '<li class="placeholder">No chapters added yet.</li>';
            }
            return;
        }

        // Create list items for filtered chapters
        filteredChapters.forEach((chapter) => {
            const index = chapter.originalIndex; // Use the stored original index
            const li = document.createElement('li');
            li.dataset.chapterIndex = index; // Store index for actions

            const chapterTitle = chapter.title || `Chapter ${index + 1}`;

            // Clickable content area for reading
            const itemContent = document.createElement('div');
            itemContent.className = 'item-content';
            itemContent.setAttribute('role', 'button');
            itemContent.tabIndex = 0;
            itemContent.setAttribute('aria-label', `Read ${chapterTitle}`);

            const titleSpan = document.createElement('span');
            titleSpan.className = 'title';
            titleSpan.textContent = chapterTitle;
            itemContent.appendChild(titleSpan);

            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'chapter-timestamp';
            timestampSpan.textContent = `Modified: ${formatTimestamp(chapter.lastModified)}`;
            itemContent.appendChild(timestampSpan);

            // Action buttons container
            const itemActions = document.createElement('div');
            itemActions.className = 'item-actions';

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-chapter-btn icon-btn';
            editBtn.setAttribute('aria-label', `Edit ${chapterTitle}`);
            editBtn.textContent = '✏️';
            editBtn.addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, index); });

            // Download Button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-chapter-btn icon-btn';
            downloadBtn.setAttribute('aria-label', `Download ${chapterTitle}`);
            downloadBtn.textContent = '💾';
            downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, index).catch(err => console.warn("Download failed:", err)); });

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-chapter-btn icon-btn danger';
            deleteBtn.setAttribute('aria-label', `Delete ${chapterTitle}`);
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent triggering read action
                if (confirm(`Are you sure you want to delete chapter: "${chapterTitle}"?\nThis action removes its content permanently and cannot be undone.`)) {
                    try {
                        // Attempt to delete the file first
                        const fileDeleteSuccess = await deleteChapterFile(novelId, index);
                        if (fileDeleteSuccess) {
                            const deletedIndex = index;
                            // Remove chapter metadata
                            novel.chapters.splice(deletedIndex, 1);
                            // Update last read position if affected
                            if (novel.lastReadChapterIndex === deletedIndex) {
                                novel.lastReadChapterIndex = -1; // Reset if deleted chapter was last read
                                novel.lastReadScrollTop = 0;
                            } else if (novel.lastReadChapterIndex > deletedIndex) {
                                novel.lastReadChapterIndex--; // Adjust index if it was after the deleted one
                            }
                            saveNovelsMetadata(); // Save changes
                            renderChapterList(novelId, filterTerm); // Re-render the list
                            loadNovelInfoPage(novelId); // Update the last read display
                            console.log(`Deleted chapter ${deletedIndex} for novel ${novelId}`);
                        } else {
                            // File deletion failed, don't remove metadata
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

            // Add navigation logic to the content area
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
        readerContent.textContent = 'Loading chapter content...'; // Placeholder
        readerContent.style.color = ''; // Reset potential error color
        readerMainContent.scrollTop = 0; // Scroll to top initially

        // Fetch and display content
        const rawContent = await readChapterContent(novelId, chapterIndex);

        if (rawContent.startsWith("Error:")) {
            readerContent.textContent = rawContent;
            readerContent.style.color = 'var(--danger-color)'; // Indicate error visually
        } else {
            readerContent.textContent = rawContent;
        }

        // Update navigation buttons
        prevChapterBtn.disabled = (chapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', String(prevChapterBtn.disabled));
        nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', String(nextChapterBtn.disabled));

        // Restore scroll position *after* content is loaded and rendered
        requestAnimationFrame(() => {
            // Double check we are still on the same page/chapter
            if (readerPage.classList.contains('active') && currentNovelId === novelId && currentChapterIndex === chapterIndex) {
                if (novel.lastReadChapterIndex === chapterIndex) {
                    readerMainContent.scrollTop = novel.lastReadScrollTop;
                } else {
                    // If it's not the last read chapter, ensure it's at the top
                    readerMainContent.scrollTop = 0;
                }
            }
        });
    }

    function closeModal(modalElement) {
        if (!modalElement || modalElement.style.display === 'none') return; // Already hidden

        modalElement.classList.add('closing');

        // Use animationend event to hide after animation finishes
        const animationHandler = () => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
            modalElement.removeEventListener('animationend', animationHandler);
        };
         modalElement.addEventListener('animationend', animationHandler);

         // Fallback timeout in case animationend doesn't fire (e.g., interrupted)
         setTimeout(() => {
             if (modalElement.classList.contains('closing')) {
                 animationHandler(); // Force hide if still closing
             }
         }, MODAL_CLOSE_DELAY + 50); // Slightly longer than expected animation
    }

    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;

        if (isEditing && !novel) {
            console.error(`Cannot edit novel: ID ${novelIdToEdit} not found.`);
            alert("Error: The novel you are trying to edit could not be found.");
            return;
        }

        // Set modal title and pre-fill form
        novelModalTitleHeading.textContent = isEditing ? "Edit Novel Details" : "Add New Novel";
        novelModalIdInput.value = novelIdToEdit || ''; // Store ID if editing
        novelModalTitleInput.value = novel?.title || '';
        novelModalAuthorInput.value = novel?.author || '';
        novelModalGenreInput.value = novel?.genre || '';
        novelModalDescriptionInput.value = novel?.description || '';

        // Show modal and focus first field
        novelModal.style.display = 'block';
        novelModalTitleInput.focus();
    }

    function closeNovelModal() { closeModal(novelModal); }

    function saveNovelFromModal() {
        const id = novelModalIdInput.value;
        const title = novelModalTitleInput.value.trim();

        // Basic validation
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
            // Update existing novel object
            Object.assign(novelToUpdate, { title, author, genre, description });
            console.log(`Updated novel: ${id}`);
        } else {
            // Create new novel object
            novelToUpdate = {
                id: crypto.randomUUID(), // Generate unique ID
                title,
                author,
                genre,
                description,
                chapters: [], // Start with empty chapters
                lastReadChapterIndex: -1,
                lastReadScrollTop: 0
            };
            novelsMetadata.push(novelToUpdate);
            currentNovelId = novelToUpdate.id; // Set as current for potential navigation
            console.log(`Added new novel: ${novelToUpdate.id}`);
        }

        saveNovelsMetadata(); // Persist changes
        closeNovelModal();
        renderNovelList(); // Update home page list

        // If editing, refresh info page if currently viewing it
        if (isEditing) {
            if (document.getElementById('novel-info-page').classList.contains('active') && currentNovelId === id) {
                loadNovelInfoPage(id);
            }
        } else {
            // If adding, navigate to the new novel's info page
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

        // Set modal title and basic info
        chapterModalTitleHeading.textContent = isEditing ? "Edit Chapter" : "Add New Chapter";
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = isEditing ? chapterIndex : ''; // Store index if editing
        chapterModalTitleInput.value = chapter?.title || '';

        // Clear and disable content area initially
        chapterModalContentInput.value = '';
        chapterModalContentInput.disabled = true;

        // Show modal and focus title
        chapterModal.style.display = 'block';
        chapterModalTitleInput.focus();

        // Load content asynchronously if editing
        if (isEditing) {
            chapterModalContentInput.value = 'Loading chapter content...';
            try {
                const rawContent = await readChapterContent(novelId, chapterIndex);
                if (rawContent.startsWith("Error:")) {
                     // Show error but allow editing/saving new content
                     chapterModalContentInput.value = `Could not load existing content.\n${rawContent}\n\nYou can still edit the title or enter new content below and save.`;
                     chapterModalContentInput.disabled = false;
                } else {
                    // Populate with existing content
                    chapterModalContentInput.value = rawContent;
                    chapterModalContentInput.disabled = false;
                }
            } catch(e) {
                // Handle unexpected errors during read
                console.error(`Error loading chapter content in modal:`, e);
                chapterModalContentInput.value = `Critical error loading content: ${e.message}`;
                chapterModalContentInput.disabled = false; // Allow user to potentially fix/overwrite
            }
        } else {
            // Enable content area for new chapters
            chapterModalContentInput.disabled = false;
        }
    }

    function closeChapterModal() { closeModal(chapterModal); }

    async function saveChapterFromModal() {
        const novelId = chapterModalNovelIdInput.value;
        const indexStr = chapterModalIndexInput.value;
        const title = chapterModalTitleInput.value.trim();
        const content = chapterModalContentInput.value; // Get content directly
        const novel = findNovel(novelId);

        // Validation
        if (!title) { alert("Chapter Title is required."); chapterModalTitleInput.focus(); return; }
        if (!novel) { console.error(`Chapter save failed: Associated novel ${novelId} missing.`); alert("Error: Could not find the novel this chapter belongs to."); closeChapterModal(); return; }

        const isNewChapter = indexStr === '';
        const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10);

        // Validate index if editing
        if (!isNewChapter && (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= novel.chapters.length)) {
            console.error(`Chapter save failed: Invalid index ${indexStr} for novel ${novelId}.`);
            alert("Error: Invalid chapter index provided for editing."); closeChapterModal(); return;
        }

        let chapterData;
        let temporaryMetadataAdded = false; // Flag to track if we need to rollback metadata on file save failure
        const nowISO = new Date().toISOString(); // Timestamp for modification

        // Prepare metadata (add temporarily if new)
        if (isNewChapter) {
            chapterData = { title: title, opfsFileName: '', lastModified: nowISO };
            novel.chapters.push(chapterData);
            temporaryMetadataAdded = true;
        } else {
            // Update existing chapter metadata
            chapterData = novel.chapters[chapterIndex];
            chapterData.title = title;
            chapterData.lastModified = nowISO;
        }

        // Attempt to save content to OPFS
        try {
            await saveChapterContent(novelId, chapterIndex, content);
            // If file save is successful, save the metadata permanently
            saveNovelsMetadata();
            console.log(`Successfully saved chapter ${chapterIndex} file and metadata for novel ${novelId}.`);
            closeChapterModal();
            renderChapterList(novelId, chapterSearchInput.value); // Refresh chapter list UI
        } catch (error) {
            // File save failed
            console.error(`Failed to save chapter ${chapterIndex} content for novel ${novelId}:`, error);
            alert(`Chapter save failed: ${error.message}\n\nPlease check storage permissions or try again.`);
            // Rollback metadata addition if it was a new chapter
            if (temporaryMetadataAdded) {
                novel.chapters.pop(); // Remove the temporarily added metadata entry
                console.log("Rolled back temporary metadata addition due to save failure.");
            }
            // Do not close modal, allow user to retry or cancel
        }
    }

    function openReaderSettingsModal() {
        // Load current settings into modal controls
        fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        lineHeightSlider.value = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;
        if (lineHeightValueSpan) lineHeightValueSpan.textContent = lineHeightSlider.value; // Update display value

        readerSettingsModal.style.display = 'block';
    }
    function closeReaderSettingsModal() { closeModal(readerSettingsModal); }

    async function exportAllData() {
        if (!novelsMetadata?.length) { alert("There are no novels to export."); return; }
        // Check for required APIs
        if (!opfsRoot || typeof window.CompressionStream === 'undefined') {
             alert("Export failed: Storage system not ready or CompressionStream API not supported by your browser.");
             return;
        }

        // Update button state
        const originalButtonText = exportButton.textContent;
        const originalButtonLabel = exportButton.ariaLabel;
        exportButton.textContent = '📤'; // Indicate activity visually
        exportButton.disabled = true;
        exportButton.ariaLabel = 'Exporting novels...';

        try {
            console.log("Starting data export process...");
            // Deep copy metadata to avoid modifying the live data
            const exportMetadata = JSON.parse(JSON.stringify(novelsMetadata));

            const exportObject = {
                version: 1, // Versioning for future compatibility
                metadata: exportMetadata,
                chapters: {} // Store chapter content keyed by novelId and chapterIndex
            };

            let chapterReadErrors = 0;
            let successfullyReadChapters = 0;

            // Iterate through novels and their chapters to read content
            for (const novel of exportObject.metadata) {
                 exportObject.chapters[novel.id] = {}; // Initialize chapter object for this novel
                 if (novel.chapters?.length) {
                    for (let i = 0; i < novel.chapters.length; i++) {
                        try {
                            const content = await readChapterContent(novel.id, i);
                             // Check if readChapterContent returned an error string
                             if (content.startsWith("Error:")) throw new Error(content);
                             exportObject.chapters[novel.id][i] = content;
                             successfullyReadChapters++;
                        } catch (readError) {
                            console.error(`Export Read Error - Novel ${novel.id}, Chapter ${i}:`, readError);
                            // Store error marker instead of content
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

            // Serialize, compress, and trigger download
            const jsonString = JSON.stringify(exportObject);
            const dataBlob = new Blob([jsonString], { type: 'application/json' });
            const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(compressedStream).blob();

            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
            a.download = `novels_backup_${timestamp}.novelarchive.gz`; // Standardized filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up object URL

            console.log("Export complete. File download initiated.");
            alert("Export complete! Your backup file should be downloading now.");

        } catch (error) {
            console.error("Export process failed:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            // Restore button state
            exportButton.textContent = originalButtonText;
            exportButton.disabled = false;
            exportButton.ariaLabel = originalButtonLabel;
        }
    }

    function triggerImport() {
        // Check prerequisites
        if (!opfsRoot || typeof window.DecompressionStream === 'undefined') {
            alert("Import failed: Storage system not ready or DecompressionStream API not supported by your browser.");
            return;
        }
        // Warn user about overwriting data
        if (novelsMetadata.length > 0 || localStorage.length > Object.keys(DEFAULT_THEME).length + 3) { // Basic check if any data exists
            if (!confirm('Importing a backup will REPLACE all current novels, chapters, reading progress, and settings.\n\nAre you sure you want to continue?')) {
                return; // User cancelled
            }
        }
        // Trigger file input
        importFileInput.click();
    }

    async function importData(file) {
        if (!file) return; // No file selected
        // Validate file type
        if (!file.name.endsWith('.novelarchive.gz')) {
            alert("Invalid file type. Please select a '.novelarchive.gz' backup file.");
            importFileInput.value = null; // Reset input
            return;
        }
         if (!opfsRoot) {
             alert("Import failed: Storage system is not ready.");
             importFileInput.value = null;
             return;
         }

        // Update UI to indicate import in progress
        const originalButtonText = importButton.textContent;
        const originalButtonLabel = importButton.ariaLabel;
        importButton.textContent = '📥';
        importButton.disabled = true;
        importButton.ariaLabel = 'Importing backup...';
        importFileInput.disabled = true;

        console.log(`Starting import from file: ${file.name}`);
        let previousState = null; // To store data for potential rollback

        try {
             // Backup current state before making changes
             console.log("Backing up current state before import...");
             previousState = {
                 metadata: localStorage.getItem(METADATA_KEY),
                 theme: localStorage.getItem(THEME_KEY),
                 font: localStorage.getItem(FONT_KEY),
                 fontSize: localStorage.getItem(FONT_SIZE_KEY),
                 lineSpacing: localStorage.getItem(LINE_SPACING_KEY)
                 // Note: OPFS content backup is too complex/large for this simple rollback
             };

            // Decompress and parse the file
            console.log("Decompressing and parsing backup file...");
            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const jsonString = await new Response(decompressedStream).text();
            const importObject = JSON.parse(jsonString);

            // Basic validation of the imported object structure
            if (!importObject || typeof importObject !== 'object' || !Array.isArray(importObject.metadata) || typeof importObject.chapters !== 'object') {
                throw new Error("Invalid backup file format. Required 'metadata' array or 'chapters' object is missing.");
            }
            console.log(`Backup file version: ${importObject.version || 'Unknown'}`);
            if (importObject.version !== 1) { console.warn(`Importing data from a potentially incompatible version (${importObject.version}).`); }

            // Clear existing data (metadata and OPFS)
            console.log("Clearing existing application data (localStorage and OPFS)...");
            localStorage.removeItem(METADATA_KEY); // Clear metadata first
            novelsMetadata = []; // Clear in-memory array

            if (opfsRoot) {
                let opfsClearFailed = false;
                const entriesToRemove = [];
                try {
                    if (opfsRoot.values) { // Check for iterator support
                        for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entriesToRemove.push(entry.name); }
                    } else { console.warn("Cannot list OPFS entries for clearing."); opfsClearFailed = true; }

                    await Promise.all(entriesToRemove.map(name =>
                         opfsRoot.removeEntry(name, { recursive: true }).catch(err => { console.warn(`Old OPFS clear error ${name}:`, err); opfsClearFailed = true; })
                     ));
                    if (opfsClearFailed) console.warn("Could not fully clear old OPFS data during import."); else console.log("Cleared old OPFS directories successfully.");
                 } catch (clearError) { console.error("OPFS clearing error during import:", clearError); alert("Warning: Could not fully clear old data before import."); }
            }

            // Restore data from the import object
            console.log("Restoring novels and chapters from backup...");
            let importedNovelsCount = 0;
            let chapterSaveErrors = 0;
            const nowISO = new Date().toISOString(); // For missing timestamps

             // Restore metadata (with validation/defaults)
             novelsMetadata = importObject.metadata.map(novel => ({
                id: novel.id || crypto.randomUUID(),
                title: novel.title || 'Untitled Novel',
                author: novel.author || '',
                genre: novel.genre || '',
                description: novel.description || '',
                chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                    title: ch.title || 'Untitled Chapter',
                    opfsFileName: '', // Reset filename, will be set by saveChapterContent
                    lastModified: ch.lastModified || nowISO // Use stored or current time
                 })) : [],
                lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
                lastReadScrollTop: (typeof novel.lastReadScrollTop === 'number' && novel.lastReadScrollTop >= 0) ? novel.lastReadScrollTop : 0
            }));

            // Restore chapter content
            for (const novel of novelsMetadata) {
                const novelChapterData = importObject.chapters[novel.id];
                if (novelChapterData && typeof novelChapterData === 'object') {
                     for (let i = 0; i < novel.chapters.length; i++) {
                        const content = novelChapterData[i];
                        const chapterMeta = novel.chapters[i]; // Reference to metadata object
                        if (typeof content === 'string' && !content.startsWith('###EXPORT_READ_ERROR###')) {
                            // Valid content found, attempt to save
                            try {
                                await saveChapterContent(novel.id, i, content);
                                // opfsFileName is set within saveChapterContent
                            }
                            catch (saveError) {
                                console.error(`Import Save Error - Novel ${novel.id}, Chapter ${i}:`, saveError);
                                chapterSaveErrors++;
                                chapterMeta.opfsFileName = ''; // Ensure filename is cleared on error
                            }
                        } else if (content?.startsWith('###EXPORT_READ_ERROR###')) {
                            // Skip content that failed during export
                            console.warn(`Skipping content import for Novel ${novel.id}, Chapter ${i} due to previous export error.`);
                            chapterMeta.opfsFileName = '';
                        } else {
                             // Missing or invalid content, save as empty
                             console.warn(`Missing or invalid content for Novel ${novel.id}, Chapter ${i}. Saving as empty.`);
                             try {
                                 await saveChapterContent(novel.id, i, ''); // Save empty string
                             }
                             catch(saveEmptyError) {
                                 console.error(`Import Save Empty Error - Novel ${novel.id}, Chapter ${i}:`, saveEmptyError);
                                 chapterSaveErrors++;
                                 chapterMeta.opfsFileName = '';
                             }
                        }
                    }
                } else {
                    // No chapter data found for this novel in the backup
                    console.warn(`No chapter content data found in backup for Novel ${novel.id}. Chapters will be empty.`);
                    for (let i = 0; i < novel.chapters.length; i++) {
                         try {
                             await saveChapterContent(novel.id, i, ''); // Save empty string
                         } catch (saveEmptyError) {
                             console.error(`Import Save Empty Error (no data) - Novel ${novel.id}, Chapter ${i}:`, saveEmptyError);
                             chapterSaveErrors++;
                             novel.chapters[i].opfsFileName = '';
                         }
                    }
                }
                importedNovelsCount++;
            }

            // Finalize import: save metadata, update UI
            saveNovelsMetadata(); // Save the newly imported metadata
            loadSettings(); // Apply any settings from the backup (implicitly done by clearing/reloading)
            renderNovelList();
            showPage('home-page');

            // Notify user of outcome
            let successMessage = `Import successful! ${importedNovelsCount} novel(s) loaded.`;
            if (chapterSaveErrors > 0) {
                successMessage += `\n\nWarning: ${chapterSaveErrors} chapter(s) could not be saved correctly due to errors. Their content might be missing or empty.`;
            }
            alert(successMessage);
            console.log("Import process finished.");

        } catch (error) {
            // Handle import failure
            console.error("Import process failed:", error);
            alert(`Import failed: ${error.message}\n\nAttempting to restore previous state...`);

            // Attempt rollback using backed-up state
            if (previousState) {
                console.log("Rolling back to previous state...");
                try {
                    // Restore localStorage items
                    if (previousState.metadata) localStorage.setItem(METADATA_KEY, previousState.metadata); else localStorage.removeItem(METADATA_KEY);
                    if (previousState.theme) localStorage.setItem(THEME_KEY, previousState.theme); else localStorage.removeItem(THEME_KEY);
                    if (previousState.font) localStorage.setItem(FONT_KEY, previousState.font); else localStorage.removeItem(FONT_KEY);
                    if (previousState.fontSize) localStorage.setItem(FONT_SIZE_KEY, previousState.fontSize); else localStorage.removeItem(FONT_SIZE_KEY);
                    if (previousState.lineSpacing) localStorage.setItem(LINE_SPACING_KEY, previousState.lineSpacing); else localStorage.removeItem(LINE_SPACING_KEY);

                    // Reload data and UI from restored localStorage
                    loadNovelsMetadata();
                    loadSettings();
                    renderNovelList();
                    showPage('home-page');
                     alert("Previous state restored. Note: Chapter content might be missing if OPFS data was cleared during the failed import attempt.");
                     console.log("Rollback successful (metadata and settings only). OPFS state might be inconsistent.");
                 } catch (rollbackError) {
                     // Catastrophic failure if rollback also fails
                     console.error("Rollback failed:", rollbackError);
                     alert("Critical error: Could not restore previous state after import failure. Data may be inconsistent or lost. Please try refreshing the application or clearing data manually if issues persist.");
                 }
            } else {
                 // Should not happen if backup was successful, but handle defensively
                 alert("Critical error: Could not restore previous state as it wasn't backed up. Application state might be inconsistent.");
                 // Try to reload whatever state might exist
                 loadNovelsMetadata();
                 loadSettings();
                 renderNovelList();
                 showPage('home-page');
            }
        } finally {
            // Reset import button and file input state regardless of success/failure
            importButton.textContent = originalButtonText;
            importButton.disabled = false;
            importButton.ariaLabel = originalButtonLabel;
            importFileInput.disabled = false;
            importFileInput.value = null; // Clear the file input
        }
    }

    function sanitizeFilename(name) {
        // Replace invalid characters with underscore, collapse multiple spaces, trim
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

        // Determine filename consistently based on index
        const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        // Create a user-friendly download filename
        const downloadName = `${sanitizeFilename(novel.title)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapter.title)}.txt`;

        if (!opfsRoot) {
             alert("Download failed: Storage system is not available.");
             throw new Error("OPFS not available for download.");
        }

        try {
             // Get file handle from OPFS
             const novelDirHandle = await getNovelDir(novelId, false);
             const fileHandle = await novelDirHandle.getFileHandle(opfsFileName);
             const file = await fileHandle.getFile(); // Get the File object

            // Create object URL and trigger download
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up
            console.log(`Download initiated successfully: ${downloadName}`);
        } catch (error) {
            if (error.name === 'NotFoundError') {
                 // Specific error for missing file
                 alert(`Download failed for "${chapter.title}": The chapter file (${opfsFileName}) was not found in storage.`);
                 console.warn(`Download failed: File ${opfsFileName} not found for chapter ${chapterIndex}, novel ${novelId}.`);
             }
            else {
                 // General error
                 console.error(`Download error for chapter ${chapterIndex} (Novel ${novelId}, File ${opfsFileName}):`, error);
                 alert(`Download failed for "${chapter.title}": An error occurred (${error.message})`);
            }
            throw error; // Re-throw for potential higher-level handling
        }
    }

    async function downloadAllChaptersCombined(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) { alert("This novel has no chapters to download."); return; }
        if (!opfsRoot) { alert("Download failed: Storage system is not available."); return; }

        const totalChapters = novel.chapters.length;
        // Update button state to show progress
        const originalText = bulkDownloadBtn.textContent;
        bulkDownloadBtn.textContent = 'Preparing...';
        bulkDownloadBtn.disabled = true;
        bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        bulkDownloadBtn.setAttribute('aria-live', 'polite'); // Announce progress to screen readers

        // Build the combined content string
        let combinedContent = `Novel: ${novel.title || 'Untitled Novel'}\n`;
        if (novel.author) combinedContent += `Author: ${novel.author}\n`;
        combinedContent += `Total Chapters: ${totalChapters}\n`;
        combinedContent += "========================================\n\n";

        let successCount = 0;
        let errorCount = 0;

        console.log(`Starting combined download of ${totalChapters} chapters for: ${novel.title}`);

        // Loop through chapters, read content, and append to string
        for (let i = 0; i < totalChapters; i++) {
            const chapter = novel.chapters[i];
            const chapterTitle = chapter.title || `Chapter ${i + 1}`;
            bulkDownloadBtn.textContent = `Reading ${i + 1}/${totalChapters}...`; // Update progress

            combinedContent += `## ${chapterTitle} (Chapter ${i + 1})\n\n`; // Add chapter header

            try {
                const content = await readChapterContent(novelId, i);
                if (content.startsWith("Error:")) { // Check for read errors
                    throw new Error(content);
                }
                combinedContent += content + "\n\n"; // Append content
                successCount++;
            } catch (e) {
                // Append error message if reading fails
                const errorMsg = `### ERROR READING CHAPTER ${i + 1}: ${e.message} ###\n\n`;
                combinedContent += errorMsg;
                errorCount++;
                console.warn(`Combined download: Failed reading chapter ${i} - ${chapterTitle}: ${e.message}`);
            }
            combinedContent += "---\n\n"; // Add separator between chapters
        }

        bulkDownloadBtn.textContent = 'Saving...'; // Indicate saving phase

        try {
            // Create blob and trigger download
            const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sanitizeFilename(novel.title)} - All Chapters.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Notify user of outcome
            console.log(`Combined download finished. Success: ${successCount}, Failed: ${errorCount}`);
            let finalMessage = `Combined download finished for "${novel.title}".\n\nSuccessfully included: ${successCount} chapter(s)`;
            if (errorCount > 0) {
                finalMessage += `\nFailed to include content for: ${errorCount} chapter(s). Check the downloaded file for error messages.`;
            }
            alert(finalMessage);

        } catch (saveError) {
            console.error("Failed to save combined chapter file:", saveError);
            alert(`Failed to create the combined download file: ${saveError.message}`);
        } finally {
            // Restore button state
            bulkDownloadBtn.textContent = originalText;
            bulkDownloadBtn.disabled = false;
            bulkDownloadBtn.setAttribute('aria-disabled', 'false');
            bulkDownloadBtn.removeAttribute('aria-live');
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen()
                .catch(err => {
                    // Inform user if fullscreen request fails
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Update button appearance/label based on fullscreen state
    function updateFullscreenButton() {
        if (document.fullscreenElement) {
            readerFullscreenBtn.textContent = '↙️'; // Indicate exit
            readerFullscreenBtn.setAttribute('aria-label', 'Exit Full Screen');
        } else {
            readerFullscreenBtn.textContent = '⛶'; // Indicate enter
            readerFullscreenBtn.setAttribute('aria-label', 'Enter Full Screen');
        }
    }


    function setupEventListeners() {
        // Page Navigation (Back Buttons)
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // saveReaderPosition(); // Position is saved in showPage now
                showPage(btn.dataset.target || 'home-page'); // Navigate to target or home
            });
        });
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));

        // Theme Toggle
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        // Home Page Actions
        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (event) => {
            if (event.target.files?.length) {
                 importData(event.target.files[0]); // Process selected file
            }
            // Don't reset value here, handled in importData finally block
        });
        exportButton.addEventListener('click', exportAllData);
        novelSearchInput.addEventListener('input', (e) => renderNovelList(e.target.value));

        // Settings Page Actions
        deleteAllDataBtn.addEventListener('click', deleteAllData);

        // Novel Info Page Actions
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
                     currentNovelId = null; // Clear current novel context
                     renderNovelList(); // Refresh home list
                     showPage('home-page'); // Navigate home
                     alert(`Novel "${titleToDelete}" has been deleted.`);
                } catch (error) {
                     console.error("Error during novel deletion flow:", error);
                     alert(`An error occurred while deleting the novel "${titleToDelete}". Some data might remain.`);
                }
             }
        });
        document.getElementById('add-chapter-btn').addEventListener('click', () => {
            if (currentNovelId) openChapterModal(currentNovelId); // Open modal for new chapter
        });
        bulkDownloadBtn.addEventListener('click', () => {
            if (currentNovelId) downloadAllChaptersCombined(currentNovelId);
        });
        chapterSearchInput.addEventListener('input', (e) => {
            if (currentNovelId) renderChapterList(currentNovelId, e.target.value); // Filter chapter list
        });

        // Novel Modal Actions
        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (event) => { if (event.target === novelModal) closeNovelModal(); }); // Close on backdrop click

        // Chapter Modal Actions
        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (event) => { if (event.target === chapterModal) closeChapterModal(); }); // Close on backdrop click
         // Allow Enter in title to move focus to content
         chapterModalTitleInput.addEventListener('keydown', (e) => {
             if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter without Shift
                 e.preventDefault(); // Prevent form submission/newline
                 chapterModalContentInput.focus();
             }
         });

        // Reader Page Actions
        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        readerFullscreenBtn.addEventListener('click', toggleFullScreen);
        document.addEventListener('fullscreenchange', updateFullscreenButton); // Update button on state change

        // Reader Navigation
        prevChapterBtn.addEventListener('click', () => {
            saveReaderPosition(); // Save position before navigating
            if (currentNovelId !== null && currentChapterIndex > 0) {
                currentChapterIndex--;
                loadReaderPage(currentNovelId, currentChapterIndex);
            }
        });
        nextChapterBtn.addEventListener('click', () => {
            saveReaderPosition(); // Save position before navigating
            const novel = findNovel(currentNovelId);
            if (novel && currentChapterIndex < novel.chapters.length - 1) {
                currentChapterIndex++;
                loadReaderPage(currentNovelId, currentChapterIndex);
            }
        });

        // Reader Settings Modal Actions
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (event) => { if (event.target === readerSettingsModal) closeReaderSettingsModal(); }); // Close on backdrop click
        // Apply styles immediately on change
        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value, lineHeightSlider.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value, lineHeightSlider.value));
        lineHeightSlider.addEventListener('input', (e) => applyReaderStyles(fontSelect.value, fontSizeSelect.value, e.target.value)); // Use 'input' for live update

        // Global Keydowns (Escape for modals/fullscreen)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (readerSettingsModal.style.display === 'block') {
                     closeReaderSettingsModal();
                } else if (chapterModal.style.display === 'block') {
                     closeChapterModal();
                } else if (novelModal.style.display === 'block') {
                     closeNovelModal();
                }
            }
        });

        // Save reader state on page unload/hide for robustness
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                saveReaderPosition();
            }
        });
        window.addEventListener('pagehide', () => { // More reliable for unload scenarios
            saveReaderPosition();
        });
    }

    // Start the application
    initializeApp();

});