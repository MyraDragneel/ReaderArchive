'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /**
     * @constant {object} ALL_TRANSLATIONS - Contains all language strings for the application.
     */
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
            placeholder_no_novels: "No novels yet. Use the ＋ button to add one!",
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
            btn_delete_all_data: "Delete All App Data",
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
            btn_add_chapter: "Add Chapter",
            btn_download_all_chapters: "Download All (.txt)",
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
            btn_previous: "Previous",
            btn_next: "Next",
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
            text_error_loading_chapter_modal_content: "Could not load existing content.\n{errorDetails}\n\nAnda masih dapat mengedit judul atau memasukkan konten baru di bawah dan menyimpan.",
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
            alert_export_cover_read_warning: "Warning: Could not read the cover image for \"{title}\". It will not be included in the backup.",
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
            text_error_prefix: "Error:",
            btn_back: "Back",
            form_sort_by: "Sort by:",
            aria_sort_chapters: "Sort chapters",
            sort_asc: "Oldest First",
            sort_desc: "Newest First",
            text_word_count: "{count} words",
            text_word_count_na: "N/A",
            aria_add_cover: "Add cover image",
            aria_remove_cover: "Remove cover image",
            text_card_chapters: "{count} Chapters"
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
            placeholder_no_novels: "Belum ada novel. Gunakan tombol ＋ untuk menambah!",
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
            btn_delete_all_data: "Hapus Semua Data Aplikasi",
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
            btn_add_chapter: "Tambah Bab",
            btn_download_all_chapters: "Unduh Semua (.txt)",
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
            btn_previous: "Sebelumnya",
            btn_next: "Berikutnya",
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
            alert_export_cover_read_warning: "Peringatan: Gagal membaca gambar sampul untuk \"{title}\". Sampul tidak akan disertakan dalam cadangan.",
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
            text_error_prefix: "Kesalahan:",
            btn_back: "Kembali",
            form_sort_by: "Urutkan berdasarkan:",
            aria_sort_chapters: "Urutkan bab",
            sort_asc: "Terlama Dahulu",
            sort_desc: "Terbaru Dahulu",
            text_word_count: "{count} kata",
            text_word_count_na: "T/A",
            aria_add_cover: "Tambah gambar sampul",
            aria_remove_cover: "Hapus gambar sampul",
            text_card_chapters: "{count} Bab"
        }
    };

    /**
     * @constant {string} METADATA_OPFS_FILENAME - Filename for the main metadata file in OPFS.
     * @constant {string} THEME_KEY - localStorage key for the theme setting.
     * @constant {string} FONT_KEY - localStorage key for the font family setting.
     * @constant {string} FONT_SIZE_KEY - localStorage key for the font size setting.
     * @constant {string} LINE_SPACING_KEY - localStorage key for the line spacing setting.
     * @constant {string} LANG_KEY - localStorage key for the language setting.
     * @constant {number} MODAL_ANIMATION_DURATION - Duration for modal animations in ms.
     * @constant {number} SEARCH_DEBOUNCE_DELAY - Delay for search input debouncing in ms.
     */
    const METADATA_OPFS_FILENAME = 'novelsMetadata.json';
    const THEME_KEY = 'novelReaderTheme_v2';
    const FONT_KEY = 'novelReaderFont_v2';
    const FONT_SIZE_KEY = 'novelReaderFontSize_v2';
    const LINE_SPACING_KEY = 'novelReaderLineSpacing_v2';
    const LANG_KEY = 'novelReaderLanguage_v2';
    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT = 'Inter, Arial, sans-serif';
    const DEFAULT_FONT_SIZE = '16';
    const DEFAULT_LINE_SPACING = '1.6';
    const DEFAULT_LANG = 'en';
    const MODAL_ANIMATION_DURATION = 200;
    const SEARCH_DEBOUNCE_DELAY = 250;

    /**
     * @type {string|null} currentNovelId - The ID of the currently viewed novel.
     * @type {number} currentChapterIndex - The index of the currently read chapter.
     * @type {string} chapterSortOrder - The current sort order for chapters ('asc' or 'desc').
     * @type {Array<object>} novelsMetadata - In-memory array of all novel metadata.
     * @type {FileSystemDirectoryHandle|null} opfsRoot - The root handle for the Origin Private File System.
     * @type {string|null} newCoverData - Holds base64 data for a new cover image before saving.
     * @type {string} coverAction - Tracks the pending action for a cover image ('none', 'update', 'delete').
     */
    let currentNovelId = null;
    let currentChapterIndex = -1;
    let chapterSortOrder = 'asc';
    let novelsMetadata = [];
    let opfsRoot = null;
    let newCoverData = null;
    let coverAction = 'none';

    /**
     * @constant {object} DOM - A collection of frequently accessed DOM elements.
     */
    const doc = document;
    const DOM = {
        appTitleEl: doc.querySelector('title[data-i18n-key="app_title"]'),
        pages: doc.querySelectorAll('.page'),
        homePage: doc.getElementById('home-page'),
        novelInfoPage: doc.getElementById('novel-info-page'),
        readerPage: doc.getElementById('reader-page'),
        themeToggleBtn: doc.getElementById('theme-toggle-btn'),
        moreActionsBtn: doc.getElementById('more-actions-btn'),
        headerMenu: doc.getElementById('header-menu'),
        languageSelect: doc.getElementById('language-select'),
        novelListEl: doc.getElementById('novel-list'),
        novelSearchInput: doc.getElementById('novel-search'),
        importFileInput: doc.getElementById('import-file-input'),
        exportButton: doc.getElementById('export-btn'),
        importButton: doc.getElementById('import-btn'),
        deleteAllDataBtn: doc.getElementById('delete-all-data-btn'),
        novelInfoTitleMainEl: doc.getElementById('novel-info-title-main'),
        novelInfoAuthorEl: doc.getElementById('novel-info-author'),
        novelInfoGenreEl: doc.getElementById('novel-info-genre'),
        novelInfoDescriptionEl: doc.getElementById('novel-info-description'),
        novelInfoLastReadEl: doc.getElementById('novel-info-last-read'),
        chapterListEl: doc.getElementById('chapter-list'),
        chapterSearchInput: doc.getElementById('chapter-search'),
        chapterSortSelect: doc.getElementById('chapter-sort-select'),
        bulkDownloadBtn: doc.getElementById('bulk-download-chapters-btn'),
        readerMainContent: doc.getElementById('reader-main-content'),
        readerContentEl: doc.getElementById('reader-content'),
        readerChapterTitleEl: doc.getElementById('reader-chapter-title'),
        readerWordCountEl: doc.getElementById('reader-word-count'),
        prevChapterBtn: doc.getElementById('prev-chapter-btn'),
        nextChapterBtn: doc.getElementById('next-chapter-btn'),
        readerFullscreenBtn: doc.getElementById('reader-fullscreen-btn'),
        novelModal: doc.getElementById('novel-modal'),
        novelModalTitleHeading: doc.getElementById('novel-modal-title-heading'),
        novelModalIdInput: doc.getElementById('novel-modal-id'),
        novelModalTitleInput: doc.getElementById('novel-modal-title-input'),
        novelModalAuthorInput: doc.getElementById('novel-modal-author-input'),
        novelModalGenreInput: doc.getElementById('novel-modal-genre-input'),
        novelModalDescriptionInput: doc.getElementById('novel-modal-description-input'),
        chapterModal: doc.getElementById('chapter-modal'),
        chapterModalTitleHeading: doc.getElementById('chapter-modal-title-heading'),
        chapterModalNovelIdInput: doc.getElementById('chapter-modal-novel-id'),
        chapterModalIndexInput: doc.getElementById('chapter-modal-index'),
        chapterModalTitleInput: doc.getElementById('chapter-modal-title-input'),
        chapterModalContentInput: doc.getElementById('chapter-modal-content-input'),
        readerSettingsModal: doc.getElementById('reader-settings-modal'),
        fontSelect: doc.getElementById('font-select'),
        fontSizeSlider: doc.getElementById('font-size-slider'),
        fontSizeValueSpan: doc.getElementById('font-size-value'),
        lineHeightSlider: doc.getElementById('line-height-slider'),
        lineHeightValueSpan: doc.getElementById('line-height-value'),
        coverFileInput: doc.getElementById('cover-file-input'),
        modalAddCoverBtn: doc.getElementById('modal-add-cover-btn'),
        modalRemoveCoverBtn: doc.getElementById('modal-remove-cover-btn'),
        novelModalCoverPreview: doc.getElementById('novel-modal-cover-preview'),
        novelModalCoverPreviewWrapper: doc.querySelector('.modal-cover-preview-wrapper'),
        novelInfoCoverContainer: doc.getElementById('novel-info-cover-container'),
        novelInfoCoverImg: doc.getElementById('novel-info-cover-img'),
        processingModal: doc.getElementById('processing-modal'),
        processingModalText: doc.getElementById('processing-modal-text'),
        novelInfoPageLoader: null,
        novelInfoPageContent: null,
        readerPageLoader: null,
        readerPageContent: null,
    };
    DOM.novelInfoPageLoader = DOM.novelInfoPage.querySelector('.page-loader');
    DOM.novelInfoPageContent = DOM.novelInfoPage.querySelector('.page-content-wrapper');
    DOM.readerPageLoader = DOM.readerPage.querySelector('.page-loader');
    DOM.readerPageContent = DOM.readerPage.querySelector('.page-content-wrapper');

    /**
     * Handles internationalization (i18n) for the application.
     */
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
            const { i18nKey, i18nPlaceholder, i18nAriaLabel } = element.dataset;
            // Special case for theme button which has dynamic text and must be updated
            if (element.id === 'theme-toggle-btn') {
            updateThemeToggleButtonText();
                return;
            }
            if (i18nKey) element.textContent = this.get(i18nKey);
            if (i18nPlaceholder) element.placeholder = this.get(i18nPlaceholder);
            if (i18nAriaLabel) element.setAttribute('aria-label', this.get(i18nAriaLabel));
        }
        translatePage(rootElement = doc.body) {
            DOM.appTitleEl.textContent = this.get('app_title');
            rootElement.querySelectorAll('[data-i18n-key], [data-i18n-placeholder], [data-i18n-aria-label]')
                .forEach(el => this.translateElement(el));
            
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

    /**
     * Creates a debounced function that delays invoking `func` until after `delay` milliseconds.
     * @param {Function} func The function to debounce.
     * @param {number} delay The number of milliseconds to delay.
     * @returns {Function} The new debounced function.
     */
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(this, args); }, delay);
        };
    }

    /**
     * Automatically adjusts the height of a textarea to fit its content.
     * @param {HTMLTextAreaElement} textarea The textarea element to resize.
     */
    function autoResizeTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function handleTextareaInput(event) {
        autoResizeTextarea(event.target);
    }

    /**
     * Main application initialization function.
     * Sets up service worker, OPFS, settings, and event listeners.
     */
    async function initializeApp() {
        registerServiceWorker();
        if (!await initOPFS()) alert(i18n.get('alert_opfs_unavailable'));
        i18n.init();
        i18n.onLanguageChange(() => {
            if (DOM.homePage.classList.contains('active')) renderNovelList(DOM.novelSearchInput.value);
            if (DOM.novelInfoPage.classList.contains('active') && currentNovelId) loadNovelInfoPage(currentNovelId);
        });
        loadSettings();
        await loadNovelsMetadata();
        renderNovelList();
        setupEventListeners();
        showPage('home-page');
    }

    /**
     * Registers the service worker for PWA functionality.
     */
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }

    /**
     * Initializes the Origin Private File System (OPFS) root directory handle.
     * @returns {Promise<boolean>} True if OPFS is available and initialized, false otherwise.
     */
    async function initOPFS() {
        try {
            if (navigator.storage?.getDirectory) {
                opfsRoot = await navigator.storage.getDirectory();
                return true;
            }
        } catch (error) {
            console.error('OPFS Initialization Error:', error);
        }
        opfsRoot = null;
        return false;
    }

    /**
     * Saves the reader's current chapter and scroll position.
     */
    async function saveReaderPosition() {
        if (!DOM.readerPage.classList.contains('active') || !currentNovelId || currentChapterIndex < 0) return;
        const novel = findNovel(currentNovelId);
        if (!novel) return;
        novel.lastReadChapterIndex = currentChapterIndex;
        novel.lastReadScrollTop = Math.round(DOM.readerMainContent.scrollTop);
        await saveNovelsMetadata();
    }

    /**
     * Switches the visible page in the application.
     * @param {string} pageId The ID of the page to show.
     */
    async function showPage(pageId) {
        if (doc.fullscreenElement && DOM.readerPage.classList.contains('active') && pageId !== 'reader-page') {
            if (doc.exitFullscreen) doc.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
        }
        if (DOM.readerPage.classList.contains('active') && pageId !== 'reader-page') await saveReaderPosition();

        let activePageEl = null;
        DOM.pages.forEach(p => {
            const isActive = p.id === pageId;
            p.classList.toggle('active', isActive);
            if (isActive) activePageEl = p;
        });

        const contentArea = activePageEl?.querySelector('.app-main');
        if (contentArea) contentArea.scrollTop = 0;
        else if (activePageEl) activePageEl.scrollTop = 0;

        if (pageId !== 'home-page' && DOM.novelSearchInput) DOM.novelSearchInput.value = '';
        if (pageId !== 'novel-info-page' && DOM.chapterSearchInput) DOM.chapterSearchInput.value = '';
        
        // Trigger content loading for pages that require it
        if (pageId === 'home-page') {
            renderNovelList();
        } else if (pageId === 'novel-info-page' && currentNovelId) {
            loadNovelInfoPage(currentNovelId);
        } else if (pageId === 'reader-page' && currentNovelId !== null && currentChapterIndex !== -1) {
            loadReaderPage(currentNovelId, currentChapterIndex);
        }
    }

    /**
     * Loads all user settings from localStorage and applies them.
     */
    function loadSettings() {
        const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        const font = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        const fontSize = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        const lineSpacing = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;
        applyTheme(theme, false);
        applyReaderStyles(font, fontSize, lineSpacing, false);
        DOM.fontSelect.value = font;
        DOM.fontSizeSlider.value = fontSize;
        DOM.lineHeightSlider.value = lineSpacing;
        DOM.fontSizeValueSpan.textContent = fontSize;
        DOM.lineHeightValueSpan.textContent = lineSpacing;
    }

    function saveSetting(key, value) {
        try { localStorage.setItem(key, value); }
        catch (error) { alert(i18n.get('alert_error_saving_setting', { key })); }
    }

    /**
     * Updates the theme toggle button's text and icon based on the current theme.
     */
    function updateThemeToggleButtonText() {
        const isDark = doc.body.classList.contains('dark-mode');
        const emoji = isDark ? '☀️' : '🌙';
        const textKey = isDark ? 'theme_switch_light' : 'theme_switch_dark';
        DOM.themeToggleBtn.innerHTML = `${emoji} <span>${i18n.get(textKey)}</span>`;
    }

    /**
     * Applies the selected theme (light/dark) to the application.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     * @param {boolean} [save=true] - Whether to save the setting to localStorage.
     */
    function applyTheme(theme, save = true) {
        doc.body.classList.toggle('dark-mode', theme === 'dark');
        updateThemeToggleButtonText();
        const metaLight = doc.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const metaDark = doc.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        if (metaLight) metaLight.content = getComputedStyle(doc.documentElement).getPropertyValue(theme === 'dark' ? '--bg-primary-dark' : '--bg-primary-light').trim();
        if (metaDark) metaDark.content = getComputedStyle(doc.documentElement).getPropertyValue(theme === 'dark' ? '--bg-primary-dark' : '--bg-primary-light').trim();
        if (save) saveSetting(THEME_KEY, theme);
    }

    function applyReaderStyles(font, size, lineHeight, save = true) {
        const rootStyle = doc.documentElement.style;
        rootStyle.setProperty('--font-family-reader', font);
        rootStyle.setProperty('--font-size-reader', `${size}px`);
        rootStyle.setProperty('--line-height-reader', lineHeight);
        DOM.fontSizeValueSpan.textContent = size;
        DOM.lineHeightValueSpan.textContent = lineHeight;
        if (save) {
            saveSetting(FONT_KEY, font);
            saveSetting(FONT_SIZE_KEY, size);
            saveSetting(LINE_SPACING_KEY, lineHeight);
        }
    }

    function populateLanguageSelector() {
        DOM.languageSelect.innerHTML = '';
        i18n.getAvailableLanguages().forEach(lang => {
            const opt = doc.createElement('option');
            opt.value = lang.code; opt.textContent = lang.name; DOM.languageSelect.appendChild(opt);
        });
        DOM.languageSelect.value = i18n.currentLang;
    }

    /**
     * Loads the novels metadata array from the OPFS file.
     */
    async function loadNovelsMetadata() {
        novelsMetadata = [];
        if (!opfsRoot) { return; }
        try {
            const fileHandle = await opfsRoot.getFileHandle(METADATA_OPFS_FILENAME, { create: false });
            const text = await (await fileHandle.getFile()).text();
            if (text) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    novelsMetadata = parsed.map(n => ({
                        id: n.id ?? crypto.randomUUID(), title: n.title ?? i18n.get('text_untitled_novel'),
                        author: n.author ?? '', genre: n.genre ?? '', description: n.description ?? '',
                        chapters: Array.isArray(n.chapters) ? n.chapters.map((ch, idx) => ({
                            title: ch.title ?? i18n.get('text_chapter_placeholder', { index: idx + 1 }),
                            opfsFileName: ch.opfsFileName ?? '', lastModified: ch.lastModified ?? null,
                            wordCount: ch.wordCount ?? undefined
                        })) : [],
                        coverImageFileName: n.coverImageFileName ?? null,
                        lastReadChapterIndex: n.lastReadChapterIndex ?? -1,
                        lastReadScrollTop: n.lastReadScrollTop ?? 0
                    }));
                }
            }
        } catch (error) {
            if (error.name !== 'NotFoundError') { alert(i18n.get('alert_error_reading_metadata_opfs')); }
        }
        novelsMetadata.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', i18n.currentLang, { sensitivity: 'base' }));
    }

    /**
     * Saves the current `novelsMetadata` array to the OPFS file.
     */
    async function saveNovelsMetadata() {
        if (!opfsRoot) { alert(i18n.get('alert_error_saving_metadata_opfs')); return; }
        try {
            novelsMetadata.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', i18n.currentLang, { sensitivity: 'base' }));
            const jsonString = JSON.stringify(novelsMetadata);
            const fileHandle = await opfsRoot.getFileHandle(METADATA_OPFS_FILENAME, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();
        } catch (error) {
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
            const errKey = error.name === 'NotFoundError' ? 'text_error_file_not_found' : 'text_error_reading_file';
            return `${i18n.get('text_error_prefix')} ${i18n.get(errKey, { fileName: safeFileName, errorMessage: error.message })}`;
        }
    }

    async function deleteChapterFile(novelId, chapterIndex) {
        if (!opfsRoot) { return false; }
        const chapter = findChapter(novelId, chapterIndex);
        if (!chapter || !chapter.opfsFileName) return true;
        const safeFileName = sanitizeFilename(chapter.opfsFileName);
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(safeFileName);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') return true;
            return false;
        }
    }

    async function saveCoverImage(novelId, base64Data) {
        if (!opfsRoot) throw new Error("OPFS not ready.");
        const fileName = 'cover.txt';
        try {
            const novelDirHandle = await getNovelDir(novelId, true);
            const fileHandle = await novelDirHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(base64Data);
            await writable.close();
            return fileName;
        } catch (error) {
            throw new Error(`Failed to save cover image: ${error.message}`);
        }
    }

    async function readCoverImage(novelId, fileName) {
        if (!opfsRoot || !fileName) return null;
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            const fileHandle = await novelDirHandle.getFileHandle(fileName);
            return (await fileHandle.getFile()).text();
        } catch (error) {
            console.error(`Error reading cover image ${fileName}:`, error);
            return null;
        }
    }

    async function deleteCoverImage(novelId, fileName) {
        if (!opfsRoot || !fileName) return true;
        try {
            const novelDirHandle = await getNovelDir(novelId, false);
            await novelDirHandle.removeEntry(fileName);
            return true;
        } catch (error) {
            if (error.name === 'NotFoundError') return true;
            console.error(`Failed to delete cover image ${fileName}:`, error);
            return false;
        }
    }

    async function deleteNovelData(novelId) {
        const novel = findNovel(novelId);
        if (!novel) return;
        if (opfsRoot) {
            try { await getNovelDir(novelId).then(dir => dir.remove({recursive: true})); }
            catch (error) {
                if (error.name !== 'NotFoundError') alert(i18n.get('alert_error_deleting_opfs_dir', { title: novel.title ?? i18n.get('text_untitled_novel') }));
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
            DOM.fontSelect.value = DEFAULT_FONT;
            DOM.fontSizeSlider.value = DEFAULT_FONT_SIZE;
            DOM.lineHeightSlider.value = DEFAULT_LINE_SPACING;
            DOM.fontSizeValueSpan.textContent = DEFAULT_FONT_SIZE;
            DOM.lineHeightValueSpan.textContent = DEFAULT_LINE_SPACING;
        }
        renderNovelList(); await showPage('home-page');
        if (settingsCleared && opfsCompletelyCleared) alert(i18n.get('alert_delete_all_success'));
    }

    /**
     * Renders the list of novels on the home page, filtering by a search term.
     * @param {string} [filterTerm=''] - The term to filter novels by.
     */
    function renderNovelList(filterTerm = '') {
        DOM.novelListEl.innerHTML = '';
        const lowerFilter = filterTerm.toLowerCase().trim();
        const filtered = novelsMetadata.filter(n => !lowerFilter ||
            (n.title ?? '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter) ||
            (n.author ?? '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter)
        );
        const noNovels = novelsMetadata.length === 0;
        DOM.exportButton.disabled = noNovels;

        if (filtered.length === 0) {
            const li = doc.createElement('li');
            li.className = 'list-placeholder';
            li.textContent = i18n.get(noNovels ? 'placeholder_no_novels' : 'placeholder_no_matching_novels', { searchTerm: filterTerm });
            DOM.novelListEl.appendChild(li);
            return;
        }

        const frag = doc.createDocumentFragment();
        filtered.forEach(novel => {
            const li = doc.createElement('li');
            li.className = 'novel-card';
            li.dataset.novelId = novel.id;
            li.setAttribute('role', 'button');
            li.tabIndex = 0;
            const title = novel.title || i18n.get('text_untitled_novel');
            li.setAttribute('aria-label', i18n.get('aria_open_novel', { title }));

            li.innerHTML = `
                <div class="novel-card__cover">
                    <img src="" alt="" class="novel-card__cover-img">
                    <div class="novel-card__cover-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></svg>
                    </div>
                </div>
                <div class="novel-card__content">
                    <h3 class="novel-card__title"></h3>
                    <p class="novel-card__author"></p>
                    <div class="novel-card__meta">
                        <div class="novel-card__meta-item genre">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"></path></svg>
                            <span></span>
                        </div>
                        <div class="novel-card__meta-item chapters">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"></path></svg>
                            <span></span>
                        </div>
                    </div>
                </div>
            `;

            li.querySelector('.novel-card__title').textContent = title;
            li.querySelector('.novel-card__author').textContent = novel.author || i18n.get('text_unknown_author');
            
            const genreEl = li.querySelector('.novel-card__meta-item.genre');
            if (novel.genre) {
                genreEl.querySelector('span').textContent = novel.genre;
            } else {
                genreEl.style.display = 'none';
            }
            
            li.querySelector('.novel-card__meta-item.chapters span').textContent = i18n.get('text_card_chapters', { count: novel.chapters.length });

            const coverImg = li.querySelector('.novel-card__cover-img');
            const coverPlaceholder = li.querySelector('.novel-card__cover-placeholder');
            if (novel.coverImageFileName) {
                readCoverImage(novel.id, novel.coverImageFileName).then(data => {
                    if (data) {
                        coverImg.src = data;
                        coverImg.alt = `Cover for ${title}`;
                        coverImg.style.display = 'block';
                        coverPlaceholder.style.display = 'none';
                    }
                });
            }

            frag.appendChild(li);
        });
        DOM.novelListEl.appendChild(frag);
    }

    /**
     * Asynchronously loads and populates the novel info page.
     * @param {string} novelId - The ID of the novel to load.
     */
    async function loadNovelInfoPage(novelId) {
        DOM.novelInfoPageLoader.classList.add('active');
        DOM.novelInfoPageContent.classList.add('loading');

        const novel = findNovel(novelId);
        if (!novel) {
            alert(i18n.get('alert_error_finding_novel_info'));
            DOM.novelInfoPageLoader.classList.remove('active');
            showPage('home-page');
            return;
        }

        if (novel.coverImageFileName) {
            const coverData = await readCoverImage(novel.id, novel.coverImageFileName);
            if (coverData) {
                DOM.novelInfoCoverImg.src = coverData;
                DOM.novelInfoCoverContainer.style.display = 'block';
            } else {
                DOM.novelInfoCoverContainer.style.display = 'none';
            }
        } else {
            DOM.novelInfoCoverContainer.style.display = 'none';
        }

        DOM.novelInfoTitleMainEl.textContent = novel.title ?? i18n.get('text_untitled_novel');
        DOM.novelInfoAuthorEl.textContent = novel.author ?? i18n.get('details_na');
        DOM.novelInfoGenreEl.textContent = novel.genre ?? i18n.get('details_na');
        DOM.novelInfoDescriptionEl.textContent = novel.description || i18n.get('details_no_description');
        const lastReadIdx = novel.lastReadChapterIndex;
        const lastReadCh = findChapter(novelId, lastReadIdx);
        const hasChaps = novel.chapters?.length > 0;

        DOM.novelInfoLastReadEl.onclick = null; DOM.novelInfoLastReadEl.onkeydown = null;
        DOM.novelInfoLastReadEl.classList.remove('clickable', 'not-clickable');
        DOM.novelInfoLastReadEl.removeAttribute('role'); DOM.novelInfoLastReadEl.tabIndex = -1; DOM.novelInfoLastReadEl.removeAttribute('aria-label');
        if (hasChaps && lastReadCh && lastReadIdx !== -1) {
            const chTitle = lastReadCh.title ?? i18n.get('text_chapter_placeholder', { index: lastReadIdx + 1 });
            DOM.novelInfoLastReadEl.textContent = chTitle; DOM.novelInfoLastReadEl.classList.add('clickable');
            DOM.novelInfoLastReadEl.setAttribute('role', 'link'); DOM.novelInfoLastReadEl.tabIndex = 0;
            DOM.novelInfoLastReadEl.setAttribute('aria-label', i18n.get('aria_continue_reading', { chapterTitle: chTitle }));
            const handler = (e) => {
                if (e.type==='click'||(e.type==='keydown'&&(e.key==='Enter'||e.key===' '))) {
                    e.preventDefault(); currentChapterIndex = lastReadIdx;
                    showPage('reader-page');
                }
            };
            DOM.novelInfoLastReadEl.addEventListener('click', handler); DOM.novelInfoLastReadEl.addEventListener('keydown', handler);
        } else { DOM.novelInfoLastReadEl.textContent = i18n.get('details_never_read'); DOM.novelInfoLastReadEl.classList.add('not-clickable'); }

        renderChapterList(novelId, DOM.chapterSearchInput ? DOM.chapterSearchInput.value : '');

        DOM.novelInfoPageLoader.classList.remove('active');
        DOM.novelInfoPageContent.classList.remove('loading');
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
        const novel = findNovel(novelId); DOM.chapterListEl.innerHTML = '';
        const chapters = novel?.chapters || [];
        const lowerFilter = filterTerm.toLowerCase().trim();

        let displayChapters = chapters.map((ch, idx) => ({ ...ch, originalIndex: idx }));
        if (chapterSortOrder === 'desc') {
            displayChapters.reverse();
        }

        const filtered = displayChapters.filter(ch => !lowerFilter || (ch.title ?? '').toLocaleLowerCase(i18n.currentLang).includes(lowerFilter));
        const hasAnyChaps = chapters.length > 0;
        DOM.bulkDownloadBtn.disabled = !hasAnyChaps;
        DOM.bulkDownloadBtn.setAttribute('aria-disabled', String(!hasAnyChaps));

        if (filtered.length === 0) {
            const li = doc.createElement('li'); li.className = 'list-placeholder';
            li.textContent = i18n.get(hasAnyChaps ? 'placeholder_no_matching_chapters' : 'placeholder_no_chapters', { searchTerm: filterTerm });
            DOM.chapterListEl.appendChild(li); return;
        }
        const frag = doc.createDocumentFragment();
        filtered.forEach(({ title, lastModified, wordCount, originalIndex }) => {
            const li = doc.createElement('li');
            li.className = 'chapter-card';
            li.dataset.chapterIndex = originalIndex;
            const chTitle = title ?? i18n.get('text_chapter_placeholder', { index: originalIndex + 1 });

            const wordCountText = typeof wordCount !== 'undefined'
                ? i18n.get('text_word_count', { count: wordCount })
                : i18n.get('text_word_count_na');

            li.innerHTML = `
                <div class="chapter-card__main" role="button" tabindex="0" data-action="read" aria-label="${i18n.get('aria_read_chapter', { chapterTitle: chTitle })}">
                    <h4 class="chapter-card__title"></h4>
                    <p class="chapter-card__word-count"></p>
                    <p class="chapter-card__meta"></p>
                </div>
                <div class="chapter-card__actions">
                    <button type="button" class="btn btn--icon" data-action="edit" aria-label="${i18n.get('aria_edit_chapter', { chapterTitle: chTitle })}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
                    <button type="button" class="btn btn--icon" data-action="download" aria-label="${i18n.get('aria_download_chapter', { chapterTitle: chTitle })}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg></button>
                    <button type="button" class="btn btn--icon btn--icon-danger" data-action="delete" aria-label="${i18n.get('aria_delete_chapter', { chapterTitle: chTitle })}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
                </div>
            `;
            li.querySelector('.chapter-card__title').textContent = chTitle;
            li.querySelector('.chapter-card__word-count').textContent = wordCountText;
            
            const metaElement = li.querySelector('.chapter-card__meta');
            const fullTimestampText = i18n.get('text_modified', { timestamp: formatTimestamp(lastModified) });
            metaElement.textContent = fullTimestampText;
            metaElement.title = fullTimestampText;
            metaElement.onclick = (e) => {
                if (metaElement.scrollWidth > metaElement.offsetWidth) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert(fullTimestampText);
                }
            };

            frag.appendChild(li);
        });
        DOM.chapterListEl.appendChild(frag);
    }

    /**
     * Asynchronously loads and populates the reader page for a specific chapter.
     * @param {string} novelId - The ID of the novel containing the chapter.
     * @param {number} chapterIndexToLoad - The index of the chapter to load.
     */
    async function loadReaderPage(novelId, chapterIndexToLoad) {
        DOM.readerPageLoader.classList.add('active');
        DOM.readerPageContent.classList.add('loading');

        const novel = findNovel(novelId);
        const chapter = findChapter(novelId, chapterIndexToLoad);

        if (!chapter || !novel) {
            DOM.readerChapterTitleEl.textContent = i18n.get('text_error_formatting_timestamp');
            DOM.readerWordCountEl.textContent = '';
            DOM.readerContentEl.textContent = i18n.get('text_error_loading_chapter');
            DOM.prevChapterBtn.disabled = true;
            DOM.nextChapterBtn.disabled = true;
            DOM.readerPageLoader.classList.remove('active');
            DOM.readerPageContent.classList.remove('loading');
            return;
        }

        currentChapterIndex = chapterIndexToLoad;
        DOM.readerChapterTitleEl.textContent = chapter.title ?? i18n.get('text_chapter_placeholder', { index: currentChapterIndex + 1 });
        DOM.readerWordCountEl.textContent = typeof chapter.wordCount !== 'undefined'
            ? i18n.get('text_word_count', { count: chapter.wordCount })
            : i18n.get('text_word_count_na');

        DOM.readerContentEl.textContent = i18n.get('text_loading_chapter_content');
        DOM.readerContentEl.style.color = '';
        DOM.readerMainContent.scrollTop = 0;

        const rawContent = await readChapterContent(novelId, currentChapterIndex);
        if (rawContent.startsWith(i18n.get('text_error_prefix'))) {
            DOM.readerContentEl.textContent = rawContent;
            DOM.readerContentEl.style.color = 'var(--color-accent-danger)';
        } else {
            DOM.readerContentEl.textContent = rawContent;
        }

        DOM.prevChapterBtn.disabled = (currentChapterIndex <= 0);
        DOM.nextChapterBtn.disabled = (currentChapterIndex >= novel.chapters.length - 1);
        
        requestAnimationFrame(() => {
            if (DOM.readerPage.classList.contains('active') && currentNovelId === novelId && currentChapterIndex === novel.lastReadChapterIndex) {
                DOM.readerMainContent.scrollTop = novel.lastReadScrollTop;
            }
            DOM.readerPageLoader.classList.remove('active');
            DOM.readerPageContent.classList.remove('loading');
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

    /**
     * Shows a processing modal for long-running tasks like import/export.
     * @param {('importing'|'exporting')} type - The type of process.
     */
    function showProcessingModal(type) {
        const key = type === 'importing' ? 'aria_importing_backup' : 'aria_exporting_novels';
        DOM.processingModalText.textContent = i18n.get(key);
        DOM.processingModal.style.display = 'flex';
    }

    /**
     * Hides the processing modal.
     */
    function hideProcessingModal() {
        DOM.processingModal.style.display = 'none';
    }

    async function openNovelModal(novelIdToEdit = null) {
        const isEditing = !!novelIdToEdit;
        const novel = isEditing ? findNovel(novelIdToEdit) : null;
        if (isEditing && !novel) {
            alert(i18n.get('alert_error_finding_novel_info'));
            return;
        }

        newCoverData = null;
        coverAction = 'none';
        DOM.novelModalCoverPreview.src = '';
        DOM.modalAddCoverBtn.style.display = 'block';
        DOM.novelModalCoverPreviewWrapper.style.display = 'none';

        DOM.novelModalTitleHeading.textContent = i18n.get(isEditing ? 'modal_edit_novel_title' : 'modal_add_novel_title');
        DOM.novelModalIdInput.value = novelIdToEdit || '';
        DOM.novelModalTitleInput.value = novel?.title ?? '';
        DOM.novelModalAuthorInput.value = novel?.author ?? '';
        DOM.novelModalGenreInput.value = novel?.genre ?? '';
        DOM.novelModalDescriptionInput.value = novel?.description ?? '';

        if (novel?.coverImageFileName) {
            const coverData = await readCoverImage(novel.id, novel.coverImageFileName);
            if (coverData) {
                DOM.novelModalCoverPreview.src = coverData;
                DOM.modalAddCoverBtn.style.display = 'none';
                DOM.novelModalCoverPreviewWrapper.style.display = 'block';
            }
        }

        openModal(DOM.novelModal);
        DOM.novelModalTitleInput.focus();
        autoResizeTextarea(DOM.novelModalDescriptionInput);
    }
    
    function closeNovelModal() { closeModal(DOM.novelModal); }

    async function saveNovelFromModal() {
        const id = DOM.novelModalIdInput.value;
        const title = DOM.novelModalTitleInput.value.trim();
        if (!title) {
            alert(i18n.get('alert_novel_title_required'));
            DOM.novelModalTitleInput.focus();
            return;
        }
        const author = DOM.novelModalAuthorInput.value.trim();
        const genre = DOM.novelModalGenreInput.value.trim();
        const description = DOM.novelModalDescriptionInput.value.trim();
        const isEditing = !!id;

        let novelToUpdate;
        if (isEditing) {
            novelToUpdate = findNovel(id);
            if (!novelToUpdate) {
                alert(i18n.get('alert_error_saving_novel_update'));
                closeNovelModal();
                return;
            }
        } else {
            novelToUpdate = { id: crypto.randomUUID(), title, author, genre, description, chapters: [], coverImageFileName: null, lastReadChapterIndex: -1, lastReadScrollTop: 0 };
            novelsMetadata.push(novelToUpdate);
            currentNovelId = novelToUpdate.id;
        }

        if (coverAction === 'update' && newCoverData) {
            if (novelToUpdate.coverImageFileName) {
                await deleteCoverImage(novelToUpdate.id, novelToUpdate.coverImageFileName);
            }
            novelToUpdate.coverImageFileName = await saveCoverImage(novelToUpdate.id, newCoverData);
        } else if (coverAction === 'delete') {
            if (novelToUpdate.coverImageFileName) {
                await deleteCoverImage(novelToUpdate.id, novelToUpdate.coverImageFileName);
            }
            novelToUpdate.coverImageFileName = null;
        }

        Object.assign(novelToUpdate, { title, author, genre, description });
        await saveNovelsMetadata();
        closeNovelModal();
        renderNovelList(DOM.novelSearchInput ? DOM.novelSearchInput.value : '');

        if (DOM.novelInfoPage.classList.contains('active') && currentNovelId === novelToUpdate.id) {
            loadNovelInfoPage(novelToUpdate.id);
        } else if (!isEditing && currentNovelId === novelToUpdate.id) {
            await showPage('novel-info-page');
        }
    }

    function calculateWordCount(text) {
        if (!text || typeof text !== 'string') return 0;
        return text.trim().split(/\s+/).filter(Boolean).length;
    }

    async function openChapterModal(novelId, chapterIndexToEdit = null) {
        const novel = findNovel(novelId); if (!novel) { alert(i18n.get('alert_error_finding_associated_novel')); return; }
        const isEditing = chapterIndexToEdit !== null && chapterIndexToEdit >= 0;
        const chapter = isEditing ? findChapter(novelId, chapterIndexToEdit) : null;
        if (isEditing && !chapter) { alert(i18n.get('alert_error_finding_chapter_to_edit')); return; }
        DOM.chapterModalTitleHeading.textContent = i18n.get(isEditing ? 'modal_edit_chapter_title' : 'modal_add_chapter_title');
        DOM.chapterModalNovelIdInput.value = novelId;
        DOM.chapterModalIndexInput.value = isEditing ? String(chapterIndexToEdit) : '';
        DOM.chapterModalTitleInput.value = chapter?.title ?? '';
        DOM.chapterModalContentInput.value = ''; DOM.chapterModalContentInput.disabled = true;
        openModal(DOM.chapterModal);
        DOM.chapterModalTitleInput.focus();
        if (isEditing) {
            DOM.chapterModalContentInput.value = i18n.get('text_loading_chapter_modal_content');
            try {
                const rawContent = await readChapterContent(novelId, chapterIndexToEdit);
                if (rawContent.startsWith(i18n.get('text_error_prefix'))) DOM.chapterModalContentInput.value = i18n.get('text_error_loading_chapter_modal_content', { errorDetails: rawContent.substring(i18n.get('text_error_prefix').length + 1) });
                else DOM.chapterModalContentInput.value = rawContent;
            } catch(e) { DOM.chapterModalContentInput.value = i18n.get('text_critical_error_loading_chapter_modal_content', { errorMessage: e.message }); }
            finally {
                DOM.chapterModalContentInput.disabled = false;
                autoResizeTextarea(DOM.chapterModalContentInput);
            }
        } else {
            DOM.chapterModalContentInput.disabled = false;
            autoResizeTextarea(DOM.chapterModalContentInput);
        }
    }
    function closeChapterModal() { closeModal(DOM.chapterModal); }
    async function saveChapterFromModal() {
        const novelId = DOM.chapterModalNovelIdInput.value; const indexStr = DOM.chapterModalIndexInput.value;
        const title = DOM.chapterModalTitleInput.value.trim(); const content = DOM.chapterModalContentInput.value;
        const novel = findNovel(novelId);
        if (!title) { alert(i18n.get('alert_chapter_title_required')); DOM.chapterModalTitleInput.focus(); return; }
        if (!novel) { alert(i18n.get('alert_error_chapter_save_novel_missing')); closeChapterModal(); return; }
        const isNewCh = indexStr === '';
        const chIdx = isNewCh ? novel.chapters.length : parseInt(indexStr, 10);
        if (!isNewCh && (isNaN(chIdx) || chIdx < 0 || chIdx >= novel.chapters.length)) {
            alert(i18n.get('alert_error_chapter_save_invalid_index')); closeChapterModal(); return;
        }
        const wordCount = calculateWordCount(content);
        let chData; const nowISO = new Date().toISOString();
        if (isNewCh) {
            chData = { title, opfsFileName: '', lastModified: nowISO, wordCount };
        } else {
            chData = novel.chapters[chIdx];
            chData.title = title;
            chData.wordCount = wordCount;
        }
        chData.lastModified = nowISO;
        try {
            if (isNewCh) novel.chapters.push(chData);
            await saveChapterContent(novelId, chIdx, content);
            await saveNovelsMetadata();
            closeChapterModal();
            renderChapterList(novelId, DOM.chapterSearchInput ? DOM.chapterSearchInput.value : '');
        } catch (error) {
            alert(i18n.get('alert_chapter_save_failed', { errorMessage: error.message }));
            if (isNewCh) { const tempIdx = novel.chapters.indexOf(chData); if (tempIdx > -1) novel.chapters.splice(tempIdx, 1); }
        }
    }

    function openReaderSettingsModal() {
        DOM.fontSelect.value = localStorage.getItem(FONT_KEY) || DEFAULT_FONT;
        DOM.fontSizeSlider.value = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
        DOM.lineHeightSlider.value = localStorage.getItem(LINE_SPACING_KEY) || DEFAULT_LINE_SPACING;
        DOM.fontSizeValueSpan.textContent = DOM.fontSizeSlider.value;
        DOM.lineHeightValueSpan.textContent = DOM.lineHeightSlider.value;
        openModal(DOM.readerSettingsModal);
    }
    function closeReaderSettingsModal() { closeModal(DOM.readerSettingsModal); }

    async function exportAllData() {
        if (!novelsMetadata?.length) { alert(i18n.get('alert_no_novels_to_export')); return; }
        if (!opfsRoot || typeof CompressionStream === 'undefined') { alert(i18n.get('alert_export_failed_apis')); return; }
        
        DOM.exportButton.disabled = true;
        try {
            showProcessingModal('exporting');
            const exportMeta = JSON.parse(JSON.stringify(novelsMetadata));
            const exportObj = { version: 2, metadata: exportMeta, chapters: {}, covers: {} };
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
                if (novel.coverImageFileName) {
                    try {
                        const coverData = await readCoverImage(novel.id, novel.coverImageFileName);
                        if (coverData) exportObj.covers[novel.id] = coverData;
                    } catch (coverErr) {
                        alert(i18n.get('alert_export_cover_read_warning', { title: novel.title }));
                    }
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
            hideProcessingModal();
            DOM.exportButton.disabled = novelsMetadata.length === 0;
        }
    }

    function triggerImport() {
        if (!opfsRoot || typeof DecompressionStream === 'undefined') { alert(i18n.get('alert_import_failed_apis')); return; }
        if (novelsMetadata.length > 0 && !confirm(i18n.get('alert_confirm_import_overwrite'))) return;
        DOM.importFileInput.click();
    }

    async function importData(file) {
        if (!file || !file.name.endsWith('.novelarchive.gz')) { alert(i18n.get('alert_invalid_import_file')); DOM.importFileInput.value = ''; return; }
        if (!opfsRoot) { alert(i18n.get('alert_import_failed_storage_not_ready')); DOM.importFileInput.value = ''; return; }
        
        DOM.importButton.disabled = true;
        DOM.importFileInput.disabled = true;
        let prevSettingsBackup = null;
        try {
            showProcessingModal('importing');
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
                id: n.id??crypto.randomUUID(), title:n.title??i18n.get('text_untitled_novel'), author:n.author??'', genre:n.genre??'', description:n.description??'',
                chapters:(n.chapters||[]).map((ch,idx)=>({title:ch.title??i18n.get('text_chapter_placeholder',{index:idx+1}), opfsFileName:ch.opfsFileName??'', lastModified:ch.lastModified??nowISO, wordCount: ch.wordCount ?? undefined})),
                coverImageFileName: n.coverImageFileName ?? null,
                lastReadChapterIndex:n.lastReadChapterIndex??-1, lastReadScrollTop:n.lastReadScrollTop??0
            }));
            await saveNovelsMetadata();
            for (const novel of novelsMetadata) {
                const chapterData = importObj.chapters[novel.id]; if (!chapterData) continue;
                for (let i = 0; i < novel.chapters.length; i++) {
                    const content = chapterData[i]; let contentToSave = ''; let skip = false;
                    if (typeof content === 'string') {
                        if (content.startsWith('###EXPORT_READ_ERROR###')) { skip=true; }
                        else contentToSave = content;
                    }
                    if (typeof novel.chapters[i].wordCount === 'undefined') {
                        novel.chapters[i].wordCount = calculateWordCount(contentToSave);
                    }
                    if (!skip) try { await saveChapterContent(novel.id, i, contentToSave); } catch (err) { chapterSaveErrors++;}
                }
                if (importObj.covers && importObj.covers[novel.id]) {
                    try {
                        novel.coverImageFileName = await saveCoverImage(novel.id, importObj.covers[novel.id]);
                    } catch (coverErr) {
                        console.error(`Error saving imported cover for novel ${novel.id}:`, coverErr);
                    }
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
            hideProcessingModal();
            DOM.importButton.disabled = false;
            DOM.importFileInput.disabled = false; DOM.importFileInput.value = '';
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
        const chTitle = ch.title ?? i18n.get('text_chapter_placeholder', { index: chIdx + 1 });
        const novelTitle = novel.title ?? i18n.get('text_untitled_novel');
        const dlName = `${sanitizeFilename(novelTitle)} - Ch ${String(chIdx+1).padStart(3,'0')} - ${sanitizeFilename(chTitle)}.txt`;
        if (!opfsRoot) { alert(i18n.get('alert_download_failed_storage_unavailable')); throw new Error("OPFS unavailable"); }
        try {
             const novelDir = await getNovelDir(novelId, false);
             const fileHandle = await novelDir.getFileHandle(safeOpfsFile);
             const file = await fileHandle.getFile();
             const url = URL.createObjectURL(file); const a = doc.createElement('a'); a.href=url; a.download=dlName;
             doc.body.appendChild(a); a.click(); doc.body.removeChild(a); URL.revokeObjectURL(url);
        } catch (error) {
             const titleAlert = ch.title ?? i18n.get('text_chapter_placeholder', { index: chIdx + 1 });
             const errKey = error.name === 'NotFoundError' ? 'alert_download_failed_file_not_found' : 'alert_download_failed_general';
             alert(i18n.get(errKey, { title: titleAlert, fileName: safeOpfsFile, errorMessage: error.message })); throw error;
        }
    }

    async function downloadAllChaptersCombined(novelId) {
        const novel = findNovel(novelId);
        if (!novel?.chapters?.length) { alert(i18n.get('alert_no_chapters_to_download')); return; }
        if (!opfsRoot) { alert(i18n.get('alert_download_failed_storage_unavailable')); return; }
        const totalChaps = novel.chapters.length; const novelTitle = novel.title ?? i18n.get('text_untitled_novel');
        const origBtnText = DOM.bulkDownloadBtn.querySelector('span').textContent;
        DOM.bulkDownloadBtn.disabled = true; DOM.bulkDownloadBtn.setAttribute('aria-disabled', 'true');
        DOM.bulkDownloadBtn.setAttribute('aria-live', 'polite'); DOM.bulkDownloadBtn.querySelector('span').textContent = i18n.get('bulk_download_preparing');
        let combined = `${i18n.get('form_title')}: ${novelTitle}\n`;
        if (novel.author) combined += `${i18n.get('form_author')}: ${novel.author}\n`;
        combined += `${i18n.get('details_chapters')}: ${totalChaps}\n========================================\n\n`;
        let succCount = 0, errCount = 0;
        for (let i = 0; i < totalChaps; i++) {
            DOM.bulkDownloadBtn.querySelector('span').textContent = i18n.get('bulk_download_reading', { current: i + 1, total: totalChaps });
            const ch = novel.chapters[i];
            const chTitle = ch.title ?? i18n.get('text_chapter_placeholder', { index: i + 1 });
            combined += `## ${chTitle} (${i18n.get('text_chapter_placeholder', { index: i + 1 })})\n\n`;
            try {
                const content = await readChapterContent(novelId, i);
                if (content.startsWith(i18n.get('text_error_prefix'))) throw new Error(content.substring(i18n.get('text_error_prefix').length + 1));
                combined += `${content}\n\n`; succCount++;
            } catch (e) { combined += `### ${i18n.get('text_error_prefix')} ${i18n.get('text_error_reading_file',{errorMessage: e.message})} ###\n\n`; errCount++; }
            combined += "---\n\n";
        }
        DOM.bulkDownloadBtn.querySelector('span').textContent = i18n.get('bulk_download_saving');
        try {
            const blob = new Blob([combined],{type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob);
            const a = doc.createElement('a'); a.href = url; a.download = `${sanitizeFilename(novelTitle)} - All Chapters.txt`;
            doc.body.appendChild(a); a.click(); doc.body.removeChild(a); URL.revokeObjectURL(url);
            const finalMsgKey = errCount > 0 ? 'bulk_download_finished_with_errors' : 'bulk_download_finished';
            alert(i18n.get(finalMsgKey, {title:novelTitle, successCount:succCount, errorCount:errCount}));
        } catch (saveErr) { alert(i18n.get('bulk_download_save_failed', { errorMessage: saveErr.message }));
        } finally {
            DOM.bulkDownloadBtn.querySelector('span').textContent = origBtnText; DOM.bulkDownloadBtn.disabled = !novel?.chapters?.length;
            DOM.bulkDownloadBtn.setAttribute('aria-disabled', String(!novel?.chapters?.length)); DOM.bulkDownloadBtn.removeAttribute('aria-live');
        }
    }

    function toggleFullScreen() {
        if (!doc.fullscreenEnabled) { return; }
        if (!doc.fullscreenElement) doc.documentElement.requestFullscreen().catch(err => alert(i18n.get('alert_fullscreen_error',{errorMessage:err.message, errorName:err.name})));
        else if (doc.exitFullscreen) doc.exitFullscreen();
    }
    function updateFullscreenButtonAriaLabel() {
         DOM.readerFullscreenBtn.setAttribute('aria-label', i18n.get(doc.fullscreenElement ? 'aria_exit_fullscreen' : 'aria_enter_fullscreen'));
    }

    /**
     * Sets up all the primary event listeners for the application.
     */
    function setupEventListeners() {
        doc.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target || 'home-page')));
        doc.getElementById('settings-btn')?.addEventListener('click', () => { showPage('settings-page'); DOM.headerMenu.classList.remove('active'); });
        DOM.themeToggleBtn?.addEventListener('click', () => applyTheme(doc.body.classList.contains('dark-mode') ? 'light' : 'dark'));
        DOM.languageSelect?.addEventListener('change', (e) => i18n.setLanguage(e.target.value));
        doc.getElementById('add-novel-btn')?.addEventListener('click', () => openNovelModal());
        DOM.importButton?.addEventListener('click', () => { triggerImport(); DOM.headerMenu.classList.remove('active'); });
        DOM.importFileInput?.addEventListener('change', (e) => { if (e.target.files?.length) importData(e.target.files[0]); });
        DOM.exportButton?.addEventListener('click', () => { exportAllData(); DOM.headerMenu.classList.remove('active'); });
        
        DOM.moreActionsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.headerMenu.classList.toggle('active');
        });
        doc.addEventListener('click', (e) => {
            if (!DOM.headerMenu.contains(e.target) && !DOM.moreActionsBtn.contains(e.target)) {
                DOM.headerMenu.classList.remove('active');
            }
        });

        const debouncedRenderNovels = debounce(renderNovelList, SEARCH_DEBOUNCE_DELAY);
        DOM.novelSearchInput?.addEventListener('input', (e) => debouncedRenderNovels(e.target.value));
        DOM.deleteAllDataBtn?.addEventListener('click', deleteAllData);
        doc.getElementById('edit-novel-btn')?.addEventListener('click', () => { if (currentNovelId) openNovelModal(currentNovelId); });
        doc.getElementById('delete-novel-btn')?.addEventListener('click', async () => {
            if (!currentNovelId) return; const novel = findNovel(currentNovelId);
            const title = novel?.title ?? i18n.get('text_untitled_novel');
            if (novel && confirm(`${i18n.get('alert_confirm_delete_novel_title')}\n\n${i18n.get('alert_confirm_delete_novel_body', { title })}`)) {
                 try {
                    await deleteNovelData(currentNovelId); currentNovelId = null;
                    renderNovelList(); await showPage('home-page');
                    alert(i18n.get('alert_delete_novel_success', { title }));
                 } catch (error) { alert(i18n.get('alert_error_deleting_novel', { title })); }
            }
        });
        doc.getElementById('add-chapter-btn')?.addEventListener('click', () => { if (currentNovelId) openChapterModal(currentNovelId); });
        DOM.bulkDownloadBtn?.addEventListener('click', () => { if (currentNovelId) downloadAllChaptersCombined(currentNovelId); });
        const debouncedRenderChapters = debounce((id, filter) => { if (currentNovelId === id) renderChapterList(id, filter); }, SEARCH_DEBOUNCE_DELAY);
        DOM.chapterSearchInput?.addEventListener('input', (e) => { if (currentNovelId) debouncedRenderChapters(currentNovelId, e.target.value); });
        DOM.chapterSortSelect?.addEventListener('change', (e) => {
            chapterSortOrder = e.target.value;
            if (currentNovelId) renderChapterList(currentNovelId, DOM.chapterSearchInput.value);
        });
        doc.getElementById('save-novel-modal-btn')?.addEventListener('click', saveNovelFromModal);
        doc.getElementById('cancel-novel-modal-btn')?.addEventListener('click', closeNovelModal);
        DOM.novelModal?.addEventListener('click', (e) => { if (e.target === DOM.novelModal) closeNovelModal(); });
        doc.getElementById('save-chapter-modal-btn')?.addEventListener('click', saveChapterFromModal);
        doc.getElementById('cancel-chapter-modal-btn')?.addEventListener('click', closeChapterModal);
        DOM.chapterModal?.addEventListener('click', (e) => { if (e.target === DOM.chapterModal) closeChapterModal(); });
        DOM.chapterModalTitleInput?.addEventListener('keydown', (e) => { if (e.key==='Enter'&&!e.shiftKey&&DOM.chapterModalContentInput) { e.preventDefault(); DOM.chapterModalContentInput.focus();}});
        doc.getElementById('close-reader-settings-modal-btn')?.addEventListener('click', closeReaderSettingsModal);
        DOM.readerSettingsModal?.addEventListener('click', (e) => { if (e.target === DOM.readerSettingsModal) closeReaderSettingsModal(); });
        doc.getElementById('reader-settings-btn')?.addEventListener('click', openReaderSettingsModal);
        DOM.readerFullscreenBtn?.addEventListener('click', toggleFullScreen);
        doc.addEventListener('fullscreenchange', updateFullscreenButtonAriaLabel);
        DOM.prevChapterBtn?.addEventListener('click', async () => {
            await saveReaderPosition();
            if (currentNovelId && currentChapterIndex > 0) {
                currentChapterIndex--;
                showPage('reader-page');
            }
        });
        DOM.nextChapterBtn?.addEventListener('click', async () => {
            await saveReaderPosition(); const novel = findNovel(currentNovelId);
            if (novel && currentChapterIndex < novel.chapters.length - 1) {
                currentChapterIndex++;
                showPage('reader-page');
            }
        });
        DOM.fontSelect?.addEventListener('change', (e) => applyReaderStyles(e.target.value, DOM.fontSizeSlider.value, DOM.lineHeightSlider.value));
        DOM.fontSizeSlider?.addEventListener('input', (e) => applyReaderStyles(DOM.fontSelect.value, e.target.value, DOM.lineHeightSlider.value));
        DOM.lineHeightSlider?.addEventListener('input', (e) => applyReaderStyles(DOM.fontSelect.value, DOM.fontSizeSlider.value, e.target.value));
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (doc.fullscreenElement) doc.exitFullscreen().catch(console.warn);
                else if (DOM.headerMenu?.classList.contains('active')) DOM.headerMenu.classList.remove('active');
                else if (DOM.readerSettingsModal?.style.display !== 'none') closeReaderSettingsModal();
                else if (DOM.chapterModal?.style.display !== 'none') closeChapterModal();
                else if (DOM.novelModal?.style.display !== 'none') closeNovelModal();
            }
        });
        window.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'hidden') saveReaderPosition(); });
        window.addEventListener('pagehide', () => saveReaderPosition());

        DOM.novelListEl.addEventListener('click', e => {
            const card = e.target.closest('.novel-card');
            if (card) {
                currentNovelId = card.dataset.novelId;
                showPage('novel-info-page');
            }
        });
        DOM.novelListEl.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.novel-card');
                if (card) {
                    e.preventDefault();
                    currentNovelId = card.dataset.novelId;
                    showPage('novel-info-page');
                }
            }
        });

        DOM.chapterListEl.addEventListener('click', async e => {
            const target = e.target;
            const card = target.closest('.chapter-card');
            if (!card) return;
            const chapterIndex = parseInt(card.dataset.chapterIndex, 10);
            const actionTarget = target.closest('[data-action]');
            if (!actionTarget) return;

            const action = actionTarget.dataset.action;
            const novel = findNovel(currentNovelId);
            const chTitle = findChapter(currentNovelId, chapterIndex)?.title ?? i18n.get('text_chapter_placeholder', { index: chapterIndex + 1 });

            switch (action) {
                case 'read':
                    currentChapterIndex = chapterIndex;
                    showPage('reader-page');
                    break;
                case 'edit':
                    openChapterModal(currentNovelId, chapterIndex);
                    break;
                case 'download':
                    await downloadChapter(currentNovelId, chapterIndex);
                    break;
                case 'delete':
                    if (confirm(i18n.get('confirm_delete_chapter', { chapterTitle: chTitle }))) {
                        try {
                            if (await deleteChapterFile(currentNovelId, chapterIndex)) {
                                novel.chapters.splice(chapterIndex, 1);
                                if (novel.lastReadChapterIndex === chapterIndex) { novel.lastReadChapterIndex = -1; novel.lastReadScrollTop = 0; }
                                else if (novel.lastReadChapterIndex > chapterIndex) novel.lastReadChapterIndex--;
                                await saveNovelsMetadata();
                                renderChapterList(currentNovelId, DOM.chapterSearchInput.value);
                                loadNovelInfoPage(currentNovelId);
                            } else alert(i18n.get('alert_failed_delete_chapter_file', { chapterTitle: chTitle }));
                        } catch(err) { alert(i18n.get('alert_error_deleting_chapter', { chapterTitle: chTitle })); }
                    }
                    break;
            }
        });

        const handleCoverFileSelect = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                newCoverData = e.target.result;
                coverAction = 'update';
                DOM.novelModalCoverPreview.src = newCoverData;
                DOM.modalAddCoverBtn.style.display = 'none';
                DOM.novelModalCoverPreviewWrapper.style.display = 'block';
            };
            reader.readAsDataURL(file);
            DOM.coverFileInput.value = '';
        };

        DOM.modalAddCoverBtn?.addEventListener('click', () => DOM.coverFileInput.click());
        DOM.novelModalCoverPreview?.addEventListener('click', () => DOM.coverFileInput.click());
        DOM.coverFileInput?.addEventListener('change', handleCoverFileSelect);

        DOM.modalRemoveCoverBtn?.addEventListener('click', () => {
            newCoverData = null;
            coverAction = 'delete';
            DOM.novelModalCoverPreview.src = '';
            DOM.modalAddCoverBtn.style.display = 'block';
            DOM.novelModalCoverPreviewWrapper.style.display = 'none';
        });

        DOM.novelModalDescriptionInput?.addEventListener('input', handleTextareaInput);
        DOM.chapterModalContentInput?.addEventListener('input', handleTextareaInput);
    }

    // Start the application
    // Good luck!
    initializeApp();
});