$(document).ready(function() {
  // executes when HTML-Document is loaded and DOM is ready
  console.log("document is ready");

  $(".navbar-nav a").clone().prependTo("#off-canvas");

  $(function() {
    $(document).trigger("enhance");
  });

  /* ========================================================================= */
  /*  Timer count
  /* ========================================================================= */

  "use strict";
    $(".number-counters").appear(function () {
        $(".number-counters [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

    // scroll
    var scrollWindow = function() {
      $(window).scroll(function(){
        var $w = $(this),
            st = $w.scrollTop(),
            navbar = $('.ftco_navbar'),
            sd = $('.js-scroll-wrap');

        if (st > 150) {
          if ( !navbar.hasClass('scrolled') ) {
            navbar.addClass('scrolled');  
          }
        } 
        if (st < 150) {
          if ( navbar.hasClass('scrolled') ) {
            navbar.removeClass('scrolled sleep');
          }
        } 
        if ( st > 350 ) {
          if ( !navbar.hasClass('awake') ) {
            navbar.addClass('awake'); 
          }
          
          if(sd.length > 0) {
            sd.addClass('sleep');
          }
        }
        if ( st < 350 ) {
          if ( navbar.hasClass('awake') ) {
            navbar.removeClass('awake');
            navbar.addClass('sleep');
          }
          if(sd.length > 0) {
            sd.removeClass('sleep');
          }
        }
      });
    };
    scrollWindow();

});