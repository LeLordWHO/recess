$('.accordion').on('shown.bs.collapse', function (event) {
    const accordionHeader = $(event.target).prev('.accordion-header');
    const rect = accordionHeader[0].getBoundingClientRect();
  
    // Offset value to scroll above the accordion header
    const offset = 100; // You can tweak this value
  
    // Check if the top of the accordion header is not visible
    if (rect.top < offset) {
      const scrollPosition = window.scrollY + rect.top - offset;
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  });
  