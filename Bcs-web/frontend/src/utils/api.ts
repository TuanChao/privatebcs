// API utilities for consistent endpoint handling
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://via.placeholder.com/60";
  
  // Chỉ xử lý URL, không xử lý base64
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  // Nếu imagePath đã bắt đầu với /uploads/ thì thêm API_BASE_URL trực tiếp
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Nếu imagePath bắt đầu với uploads/ (không có /) thì thêm /
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  
  // Trường hợp khác thì thêm /uploads/ vào đầu
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = process.env.REACT_APP_API_URL ? getApiUrl(endpoint) : endpoint;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};
