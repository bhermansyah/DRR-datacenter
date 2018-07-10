// Accordion plus-minus
function accordionPlusMin(){
    function toggleIcon(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-minus glyphicon-plus');
    }

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
}

// More Less
function moreLess(){
  var showChar = 200;
  var ellipsestext = "...";
  var moretext = "Read more";
  var lesstext = "Less";
  $('.desc-more').each(function() {
    var content = $(this).html();

    if(content.length > showChar) {

      var c = content.substr(0, showChar);
      var h = content.substr(showChar-0, content.length - showChar);

      var html = c+'<span class="moreelipses">'+ellipsestext+'</span><span class="morecontent"><span>'+h+'</span>&nbsp;&nbsp;<a href="" class="morelink">'+moretext+'</a></span>';

      $(this).html(html);
    }

  });

  $(".morelink").click(function(){
    if($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretext);
    } else {
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
}

// Dropdown like Select
function sorting_dropdown(){
    $('.sorting-menu a').on('click', function(){
        // $(this).parent().parent().prev().html($(this).html() + ' <i class="fa fa-angle-down"></i>');
        $('.sorting-menu a').parent().parent().prev().html($(this).html() + ' <i class="fa fa-angle-down"></i>');
    })
}

// Sync control multi tab (view as)
function view_tab(){
    $('.controls-product-item .nav-tabs li a').click(function (e) {     
        //get selected href
        var href = $(this).attr('href');    
        
        //set all nav tabs to inactive
        $('.controls-product-item .nav-tabs li').removeClass('active');
        
        //get all nav tabs matching the href and set to active
        $('.controls-product-item .nav-tabs li a[href="'+href+'"]').closest('li').addClass('active');

        //active tab
        $('.search-result-container .tab-pane').removeClass('active');
        $('.search-result-container .tab-pane'+href).addClass('active');
    })
}


$(document).ready(function() {
    accordionPlusMin();
    moreLess();
    sorting_dropdown();
    view_tab();
});