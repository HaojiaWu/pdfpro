
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const downloadLinksDiv = document.getElementById('download-links');
    const operationDropdown = document.querySelector('[name="operation"]');
    const pagesPerSplitInput = document.getElementById('pages_per_split');
    const fileInputContainer = document.querySelector('label[for="pages_per_split"]');
    const submitButton = form.querySelector('button[type="submit"]');

    // Hide pages per split by default
    pagesPerSplitInput.style.display = 'none';
    fileInputContainer.style.display = 'none';

    operationDropdown.addEventListener('change', function() {
        // Clear existing file inputs
        const existingFileInputs = form.querySelectorAll('.dynamic-file-input');
        existingFileInputs.forEach(input => input.remove());

        // Reset display of pagesPerSplit and file input
        pagesPerSplitInput.style.display = 'none';
        fileInputContainer.style.display = 'none';
        document.getElementById('merge-input-dialog').style.display = 'none';
        document.getElementById('merge-file-upload-container').innerHTML = '';
        document.querySelector('input[type="file"]').style.display = 'block';
        
        if (this.value === 'split') {
            pagesPerSplitInput.style.display = 'block';
            fileInputContainer.style.display = 'block';
        } else if (this.value === 'merge') {
            // Hide the original file input and show the merge-input-dialog
            document.querySelector('input[type="file"]').style.display = 'none';
            document.getElementById('merge-input-dialog').style.display = 'block';
        }
    });

    
form.addEventListener('submit', function(e) {
    const selectedOperation = operationDropdown.value;
    let valid = true;
    let errorMessage = "";
    
    if (selectedOperation === "merge") {
        const dynamicFileInputs = form.querySelectorAll('.dynamic-file-input');
        valid = Array.from(dynamicFileInputs).some(input => input.files.length > 0);
        errorMessage = "Please select files for merging.";
    } else {
        const originalFileInput = form.querySelector('input[type="file"][name="files"]');
        valid = originalFileInput.files.length > 0;
        errorMessage = "Please select a file.";
    }

    if (!valid) {
        alert(errorMessage);
        e.preventDefault();
        return;
    }
    
        e.preventDefault();
        const formData = new FormData(form);

        
    // Show the progress bar and set its width to 100% to simulate full completion
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.display = 'block';
    progressBar.style.width = '100%';

        fetch('/', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            if (data && data.files) {
                progressBarContainer.style.display = 'none';
            downloadLinksDiv.innerHTML = '';  // Clear previous links
                data.files.forEach(filename => {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = `/download/${filename}`;
                    downloadLink.textContent = `Download ${filename}`;
                    downloadLinksDiv.appendChild(downloadLink);
                    downloadLinksDiv.appendChild(document.createElement('br')); // New line
                });
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});


function generateUploadFields() {
    const numFiles = parseInt(document.getElementById('merge-count').value, 10);
    const container = document.getElementById('merge-file-upload-container');
    container.innerHTML = '';  // Clear any existing inputs

    if (numFiles && numFiles > 0) {
        for (let i = 0; i < numFiles; i++) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = `file${i + 1}`;
            fileInput.classList.add('dynamic-file-input');
            container.appendChild(fileInput);
        }
    }
}


