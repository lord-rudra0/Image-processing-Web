function downloadImage(base64Data, filename) {
    if (!base64Data) {
        console.error("No data to download");
        return;
    }

    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default downloadImage; 