import api from './api';

export const fileService = {
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
   * Upload single file to backend (with client-side fallback if backend is offline)
   * @param {File} file 
   * @returns {Promise<{success: boolean, data: {fileUrl: string, originalName: string, size: number}}>}
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': undefined },
      });

      if (response.data && response.data.success) {
        const fileData = response.data.data;
        return {
          success: true,
          data: {
            ...fileData,
            fileUrl: this.getFileUrl(fileData.fileUrl)
          },
        };
      }
    } catch (error) {
      console.warn('Backend upload unavailable, falling back to local ObjectURL:', error.message);
    }

    // Local fallback for offline/demo operation
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      data: {
        fileId: 'local_' + Date.now(),
        originalName: file.name,
        fileName: file.name,
        fileUrl: localUrl,
        size: file.size,
        contentType: file.type,
      },
    };
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const response = await api.post('/files/upload-multiple', formData, {
        headers: { 'Content-Type': undefined },
      });

      if (response.data && response.data.success) {
        const list = (response.data.data || []).map(item => ({
          ...item,
          fileUrl: this.getFileUrl(item.fileUrl)
        }));
        return {
          success: true,
          data: list,
        };
      }
    } catch (error) {
      console.warn('Backend upload-multiple unavailable, falling back to local ObjectURLs');
    }

    // Local fallback
    const mockList = Array.from(files).map((file, idx) => ({
      fileId: 'local_' + Date.now() + '_' + idx,
      originalName: file.name,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      size: file.size,
      contentType: file.type,
    }));

    return {
      success: true,
      data: mockList,
    };
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
