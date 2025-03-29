const API_URL = 'http://localhost:5000/api';

export const processImage = async (image, operations) => {
  try {
    const response = await fetch(`${API_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        operations,
      }),
    });

    if (!response.ok) {
      throw new Error('Image processing failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
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