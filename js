document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    const barcodeContainer = document.getElementById('barcode-container');

    if (files.length === 0) {
        alert('Please upload at least one DST file.');
        return;
    }

    barcodeContainer.innerHTML = ''; // Clear any previous barcodes

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/generate-barcode', { // Adjust endpoint URL as needed
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error generating barcode for ${file.name}`);
            }

            const { barcodeUrl, fileName } = await response.json();

            // Create barcode display
            const barcodeDiv = document.createElement('div');
            barcodeDiv.className = 'barcode';
            barcodeDiv.innerHTML = `
                <img src="${barcodeUrl}" alt="Barcode for ${fileName}">
                <p>${fileName}</p>
                <a href="${barcodeUrl}" download="${fileName}-barcode.png">Download Barcode</a>
            `;

            barcodeContainer.appendChild(barcodeDiv);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
});
