import api from './api';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 8;

const IMAGE_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const DOCUMENT_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
const VIDEO_FILE_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const ARCHIVE_FILE_EXTENSIONS = ['.zip'];
const ALL_FILE_EXTENSIONS = [
  ...IMAGE_FILE_EXTENSIONS,
  ...DOCUMENT_FILE_EXTENSIONS,
  ...VIDEO_FILE_EXTENSIONS,
  ...ARCHIVE_FILE_EXTENSIONS
];
const MATERIAL_FILE_EXTENSIONS = [
  ...DOCUMENT_FILE_EXTENSIONS,
  ...VIDEO_FILE_EXTENSIONS,
  ...ARCHIVE_FILE_EXTENSIONS
];

const getExtension = (fileName = '') => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 ? fileName.slice(lastDot).toLowerCase() : '';
};

export const fileService = {
  MAX_FILE_SIZE_BYTES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_REQUEST_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
  IMAGE_FILE_EXTENSIONS,
  MATERIAL_FILE_EXTENSIONS,
  ALL_FILE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES: IMAGE_FILE_EXTENSIONS.join(','),
  ACCEPTED_MATERIAL_TYPES: MATERIAL_FILE_EXTENSIONS.join(','),
  ACCEPTED_FILE_TYPES: ALL_FILE_EXTENSIONS.join(','),

  /**
   * Validate a file before it is selected or sent to the backend.
   */
  validateFile(file, options = {}) {
    if (!file || !Number.isFinite(file.size) || file.size <= 0) {
      return { valid: false, message: 'Vui lòng chọn tệp cần tải lên.' };
    }

    const maxSize = options.maxSize ?? MAX_FILE_SIZE_BYTES;
    const allowedExtensions = (options.allowedExtensions || ALL_FILE_EXTENSIONS)
      .map((extension) => extension.toLowerCase().startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`);

    if (file.size > maxSize) {
      return {
        valid: false,
        message: `Tệp "${file.name}" vượt quá giới hạn ${this.formatBytes(maxSize)}.`
      };
    }

    const extension = getExtension(file.name);
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        message: `Kiểu tệp không được hỗ trợ. Chỉ chấp nhận: ${allowedExtensions.map((item) => item.slice(1).toUpperCase()).join(', ')}.`
      };
    }

    return { valid: true, extension };
  },

  assertValidFile(file, options = {}) {
    const validation = this.validateFile(file, options);
    if (!validation.valid) {
      const error = new Error(validation.message);
      error.code = 'FILE_VALIDATION';
      throw error;
    }
    return file;
  },

  /**
   * Helper to format image / file URLs
   */
  getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
      return path;
    }
    const baseUrl = api.defaults.baseURL || 'http://localhost:8080/api';
    const serverOrigin = baseUrl.replace(/\/api\/?$/, '');
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${serverOrigin}${cleanPath}`;
  },

  /**
   * Upload a single validated file to the backend.
   * @param {File} file 
   * @returns {Promise<{success: boolean, data: {fileUrl: string, originalName: string, size: number}}>}
   */
  async uploadFile(file, options = {}) {
    this.assertValidFile(file, options);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': undefined },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Tải tệp lên thất bại.');
      }

      const fileData = response.data.data;
      return {
        success: true,
        data: {
          ...fileData,
          fileUrl: this.getFileUrl(fileData.fileUrl)
        },
      };
    } catch (error) {
      if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      throw error;
    }
  },

  /**
   * Upload multiple validated files.
   */
  async uploadMultipleFiles(files, options = {}) {
    const fileList = Array.from(files || []);
    if (fileList.length === 0) {
      throw new Error('Vui lòng chọn ít nhất một tệp cần tải lên.');
    }
    if (fileList.length > MAX_FILES_PER_REQUEST) {
      throw new Error(`Mỗi lần chỉ được tải lên tối đa ${MAX_FILES_PER_REQUEST} tệp.`);
    }

    const totalSize = fileList.reduce((total, file) => total + file.size, 0);
    const maxRequestSize = options.maxRequestSize ?? MAX_REQUEST_SIZE_BYTES;
    if (totalSize > maxRequestSize) {
      throw new Error(`Tổng dung lượng các tệp không được vượt quá ${this.formatBytes(maxRequestSize)}.`);
    }

    fileList.forEach((file) => this.assertValidFile(file, options));

    const formData = new FormData();
    fileList.forEach((file) => formData.append('files', file));

    try {
      const response = await api.post('/files/upload-multiple', formData, {
        headers: { 'Content-Type': undefined },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Tải các tệp lên thất bại.');
      }

      const list = (response.data.data || []).map(item => ({
        ...item,
        fileUrl: this.getFileUrl(item.fileUrl)
      }));
      return {
        success: true,
        data: list,
      };
    } catch (error) {
      if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      throw error;
    }
  },

  /**
   * Download a file to user's computer
   * @param {string} fileUrl 
   * @param {string} fileName 
   */
  async downloadFile(fileUrl, fileName = 'tai-lieu-tutora.pdf') {
    if (!fileUrl) {
      // Create a dummy document blob if no URL is provided
      const dummyContent = `Tài liệu: ${fileName}\nĐược tải từ hệ thống Tutora.\nThời gian: ${new Date().toLocaleString('vi-VN')}`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      this.triggerDownloadBlob(blob, fileName);
      return;
    }

    // If it's already a blob URL or base64 data URL
    if (fileUrl.startsWith('blob:') || fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // If it's a backend endpoint or relative URL
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${api.defaults.baseURL || 'http://localhost:8080/api'}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
      const response = await fetch(fullUrl);
      if (response.ok) {
        const blob = await response.blob();
        this.triggerDownloadBlob(blob, fileName);
        return;
      }
    } catch (err) {
      console.warn('Direct fetch failed, creating fallback download:', err.message);
    }

    // Fallback if backend file does not exist or server is offline
    const sampleContent = `=== TUTORA EDUCATION PLATFORM ===\nTài liệu học tập: ${fileName}\n\nNội dung bài học và bài tập mẫu của Tutora.\nCảm ơn bạn đã sử dụng nền tảng Tutora!`;
    const sampleBlob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    this.triggerDownloadBlob(sampleBlob, fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : fileName);
  },

  /**
   * Helper to trigger download via anchor element
   */
  triggerDownloadBlob(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Format file size to human readable string
   */
  formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
};

export default fileService;
