jQuery(function($) {
  setupMenus();
  $(window).resize(function() {
    setupMenus();
  });
  function setupMenus() {
    if (window.innerWidth <= 991) {
      $(".europe-country ul:nth-child(2)  > li").addClass("moved-item"); //tag moved items so we can move them back
      $(".europe-country ul:nth-child(2)  > li").appendTo(
        ".europe-country ul:first-child"
      );
      $(".europe-country ul:nth-child(2)").hide();
    }
    if (window.innerWidth > 991) {
      $(".europe-country ul, .europe-country ul:nth-child(2)").removeAttr(
        "style"
      );     
      $(".europe-country ul:nth-child(2)").show();
      $(".europe-country ul > li.moved-item").appendTo(
        ".europe-country ul:nth-child(2)"
      );
    }
  }
});

jQuery(function($) {
  setupMenusTwo();
  $(window).resize(function() {
    setupMenusTwo();
  });
  function setupMenusTwo() {
    if (window.innerWidth <= 991) {
      $(".europe-country ul:nth-child(4)  > li").addClass("moved-itemtwo"); //tag moved items so we can move them back
      $(".europe-country ul:nth-child(4)  > li").appendTo(
        ".europe-country ul:nth-child(3)"
      );
      $(".europe-country ul:nth-child(4)").hide();
    }
    if (window.innerWidth > 991) {
      $(
        ".europe-country ul:nth-child(3), .europe-country ul:nth-child(4)"
      ).removeAttr("style");      
      $(".europe-country ul:nth-child(4)").show();
      $(".europe-country ul:nth-child(3) > li.moved-itemtwo").appendTo(
        ".europe-country ul:nth-child(4)"
      );
    }
  }
});

jQuery(function($) {
  $(".key-summery-row .keysummerycolumn .left img").appendTo(
    ".key-summery-row .keysummerycolumn .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn1 .left img").appendTo(
    ".key-summery-row .keysummerycolumn1 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn2 .left img").appendTo(
    ".key-summery-row .keysummerycolumn2 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn3 .left img").appendTo(
    ".key-summery-row .keysummerycolumn3 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn4 .left img").appendTo(
    ".key-summery-row .keysummerycolumn4 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn5 .left img").appendTo(
    ".key-summery-row .keysummerycolumn5 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn6 .left img").appendTo(
    ".key-summery-row .keysummerycolumn6 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn7 .left img").appendTo(
    ".key-summery-row .keysummerycolumn7 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn8 .left img").appendTo(
    ".key-summery-row .keysummerycolumn8 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn9 .left img").appendTo(
    ".key-summery-row .keysummerycolumn9 .subHeader h2"
  );
  $(".key-summery-row .keysummerycolumn10 .left img").appendTo(
    ".key-summery-row .keysummerycolumn10 .subHeader h2"
  );
});
/********************* Key Summary Carousel ****************************/
$(window).resize(function() {
  acc_More();
});
$(document).ready(function() {
  var viewport = jQuery(window).width();
  var itemCount = jQuery(".key-summery-row .owl-item").length;
  if (
    (viewport >= 992 && itemCount > 3) || //desktop
    (viewport < 991 && itemCount > 1) //mobile
  ) {    
    jQuery(".key-summery-row .owl-nav").show();
  } else {
    jQuery(".key-summery-row .owl-nav").hide();
  }
  
  $(".more-four.autoowl .key-summery-row").owlCarousel({
     loop:true,      
    responsiveClass: true,      
    animate: 'slide',
    // autoplay:true,
    // autoplayTimeout:2500,
    // autoplayHoverPause:false,
    pagination:false,
     nav: true,
     navText: [
      "<span class='left-arrow'></span>",
     "<span class='right-arrow'></span>"
    ],
     responsive: {
      0: {
         items: 1
     },
      600: {
        items: 2
      },
      992: {
       items: 3
      },
      1200: {
       items: 4
        }
     }    
   });

   /* ends here auto scroll */
  $(".more-four .key-summery-row").owlCarousel({
    loop:true,      
    responsiveClass: true,      
    animate: 'slide',
    autoplay:false,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    pagination:false,
    nav: true,
    navText: [
      "<span class='left-arrow'></span>",
      "<span class='right-arrow'></span>"
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 3
      },
      1200: {
        items: 4
      }
    }    
  });
  $(".less-four .key-summery-row").owlCarousel({
    loop:false,      
    responsiveClass: true,      
    animate: 'slide',
    autoplay:false,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    pagination:false,
    nav: true,
    navText: [
      "<span class='left-arrow'></span>",
      "<span class='right-arrow'></span>"
    ],
    responsive: {
      0: {
        items: 1,
        loop:true, 
      },
      992: {
        items: 3
      },
      1200: {
        items: 4
      }
    }    
  });
  $(".ml-gsr-topbanner-mobile a#scroll").on("click", function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();
      // Store hash
      var hash = this.hash;
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top - 30
        },
        800,
        function() {
          // Add hash (#) to URL when done scrolling (default click behavior)
          //window.location.hash = hash;
        }
      );
    } // End if
  });
  $(".select-btn").click(function() {
    $(".dropdown-menu").slideToggle();
    $(this).toggleClass("select-open");
  });
  $(".dropdown-menu li").click(function() {
    $(".select-btn").html(
      $(this)
        .find("a")
        .html()
    );
    $(".dropdown-menu").slideUp();
    $(".select-btn").removeClass("select-open");
  });
});
/* Seconday Layer Sticky Navigation*/
$(".sticky-gsr-holder .fullnavbar").prepend("<div id='sticky-anchor'></div>");
function sticky_relocate() {
  if ($(".sticky-gsr-holder")[0]) {
    var window_top = $(window).scrollTop();
    var div_top = $("#sticky-anchor").offset().top - 280;
    if (window_top > div_top) {
      $(".navarea").addClass("stick");
      $(".fullnavbar").addClass("holder-stick");
    } else {
      $(".navarea").removeClass("stick");
      $(".fullnavbar").removeClass("holder-stick");
    }
  }
}
$(window).scroll(function() {
  sticky_relocate();
  if($(".mylan-worldwide-btn").hasClass("mylan-worldwide-panel-open")){
    $(".sticky-gsr-holder .navarea.stick").css("position", "relative");
  }
  else{
    $(".sticky-gsr-holder .navarea.stick").removeAttr("style");
  }
});
$(document).ready(function() {
  var sections = $(".gsr2-content-section"),
      nav = $(".holder-stick nav"),
      nav1 = $(".gs-navholder .gs-navbox .btn-v2"),
      nav4 = $(".gs-navholder .gs-navbox .big-link-image"),
      nav2 = $("#mainlinkmenu .navarea"),
	    nav3 = $(".mobile-top-left-navigation .mobile-left-all-link .fullnavbar .navarea nav ul li"),	
      nav_height = nav.outerHeight();
  $(window).on("scroll", function() {
    var cur_pos = $(this).scrollTop();
    sections.each(function() {
      var top = $(this).offset().top - nav_height - 135,
          bottom = top + $(this).outerHeight();
      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find("a").parent().removeClass("active");
        sections.removeClass("active");
        $(this).parent().addClass("active");
        nav.find('a[href="#' + $(this).attr("id") + '"]').parent().addClass("active");
      }
    });
  });
  nav.find("a").on("click", function() {
    var $el = $(this),
        id = $el.attr("href");
    $("html, body").animate(
      {
        scrollTop: $(id).offset().top - nav_height - 115
      },
      500
    );
    return false;
  });
  nav1.find("a").on("click", function() {
    var $el = $(this),
        id = $el.attr("href");
    $("html, body").animate(
      {
        scrollTop: $(id).offset().top - nav_height - 115
      },
      500
    );
    return false;
  });
  nav4.find("a").on("click", function() {
    var $el = $(this),
        id = $el.attr("href");
    $("html, body").animate(
      {
        scrollTop: $(id).offset().top - nav_height - 115
      },
      500
    );
    return false;
  });
  nav2.find("a").on("click", function() {
    var $el = $(this),
        id = $el.attr("href");
    $("html, body").animate(
      {
        scrollTop: $(id).offset().top - nav_height - 135
      },
      500
    );
    return false;
  });
  nav3.find("a").on("click", function() {
    var $el = $(this),
        id = $el.attr("href");
    $("html, body").animate(
      {
        scrollTop: $(id).offset().top - nav_height - 90
      },
      500
    );
    return false;
  });
  $(document).click(function(event) {
    if (
      !$(event.target).closest(
        ".maptitle .filter .dropdown-menu, .maptitle .filter .select-btn"
      ).length
    ) {
      $(".dropdown-menu").slideUp();
      $(".select-btn").removeClass("select-open");     
    } else {    
    }
  });
    /// use for previous link id
  $('.ml-gsr-third-top-banner ul li').first().addClass('arrowback');
  $('.mobile-left-all-link ul li').first().addClass('arrowback');
  
    //add class for Expander box
  $('.promoexpan .caption div:eq(0)').addClass('expand-one')
  $('.promoexpan .caption div:eq(1)').addClass('expand-two');
  $('.wastewater .caption div').addClass('manage-exp');
  $('.doing-help .caption div').addClass('doinghelp-exp');
});
/* Word Ellipsis for grid navigation on second layer page */
function acc_More() {
  if ($(window).width() < 1200) {
    $(".readMoreacc").remove();
    //This limit you can set after how much characters you want to show Read More.
    var carLmt = 100;
    // Text to show when text is collapsed
    var readMoreTxt = " <span class='dot'>...</span>";
    // Text to show when text is expanded
    var readLessTxt = " ";

    //Traverse all selectors with this class and manupulate HTML part to show Read More
    jQuery(".gs-navholder .gs-navbox .btn-v2 a span").each(function() {
      if (jQuery(this).find(".firstSecacc").length) return;

      var allstr = $(this).text();
      if (allstr.length > carLmt) {
        var firstSet = allstr.substring(0, carLmt);
        var secdHalf = allstr.substring(carLmt, allstr.length);
        var strtoadd =
          firstSet +
          "<span class='SecSecacc'>" +
          secdHalf +
          "</span><span class='readMoreacc'>" +
          readMoreTxt +
          "</span><span class='readLessacc'>" +
          readLessTxt +
          "</span>";
        jQuery(this).html(strtoadd);
      }
    });
  }
  else{
    $(".gs-navholder .gs-navbox .btn-v2 a span").removeAttr("class");
  }
}
jQuery(function() {
  //Calling function after Page Load
  acc_More();
});
(function($) {
  $(window).on("load", function() {
    $(".content-section-wapper").mCustomScrollbar({
      theme: "minimal"
    });
  });
})(jQuery);

$(document).ready(function() {
  /* ACCORDIONS (aka EXPANDERS) */ 
    $('.leadership-tabs .state-1 .accordion .handle').addClass("expanded");
    $('.leadership-tabs .state-1 .accordion .handle').siblings(".pane").addClass("expanded");
});
/* third page js for mobile section */
 var mylan_site = window.mylan_site || {};
(function(n, t) {
    function r() {
        var r ;
        t(".mobile-left-single-link .navarea a").click(function(event) {
            event.preventDefault();
            var r = t(".mobile-left-all-link"),
                u = t(this);
            n.expandDropdown(r, u)
        });
    }
    function e() {
        r();
    }
    n.expandDropdown = function(n, t) {
        n.is(":visible") ? (n.slideUp(500), t.removeClass("open")) : (n.slideDown(500), t.addClass("open"))
    };
    t(e)
})(mylan_site, jQuery);
/*GSR Landing FAQ Accordion*/
(function($) {      
  $('#faq-section-landing .accordion .handle').click(function() {
      $(this).closest(".accordion").siblings().find(".handle, .pane").removeClass('expanded');
      $(this).closest(".accordion").siblings().find(".pane").slideUp();    
      $(this).siblings().slideToggle();          
  });

})(jQuery);
/*Scroll to ID on other Page*/
$(document).ready(function () {
    var header_height = $(".header > .grid").outerHeight();
    var length = $(window.location.hash).length;
    if (length > 0) {
        $('html,body').animate({
            scrollTop: $(window.location.hash).offset().top - header_height - 30
        });
    }
  $(".gsr2_tab_section .tabbed-interface .tabs .tab > h3 > a").click(function() {
    $('html,body').stop( true, true ).animate();
  });
});

$(document).ready(function () {
var distance = $('div').offset().top,
    $window = $(window);

$window.scroll(function() {
    if ( $window.scrollTop() >= distance ) {
        jQuery(".sticky-gsr-holder .navarea.stick").removeClass("mylan-worldwide-panel-open"); 
    }
});
});

/* add class for carousel and mini navigation for inner page */
$(document).ready(function() {
	$('.page-wrap-inner .main-wrap .col-3of4 .pageWrap-inner').addClass('mln-pagecustom-carousel');

	if($('.page-wrap-inner .main-wrap .col-3of4 .pageWrap-inner').hasClass('mln-pagecustom-carousel')) {
		$('.page-wrap-inner .main-wrap .grid .col-1of4').addClass('mln-custom-sidebar');
	} else {
		$('.page-wrap-inner .main-wrap .grid .col-1of4').removeClass('mln-custom-sidebar')
	}
})

// close button for mylan world wide 

// mylan worldwide panel js for height using js
$(document).ready(function() {
	
if ($(window).width() < 769) {	
	$('.mylan-worldwide-panel').css('height', $(window).height());
	$('.nav-list.lvl-1.mCustomScrollbar').height($(window).height() - $('.header.fixed').height());
}
	
$(".ml-close-button").click(function(){
	 if ($(window).width() < 769) {
		   $('.mylan-worldwide-panel').css('height', '0'); 	
		}
});

$(".mylan-worldwide-btn").click(function(){
	 if ($(window).width() < 769) {
				  $('.mylan-worldwide-panel').css('height', $(window).height());
				  console.log("header height");				  
		}
});

$(window).resize(function(){
		if ($(window).width() < 769) {
			$('.mylan-worldwide-panel').css('height', $(window).height());
			$('.nav-list.lvl-1.mCustomScrollbar').height($(window).height() - $('.header.fixed').height());
		}
});

})
