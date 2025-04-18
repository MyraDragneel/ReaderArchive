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
    // Changed ID for reader main content area
    const readerMainContent = document.getElementById('reader-main-content');
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
    const DEFAULT_FONT = 'Arial, sans-serif'; // Removed Garamond
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_THEME = 'light';
    const MODAL_CLOSE_DELAY = 180;

    // --- Initialization ---
    async function initializeApp() {
        registerServiceWorker();
        const opfsReady = await initOPFS();
        if (!opfsReady) {
            // Alert if OPFS init fails, but proceed - core viewing might work with localStorage only if adapted
             alert("Warning: Origin Private File System (OPFS) is not available or could not be initialized. Saving/loading chapter content will not work.");
        }
        loadSettings();
        loadNovelsMetadata();
        renderNovelList();
        setupEventListeners();
        showPage('home-page'); // Show home page initially
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
            // Prefer navigator.storage.getDirectory() if available
            if (navigator.storage && navigator.storage.getDirectory) {
                opfsRoot = await navigator.storage.getDirectory();
                console.log("OPFS Root acquired via navigator.storage.getDirectory().");
                return true;
            }
            // Fallback for older API (might be removed in future browsers)
            else if (window.webkitRequestFileSystem) {
                 return new Promise((resolve, reject) => {
                    window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024 * 100, // 100MB quota request
                        (fs) => {
                             opfsRoot = fs.root; // This isn't exactly OPFS, but a sandboxed FS
                             console.log("OPFS-like storage acquired via webkitRequestFileSystem.");
                            resolve(true);
                        },
                        (e) => {
                            console.error('webkitRequestFileSystem error:', e);
                            reject(e);
                        }
                    );
                }).catch(err => {
                    console.error('Fallback FS Initialization Error:', err);
                    opfsRoot = null;
                    return false;
                });
            }
            else {
                console.warn('OPFS API (navigator.storage.getDirectory or fallback) not supported.');
                opfsRoot = null;
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

        // Scroll to top of the content area or page itself
        if (activePage) {
             // Special handling for reader page scrolling container
             if (pageId === 'reader-page' && readerMainContent) {
                 readerMainContent.scrollTop = 0;
             } else {
                 const contentArea = activePage.querySelector('.page-content');
                 if (contentArea) {
                    contentArea.scrollTop = 0;
                 } else {
                    // Fallback for pages without a distinct .page-content (like reader potentially)
                    activePage.scrollTop = 0;
                 }
             }
        } else {
            window.scrollTo(0, 0); // Fallback scroll window
        }

        // Load specific page data if needed
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
        applyTheme(theme, false); // Apply without saving again
        applyReaderStyles(font, fontSize, false); // Apply without saving again
        fontSelect.value = font;
        fontSizeSelect.value = fontSize;
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓'; // Set initial icon
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

        // Update meta theme-color for PWA consistency
        const lightMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const darkMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        const lightColor = "#f8f9fa";
        const darkColor = "#1e1e1e";

        if (theme === 'dark') {
             if (lightMatcher) lightMatcher.content = darkColor;
             // Update dark theme meta even if system prefers light
             if (darkMatcher) darkMatcher.content = darkColor;
        } else {
            if (lightMatcher) lightMatcher.content = lightColor;
             // Update dark theme meta even if system prefers dark
             if (darkMatcher) darkMatcher.content = lightColor;
        }

        if (save) saveSetting(THEME_KEY, theme);
    }

    function applyReaderStyles(font, size, save = true) {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--font-family-reader', font);
        rootStyle.setProperty('--font-size-reader', size);

        // Adjust line height based on font size for better readability
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
                // Basic validation
                if (Array.isArray(parsed)) {
                    // Sanitize loaded data
                    novelsMetadata = parsed.map(novel => ({
                        id: novel.id || crypto.randomUUID(), // Ensure ID exists
                        title: novel.title || 'Untitled Novel',
                        author: novel.author || '',
                        genre: novel.genre || '',
                        description: novel.description || '',
                        chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                            title: ch.title || 'Untitled Chapter',
                            // Ensure opfsFileName exists, even if empty
                            opfsFileName: ch.opfsFileName || ''
                        })) : [],
                        // Validate lastReadChapterIndex
                        lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
                    }));
                } else {
                     console.warn("Stored metadata is not an array. Resetting.");
                     localStorage.removeItem(METADATA_KEY); // Remove corrupted data
                }
            } catch (e) {
                console.error("Failed parsing novels metadata:", e);
                localStorage.removeItem(METADATA_KEY); // Remove corrupted data
                alert("Could not load novel list due to corrupted data. The list has been reset.");
            }
        }
        // Ensure list is sorted after loading/parsing
        novelsMetadata.sort((a, b) => a.title.localeCompare(b.title));
    }

    function saveNovelsMetadata() {
        try {
            // Ensure sorting before saving
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
        // Check bounds carefully
        return (novel?.chapters && chapterIndex >= 0 && chapterIndex < novel.chapters.length)
               ? novel.chapters[chapterIndex]
               : null;
    }

    // --- OPFS File Operations ---
     async function getNovelDir(novelId, create = false) {
        if (!opfsRoot) throw new Error("OPFS not initialized or available.");
        try {
             // Standard OPFS API
            if (opfsRoot.getDirectoryHandle) {
                return await opfsRoot.getDirectoryHandle(novelId, { create });
            }
            // Fallback (webkitFileSystem) - Less standard, more synchronous-like callbacks
            else if (opfsRoot.getDirectory) {
                return new Promise((resolve, reject) => {
                    opfsRoot.getDirectory(novelId, { create }, resolve, reject);
                });
            } else {
                throw new Error("Unsupported OPFS/FileSystem handle.");
            }
        } catch (error) {
            console.error(`Error getting directory handle for novel ${novelId} (create: ${create}):`, error);
            throw error; // Re-throw for calling function to handle
        }
    }


    async function saveChapterContent(novelId, chapterIndex, content) {
        if (!opfsRoot) throw new Error("OPFS not ready for saving.");

        const novel = findNovel(novelId);
        const chapter = novel?.chapters?.[chapterIndex];
        if (!chapter) throw new Error(`Chapter metadata missing for novel ${novelId}, index ${chapterIndex}.`);

        // Generate a consistent filename
        const fileName = `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        // Update metadata immediately (even if save fails, this reflects intent)
        chapter.opfsFileName = fileName;

        try {
            const novelDirHandle = await getNovelDir(novelId, true); // Ensure directory exists

             // Standard OPFS API
            if (novelDirHandle.getFileHandle) {
                 const fileHandle = await novelDirHandle.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
            }
            // Fallback (webkitFileSystem)
            else if (novelDirHandle.getFile) {
                 await new Promise((resolve, reject) => {
                    novelDirHandle.getFile(fileName, { create: true }, (fileEntry) => {
                         fileEntry.createWriter((fileWriter) => {
                            fileWriter.onwriteend = () => {
                                // Check if truncation is needed (overwrite)
                                if (fileWriter.length > content.length) {
                                     fileWriter.onwriteend = resolve; // Resolve after truncate completes
                                     fileWriter.truncate(content.length);
                                } else {
                                    resolve();
                                }
                            };
                            fileWriter.onerror = reject;
                            const blob = new Blob([content], { type: 'text/plain' });
                            fileWriter.write(blob);
                        }, reject);
                    }, reject);
                });
            } else {
                 throw new Error("Unsupported Directory handle for file operations.");
            }

            console.log(`Successfully saved chapter ${chapterIndex} (file: ${fileName})`);
            return true; // Indicate success

        } catch (error) {
            console.error(`Error saving chapter ${chapterIndex} content (file: ${fileName}):`, error);
            // Don't revert opfsFileName here, it might be correct for a future attempt
            throw new Error(`Failed to save chapter file: ${error.message}`); // Propagate error
        }
    }

    async function readChapterContent(novelId, chapterIndex) {
        if (!opfsRoot) return "Error: File storage unavailable.";

        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter) return "Error: Chapter metadata not found.";

        // Derive filename if not stored (legacy or error fallback)
        const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return "Error: Chapter file information missing."; // Should not happen if metadata is sound

        try {
            const novelDirHandle = await getNovelDir(novelId, false); // Don't create if reading

             // Standard OPFS API
            if (novelDirHandle.getFileHandle) {
                 const fileHandle = await novelDirHandle.getFileHandle(fileName);
                const file = await fileHandle.getFile();
                return await file.text();
            }
            // Fallback (webkitFileSystem)
            else if (novelDirHandle.getFile) {
                return await new Promise((resolve, reject) => {
                     novelDirHandle.getFile(fileName, {}, (fileEntry) => {
                        fileEntry.file((file) => {
                             const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsText(file);
                        }, reject);
                    }, (err) => {
                        // Handle file not found specifically for this fallback
                        if (err.name === 'NotFoundError' || err.code === FileError.NOT_FOUND_ERR) {
                             reject(new DOMException('File not found', 'NotFoundError'));
                        } else {
                            reject(err);
                        }
                    });
                 });
             } else {
                 throw new Error("Unsupported Directory handle for file operations.");
             }
        } catch (error) {
            // Normalize "Not Found" error reporting
             if (error.name === 'NotFoundError' || (error.code && error.code === FileError.NOT_FOUND_ERR)) {
                console.warn(`File not found for chapter ${chapterIndex} (Novel ${novelId}, File: ${fileName}).`);
                return `Error: Chapter file (${fileName}) not found in storage.`;
            }
            // Log other errors and report generic failure
            console.error(`Error reading chapter ${chapterIndex} (file: ${fileName}):`, error);
            return `Error reading file: ${error.message}`;
        }
    }


     async function deleteChapterFile(novelId, chapterIndex) {
        if (!opfsRoot) {
            console.warn("OPFS not available, cannot delete chapter file.");
            return false; // Indicate failure
        }

        const chapter = findChapter(novelId, chapterIndex);
        const fileName = chapter?.opfsFileName;

        // If no filename stored, assume file doesn't exist or metadata is inconsistent
        if (!fileName) {
            console.warn(`Skipping file deletion for chapter ${chapterIndex} (Novel ${novelId}): No filename stored.`);
            return true; // Treat as success (nothing to delete)
        }

        try {
            const novelDirHandle = await getNovelDir(novelId, false); // Don't create

             // Standard OPFS API
             if (novelDirHandle.removeEntry) {
                 await novelDirHandle.removeEntry(fileName);
             }
              // Fallback (webkitFileSystem) - requires getting the entry first
             else if (novelDirHandle.getFile) {
                 await new Promise((resolve, reject) => {
                    novelDirHandle.getFile(fileName, {}, (fileEntry) => {
                        fileEntry.remove(resolve, reject);
                    }, (err) => {
                        // If file not found during delete attempt, it's effectively deleted
                         if (err.name === 'NotFoundError' || err.code === FileError.NOT_FOUND_ERR) {
                            resolve();
                        } else {
                            reject(err);
                        }
                     });
                 });
             } else {
                 throw new Error("Unsupported Directory handle for file operations.");
             }

            console.log(`Deleted file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}).`);
            return true; // Indicate success

        } catch (error) {
             // Normalize "Not Found" error handling during deletion
             if (error.name === 'NotFoundError' || (error.code && error.code === FileError.NOT_FOUND_ERR)) {
                console.warn(`Attempted delete file ${fileName} (chapter ${chapterIndex}, novel ${novelId}), not found. Considered success.`);
                return true; // File already gone is a success state
            }
            // Log actual errors
            console.error(`Error deleting file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}):`, error);
            return false; // Indicate failure
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.warn(`Attempted delete non-existent novel metadata: ${novelId}`);
            return; // Nothing to do if metadata is gone
        }

        // Attempt OPFS directory removal first
        if (opfsRoot) {
            try {
                 console.log(`Attempting to remove OPFS directory: ${novelId}`);
                 // Standard OPFS API
                 if (opfsRoot.removeEntry) {
                     await opfsRoot.removeEntry(novelId, { recursive: true });
                 }
                 // Fallback (webkitFileSystem) - requires getting the entry first
                 else if (opfsRoot.getDirectory) {
                    await new Promise((resolve, reject) => {
                        opfsRoot.getDirectory(novelId, {}, (dirEntry) => {
                             dirEntry.removeRecursively(resolve, reject);
                        }, (err) => {
                            // If dir not found during delete attempt, it's effectively deleted
                            if (err.name === 'NotFoundError' || err.code === FileError.NOT_FOUND_ERR) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        });
                    });
                 } else {
                     console.warn("Unsupported OPFS/FileSystem handle for directory removal.");
                 }
                console.log(`Successfully removed OPFS directory: ${novelId}`);
            } catch (error) {
                 // Normalize "Not Found" error handling
                if (error.name !== 'NotFoundError' && (!error.code || error.code !== FileError.NOT_FOUND_ERR)) {
                    console.error(`Error deleting OPFS directory ${novelId}:`, error);
                    // Alert user but proceed with metadata removal
                    alert(`Warning: Could not delete all files for novel "${novel.title}". Some data may remain.`);
                } else {
                    console.log(`OPFS directory ${novelId} not found, skipping removal.`);
                }
            }
        } else {
            console.warn("OPFS not available, cannot delete novel directory data.");
            // Optionally alert the user that files might remain if OPFS was expected
            // alert(`Warning: Could not delete files for novel "${novel.title}" as storage is unavailable.`);
        }

        // Remove metadata from the array
        const novelIndex = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIndex > -1) {
            novelsMetadata.splice(novelIndex, 1);
            saveNovelsMetadata(); // Persist the removal
            console.log(`Removed metadata for novel: ${novelId}`);
        }
    }


    async function deleteAllData() {
        if (!confirm('⚠️ WARNING! ⚠️\n\nThis will permanently delete ALL novels, chapters, reading progress, and display settings stored by this app in your browser.\n\nThis action CANNOT BE UNDONE.\n\nAre you absolutely sure you want to proceed?')) {
            return; // User cancelled
        }

        // 1. Clear localStorage
        try {
            localStorage.removeItem(METADATA_KEY);
            localStorage.removeItem(THEME_KEY);
            localStorage.removeItem(FONT_KEY);
            localStorage.removeItem(FONT_SIZE_KEY);
            novelsMetadata = []; // Clear in-memory state
            console.log("Cleared localStorage data.");
        } catch (e) {
            console.error("Error clearing localStorage:", e);
            alert("An error occurred while clearing settings data.");
            // Decide whether to proceed with OPFS clear or stop
        }

        // 2. Clear OPFS
        if (opfsRoot) {
            console.log("Attempting to clear OPFS directories...");
            let opfsClearFailed = false;
            try {
                const entriesToRemove = [];
                // Standard OPFS API iteration
                if (opfsRoot.values) {
                    for await (const entry of opfsRoot.values()) {
                        // Ensure we only try to remove directories (novel data containers)
                        if (entry.kind === 'directory') {
                            entriesToRemove.push(entry.name);
                        }
                    }
                }
                // Fallback (webkitFileSystem) iteration
                else if (opfsRoot.createReader) {
                    await new Promise((resolve, reject) => {
                         const dirReader = opfsRoot.createReader();
                        dirReader.readEntries((entries) => {
                             entries.forEach(entry => {
                                if (entry.isDirectory) {
                                    entriesToRemove.push(entry.name);
                                }
                            });
                            resolve();
                        }, reject);
                    });
                } else {
                     console.warn("Unsupported OPFS/FileSystem handle for listing entries.");
                 }

                console.log(`Found OPFS directories to remove: ${entriesToRemove.join(', ')}`);

                // Map removal promises
                 const removalPromises = entriesToRemove.map(name => {
                    // Standard OPFS API
                    if (opfsRoot.removeEntry) {
                        return opfsRoot.removeEntry(name, { recursive: true })
                            .then(() => console.log(`Removed OPFS dir: ${name}`))
                            .catch(err => {
                                console.error(`Failed to remove OPFS dir ${name}:`, err);
                                opfsClearFailed = true; // Mark failure
                            });
                    }
                    // Fallback (webkitFileSystem)
                    else if (opfsRoot.getDirectory) {
                         return new Promise((resolve, reject) => {
                            opfsRoot.getDirectory(name, {}, (dirEntry) => {
                                 dirEntry.removeRecursively(() => {
                                    console.log(`Removed OPFS dir (fallback): ${name}`);
                                    resolve();
                                }, (err) => {
                                    console.error(`Failed remove OPFS dir ${name} (fallback):`, err);
                                     opfsClearFailed = true;
                                     reject(err); // Reject promise on error
                                });
                            }, (err) => {
                                // Ignore if directory not found during delete all
                                 if (err.name === 'NotFoundError' || err.code === FileError.NOT_FOUND_ERR) {
                                     console.warn(`Dir ${name} not found during clear, skipping.`);
                                     resolve();
                                } else {
                                     console.error(`Error getting dir ${name} for removal (fallback):`, err);
                                     opfsClearFailed = true;
                                     reject(err);
                                }
                             });
                         });
                     } else {
                         console.warn(`Cannot remove directory ${name}, unsupported handle.`);
                         return Promise.resolve(); // Resolve immediately if unsupported
                     }
                 });

                await Promise.all(removalPromises); // Wait for all removals

                if (!opfsClearFailed) {
                    console.log("Finished OPFS clearing successfully.");
                } else {
                    console.warn("Finished OPFS clearing with errors.");
                    alert('Warning: Could not automatically clear all stored novel files. Some data might remain.');
                }

            } catch (error) {
                console.error('Error during OPFS clearing process:', error);
                alert('An error occurred while clearing stored novel files.');
                opfsClearFailed = true;
            }
        } else {
            console.warn("OPFS not available, skipping OPFS clear operation.");
            // Optionally inform the user that files might remain if they expected OPFS
            // alert("Storage system not available, could not clear novel files.");
        }

        // 3. Reset UI and Settings to defaults
        applyTheme(DEFAULT_THEME); // Apply default theme
        applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE); // Apply default styles
        fontSelect.value = DEFAULT_FONT;
        fontSizeSelect.value = DEFAULT_FONT_SIZE;
        renderNovelList(); // Update the novel list (should show empty placeholder)
        showPage('home-page'); // Navigate back to home

        // 4. Final confirmation
        alert('All application data has been deleted.');
    }


    // --- UI Rendering ---
    function renderNovelList() {
        novelList.innerHTML = ''; // Clear existing list
        if (novelsMetadata.length === 0) {
            novelList.innerHTML = '<li class="placeholder">No novels yet. Use ➕ to add one!</li>';
            exportButton.disabled = true;
            exportButton.setAttribute('aria-disabled', 'true');
            return;
        }

        // Enable export if there's data
        exportButton.disabled = false;
        exportButton.setAttribute('aria-disabled', 'false');

        novelsMetadata.forEach(novel => {
            const li = document.createElement('li');
            li.dataset.novelId = novel.id;
            li.setAttribute('role', 'button');
            li.tabIndex = 0;
            li.setAttribute('aria-label', `Open novel: ${novel.title || 'Untitled Novel'}`);

            // Use textContent for security and simplicity
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
                    e.preventDefault(); // Prevent space scrolling page
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

        // Update novel details using textContent
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
            novelInfoLastRead.setAttribute('role', 'link'); // Semantically a link
            novelInfoLastRead.tabIndex = 0; // Make focusable
            novelInfoLastRead.setAttribute('aria-label', `Continue reading: ${chapterTitle}`);

            // Define click/keydown handler separately for clarity and potential reuse/removal
            const continueReadingHandler = (e) => {
                 if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                     e.preventDefault();
                    currentChapterIndex = lastReadChapterIndex;
                    showPage('reader-page');
                }
            };

            // Remove previous listeners before adding new ones to prevent duplicates
            novelInfoLastRead.onclick = null;
            novelInfoLastRead.onkeydown = null;
            novelInfoLastRead.addEventListener('click', continueReadingHandler);
            novelInfoLastRead.addEventListener('keydown', continueReadingHandler);

        } else {
            novelInfoLastRead.textContent = 'Never';
            novelInfoLastRead.classList.remove('clickable');
            novelInfoLastRead.removeAttribute('role');
            novelInfoLastRead.tabIndex = -1; // Not focusable
            novelInfoLastRead.removeAttribute('aria-label');
            novelInfoLastRead.onclick = null; // Remove listeners
            novelInfoLastRead.onkeydown = null;
        }

        // Render the chapter list for this novel
        renderChapterList(novelId);
    }

    function renderChapterList(novelId) {
        const novel = findNovel(novelId);
        chapterListEl.innerHTML = ''; // Clear previous list

        const chapters = novel?.chapters || [];

        // Update bulk download button state
        const hasChapters = chapters.length > 0;
        bulkDownloadBtn.disabled = !hasChapters;
        bulkDownloadBtn.setAttribute('aria-disabled', String(!hasChapters));

        if (!hasChapters) {
            chapterListEl.innerHTML = '<li class="placeholder">No chapters added yet.</li>';
            return;
        }

        chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.dataset.chapterIndex = index; // Store index for event handlers

            const chapterTitle = chapter.title || `Chapter ${index + 1}`;

            // Create elements programmatically for better control and security
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

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-chapter-btn icon-btn';
            editBtn.setAttribute('aria-label', `Edit ${chapterTitle}`);
            editBtn.textContent = '✏️';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent li click event
                openChapterModal(novelId, index);
            });

            // Download Button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-chapter-btn icon-btn';
            downloadBtn.setAttribute('aria-label', `Download ${chapterTitle}`);
            downloadBtn.textContent = '💾';
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadChapter(novelId, index).catch(err => console.warn("Download failed:", err)); // Handle promise rejection
            });

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-chapter-btn icon-btn danger';
            deleteBtn.setAttribute('aria-label', `Delete ${chapterTitle}`);
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete chapter: "${chapterTitle}"?\nThis action removes its content permanently and cannot be undone.`)) {
                    try {
                        const deleteSuccess = await deleteChapterFile(novelId, index);
                        if (deleteSuccess) {
                            // Remove chapter from metadata
                            novel.chapters.splice(index, 1);
                            // Adjust last read index if necessary
                            if (novel.lastReadChapterIndex === index) {
                                novel.lastReadChapterIndex = -1; // Reset if deleted chapter was last read
                            } else if (novel.lastReadChapterIndex > index) {
                                novel.lastReadChapterIndex--; // Decrement if a later chapter was last read
                            }
                            saveNovelsMetadata(); // Persist changes
                            renderChapterList(novelId); // Re-render the list
                            loadNovelInfoPage(novelId); // Update the "Last Read" display
                            console.log(`Deleted chapter ${index} for novel ${novelId}`);
                        } else {
                            // This case might occur if OPFS fails but user confirms
                            alert(`Failed to delete the file for chapter "${chapterTitle}". Metadata was not removed.`);
                        }
                    } catch(error) {
                         console.error(`Error during chapter deletion process:`, error);
                         alert(`An error occurred while trying to delete the chapter "${chapterTitle}".`);
                    }
                }
            });

            // Append buttons to actions container
            itemActions.appendChild(editBtn);
            itemActions.appendChild(downloadBtn);
            itemActions.appendChild(deleteBtn);

            // Add navigation listener to the title container
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

            // Append content and actions to the list item
            li.appendChild(itemContent);
            li.appendChild(itemActions);

            // Append the list item to the chapter list
            chapterListEl.appendChild(li);
        });
    }

    // --- Helper function to escape HTML special characters ---
    function escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML; // Uses browser's built-in escaping
        // Manual alternative:
        // return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }


    async function loadReaderPage(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);

        // Validate data presence
        if (!chapter || !novel) {
            console.error(`Reader load failed: Novel (${novelId}) or Chapter (${chapterIndex}) not found.`);
            readerChapterTitle.textContent = "Error";
            readerContent.innerHTML = '<p style="color: var(--danger-color);">Error: Could not load chapter data. Novel or chapter metadata missing.</p>';
            // Disable navigation buttons on error
            prevChapterBtn.disabled = true; prevChapterBtn.setAttribute('aria-disabled', 'true');
            nextChapterBtn.disabled = true; nextChapterBtn.setAttribute('aria-disabled', 'true');
            return; // Stop execution
        }

        // Update chapter title
        readerChapterTitle.textContent = chapter.title || `Chapter ${chapterIndex + 1}`;

        // Show loading state
        readerContent.innerHTML = '<p>Loading chapter content...</p>';

        // Update last read chapter in metadata (do this before async read)
        if (novel.lastReadChapterIndex !== chapterIndex) {
             novel.lastReadChapterIndex = chapterIndex;
            saveNovelsMetadata();
            // If the info page is currently displayed elsewhere (unlikely but possible), update its last read display
            // This check is minor optimization; loadNovelInfoPage is more robust if needed later.
            if (document.getElementById('novel-info-page') && findNovel(novelId)) {
                 // Maybe update only the last read span for performance?
                 loadNovelInfoPage(novelId); // Reload info page state if needed
            }
        }


        // Read chapter content from OPFS
        const rawContent = await readChapterContent(novelId, chapterIndex);

        // Process and display content
        if (rawContent.startsWith("Error:")) {
            // Display file read errors clearly
            readerContent.innerHTML = `<p style="color: var(--danger-color);">${escapeHTML(rawContent)}</p>`;
        } else {
            // *** HTML Escaping Fix ***
            // 1. Escape the entire raw content first to prevent injection
            const escapedContent = escapeHTML(rawContent);
            // 2. Then, replace newlines with paragraph tags for formatting
            // Ensure the first line also gets wrapped in <p>
            const formattedContent = `<p>${escapedContent.replace(/\n+/g, '</p><p>')}</p>`;
            // Replace potential empty paragraphs created by multiple newlines
            readerContent.innerHTML = formattedContent.replace(/<p><\/p>/g, '');
        }

        // Update navigation buttons state
        prevChapterBtn.disabled = (chapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', String(prevChapterBtn.disabled));
        nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', String(nextChapterBtn.disabled));

        // Scroll reader content area to top
        readerMainContent.scrollTop = 0;
    }


    // --- Modal Handling ---
    function closeModal(modalElement) {
        if (!modalElement || modalElement.style.display === 'none') return; // Already closed or closing

        modalElement.classList.add('closing');

        // Use 'animationend' event for smoother closing synchronized with animation
        const animationHandler = () => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
            modalElement.removeEventListener('animationend', animationHandler);
        };
         modalElement.addEventListener('animationend', animationHandler);

        // Fallback timeout in case animationend doesn't fire (e.g., reduced motion settings)
        setTimeout(() => {
             if (modalElement.classList.contains('closing')) {
                 animationHandler(); // Force close if animation didn't finish
             }
        }, MODAL_CLOSE_DELAY + 50); // Slightly longer than animation
    }

    // --- Novel Modal ---
    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;

        if (isEditing && !novel) {
            console.error(`Cannot edit novel: ID ${novelIdToEdit} not found.`);
            alert("Error: The novel you are trying to edit could not be found.");
            return; // Stop if novel doesn't exist
        }

        // Set modal title
        novelModalTitleHeading.textContent = isEditing ? "Edit Novel Details" : "Add New Novel";

        // Populate form fields
        novelModalIdInput.value = novelIdToEdit || ''; // Store ID if editing
        novelModalTitleInput.value = novel?.title || '';
        novelModalAuthorInput.value = novel?.author || '';
        novelModalGenreInput.value = novel?.genre || '';
        novelModalDescriptionInput.value = novel?.description || '';

        // Display the modal
        novelModal.style.display = 'block';
        // Focus the first input field for accessibility
        novelModalTitleInput.focus();
    }

    function closeNovelModal() {
        closeModal(novelModal);
        // Optional: Reset form fields after closing animation
        // setTimeout(() => {
        //     novelModalIdInput.value = '';
        //     novelModalTitleInput.value = '';
        //     // ... reset other fields ...
        // }, MODAL_CLOSE_DELAY);
    }

    function saveNovelFromModal() {
        const id = novelModalIdInput.value; // Will be empty if adding new
        const title = novelModalTitleInput.value.trim();

        // Basic validation
        if (!title) {
            alert("Novel Title is required.");
            novelModalTitleInput.focus(); // Focus the problematic field
            return; // Stop saving
        }

        // Get other fields
        const author = novelModalAuthorInput.value.trim();
        const genre = novelModalGenreInput.value.trim();
        const description = novelModalDescriptionInput.value.trim(); // Trim description too

        const isEditing = !!id;
        let novelToUpdate;

        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) {
                // Should not happen if openNovelModal worked correctly, but good failsafe
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
                id: crypto.randomUUID(), // Generate a new unique ID
                title,
                author,
                genre,
                description,
                chapters: [], // Initialize with empty chapters array
                lastReadChapterIndex: -1 // Initialize last read index
            };
            novelsMetadata.push(novelToUpdate); // Add to the main array
            currentNovelId = novelToUpdate.id; // Set as current novel for potential navigation
            console.log(`Added new novel: ${novelToUpdate.id}`);
        }

        saveNovelsMetadata(); // Persist changes to localStorage
        closeNovelModal();
        renderNovelList(); // Update the list on the home page

        // Update or navigate after saving
        if (isEditing) {
            // If the info page for this novel is currently active, reload it
            if (document.getElementById('novel-info-page').classList.contains('active') && currentNovelId === id) {
                loadNovelInfoPage(id);
            }
        } else {
            // If adding a new novel, navigate to its info page
            showPage('novel-info-page');
        }
    }


    // --- Chapter Modal ---
    async function openChapterModal(novelId, chapterIndex = null) {
        const novel = findNovel(novelId);
        if (!novel) {
            console.error(`Cannot open chapter modal: Novel ID ${novelId} not found.`);
            alert("Error: Could not find the associated novel.");
            return;
        }

        const isEditing = chapterIndex !== null && chapterIndex >= 0;
        const chapter = isEditing ? findChapter(novelId, chapterIndex) : null;

        if (isEditing && chapter === null) {
            console.error(`Cannot edit chapter: Index ${chapterIndex} invalid for novel ${novelId}.`);
            alert("Error: The chapter you are trying to edit could not be found.");
            return;
        }

        // Set modal title
        chapterModalTitleHeading.textContent = isEditing ? "Edit Chapter" : "Add New Chapter";

        // Store context
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = isEditing ? chapterIndex : ''; // Store index if editing

        // Set chapter title input
        chapterModalTitleInput.value = chapter?.title || '';
        // Clear and disable content textarea initially
        chapterModalContentInput.value = '';
        chapterModalContentInput.disabled = true;

        // Display the modal first
        chapterModal.style.display = 'block';
        chapterModalTitleInput.focus(); // Focus title input first

        // Load content asynchronously AFTER modal is visible
        if (isEditing) {
            chapterModalContentInput.value = 'Loading chapter content...'; // Show loading indicator
            try {
                const rawContent = await readChapterContent(novelId, chapterIndex);
                if (rawContent.startsWith("Error:")) {
                     // Handle content load error, allow editing title or saving new content
                     chapterModalContentInput.value = `Could not load existing content.\n${rawContent}\n\nYou can still edit the title or enter new content below and save.`;
                     chapterModalContentInput.disabled = false; // Enable editing despite load error
                } else {
                    // Successfully loaded content
                    chapterModalContentInput.value = rawContent;
                    chapterModalContentInput.disabled = false; // Enable editing
                }
            } catch(e) {
                // Catch potential errors from readChapterContent promise itself
                console.error(`Error loading chapter content in modal:`, e);
                chapterModalContentInput.value = `Critical error loading content: ${e.message}`;
                // Keep disabled if critical error occurred
            }
        } else {
            // If adding new chapter, just enable the empty textarea
            chapterModalContentInput.disabled = false;
        }
    }


    function closeChapterModal() {
        closeModal(chapterModal);
        // Reset fields after closing to prevent flicker
        // setTimeout(() => {
        //     chapterModalTitleInput.value = '';
        //     chapterModalContentInput.value = '';
        //     chapterModalNovelIdInput.value = '';
        //     chapterModalIndexInput.value = '';
        //     chapterModalContentInput.disabled = false;
        // }, MODAL_CLOSE_DELAY);
    }

    async function saveChapterFromModal() {
        const novelId = chapterModalNovelIdInput.value;
        const indexStr = chapterModalIndexInput.value;
        const title = chapterModalTitleInput.value.trim();
        const content = chapterModalContentInput.value; // Get content as is (no trim usually)
        const novel = findNovel(novelId);

        // --- Validation ---
        if (!title) {
            alert("Chapter Title is required.");
            chapterModalTitleInput.focus();
            return;
        }
        // Warn if content is empty, but allow saving if confirmed
        if (!content && !confirm("The chapter content is empty. Do you want to save it anyway?")) {
            chapterModalContentInput.focus();
            return;
        }
        if (!novel) {
            console.error(`Chapter save failed: Associated novel ${novelId} missing.`);
            alert("Error: Could not find the novel this chapter belongs to.");
            closeChapterModal();
            return;
        }

        const isNewChapter = indexStr === '';
        const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10);

        // Validate index if editing
        if (!isNewChapter && (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= novel.chapters.length)) {
            console.error(`Chapter save failed: Invalid index ${indexStr} for novel ${novelId}.`);
            alert("Error: Invalid chapter index provided for editing.");
            closeChapterModal();
            return;
        }

        // --- Prepare Chapter Metadata ---
        let chapterData;
        let temporaryMetadataAdded = false; // Flag to track if we need to rollback metadata on save failure

        if (isNewChapter) {
            // Create new metadata object (filename will be set by saveChapterContent)
            chapterData = { title: title, opfsFileName: '' };
            // Add *temporarily* to the array to allow saveChapterContent to find it
            novel.chapters.push(chapterData);
            temporaryMetadataAdded = true;
            console.log(`Temporarily added metadata for new chapter at index ${chapterIndex}`);
        } else {
            // Get existing metadata object
            chapterData = novel.chapters[chapterIndex];
            // Update title in existing metadata
            chapterData.title = title;
             console.log(`Updating metadata title for chapter ${chapterIndex}`);
        }

        // --- Attempt to Save Content to OPFS ---
        try {
            // This function saves the file AND updates chapterData.opfsFileName internally
            await saveChapterContent(novelId, chapterIndex, content);

            // --- Persist Metadata Changes ---
            // If OPFS save was successful, save the updated metadata array
            saveNovelsMetadata();
            console.log(`Successfully saved chapter ${chapterIndex} file and metadata for novel ${novelId}.`);

            // --- UI Updates ---
            closeChapterModal();
            renderChapterList(novelId); // Update the chapter list on the info page

        } catch (error) {
            // --- Handle Save Failure ---
            console.error(`Failed to save chapter ${chapterIndex} content for novel ${novelId}:`, error);
            alert(`Chapter save failed: ${error.message}\n\nPlease check storage permissions or try again.`);

            // Rollback temporary metadata addition if saving a *new* chapter failed
            if (temporaryMetadataAdded) {
                novel.chapters.pop(); // Remove the placeholder metadata
                console.log("Rolled back temporary metadata addition due to save failure.");
            }
            // Note: If editing failed, we leave the title change in memory,
            // but it won't be persisted by saveNovelsMetadata() yet.
            // The user would need to try saving again.
        }
    }

    // --- Reader Settings Modal ---
    function openReaderSettingsModal() {
        // Ensure dropdowns reflect current settings when opening
        fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        readerSettingsModal.style.display = 'block';
    }

    function closeReaderSettingsModal() {
        closeModal(readerSettingsModal);
    }

    // --- Import / Export ---
     async function exportAllData() {
        if (!novelsMetadata?.length) {
            alert("There are no novels to export.");
            return;
        }
        if (!window.CompressionStream || !navigator.storage?.getDirectory) {
             // Check for essential APIs
             alert("Export failed: Your browser does not support the required features (CompressionStream or OPFS).");
            return;
        }
        if (!opfsRoot) {
             alert("Export failed: Storage system is not ready. Please try again later.");
             return;
        }

        // Update button state
        const originalButtonText = exportButton.textContent;
        const originalButtonLabel = exportButton.ariaLabel;
        exportButton.textContent = '📤'; // Using emoji for visual feedback
        exportButton.disabled = true;
        exportButton.ariaLabel = 'Exporting novels...';

        try {
            console.log("Starting data export process...");
            const exportObject = {
                version: 1, // Versioning for future compatibility
                metadata: [], // Will hold sanitized metadata
                chapters: {} // Will hold chapter content { novelId: { chapterIndex: content } }
            };

            // Deep copy and potentially sanitize metadata for export
            // This prevents modification of the live data and removes runtime states if any
            exportObject.metadata = JSON.parse(JSON.stringify(novelsMetadata));

            let chapterReadErrors = 0;
            let successfullyReadChapters = 0;

            // Iterate through novels and their chapters to read content
            for (const novel of exportObject.metadata) { // Iterate the copied metadata
                 exportObject.chapters[novel.id] = {}; // Initialize chapter object for this novel
                 if (novel.chapters?.length) {
                    console.log(`Exporting ${novel.chapters.length} chapters for novel: ${novel.title}`);
                    for (let i = 0; i < novel.chapters.length; i++) {
                        try {
                            // Use the original novel ID from the loop to read content
                            const content = await readChapterContent(novel.id, i);
                             if (content.startsWith("Error:")) {
                                // If readChapterContent indicates an error (e.g., file not found)
                                throw new Error(content);
                             }
                             exportObject.chapters[novel.id][i] = content;
                             successfullyReadChapters++;
                        } catch (readError) {
                            console.error(`Export Read Error - Novel ${novel.id}, Chapter ${i}:`, readError);
                            // Store error placeholder instead of content
                            exportObject.chapters[novel.id][i] = `###EXPORT_READ_ERROR### Could not read chapter content: ${readError.message}`;
                            chapterReadErrors++;
                        }
                    }
                }
            }

            console.log(`Chapter export summary: ${successfullyReadChapters} read successfully, ${chapterReadErrors} failed.`);
            if (chapterReadErrors > 0) {
                 // Inform user about partial export
                 alert(`Warning: ${chapterReadErrors} chapter(s) could not be read and will be missing or marked as errors in the backup file.`);
            }

            // Convert the entire export object to JSON
            const jsonString = JSON.stringify(exportObject);

            // Create a Blob from the JSON string
            const dataBlob = new Blob([jsonString], { type: 'application/json' });

            // Compress the Blob using GZip
             const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip'));
             const compressedBlob = await new Response(compressedStream).blob(); // Get the compressed Blob

            // Create a download link
            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            // Generate a timestamped filename
            const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
            a.download = `novels_backup_${timestamp}.novelarchive.gz`; // Specific extension

            // Trigger the download
            document.body.appendChild(a); // Required for Firefox
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("Export complete. File download initiated.");
            alert("Export complete! Your backup file should be downloading now.");

        } catch (error) {
            console.error("Export process failed:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            // Restore button state regardless of success or failure
            exportButton.textContent = originalButtonText;
            exportButton.disabled = false;
            exportButton.ariaLabel = originalButtonLabel;
        }
    }


    function triggerImport() {
        if (!window.DecompressionStream || !navigator.storage?.getDirectory) {
            alert("Import failed: Your browser does not support the required features (DecompressionStream or OPFS).");
            return;
        }
         if (!opfsRoot) {
             alert("Import failed: Storage system is not ready. Please try again later.");
             return;
         }

        // Warn user about data replacement
        if (novelsMetadata.length > 0 || localStorage.length > 2) { // Check if any data likely exists
            if (!confirm('Importing a backup will REPLACE all current novels, chapters, and settings.\n\nAre you sure you want to continue?')) {
                return; // User cancelled
            }
        }
        // Trigger the hidden file input
        importFileInput.click();
    }

     async function importData(file) {
        if (!file) return; // No file selected

        // Validate file type (basic check)
        if (!file.name.endsWith('.novelarchive.gz')) {
            alert("Invalid file type. Please select a '.novelarchive.gz' backup file.");
            importFileInput.value = null; // Reset file input
            return;
        }

         if (!opfsRoot) { // Double-check storage readiness
             alert("Import failed: Storage system is not ready.");
             importFileInput.value = null;
             return;
         }

        // Update button state to indicate processing
        const originalButtonText = importButton.textContent;
        const originalButtonLabel = importButton.ariaLabel;
        importButton.textContent = '📥'; // Using emoji for visual feedback
        importButton.disabled = true;
        importButton.ariaLabel = 'Importing backup...';
        importFileInput.disabled = true; // Prevent selecting another file during import

        console.log(`Starting import from file: ${file.name}`);
        let previousState = null; // To store old data for potential rollback

        try {
             // --- Backup current state (optional but recommended) ---
             console.log("Backing up current state before import...");
             previousState = {
                 metadata: JSON.parse(localStorage.getItem(METADATA_KEY) || '[]'),
                 theme: localStorage.getItem(THEME_KEY),
                 font: localStorage.getItem(FONT_KEY),
                 fontSize: localStorage.getItem(FONT_SIZE_KEY),
                 // Note: Backing up OPFS is complex, usually skipped. Rollback focuses on metadata/settings.
             };


            // --- Decompress and Parse ---
            console.log("Decompressing and parsing backup file...");
            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const jsonString = await new Response(decompressedStream).text(); // Read stream as text
            const importObject = JSON.parse(jsonString); // Parse JSON text

            // --- Validate Import Data Structure ---
            if (!importObject || typeof importObject !== 'object' ||
                !Array.isArray(importObject.metadata) || typeof importObject.chapters !== 'object') {
                throw new Error("Invalid backup file format. Required metadata or chapters structure is missing.");
            }
            // Log version being imported
            console.log(`Backup file version: ${importObject.version || 'Unknown'}`);
            if (importObject.version !== 1) {
                console.warn(`Importing data from an potentially incompatible version (${importObject.version}). Proceeding with caution.`);
                // Future: Add migration logic based on version here
            }

            // --- Clear Existing Data ---
            console.log("Clearing existing application data...");
            // Clear localStorage
            localStorage.removeItem(METADATA_KEY);
            // Keep settings for now, restore later if import fails
            novelsMetadata = []; // Clear in-memory array

            // Clear OPFS (similar to deleteAllData, but adapted for import context)
             if (opfsRoot) {
                let opfsClearFailed = false;
                try {
                    const entriesToRemove = [];
                     if (opfsRoot.values) { // Standard API
                         for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entriesToRemove.push(entry.name); }
                     } else if (opfsRoot.createReader) { // Fallback API
                         await new Promise((resolve, reject) => {
                             const dirReader = opfsRoot.createReader();
                             dirReader.readEntries((entries) => { entries.forEach(e => { if (e.isDirectory) entriesToRemove.push(e.name); }); resolve(); }, reject);
                         });
                     }
                     console.log(`Found old OPFS dirs to remove: ${entriesToRemove.join(', ')}`);
                    await Promise.all(entriesToRemove.map(name => {
                        if (opfsRoot.removeEntry) { // Standard API
                             return opfsRoot.removeEntry(name, { recursive: true }).catch(err => { console.warn(`Old OPFS clear error ${name}:`, err); opfsClearFailed = true; });
                         } else if (opfsRoot.getDirectory) { // Fallback API
                            return new Promise((resolve) => {
                                opfsRoot.getDirectory(name, {}, (dirEntry) => dirEntry.removeRecursively(resolve, () => { console.warn(`Fallback Old OPFS clear error ${name}`); opfsClearFailed = true; resolve(); }), () => resolve()); // Resolve even if not found
                             });
                         }
                         return Promise.resolve(); // Skip if no known removal method
                     }));
                    if (opfsClearFailed) console.warn("Could not fully clear old OPFS data."); else console.log("Cleared old OPFS directories.");
                 } catch (clearError) { console.error("OPFS clearing error during import:", clearError); alert("Warning: Could not fully clear old data before import."); }
            }

            // --- Restore Data from Import Object ---
            console.log("Restoring novels and chapters from backup...");
            let importedNovelsCount = 0;
            let chapterSaveErrors = 0;

             // Sanitize and map imported metadata
             novelsMetadata = importObject.metadata.map(novel => ({
                id: novel.id || crypto.randomUUID(), // Ensure ID
                title: novel.title || 'Untitled Novel',
                author: novel.author || '',
                genre: novel.genre || '',
                description: novel.description || '',
                // Create chapter metadata stubs - opfsFileName will be filled by saveChapterContent
                chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({
                    title: ch.title || 'Untitled Chapter',
                    opfsFileName: '' // Initialize as empty, will be set on successful save
                 })) : [],
                lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1,
            }));

            // Save chapter content to OPFS
            for (const novel of novelsMetadata) {
                const novelChapterData = importObject.chapters[novel.id];
                if (novelChapterData && typeof novelChapterData === 'object') {
                     for (let i = 0; i < novel.chapters.length; i++) {
                        const content = novelChapterData[i];
                        const chapterMeta = novel.chapters[i]; // The metadata stub created above

                        if (typeof content === 'string' && !content.startsWith('###EXPORT_READ_ERROR###')) {
                            // Valid content found, attempt to save
                            try {
                                // saveChapterContent saves file and updates chapterMeta.opfsFileName
                                await saveChapterContent(novel.id, i, content);
                            } catch (saveError) {
                                console.error(`Import Save Error - Novel ${novel.id}, Chapter ${i}:`, saveError);
                                chapterSaveErrors++;
                                // Keep opfsFileName empty in metadata if save failed
                                chapterMeta.opfsFileName = '';
                            }
                        } else if (content?.startsWith('###EXPORT_READ_ERROR###')) {
                            // Chapter had read error during export, skip saving content
                            console.warn(`Skipping content import for Novel ${novel.id}, Chapter ${i} due to previous export error.`);
                            chapterMeta.opfsFileName = ''; // Ensure no filename is associated
                        } else {
                            // Missing or invalid content for this chapter index
                             console.warn(`Missing or invalid content for Novel ${novel.id}, Chapter ${i}. Saving as empty.`);
                             try {
                                 await saveChapterContent(novel.id, i, ''); // Save empty content
                             } catch (saveEmptyError) {
                                 console.error(`Import Save Empty Error - Novel ${novel.id}, Chapter ${i}:`, saveEmptyError);
                                 chapterSaveErrors++;
                                 chapterMeta.opfsFileName = '';
                             }
                        }
                    }
                } else {
                     console.warn(`No chapter content data found in backup for Novel ${novel.id}. Chapters will be empty.`);
                     // Ensure all chapter metadata for this novel has empty filename
                     novel.chapters.forEach(ch => ch.opfsFileName = '');
                }
                importedNovelsCount++;
            }

            // --- Finalize Import ---
            saveNovelsMetadata(); // Save the restored and processed metadata
            loadSettings(); // Reload settings (in case they were cleared or need refresh)
            renderNovelList(); // Update UI
            showPage('home-page'); // Navigate home

            // --- Report Success/Partial Success ---
            let successMessage = `Import successful! ${importedNovelsCount} novel(s) loaded.`;
            if (chapterSaveErrors > 0) {
                successMessage += `\n\nWarning: ${chapterSaveErrors} chapter(s) could not be saved correctly due to errors. Their content might be missing or empty.`;
            }
            alert(successMessage);
            console.log("Import process finished.");

        } catch (error) {
            // --- Handle Import Failure ---
            console.error("Import process failed:", error);
            alert(`Import failed: ${error.message}\n\nAttempting to restore previous state...`);

            // --- Attempt Rollback ---
            if (previousState) {
                console.log("Rolling back to previous state...");
                try {
                     // Restore localStorage
                    localStorage.setItem(METADATA_KEY, JSON.stringify(previousState.metadata));
                    if (previousState.theme) localStorage.setItem(THEME_KEY, previousState.theme); else localStorage.removeItem(THEME_KEY);
                    if (previousState.font) localStorage.setItem(FONT_KEY, previousState.font); else localStorage.removeItem(FONT_KEY);
                    if (previousState.fontSize) localStorage.setItem(FONT_SIZE_KEY, previousState.fontSize); else localStorage.removeItem(FONT_SIZE_KEY);

                    // Reload state from restored localStorage
                    loadNovelsMetadata();
                    loadSettings();
                    renderNovelList();
                    showPage('home-page');
                     alert("Previous state restored.");
                     console.log("Rollback successful.");
                 } catch (rollbackError) {
                    console.error("Rollback failed:", rollbackError);
                    alert("Critical error: Could not restore previous state after import failure. Data may be lost. Please try refreshing the application.");
                }
            } else {
                alert("Critical error: Could not restore previous state as it wasn't backed up.");
                // Attempt basic reset
                 loadNovelsMetadata(); loadSettings(); renderNovelList(); showPage('home-page');
            }

        } finally {
            // --- Reset UI Elements ---
            importButton.textContent = originalButtonText;
            importButton.disabled = false;
            importButton.ariaLabel = originalButtonLabel;
            importFileInput.disabled = false;
            importFileInput.value = null; // Clear the file input selection
        }
    }


    // --- Chapter Downloads ---
    function sanitizeFilename(name) {
        // Replace reserved characters and multiple spaces, trim result
        return name.replace(/[<>:"/\\|?*]+/g, '_').replace(/\s+/g, ' ').trim() || 'Untitled';
    }

    async function downloadChapter(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);

        if (!chapter || !novel) {
            console.error("Download failed: Novel or Chapter metadata missing.", { novelId, chapterIndex });
            alert("Error: Could not find chapter data to download.");
            throw new Error("Chapter or novel data missing for download."); // Throw error for bulk download handling
        }

        // Determine the filename in storage
        const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        // Create a user-friendly download filename
        const downloadName = `${sanitizeFilename(novel.title)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapter.title)}.txt`;

        if (!opfsRoot) {
            alert("Download failed: Storage system is not available.");
            throw new Error("OPFS not available for download.");
        }

        try {
            console.log(`Attempting to download: ${downloadName} (from ${opfsFileName})`);
             const novelDirHandle = await getNovelDir(novelId, false); // Don't create directory

             let file;
             // Standard OPFS API
             if (novelDirHandle.getFileHandle) {
                 const fileHandle = await novelDirHandle.getFileHandle(opfsFileName);
                 file = await fileHandle.getFile();
             }
             // Fallback (webkitFileSystem)
             else if (novelDirHandle.getFile) {
                 file = await new Promise((resolve, reject) => {
                    novelDirHandle.getFile(opfsFileName, {}, (fileEntry) => {
                        fileEntry.file(resolve, reject);
                    }, reject);
                 });
             } else {
                  throw new Error("Unsupported Directory handle for file operations.");
              }

            // Create blob URL and trigger download
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up blob URL
            console.log(`Download initiated successfully: ${downloadName}`);

        } catch (error) {
             // Handle file not found specifically
            if (error.name === 'NotFoundError' || (error.code && error.code === FileError.NOT_FOUND_ERR)) {
                alert(`Download failed for "${chapter.title}": The chapter file (${opfsFileName}) was not found in storage.`);
                console.warn(`Download failed: File ${opfsFileName} not found for chapter ${chapterIndex}, novel ${novelId}.`);
             } else {
                 // Handle other errors
                console.error(`Download error for chapter ${chapterIndex} (Novel ${novelId}, File ${opfsFileName}):`, error);
                alert(`Download failed for "${chapter.title}": An error occurred (${error.message})`);
             }
            throw error; // Re-throw the error for bulk download handling
        }
    }

     async function downloadAllChapters(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) {
            alert("This novel has no chapters to download.");
            return;
        }

        const totalChapters = novel.chapters.length;
        if (!confirm(`This will start ${totalChapters} separate file downloads, one for each chapter.\n\nDo you want to proceed?`)) {
            return; // User cancelled
        }

        // Update button state
        const originalText = bulkDownloadBtn.textContent;
        bulkDownloadBtn.textContent = 'Starting...';
        bulkDownloadBtn.disabled = true;
        bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        bulkDownloadBtn.setAttribute('aria-live', 'polite'); // Announce progress

        let successCount = 0;
        let errorCount = 0;

        console.log(`Starting bulk download of ${totalChapters} chapters for: ${novel.title}`);

        // Download chapters sequentially with a delay
        for (let i = 0; i < totalChapters; i++) {
            const chapter = novel.chapters[i];
            const chapterTitle = chapter.title || `Chapter ${i + 1}`;
            bulkDownloadBtn.textContent = `Downloading ${i + 1}/${totalChapters}... (${chapterTitle})`;
            try {
                await downloadChapter(novelId, i);
                successCount++;
             } catch (e) {
                 // Error already alerted in downloadChapter, just count it here
                errorCount++;
                console.warn(`Bulk download: Failed chapter ${i} - ${chapterTitle}`);
            }
            // Add a small delay between downloads to prevent browser freezing/blocking
            // Adjust delay as needed (e.g., 300ms)
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        // --- Final Report ---
        console.log(`Bulk download finished. Success: ${successCount}, Failed: ${errorCount}`);
         let finalMessage = `Bulk download finished for "${novel.title}".\n\nSuccessfully downloaded: ${successCount} chapter(s)`;
         if (errorCount > 0) {
             finalMessage += `\nFailed to download: ${errorCount} chapter(s)`;
         }
         alert(finalMessage);

        // --- Reset Button State ---
        bulkDownloadBtn.textContent = originalText;
        bulkDownloadBtn.disabled = false;
        bulkDownloadBtn.setAttribute('aria-disabled', 'false');
        bulkDownloadBtn.removeAttribute('aria-live');
    }


    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Navigation Buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page'));
        });
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));

        // Theme Toggle
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark'); // Toggle and save
        });

        // Home Page Actions
        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (event) => {
            if (event.target.files?.length) {
                importData(event.target.files[0]);
            }
             // Reset file input value allows importing the same file again if needed after failure/cancel
            event.target.value = null;
        });
        exportButton.addEventListener('click', exportAllData);

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
                 const titleToDelete = novel.title || 'Untitled'; // Store before potentially deleting novel object
                 try {
                    await deleteNovelData(currentNovelId);
                    currentNovelId = null; // Clear current context
                    renderNovelList(); // Update home list
                    showPage('home-page'); // Go back home
                    alert(`Novel "${titleToDelete}" has been deleted.`);
                } catch (error) {
                     console.error("Error during novel deletion flow:", error);
                     alert(`An error occurred while trying to delete "${titleToDelete}".`);
                }
            }
        });
        document.getElementById('add-chapter-btn').addEventListener('click', () => {
            if (currentNovelId) openChapterModal(currentNovelId);
        });
        bulkDownloadBtn.addEventListener('click', () => {
             if (currentNovelId) downloadAllChapters(currentNovelId);
        });

        // Novel Modal Actions & Closing
        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (event) => {
            // Close if clicking on the modal backdrop (the semi-transparent overlay)
            if (event.target === novelModal) closeNovelModal();
        });
        // Allow Enter key submission from inputs (optional, can be annoying)
        // novelModalTitleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveNovelFromModal(); } });


        // Chapter Modal Actions & Closing
        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (event) => {
            if (event.target === chapterModal) closeChapterModal();
        });
        // Allow Enter in title to move focus to content (improves flow)
        chapterModalTitleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission/newline
                chapterModalContentInput.focus();
            }
        });

        // Reader Settings Modal Actions & Closing
        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (event) => {
            if (event.target === readerSettingsModal) closeReaderSettingsModal();
        });
        // Apply reader style changes immediately on select change
        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value));

        // Reader Page Navigation
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

        // Global Key Listener (e.g., for Escape key to close modals)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close modals in reverse order of likelihood/stacking
                if (readerSettingsModal.style.display === 'block') {
                    closeReaderSettingsModal();
                } else if (chapterModal.style.display === 'block') {
                    closeChapterModal();
                } else if (novelModal.style.display === 'block') {
                    closeNovelModal();
                }
            }
             // Add keyboard navigation for reader page? (Left/Right arrows)
             // Example: Check if reader page is active first
             // if (document.getElementById('reader-page').classList.contains('active')) {
             //     if (e.key === 'ArrowLeft' && !prevChapterBtn.disabled) {
             //         prevChapterBtn.click();
             //     } else if (e.key === 'ArrowRight' && !nextChapterBtn.disabled) {
             //         nextChapterBtn.click();
             //     }
             // }
        });
    }

    // --- Start App ---
    initializeApp();

}); // End DOMContentLoaded