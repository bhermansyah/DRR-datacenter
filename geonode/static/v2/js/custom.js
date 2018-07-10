// Go to Top
$('.gototop').click(function(event) {
	 event.preventDefault();
	 $('html, body').animate({
		 scrollTop: $("body").offset().top
	 }, 500);
});
//End go to top

// Add active class based on current page
function addActive(){
	var pathname= window.location.pathname;
	var search= window.location.search;
	var fullpath= pathname+search;
	var path_baseline = '?page=baseline';
	var hrefpath= $('nav.navbar-upper .nav>li>a')[0].pathname;
	// if (hrefpath==pathname) {
	// 	$('nav.navbar-upper .nav>li>a').parent().addClass('active');
	// }
	// $('nav.navbar-upper .nav>li>a[href="'+fullpath+'"]').parent().addClass('active');
	if (window.location.href.match(/\/dashboard\/*/)) {
		$('nav.navbar-upper .nav>li>a[href="'+pathname+path_baseline+'"]').parent().addClass('active');
	}

	if (window.location.href.match(/\/layers\/*/)) {
		$('nav.navbar-upper .nav>li>a[href="'+pathname+'"]').parent().addClass('active');
	}

	if (window.location.href.match(/maps*/) || window.location.href.match(/documents*/) || window.location.href.match(/partners*/) || window.location.href.match(/documentation*/) || window.location.href.match(/training*/) || window.location.href.match(/about*/) || window.location.href.match(/disclaimer*/)) {
		$('nav.navbar-upper .nav .dropdown-menu>li>a[href="'+pathname+'"]').parent().parent().parent().addClass('active');
	}
};



$(document).ready(function () {
	addActive();
});