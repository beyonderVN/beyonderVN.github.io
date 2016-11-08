// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });


    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#homeNav').affix({
      offset: {
        top: $('#home-revolution-slider').height()
      }
}); 
    var $attribute = $('[data-smart-affix]');
        $attribute.each(function(){
          $(this).affix({
            offset: {
              top: $(this).offset().top,
            }
          })
        })
        $(window).on("resize", function(){
          $attribute.each(function(){
            $(this).data('bs.affix').options.offset = $(this).offset().top
          })
        })

})(jQuery); // End of use strict
