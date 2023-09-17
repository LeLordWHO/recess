$('.accordion').on('shown.bs.collapse', function (event) {
    const accordionHeader = $(event.target).prev('.accordion-header');
    const rect = accordionHeader[0].getBoundingClientRect();
  
    // Offset value to scroll above the accordion header
    const offset = 80; // You can tweak this value
  
    // Check if the accordion item is expanding
    if ($(event.target).hasClass('show')) {
      // Check if the top of the accordion header is not visible
      if (rect.top < -80) {
        const scrollPosition = window.scrollY + rect.top - offset;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  });
  