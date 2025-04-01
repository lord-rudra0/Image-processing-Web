const API_URL = 'https://visioncraft-m0y6.onrender.com';

// Generic function to handle API requests
const handleRequest = async (url, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload Failed:', error);
    throw error;
  }
};

export const compressImage = (filename, quality) => {
  return handleRequest(`${API_URL}/compress`, 'POST', { filename, quality });
};

export const resizeImage = (filename, width, height) => {
  return handleRequest(`${API_URL}/resize`, 'POST', { filename, width, height });
};

export const cropImage = (filename, left, top, right, bottom) => {
  return handleRequest(`${API_URL}/crop`, 'POST', { filename, left, top, right, bottom });
};

export const convertToJpg = (filename) => {
  return handleRequest(`${API_URL}/convert-to-jpg`, 'POST', { filename });
};

export const getAvailableFilters = async () => {
  try {
    const response = await fetch(`${API_URL}/filters`);
    if (!response.ok) {
      throw new Error('Failed to fetch filters');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export const blurFace = (filename) => {
  return handleRequest(`${API_URL}/blur-face`, 'POST', { filename });
};