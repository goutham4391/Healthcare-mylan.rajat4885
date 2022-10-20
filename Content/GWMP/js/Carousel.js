/* ---------------------------------------------------------------------
Carousel
Author:
------------------------------------------------------------------------ */

// Keycode constants
var KEYS = {
    LEFT: 37,
    RIGHT: 39,
    ESC: 27,
    ENTER: 13
};

var Carousel = function (carousel) {
    return this.init(carousel);
};

/**
 * Initialize carousel instance
 *
 * @param {DOMElement} carousel Carousel element
 */
Carousel.prototype.init = function (carousel) {

    //define global vars for the object
    this.$carousel = $(carousel);

    // Set the first slide as the active slide
    this.$activeSlide = undefined;

    // Flag for transitioning
    this.isTransitioning = false;

    this.$slidesContainer = this.$carousel.find('.carousel-slides');
    this.$slides = this.$slidesContainer.children();
    this.slideWidth = this.$slides.eq(0).outerWidth();
    this.numberSlides = this.$slides.length;
    this.addsAutoPlay = this.$carousel.attr('data-autoplay');
    this.rotations = 0;
    this.maxFullRotations = 2;
    this.isMobile = Modernizr.mq('screen and (max-width: 680px)');

    this.$slides.each(function (index, element) {
        var $slide = $(element);
        $slide.attr('data-slide-index', index);
        $slide.find('a').attr('tabindex', '-1');
    });


    this.slideTime = 4000;

    // setup and play the carousel
    this.initialClone()
		._rebuildSlideReference() // Will add clones to our $slides property
		._setSlideWidth()
		.addChildren()
		.onWindowResize() // forces slides to set their widths
		.bind();

    if (this.addsAutoPlay !== undefined) {
        this.autoPlay();
    }

    this.$activeSlide = $(this.$slides.get(1));
    this.$activeSlide.find('a').attr('tabindex', '0');

    if (this.isMobile) {
        this.$slidesContainer.css({ left: '-95%' });
    } else {
        this.$slidesContainer.css({ left: '-100%' });
    }

};

/**
 * Clone last slide and insert before first
 * to simplify prev/next movement
 *
 * @returns {Carousel} the carousel instance
 */
Carousel.prototype.initialClone = function () {
    var $lastClone = $(this.$slides.last().clone(true));
    $lastClone.addClass('js-clone');
    this.$slidesContainer.prepend($lastClone);

    return this;
};

/**
 * Sets width of entire carousel
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype._setSlideWidth = function () {
    if (self.isMobile) {
        // Set the width of the slides container to the number of slides times 95 percent
        this.$slidesContainer.css('width', this.numberSlides * 95 + '%');
    } else {
        // Set the width of the slides container to the number of slides times 100 percent
        this.$slidesContainer.css('width', this.numberSlides * 100 + '%');
    }

    // Set the width of each slide
    this.$slides.css('width', 100 / this.numberSlides + '%');

    return this;
};

/**
 * Handles initialization of optional features
 *  - pagination
 *  - alternate (label) pagination
 *  - mobile controls
 *  - load animation
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype.addChildren = function () {
    var numLi = this.$slides.length;
    var self = this;

    // Adds carousel-nav controls to the .js-carousel_main
    var $carouselMain = this.$carousel.hasClass('js-carousel_main') ? this.$carousel : undefined;
    if ($carouselMain) {
        var $carouselMainControls = $('<div class="carousel-controls hList isDesktop"></div>');
        var $carouselMainControlsList = $('<ol class="carousel-controls-nav js-carousel-index"></ol>');
        var $carouselMainControlsPrev = $('<span class="carousel-controls-arrow carousel-controls-arrow_prev js-carousel-prev ir">Previous Slide</span>');
        var $carouselMainControlsNext = $('<span class="carousel-controls-arrow carousel-controls-arrow_next js-carousel-next ir">Next Slide</span>');
        var i;

        if ($carouselMain.hasClass('js-carousel_main_alt')) {
            $carouselMainControls.addClass('carousel-controls_alt');
        }

        $carouselMainControls.appendTo($carouselMain);
        $carouselMainControlsPrev.appendTo($carouselMainControls);
        $carouselMainControlsList.appendTo($carouselMainControls);
        $carouselMainControlsNext.appendTo($carouselMainControls);

        // Adds li items to "carousel-nav" and adds classes and content generated from var $count (.length)
        for (i = 1; i < numLi; i++) {
            $carouselMainControlsList.append(
				$('<li><a href="#slide-' + (i + 1) + '" class="carousel-controls-nav-item ir">Slide ' + (i + 1) + '</a></li>')
			);
        }

        $carouselMainControlsList.find('li')
			.eq(0)
			.children('a')
			.addClass('carousel-controls-nav-item_isActive');
    }

    // Adds carousel-titlePane controls to the .carousel_main_titlePane
    var $carouselMainTitlePane = this.$carousel.hasClass('js-carousel_main_titlePane') ? this.$carousel : undefined;

    if ($carouselMainTitlePane) {
        this.isMainTitlePane = true;
        this.$mainTitleContainer = $('.carousel-titlePane-slides');
        this.$mainTitles = this.$mainTitleContainer.find('li');

        this.$mainTitles.each(function (index, element) {
            $(element).attr('data-slide-index', index);
        });

        this.$mainTitles.eq(0)
			   .addClass('carousel-titlePane-slides-item_isActive');
    }

    // Adds carousel-tabs controls to the .js-carousel_alt
    var $carouselAlt = this.$carousel.hasClass('js-carousel_alt') ? this.$carousel : undefined;

    if ($carouselAlt) {
        this.$carousel.find('.carousel-tabs li')
			.eq(0)
			.children('a')
			.addClass('carousel-tabs-item_isActive');
    }


    // Adds controller to the .js-carousel_mobile
    var $carouselMobile = this.$carousel.hasClass('js-carousel_mobile') ? this.$carousel : undefined;

    if ($carouselMobile) {
        var $carouselMobileControl = $('<a href="#" class="carousel-controller js-carousel-next isMobile"><span class="ico ico_arrow_large"></span></a>');

        $carouselMobileControl.appendTo($carouselMobile);
    }

    // Adds image overlay to first slide
    var $carouselOverlays = this.$carousel.find('.js-carousel-slide_overlay');
    var overlayOptions = {
        speed: 1250,
        delay: 1000, // delay begins from (roughly) document ready, 0 for no wait
        maxDelay: 4000 // delay to trigger without load, 0 to disable
    };

    if ($carouselOverlays.length && this.$carousel.is(':visible')) {
        // shim Date.now for IE < 9
        if (!Date.now) {
            Date.now = function now() {
                return +(new Date);
            };
        }

        $carouselOverlays.each(function (index, el) {
            self._initLoadAnimation(el);
        });
        $carouselOverlays.each(function (index, el) {
            self.triggerLoadAnimation(el, overlayOptions);
        });
        //this.triggerLoadAnimation($carouselOverlays[0], overlayOptions);
    }

    return this;
};

/**
 * Rearrange main titles
 */
Carousel.prototype.shuffleMainTitles = function () {
    var $container = this.$mainTitleContainer;
    var $titles = this.$mainTitles;

    $titles.detach();

    this.$slides.each(function (index, element) {
        var slideIndex;

        if (index > 0) {
            slideIndex = $(element).attr('data-slide-index');

            $titles.each(function (index, element) {
                var $title = $(element);

                if ($title.attr('data-slide-index') === slideIndex) {
                    $container.append($title);
                }
            });
        }
    });

    this.$mainTitles = $container.find('li');

    this.$mainTitles.removeClass('carousel-titlePane-slides-item_isActive')
		   .eq(0)
		   .addClass('carousel-titlePane-slides-item_isActive');

    $container.css({ left: 0 });
};

/**
 * Add markup for slide load animation
 *
 * @param {int} index Slide index
 * @returns {jQuery} overlay element that was injected
 */
Carousel.prototype._initLoadAnimation = function (el) {
    if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
        return;
    }
    return $('<div class="carousel-overlay"><img width="285" height="285" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAAEdCAMAAAAGtENJAAAAMFBMVEX///8AvORAzeu/7viA3vIQwObP8vqf5vVg1e4wyekgxOdQ0eyP4vOv6vdw2fAAvOSGkGnkAAAAD3RSTlMA358gYM8QQIGvv49QMHCgI48fAAAFQklEQVR42uzb3Y7qIBhG4e8thQJVuf+7nWTHMQx1fmzVrWWtw5pw8EgBE7RC34cOOuj8Bx3tvpU6yvPogu0858Y560YdpUOwbgqHpD/rSDFYZ4Uo/UlH0bos6ncdJWed5pJ+0dFoHTfqJx15Z13n/Pc6StZ7IanWAaep5jFwrvO0Ot7oX/6KjoItcmMcdt1pdLYoaKGjgzVNs1R2nzQflxt7o6OhtckqnaTc+gytTvu5SkdpuP5u2dUjcvAqXSUfrO6kWsdb3aTSXQ2Pr3R0+jpzSumdJ6rSady6zFtdpTM3C3KX6avCRUdT9fio0mly7dprixcrl25LVnXRSUyd5eRJnzr1jhVLx8Ua4lNnYsNabluHs45cc4buNgW75HTWqZfq0nXHiuKKzli6bkQHHXTQQQcddNBBBx100EHnNXQ07Cd/fx3bTwM66KBz/0K6v47k58nevVOW9KAdXSnYOxelh553/LSDy8gP0ylytq5pzlKOR1ufi1lK0dm68hPOyt7W5LLOutnZusKgy0W2Nc16go7imomjaoDJ1jT5bf/ncHrK7yytw9nIc1RzU+vWYnmOzmg3FtSMEFbdQK/LKwZ4ik4Z7MaGzSPYoI1fUdCL6gRtfjmDtm4OrryoznJQHTYvGnI70ZnLomi3lcqicSc6w/Yh9D46Hp0fEjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466KCDDjrooIMOOuiggw466Hy0a7dLbsIwFIZ1sGXAfOj+77Y/tskEBdpoNOtusd4L0MATO2RiQid0Qid0Qid0Qid0Qid0Quen68yh86iejPDrTD9Vp5ApuHUS3Jszt9KRjSyVM51EljZ5j8nU3kxnJ0urnLS6bw1kam6mM5OlRU5a3LeGkSyhmQ6M1+Uf4QYeG+pky8aCeD/57AcepJmOVNPz3D/C/RklNNTBal46OozuEexdOn4d74Xx943AZFg6LXWw0GcNcI9Yrkckw9ZsoGPdGBnuESPcS3hCYx1BMdyZY0SBXIfZ8L3VUke42HHsIwqLOHlGSHsd4eT+zHikP5dYxMmTIU10dFjdux3Z6SuoxfCd3lBHMNBlqeKjEXMxPPAMwvoq2usIkA03ZvzVkoEPJ9TRsHBcOsbAUyHdNgAW4pMRZWLLiLqS4SocOuZQ9+31ETExnCO2vcI6AcOaDFfh0DEH8PAVgH84otpG2HXuUuiETuiETujcUqfQsw3ScUj0LP3WkXQQ6zioc3fS66lKx1X1HUP6bYYd0m3Y1QkufZHF1tIbi/ihg6L+s+ow/VdKwUNH1lg8euns8tSp6n/YLkN+OwGjk1OzAV3iDO+Hp3T2ltmMDnFmde7+ooOkeDrHSXjR0YuHFnT3uFJL56CDjQ6tjI5sWN39hqOOMKkyoxebTCoWpYOFdOPCwM1lwMt4fQpGfzn2TTfv6uBd6whGio6vbNDxfZGIEuRURzhR940sR53YXGpbXegIduq6CaJ19Os03VZmiNLRIVOnZYiKzn87dlhmyIWO9tmps/aDjdLRAXNO1Ekpz4CotI4OGKa8plu35mk4yGidSEIndEIndELnv+gXNAYPsSMEWJ0AAAAASUVORK5CYII=" /></div>').appendTo($(el).find('.carousel-img'));
};

/**
 * Trigger load animation
 *
 * @param {int} index Slide index
 * @param {Object} option Configuration options for animation
 */
Carousel.prototype.triggerLoadAnimation = function (el, options) {
    var $overlay = $(el).find('.carousel-overlay');
    var startTime;
    var $carouselImg;
    var imgSrc;
    var animated = false;
    var self = this;

    if ($overlay.length === 0) { // no overlay initialized
        return;
    }

    self.firingLoadAnimation = true;

    var triggerAnimation = function () {
        if (animated) {
            return;
        }
        animated = true;
        $overlay.fadeOut(options.speed, function () {
            $overlay.remove();
            self.firingLoadAnimation = false;
        });
    };

    startTime = Date.now();

    //wait for img load before fading out
    $carouselImg = $overlay.siblings('.carousel-img').find('img');
    imgSrc = $carouselImg.attr('src');
    if (options.delay) {
        $carouselImg
			.attr('src', '') // remove for problems with caching and the onload event
			.on('load', function () {
			    var loadTime = Date.now() - startTime;
			    var fadeTime = Math.max(0, options.delay - loadTime);
			    setTimeout(triggerAnimation, fadeTime);
			})
			.attr('src', imgSrc);
        if (options.maxDelay) {
            setTimeout(triggerAnimation, options.maxDelay); // trigger early if loading takes too long or errors
        }
    } else {
        triggerAnimation();
    }
};

/**
 * Begin slide auto-play
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype.autoPlay = function () {
    var self = this;

    this.autoplaying = true;
    this.timer = window.setInterval(function () {
        if (self.isHovering || self.firingLoadAnimation) {
            return;
        }
        self.nextSlide();
    }, this.slideTime);

    return this;
};

/**
 * Get index of active slide
 *
 * @returns {int}
 */
Carousel.prototype.getActiveSlideIndex = function () {
    return parseInt(this.$activeSlide.attr('data-slide-index'), 10);
};

/**
 * Stops auto-play timer
 */
Carousel.prototype.stopSlide = function () {
    var self = this;
    // Stops slides from autoplaying
    self.autoplaying = false;
    window.clearInterval(self.timer);
};

/**
 * Transition to specific slide
 *
 * @param {int} slideIndex The slide to transition to
 * @param {boolean} forward Flag for advancing forward
 * @param {$.Deferred} deferred Deferred object to resolve for chained transitions
 */
Carousel.prototype.goToSlide = function (slideIndex, forward, deferred) {
    var self = this;

    var $slide = $(this.$slides.get(slideIndex));
    var slideOffset = $slide.position();
    var activeSlideIndex = this.getActiveSlideIndex();

    self.$activeSlide = $slide;
    self.rotations += 1;

    // stop carousel after maximum number of rotations
    if (self.autoplaying && self.rotations >= (self.numberSlides - 1) * self.maxFullRotations) {
        self.stopSlide();
    }

    self.$activeSlide.find('a').attr('tabindex', '-1'); // remove keyboard focusability to old slide

    if (self.isMainTitlePane) {

        var TITLE_MARGIN = 40;

        if (forward) {
            var firstTitlePaneItemWidth = self.$mainTitles.first().outerWidth();

            self.$mainTitleContainer.animate({ left: -firstTitlePaneItemWidth + -TITLE_MARGIN + 'px' }, 400);
        } else {
            var lastTitlePaneItemWidth = self.$mainTitles.last().outerWidth();

            self.$mainTitleContainer.animate({ left: lastTitlePaneItemWidth + TITLE_MARGIN + 'px' }, 400);
        }
    }

    var animateCompleteCallback = function () {
        var clone;
        var activeSlideIndex = self.getActiveSlideIndex();

        if (forward) {
            self.$slides.first().remove();
            clone = $(self.$slides[1]).clone(true);
            clone.find('.carousel-overlay').remove(); // remove any stray overlays
            clone.appendTo(self.$slidesContainer);
        } else {
            self.$slides.last().remove();
            clone = $(self.$slides[self.numberSlides - 2]).clone(true);
            clone.find('.carousel-overlay').remove();
            clone.prependTo(self.$slidesContainer);
        }

        if (self.isMobile) {
            self.$slidesContainer.css({ left: '-95%' });
        } else {
            self.$slidesContainer.css({ left: '-100%' });
        }

        self._rebuildSlideReference();

        // remove active class from carousel nav item
        self.$carousel.find('.carousel-controls-nav-item_isActive')
						.removeClass('carousel-controls-nav-item_isActive');

        // adds active class to current carousel nav item
        self.$carousel.find('.carousel-controls-nav li a')
						.eq(activeSlideIndex)
						.addClass('carousel-controls-nav-item_isActive');

        // remove active class from carousel nav item
        self.$carousel.find('.carousel-tabs li .carousel-tabs-item_isActive')
						.removeClass('carousel-tabs-item_isActive');

        // adds active class to current carousel nav item
        self.$carousel.find('.carousel-tabs li a')
						.eq(activeSlideIndex)
						.addClass('carousel-tabs-item_isActive');

        if (self.isMainTitlePane) {
            self.shuffleMainTitles();
        }

        if (deferred) {
            deferred.resolve();
        } else {
            self.isTransitioning = false;
        }

        self.$activeSlide.find('a').attr('tabindex', '0'); // add keyboard focusability to new slide
    };

    this.$slidesContainer.stop(true, false).animate({ left: -slideOffset.left }, 400, 'linear', animateCompleteCallback);
};

/**
 * Trigger transition to next slide
 *
 * @param {$.Deferred} deferred Deferred object to pass to goToSlide
 */
Carousel.prototype.nextSlide = function (deferred) {
    var $slide = this.$activeSlide.next();
    var slideIndex = this.$slides.index($slide);

    this.goToSlide(slideIndex, true, deferred);
};

/**
 * Trigger transition to previous slide
 *
 * @param {$.Deferred} deferred Deferred object to pass to goToSlide
 */
Carousel.prototype.prevSlide = function (deferred) {
    var $slide = this.$activeSlide.prev();
    var slideIndex = this.$slides.index($slide);

    this.goToSlide(slideIndex, false, deferred);
};

/**
 * Bind events for Carousel instance
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype.bind = function () {
    var self = this;

    var _car = this.$carousel;
    var hammerOpts;

    $(window).on('resize', $.proxy(this.onWindowResize, this));

    _car.find('.js-carousel-index').on('click', 'li', $.proxy(this.onIndexClick, this));

    _car.find('.js-carousel-next').on('click', $.proxy(this.onNextClick, this));

    _car.find('.js-carousel-prev').on('click', $.proxy(this.onPrevClick, this));

    // cancel rotation if modal is launched
    _car.on('modalLaunch', function () {
        _car.data('carousel').stopSlide();
    });

    if (Modernizr.touch) {
        $(this.$slidesContainer).swipe({
            swipe: function (event, direction, distance, duration, fingerCount) {
                if (self.isTransitioning === true || distance < 40) {
                    return;
                } else if (direction === 'left' || direction === 'right') {
                    self.isTransitioning = true;
                }

                if (direction === 'left') {
                    self.nextSlide();
                } else {
                    self.prevSlide();
                }
                self.stopSlide();
            },
            threshold: 40,
            excludedElements: '.noSwipe',
            allowPageScroll: 'vertical'
        });
    }

    self.$carousel.hover(function () {
        self.isHovering = true;
    }, function () {
        self.isHovering = false;
    });

    // add keyboard functionality
    self.$carousel.on('keydown', function (e) {

        if (e.keyCode !== KEYS.LEFT && e.keyCode !== KEYS.RIGHT) {
            return;
        }

        if (e.keyCode === KEYS.RIGHT) {
            self.nextSlide();
        } else {
            self.prevSlide();
        }
        self.stopSlide();
        self.$activeSlide.find('a').first()[0].focus();
    });

    return this;
};

/**
 * Handler for window onresize event
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype.onWindowResize = function (event) {
    this.slideWidth = this.$slides.eq(0).outerWidth();

    return this;
};

/**
 * Handler for pagination click event
 */
Carousel.prototype.onIndexClick = function (event) {
    event.preventDefault();

    var $clicked = $(event.currentTarget);
    var $items = $(event.delegateTarget).children();
    var index = $items.index($clicked);
    var activeIndex = this.getActiveSlideIndex();

    if (this.isTransitioning === true || index === activeIndex) {
        return;
    } else {
        this.isTransitioning = true;
    }

    if (index > activeIndex) {
        this.deferNext(index);
    } else if (index < activeIndex) {
        this.deferPrev(index);
    }

    this.stopSlide();

    return this;
};

/**
 * Queue next slide transition
 *
 * @param {int} index Slide index
 */
Carousel.prototype.deferNext = function (index) {
    var self = this;
    var deferred = $.Deferred();

    deferred.done(function () {
        var activeIndex = self.getActiveSlideIndex();
        if (activeIndex !== index) {
            self.deferNext(index);
        } else {
            self.isTransitioning = false;
        }
    });

    this.nextSlide(deferred);
};

/**
 * Queue previous slide transition
 *
 * @param {int} index Slide index
 */
Carousel.prototype.deferPrev = function (index) {
    var self = this;
    var deferred = $.Deferred();

    deferred.done(function () {
        var activeIndex = self.getActiveSlideIndex();
        if (activeIndex !== index) {
            self.deferPrev(index);
        } else {
            self.isTransitioning = false;
        }
    });

    this.prevSlide(deferred);
};

/**
 * Handler for next control click
 *
 * @param {Event} event Click event
 */
Carousel.prototype.onNextClick = function (event) {
    event.preventDefault();

    if (this.isTransitioning === true) {
        return;
    } else {
        this.isTransitioning = true;
    }

    this.stopSlide();

    return this.nextSlide();
};

/**
 * Handler for previous control click
 *
 * @param {Event} event Click event
 */
Carousel.prototype.onPrevClick = function (event) {
    event.preventDefault();

    if (this.isTransitioning === true) {
        return;
    } else {
        this.isTransitioning = true;
    }

    this.stopSlide();

    return this.prevSlide();
};

/**
 * Reset slide info with current DOM
 *
 * @returns {Carousel} current Carousel instance
 */
Carousel.prototype._rebuildSlideReference = function () {
    this.$slides = this.$slidesContainer.children();
    this.numberSlides = this.$slides.length;

    return this;
};