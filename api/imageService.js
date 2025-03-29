const handleRequest = async (url, method = 'GET', data = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
};

export const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    return handleRequest('/api/upload', 'POST', formData);
};

export const compressImage = async (filename, quality) => {
    return handleRequest('/api/compress', 'POST', { filename, quality });
};

export async function resizeImage(filename, width, height, format = 'jpeg', quality = 90, resizeOption = 'dimensions', dpi = 72) {
    return handleRequest('/api/resize', 'POST', { filename, width, height, format, quality, resizeOption, dpi });
}

export async function cropImage(filename, left, top, right, bottom) {
    return handleRequest('/api/crop', 'POST', { filename, left, top, right, bottom });
}

export const convertToJpg = async (filename) => {
    return handleRequest('/api/convert-to-jpg', 'POST', { filename: filename });
}; 