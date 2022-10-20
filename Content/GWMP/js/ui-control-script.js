
var GWMP = GWMP || {};
GWMP.ui = {
    imagePath: '',
    previewMode: false,
    isMobile: false,
    isHome: false,
    flyoutIsActive: false,
    cookieWarningIsActive: false,
    cookieWarningHeight: 0,
    cookieWarningEnabled: false,
    mobileNavIsActive: false,

    openFlyout: function (f) {
        var self = this;
        f.show();
        if (!self.isMobile) {
            //I don't really like this b/c it makes the layout jump a bit, but it's what DH is doing
            $('html, body').css('overflow-y', 'hidden');
        }
        self.flyoutIsActive = true;
    },
    closeFlyout: function (f) {
        var self = this;
        f.hide();
        if (!self.isMobile) {
            $('html, body').css('overflow-y', 'auto');
        }
        self.flyoutIsActive = false;
    },
    openLanguageSelector: function () {
        var self = this;
        self.openFlyout($('.language-flyout'));
    },
    closeLanguageSelector: function () {
        var self = this;
        self.closeFlyout($('.language-flyout'));
    },
    initializ: function () {
        var self = this;
        self.imagePath = "/-/media/images/";
        self.previewMode = false;
        self.isMobile = parseInt($('.jsHook-mobile').css('z-index'));
        self.flyoutIsActive = false;
        self.isHome = $('body').hasClass('home');
        self.cookieWarningIsActive = false;
        self.cookieWarningHeight = parseInt($('.jsHook-cookie').css('z-index'));
        self.mobileNavIsActive = false;
        self.cookieWarningEnabled = false;

        var cookieDiv = $(".cookie-warning");
        if (cookieDiv != null && cookieDiv.length > 0) {
            self.cookieWarningIsActive = sessionStorage['cookieWarningIsActive'];
            if (self.cookieWarningIsActive) {
                self.cookieWarningEnabled = false;
            } else {
                self.cookieWarningEnabled = true;
            }
        }
    }
};

var Interstitials = {
    SelfCertifications: [],
    Externals: [],
    Internals: [],
    AddSelfCertification: function (selfCert) {
        Interstitials.SelfCertifications.push(selfCert);
    }
}

var SelfCertificationInterstitial = function () {
    this.Id = "";
    this.GatedUrls = [];
    this.GatedInternalUrls = [];
    this.Preempt = true;
};

function closeInterstitialPopup() {
    $('.interstitial , #interstitial-overlay').fadeOut();
}

function hcpConnectPopup($popElem) {
    $('.interstitial:not("#viatrisInterstitial")').fadeOut(0);
    $popElem.fadeIn();
    $('#interstitial-overlay').fadeIn();
}

function displayOntheGoPopupIfAvailable() {
    if ($("#onTheGoPopUP").length > 0) {
        $("#interstitial-overlay").show();
        $('#onTheGoPopUP').fadeIn();
    }
}

$(document).ready(function () {




    //'jsHook' elements are used to enable some css-->js communication.
    $('body').append('<div class="jsHook-mobile"></div><div class="jsHook-cookie"></div>');

    GWMP.ui.initializ();

    //get any url params, for later use
    var urlParams;
    (window.onpopstate = function () {
        var match, pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g, decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            }, query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();

    //is it any version of IE, whatsoever?

    //function checkIsIE() {
    //var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
    //}
    //checkIsIE();

    function detectIE() {
        var isIE = false;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');

        if (msie > 0) {
            isIE = true;
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);    
        }
        if (trident > 0) {
            isIE = true;
            // IE 11 (or newer) => return version number
            //var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        if (isIE) {
            $('html').addClass('isIE');
        }
        // other browser
        //return false;
    }
    detectIE();

    function moveSearch() {
        //TOFU: Design calls for the global search bar to transmographize itself into the nav in mobile states only...
        if (GWMP.ui.isMobile) {
            $('.nav-module .nav').before($('.header .searchBar.search-module'));
        } else {
            $('.header .language-select-module').after($('.nav-module .searchBar.search-module'));
        }
    };
    function applyMobileClasses() {
        if (GWMP.ui.isMobile) {
            $('body').addClass('mobileState');
        } else {
            $('body').removeClass('mobileState');
        }
    };
    function checkViewPortClass(a) {//called once on page load and whenever a resize occurs. 'a' indicates why the function was called (page load or window resize?)
        // 1. script that happens repeatedly during resize...
        //get before and after...
        var before = GWMP.ui.isMobile;
        GWMP.ui.isMobile = parseInt($('.jsHook-mobile').css('z-index'));
        var after = GWMP.ui.isMobile;

        if (a) {//if 'a' is true, this function was called by a window resize...
            if (before !== after) {
                // 2. script that happens whenever the viewport class changes
                moveSearch();
                applyMobileClasses();

                if (GWMP.ui.flyoutIsActive) {
                    if (GWMP.ui.isMobile) {
                        $('html, body').css('overflow-y', 'auto');
                    } else {
                        $('html, body').css('overflow-y', 'hidden');
                    }
                }
            }
        } else {// 'a' is false. Function was called by init
            // 3. script that happens on initial load
            moveSearch();
            applyMobileClasses();
        }
    };
    //init
    checkViewPortClass(0);

    function checkScroll() {
        var scrollVal = $(this).scrollTop();

        if (scrollVal > 50) {//TODO: this can't be a fixed number because the image is scalable
            //need to detect when the image is scrolled offscreen regardless of how tall it currently may be
            //switch the header bar logo to on
            $('section.header').addClass('scrolled');
        } else {
            $('section.header').removeClass('scrolled');
        }
    };

    //navigation
    $('.nav-activator.lvl-1').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.nav-list.lvl-1').toggleClass('active');
    });
    $('.nav-toggle').click(function (e) {
        e.preventDefault();

        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
            $(this).parent().next().removeClass('active');
        } else {
            $('.lvl-2.active').removeClass('active');
            $(this).parent().addClass('active');
            $(this).parent().next().addClass('active');
        }

    });

    //mobile navigation
    $('.mobile-nav-toggle').click(function () {

        if (!GWMP.ui.mobileNavIsActive) {
            $('body').addClass('mobileNavIsActive');
            //TOFU: the mobile nav toggle button transmographizes itself into the header bar when activated.
            $('.language-select-module').after($(this));
            GWMP.ui.mobileNavIsActive = true;
        } else {
            $('body').removeClass('mobileNavIsActive');
            $(this).prependTo($('.nav-module'));
            GWMP.ui.mobileNavIsActive = false;
        }

        // force redraw/repaint - fixes a webkit issue        
        $('.page-wrap-inner').hide().show(0);
    });

    /*COOKIE WARNING*/
    if (GWMP.ui.cookieWarningEnabled) {

        $('.cookie-warning').show();
        $('body').addClass('cookieWarningActive');

        //If cookie-warning-withOverlay then execute this, else check for next one
        if (document.getElementById('cookie-warning-withOverlay')) {
            //alert('cookie is with Overlay');
            if (GWMP.ui.isMobile) {
                $('#cookie-warning-withOverlay').css('height', '0px');
                $('#cookie-warning-withOverlay .inner').css('background', '#ededed');
                $('.nav-module').css('display', 'none');
            }
            //if in preview mode, don't shift .main-wrap
            if (GWMP.ui.previewMode == true) {
            } else {

                $('.cookie-warning .close, .cookie-warning .continue').click(function (e) {
                    e.preventDefault();
                    $('.cookie-warning').hide();

                    $('body').removeClass('cookieWarningActive');

                    $('section.header').css('top', '0');
                    $('.nav-module').css('display', 'block');
                    //TODO: might be cleaner to do this with a body class such as "cookieWarningActive" and keep the css out of the js... but this works for now.
                    // But, for all I know at this point, they may ask for the cookie warning to be a modal popup instead. So hold off.

                    if ($(this).hasClass('continue')) {
                        sessionStorage['cookieWarningIsActive'] = true;
                    }
                });
            }
        } else {
            $('section.header').css('top', GWMP.ui.cookieWarningHeight + 'px');
            $('section.main-wrap').css('margin-top', GWMP.ui.cookieWarningHeight + 50 + 'px');
            if (GWMP.ui.isHome) {
                $('.nav-module').css('margin-top', GWMP.ui.cookieWarningHeight + 'px');
                //because .nav-module is NOT nested under .main-wrap on the home page layout
            }

            //if in preview mode, don't shift .main-wrap
            if (GWMP.ui.previewMode == true) {
                $('.main-wrap').css('margin-top', '0');
            } else {
                //not in preview mode, so do the rest of the setup

                //if cookie warning is open, the flyouts must be shifted down
                $('.language-flyout').css('top', GWMP.ui.cookieWarningHeight + 'px');
                $('.language-flyout .pane').css('top', GWMP.ui.cookieWarningHeight + 50 + 'px');

                $('.cookie-warning .close, .cookie-warning .continue').click(function (e) {
                    e.preventDefault();
                    $('.cookie-warning').hide();

                    $('body').removeClass('cookieWarningActive');

                    $('section.header').css('top', '0');

                    if (GWMP.ui.isHome) {
                        $('.nav-module').css('margin-top', '0');
                        //because .nav-module is NOT nested under .main-wrap on the home page layout
                    }

                    if (GWMP.ui.isMobile === 1) {
                        $('section.main-wrap').css('margin-top', '0');
                    } else {
                        $('section.main-wrap').css('margin-top', '50px');
                    }

                    //if cookie warning is open, the flyouts must be shifted down. (shift them back up on close)
                    $('.language-flyout').css('top', '0');
                    $('.language-flyout .pane').css('top', '50px');

                    //TODO: might be cleaner to do this with a body class such as "cookieWarningActive" and keep the css out of the js... but this works for now.
                    // But, for all I know at this point, they may ask for the cookie warning to be a modal popup instead. So hold off.

                    if ($(this).hasClass('continue')) {
                        sessionStorage['cookieWarningIsActive'] = true;
                    }
                });
            }
        }
    }

    /* SITE SEARCH */
    $('.search-form .search input').click(function () {
        $(this).val(' ');
        $(this).removeClass('placeholder-text');
    });

    /* NAVIGATION */
    //highlight current page in nav
    var currentTree = $('.nav-module .nav .current');
    currentTree.each(function (i, el) {
        $(el).addClass('active');
        $(el).next().addClass('active');

        if (i < (currentTree.length - 1)) {
            $(el).removeClass('current');
        }
    });
    /*
	$('.nav-activator.lvl-2.current').addClass('active');
	$('.nav-activator.lvl-2.current').next().addClass('active');

	$('.nav-list.lvl-2 > li > a.current').parent().parent().addClass('active');
	$('.nav-list.lvl-2 > li > a.current').parent().parent().prev().addClass('active');

	$('.nav-list.lvl-3 > li > a.current').parent().parent().addClass('active');
	$('.nav-list.lvl-3 > li > a.current').parent().parent().prev().addClass('active');
	$('.nav-list.lvl-3 > li > a.current').parent().parent().parent().parent().addClass('active');
	$('.nav-list.lvl-3 > li > a.current').parent().parent().parent().parent().prev().addClass('active');
	*/
    /* FLYOUTS */
    //generic functions for opening/closing flyout tabs, i.e. header bar language selector, login (pending dev)


    /* LANGUAGE SELECTOR FLYOUT */
    $('.language-flyout').appendTo("body");
    // ^^^ the html gets nested under the language selector module, but we move it once the DOM is loaded
    $('.language-select-module').click(function () {
        GWMP.ui.openFlyout($('.language-flyout'));
    });
    $('.language-flyout .tab, .language-flyout .close').click(function () {
        GWMP.ui.closeFlyout($('.language-flyout'));
    });

    /* TABBED INTERFACE */
    $('.tabs .tab').click(function (e) {
        //get target from data-state attribute of .tab
        var state = $(this).data("state");
        //hide all states
        $(this).parent('.tabs').next('.pane').children('.state').removeClass('active');
        //show the target state
        $(this).parent('.tabs').next('.pane').children(state).addClass('active');
        //update active class
        $('.tabs .tab').removeClass('active');
        $(this).addClass('active');

        e.preventDefault();

        //Script to remove the Hash from the URL - Start Here
        if (window.location.hash != "") {
            location.hash = "";
            $('html, body').animate({ scrollTop: $(".tabs").offset().top - 100 }, 0);
        }
        //Script to remove the Hash from the URL - End Here
    });

    /* ACCORDIONS (aka EXPANDERS) */
    $('.accordion .handle').click(function () {
        $(this).toggleClass('expanded');
        $(this).siblings('.pane').toggleClass('expanded');
    });

    /*INTERSTITIAL POPUP*/
    $("body").append("<div id='interstitial-overlay' alt='Close Window' title='Close Window'></div>");
    $("a").click(function (e) {
        var thishostname = window.location.hostname;
        var currentLink = $(this).attr('href');
        var protocolAgnosticLink = currentLink.replace(/http(s)?\:\/\//i, '');
        var currentId = $(this).attr('id');
        if (currentLink != undefined && currentLink != "" && currentLink != "/" && currentLink != "#" && !$(this).hasClass("interstitial-anchor") && !$(e.srcElement).hasClass("nav-toggle")) {
            var currentpathArray = $.trim(currentLink).split('/');

            var selfCertPreempt = false;
            var selfCertTriggered = false;
            $.each(Interstitials.SelfCertifications, function (i, el) {
                var inGated = ($.inArray(protocolAgnosticLink, el.GatedUrls) > -1);
                var inGatedInternal = ($.inArray(protocolAgnosticLink, el.GatedInternalUrls) > -1);
                if (inGated || inGatedInternal) {
                    $("#interstitial-overlay").show();
                    $("#self_cert_interstitial_" + el.Id).show();
                    $("#self_cert_interstitial_" + el.Id + " .continue a").attr('href', currentLink);
                    var targetVal = '_blank';
                    if (inGatedInternal) {
                        targetVal = '_self';
                    }
                    $("#self_cert_interstitial_" + el.Id + " .continue a").attr('target', targetVal);
                    selfCertPreempt = el.Preempt;
                    selfCertTriggered = true;
                    e.preventDefault();
                }
            });

            if (selfCertPreempt) return; /* Do not try to trigger the external interstitial if set to preempt - still experimental. Not suggested for production. */

            var found1 = $.inArray('http:', currentpathArray);
            var found2 = $.inArray('https:', currentpathArray);
            if (found1 > -1 || found2 > -1) {
                var currentdomain = currentpathArray[2];
                if (typeof __externalInterstitialWhitelist != 'undefined' && $.inArray(currentdomain, __externalInterstitialWhitelist) > -1)
                    return;
                if (thishostname != currentdomain) {
                    $("#interstitial-overlay").show();
                    $(".external-interstitial").show();
                    $(".external-interstitial .continue a").attr('href', currentLink);
                    if (selfCertTriggered) {
                        $('.self-cert-interstitial .continue a').click(function (event) {
                            event.preventDefault();
                            $(this).closest('.self-cert-interstitial').hide();
                        });
                    }
                    e.preventDefault();
                }
            }
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $("#interstitial-overlay").hide();
            $(".interstitial").hide();
        }
    });

    $(".interstitial .cancel a, #interstitial-overlay").click(function (e) {
        $("#interstitial-overlay").hide();
        $(".interstitial").hide();
        e.preventDefault();
    });

    $(".interstitial .continue a").click(function (e) {
        $(this).closest(".interstitial").hide();
        if ($(".interstitial").filter(':visible').length < 1) {
            $("#interstitial-overlay").hide();
        }
    });

    /* SELECTRIC (CUSTOM SELECTS PLUGIN) */
    //initialize selectric
    $('select.selectric').selectric({
        maxHeight: 200,
        onOpen: function () {
            checkSelectricState();
        },
        onClose: function () {
            checkSelectricState();
        }
    });
    //we need to wrap it a second time to do the outline effect
    $('.selectricWrapper').wrap("<div class='selectricOuter'></div>");
    function checkSelectricState() {
        //adds the active class to the selectricOuter div
        $('.selectricWrapper').parent().removeClass('active');
        $('.selectricWrapper.selectricOpen').parent().addClass('active');
    };

    /* SUPPLEMENTS "LOCAL" CAROUSEL */
    //detect if text is two long to fit on one line, if so, append "twoline" class to .carousel-text-hd
    function checkLocalCarouselHeadline(h) {
        hh = h.height();
        if (hh > 38) {
            h.parent().parent().addClass("twoLine");
        } else {
            h.parent().parent().removeClass("twoLine");
        }
    };
    function checkAllCarouselHeadlines() {
        $('.carousel-text-hd h2.hdg').each(function () {
            checkLocalCarouselHeadline($(this));
        });
    };

    /*plus resources pharmacy resources - currently only on Canada*/
    $('.ce-course-expander-toggle').click(function () {
        $(this).toggleClass('active');
        $(this).next('.ce-course-expander-content').toggleClass('active');
    });

    /* Leadership Tabs cross-linking functions */
    $('.leadership-tabs.master .accordion .always-visible .links > a').click(function (e) {
        e.preventDefault();
        target = $(this).attr('href');
        linkToCommittee(target);
    });

    $('.leadership-tabs.master .committees-list > .inner > ul > li > .left > .inner > .members > a').click(function (e) {
        e.preventDefault();
        target = $(this).attr('href');
        linkToProfile(target);
    });

    function linkToCommittee(target) {
        //get ready to switch tabs - remove active classes...
        $('.pane > .state.active').removeClass('active');
        $('.tabs > .tab.active').removeClass('active');
        targetCommittee = $('#' + target);

        //find parent pane of target (4 levels up)...
        targetTabState = targetCommittee.parent().parent().parent().parent();
        //show the parent pane...
        targetTabState.addClass('active');
        //use parent pane data attribute to find and display its corresponding tab...
        targetTab = targetTabState.data('tab');
        $(targetTab).addClass('active');

        //Scroll to target
        scrollToAnchor(target);
    }

    function linkToProfile(target) {
        //get ready to switch tabs - remove active classes...
        $('.pane > .state.active').removeClass('active');
        $('.tabs > .tab.active').removeClass('active');
        targetAccordion = $('#' + target);

        //temporarily commented out because we are replicating a bug until we are asked to fix it. Uncomment and remove next line to fix.
        //find parent pane of target (4 levels up)...
        targetTabState = targetAccordion.parent().parent().parent().parent();

        //temp added to replicate bug, remove above and uncomment below to replicate bug
        //(always select tab 3 regardless of actual target location)
        //targetTabState = $('.leadership-tabs.master > div > .pane > .state-3');

        //show the parent pane...
        targetTabState.addClass('active');
        //use parent pane data attribute to find and display its corresponding tab...
        targetTab = targetTabState.data('tab');
        $(targetTab).addClass('active');

        //find the handle and pane elements of the target accordion...
        targetAccordionHandle = targetAccordion.find('.handle');
        targetAccordionPane = targetAccordion.find('.pane');
        //activate the accordion...
        targetAccordionHandle.addClass('expanded');
        targetAccordion.find('.pane').addClass('expanded');

        //Scroll to target
        scrollToAnchor(target);
    }

    /* A sort of hack to prevent natural hash scrolling on page load (i.e. for anchor links directing to an anchor on a different page) 
    DISABLED PENDING APPROVAL AND QA ALLOCATION FOR REGRESSION TESTING
    if (location.hash) {
        setTimeout(function () {
            window.scrollTo(0, 0);
            //then call the scrollToAnchor function, removing the # first
            hashValue = (location.hash).substr(1);
            scrollToAnchor(hashValue);
        }, 1);
    }
    */

    /* Searches out and applies the Scroll To Anchor function to all hash links that target an ID on the same page 
    DISABLED PENDING APPROVAL AND QA ALLOCATION FOR REGRESSION TESTING
    $('a').each(function () {
        linkHref = $(this).attr('href');
        if (linkHref) {
            // Only if the link has an href (because some a's may not)...
            // check the first character...
            firstChar = linkHref.substr(0, 1);
            // If the first character is a # but the entire href is not #
            if (firstChar == "#" && linkHref != "#") {
                // ...then it must be a link to an anchor on the same page. So assign a click function to the <a>
                $(this).click(function (e) {
                    e.preventDefault();
                    target = $(this).attr('href').substr(1);
                    scrollToAnchor(target);
                });
            }
        }
    });
    */

    //Potentially reusable scroll to anchor function - currently only used on mylan.com leadership tabs
    function scrollToAnchor(target) {
        console.log('scrollToAnchor');
        //find y position of target
        yPos = $('#' + target).offset().top;
        //are we in mobile state? If not, get height of fixed header bar, and adjust yPos to compensate
        if (!GWMP.ui.isMobile) {
            headerBarHeight = $('.page-wrap-outer > .page-wrap-inner > section.header').height();
            // subtract headerbar height and then an additional 5 px for good measure
            yPos = yPos - headerBarHeight - 5;
            //just to be safe...
            if (yPos < 0) {
                yPos = 0;
            }
        }
        $(window).scrollTop(yPos);
    }

    //reusable Tooltip Popup - see mylan.com contact form (markup manually entered to content on 10-K checkbox field)
    $('.tooltipTrigger').click(function () {
        if (!$(this).parent('.tooltipPopupContainer').hasClass('active')) {
            //show tooltip
            $(this).parent('.tooltipPopupContainer').addClass('active');
            //position tooltip...
            x = $(this).offset().left;
            y = $(this).offset().top;
            if (!GWMP.ui.isMobile) {
                $(this).next('.tooltipPopup').css('left', x - 20 + 'px');//similar to mylan.com implementation
                $(this).next('.tooltipPopup').css('top', y - 100 + 'px');//similar to mylan.com implementation
            } else {
                $(this).next('.tooltipPopup').css('left', '15px');//enhancement- always position against left edge of page in mobile to prevent it from going off the right edge
                $(this).next('.tooltipPopup').css('top', y - 50 + 'px');
            }
        } else {
            //hide tooltip
            $(this).parent('.tooltipPopupContainer').removeClass('active');
        }
    });

    $('.tooltipPopup .closeBtn').click(function () {
        $(this).parent().parent('.tooltipPopupContainer').removeClass('active');
    });

    /* ------- IE8 & 9 HACKS -------- */
    if ($('html').hasClass('lt-ie10')) {

        //SEARCH BAR: hide mock placeholder when input is clicked
        $('.searchBar.search-module input').focusin(function () {
            $('.searchBar.search-module .ie8-ie9-only').hide();
        });
        $('.searchBar.search-module input').focusout(function () {
            v = this.value;
            if (v == "") {
                $('.searchBar.search-module .ie8-ie9-only').show();
            }
        });

        //value is passed through after submit button is pressed, and overlaps mock placeholder on search results page. So hide mock placeholder if a value exists on page load...
        $('.searchBar.search-module input:eq(2)').each(function () {
            v = this.value;
            if (v == "" || v == null || v == undefined) {
                //do nothing
            } else {
                $('.searchBar.search-module .ie8-ie9-only').hide();
            }
        });

        //ie8 does not respect the z-index, this prevents input from being clickable while the mock placeholder is showing
        //so we will add a click function to the placeholder itself, in ie8 only
        if ($('html').hasClass('ie8')) {

            $('.searchBar.search-module .ie8-ie9-only').click(function () {
                $(this).hide();
                $('.searchBar.search-module input:eq(2)').focus();
            });
        }
    }

    /* ------- OTHER UI HACKS -------- */
    /*this is a hack for dealing with empty captions, which, unfortunately, are widespread*/
    $('.caption').each(function () {
        if (($.trim($(this).text()) == "")) {
            $(this).addClass('empty');
        }
    });
    /*
    $('h2').each(function () {
        if (($.trim ($(this).text()) == "")) {
            $(this).addClass('empty');
        }
    });*/

    /* =================== ALL WINDOW LISTENERS GO HERE =================== */
    // aka the performance nightmare section
    // our hand was forced by creative decisions outside of our control
    $(window).resize(function () {
        checkViewPortClass(1);
        checkAllCarouselHeadlines();
    });
    $(window).scroll(function () {
        checkScroll();
    });
    $(window).load(function () {
        //some things need to be here for IE8 due to reasons of timing
        checkAllCarouselHeadlines();
    });

    /* Event to Handle Tab Switching */
    // we need to add the class="javaScriptCrossTabSwitching state-2" to the anchor Tag
    // "javaScriptCrossTabSwitching" will be fixed and state-2 is based on sate of the tab that we want to open
    $('a.javaScriptCrossTabSwitching').click(function (event) {

        event.preventDefault();

        var tabToOpen;
        var currentTab = $(".tabs .active");
        var tabParent = $(".tabs");
        var currentPane = currentTab.attr('data-state');
        var paneToOpen = $(this).attr("class").replace("javaScriptCrossTabSwitching", "");
        paneToOpen = "." + $.trim(paneToOpen);


        tabParent.next('.pane').children(currentPane).removeClass('active');
        tabParent.next('.pane').children(paneToOpen).addClass('active');
        currentTab.removeClass('active');

        tabParent.children(".tab").each(function (index) {
            if ($(this).attr('data-state') == paneToOpen) {
                tabToOpen = $(this);
            }
        });

        tabToOpen.addClass("active");
        $('html, body').animate({ scrollTop: $(".tabs").offset().top - 100 }, 0);
    });

    /// code for viatris discovery Popup
    if ((typeof ViatrisDiscoveryTimeLimit != "undefined") && !parseInt(window.localStorage.getItem('discoverViatris')) && localStorage.getItem("discoveredViatris") == null) {
        localStorage.setItem("discoverViatris", 1);
        hcpConnectPopup($('.interstitial#viatrisInterstitial'));
    }


    $('.sticky-connect').on('click', function (e) {
        e.preventDefault();
        hcpConnectPopup($('.interstitial#viatrisInterstitial'));
    });

    $('#viatrisInterstitial .reg-btn, #viatrisInterstitial .cancel a').on('click', function (e) {
        closeInterstitialPopup();

        displayOntheGoPopupIfAvailable();
        if (localStorage.getItem("discoveredViatris") == null) {
            window.localStorage.setItem('discoveredViatris', now);
        }
    });

    $('#viatrisInterstitial .reg-btn, #viatrisInterstitial .continue a').on('click', function (e) {
        closeInterstitialPopup();
        displayOntheGoPopupIfAvailable();

    });

    if (typeof ViatrisDiscoveryTimeLimit != "undefined") {
        var hours = 0;
        var now = new Date().getTime();

        hours = parseInt(ViatrisDiscoveryTimeLimit); // Reset when storage is more than 24hours
        console.log(ViatrisDiscoveryTimeLimit + '-----cookie reset time in hours')

        var setupTime = localStorage.getItem('discoveredViatris');
        if (now - setupTime > hours * 60 * 60 * 1000) {
            localStorage.removeItem('discoveredViatris');
        }


        if (localStorage.getItem("discoveredViatris") == null && localStorage.getItem("discoverViatris") !== null) {
            hcpConnectPopup($('.interstitial#viatrisInterstitial'));

        }
    }


    // Event to Handle Tab Switching and add tag to URL 
    // we need to add the class="javaScriptCrossTabSwitchingWithURL state-2" to the anchor Tag
    // "javaScriptCrossTabSwitchingWithURL" will be fixed and state-2 is based on sate of the tab that we want to open
    $('a.javaScriptCrossTabSwitchingWithURL').click(function (event) {

        event.preventDefault();

        var tabToOpen;
        var currentTab = $(".tabs .active");
        var tabParent = $(".tabs");
        var currentPane = currentTab.attr('data-state');
        var paneToOpen = $(this).attr("class").replace("javaScriptCrossTabSwitchingWithURL", "");
        paneToOpen = "." + $.trim(paneToOpen);


        tabParent.next('.pane').children(currentPane).removeClass('active');
        tabParent.next('.pane').children(paneToOpen).addClass('active');
        currentTab.removeClass('active');

        tabParent.children(".tab").each(function (index) {
            if ($(this).attr('data-state') == paneToOpen) {
                tabToOpen = $(this);
            }
        });

        tabToOpen.addClass("active");
        window.location = window.location.protocol + "//" + window.location.hostname + window.location.pathname + "#" + tabToOpen.children().children().text().toLowerCase().replace(" ", "-");
        $('html, body').animate({ scrollTop: $(".tabs").offset().top - 100 }, 0);
    });

    //Code to handle tab switching for oncology page in Mylan.com 
    if ((window.location.pathname.toLocaleLowerCase().indexOf("oncology") > -1 || window.location.pathname.toLocaleLowerCase().indexOf("mylan-on-location-featuring-epipen") > -1) && window.location.hash != "") {
        var tabToOpen;
        var currentTab = $(".tabs .active");
        var tabParent = $(".tabs");
        var currentPane = currentTab.attr('data-state');
        var paneToOpen;
        currentTab.removeClass('active');

        tabParent.children(".tab").each(function (index) {

            if ($(this).children().children().text().toLowerCase().replace(" ", "-") == window.location.hash.substr(1)) {
                tabToOpen = $(this);
                paneToOpen = $(this).attr('data-state');
                $(this).addClass("active");
            }
        });

        tabParent.next('.pane').children(currentPane).removeClass('active');
        tabParent.next('.pane').children(paneToOpen).addClass('active');



    }
});

$(window).load(function () {
    if (window.location.pathname.toLocaleLowerCase().indexOf("oncology") > -1 && window.location.hash != "") {
        $('html, body').animate({ scrollTop: $(".tabs").offset().top - 100 }, 0);

    }
});