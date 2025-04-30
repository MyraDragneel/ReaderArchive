document.addEventListener('DOMContentLoaded', () => {

    const translations = {
        en: {
            langName: "English", // Language name for the selector
            app_title: "Local Novel Reader",
            home_header: "My Novels",
            aria_add_novel: "Add New Novel",
            aria_import_archive: "Import Novels Archive",
            aria_export_all: "Export All Novels",
            aria_toggle_theme: "Toggle Light/Dark Theme",
            aria_open_settings: "Open Settings",
            placeholder_search_novels: "Search novels by title or author...",
            aria_search_novels: "Search Novels",
            placeholder_loading_novels: "Loading novels...",
            placeholder_no_novels: "No novels yet. Use ➕ to add one!",
            placeholder_no_matching_novels: "No novels found matching \"{searchTerm}\".",
            text_unknown_author: "Unknown Author",
            aria_open_novel: "Open novel: {title}",
            aria_back_home: "Back to Home",
            settings_header: "Settings",
            settings_language_header: "Language",
            settings_language_label: "Select Language", // Label for the select
            aria_select_language: "Select Language", // Aria-label for the select
            danger_zone_header: "Danger Zone",
            danger_zone_desc: "This permanently removes all novels, chapters, and settings stored by this app in your browser.",
            btn_delete_all_data: "🗑️ Delete All App Data",
            details_novel_details: "Novel Details",
            details_author: "Author:",
            details_genre: "Genre:",
            details_description: "Description:",
            details_last_read: "Last Read:",
            details_never_read: "Never",
            details_na: "N/A",
            details_no_description: "No description provided.",
            aria_continue_reading: "Continue reading: {chapterTitle}",
            details_chapters: "Chapters",
            btn_add_chapter: "➕ Add Chapter",
            btn_download_all_chapters: "💾 Download All (.txt)",
            placeholder_search_chapters: "Search chapters by title...",
            aria_search_chapters: "Search Chapters",
            placeholder_no_chapters: "No chapters added yet.",
            placeholder_no_matching_chapters: "No chapters found matching \"{searchTerm}\".",
            text_modified: "Modified: {timestamp}",
            text_invalid_date: "Invalid Date",
            text_error_formatting_timestamp: "Error",
            aria_read_chapter: "Read {chapterTitle}",
            aria_edit_chapter: "Edit {chapterTitle}",
            aria_download_chapter: "Download {chapterTitle}",
            aria_delete_chapter: "Delete {chapterTitle}",
            confirm_delete_chapter: "Are you sure you want to delete chapter: \"{chapterTitle}\"?\nThis action removes its content permanently and cannot be undone.",
            alert_failed_delete_chapter_file: "Failed to delete the file for chapter \"{chapterTitle}\". Metadata was not removed.",
            alert_error_deleting_chapter: "An error occurred while trying to delete the chapter \"{chapterTitle}\".",
            text_loading: "Loading...",
            aria_back_novel_info: "Back to Novel Info",
            aria_enter_fullscreen: "Enter Full Screen",
            aria_exit_fullscreen: "Exit Full Screen",
            aria_reader_settings: "Reader Display Settings",
            text_loading_chapter_content: "Loading chapter content...",
            text_error_loading_chapter: "Error: Could not load chapter data. Novel or chapter metadata missing.",
            text_error_reading_file: "Error reading file: {errorMessage}",
            text_error_file_not_found: "Error: Chapter file ({fileName}) not found in storage.",
            text_error_chapter_metadata_not_found: "Error: Chapter metadata not found.",
            text_error_file_storage_unavailable: "Error: File storage unavailable.",
            text_error_chapter_file_info_missing: "Error: Chapter file information missing.",
            btn_previous: "⬅️ Previous",
            btn_next: "Next ➡️",
            modal_add_novel_title: "Add New Novel",
            modal_edit_novel_title: "Edit Novel Details",
            form_title: "Title",
            form_author: "Author",
            form_genre: "Genre",
            form_description: "Description",
            btn_cancel: "Cancel",
            btn_save: "Save",
            alert_novel_title_required: "Novel Title is required.",
            alert_error_saving_novel_update: "Error: Could not find the novel to update. Please try again.",
            modal_add_chapter_title: "Add New Chapter",
            modal_edit_chapter_title: "Edit Chapter",
            form_chapter_title: "Chapter Title",
            form_content: "Content",
            btn_save_chapter: "Save Chapter",
            alert_error_finding_associated_novel: "Error: Could not find the associated novel.",
            alert_error_finding_chapter_to_edit: "Error: The chapter you are trying to edit could not be found.",
            alert_chapter_title_required: "Chapter Title is required.",
            alert_error_chapter_save_novel_missing: "Error: Could not find the novel this chapter belongs to.",
            alert_error_chapter_save_invalid_index: "Error: Invalid chapter index provided for editing.",
            alert_chapter_save_failed: "Chapter save failed: {errorMessage}\n\nPlease check storage permissions or try again.",
            text_loading_chapter_modal_content: "Loading chapter content...",
            text_error_loading_chapter_modal_content: "Could not load existing content.\n{errorDetails}\n\nYou can still edit the title or enter new content below and save.",
            text_critical_error_loading_chapter_modal_content: "Critical error loading content: {errorMessage}",
            modal_reader_display_title: "Reader Display",
            form_font_family: "Font Family",
            aria_select_font_family: "Select Font Family",
            form_font_size: "Font Size",
            aria_select_font_size: "Select Font Size",
            form_line_spacing: "Line Spacing",
            btn_close: "Close",
            alert_opfs_unavailable: "Warning: Origin Private File System (OPFS) is not available or could not be initialized. Saving/loading chapter content may not work on this browser/platform.",
            alert_error_saving_setting: "Error saving setting: {key}. Storage might be full.",
            alert_corrupt_metadata: "Could not load novel list due to corrupted data. The list has been reset.",
            alert_error_saving_metadata_quota: "Error saving novel list/progress. Storage might be full.",
            alert_error_saving_metadata: "Error saving novel list/progress.",
            alert_error_finding_novel_info: "Error: Could not find selected novel.",
            alert_error_deleting_opfs_dir: "Warning: Could not delete all files for novel \"{title}\". Some data may remain.",
            alert_confirm_delete_all_title: "⚠️ WARNING! ⚠️",
            alert_confirm_delete_all_body: "This will permanently delete ALL novels, chapters, reading progress, and display settings stored by this app in your browser.\n\nThis action CANNOT BE UNDONE.\n\nAre you absolutely sure you want to proceed?",
            alert_error_clearing_settings: "An error occurred while clearing settings data.",
            alert_error_clearing_opfs: "An error occurred while clearing stored novel files.",
            alert_warning_incomplete_opfs_clear: "Warning: Could not automatically clear all stored novel files. Some data might remain.",
            alert_delete_all_success: "All application data has been deleted.",
            alert_no_novels_to_export: "There are no novels to export.",
            alert_export_failed_apis: "Export failed: Storage system not ready or CompressionStream API not supported by your browser.",
            alert_export_chapter_read_warning: "Warning: {count} chapter(s) could not be read and will be marked as errors in the backup file.",
            alert_export_complete: "Export complete! Your backup file should be downloading now.",
            alert_export_failed: "Export failed: {errorMessage}",
            aria_exporting_novels: "Exporting novels...",
            alert_import_failed_apis: "Import failed: Storage system not ready or DecompressionStream API not supported by your browser.",
            alert_confirm_import_overwrite: "Importing a backup will REPLACE all current novels, chapters, reading progress, and settings.\n\nAre you sure you want to continue?",
            alert_invalid_import_file: "Invalid file type. Please select a '.novelarchive.gz' backup file.",
            alert_import_failed_storage_not_ready: "Import failed: Storage system is not ready.",
            aria_importing_backup: "Importing backup...",
            alert_invalid_backup_format: "Invalid backup file format. Required 'metadata' array or 'chapters' object is missing.",
            warning_importing_incompatible_version: "Importing data from a potentially incompatible version ({version}).",
            warning_import_opfs_clear_incomplete: "Warning: Could not fully clear old data before import.",
            warning_import_skipped_export_error: "Skipping content import for Novel {novelId}, Chapter {chapterIndex} due to previous export error.",
            warning_import_missing_content: "Missing or invalid content for Novel {novelId}, Chapter {chapterIndex}. Saving as empty.",
            alert_import_success: "Import successful! {count} novel(s) loaded.",
            alert_import_warning_chapter_errors: "Warning: {count} chapter(s) could not be saved correctly due to errors. Their content might be missing or empty.",
            alert_import_failed: "Import failed: {errorMessage}\n\nAttempting to restore previous state...",
            alert_rollback_failed: "Critical error: Could not restore previous state after import failure. Data may be inconsistent or lost. Please try refreshing the application or clearing data manually if issues persist.",
            alert_rollback_incomplete: "Previous state restored. Note: Chapter content might be missing if OPFS data was cleared during the failed import attempt.",
            alert_rollback_failed_no_backup: "Critical error: Could not restore previous state as it wasn't backed up. Application state might be inconsistent.",
            alert_download_failed_missing_metadata: "Error: Could not find chapter data to download.",
            alert_download_failed_storage_unavailable: "Download failed: Storage system is not available.",
            alert_download_failed_file_not_found: "Download failed for \"{title}\": The chapter file ({fileName}) was not found in storage.",
            alert_download_failed_general: "Download failed for \"{title}\": An error occurred ({errorMessage})",
            alert_no_chapters_to_download: "This novel has no chapters to download.",
            bulk_download_preparing: "Preparing...",
            bulk_download_reading: "Reading {current}/{total}...",
            bulk_download_saving: "Saving...",
            bulk_download_finished: "Combined download finished for \"{title}\".\n\nSuccessfully included: {successCount} chapter(s)",
            bulk_download_finished_with_errors: "Combined download finished for \"{title}\".\n\nSuccessfully included: {successCount} chapter(s)\nFailed to include content for: {errorCount} chapter(s). Check the downloaded file for error messages.",
            bulk_download_save_failed: "Failed to create the combined download file: {errorMessage}",
            alert_fullscreen_error: "Error attempting to enable full-screen mode: {errorMessage} ({errorName})",
            aria_edit_novel_meta: "Edit Novel Metadata",
            aria_delete_this_novel: "Delete This Novel",
            alert_confirm_delete_novel_title: "⚠️ Delete Novel ⚠️",
            alert_confirm_delete_novel_body: "Are you sure you want to permanently delete the novel \"{title}\" and all its chapters?\n\nThis action cannot be undone.",
            alert_delete_novel_success: "Novel \"{title}\" has been deleted.",
            alert_error_deleting_novel: "An error occurred while deleting the novel \"{title}\". Some data might remain.",
            theme_switch_light: "Switch to Light Theme",
            theme_switch_dark: "Switch to Dark Theme",
            text_chapter_placeholder: "Chapter {index}",
            text_untitled_novel: "Untitled Novel",
            text_error_prefix: "Error:" // Base error prefix for checks
        },
        id: {
            langName: "Bahasa Indonesia", // Language name for the selector
            app_title: "Pembaca Novel Lokal",
            home_header: "Novel Saya",
            aria_add_novel: "Tambah Novel Baru",
            aria_import_archive: "Impor Arsip Novel",
            aria_export_all: "Ekspor Semua Novel",
            aria_toggle_theme: "Ubah Tema Terang/Gelap",
            aria_open_settings: "Buka Pengaturan",
            placeholder_search_novels: "Cari novel berdasarkan judul atau penulis...",
            aria_search_novels: "Cari Novel",
            placeholder_loading_novels: "Memuat novel...",
            placeholder_no_novels: "Belum ada novel. Gunakan ➕ untuk menambah!",
            placeholder_no_matching_novels: "Tidak ada novel yang cocok dengan \"{searchTerm}\".",
            text_unknown_author: "Penulis Tidak Dikenal",
            aria_open_novel: "Buka novel: {title}",
            aria_back_home: "Kembali ke Beranda",
            settings_header: "Pengaturan",
            settings_language_header: "Bahasa",
            settings_language_label: "Pilih Bahasa", // Label for the select
            aria_select_language: "Pilih Bahasa", // Aria-label for the select
            danger_zone_header: "Zona Berbahaya",
            danger_zone_desc: "Ini akan menghapus secara permanen semua novel, bab, dan pengaturan yang disimpan oleh aplikasi ini di browser Anda.",
            btn_delete_all_data: "🗑️ Hapus Semua Data Aplikasi",
            details_novel_details: "Detail Novel",
            details_author: "Penulis:",
            details_genre: "Genre:",
            details_description: "Deskripsi:",
            details_last_read: "Terakhir Dibaca:",
            details_never_read: "Belum pernah",
            details_na: "T/A",
            details_no_description: "Tidak ada deskripsi.",
            aria_continue_reading: "Lanjutkan membaca: {chapterTitle}",
            details_chapters: "Bab",
            btn_add_chapter: "➕ Tambah Bab",
            btn_download_all_chapters: "💾 Unduh Semua (.txt)",
            placeholder_search_chapters: "Cari bab berdasarkan judul...",
            aria_search_chapters: "Cari Bab",
            placeholder_no_chapters: "Belum ada bab ditambahkan.",
            placeholder_no_matching_chapters: "Tidak ada bab yang cocok dengan \"{searchTerm}\".",
            text_modified: "Diubah: {timestamp}",
            text_invalid_date: "Tanggal Tidak Valid",
            text_error_formatting_timestamp: "Kesalahan",
            aria_read_chapter: "Baca {chapterTitle}",
            aria_edit_chapter: "Edit {chapterTitle}",
            aria_download_chapter: "Unduh {chapterTitle}",
            aria_delete_chapter: "Hapus {chapterTitle}",
            confirm_delete_chapter: "Apakah Anda yakin ingin menghapus bab: \"{chapterTitle}\"?\nTindakan ini menghapus kontennya secara permanen dan tidak dapat dibatalkan.",
            alert_failed_delete_chapter_file: "Gagal menghapus berkas untuk bab \"{chapterTitle}\". Metadata tidak dihapus.",
            alert_error_deleting_chapter: "Terjadi kesalahan saat mencoba menghapus bab \"{chapterTitle}\".",
            text_loading: "Memuat...",
            aria_back_novel_info: "Kembali ke Info Novel",
            aria_enter_fullscreen: "Masuk Layar Penuh",
            aria_exit_fullscreen: "Keluar Layar Penuh",
            aria_reader_settings: "Pengaturan Tampilan Pembaca",
            text_loading_chapter_content: "Memuat konten bab...",
            text_error_loading_chapter: "Kesalahan: Tidak dapat memuat data bab. Metadata novel atau bab hilang.",
            text_error_reading_file: "Kesalahan membaca berkas: {errorMessage}",
            text_error_file_not_found: "Kesalahan: Berkas bab ({fileName}) tidak ditemukan di penyimpanan.",
            text_error_chapter_metadata_not_found: "Kesalahan: Metadata bab tidak ditemukan.",
            text_error_file_storage_unavailable: "Kesalahan: Penyimpanan berkas tidak tersedia.",
            text_error_chapter_file_info_missing: "Kesalahan: Informasi berkas bab hilang.",
            btn_previous: "⬅️ Sebelumnya",
            btn_next: "Berikutnya ➡️",
            modal_add_novel_title: "Tambah Novel Baru",
            modal_edit_novel_title: "Edit Detail Novel",
            form_title: "Judul",
            form_author: "Penulis",
            form_genre: "Genre",
            form_description: "Deskripsi",
            btn_cancel: "Batal",
            btn_save: "Simpan",
            alert_novel_title_required: "Judul Novel wajib diisi.",
            alert_error_saving_novel_update: "Kesalahan: Tidak dapat menemukan novel untuk diperbarui. Silakan coba lagi.",
            modal_add_chapter_title: "Tambah Bab Baru",
            modal_edit_chapter_title: "Edit Bab",
            form_chapter_title: "Judul Bab",
            form_content: "Konten",
            btn_save_chapter: "Simpan Bab",
            alert_error_finding_associated_novel: "Kesalahan: Tidak dapat menemukan novel terkait.",
            alert_error_finding_chapter_to_edit: "Kesalahan: Bab yang ingin Anda edit tidak dapat ditemukan.",
            alert_chapter_title_required: "Judul Bab wajib diisi.",
            alert_error_chapter_save_novel_missing: "Kesalahan: Tidak dapat menemukan novel pemilik bab ini.",
            alert_error_chapter_save_invalid_index: "Kesalahan: Indeks bab tidak valid untuk diedit.",
            alert_chapter_save_failed: "Penyimpanan bab gagal: {errorMessage}\n\nSilakan periksa izin penyimpanan atau coba lagi.",
            text_loading_chapter_modal_content: "Memuat konten bab...",
            text_error_loading_chapter_modal_content: "Tidak dapat memuat konten yang ada.\n{errorDetails}\n\nAnda masih dapat mengedit judul atau memasukkan konten baru di bawah dan menyimpan.",
            text_critical_error_loading_chapter_modal_content: "Kesalahan kritis saat memuat konten: {errorMessage}",
            modal_reader_display_title: "Tampilan Pembaca",
            form_font_family: "Jenis Huruf",
            aria_select_font_family: "Pilih Jenis Huruf",
            form_font_size: "Ukuran Huruf",
            aria_select_font_size: "Pilih Ukuran Huruf",
            form_line_spacing: "Jarak Baris",
            btn_close: "Tutup",
            alert_opfs_unavailable: "Peringatan: Origin Private File System (OPFS) tidak tersedia atau tidak dapat diinisialisasi. Menyimpan/memuat konten bab mungkin tidak berfungsi pada browser/platform ini.",
            alert_error_saving_setting: "Kesalahan menyimpan pengaturan: {key}. Penyimpanan mungkin penuh.",
            alert_corrupt_metadata: "Tidak dapat memuat daftar novel karena data rusak. Daftar telah direset.",
            alert_error_saving_metadata_quota: "Kesalahan menyimpan daftar/progres novel. Penyimpanan mungkin penuh.",
            alert_error_saving_metadata: "Kesalahan menyimpan daftar/progres novel.",
            alert_error_finding_novel_info: "Kesalahan: Tidak dapat menemukan novel yang dipilih.",
            alert_error_deleting_opfs_dir: "Peringatan: Tidak dapat menghapus semua berkas untuk novel \"{title}\". Sebagian data mungkin tersisa.",
            alert_confirm_delete_all_title: "⚠️ PERINGATAN! ⚠️",
            alert_confirm_delete_all_body: "Ini akan menghapus secara permanen SEMUA novel, bab, progres baca, dan pengaturan yang disimpan oleh aplikasi ini di browser Anda.\n\nTindakan ini TIDAK DAPAT DIBATALKAN.\n\nApakah Anda benar-benar yakin ingin melanjutkan?",
            alert_error_clearing_settings: "Terjadi kesalahan saat menghapus data pengaturan.",
            alert_error_clearing_opfs: "Terjadi kesalahan saat menghapus berkas novel yang tersimpan.",
            alert_warning_incomplete_opfs_clear: "Peringatan: Tidak dapat menghapus semua berkas novel yang tersimpan secara otomatis. Sebagian data mungkin tersisa.",
            alert_delete_all_success: "Semua data aplikasi telah dihapus.",
            alert_no_novels_to_export: "Tidak ada novel untuk diekspor.",
            alert_export_failed_apis: "Ekspor gagal: Sistem penyimpanan belum siap atau API CompressionStream tidak didukung oleh browser Anda.",
            alert_export_chapter_read_warning: "Peringatan: {count} bab tidak dapat dibaca dan akan ditandai sebagai kesalahan dalam berkas cadangan.",
            alert_export_complete: "Ekspor selesai! Berkas cadangan Anda seharusnya sedang diunduh sekarang.",
            alert_export_failed: "Ekspor gagal: {errorMessage}",
            aria_exporting_novels: "Mengekspor novel...",
            alert_import_failed_apis: "Impor gagal: Sistem penyimpanan belum siap atau API DecompressionStream tidak didukung oleh browser Anda.",
            alert_confirm_import_overwrite: "Mengimpor cadangan akan MENGGANTI semua novel, bab, progres baca, dan pengaturan saat ini.\n\nApakah Anda yakin ingin melanjutkan?",
            alert_invalid_import_file: "Jenis berkas tidak valid. Silakan pilih berkas cadangan '.novelarchive.gz'.",
            alert_import_failed_storage_not_ready: "Impor gagal: Sistem penyimpanan belum siap.",
            aria_importing_backup: "Mengimpor cadangan...",
            alert_invalid_backup_format: "Format berkas cadangan tidak valid. Array 'metadata' atau objek 'chapters' yang diperlukan hilang.",
            warning_importing_incompatible_version: "Mengimpor data dari versi yang mungkin tidak kompatibel ({version}).",
            warning_import_opfs_clear_incomplete: "Peringatan: Tidak dapat sepenuhnya menghapus data OPFS lama selama impor.",
            warning_import_skipped_export_error: "Melewati impor konten untuk Novel {novelId}, Bab {chapterIndex} karena kesalahan ekspor sebelumnya.",
            warning_import_missing_content: "Konten hilang atau tidak valid untuk Novel {novelId}, Bab {chapterIndex}. Menyimpan sebagai kosong.",
            alert_import_success: "Impor berhasil! {count} novel dimuat.",
            alert_import_warning_chapter_errors: "Peringatan: {count} bab tidak dapat disimpan dengan benar karena kesalahan. Kontennya mungkin hilang atau kosong.",
            alert_import_failed: "Impor gagal: {errorMessage}\n\nMencoba memulihkan keadaan sebelumnya...",
            alert_rollback_failed: "Kesalahan kritis: Tidak dapat memulihkan keadaan sebelumnya setelah impor gagal. Data mungkin tidak konsisten atau hilang. Silakan coba segarkan aplikasi atau hapus data secara manual jika masalah berlanjut.",
            alert_rollback_incomplete: "Keadaan sebelumnya dipulihkan. Catatan: Konten bab mungkin hilang jika data OPFS dihapus selama upaya impor yang gagal.",
            alert_rollback_failed_no_backup: "Kesalahan kritis: Tidak dapat memulihkan keadaan sebelumnya karena tidak dicadangkan. Keadaan aplikasi mungkin tidak konsisten.",
            alert_download_failed_missing_metadata: "Kesalahan: Tidak dapat menemukan data bab untuk diunduh.",
            alert_download_failed_storage_unavailable: "Unduh gagal: Sistem penyimpanan tidak tersedia.",
            alert_download_failed_file_not_found: "Unduh gagal untuk \"{title}\": Berkas bab ({fileName}) tidak ditemukan di penyimpanan.",
            alert_download_failed_general: "Unduh gagal untuk \"{title}\": Terjadi kesalahan ({errorMessage})",
            alert_no_chapters_to_download: "Novel ini tidak memiliki bab untuk diunduh.",
            bulk_download_preparing: "Mempersiapkan...",
            bulk_download_reading: "Membaca {current}/{total}...",
            bulk_download_saving: "Menyimpan...",
            bulk_download_finished: "Unduhan gabungan selesai untuk \"{title}\".\n\nBerhasil menyertakan: {successCount} bab",
            bulk_download_finished_with_errors: "Unduhan gabungan selesai untuk \"{title}\".\n\nBerhasil menyertakan: {successCount} bab\nGagal menyertakan konten untuk: {errorCount} bab. Periksa pesan kesalahan di berkas yang diunduh.",
            bulk_download_save_failed: "Gagal membuat berkas unduhan gabungan: {errorMessage}",
            alert_fullscreen_error: "Kesalahan saat mencoba mengaktifkan mode layar penuh: {errorMessage} ({errorName})",
            aria_edit_novel_meta: "Edit Metadata Novel",
            aria_delete_this_novel: "Hapus Novel Ini",
            alert_confirm_delete_novel_title: "⚠️ Hapus Novel ⚠️",
            alert_confirm_delete_novel_body: "Apakah Anda yakin ingin menghapus novel \"{title}\" dan semua babnya secara permanen?\n\nTindakan ini tidak dapat dibatalkan.",
            alert_delete_novel_success: "Novel \"{title}\" telah dihapus.",
            alert_error_deleting_novel: "Terjadi kesalahan saat menghapus novel \"{title}\". Sebagian data mungkin tersisa.",
            theme_switch_light: "Ganti ke Tema Terang",
            theme_switch_dark: "Ganti ke Tema Gelap",
            text_chapter_placeholder: "Bab {index}",
            text_untitled_novel: "Novel Tanpa Judul",
            text_error_prefix: "Kesalahan:" // Base error prefix for checks
        }
    };

    let currentLang = 'en';
    let currentTranslations = translations.en;
    let currentNovelId = null;
    let currentChapterIndex = -1;
    let novelsMetadata = [];
    let opfsRoot = null;

    // DOM Elements
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
    const languageSelect = document.getElementById('language-select'); // New language selector

    // Constants
    const METADATA_KEY = 'novelsMetadata';
    const THEME_KEY = 'novelReaderTheme';
    const FONT_KEY = 'novelReaderFont';
    const FONT_SIZE_KEY = 'novelReaderFontSize';
    const LINE_SPACING_KEY = 'novelReaderLineSpacing';
    const LANG_KEY = 'novelReaderLanguage';
    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT = 'Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_LINE_SPACING = '1.6';
    const DEFAULT_LANG = 'en';
    const MODAL_CLOSE_DELAY = 180; // ms

    // --- I18n Functions ---

    function t(key, replacements = {}) {
        let text = currentTranslations[key] || translations.en[key] || `Missing: ${key}`;
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (element.classList.contains('placeholder')) {
                element.innerHTML = t(key);
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                // Skip form elements for direct content
            } else {
                 const iconNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && ['➕', '💾', '🗑️', '⬅️', '➡️', '📖'].includes(node.textContent?.trim()));
                 const textSpan = element.querySelector('span[data-i18n-key]');

                 if (textSpan && textSpan.getAttribute('data-i18n-key') === key) {
                     textSpan.textContent = t(key);
                 } else if (iconNode) {
                     const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '' && node !== iconNode);
                     if (textNode) {
                         textNode.textContent = ` ${t(key)}`;
                     } else {
                         element.textContent = `${iconNode.textContent.trim()} ${t(key)}`;
                     }
                 } else if (!element.children.length) {
                     element.textContent = t(key);
                 } else {
                     const targetNode = Array.from(element.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '') || element.querySelector('span:not([class])');
                     if (targetNode) {
                         targetNode.textContent = t(key);
                     }
                 }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            element.placeholder = t(element.getAttribute('data-i18n-placeholder'));
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            element.setAttribute('aria-label', t(element.getAttribute('data-i18n-aria-label')));
        });

        updateThemeToggleButtonAriaLabel();
        updateFullscreenButtonAriaLabel();
        populateLanguageSelector(); // Update dropdown options and selection

        document.documentElement.lang = currentLang;
    }

    function setLanguage(lang) {
        if (translations[lang]) {
            currentLang = lang;
            currentTranslations = translations[lang];
            saveSetting(LANG_KEY, lang);
            applyTranslations(); // This will re-apply all text and update the selector

            // Re-render lists/pages if active
            if (document.getElementById('home-page').classList.contains('active')) {
                renderNovelList(novelSearchInput.value);
            }
            if (document.getElementById('novel-info-page').classList.contains('active') && currentNovelId) {
                 loadNovelInfoPage(currentNovelId);
            }

            console.log(`Language set to: ${lang}`);
        } else {
            console.warn(`Language '${lang}' not found.`);
        }
    }

    function populateLanguageSelector() {
        if (!languageSelect) return;
        const currentSelectedValue = languageSelect.value; // Store current selection if any
        languageSelect.innerHTML = ''; // Clear existing options

        for (const langCode in translations) {
            const option = document.createElement('option');
            option.value = langCode;
            // Use the langName defined within each translation object
            option.textContent = translations[langCode].langName || langCode; // Fallback to code
            languageSelect.appendChild(option);
        }

        // Set the selected option based on the current language
        languageSelect.value = currentLang;

        // If the value couldn't be set (e.g., currentLang was invalid), default to English
        if (!languageSelect.value && translations['en']) {
            languageSelect.value = 'en';
        }
    }

    // --- Core App Logic ---

    async function initializeApp() {
        registerServiceWorker();
        const opfsReady = await initOPFS();
        if (!opfsReady) {
             alert(t('alert_opfs_unavailable'));
        }
        loadSettings(); // Load language first, then other settings
        loadNovelsMetadata();
        renderNovelList();
        setupEventListeners();
        showPage('home-page');
        applyTranslations(); // Apply initial translations after settings and language are loaded
        populateLanguageSelector(); // Populate the language dropdown initially
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
            }
            console.warn('OPFS API (navigator.storage.getDirectory) not supported.');
            return false;
        } catch (error) {
            console.error('OPFS Initialization Error:', error);
            return false;
        }
    }

    function saveReaderPosition() {
        if (!readerPage.classList.contains('active') || !currentNovelId || currentChapterIndex < 0 || !readerMainContent) {
            return;
        }
        const novel = findNovel(currentNovelId);
        if (!novel) return;

        novel.lastReadChapterIndex = currentChapterIndex;
        novel.lastReadScrollTop = Math.round(readerMainContent.scrollTop);
        saveNovelsMetadata();
    }

    function showPage(pageId) {
        if (document.fullscreenElement && readerPage.classList.contains('active') && pageId !== 'reader-page') {
            if (document.exitFullscreen) document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
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

        if (pageId !== 'reader-page' || !readerMainContent) {
            const contentArea = activePage?.querySelector('.page-content');
            if (contentArea) contentArea.scrollTop = 0;
            else if (activePage) activePage.scrollTop = 0;
            else window.scrollTo(0, 0);
        }

        if (pageId !== 'home-page') novelSearchInput.value = '';
        if (pageId !== 'novel-info-page') chapterSearchInput.value = '';

        if (pageId === 'home-page') renderNovelList();
        if (pageId === 'novel-info-page' && currentNovelId) loadNovelInfoPage(currentNovelId);
        if (pageId === 'reader-page' && currentNovelId && currentChapterIndex !== -1) loadReaderPage(currentNovelId, currentChapterIndex);
    }

    function loadSettings() {
        const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
        // Set language state first, but applyTranslations will handle UI updates later
        currentLang = translations[savedLang] ? savedLang : DEFAULT_LANG;
        currentTranslations = translations[currentLang];

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
            alert(t('alert_error_saving_setting', { key }));
        }
    }

    function updateThemeToggleButtonAriaLabel() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggleBtn.setAttribute('aria-label', t(isDarkMode ? 'theme_switch_light' : 'theme_switch_dark'));
    }

    function applyTheme(theme, save = true) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
        updateThemeToggleButtonAriaLabel();

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
                        title: novel.title || t('text_untitled_novel'),
                        author: novel.author || '',
                        genre: novel.genre || '',
                        description: novel.description || '',
                        chapters: Array.isArray(novel.chapters) ? novel.chapters.map((ch, idx) => ({
                            title: ch.title || t('text_chapter_placeholder', { index: idx + 1 }),
                            opfsFileName: ch.opfsFileName || '',
                            lastModified: ch.lastModified || null
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
                localStorage.removeItem(METADATA_KEY);
                alert(t('alert_corrupt_metadata'));
            }
        }
        novelsMetadata.sort((a, b) => a.title.localeCompare(b.title, currentLang));
    }

    function saveNovelsMetadata() {
        try {
            novelsMetadata.sort((a, b) => a.title.localeCompare(b.title, currentLang));
            localStorage.setItem(METADATA_KEY, JSON.stringify(novelsMetadata));
        } catch (error) {
            console.error("Failed saving novels metadata:", error);
            alert(t(error.name === 'QuotaExceededError' ? 'alert_error_saving_metadata_quota' : 'alert_error_saving_metadata'));
        }
    }

    function findNovel(novelId) {
        return novelsMetadata.find(n => n.id === novelId);
    }

    function findChapter(novelId, chapterIndex) {
        const novel = findNovel(novelId);
        return (novel?.chapters && chapterIndex >= 0 && chapterIndex < novel.chapters.length) ? novel.chapters[chapterIndex] : null;
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
        chapter.opfsFileName = fileName; // Update metadata

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
        if (!opfsRoot) return t('text_error_file_storage_unavailable');
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter) return t('text_error_chapter_metadata_not_found');

        const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return t('text_error_chapter_file_info_missing');

        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            const fileHandle = await novelDirHandle.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            return await file.text();
        } catch (error) {
            const errorKey = error.name === 'NotFoundError' ? 'text_error_file_not_found' : 'text_error_reading_file';
            const errorMessage = t(errorKey, { fileName, errorMessage: error.message });
            console.warn(`Read Error: ${errorMessage}`, error);
            // Return the base English error prefix for reliable checks later
            return `Error: ${errorMessage}`;
        }
    }

    async function deleteChapterFile(novelId, chapterIndex) {
        if (!opfsRoot) {
            console.warn("OPFS not available, cannot delete chapter file.");
            return false;
        }
        const chapter = findChapter(novelId, chapterIndex);
        const fileName = chapter?.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return true; // Nothing to delete

        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(fileName);
            console.log(`Deleted file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}).`);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') return true; // Already gone
            console.error(`Error deleting file ${fileName} for chapter ${chapterIndex} (Novel ${novelId}):`, error);
            return false;
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) return;

        if (opfsRoot) {
            try {
                console.log(`Attempting to remove OPFS directory: ${novelId}`);
                await opfsRoot.removeEntry(novelId, { recursive: true });
                console.log(`Successfully removed OPFS directory: ${novelId}`);
            } catch (error) {
                if (error.name !== 'NotFoundError') {
                    console.error(`Error deleting OPFS directory ${novelId}:`, error);
                    alert(t('alert_error_deleting_opfs_dir', { title: novel.title }));
                }
            }
        }

        const novelIndex = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIndex > -1) {
            novelsMetadata.splice(novelIndex, 1);
            saveNovelsMetadata();
            console.log(`Removed metadata for novel: ${novelId}`);
        }
    }

    async function deleteAllData() {
        if (!confirm(`${t('alert_confirm_delete_all_title')}\n\n${t('alert_confirm_delete_all_body')}`)) return;

        try {
            localStorage.removeItem(METADATA_KEY);
            localStorage.removeItem(THEME_KEY);
            localStorage.removeItem(FONT_KEY);
            localStorage.removeItem(FONT_SIZE_KEY);
            localStorage.removeItem(LINE_SPACING_KEY);
            localStorage.removeItem(LANG_KEY);
            novelsMetadata = [];
            console.log("Cleared localStorage data.");
        } catch (e) {
            console.error("Error clearing localStorage:", e);
            alert(t('alert_error_clearing_settings'));
        }

        if (opfsRoot) {
            console.log("Attempting to clear OPFS directories...");
            let opfsClearFailed = false;
            const entriesToRemove = [];
            try {
                 if (opfsRoot.values) {
                    for await (const entry of opfsRoot.values()) {
                        if (entry.kind === 'directory') entriesToRemove.push(entry.name);
                    }
                 } else { opfsClearFailed = true; }

                await Promise.all(entriesToRemove.map(name =>
                    opfsRoot.removeEntry(name, { recursive: true })
                        .catch(err => { console.error(`Failed to remove OPFS dir ${name}:`, err); opfsClearFailed = true; })
                ));
                if (opfsClearFailed) alert(t('alert_warning_incomplete_opfs_clear'));
            } catch (error) {
                console.error('Error during OPFS clearing process:', error);
                alert(t('alert_error_clearing_opfs'));
            }
        }

        setLanguage(DEFAULT_LANG); // Reset language
        applyTheme(DEFAULT_THEME);
        applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING);
        fontSelect.value = DEFAULT_FONT;
        fontSizeSelect.value = DEFAULT_FONT_SIZE;
        lineHeightSlider.value = DEFAULT_LINE_SPACING;
        if (lineHeightValueSpan) lineHeightValueSpan.textContent = DEFAULT_LINE_SPACING;

        renderNovelList();
        showPage('home-page');
        alert(t('alert_delete_all_success'));
    }

    function renderNovelList(filterTerm = '') {
        novelList.innerHTML = '';
        const lowerFilterTerm = filterTerm.toLowerCase().trim();

        const filteredNovels = novelsMetadata.filter(novel =>
            !lowerFilterTerm ||
            novel.title?.toLocaleLowerCase(currentLang).includes(lowerFilterTerm) ||
            novel.author?.toLocaleLowerCase(currentLang).includes(lowerFilterTerm)
        );

        const noNovelsExist = novelsMetadata.length === 0;
        exportButton.disabled = noNovelsExist;
        exportButton.setAttribute('aria-disabled', String(noNovelsExist));

        if (filteredNovels.length === 0) {
            const placeholderKey = noNovelsExist ? 'placeholder_no_novels' : 'placeholder_no_matching_novels';
            novelList.innerHTML = `<li class="placeholder">${t(placeholderKey, { searchTerm: filterTerm })}</li>`;
            return;
        }

        filteredNovels.forEach(novel => {
            const li = document.createElement('li');
            li.dataset.novelId = novel.id;
            li.setAttribute('role', 'button');
            li.tabIndex = 0;
            const novelTitleText = novel.title || t('text_untitled_novel');
            li.setAttribute('aria-label', t('aria_open_novel', { title: novelTitleText }));

            li.innerHTML = `
                <div class="item-content">
                    <span class="title">${novelTitleText}</span>
                    <span class="subtitle">${novel.author || t('text_unknown_author')}</span>
                </div>
                <span aria-hidden="true" style="margin-left: auto; color: var(--text-muted); font-size: 1.2em;">›</span>
            `;

            const navigate = () => { currentNovelId = novel.id; showPage('novel-info-page'); };
            li.addEventListener('click', navigate);
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); } });
            novelList.appendChild(li);
        });
    }

    function loadNovelInfoPage(novelId) {
        const novel = findNovel(novelId);
        if (!novel) {
            alert(t('alert_error_finding_novel_info'));
            showPage('home-page');
            return;
        }

        novelInfoTitle.textContent = novel.title || t('text_untitled_novel');
        novelInfoAuthor.textContent = novel.author || t('details_na');
        novelInfoGenre.textContent = novel.genre || t('details_na');
        novelInfoDescription.textContent = novel.description || t('details_no_description');

        const lastReadChapterIndex = novel.lastReadChapterIndex;
        const lastReadChapter = findChapter(novelId, lastReadChapterIndex);

        // Clear previous listeners first
        novelInfoLastRead.onclick = null;
        novelInfoLastRead.onkeydown = null;

        if (lastReadChapter) {
            const chapterTitle = lastReadChapter.title || t('text_chapter_placeholder', { index: lastReadChapterIndex + 1 });
            novelInfoLastRead.textContent = chapterTitle;
            novelInfoLastRead.className = 'clickable';
            novelInfoLastRead.setAttribute('role', 'link');
            novelInfoLastRead.tabIndex = 0;
            novelInfoLastRead.setAttribute('aria-label', t('aria_continue_reading', { chapterTitle }));

            const continueReadingHandler = (e) => {
                 if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                     e.preventDefault();
                    currentChapterIndex = lastReadChapterIndex;
                    showPage('reader-page');
                }
            };
            novelInfoLastRead.addEventListener('click', continueReadingHandler);
            novelInfoLastRead.addEventListener('keydown', continueReadingHandler);
        } else {
            novelInfoLastRead.textContent = t('details_never_read');
            novelInfoLastRead.className = '';
            novelInfoLastRead.removeAttribute('role');
            novelInfoLastRead.tabIndex = -1;
            novelInfoLastRead.removeAttribute('aria-label');
        }
        renderChapterList(novelId, chapterSearchInput.value);
    }

    function formatTimestamp(isoString) {
        if (!isoString) return t('details_na');
        try {
            const date = new Date(isoString);
            return isNaN(date.getTime()) ? t('text_invalid_date') : date.toLocaleString(currentLang, { dateStyle: 'short', timeStyle: 'short' });
        } catch (e) {
            console.error("Error formatting timestamp:", isoString, e);
            return t('text_error_formatting_timestamp');
        }
    }

    function renderChapterList(novelId, filterTerm = '') {
        const novel = findNovel(novelId);
        chapterListEl.innerHTML = '';
        const chapters = novel?.chapters || [];
        const lowerFilterTerm = filterTerm.toLowerCase().trim();

        const filteredChapters = chapters
            .map((chapter, index) => ({ ...chapter, originalIndex: index }))
            .filter(chapter => !lowerFilterTerm || chapter.title?.toLocaleLowerCase(currentLang).includes(lowerFilterTerm));

        const hasAnyChapters = chapters.length > 0;
        bulkDownloadBtn.disabled = !hasAnyChapters;
        bulkDownloadBtn.setAttribute('aria-disabled', String(!hasAnyChapters));

        if (filteredChapters.length === 0) {
            const placeholderKey = hasAnyChapters ? 'placeholder_no_matching_chapters' : 'placeholder_no_chapters';
            chapterListEl.innerHTML = `<li class="placeholder">${t(placeholderKey, { searchTerm: filterTerm })}</li>`;
            return;
        }

        filteredChapters.forEach(({ title, lastModified, originalIndex: index }) => {
            const li = document.createElement('li');
            li.dataset.chapterIndex = index;
            const chapterTitleText = title || t('text_chapter_placeholder', { index: index + 1 });

            li.innerHTML = `
                <div class="item-content" role="button" tabindex="0" aria-label="${t('aria_read_chapter', { chapterTitle: chapterTitleText })}">
                    <span class="title">${chapterTitleText}</span>
                    <span class="chapter-timestamp">${t('text_modified', { timestamp: formatTimestamp(lastModified) })}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-chapter-btn icon-btn" aria-label="${t('aria_edit_chapter', { chapterTitle: chapterTitleText })}">✏️</button>
                    <button class="download-chapter-btn icon-btn" aria-label="${t('aria_download_chapter', { chapterTitle: chapterTitleText })}">💾</button>
                    <button class="delete-chapter-btn icon-btn danger" aria-label="${t('aria_delete_chapter', { chapterTitle: chapterTitleText })}">🗑️</button>
                </div>
            `;

            // Add event listeners
            const contentDiv = li.querySelector('.item-content');
            const editBtn = li.querySelector('.edit-chapter-btn');
            const downloadBtn = li.querySelector('.download-chapter-btn');
            const deleteBtn = li.querySelector('.delete-chapter-btn');

            const navigateToReader = () => { currentChapterIndex = index; showPage('reader-page'); };
            contentDiv.addEventListener('click', navigateToReader);
            contentDiv.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToReader(); } });

            editBtn.addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, index); });
            downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, index).catch(err => console.warn("Download failed:", err)); });
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(t('confirm_delete_chapter', { chapterTitle: chapterTitleText }))) {
                    try {
                        if (await deleteChapterFile(novelId, index)) {
                            novel.chapters.splice(index, 1);
                            if (novel.lastReadChapterIndex === index) { novel.lastReadChapterIndex = -1; novel.lastReadScrollTop = 0; }
                            else if (novel.lastReadChapterIndex > index) { novel.lastReadChapterIndex--; }
                            saveNovelsMetadata();
                            renderChapterList(novelId, filterTerm); // Re-render self
                            loadNovelInfoPage(novelId); // Update last read display on parent page
                        } else {
                            alert(t('alert_failed_delete_chapter_file', { chapterTitle: chapterTitleText }));
                        }
                    } catch(error) {
                         alert(t('alert_error_deleting_chapter', { chapterTitle: chapterTitleText }));
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
            readerChapterTitle.textContent = t('text_error_formatting_timestamp');
            readerContent.textContent = t('text_error_loading_chapter');
            prevChapterBtn.disabled = true; prevChapterBtn.setAttribute('aria-disabled', 'true');
            nextChapterBtn.disabled = true; nextChapterBtn.setAttribute('aria-disabled', 'true');
            return;
        }

        readerChapterTitle.textContent = chapter.title || t('text_chapter_placeholder', { index: chapterIndex + 1 });
        readerContent.textContent = t('text_loading_chapter_content');
        readerContent.style.color = '';
        readerMainContent.scrollTop = 0;

        const rawContent = await readChapterContent(novelId, chapterIndex);

        // Use base English prefix for reliable error check
        if (rawContent.startsWith("Error:")) {
            readerContent.textContent = rawContent; // Show specific error
            readerContent.style.color = 'var(--danger-color)';
        } else {
            readerContent.textContent = rawContent;
        }

        prevChapterBtn.disabled = (chapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', String(prevChapterBtn.disabled));
        nextChapterBtn.disabled = (chapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', String(nextChapterBtn.disabled));

        requestAnimationFrame(() => {
            if (readerPage.classList.contains('active') && currentNovelId === novelId && currentChapterIndex === chapterIndex) {
                readerMainContent.scrollTop = (novel.lastReadChapterIndex === chapterIndex) ? novel.lastReadScrollTop : 0;
            }
        });
    }

    function closeModal(modalElement) {
        if (!modalElement || modalElement.style.display === 'none') return;
        modalElement.classList.add('closing');
        const handler = () => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
            modalElement.removeEventListener('animationend', handler);
        };
        modalElement.addEventListener('animationend', handler);
        setTimeout(() => { if (modalElement.classList.contains('closing')) handler(); }, MODAL_CLOSE_DELAY + 50);
    }

    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;

        if (isEditing && !novel) { alert(t('alert_error_finding_novel_info')); return; }

        novelModalTitleHeading.textContent = isEditing ? t('modal_edit_novel_title') : t('modal_add_novel_title');
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
        if (!title) { alert(t('alert_novel_title_required')); novelModalTitleInput.focus(); return; }

        const author = novelModalAuthorInput.value.trim();
        const genre = novelModalGenreInput.value.trim();
        const description = novelModalDescriptionInput.value.trim();
        const isEditing = !!id;

        let novelToUpdate;
        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) { alert(t('alert_error_saving_novel_update')); closeNovelModal(); return; }
            Object.assign(novelToUpdate, { title, author, genre, description });
        } else {
            novelToUpdate = { id: crypto.randomUUID(), title, author, genre, description, chapters: [], lastReadChapterIndex: -1, lastReadScrollTop: 0 };
            novelsMetadata.push(novelToUpdate);
            currentNovelId = novelToUpdate.id;
        }

        saveNovelsMetadata();
        closeNovelModal();
        renderNovelList();
        if (document.getElementById('novel-info-page').classList.contains('active') && currentNovelId === id) {
            loadNovelInfoPage(id); // Refresh if editing current novel
        } else if (!isEditing) {
            showPage('novel-info-page'); // Navigate to new novel
        }
    }

    async function openChapterModal(novelId, chapterIndex = null) {
        const novel = findNovel(novelId);
        if (!novel) { alert(t('alert_error_finding_associated_novel')); return; }

        const isEditing = chapterIndex !== null && chapterIndex >= 0;
        const chapter = isEditing ? findChapter(novelId, chapterIndex) : null;
        if (isEditing && chapter === null) { alert(t('alert_error_finding_chapter_to_edit')); return; }

        chapterModalTitleHeading.textContent = isEditing ? t('modal_edit_chapter_title') : t('modal_add_chapter_title');
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = isEditing ? chapterIndex : '';
        chapterModalTitleInput.value = chapter?.title || '';
        chapterModalContentInput.value = '';
        chapterModalContentInput.disabled = true;

        chapterModal.style.display = 'block';
        chapterModalTitleInput.focus();

        if (isEditing) {
            chapterModalContentInput.value = t('text_loading_chapter_modal_content');
            try {
                const rawContent = await readChapterContent(novelId, chapterIndex);
                // Use base English prefix for reliable error check
                chapterModalContentInput.value = rawContent.startsWith("Error:")
                    ? t('text_error_loading_chapter_modal_content', { errorDetails: rawContent })
                    : rawContent;
            } catch(e) {
                chapterModalContentInput.value = t('text_critical_error_loading_chapter_modal_content', { errorMessage: e.message });
            } finally {
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

        if (!title) { alert(t('alert_chapter_title_required')); chapterModalTitleInput.focus(); return; }
        if (!novel) { alert(t('alert_error_chapter_save_novel_missing')); closeChapterModal(); return; }

        const isNewChapter = indexStr === '';
        const chapterIndex = isNewChapter ? novel.chapters.length : parseInt(indexStr, 10);

        if (!isNewChapter && (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= novel.chapters.length)) {
            alert(t('alert_error_chapter_save_invalid_index')); closeChapterModal(); return;
        }

        let chapterData;
        let temporaryMetadataAdded = false;
        const nowISO = new Date().toISOString();

        if (isNewChapter) {
            chapterData = { title, opfsFileName: '', lastModified: nowISO };
            novel.chapters.push(chapterData);
            temporaryMetadataAdded = true;
        } else {
            chapterData = novel.chapters[chapterIndex];
            chapterData.title = title;
            chapterData.lastModified = nowISO;
        }

        try {
            await saveChapterContent(novelId, chapterIndex, content);
            saveNovelsMetadata(); // Save metadata only on successful file write
            closeChapterModal();
            renderChapterList(novelId, chapterSearchInput.value);
        } catch (error) {
            alert(t('alert_chapter_save_failed', { errorMessage: error.message }));
            if (temporaryMetadataAdded) novel.chapters.pop(); // Rollback metadata if new
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
        if (!novelsMetadata?.length) { alert(t('alert_no_novels_to_export')); return; }
        if (!opfsRoot || typeof window.CompressionStream === 'undefined') { alert(t('alert_export_failed_apis')); return; }

        const originalAriaLabel = exportButton.getAttribute('aria-label');
        exportButton.disabled = true;
        exportButton.setAttribute('aria-label', t('aria_exporting_novels'));

        try {
            const exportMetadata = JSON.parse(JSON.stringify(novelsMetadata));
            const exportObject = { version: 1, metadata: exportMetadata, chapters: {} };
            let chapterReadErrors = 0;

            for (const novel of exportObject.metadata) {
                 exportObject.chapters[novel.id] = {};
                 for (let i = 0; i < (novel.chapters?.length || 0); i++) {
                    try {
                        const content = await readChapterContent(novel.id, i);
                        // Use base English prefix for reliable error check
                        if (content.startsWith("Error:")) throw new Error(content);
                        exportObject.chapters[novel.id][i] = content;
                    } catch (readError) {
                        exportObject.chapters[novel.id][i] = `###EXPORT_READ_ERROR### ${readError.message}`;
                        chapterReadErrors++;
                    }
                }
            }

            if (chapterReadErrors > 0) alert(t('alert_export_chapter_read_warning', { count: chapterReadErrors }));

            const jsonString = JSON.stringify(exportObject);
            const dataBlob = new Blob([jsonString], { type: 'application/json' });
            const compressedStream = dataBlob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(compressedStream).blob();
            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:T.-]/g, '').slice(0, 14);
            a.download = `novels_backup_${timestamp}.novelarchive.gz`;
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
            alert(t('alert_export_complete'));
        } catch (error) {
            alert(t('alert_export_failed', { errorMessage: error.message }));
        } finally {
            exportButton.disabled = false;
            exportButton.setAttribute('aria-label', originalAriaLabel || t('aria_export_all'));
        }
    }

    function triggerImport() {
        if (!opfsRoot || typeof window.DecompressionStream === 'undefined') { alert(t('alert_import_failed_apis')); return; }
        if (novelsMetadata.length > 0 || localStorage.getItem(METADATA_KEY)) {
            if (!confirm(t('alert_confirm_import_overwrite'))) return;
        }
        importFileInput.click();
    }

    async function importData(file) {
        if (!file || !file.name.endsWith('.novelarchive.gz')) { alert(t('alert_invalid_import_file')); importFileInput.value = null; return; }
        if (!opfsRoot) { alert(t('alert_import_failed_storage_not_ready')); importFileInput.value = null; return; }

        const originalAriaLabel = importButton.getAttribute('aria-label');
        importButton.disabled = true; importFileInput.disabled = true;
        importButton.setAttribute('aria-label', t('aria_importing_backup'));
        let previousState = null;

        try {
             previousState = {
                 metadata: localStorage.getItem(METADATA_KEY), theme: localStorage.getItem(THEME_KEY),
                 font: localStorage.getItem(FONT_KEY), fontSize: localStorage.getItem(FONT_SIZE_KEY),
                 lineSpacing: localStorage.getItem(LINE_SPACING_KEY), language: localStorage.getItem(LANG_KEY)
             };

            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const jsonString = await new Response(decompressedStream).text();
            const importObject = JSON.parse(jsonString);

            if (!importObject?.metadata || !importObject.chapters) throw new Error(t('alert_invalid_backup_format'));
            if (importObject.version !== 1) console.warn(t('warning_importing_incompatible_version', { version: importObject.version }));

            localStorage.removeItem(METADATA_KEY); novelsMetadata = [];
            if (opfsRoot) { // Clear existing OPFS data
                let opfsClearFailed = false;
                const entries = [];
                if(opfsRoot.values) for await (const entry of opfsRoot.values()) if(entry.kind === 'directory') entries.push(entry.name);
                await Promise.all(entries.map(name => opfsRoot.removeEntry(name, { recursive: true }).catch(() => opfsClearFailed = true)));
                if(opfsClearFailed) console.warn(t('warning_import_opfs_clear_incomplete'));
            }

            let importedNovelsCount = 0; let chapterSaveErrors = 0; const nowISO = new Date().toISOString();
            novelsMetadata = importObject.metadata.map(novel => ({ // Map imported metadata with defaults
                id: novel.id || crypto.randomUUID(), title: novel.title || t('text_untitled_novel'),
                author: novel.author || '', genre: novel.genre || '', description: novel.description || '',
                chapters: (novel.chapters || []).map((ch, idx) => ({ title: ch.title || t('text_chapter_placeholder', { index: idx + 1 }), opfsFileName: '', lastModified: ch.lastModified || nowISO })),
                lastReadChapterIndex: novel.lastReadChapterIndex ?? -1, lastReadScrollTop: novel.lastReadScrollTop ?? 0
            }));

            for (const novel of novelsMetadata) { // Save chapter content
                const chapterData = importObject.chapters[novel.id];
                for (let i = 0; i < novel.chapters.length; i++) {
                    const content = chapterData?.[i];
                    let contentToSave = ''; // Default to empty
                    let skipSave = false;
                    if (typeof content === 'string') {
                        if (content.startsWith('###EXPORT_READ_ERROR###')) {
                            console.warn(t('warning_import_skipped_export_error', { novelId: novel.id, chapterIndex: i }));
                            skipSave = true; // Don't save anything, keep filename empty
                        } else {
                            contentToSave = content; // Valid content
                        }
                    } else {
                        console.warn(t('warning_import_missing_content', { novelId: novel.id, chapterIndex: i }));
                    }

                    if (!skipSave) {
                        try { await saveChapterContent(novel.id, i, contentToSave); }
                        catch (saveError) { chapterSaveErrors++; novel.chapters[i].opfsFileName = ''; } // Mark as failed
                    } else {
                        novel.chapters[i].opfsFileName = ''; // Ensure filename is empty if skipped
                    }
                }
                importedNovelsCount++;
            }

            saveNovelsMetadata();
            // Reload settings from localStorage (might have been in backup, though unlikely to change)
            loadSettings();
            applyTranslations(); // Apply potentially new language
            renderNovelList();
            showPage('home-page');

            let successMsg = t('alert_import_success', { count: importedNovelsCount });
            if (chapterSaveErrors > 0) successMsg += `\n\n${t('alert_import_warning_chapter_errors', { count: chapterSaveErrors })}`;
            alert(successMsg);

        } catch (error) {
            alert(t('alert_import_failed', { errorMessage: error.message }));
            if (previousState) { // Attempt rollback
                console.log("Rolling back state...");
                try {
                    Object.keys(previousState).forEach(key => {
                        const storageKey = key === 'metadata' ? METADATA_KEY :
                                         key === 'theme' ? THEME_KEY :
                                         key === 'font' ? FONT_KEY :
                                         key === 'fontSize' ? FONT_SIZE_KEY :
                                         key === 'lineSpacing' ? LINE_SPACING_KEY :
                                         key === 'language' ? LANG_KEY : null;
                        if (storageKey) {
                            if (previousState[key]) localStorage.setItem(storageKey, previousState[key]);
                            else localStorage.removeItem(storageKey);
                        }
                    });
                    loadSettings(); loadNovelsMetadata(); applyTranslations(); renderNovelList(); showPage('home-page');
                    alert(t('alert_rollback_incomplete'));
                } catch (rollbackError) { alert(t('alert_rollback_failed')); }
            } else { alert(t('alert_rollback_failed_no_backup')); }
        } finally {
            importButton.disabled = false; importFileInput.disabled = false;
            importFileInput.value = null;
            importButton.setAttribute('aria-label', originalAriaLabel || t('aria_import_archive'));
        }
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]+/g, '_').replace(/\s+/g, ' ').trim() || 'Untitled';
    }

    async function downloadChapter(novelId, chapterIndex) {
        const chapter = findChapter(novelId, chapterIndex);
        const novel = findNovel(novelId);
        if (!chapter || !novel) { alert(t('alert_download_failed_missing_metadata')); throw new Error("Metadata missing"); }

        const opfsFileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        const chapterTitleText = chapter.title || t('text_chapter_placeholder', { index: chapterIndex + 1 });
        const novelTitleText = novel.title || t('text_untitled_novel');
        const downloadName = `${sanitizeFilename(novelTitleText)} - Ch ${String(chapterIndex + 1).padStart(3,'0')} - ${sanitizeFilename(chapterTitleText)}.txt`;

        if (!opfsRoot) { alert(t('alert_download_failed_storage_unavailable')); throw new Error("OPFS unavailable"); }

        try {
             const novelDirHandle = await getNovelDir(novelId, false);
             const fileHandle = await novelDirHandle.getFileHandle(opfsFileName);
             const file = await fileHandle.getFile();
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url; a.download = downloadName; a.click(); URL.revokeObjectURL(url); a.remove();
        } catch (error) {
             const title = chapter.title || t('text_chapter_placeholder', { index: chapterIndex + 1 });
             const errorKey = error.name === 'NotFoundError' ? 'alert_download_failed_file_not_found' : 'alert_download_failed_general';
             alert(t(errorKey, { title, fileName: opfsFileName, errorMessage: error.message }));
             throw error;
        }
    }

    async function downloadAllChaptersCombined(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) { alert(t('alert_no_chapters_to_download')); return; }
        if (!opfsRoot) { alert(t('alert_download_failed_storage_unavailable')); return; }

        const totalChapters = novel.chapters.length;
        const novelTitleText = novel.title || t('text_untitled_novel');
        const originalSpanText = bulkDownloadBtn.querySelector('span')?.textContent;
        bulkDownloadBtn.disabled = true; bulkDownloadBtn.setAttribute('aria-disabled', 'true'); bulkDownloadBtn.setAttribute('aria-live', 'polite');
        const statusSpan = bulkDownloadBtn.querySelector('span');
        if(statusSpan) statusSpan.textContent = t('bulk_download_preparing');

        let combinedContent = `${t('form_title')} ${novelTitleText}\n${novel.author ? `${t('form_author')} ${novel.author}\n` : ''}${t('details_chapters')}: ${totalChapters}\n========================================\n\n`;
        let successCount = 0; let errorCount = 0;

        for (let i = 0; i < totalChapters; i++) {
            if(statusSpan) statusSpan.textContent = t('bulk_download_reading', { current: i + 1, total: totalChapters });
            const chapter = novel.chapters[i];
            const chapterTitleText = chapter.title || t('text_chapter_placeholder', { index: i + 1 });
            combinedContent += `## ${chapterTitleText} (${t('text_chapter_placeholder', { index: i + 1 })})\n\n`;
            try {
                const content = await readChapterContent(novelId, i);
                // Use base English prefix for reliable error check
                if (content.startsWith("Error:")) throw new Error(content);
                combinedContent += content + "\n\n"; successCount++;
            } catch (e) {
                combinedContent += `### ERROR READING CHAPTER ${i + 1}: ${e.message} ###\n\n`; errorCount++;
            }
            combinedContent += "---\n\n";
        }

        if(statusSpan) statusSpan.textContent = t('bulk_download_saving');

        try {
            const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${sanitizeFilename(novelTitleText)} - All Chapters.txt`; a.click(); URL.revokeObjectURL(url); a.remove();
            const finalMsgKey = errorCount > 0 ? 'bulk_download_finished_with_errors' : 'bulk_download_finished';
            alert(t(finalMsgKey, { title: novelTitleText, successCount, errorCount }));
        } catch (saveError) {
            alert(t('bulk_download_save_failed', { errorMessage: saveError.message }));
        } finally {
            if(statusSpan && originalSpanText) statusSpan.textContent = originalSpanText;
            bulkDownloadBtn.disabled = novel?.chapters?.length === 0;
            bulkDownloadBtn.setAttribute('aria-disabled', String(bulkDownloadBtn.disabled));
            bulkDownloadBtn.removeAttribute('aria-live');
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => alert(t('alert_fullscreen_error', { errorMessage: err.message, errorName: err.name })));
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function updateFullscreenButtonAriaLabel() {
         readerFullscreenBtn.setAttribute('aria-label', t(document.fullscreenElement ? 'aria_exit_fullscreen' : 'aria_enter_fullscreen'));
    }

    function updateFullscreenButton() {
        readerFullscreenBtn.textContent = document.fullscreenElement ? '↙️' : '⛶';
        updateFullscreenButtonAriaLabel();
    }

    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page')));
        document.getElementById('settings-btn').addEventListener('click', () => showPage('settings-page'));

        // Theme & Language
        themeToggleBtn.addEventListener('click', () => applyTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'));
        if (languageSelect) languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));

        // Home Page
        document.getElementById('add-novel-btn').addEventListener('click', () => openNovelModal());
        importButton.addEventListener('click', triggerImport);
        importFileInput.addEventListener('change', (e) => { if (e.target.files?.length) importData(e.target.files[0]); });
        exportButton.addEventListener('click', exportAllData);
        novelSearchInput.addEventListener('input', (e) => renderNovelList(e.target.value));

        // Settings Page
        deleteAllDataBtn.addEventListener('click', deleteAllData);

        // Novel Info Page
        document.getElementById('edit-novel-btn').addEventListener('click', () => { if (currentNovelId) openNovelModal(currentNovelId); });
        document.getElementById('delete-novel-btn').addEventListener('click', async () => {
            if (!currentNovelId) return;
            const novel = findNovel(currentNovelId);
            const title = novel?.title || 'Untitled';
            if (novel && confirm(t('alert_confirm_delete_novel_body', { title }))) {
                 try { await deleteNovelData(currentNovelId); currentNovelId = null; renderNovelList(); showPage('home-page'); alert(t('alert_delete_novel_success', { title })); }
                 catch (error) { alert(t('alert_error_deleting_novel', { title })); }
             }
        });
        document.getElementById('add-chapter-btn').addEventListener('click', () => { if (currentNovelId) openChapterModal(currentNovelId); });
        bulkDownloadBtn.addEventListener('click', () => { if (currentNovelId) downloadAllChaptersCombined(currentNovelId); });
        chapterSearchInput.addEventListener('input', (e) => { if (currentNovelId) renderChapterList(currentNovelId, e.target.value); });

        // Modals
        document.getElementById('save-novel-modal-btn').addEventListener('click', saveNovelFromModal);
        document.getElementById('cancel-novel-modal-btn').addEventListener('click', closeNovelModal);
        novelModal.addEventListener('click', (e) => { if (e.target === novelModal) closeNovelModal(); });
        document.getElementById('save-chapter-modal-btn').addEventListener('click', saveChapterFromModal);
        document.getElementById('cancel-chapter-modal-btn').addEventListener('click', closeChapterModal);
        chapterModal.addEventListener('click', (e) => { if (e.target === chapterModal) closeChapterModal(); });
        chapterModalTitleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chapterModalContentInput.focus(); } });
        document.getElementById('close-reader-settings-modal-btn').addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal.addEventListener('click', (e) => { if (e.target === readerSettingsModal) closeReaderSettingsModal(); });

        // Reader Page
        document.getElementById('reader-settings-btn').addEventListener('click', openReaderSettingsModal);
        readerFullscreenBtn.addEventListener('click', toggleFullScreen);
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        prevChapterBtn.addEventListener('click', () => {
            saveReaderPosition();
            if (currentNovelId && currentChapterIndex > 0) { currentChapterIndex--; loadReaderPage(currentNovelId, currentChapterIndex); }
        });
        nextChapterBtn.addEventListener('click', () => {
            saveReaderPosition();
            const novel = findNovel(currentNovelId);
            if (novel && currentChapterIndex < novel.chapters.length - 1) { currentChapterIndex++; loadReaderPage(currentNovelId, currentChapterIndex); }
        });

        // Reader Settings Controls
        fontSelect.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value, lineHeightSlider.value));
        fontSizeSelect.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value, lineHeightSlider.value));
        lineHeightSlider.addEventListener('input', (e) => applyReaderStyles(fontSelect.value, fontSizeSelect.value, e.target.value));

        // Global Keydowns & Lifecycle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) document.exitFullscreen();
                else if (readerSettingsModal.style.display === 'block') closeReaderSettingsModal();
                else if (chapterModal.style.display === 'block') closeChapterModal();
                else if (novelModal.style.display === 'block') closeNovelModal();
            }
        });
        window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveReaderPosition(); });
        window.addEventListener('pagehide', saveReaderPosition);
    }

    // --- Start Application ---
    initializeApp();

});