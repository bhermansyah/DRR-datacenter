// Counter Number Animation
function counter_animation(){
	$('.counting').each(function () {
	    $(this).prop('Counter',0).animate({
	        Counter: $(this).text()
	    }, {
	        duration: 4000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Math.ceil(now));
	        }
	    });
	});
}

// Carousel Partner
function carousel_partner() {
	$('#carousel123').carousel({ interval: 2000 });
	$('.carousel-showmanymoveone .item').each(function(){
	    var itemToClone = $(this);

	    for (var i=1;i<3;i++) {
	    	itemToClone = itemToClone.next();

	    	// wrap around if at end of item collection
	    	if (!itemToClone.length) {
	    	  itemToClone = $(this).siblings(':first');
	    	}
	    	// grab item, clone, add marker class, add to collection
	    	itemToClone.children(':first-child').clone()
	    	  .addClass("cloneditem-"+(i))
	    	  .appendTo($(this));
	    }
	});
};

$(document).ready(function(){
	// Tooltip
	$('[data-toggle="tooltip"]').tooltip();
	// Popover
	$('[data-toggle="popover"]').popover();

	counter_animation();
});