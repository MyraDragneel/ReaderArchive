'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const ALL_TRANSLATIONS = {
        en: {
            langName: "English",
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
            settings_language_label: "Select Language",
            aria_select_language: "Select Language",
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
            alert_opfs_unavailable: "Warning: Origin Private File System (OPFS) is not available or could not be initialized. Saving/loading chapter content and app data may not work on this browser/platform.",
            alert_error_saving_setting: "Error saving setting: {key}. Storage might be full.",
            alert_corrupt_metadata: "Could not load novel list due to corrupted data from OPFS. The list has been reset.",
            alert_error_saving_metadata_opfs: "Error saving novel list/progress to OPFS. Storage might be full or another file system error occurred.",
            alert_error_reading_metadata_opfs: "Error reading novel list from OPFS. Data might be corrupted or file system error.",
            alert_error_finding_novel_info: "Error: Could not find selected novel.",
            alert_error_deleting_opfs_dir: "Warning: Could not delete all files for novel \"{title}\". Some data may remain.",
            alert_confirm_delete_all_title: "⚠️ WARNING! ⚠️",
            alert_confirm_delete_all_body: "This will permanently delete ALL novels, chapters, reading progress, and display settings stored by this app in your browser.\n\nThis action CANNOT BE UNDONE.\n\nAre you absolutely sure you want to proceed?",
            alert_error_clearing_settings: "An error occurred while clearing display settings (localStorage).",
            alert_error_clearing_opfs: "An error occurred while clearing stored novel files and app data from OPFS.",
            alert_warning_incomplete_opfs_clear: "Warning: Could not automatically clear all stored novel files/app data from OPFS. Some data might remain.",
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
            warning_import_opfs_clear_incomplete: "Warning: Could not fully clear old OPFS data before import.",
            warning_import_skipped_export_error: "Skipping content import for Novel {novelId}, Chapter {chapterIndex} due to previous export error.",
            warning_import_missing_content: "Missing or invalid content for Novel {novelId}, Chapter {chapterIndex}. Saving as empty.",
            alert_import_success: "Import successful! {count} novel(s) loaded.",
            alert_import_warning_chapter_errors: "Warning: {count} chapter(s) could not be saved correctly due to errors. Their content might be missing or empty.",
            alert_import_failed: "Import failed: {errorMessage}\n\nAttempting to restore previous state...",
            alert_rollback_failed: "Critical error: Could not restore previous state after import failure. Data may be inconsistent or lost. Please try refreshing the application or clearing data manually if issues persist.",
            alert_rollback_incomplete: "Previous display settings restored. Note: Novel list and chapter content might be missing or inconsistent if OPFS data was affected during the failed import attempt. Please verify your data.",
            alert_rollback_failed_no_backup: "Critical error: Could not restore previous display settings as they weren't backed up. Application state might be inconsistent.",
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
            text_error_prefix: "Error:"
        },
        id: {
            langName: "Bahasa Indonesia",
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
            settings_language_label: "Pilih Bahasa",
            aria_select_language: "Pilih Bahasa",
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
            alert_opfs_unavailable: "Peringatan: Origin Private File System (OPFS) tidak tersedia atau tidak dapat diinisialisasi. Menyimpan/memuat konten bab dan data aplikasi mungkin tidak berfungsi pada browser/platform ini.",
            alert_error_saving_setting: "Kesalahan menyimpan pengaturan: {key}. Penyimpanan mungkin penuh.",
            alert_corrupt_metadata: "Tidak dapat memuat daftar novel karena data rusak dari OPFS. Daftar telah direset.",
            alert_error_saving_metadata_opfs: "Kesalahan menyimpan daftar/progres novel ke OPFS. Penyimpanan mungkin penuh atau kesalahan sistem berkas lainnya.",
            alert_error_reading_metadata_opfs: "Kesalahan membaca daftar novel dari OPFS. Data mungkin rusak atau kesalahan sistem berkas.",
            alert_error_finding_novel_info: "Kesalahan: Tidak dapat menemukan novel yang dipilih.",
            alert_error_deleting_opfs_dir: "Peringatan: Tidak dapat menghapus semua berkas untuk novel \"{title}\". Sebagian data mungkin tersisa.",
            alert_confirm_delete_all_title: "⚠️ PERINGATAN! ⚠️",
            alert_confirm_delete_all_body: "Ini akan menghapus secara permanen SEMUA novel, bab, progres baca, dan pengaturan yang disimpan oleh aplikasi ini di browser Anda.\n\nTindakan ini TIDAK DAPAT DIBATALKAN.\n\nApakah Anda benar-benar yakin ingin melanjutkan?",
            alert_error_clearing_settings: "Terjadi kesalahan saat menghapus data pengaturan tampilan (localStorage).",
            alert_error_clearing_opfs: "Terjadi kesalahan saat menghapus berkas novel dan data aplikasi yang tersimpan dari OPFS.",
            alert_warning_incomplete_opfs_clear: "Peringatan: Tidak dapat menghapus semua berkas novel/data aplikasi yang tersimpan dari OPFS secara otomatis. Sebagian data mungkin tersisa.",
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
            alert_rollback_incomplete: "Pengaturan tampilan sebelumnya dipulihkan. Catatan: Daftar novel dan konten bab mungkin hilang atau tidak konsisten jika data OPFS terpengaruh selama upaya impor yang gagal. Silakan verifikasi data Anda.",
            alert_rollback_failed_no_backup: "Kesalahan kritis: Tidak dapat memulihkan pengaturan tampilan sebelumnya karena tidak dicadangkan. Keadaan aplikasi mungkin tidak konsisten.",
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
            text_error_prefix: "Kesalahan:"
        }
    };

    const METADATA_OPFS_FILENAME = 'novelsMetadata.json';
    const THEME_KEY = 'novelReaderTheme_v2';
    const FONT_KEY = 'novelReaderFont_v2';
    const FONT_SIZE_KEY = 'novelReaderFontSize_v2';
    const LINE_SPACING_KEY = 'novelReaderLineSpacing_v2';
    const LANG_KEY = 'novelReaderLanguage_v2';
    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT = 'Inter, Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16px';
    const DEFAULT_LINE_SPACING = '1.6';
    const DEFAULT_LANG = 'en';
    const MODAL_ANIMATION_DURATION = 200;
    const SEARCH_DEBOUNCE_DELAY = 250;

    let currentNovelId = null;
    let currentChapterIndex = -1;
    let novelsMetadata = [];
    let opfsRoot = null;

    const doc = document;
    const appTitleEl = doc.querySelector('title[data-i18n-key="app_title"]');
    const pages = doc.querySelectorAll('.page');
    const homePage = doc.getElementById('home-page');
    const readerPage = doc.getElementById('reader-page');
    const themeToggleBtn = doc.getElementById('theme-toggle-btn');
    const languageSelect = doc.getElementById('language-select');
    const novelListEl = doc.getElementById('novel-list');
    const novelSearchInput = doc.getElementById('novel-search');
    const importFileInput = doc.getElementById('import-file-input');
    const exportButton = doc.getElementById('export-btn');
    const importButton = doc.getElementById('import-btn');
    const deleteAllDataBtn = doc.getElementById('delete-all-data-btn');
    const novelInfoTitleEl = doc.getElementById('novel-info-title');
    const novelInfoAuthorEl = doc.getElementById('novel-info-author');
    const novelInfoGenreEl = doc.getElementById('novel-info-genre');
    const novelInfoDescriptionEl = doc.getElementById('novel-info-description');
    const novelInfoLastReadEl = doc.getElementById('novel-info-last-read');
    const chapterListEl = doc.getElementById('chapter-list');
    const chapterSearchInput = doc.getElementById('chapter-search');
    const bulkDownloadBtn = doc.getElementById('bulk-download-chapters-btn');
    const readerMainContent = doc.getElementById('reader-main-content');
    const readerContentEl = doc.getElementById('reader-content');
    const readerChapterTitleEl = doc.getElementById('reader-chapter-title');
    const prevChapterBtn = doc.getElementById('prev-chapter-btn');
    const nextChapterBtn = doc.getElementById('next-chapter-btn');
    const readerFullscreenBtn = doc.getElementById('reader-fullscreen-btn');
    const novelModal = doc.getElementById('novel-modal');
    const novelModalTitleHeading = doc.getElementById('novel-modal-title-heading');
    const novelModalIdInput = doc.getElementById('novel-modal-id');
    const novelModalTitleInput = doc.getElementById('novel-modal-title-input');
    const novelModalAuthorInput = doc.getElementById('novel-modal-author-input');
    const novelModalGenreInput = doc.getElementById('novel-modal-genre-input');
    const novelModalDescriptionInput = doc.getElementById('novel-modal-description-input');
    const chapterModal = doc.getElementById('chapter-modal');
    const chapterModalTitleHeading = doc.getElementById('chapter-modal-title-heading');
    const chapterModalNovelIdInput = doc.getElementById('chapter-modal-novel-id');
    const chapterModalIndexInput = doc.getElementById('chapter-modal-index');
    const chapterModalTitleInput = doc.getElementById('chapter-modal-title-input');
    const chapterModalContentInput = doc.getElementById('chapter-modal-content-input');
    const readerSettingsModal = doc.getElementById('reader-settings-modal');
    const fontSelect = doc.getElementById('font-select');
    const fontSizeSelect = doc.getElementById('font-size-select');
    const lineHeightSlider = doc.getElementById('line-height-slider');
    const lineHeightValueSpan = doc.getElementById('line-height-value');

    class I18nService {
        constructor(translationsData) {
            this.translationsData = translationsData;
            this.currentLang = DEFAULT_LANG;
            this.currentTranslations = this.translationsData[DEFAULT_LANG] || this.translationsData.en;
            this.languageChangeListeners = [];
        }
        init(initialLang = null) {
            const savedLang = initialLang || localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
            this.setLanguage(savedLang, false);
        }
        setLanguage(langCode, savePreference = true) {
            if (this.translationsData[langCode]) {
                this.currentLang = langCode;
                this.currentTranslations = this.translationsData[langCode];
                if (savePreference) saveSetting(LANG_KEY, langCode);
                doc.documentElement.lang = this.currentLang;
                this.translatePage();
                this.languageChangeListeners.forEach(cb => cb(this.currentLang));
            } else {
                console.warn(`Language '${langCode}' not found. Falling back to 'en'.`);
                if (this.currentLang !== 'en') this.setLanguage('en', savePreference);
            }
        }
        get(key, replacements = {}) {
            let text = this.currentTranslations[key] || this.translationsData.en[key] || `Missing: ${key}`;
            for (const placeholder in replacements) {
                text = text.replace(new RegExp(`{${placeholder}}`, 'g'), String(replacements[placeholder]));
            }
            return text;
        }
        translateElement(element) {
            const key = element.dataset.i18nKey;
            const placeholderKey = element.dataset.i18nPlaceholder;
            const ariaLabelKey = element.dataset.i18nAriaLabel;
            if (key) element.textContent = this.get(key);
            if (placeholderKey) element.placeholder = this.get(placeholderKey);
            if (ariaLabelKey) element.setAttribute('aria-label', this.get(ariaLabelKey));
        }
        translatePage(rootElement = doc.body) {
            appTitleEl.textContent = this.get('app_title');
            rootElement.querySelectorAll('[data-i18n-key], [data-i18n-placeholder], [data-i18n-aria-label]')
                .forEach(el => this.translateElement(el));
            updateThemeToggleButtonAriaLabel();
            updateFullscreenButtonAriaLabel();
            populateLanguageSelector();
        }
        onLanguageChange(callback) { this.languageChangeListeners.push(callback); }
        getAvailableLanguages() {
            return Object.keys(this.translationsData).map(code => ({
                code, name: this.translationsData[code].langName || code
            }));
        }
    }
    const i18n = new I18nService(ALL_TRANSLATIONS);

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(this, args); }, delay);
        };
    }

    async function initializeApp() {
        registerServiceWorker();
        if (!await initOPFS()) alert(i18n.get('alert_opfs_unavailable'));
        i18n.init();
        i18n.onLanguageChange(() => {
            if (homePage.classList.contains('active')) renderNovelList(novelSearchInput.value);
            if (doc.getElementById('novel-info-page').classList.contains('active') && currentNovelId) loadNovelInfoPage(currentNovelId);
        });
        loadSettings();
        await loadNovelsMetadata();
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
            if (navigator.storage?.getDirectory) {
                opfsRoot = await navigator.storage.getDirectory();
                return true;
            }
            console.warn('Origin Private File System API not available.');
        } catch (error) {
            console.error('OPFS Initialization Error:', error);
        }
        opfsRoot = null;
        return false;
    }

    async function saveReaderPosition() {
        if (!readerPage.classList.contains('active') || !currentNovelId || currentChapterIndex < 0) return;
        const novel = findNovel(currentNovelId);
        if (!novel) return;
        novel.lastReadChapterIndex = currentChapterIndex;
        novel.lastReadScrollTop = Math.round(readerMainContent.scrollTop);
        await saveNovelsMetadata();
    }

    async function showPage(pageId) {
        if (doc.fullscreenElement && readerPage.classList.contains('active') && pageId !== 'reader-page') {
            if (doc.exitFullscreen) doc.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
        }
        if (readerPage.classList.contains('active') && pageId !== 'reader-page') await saveReaderPosition();

        let activePageEl = null;
        pages.forEach(p => {
            const isActive = p.id === pageId;
            p.classList.toggle('active', isActive);
            if (isActive) activePageEl = p;
        });
        if (pageId !== 'reader-page' || (pageId === 'reader-page' && !readerMainContent.scrollTop)) {
            const contentArea = activePageEl?.querySelector('.app-main');
            if (contentArea) contentArea.scrollTop = 0;
            else if (activePageEl) activePageEl.scrollTop = 0;
            else window.scrollTo(0, 0);
        }
        if (pageId !== 'home-page' && novelSearchInput) novelSearchInput.value = '';
        if (pageId !== 'novel-info-page' && chapterSearchInput) chapterSearchInput.value = '';
        if (pageId === 'home-page') renderNovelList();
        if (pageId === 'novel-info-page' && currentNovelId) loadNovelInfoPage(currentNovelId);
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
        lineHeightValueSpan.textContent = lineSpacing;
    }

    function saveSetting(key, value) {
        try { localStorage.setItem(key, value); }
        catch (error) { alert(i18n.get('alert_error_saving_setting', { key })); }
    }

    function updateThemeToggleButtonAriaLabel() {
        themeToggleBtn.setAttribute('aria-label', i18n.get(doc.body.classList.contains('dark-mode') ? 'theme_switch_light' : 'theme_switch_dark'));
    }

    function applyTheme(theme, save = true) {
        doc.body.classList.toggle('dark-mode', theme === 'dark');
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
        updateThemeToggleButtonAriaLabel();
        const metaLight = doc.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const metaDark = doc.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        requestAnimationFrame(() => {
            const lightCol = getComputedStyle(doc.documentElement).getPropertyValue('--bg-primary-light').trim();
            const darkCol = getComputedStyle(doc.documentElement).getPropertyValue('--bg-primary-dark').trim();
            const effCol = theme === 'dark' ? darkCol : lightCol;
            if (metaLight) metaLight.content = effCol;
            if (metaDark) metaDark.content = effCol;
        });
        if (save) saveSetting(THEME_KEY, theme);
    }

    function applyReaderStyles(font, size, lineHeight, save = true) {
        const rootStyle = doc.documentElement.style;
        rootStyle.setProperty('--font-family-reader', font);
        rootStyle.setProperty('--font-size-reader', size);
        rootStyle.setProperty('--line-height-reader', lineHeight);
        lineHeightValueSpan.textContent = lineHeight;
        if (save) {
            saveSetting(FONT_KEY, font);
            saveSetting(FONT_SIZE_KEY, size);
            saveSetting(LINE_SPACING_KEY, lineHeight);
        }
    }

    function populateLanguageSelector() {
        languageSelect.innerHTML = '';
        i18n.getAvailableLanguages().forEach(lang => {
            const opt = doc.createElement('option');
            opt.value = lang.code; opt.textContent = lang.name; languageSelect.appendChild(opt);
        });
        languageSelect.value = i18n.currentLang;
    }

    async function loadNovelsMetadata() {
        novelsMetadata = [];
        if (!opfsRoot) { console.warn("OPFS not available, metadata cannot be loaded."); return; }
        try {
            const fileHandle = await opfsRoot.getFileHandle(METADATA_OPFS_FILENAME, { create: false });
            const file = await fileHandle.getFile();
            const text = await file.text();
            if (text) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    novelsMetadata = parsed.map(n => ({
                        id: n.id || crypto.randomUUID(), title: n.title || i18n.get('text_untitled_novel'),
                        author: n.author || '', genre: n.genre || '', description: n.description || '',
                        chapters: Array.isArray(n.chapters) ? n.chapters.map((ch, idx) => ({
                            title: ch.title || i18n.get('text_chapter_placeholder', { index: idx + 1 }),
                            opfsFileName: ch.opfsFileName || '', lastModified: ch.lastModified || null
                        })) : [],
                        lastReadChapterIndex: (typeof n.lastReadChapterIndex === 'number' && n.lastReadChapterIndex >= -1) ? n.lastReadChapterIndex : -1,
                        lastReadScrollTop: (typeof n.lastReadScrollTop === 'number' && n.lastReadScrollTop >= 0) ? n.lastReadScrollTop : 0
                    }));
                } else console.warn("Parsed OPFS metadata is not an array.");
            }
        } catch (error) {
            if (error.name === 'NotFoundError') console.log(`OPFS file "${METADATA_OPFS_FILENAME}" not found.`);
            else { console.error(`Error reading "${METADATA_OPFS_FILENAME}" from OPFS:`, error); alert(i18n.get('alert_error_reading_metadata_opfs')); }
        }
        novelsMetadata.sort((a, b) => (a.title || '').localeCompare(b.title || '', i18n.currentLang, { sensitivity: 'base' }));
    }

    async function saveNovelsMetadata() {
        if (!opfsRoot) { console.error("OPFS not available, metadata cannot be saved."); alert(i18n.get('alert_error_saving_metadata_opfs')); return; }
        try {
            novelsMetadata.sort((a, b) => (a.title || '').localeCompare(b.title || '', i18n.currentLang, { sensitivity: 'base' }));
            const jsonString = JSON.stringify(novelsMetadata);
            const fileHandle = await opfsRoot.getFileHandle(METADATA_OPFS_FILENAME, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();
        } catch (error) {
            console.error(`Error saving "${METADATA_OPFS_FILENAME}" to OPFS:`, error);
            alert(i18n.get('alert_error_saving_metadata_opfs'));
        }
    }

    function findNovel(novelId) { return novelsMetadata.find(n => n.id === novelId); }
    function findChapter(novelId, chapterIndex) {
        const novel = findNovel(novelId);
        return (novel?.chapters && chapterIndex >= 0 && chapterIndex < novel.chapters.length) ? novel.chapters[chapterIndex] : null;
    }

    async function getNovelDir(novelId, create = false) {
        if (!opfsRoot) throw new Error("OPFS not initialized.");
        const safeNovelId = String(novelId).replace(/[^a-zA-Z0-9-]/g, '_');
        return opfsRoot.getDirectoryHandle(safeNovelId, { create });
    }

    async function saveChapterContent(novelId, chapterIndex, content) {
        if (!opfsRoot) throw new Error("OPFS not ready for saving chapter.");
        const novel = findNovel(novelId);
        const chapter = novel?.chapters?.[chapterIndex];
        if (!novel || !chapter) throw new Error(`Ch metadata missing for novel ${novelId}, index ${chapterIndex}.`);
        if (!chapter.opfsFileName) chapter.opfsFileName = `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        const safeFileName = sanitizeFilename(chapter.opfsFileName);
        try {
            const novelDirHandle = await getNovelDir(novelId, true);
            const fileHandle = await novelDirHandle.getFileHandle(safeFileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content); await writable.close();
        } catch (error) {
            console.error(`Failed to save chapter file ${safeFileName}:`, error);
            throw new Error(`Failed to save chapter file: ${error.message}`);
        }
    }

    async function readChapterContent(novelId, chapterIndex) {
        if (!opfsRoot) return i18n.get('text_error_file_storage_unavailable');
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter) return i18n.get('text_error_chapter_metadata_not_found');
        const fileName = chapter.opfsFileName || `ch_${String(chapterIndex).padStart(5, '0')}.txt`;
        if (!fileName) return i18n.get('text_error_chapter_file_info_missing');
        const safeFileName = sanitizeFilename(fileName);
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            const fileHandle = await novelDirHandle.getFileHandle(safeFileName);
            return (await fileHandle.getFile()).text();
        } catch (error) {
            console.warn(`Error reading chapter ${safeFileName} for novel ${novelId}:`, error);
            const errKey = error.name === 'NotFoundError' ? 'text_error_file_not_found' : 'text_error_reading_file';
            return `${i18n.get('text_error_prefix')} ${i18n.get(errKey, { fileName: safeFileName, errorMessage: error.message })}`;
        }
    }

    async function deleteChapterFile(novelId, chapterIndex) {
        if (!opfsRoot) { console.warn("OPFS not available for deleting chapter file."); return false; }
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter || !chapter.opfsFileName) return true;
        const safeFileName = sanitizeFilename(chapter.opfsFileName);
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(safeFileName);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') return true;
            console.error(`Failed to delete chapter file ${safeFileName}:`, error); return false;
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) return;
        if (opfsRoot) {
            try { await getNovelDir(novelId).then(dir => dir.remove({recursive: true})); }
            catch (error) {
                if (error.name !== 'NotFoundError') alert(i18n.get('alert_error_deleting_opfs_dir', { title: novel.title || i18n.get('text_untitled_novel') }));
            }
        }
        const novelIdx = novelsMetadata.findIndex(n => n.id === novelId);
        if (novelIdx > -1) { novelsMetadata.splice(novelIdx, 1); await saveNovelsMetadata(); }
    }

    async function deleteAllData() {
        if (!confirm(`${i18n.get('alert_confirm_delete_all_title')}\n\n${i18n.get('alert_confirm_delete_all_body')}`)) return;
        let settingsCleared = true;
        try {
            [THEME_KEY, FONT_KEY, FONT_SIZE_KEY, LINE_SPACING_KEY, LANG_KEY].forEach(k => localStorage.removeItem(k));
        } catch (e) { alert(i18n.get('alert_error_clearing_settings')); settingsCleared = false; }

        let opfsCompletelyCleared = true;
        if (opfsRoot) {
            let opfsClearFailedSome = false;
            const entriesToRemove = [];
            try {
                for await (const entry of opfsRoot.values()) entriesToRemove.push({name: entry.name, kind: entry.kind});
                for (const entry of entriesToRemove) {
                    await opfsRoot.removeEntry(entry.name, { recursive: entry.kind === 'directory' })
                                  .catch(() => opfsClearFailedSome = true);
                }
                if (opfsClearFailedSome) { alert(i18n.get('alert_warning_incomplete_opfs_clear')); opfsCompletelyCleared = false; }
            } catch (error) { alert(i18n.get('alert_error_clearing_opfs')); opfsCompletelyCleared = false; }
        }
        novelsMetadata = [];
        if (settingsCleared) {
            i18n.setLanguage(DEFAULT_LANG); applyTheme(DEFAULT_THEME);
            applyReaderStyles(DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING);
            fontSelect.value = DEFAULT_FONT;
            fontSizeSelect.value = DEFAULT_FONT_SIZE;
            lineHeightSlider.value = DEFAULT_LINE_SPACING;
            lineHeightValueSpan.textContent = DEFAULT_LINE_SPACING;
        }
        renderNovelList(); await showPage('home-page');
        if (settingsCleared && opfsCompletelyCleared) alert(i18n.get('alert_delete_all_success'));
    }

    function renderNovelList(filterTerm = '') {
        novelListEl.innerHTML = '';
        const lowerFilter = filterTerm.toLowerCase().trim();
        const filtered = novelsMetadata.filter(n => !lowerFilter ||
            (n.title || '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter) ||
            (n.author || '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter)
        );
        const noNovels = novelsMetadata.length === 0;
        exportButton.disabled = noNovels;
        exportButton.setAttribute('aria-disabled', String(noNovels));

        if (filtered.length === 0) {
            const li = doc.createElement('li'); li.className = 'list-placeholder';
            li.textContent = i18n.get(noNovels ? 'placeholder_no_novels' : 'placeholder_no_matching_novels', { searchTerm: filterTerm });
            novelListEl.appendChild(li); return;
        }
        const frag = doc.createDocumentFragment();
        filtered.forEach(novel => {
            const li = doc.createElement('li'); li.className = 'novel-card'; li.dataset.novelId = novel.id;
            li.setAttribute('role', 'button'); li.tabIndex = 0;
            const title = novel.title || i18n.get('text_untitled_novel');
            li.setAttribute('aria-label', i18n.get('aria_open_novel', { title }));
            const titleEl = doc.createElement('h3'); titleEl.className = 'novel-card__title'; titleEl.textContent = title;
            const authorEl = doc.createElement('p'); authorEl.className = 'novel-card__author';
            authorEl.textContent = novel.author || i18n.get('text_unknown_author');
            const contentDiv = doc.createElement('div'); contentDiv.className = 'novel-card__content'; contentDiv.append(titleEl, authorEl);
            const chev = doc.createElement('div'); chev.className = 'novel-card__chevron'; chev.setAttribute('aria-hidden', 'true'); chev.textContent = '›';
            li.append(contentDiv, chev);
            const nav = () => { currentNovelId = novel.id; showPage('novel-info-page'); };
            li.addEventListener('click', nav);
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav(); } });
            frag.appendChild(li);
        });
        novelListEl.appendChild(frag);
    }

    function loadNovelInfoPage(novelId) {
        const novel = findNovel(novelId);
        if (!novel) { alert(i18n.get('alert_error_finding_novel_info')); showPage('home-page'); return; }
        novelInfoTitleEl.textContent = novel.title || i18n.get('text_untitled_novel');
        novelInfoAuthorEl.textContent = novel.author || i18n.get('details_na');
        novelInfoGenreEl.textContent = novel.genre || i18n.get('details_na');
        novelInfoDescriptionEl.textContent = novel.description || i18n.get('details_no_description');
        const lastReadIdx = novel.lastReadChapterIndex;
        const lastReadCh = findChapter(novelId, lastReadIdx);
        const hasChaps = novel.chapters?.length > 0;

        novelInfoLastReadEl.onclick = null; novelInfoLastReadEl.onkeydown = null;
        novelInfoLastReadEl.classList.remove('clickable', 'not-clickable');
        novelInfoLastReadEl.removeAttribute('role'); novelInfoLastReadEl.tabIndex = -1; novelInfoLastReadEl.removeAttribute('aria-label');
        if (hasChaps && lastReadCh && lastReadIdx !== -1) {
            const chTitle = lastReadCh.title || i18n.get('text_chapter_placeholder', { index: lastReadIdx + 1 });
            novelInfoLastReadEl.textContent = chTitle; novelInfoLastReadEl.classList.add('clickable');
            novelInfoLastReadEl.setAttribute('role', 'link'); novelInfoLastReadEl.tabIndex = 0;
            novelInfoLastReadEl.setAttribute('aria-label', i18n.get('aria_continue_reading', { chapterTitle: chTitle }));
            const handler = (e) => {
                if (e.type==='click'||(e.type==='keydown'&&(e.key==='Enter'||e.key===' '))) {
                    e.preventDefault(); currentChapterIndex = lastReadIdx;
                    loadReaderPage(currentNovelId, currentChapterIndex).then(() => showPage('reader-page'));
                }
            };
            novelInfoLastReadEl.addEventListener('click', handler); novelInfoLastReadEl.addEventListener('keydown', handler);
        } else { novelInfoLastReadEl.textContent = i18n.get('details_never_read'); novelInfoLastReadEl.classList.add('not-clickable'); }

        renderChapterList(novelId, chapterSearchInput ? chapterSearchInput.value : '');
    }

    function formatTimestamp(isoString) {
        if (!isoString) return i18n.get('details_na');
        try {
            const d = new Date(isoString); if (isNaN(d.getTime())) return i18n.get('text_invalid_date');
            return d.toLocaleDateString(i18n.currentLang, { year:'numeric',month:'short',day:'numeric'}) + ' ' +
                   d.toLocaleTimeString(i18n.currentLang, {hour:'2-digit',minute:'2-digit'});
        } catch (e) { return i18n.get('text_error_formatting_timestamp'); }
    }

    function renderChapterList(novelId, filterTerm = '') {
        const novel = findNovel(novelId); chapterListEl.innerHTML = '';
        const chapters = novel?.chapters || [];
        const lowerFilter = filterTerm.toLowerCase().trim();
        const filtered = chapters.map((ch, idx) => ({ ...ch, originalIndex: idx }))
            .filter(ch => !lowerFilter || (ch.title || '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter));
        const hasAnyChaps = chapters.length > 0;
        bulkDownloadBtn.disabled = !hasAnyChaps;
        bulkDownloadBtn.setAttribute('aria-disabled', String(!hasAnyChaps));

        if (filtered.length === 0) {
            const li = doc.createElement('li'); li.className = 'list-placeholder';
            li.textContent = i18n.get(hasAnyChaps ? 'placeholder_no_matching_chapters' : 'placeholder_no_chapters', { searchTerm: filterTerm });
            chapterListEl.appendChild(li); return;
        }
        const frag = doc.createDocumentFragment();
        filtered.forEach(({ title, lastModified, originalIndex }) => {
            const li = doc.createElement('li'); li.className = 'chapter-card'; li.dataset.chapterIndex = originalIndex;
            const chTitle = title || i18n.get('text_chapter_placeholder', { index: originalIndex + 1 });
            const mainDiv = doc.createElement('div'); mainDiv.className = 'chapter-card__main'; mainDiv.setAttribute('role','button'); mainDiv.tabIndex=0;
            mainDiv.setAttribute('aria-label', i18n.get('aria_read_chapter', { chapterTitle: chTitle }));
            const titleH4 = doc.createElement('h4'); titleH4.className = 'chapter-card__title'; titleH4.textContent = chTitle;
            const metaP = doc.createElement('p'); metaP.className = 'chapter-card__meta'; metaP.textContent = i18n.get('text_modified', { timestamp: formatTimestamp(lastModified) });
            mainDiv.append(titleH4, metaP);
            const actionsDiv = doc.createElement('div'); actionsDiv.className = 'chapter-card__actions';
            const createBtn = (icon, ariaKey, ...cls) => {
                const btn = doc.createElement('button'); btn.type = 'button'; btn.textContent = icon;
                btn.setAttribute('aria-label', i18n.get(ariaKey, { chapterTitle: chTitle }));
                btn.classList.add('btn', 'btn--icon', ...cls); return btn;
            };
            const editBtn = createBtn('✏️', 'aria_edit_chapter'); const dlBtn = createBtn('💾', 'aria_download_chapter');
            const delBtn = createBtn('🗑️', 'aria_delete_chapter', 'btn--icon-danger');
            actionsDiv.append(editBtn, dlBtn, delBtn); li.append(mainDiv, actionsDiv);
            const navReader = () => { currentChapterIndex = originalIndex; loadReaderPage(currentNovelId, currentChapterIndex).then(() => showPage('reader-page')); };
            mainDiv.addEventListener('click', navReader); mainDiv.addEventListener('keydown', (e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); navReader();}});
            editBtn.addEventListener('click', (e) => { e.stopPropagation(); openChapterModal(novelId, originalIndex); });
            dlBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadChapter(novelId, originalIndex).catch(console.warn); });
            delBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(i18n.get('confirm_delete_chapter', { chapterTitle: chTitle }))) {
                    try {
                        if (await deleteChapterFile(novelId, originalIndex)) {
                            novel.chapters.splice(originalIndex, 1);
                            if (novel.lastReadChapterIndex === originalIndex) { novel.lastReadChapterIndex = -1; novel.lastReadScrollTop = 0; }
                            else if (novel.lastReadChapterIndex > originalIndex) novel.lastReadChapterIndex--;
                            await saveNovelsMetadata();
                            renderChapterList(novelId, filterTerm); loadNovelInfoPage(novelId);
                        } else alert(i18n.get('alert_failed_delete_chapter_file', { chapterTitle: chTitle }));
                    } catch(err) { alert(i18n.get('alert_error_deleting_chapter', { chapterTitle: chTitle })); }
                }
            });
            frag.appendChild(li);
        });
        chapterListEl.appendChild(frag);
    }

    async function loadReaderPage(novelId, chapterIndexToLoad) {
        const novel = findNovel(novelId); const chapter = findChapter(novelId, chapterIndexToLoad);
        if (!chapter || !novel) {
            readerChapterTitleEl.textContent = i18n.get('text_error_formatting_timestamp');
            readerContentEl.textContent = i18n.get('text_error_loading_chapter');
            prevChapterBtn.disabled = true; prevChapterBtn.setAttribute('aria-disabled', 'true');
            nextChapterBtn.disabled = true; nextChapterBtn.setAttribute('aria-disabled', 'true');
            return;
        }
        currentChapterIndex = chapterIndexToLoad;
        readerChapterTitleEl.textContent = chapter.title || i18n.get('text_chapter_placeholder', { index: currentChapterIndex + 1 });
        readerContentEl.textContent = i18n.get('text_loading_chapter_content'); readerContentEl.style.color = '';
        readerMainContent.scrollTop = 0;
        const rawContent = await readChapterContent(novelId, currentChapterIndex);
        if (rawContent.startsWith(i18n.get('text_error_prefix'))) {
            readerContentEl.textContent = rawContent; readerContentEl.style.color = 'var(--color-accent-danger)';
        } else readerContentEl.textContent = rawContent;
        prevChapterBtn.disabled = (currentChapterIndex <= 0);
        prevChapterBtn.setAttribute('aria-disabled', String(prevChapterBtn.disabled));
        nextChapterBtn.disabled = (currentChapterIndex >= novel.chapters.length - 1);
        nextChapterBtn.setAttribute('aria-disabled', String(nextChapterBtn.disabled));
        requestAnimationFrame(() => {
            if (readerPage.classList.contains('active') && currentNovelId === novelId &&
                currentChapterIndex === novel.lastReadChapterIndex) {
                readerMainContent.scrollTop = novel.lastReadScrollTop;
            }
        });
    }

    function closeModal(modalEl) {
        if (!modalEl || modalEl.style.display === 'none') return;
        modalEl.classList.add('closing');
        setTimeout(() => { modalEl.style.display = 'none'; modalEl.classList.remove('closing'); }, MODAL_ANIMATION_DURATION);
    }
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.style.display = 'flex';
        const focusable = modalEl.querySelector('input:not([type="hidden"]), textarea, select, button');
        if (focusable) focusable.focus();
    }

    function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit; const novel = isEditing ? findNovel(novelIdToEdit) : null;
        if (isEditing && !novel) { alert(i18n.get('alert_error_finding_novel_info')); return; }
        novelModalTitleHeading.textContent = i18n.get(isEditing ? 'modal_edit_novel_title' : 'modal_add_novel_title');
        novelModalIdInput.value = novelIdToEdit || '';
        novelModalTitleInput.value = novel?.title || '';
        novelModalAuthorInput.value = novel?.author || '';
        novelModalGenreInput.value = novel?.genre || '';
        novelModalDescriptionInput.value = novel?.description || '';
        openModal(novelModal); novelModalTitleInput.focus();
    }
    function closeNovelModal() { closeModal(novelModal); }
    async function saveNovelFromModal() {
        const id = novelModalIdInput.value; const title = novelModalTitleInput.value.trim();
        if (!title) { alert(i18n.get('alert_novel_title_required')); novelModalTitleInput.focus(); return; }
        const author = novelModalAuthorInput.value.trim(); const genre = novelModalGenreInput.value.trim();
        const description = novelModalDescriptionInput.value.trim(); const isEditing = !!id;
        let novelToUpdate;
        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) { alert(i18n.get('alert_error_saving_novel_update')); closeNovelModal(); return; }
            Object.assign(novelToUpdate, { title, author, genre, description });
        } else {
            novelToUpdate = { id:crypto.randomUUID(), title, author, genre, description, chapters:[], lastReadChapterIndex:-1, lastReadScrollTop:0 };
            novelsMetadata.push(novelToUpdate); currentNovelId = novelToUpdate.id;
        }
        await saveNovelsMetadata(); closeNovelModal();
        renderNovelList(novelSearchInput ? novelSearchInput.value : '');
        if (doc.getElementById('novel-info-page').classList.contains('active') && currentNovelId === novelToUpdate.id) {
            loadNovelInfoPage(novelToUpdate.id);
        } else if (!isEditing && currentNovelId === novelToUpdate.id) await showPage('novel-info-page');
    }

    async function openChapterModal(novelId, chapterIndexToEdit = null) {
        const novel = findNovel(novelId); if (!novel) { alert(i18n.get('alert_error_finding_associated_novel')); return; }
        const isEditing = chapterIndexToEdit !== null && chapterIndexToEdit >= 0;
        const chapter = isEditing ? findChapter(novelId, chapterIndexToEdit) : null;
        if (isEditing && !chapter) { alert(i18n.get('alert_error_finding_chapter_to_edit')); return; }
        chapterModalTitleHeading.textContent = i18n.get(isEditing ? 'modal_edit_chapter_title' : 'modal_add_chapter_title');
        chapterModalNovelIdInput.value = novelId;
        chapterModalIndexInput.value = isEditing ? String(chapterIndexToEdit) : '';
        chapterModalTitleInput.value = chapter?.title || '';
        chapterModalContentInput.value = ''; chapterModalContentInput.disabled = true;
        openModal(chapterModal); chapterModalTitleInput.focus();
        if (isEditing) {
            chapterModalContentInput.value = i18n.get('text_loading_chapter_modal_content');
            try {
                const rawContent = await readChapterContent(novelId, chapterIndexToEdit);
                if (rawContent.startsWith(i18n.get('text_error_prefix'))) chapterModalContentInput.value = i18n.get('text_error_loading_chapter_modal_content', { errorDetails: rawContent.substring(i18n.get('text_error_prefix').length + 1) });
                else chapterModalContentInput.value = rawContent;
            } catch(e) { chapterModalContentInput.value = i18n.get('text_critical_error_loading_chapter_modal_content', { errorMessage: e.message }); }
            finally { chapterModalContentInput.disabled = false; }
        } else {
            chapterModalContentInput.disabled = false;
        }
    }
    function closeChapterModal() { closeModal(chapterModal); }
    async function saveChapterFromModal() {
        const novelId = chapterModalNovelIdInput.value; const indexStr = chapterModalIndexInput.value;
        const title = chapterModalTitleInput.value.trim(); const content = chapterModalContentInput.value;
        const novel = findNovel(novelId);
        if (!title) { alert(i18n.get('alert_chapter_title_required')); chapterModalTitleInput.focus(); return; }
        if (!novel) { alert(i18n.get('alert_error_chapter_save_novel_missing')); closeChapterModal(); return; }
        const isNewCh = indexStr === '';
        const chIdx = isNewCh ? novel.chapters.length : parseInt(indexStr, 10);
        if (!isNewCh && (isNaN(chIdx) || chIdx < 0 || chIdx >= novel.chapters.length)) {
            alert(i18n.get('alert_error_chapter_save_invalid_index')); closeChapterModal(); return;
        }
        let chData; const nowISO = new Date().toISOString();
        if (isNewCh) chData = { title, opfsFileName: '', lastModified: nowISO };
        else { chData = novel.chapters[chIdx]; chData.title = title; }
        chData.lastModified = nowISO;
        try {
            if (isNewCh) novel.chapters.push(chData);
            await saveChapterContent(novelId, chIdx, content);
            await saveNovelsMetadata();
            closeChapterModal();
            renderChapterList(novelId, chapterSearchInput ? chapterSearchInput.value : '');
        } catch (error) {
            alert(i18n.get('alert_chapter_save_failed', { errorMessage: error.message }));
            if (isNewCh) { const tempIdx = novel.chapters.indexOf(chData); if (tempIdx > -1) novel.chapters.splice(tempIdx, 1); }
        }
    }

    function openReaderSettingsModal() {
        fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        fontSizeSelect.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        lineHeightSlider.value = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;
        lineHeightValueSpan.textContent = lineHeightSlider.value;
        openModal(readerSettingsModal);
    }
    function closeReaderSettingsModal() { closeModal(readerSettingsModal); }

    async function exportAllData() {
        if (!novelsMetadata?.length) { alert(i18n.get('alert_no_novels_to_export')); return; }
        if (!opfsRoot || typeof CompressionStream === 'undefined') { alert(i18n.get('alert_export_failed_apis')); return; }
        const origAria = exportButton.getAttribute('aria-label');
        exportButton.disabled = true; exportButton.setAttribute('aria-label', i18n.get('aria_exporting_novels'));
        try {
            const exportMeta = JSON.parse(JSON.stringify(novelsMetadata));
            const exportObj = { version: 2, metadata: exportMeta, chapters: {} };
            let chReadErrors = 0;
            for (const novel of exportObj.metadata) {
                 exportObj.chapters[novel.id] = {};
                 for (let i = 0; i < (novel.chapters?.length || 0); i++) {
                    try {
                        const content = await readChapterContent(novel.id, i);
                        if (content.startsWith(i18n.get('text_error_prefix'))) throw new Error(content.substring(i18n.get('text_error_prefix').length + 1));
                        exportObj.chapters[novel.id][i] = content;
                    } catch (readErr) { exportObj.chapters[novel.id][i] = `###EXPORT_READ_ERROR### ${readErr.message}`; chReadErrors++; }
                }
            }
            if (chReadErrors > 0) alert(i18n.get('alert_export_chapter_read_warning', { count: chReadErrors }));
            const jsonStr = JSON.stringify(exportObj);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(compressedStream).blob();
            const url = URL.createObjectURL(compressedBlob); const a = doc.createElement('a'); a.href = url;
            a.download = `novels_backup_${new Date().toISOString().replace(/[:T.-]/g, '').slice(0,14)}.novelarchive.gz`;
            doc.body.appendChild(a); a.click(); doc.body.removeChild(a); URL.revokeObjectURL(url);
            alert(i18n.get('alert_export_complete'));
        } catch (error) { alert(i18n.get('alert_export_failed', { errorMessage: error.message }));
        } finally {
            exportButton.disabled = novelsMetadata.length === 0;
            exportButton.setAttribute('aria-label', origAria || i18n.get('aria_export_all'));
        }
    }

    function triggerImport() {
        if (!opfsRoot || typeof DecompressionStream === 'undefined') { alert(i18n.get('alert_import_failed_apis')); return; }
        if (novelsMetadata.length > 0 && !confirm(i18n.get('alert_confirm_import_overwrite'))) return;
        importFileInput.click();
    }

    async function importData(file) {
        if (!file || !file.name.endsWith('.novelarchive.gz')) { alert(i18n.get('alert_invalid_import_file')); importFileInput.value = ''; return; }
        if (!opfsRoot) { alert(i18n.get('alert_import_failed_storage_not_ready')); importFileInput.value = ''; return; }
        const origAria = importButton.getAttribute('aria-label');
        importButton.disabled = true; importFileInput.disabled = true;
        importButton.setAttribute('aria-label', i18n.get('aria_importing_backup'));
        let prevSettingsBackup = null;
        try {
            prevSettingsBackup = { theme:localStorage.getItem(THEME_KEY), font:localStorage.getItem(FONT_KEY), fontSize:localStorage.getItem(FONT_SIZE_KEY), lineSpacing:localStorage.getItem(LINE_SPACING_KEY), language:localStorage.getItem(LANG_KEY) };
            let opfsClearFailed = false; const entries = [];
            for await (const entry of opfsRoot.values()) if (entry.kind === 'directory' || entry.name === METADATA_OPFS_FILENAME) entries.push({name:entry.name, kind:entry.kind});
            for(const entry of entries) await opfsRoot.removeEntry(entry.name, { recursive: entry.kind === 'directory' }).catch(() => opfsClearFailed = true);
            if(opfsClearFailed) console.warn(i18n.get('warning_import_opfs_clear_incomplete'));
            novelsMetadata = [];
            const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
            const importObj = JSON.parse(await new Response(decompressedStream).text());
            if (!importObj?.metadata || !importObj.chapters) throw new Error(i18n.get('alert_invalid_backup_format'));
            if (importObj.version !== 2 && importObj.version !== 1) console.warn(i18n.get('warning_importing_incompatible_version', { version: importObj.version }));
            let importedNovelsCount = 0; let chapterSaveErrors = 0; const nowISO = new Date().toISOString();
            novelsMetadata = importObj.metadata.map(n => ({
                id: n.id||crypto.randomUUID(), title:n.title||i18n.get('text_untitled_novel'), author:n.author||'', genre:n.genre||'', description:n.description||'',
                chapters:(n.chapters||[]).map((ch,idx)=>({title:ch.title||i18n.get('text_chapter_placeholder',{index:idx+1}), opfsFileName:ch.opfsFileName||'', lastModified:ch.lastModified||nowISO})),
                lastReadChapterIndex:n.lastReadChapterIndex??-1, lastReadScrollTop:n.lastReadScrollTop??0
            }));
            await saveNovelsMetadata();
            for (const novel of novelsMetadata) {
                const chapterData = importObj.chapters[novel.id]; if (!chapterData) continue;
                for (let i = 0; i < novel.chapters.length; i++) {
                    const content = chapterData[i]; let contentToSave = ''; let skip = false;
                    if (typeof content === 'string') {
                        if (content.startsWith('###EXPORT_READ_ERROR###')) { console.warn(i18n.get('warning_import_skipped_export_error',{novelId:novel.id, chapterIndex:i})); skip=true; }
                        else contentToSave = content;
                    } else console.warn(i18n.get('warning_import_missing_content',{novelId:novel.id,chapterIndex:i}));
                    if (!skip) try { await saveChapterContent(novel.id, i, contentToSave); } catch (err) { chapterSaveErrors++; console.error(`Err saving ch ${i} for novel ${novel.id}:`,err);}
                }
                importedNovelsCount++;
            }
            await saveNovelsMetadata();
            loadSettings(); i18n.translatePage(); renderNovelList(); await showPage('home-page');
            let successMsg = i18n.get('alert_import_success', { count: importedNovelsCount });
            if (chapterSaveErrors > 0) successMsg += `\n\n${i18n.get('alert_import_warning_chapter_errors', { count: chapterSaveErrors })}`;
            alert(successMsg);
        } catch (error) {
            alert(i18n.get('alert_import_failed', { errorMessage: error.message }));
            if (prevSettingsBackup) {
                try {
                    Object.keys(prevSettingsBackup).forEach(k => { if (prevSettingsBackup[k]) localStorage.setItem(k, prevSettingsBackup[k]); else localStorage.removeItem(k); });
                    i18n.init(prevSettingsBackup.language); loadSettings();
                    if(opfsRoot) {
                        for await (const entry of opfsRoot.values()) if (entry.kind === 'directory' || entry.name === METADATA_OPFS_FILENAME) {
                            await opfsRoot.removeEntry(entry.name, { recursive: entry.kind === 'directory' }).catch(console.warn);
                        }
                    }
                    await loadNovelsMetadata();
                    i18n.translatePage(); renderNovelList(); await showPage('home-page');
                    alert(i18n.get('alert_rollback_incomplete'));
                } catch (rbErr) { alert(i18n.get('alert_rollback_failed')); }
            } else alert(i18n.get('alert_rollback_failed_no_backup'));
        } finally {
            importButton.disabled = false;
            importFileInput.disabled = false; importFileInput.value = '';
            importButton.setAttribute('aria-label', origAria || i18n.get('aria_import_archive'));
        }
    }

    function sanitizeFilename(name) {
        if (typeof name !== 'string') name = String(name);
        let sane = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').replace(/\s+/g, '_').trim();
        if (sane.length > 100) sane = sane.substring(0, 100); return sane || 'Untitled';
    }

    async function downloadChapter(novelId, chIdx) {
        const ch = findChapter(novelId, chIdx); const novel = findNovel(novelId);
        if (!ch || !novel) { alert(i18n.get('alert_download_failed_missing_metadata')); throw new Error("Meta missing"); }
        const opfsFile = ch.opfsFileName || `ch_${String(chIdx).padStart(5, '0')}.txt`;
        if (!opfsFile) { alert(i18n.get('alert_download_failed_missing_metadata')); throw new Error("Ch file info missing"); }
        const safeOpfsFile = sanitizeFilename(opfsFile);
        const chTitle = ch.title || i18n.get('text_chapter_placeholder', { index: chIdx + 1 });
        const novelTitle = novel.title || i18n.get('text_untitled_novel');
        const dlName = `${sanitizeFilename(novelTitle)} - Ch ${String(chIdx+1).padStart(3,'0')} - ${sanitizeFilename(chTitle)}.txt`;
        if (!opfsRoot) { alert(i18n.get('alert_download_failed_storage_unavailable')); throw new Error("OPFS unavailable"); }
        try {
             const novelDir = await getNovelDir(novelId, false);
             const fileHandle = await novelDir.getFileHandle(safeOpfsFile);
             const file = await fileHandle.getFile();
             const url = URL.createObjectURL(file); const a = doc.createElement('a'); a.href=url; a.download=dlName;
             doc.body.appendChild(a); a.click(); doc.body.removeChild(a); URL.revokeObjectURL(url);
        } catch (error) {
             const titleAlert = ch.title || i18n.get('text_chapter_placeholder', { index: chIdx + 1 });
             const errKey = error.name === 'NotFoundError' ? 'alert_download_failed_file_not_found' : 'alert_download_failed_general';
             alert(i18n.get(errKey, { title: titleAlert, fileName: safeOpfsFile, errorMessage: error.message })); throw error;
        }
    }

    async function downloadAllChaptersCombined(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) { alert(i18n.get('alert_no_chapters_to_download')); return; }
        if (!opfsRoot) { alert(i18n.get('alert_download_failed_storage_unavailable')); return; }
        const totalChaps = novel.chapters.length; const novelTitle = novel.title || i18n.get('text_untitled_novel');
        const origBtnText = bulkDownloadBtn.textContent;
        bulkDownloadBtn.disabled = true; bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        bulkDownloadBtn.setAttribute('aria-live', 'polite'); bulkDownloadBtn.textContent = i18n.get('bulk_download_preparing');
        let combined = `${i18n.get('form_title')}: ${novelTitle}\n`;
        if (novel.author) combined += `${i18n.get('form_author')}: ${novel.author}\n`;
        combined += `${i18n.get('details_chapters')}: ${totalChaps}\n========================================\n\n`;
        let succCount = 0, errCount = 0;
        for (let i = 0; i < totalChaps; i++) {
            bulkDownloadBtn.textContent = i18n.get('bulk_download_reading', { current: i + 1, total: totalChaps });
            const ch = novel.chapters[i];
            const chTitle = ch.title || i18n.get('text_chapter_placeholder', { index: i + 1 });
            combined += `## ${chTitle} (${i18n.get('text_chapter_placeholder', { index: i + 1 })})\n\n`;
            try {
                const content = await readChapterContent(novelId, i);
                if (content.startsWith(i18n.get('text_error_prefix'))) throw new Error(content.substring(i18n.get('text_error_prefix').length + 1));
                combined += `${content}\n\n`; succCount++;
            } catch (e) { combined += `### ${i18n.get('text_error_prefix')} ${i18n.get('text_error_reading_file',{errorMessage: e.message})} ###\n\n`; errCount++; }
            combined += "---\n\n";
        }
        bulkDownloadBtn.textContent = i18n.get('bulk_download_saving');
        try {
            const blob = new Blob([combined],{type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob);
            const a = doc.createElement('a'); a.href = url; a.download = `${sanitizeFilename(novelTitle)} - All Chapters.txt`;
            doc.body.appendChild(a); a.click(); doc.body.removeChild(a); URL.revokeObjectURL(url);
            const finalMsgKey = errCount > 0 ? 'bulk_download_finished_with_errors' : 'bulk_download_finished';
            alert(i18n.get(finalMsgKey, {title:novelTitle, successCount:succCount, errorCount:errCount}));
        } catch (saveErr) { alert(i18n.get('bulk_download_save_failed', { errorMessage: saveErr.message }));
        } finally {
            bulkDownloadBtn.textContent = origBtnText; bulkDownloadBtn.disabled = !novel?.chapters?.length;
            bulkDownloadBtn.setAttribute('aria-disabled', String(!novel?.chapters?.length)); bulkDownloadBtn.removeAttribute('aria-live');
        }
    }

    function toggleFullScreen() {
        if (!doc.fullscreenEnabled) { console.warn("Fullscreen API not enabled."); return; }
        if (!doc.fullscreenElement) doc.documentElement.requestFullscreen().catch(err => alert(i18n.get('alert_fullscreen_error',{errorMessage:err.message, errorName:err.name})));
        else if (doc.exitFullscreen) doc.exitFullscreen();
    }
    function updateFullscreenButtonAriaLabel() {
         readerFullscreenBtn.setAttribute('aria-label', i18n.get(doc.fullscreenElement ? 'aria_exit_fullscreen' : 'aria_enter_fullscreen'));
    }
    function updateFullscreenButtonVisual() {
        readerFullscreenBtn.textContent = doc.fullscreenElement ? '↙️' : '⛶';
        updateFullscreenButtonAriaLabel();
    }

    function setupEventListeners() {
        doc.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page')));
        doc.getElementById('settings-btn')?.addEventListener('click', () => showPage('settings-page'));
        themeToggleBtn?.addEventListener('click', () => applyTheme(doc.body.classList.contains('dark-mode') ? 'light' : 'dark'));
        languageSelect?.addEventListener('change', (e) => i18n.setLanguage(e.target.value));
        doc.getElementById('add-novel-btn')?.addEventListener('click', () => openNovelModal());
        importButton?.addEventListener('click', triggerImport);
        importFileInput?.addEventListener('change', (e) => { if (e.target.files?.length) importData(e.target.files[0]); });
        exportButton?.addEventListener('click', exportAllData);
        const debouncedRenderNovels = debounce(renderNovelList, SEARCH_DEBOUNCE_DELAY);
        novelSearchInput?.addEventListener('input', (e) => debouncedRenderNovels(e.target.value));
        deleteAllDataBtn?.addEventListener('click', deleteAllData);
        doc.getElementById('edit-novel-btn')?.addEventListener('click', () => { if (currentNovelId) openNovelModal(currentNovelId); });
        doc.getElementById('delete-novel-btn')?.addEventListener('click', async () => {
            if (!currentNovelId) return; const novel = findNovel(currentNovelId);
            const title = novel?.title || i18n.get('text_untitled_novel');
            if (novel && confirm(i18n.get('alert_confirm_delete_novel_body', { title }))) {
                 try {
                    await deleteNovelData(currentNovelId); currentNovelId = null;
                    renderNovelList(); await showPage('home-page');
                    alert(i18n.get('alert_delete_novel_success', { title }));
                 } catch (error) { alert(i18n.get('alert_error_deleting_novel', { title })); }
            }
        });
        doc.getElementById('add-chapter-btn')?.addEventListener('click', () => { if (currentNovelId) openChapterModal(currentNovelId); });
        bulkDownloadBtn?.addEventListener('click', () => { if (currentNovelId) downloadAllChaptersCombined(currentNovelId); });
        const debouncedRenderChapters = debounce((id, filter) => { if (currentNovelId === id) renderChapterList(id, filter); }, SEARCH_DEBOUNCE_DELAY);
        chapterSearchInput?.addEventListener('input', (e) => { if (currentNovelId) debouncedRenderChapters(currentNovelId, e.target.value); });
        doc.getElementById('save-novel-modal-btn')?.addEventListener('click', saveNovelFromModal);
        doc.getElementById('cancel-novel-modal-btn')?.addEventListener('click', closeNovelModal);
        novelModal?.addEventListener('click', (e) => { if (e.target === novelModal) closeNovelModal(); });
        doc.getElementById('save-chapter-modal-btn')?.addEventListener('click', saveChapterFromModal);
        doc.getElementById('cancel-chapter-modal-btn')?.addEventListener('click', closeChapterModal);
        chapterModal?.addEventListener('click', (e) => { if (e.target === chapterModal) closeChapterModal(); });
        chapterModalTitleInput?.addEventListener('keydown', (e) => { if (e.key==='Enter'&&!e.shiftKey&&chapterModalContentInput) { e.preventDefault(); chapterModalContentInput.focus();}});
        doc.getElementById('close-reader-settings-modal-btn')?.addEventListener('click', closeReaderSettingsModal);
        readerSettingsModal?.addEventListener('click', (e) => { if (e.target === readerSettingsModal) closeReaderSettingsModal(); });
        doc.getElementById('reader-settings-btn')?.addEventListener('click', openReaderSettingsModal);
        readerFullscreenBtn?.addEventListener('click', toggleFullScreen);
        doc.addEventListener('fullscreenchange', updateFullscreenButtonVisual);
        prevChapterBtn?.addEventListener('click', async () => {
            await saveReaderPosition();
            if (currentNovelId && currentChapterIndex > 0) await loadReaderPage(currentNovelId, currentChapterIndex - 1);
        });
        nextChapterBtn?.addEventListener('click', async () => {
            await saveReaderPosition(); const novel = findNovel(currentNovelId);
            if (novel && currentChapterIndex < novel.chapters.length - 1) await loadReaderPage(currentNovelId, currentChapterIndex + 1);
        });
        fontSelect?.addEventListener('change', (e) => applyReaderStyles(e.target.value, fontSizeSelect.value, lineHeightSlider.value));
        fontSizeSelect?.addEventListener('change', (e) => applyReaderStyles(fontSelect.value, e.target.value, lineHeightSlider.value));
        lineHeightSlider?.addEventListener('input', (e) => applyReaderStyles(fontSelect.value, fontSizeSelect.value, e.target.value));
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (doc.fullscreenElement) doc.exitFullscreen().catch(console.warn);
                else if (readerSettingsModal?.style.display !== 'none') closeReaderSettingsModal();
                else if (chapterModal?.style.display !== 'none') closeChapterModal();
                else if (novelModal?.style.display !== 'none') closeNovelModal();
            }
        });
        window.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'hidden') saveReaderPosition(); });
        window.addEventListener('pagehide', () => saveReaderPosition());
    }

    initializeApp();
});