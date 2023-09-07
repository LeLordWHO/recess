pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

function embedPDF(pdfPath, containerId, desiredWidth = 800) {
    // Initialize PDF.js
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.getDocument(pdfPath).promise.then(function(pdf) {
        var pdfContainer = document.getElementById(containerId);

        // Loop through each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
                // Create a canvas element for this page
                var canvas = document.createElement('canvas');
                canvas.className = 'pdf-page-canvas';
                pdfContainer.appendChild(canvas);

                var viewport = page.getViewport({ scale: 1 });
                var scale = desiredWidth / viewport.width;
                var scaledViewport = page.getViewport({ scale: scale });

                // Set canvas dimensions
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                var context = canvas.getContext('2d');

                // Render the page
                var renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext);
            });
        }
    }).catch(function(error) {
        // If an error occurs, display the fallback
        var fallbackElement = document.createElement('p');
        fallbackElement.innerHTML = 'Unable to display PDF file. <a href="' + pdfPath + '">Download</a> instead.';
        document.getElementById(containerId).appendChild(fallbackElement);
    });
}
