$(document).ready(function(){

	// Smooth scrolling
	$(function() {
		$('.smooth_scroll a[href*="#"]:not([href="#"])').click(function() {
		    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			    var target = $(this.hash);
			    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			    if (target.length) {
			        $('html, body').animate({
				          	scrollTop: target.offset().top
				        }
				        ,1000, 'easeInOutExpo'
			        );

			        console.log($(this));
			        if ( $(this).parents('.navbar-nav').length ) {
			          // $('.navbar-nav .active').removeClass('active');
			          // $(this).closest('li').addClass('active');
			        }

			        if ( $('body').hasClass('mobile-nav-active') ) {
			            $('body').removeClass('mobile-nav-active');
			            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
			            $('#mobile-body-overly').fadeOut();
			        }
			        return false;
			    }
		    }
		});
	});

	// JS OffCanvas Menu
	// $(".navbar-nav a").clone().prependTo("#off-canvas");

	// $(function() {
	//   $(document).trigger("enhance");
	// });

	// Mobile Navigation
	if( $('#nav_head').length ) {
		var $list_mobile_nav = $('#nav_head .navbar-nav').clone();
		var $mobile_nav = $('nav.nav_mobile').html($list_mobile_nav).prop({ id: 'mobile-nav'});
	    // var $mobile_nav = $('#nav_head .navbar-nav').clone().prop({ id: 'mobile-nav'});
	    $mobile_nav.find('> ul').attr({ 'class' : '', 'id' : '' });
	    $('body').append( $mobile_nav );
	    $('body').prepend( '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>' );
	    $('body').append( '<div id="mobile-body-overly"></div>' );
	    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

	    $(document).on('click', '.menu-has-children i', function(e){
	        $(this).next().toggleClass('menu-item-active');
	        $(this).nextAll('ul').eq(0).slideToggle();
	        $(this).toggleClass("fa-chevron-up fa-chevron-down");
	    });

	    $(document).on('click', '#mobile-nav-toggle', function(e){
	        $('body').toggleClass('mobile-nav-active');
	        $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
	        $('#mobile-body-overly').toggle();
	    });

	    $(document).click(function (e) {
	        var container = $("#mobile-nav, #mobile-nav-toggle");
	        if (!container.is(e.target) && container.has(e.target).length === 0) {
	           if ( $('body').hasClass('mobile-nav-active') ) {
	                $('body').removeClass('mobile-nav-active');
	                $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
	                $('#mobile-body-overly').fadeOut();
	            }
	        }
	    });
	} else if ( $("#mobile-nav, #mobile-nav-toggle").length ) {
	    $("#mobile-nav, #mobile-nav-toggle").hide();
	}

	// scroll
	jQuery(function($) {

	    var $nav = $('#mobile-nav-toggle');
	    var $win = $(window);
	    var winH = $win.height();   // Get the window height.

	    $win.on("scroll", function () {
	        if ($(this).scrollTop() >= winH ) {
	            $nav.addClass("awake");
	        } else {
	            $nav.removeClass("awake");
	        }
	    }).on("resize", function(){ // If the user resizes the window
	       winH = $(this).height(); // you'll need the new height value
	    });

	});

	// Stick the header at top on scroll
	$("#nav_head").sticky({topSpacing:0, zIndex: '50'});

	// Counting numbers

	$('[data-toggle="counter-up"]').counterUp({
	  delay: 10,
	  time: 1000
	});

	// jQuery counterUp
	if(jQuery().counterUp) {
	  $('[data-counter-up]').counterUp({
	    delay: 20,
	  });
	}

	//Scroll Top link
	$(window).scroll(function(){
	  if ($(this).scrollTop() > 100) {
	    $('.scrolltop').fadeIn();
	  } else {
	    $('.scrolltop').fadeOut();
	  }
	});

	$('.scrolltop, #logo a').click(function(){
	  $("html, body").animate({
	    scrollTop: 0
	  }, 1000, 'easeInOutExpo');
	  return false;
	});

	// Swipe on Carousel
	$("#testi_carousel").swipe({
	    swipeRight: function() {
	      $(this).carousel('prev')
	    },
	    swipeLeft: function() {
	      $(this).carousel('next')
	    }
	});
});