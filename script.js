document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    let currentNovelId = null;
    let currentChapterIndex = -1;
    let novelsMetadata = [];
    let opfsRoot = null;

    // --- DOM References ---
    const pages = document.querySelectorAll('.page');
    const novelList = document.getElementById('novel-list');
    // storageInfoDiv reference removed
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
        if (!opfsReady) { /* Warning already shown */ }
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
            if (navigator.storage && navigator.storage.getDirectory) { opfsRoot = await navigator.storage.getDirectory(); return true; }
            console.warn('OPFS API not supported.'); return false;
        } catch (error) { console.error('OPFS Initialization Error:', error); return false; }
    }

    // --- Navigation ---
    function showPage(pageId) {
        let activePage = null;
        pages.forEach(page => { const isActive = page.id === pageId; page.classList.toggle('active', isActive); if(isActive) activePage = page; });
        if(activePage) { const contentArea = activePage.querySelector('.page-content'); if (contentArea) contentArea.scrollTop = 0; else activePage.scrollTop = 0; }
        else { window.scrollTo(0, 0); }
        // Removed call to updateStorageInfo
        if (pageId === 'novel-info-page' && currentNovelId) loadNovelInfoPage(currentNovelId);
        if (pageId === 'reader-page' && currentNovelId !== null && currentChapterIndex !== -1) { loadReaderPage(currentNovelId, currentChapterIndex); }
    }

    // --- Settings (Theme, Font, Size) ---
    function loadSettings() {
        const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME; const font = localStorage.getItem(FONT_KEY) || DEFAULT_FONT; const fontSize = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        applyTheme(theme, false); applyReaderStyles(font, fontSize, false);
        fontSelect.value = font; fontSizeSelect.value = fontSize; themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
    }
    function saveSetting(key, value) { localStorage.setItem(key, value); }
    function applyTheme(theme, save = true) {
        document.body.classList.toggle('dark-mode', theme === 'dark'); themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
        const lightMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]'); const darkMatcher = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        const lightColor = "#f8f9fa"; const darkColor = "#1e1e1e";
        if (theme === 'dark') { if (lightMatcher) lightMatcher.content = darkColor; if (darkMatcher) darkMatcher.content = darkColor; }
        else { if (lightMatcher) lightMatcher.content = lightColor; if (darkMatcher) darkMatcher.content = lightColor; }
        if (save) saveSetting(THEME_KEY, theme);
    }
    function applyReaderStyles(font, size, save = true) {
        const rootStyle = document.documentElement.style; rootStyle.setProperty('--font-family-reader', font); rootStyle.setProperty('--font-size-reader', size);
        const sizePx = parseInt(size, 10); rootStyle.setProperty('--line-height-reader', sizePx > 20 ? '1.8' : '1.7');
        if (save) { saveSetting(FONT_KEY, font); saveSetting(FONT_SIZE_KEY, size); }
    }

    // --- Metadata Handling (localStorage) ---
    function loadNovelsMetadata() {
        const storedMetadata = localStorage.getItem(METADATA_KEY); novelsMetadata = [];
        if (storedMetadata) {
            try {
                const parsed = JSON.parse(storedMetadata);
                if (Array.isArray(parsed)) {
                    novelsMetadata = parsed.map(novel => ({ id: novel.id || crypto.randomUUID(), title: novel.title || 'Untitled', author: novel.author || '', genre: novel.genre || '', description: novel.description || '', chapters: Array.isArray(novel.chapters) ? novel.chapters.map(ch => ({ title: ch.title || 'Untitled Chapter', opfsFileName: ch.opfsFileName || '' })) : [], lastReadChapterIndex: (typeof novel.lastReadChapterIndex === 'number' && novel.lastReadChapterIndex >= -1) ? novel.lastReadChapterIndex : -1, }));
                }
            } catch (e) { console.error("Failed parsing novels metadata:", e); localStorage.removeItem(METADATA_KEY); }
        } novelsMetadata.sort((a, b) => a.title.localeCompare(b.title));
    }
    function saveNovelsMetadata() { try { novelsMetadata.sort((a, b) => a.title.localeCompare(b.title)); localStorage.setItem(METADATA_KEY, JSON.stringify(novelsMetadata)); } catch (error) { console.error("Failed saving novels metadata:", error); alert("Error saving novel list."); } }
    function findNovel(novelId) { return novelsMetadata.find(n => n.id === novelId); }
    function findChapter(novelId, chapterIndex) { const novel = findNovel(novelId); return novel?.chapters?.[chapterIndex]; }

    // --- OPFS File Operations ---
    async function getNovelDir(novelId, create = false) { if (!opfsRoot) throw new Error("OPFS not initialized"); try { return await opfsRoot.getDirectoryHandle(novelId, { create }); } catch (error) { console.error(`Error getting dir handle ${novelId}:`, error); throw error; } }
    async function saveChapterContent(novelId, chapterIndex, content) { if (!opfsRoot) throw new Error("OPFS not ready"); const novel = findNovel(novelId); const chapter = novel?.chapters?.[chapterIndex]; if (!chapter) throw new Error("Chapter metadata missing"); const fileName = `ch_${String(chapterIndex).padStart(5, '0')}.txt`; chapter.opfsFileName = fileName; try { const novelDirHandle = await getNovelDir(novelId, true); const fileHandle = await novelDirHandle.getFileHandle(fileName, { create: true }); const writable = await fileHandle.createWritable(); await writable.write(content); await writable.close(); return true; } catch (error) { console.error(`Error saving chapter ${chapterIndex}:`, error); chapter.opfsFileName = ''; throw new Error(`Failed to save chapter: ${error.message}`); } }
    async function readChapterContent(novelId, chapterIndex) { if (!opfsRoot) return "Error: Storage unavailable."; const chapter = findChapter(novelId, chapterIndex); if (!chapter) return "Error: Chapter metadata missing."; const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`; if (!fileName) return "Error: Chapter file info missing."; try { const novelDirHandle = await getNovelDir(novelId, false); const fileHandle = await novelDirHandle.getFileHandle(fileName); const file = await fileHandle.getFile(); return await file.text(); } catch (error) { if (error.name === 'NotFoundError') { console.warn(`File ${fileName} not found.`); return `Error: File (${fileName}) not found.`; } console.error(`Error reading chapter ${chapterIndex}:`, error); return `Error reading file: ${error.message}`; } }
    async function deleteChapterFile(novelId, chapterIndex) { if (!opfsRoot) return false; const chapter = findChapter(novelId, chapterIndex); const fileName = chapter?.opfsFileName; if (!fileName) { console.warn(`Skipping delete ${chapterIndex}: No filename.`); return true; } try { const novelDirHandle = await getNovelDir(novelId, false); await novelDirHandle.removeEntry(fileName); return true; } catch (error) { if (error.name === 'NotFoundError') { console.warn(`Attempted delete ${fileName} (not found).`); return true; } console.error(`Error deleting file ${fileName}:`, error); return false; } }
    async function deleteNovelData(novelId) { const novel = findNovel(novelId); if (!novel) return; if (opfsRoot) { try { await opfsRoot.removeEntry(novelId, { recursive: true }); } catch (error) { if (error.name !== 'NotFoundError') { console.error(`Error deleting OPFS dir ${novelId}:`, error); } } } const novelIndex = novelsMetadata.findIndex(n => n.id === novelId); if (novelIndex > -1) { novelsMetadata.splice(novelIndex, 1); saveNovelsMetadata(); } }
    async function deleteAllData() { if (!confirm('⚠️ WARNING! ⚠️\n\nDelete ALL novels, chapters, and settings?\nThis CANNOT be undone.\n\nProceed?')) return; localStorage.removeItem(METADATA_KEY); localStorage.removeItem(THEME_KEY); localStorage.removeItem(FONT_KEY); localStorage.removeItem(FONT_SIZE_KEY); novelsMetadata = []; if (opfsRoot) { try { const entries = []; for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entries.push(entry.name); } await Promise.all(entries.map(name => opfsRoot.removeEntry(name, { recursive: true }).catch(err => console.error(`Failed OPFS delete ${name}:`, err)) )); console.log("OPFS cleared."); } catch (error) { console.error('Error clearing OPFS:', error); alert('Could not clear all stored files.'); } } applyTheme(DEFAULT_THEME); applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE); fontSelect.value = DEFAULT_FONT; fontSizeSelect.value = DEFAULT_FONT_SIZE; renderNovelList(); showPage('home-page'); alert('All app data deleted.'); }

    // --- UI Rendering ---
    function renderNovelList() { novelList.innerHTML = ''; if (novelsMetadata.length === 0) { novelList.innerHTML = '<li class="placeholder">No novels added. Use ➕ to add novels!</li>'; exportButton.disabled = true; return; } exportButton.disabled = false; novelsMetadata.forEach(novel => { const li = document.createElement('li'); li.dataset.novelId = novel.id; li.setAttribute('role', 'button'); li.tabIndex = 0; li.innerHTML = `<div class="item-content"><span class="title"></span><span class="subtitle"></span></div><span aria-hidden="true" style="margin-left: auto; color: var(--text-muted);">›</span>`; li.querySelector('.title').textContent = novel.title || 'Untitled Novel'; li.querySelector('.subtitle').textContent = novel.author || 'Unknown Author'; const navigate = () => { currentNovelId = novel.id; showPage('novel-info-page'); }; li.addEventListener('click', navigate); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') navigate(); }); novelList.appendChild(li); }); }
    function loadNovelInfoPage(novelId) { const novel = findNovel(novelId); if (!novel) { console.error(`Novel ${novelId} not found.`); showPage('home-page'); return; } document.getElementById('novel-info-title').textContent = novel.title || 'Untitled'; document.getElementById('novel-info-author').textContent = novel.author || 'N/A'; document.getElementById('novel-info-genre').textContent = novel.genre || 'N/A'; document.getElementById('novel-info-description').textContent = novel.description || 'No description.'; const lastReadSpan = document.getElementById('novel-info-last-read'); const lastReadChapter = findChapter(novelId, novel.lastReadChapterIndex); if (lastReadChapter) { lastReadSpan.textContent = lastReadChapter.title || `Chapter ${novel.lastReadChapterIndex + 1}`; lastReadSpan.classList.add('clickable'); lastReadSpan.onclick = () => { currentChapterIndex = novel.lastReadChapterIndex; showPage('reader-page'); }; lastReadSpan.setAttribute('role', 'link'); lastReadSpan.tabIndex = 0; } else { lastReadSpan.textContent = 'Never'; lastReadSpan.classList.remove('clickable'); lastReadSpan.onclick = null; lastReadSpan.removeAttribute('role'); lastReadSpan.tabIndex = -1; } renderChapterList(novelId); }
    function renderChapterList(novelId) { const chapterListEl = document.getElementById('chapter-list'); const novel = findNovel(novelId); chapterListEl.innerHTML = ''; const chapters = novel?.chapters || []; document.getElementById('bulk-download-chapters-btn').disabled = chapters.length === 0; if (chapters.length === 0) { chapterListEl.innerHTML = '<li class="placeholder">No chapters added.</li>'; return; } chapters.forEach((chapter, index) => { const li = document.createElement('li'); li.dataset.chapterIndex = index; li.innerHTML = `<div class="item-content chapter-title-container" role="button" tabIndex="0"><span class="title"></span></div><div class="item-actions chapter-controls"><button class="edit-chapter-btn icon-btn" aria-label="Edit Chapter">✏️</button><button class="download-chapter-btn icon-btn" aria-label="Download Chapter">💾</button><button class="delete-chapter-btn icon-btn danger" aria-label="Delete Chapter">🗑️</button></div>`; li.querySelector('.title').textContent = chapter.title || `Chapter ${index + 1}`; const titleContainer = li.querySelector('.chapter-title-container'); const navigateToReader = () => { currentChapterIndex = index; showPage('reader-page'); }; titleContainer.addEventListener('click', navigateToReader); titleContainer.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') navigateToReader(); }); li.querySelector('.edit-chapter-btn').addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, index); }); li.querySelector('.download-chapter-btn').addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, index); }); li.querySelector('.delete-chapter-btn').addEventListener('click', async (e) => { e.stopPropagation(); const chapterTitle = chapter.title || `Chapter ${index + 1}`; if (confirm(`Delete chapter: "${chapterTitle}"?`)) { const deleteSuccess = await deleteChapterFile(novelId, index); if (deleteSuccess) { novel.chapters.splice(index, 1); if (novel.lastReadChapterIndex === index) novel.lastReadChapterIndex = -1; else if (novel.lastReadChapterIndex > index) novel.lastReadChapterIndex--; saveNovelsMetadata(); renderChapterList(novelId); loadNovelInfoPage(novelId); } else { alert(`Failed to delete file for chapter "${chapterTitle}".`); } } }); chapterListEl.appendChild(li); }); }
    async function loadReaderPage(novelId, chapterIndex) { const chapter = findChapter(novelId, chapterIndex); const novel = findNovel(novelId); if (!chapter || !novel) { console.error(`Data not found for reader.`); readerContent.textContent = "Error: Could not load chapter."; readerChapterTitle.textContent = "Error"; prevChapterBtn.disabled = true; nextChapterBtn.disabled = true; return; } readerChapterTitle.textContent = chapter.title || `Chapter ${chapterIndex + 1}`; readerContent.textContent = 'Loading...'; novel.lastReadChapterIndex = chapterIndex; saveNovelsMetadata(); if (document.getElementById('novel-info-page').classList.contains('active')) { loadNovelInfoPage(novelId); } const content = await readChapterContent(novelId, chapterIndex); readerContent.textContent = content; prevChapterBtn.disabled = (chapterIndex <= 0); nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1); readerContentContainer.scrollTo(0, 0); }

    // --- Modal Handling ---
    function closeModal(modalElement) { if (!modalElement) return; modalElement.classList.add('closing'); setTimeout(() => { modalElement.style.display = 'none'; modalElement.classList.remove('closing'); }, MODAL_CLOSE_DELAY); }
    function openNovelModal(novelIdToEdit = null) { const isEditing = !!novelIdToEdit; const novel = isEditing ? findNovel(novelIdToEdit) : null; if (isEditing && !novel) { alert("Error: Novel not found."); return; } document.getElementById('novel-modal-title-heading').textContent = isEditing ? "Edit Novel" : "Add New Novel"; document.getElementById('novel-modal-id').value = novelIdToEdit || ''; document.getElementById('novel-modal-title-input').value = novel?.title || ''; document.getElementById('novel-modal-author-input').value = novel?.author || ''; document.getElementById('novel-modal-genre-input').value = novel?.genre || ''; document.getElementById('novel-modal-description-input').value = novel?.description || ''; novelModal.style.display = 'block'; document.getElementById('novel-modal-title-input').focus(); }
    function closeNovelModal() { closeModal(novelModal); }
    async function openChapterModal(novelId, chapterIndex = null) { const novel = findNovel(novelId); if (!novel) { alert("Error: Novel not found."); return; } const isEditing = chapterIndex !== null; const chapter = isEditing ? novel.chapters[chapterIndex] : null; if (isEditing && !chapter) { alert("Error: Chapter not found."); return; } document.getElementById('chapter-modal-title-heading').textContent = isEditing ? "Edit Chapter" : "Add New Chapter"; document.getElementById('chapter-modal-novel-id').value = novelId; document.getElementById('chapter-modal-index').value = chapterIndex !== null ? chapterIndex : ''; const titleInput = document.getElementById('chapter-modal-title-input'); const contentInput = document.getElementById('chapter-modal-content-input'); titleInput.value = chapter?.title || ''; if (isEditing) { contentInput.value = 'Loading...'; contentInput.disabled = true; chapterModal.style.display = 'block'; try { const rawContent = await readChapterContent(novelId, chapterIndex); contentInput.value = rawContent.startsWith("Error:") ? `Load error.\n${rawContent}` : rawContent; contentInput.disabled = rawContent.startsWith("Error:"); } catch(e) { contentInput.value = `Error: ${e.message}`; contentInput.disabled = true; } } else { contentInput.value = ''; contentInput.disabled = false; chapterModal.style.display = 'block'; } titleInput.focus(); }
    function closeChapterModal() { closeModal(chapterModal); }
    function openReaderSettingsModal() { fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT; fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE; readerSettingsModal.style.display = 'block'; }
    function closeReaderSettingsModal() { closeModal(readerSettingsModal); }
    function saveNovelFromModal() { const id = document.getElementById('novel-modal-id').value; const title = document.getElementById('novel-modal-title-input').value.trim(); if (!title) { alert("Title required."); document.getElementById('novel-modal-title-input').focus(); return; } const author = document.getElementById('novel-modal-author-input').value.trim(); const genre = document.getElementById('novel-modal-genre-input').value.trim(); const description = document.getElementById('novel-modal-description-input').value; let novelToUpdate; if (id) { novelToUpdate = findNovel(id); if (!novelToUpdate) { alert("Error updating."); closeNovelModal(); return; } Object.assign(novelToUpdate, { title, author, genre, description }); } else { novelToUpdate = { id: crypto.randomUUID(), title, author, genre, description, chapters: [], lastReadChapterIndex: -1 }; novelsMetadata.push(novelToUpdate); currentNovelId = novelToUpdate.id; } saveNovelsMetadata(); closeNovelModal(); if (id) { if (document.getElementById('novel-info-page').classList.contains('active')) { loadNovelInfoPage(id); } renderNovelList(); } else { renderNovelList(); showPage('novel-info-page'); } }
    async function saveChapterFromModal() { const novelId = document.getElementById('chapter-modal-novel-id').value; const indexStr = document.getElementById('chapter-modal-index').value; const title = document.getElementById('chapter-modal-title-input').value.trim(); const content = document.getElementById('chapter-modal-content-input').value; const novel = findNovel(novelId); if (!title) { alert("Title required."); document.getElementById('chapter-modal-title-input').focus(); return; } if (!content && !confirm("Content empty. Save anyway?")) { document.getElementById('chapter-modal-content-input').focus(); return; } if (!novel) { alert("Error: Novel missing."); closeChapterModal(); return; } const isNewChapter = indexStr === ''; const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10); if (!isNewChapter && (isNaN(chapterIndex) || !novel.chapters[chapterIndex])) { alert("Error: Invalid index."); closeChapterModal(); return; } let chapterData; if (isNewChapter) { chapterData = { title: title, opfsFileName: '' }; novel.chapters.push(chapterData); } else { chapterData = novel.chapters[chapterIndex]; chapterData.title = title; } try { await saveChapterContent(novelId, chapterIndex, content); saveNovelsMetadata(); closeChapterModal(); renderChapterList(novelId); } catch (error) { alert(`Save failed: ${error.message}`); if (isNewChapter) novel.chapters.pop(); } }

    // --- Import / Export ---
    async function exportAllData() { if (!novelsMetadata?.length) { alert("No novels to export."); return; } if (!window.CompressionStream || !opfsRoot) { alert("Export requires browser support."); return; } exportButton.textContent = '📤'; exportButton.disabled = true; exportButton.ariaLabel = 'Exporting...'; try { const exportObject = { version: 1, metadata: [], chapters: {} }; let chapterReadErrors = 0; for (const novel of novelsMetadata) { exportObject.metadata.push(JSON.parse(JSON.stringify(novel))); exportObject.chapters[novel.id] = {}; if (novel.chapters?.length) { for (let i = 0; i < novel.chapters.length; i++) { try { const content = await readChapterContent(novel.id, i); if (content.startsWith("Error:")) throw new Error(content); exportObject.chapters[novel.id][i] = content; } catch (readError) { console.error(`Export Read Error Ch ${i} (Novel ${novel.id}):`, readError); exportObject.chapters[novel.id][i] = `###EXPORT_READ_ERROR### ${readError.message}`; chapterReadErrors++; } } } } if (chapterReadErrors > 0) alert(`Warning: ${chapterReadErrors} chapter(s) could not be read.`); const jsonString = JSON.stringify(exportObject); const dataBlob = new Blob([jsonString], { type: 'application/json' }); const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip')); const compressedBlob = await new Response(compressedStream).blob(); const url = URL.createObjectURL(compressedBlob); const a = document.createElement('a'); a.href = url; const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14); a.download = `novels_backup_${timestamp}.novelarchive.gz`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); alert("Export complete!"); } catch (error) { console.error("Export failed:", error); alert(`Export failed: ${error.message}`); } finally { exportButton.textContent = '📤'; exportButton.disabled = false; exportButton.ariaLabel = 'Export All Novels'; } }
    function triggerImport() { if (!window.DecompressionStream || !opfsRoot) { alert("Import requires browser support."); return; } if (novelsMetadata.length > 0 || localStorage.length > 2) { if (!confirm('Importing replaces current novels/chapters.\nContinue?')) return; } importFileInput.click(); }
    async function importData(file) { if (!file) return; if (!file.name.endsWith('.novelarchive.gz')) { alert("Invalid file type."); importFileInput.value = null; return; } if (!opfsRoot) { alert("Storage not ready."); importFileInput.value = null; return; } importButton.textContent = '📥'; importButton.disabled = true; importButton.ariaLabel = 'Importing...'; importFileInput.disabled = true; try { const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip')); const jsonString = await new Response(decompressedStream).text(); const importObject = JSON.parse(jsonString); if (!importObject || typeof importObject !== 'object' || !Array.isArray(importObject.metadata) || typeof importObject.chapters !== 'object') throw new Error("Invalid file format."); if (importObject.version !== 1) console.warn(`Importing v${importObject.version}.`); localStorage.removeItem(METADATA_KEY); novelsMetadata = []; if (opfsRoot) { const entries = []; for await (const entry of opfsRoot.values()) { if (entry.kind === 'directory') entries.push(entry.name); } await Promise.all(entries.map(name => opfsRoot.removeEntry(name, { recursive: true }).catch(err => console.warn(`Old OPFS clear error ${name}:`, err)) )); } let importedNovelsCount = 0; let chapterSaveErrors = 0; novelsMetadata = importObject.metadata; for (const novel of novelsMetadata) { novel.id = novel.id || crypto.randomUUID(); novel.title = novel.title || 'Untitled'; novel.chapters = Array.isArray(novel.chapters) ? novel.chapters : []; novel.lastReadChapterIndex = (typeof novel.lastReadChapterIndex === 'number') ? novel.lastReadChapterIndex : -1; const novelChapterData = importObject.chapters[novel.id]; if (novelChapterData && typeof novelChapterData === 'object') { for (let i = 0; i < novel.chapters.length; i++) { const content = novelChapterData[i]; const chapterMeta = novel.chapters[i]; chapterMeta.title = chapterMeta.title || `Chapter ${i+1}`; chapterMeta.opfsFileName = ''; if (typeof content === 'string' && !content.startsWith('###EXPORT_READ_ERROR###')) { try { await saveChapterContent(novel.id, i, content); } catch (saveError) { console.error(`Import Save Error Ch ${i} (Novel ${novel.id}):`, saveError); chapterSaveErrors++; chapterMeta.opfsFileName = ''; } } else if (content?.startsWith('###EXPORT_READ_ERROR###')) { console.warn(`Skipping Ch ${i} (Novel ${novel.id}) due to export error.`); chapterSaveErrors++; } else { console.warn(`Missing/invalid content Ch ${i} (Novel ${novel.id}). Saving empty.`); try { await saveChapterContent(novel.id, i, ''); } catch(saveError) { console.error(`Import Save Empty Ch ${i} (Novel ${novel.id}):`, saveError); chapterSaveErrors++; chapterMeta.opfsFileName = ''; } } } } else { console.warn(`No chapter data for Novel ${novel.id}.`); novel.chapters.forEach(ch => ch.opfsFileName = ''); } importedNovelsCount++; } saveNovelsMetadata(); loadSettings(); renderNovelList(); showPage('home-page'); let successMessage = `Import successful! ${importedNovelsCount} novel(s) loaded.`; if (chapterSaveErrors > 0) successMessage += `\nWarning: ${chapterSaveErrors} chapter(s) failed import.`; alert(successMessage); } catch (error) { console.error("Import failed:", error); alert(`Import failed: ${error.message}\nRestoring state...`); loadNovelsMetadata(); loadSettings(); renderNovelList(); showPage('home-page'); } finally { importButton.textContent = '📥'; importButton.disabled = false; importButton.ariaLabel = 'Import Novels'; importFileInput.disabled = false; importFileInput.value = null; } }

    // --- Chapter Downloads ---
    function sanitizeFilename(name) { return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim() || 'Untitled'; }
    async function downloadChapter(novelId, chapterIndex) { const chapter = findChapter(novelId, chapterIndex); const novel = findNovel(novelId); if (!chapter || !novel) { console.error("Data missing for download:", novelId, chapterIndex); alert("Data missing."); return; } const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`; const downloadName = `${sanitizeFilename(novel.title)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapter.title)}.txt`; try { const novelDirHandle = await getNovelDir(novelId, false); const fileHandle = await novelDirHandle.getFileHandle(opfsFileName); const file = await fileHandle.getFile(); const url = URL.createObjectURL(file); const a = document.createElement('a'); a.href = url; a.download = downloadName; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); } catch (error) { if (error.name === 'NotFoundError') { alert(`Download failed: File not found.`); } else { console.error(`Download error ch ${chapterIndex}:`, error); alert(`Download failed: ${error.message}`); } } }
    async function downloadAllChapters(novelId) { const novel = findNovel(novelId); if (!novel?.chapters?.length) { alert("No chapters."); return; } if (!confirm(`Start ${novel.chapters.length} separate downloads?`)) return; const downloadButton = document.getElementById('bulk-download-chapters-btn'); const originalText = downloadButton.textContent; downloadButton.textContent = 'Starting...'; downloadButton.disabled = true; let successCount = 0; let errorCount = 0; try { for (let i = 0; i < novel.chapters.length; i++) { await new Promise(resolve => setTimeout(resolve, 250)); downloadButton.textContent = `Downloading ${i + 1}/${novel.chapters.length}...`; try { await downloadChapter(novelId, i); successCount++; } catch (e) { errorCount++; console.error(`Bulk download error ch ${i}:`, e); } } alert(`Downloads initiated.\n${successCount} successful, ${errorCount} failed.`); } catch (error) { alert("Unexpected error during bulk download."); console.error("Bulk download error:", error); } finally { downloadButton.textContent = originalText; downloadButton.disabled = false; } }

    // --- Storage Info Function Removed ---

    // --- Event Listeners ---
    function setupEventListeners() {
        // Global/Nav
        document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page')));
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));
        themeToggleBtn.addEventListener('click', () => { const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light'; applyTheme(currentTheme === 'dark' ? 'light' : 'dark'); });
        // Home Actions (now in header)
        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (event) => importData(event.target.files[0]));
        exportButton.addEventListener('click', exportAllData);
        // Settings
        deleteAllDataBtn.addEventListener('click', deleteAllData);
        // Novel Info
         document.getElementById('edit-novel-btn').addEventListener('click', () => { if (currentNovelId) openNovelModal(currentNovelId); });
         document.getElementById('delete-novel-btn').addEventListener('click', async () => { if (!currentNovelId) return; const novel = findNovel(currentNovelId); if (novel && confirm(`Delete "${novel.title || 'Untitled'}" and chapters?`)) { await deleteNovelData(currentNovelId); currentNovelId = null; renderNovelList(); showPage('home-page'); } });
         document.getElementById('add-chapter-btn').addEventListener('click', () => { if (currentNovelId) openChapterModal(currentNovelId); });
         document.getElementById('bulk-download-chapters-btn').addEventListener('click', () => { if (currentNovelId) downloadAllChapters(currentNovelId); });
        // Novel Modal
        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (event) => { if (event.target === novelModal) closeNovelModal(); });
        document.getElementById('novel-modal-title-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveNovelFromModal(); } });
        // Chapter Modal
        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (event) => { if (event.target === chapterModal) closeChapterModal(); });
        document.getElementById('chapter-modal-title-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('chapter-modal-content-input').focus(); } });
        // Reader Settings Modal
        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (event) => { if (event.target === readerSettingsModal) closeReaderSettingsModal(); });
        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value));
        // Reader Nav
        prevChapterBtn.addEventListener('click', () => { if (currentNovelId !== null && currentChapterIndex > 0) { currentChapterIndex--; loadReaderPage(currentNovelId, currentChapterIndex); } });
        nextChapterBtn.addEventListener('click', () => { const novel = findNovel(currentNovelId); if (novel && currentChapterIndex < novel.chapters.length - 1) { currentChapterIndex++; loadReaderPage(currentNovelId, currentChapterIndex); } });
        // Global Escape Key
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (novelModal.style.display === 'block') closeNovelModal(); if (chapterModal.style.display === 'block') closeChapterModal(); if (readerSettingsModal.style.display === 'block') closeReaderSettingsModal(); } });
    }

    // --- Start App ---
    initializeApp();
});