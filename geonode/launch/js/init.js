(function($){
  $(function(){

  	// full width
  	// $('.carousel.carousel-slider').carousel({full_width: true});

  	// init modal
  	$( '.modal' ).modal({ dismissible: false });

  	// open modal
  	$( '#launch-btn' ).click(function(){

			// open modal
			$('#modal-launch').modal( 'open' );

			// open website after some loading gif
			setTimeout(function(){
				window.open( 'http://asdc.immap.org/', '_blank' );
				$( '#modal-launch' ).modal( 'close' );
			}, 8000 );

  	});

  }); // end of document ready
})(jQuery); // end of jQuery name space