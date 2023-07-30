document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.collapsible-header').forEach((header) => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector('.arrow');
            
            if(content.style.transform === 'scaleY(1)'){
                content.style.transform = 'scaleY(0)';
                arrow.innerHTML = '&#9654;';
            } else {
                content.style.transform = 'scaleY(1)';
                arrow.innerHTML = '&#9660;';
            }
        });
    });
});