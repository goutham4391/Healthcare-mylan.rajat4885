/* ---------------------------------------------------------------------
Carousel-like rotating element

Target Browsers: All
Authors: Nick
------------------------------------------------------------------------ */
var Rotator = function(rotator, clone) {
	this.$el = $(rotator);
	this.$slides = this.$el.find('.rotator-items').children();
	this.size = this.$slides.length;
	this.baseSpeed = 1000;
	this.animateSpeed = 1000;
	this.activeClass = 'rotator-tab_isActive';

	this._buildTabs(clone);
	this._buildControls();
	this._initContent();
	this._bind();
	this._updateState();
	this._updateSize();
};

/**
 * Styling for tab states
 */
Rotator.prototype.tabStyles = {
	active: {
		'margin-left': '-307px',
		'opacity': 1
	},
	entering: {
		'margin-left': '140px',
		'opacity': 0
	},
	exiting: {
		'margin-left': '-600px',
		'opacity': 0
	},
	idle: {
		'margin-left': '9px',
		'opacity': 1
	}
};

/**
 * Moves tab heads to tab area, adds shadow
 *
 * @param {booleam} clone Clone the tabs so they repeat, useful for small sets
 */
Rotator.prototype._buildTabs = function(clone) {
	var self = this;
	var $tabs = $('<ol class="rotator-tabs"></ol>').attr('aria-hidden', 'true'); // hide tab navigation from screen readers
	var $clone;
	var buffer = this.$slides.children().first().outerWidth() + 260;
	var maxHeight = 0;

	if (clone) {
		buffer *= 2;
	}
	$tabs.width(this.$slides.length * buffer);

	this.$slides.each(function(index, el) {
		var $el = $(el);
		var $head = $el.find('.rotator-hd');
		var $slideHeading = $head.find('.hdg').addClass('visuallyHidden');
		// var $accessibleHeading = $slideHeading.clone().addClass('visuallyHidden');
		// var $replaceHeading = $('<div></div>');
		var $tab = $('<li class="rotator-tab"></li>');

		//$el.prepend($accessibleHeading); // keep heading next to content

		// replace h1-h6 in tabs with divs
		// $replaceHeading[0].className = $slideHeading[0].className;
		// $replaceHeading.html($slideHeading.html());
		// $slideHeading.replaceWith($replaceHeading);

		$tab
			.data('slide', $el)
			.css(self.tabStyles.idle)
			.append('<div class="rotator-tab-bg"></div>')
			.append($head)
			.appendTo($tabs);
	});

	if (clone) { // enable if wanted for short list
		$tabs.children().clone(true).appendTo($tabs);
		this.size *= 2;
	}

	this.$currentTab = $tabs.children().first().css(self.tabStyles.active);
	this.$currentTab.children('.rotator-tab-bg').css('bottom', '-74px');

	this.$tabs = $tabs;
	this.$el.find('.rotator-hdg').after($tabs);
	this.$tabs.wrap('<div class="rotator-bar"></div>');

	$(window).on('load', function() {
		// once images have loaded, set constant height
		$tabs.children().each(function(index, el) {
			var height = $(el).height();
			maxHeight = Math.max(maxHeight, height);
		}).height(maxHeight);
	});
};

/**
 * Adds prev/next controls
 */
Rotator.prototype._buildControls = function() {
	var $controls = $('<button class="navBtn navBtn_prev rotator-control rotator-prev ir">Previous</button><button class="navBtn navBtn_next rotator-control rotator-next ir">Next</button>')
		.attr('aria-hidden', 'true')
		.insertAfter(this.$tabs);

	if (this.$slides.length === 1) {
		this.disableControls();
	}
};

/**
 * Set up content area below tabs
 */
Rotator.prototype._initContent = function() {
	this.$slides.not(':first').addClass('visuallyHidden');
};

/**
 * Bind events to rotator
 */
Rotator.prototype._bind = function() {
	var self = this;
	var $prev = self.$el.find('.rotator-prev');
	var $next = self.$el.find('.rotator-next');

	$prev.on('click', function(event) {
		event.preventDefault();
		if (!self.disabled) {
			self.prev();
		}
	});

	$next.on('click', function(event) {
		event.preventDefault();
		if (!self.disabled) {
			self.next();
		}
	});

	self.$tabs.children().on('click', function(event) {
		var index = $(this).index();
		if (self.disabled) {
			return;
		}

		if (index > 1) {
			self.animateSpeed = self.baseSpeed / 2; // speed up if multiple transitions
		}

		if (index) {
			self.advance(true, index);
		}
	});

	self.$el.on('keydown', function(e) {
		if (self.disabled) {
			return;
		}

		if (e.keyCode === KEYS.LEFT) {
			$prev[0].focus();
			self.prev();
		}

		if (e.keyCode === KEYS.LEFT) {
			$next[0].focus();
			self.next();
		}
	});

	$(window).on('load resize', function(event) {
		self._updateSize(event);
	});

	if (Modernizr.touch) {
		self.$tabs.swipe({
			swipe: function(event, direction, distance, duration, fingerCount) {
				if (self.disabled || duration > 250) {
					return;
				}

				if (direction === 'left') {
					self.next();
				} else if (direction === 'right') {
					self.prev();
				}
			},
			threshold: 40,
			excludedElements: '',
			allowPageScroll: 'vertical'
		});
		// handle clicks because swipe delays for some reason
		self.$el.on('touchstart.rotator', '.rotator-tab', function(event) {
			var startTime = Date.now();
			var threshold = 10;
			var touch = {
				x: event.originalEvent.touches[0].pageX,
				y: event.originalEvent.touches[0].pageY
			};
			$(this).on('touchend.rotator', function() {
				var endTime = Date.now();
				var dx = Math.abs(event.originalEvent.changedTouches[0].pageX - touch.x);
				var dy = Math.abs(event.originalEvent.changedTouches[0].pageY - touch.y);
				$(this).off('touchend.rotator');
				if (endTime - startTime < 250 && dx < threshold && dy < threshold) {
					$(this).trigger('click');
				}
			});
		});
	}
};

/**
 * Update object state after a rotation
 */
Rotator.prototype._updateState = function() {
	var $nextTab = this.$tabs.children().eq(0);

	this.$currentTab.removeClass(this.activeClass);
	this.$currentTab = $nextTab;
	this.$currentTab.addClass(this.activeClass);

};

/**
 * Update min-height of content to avoid whole page shift while transitioning
 */
Rotator.prototype._updateSize = function(event) {
	//if (MYLAN.Utils.isOldIE && event && event.type === 'resize') {
	//	// these browsers don't switch stylesheets
	//	return;
	//}
	var $container = this.$slides.parent();
	var firstHeight = $container.css('min-height', 0).height();
	$container.css('min-height', firstHeight);
};

/**
 * Advance rotator forward or backward
 *
 * @param {boolean} forward Direction of rotation
 * @param {int} targetIndex Target index for additional rotations (optional)
 */
Rotator.prototype.advance = function(forward, targetIndex) {
	var self = this;
	var index = forward ? 1 : this.size - 1;
	var curTab = self.$currentTab;
	var nextTab = self.$tabs.children().eq(index);
	var speed = self.animateSpeed / 2;

	this.disableControls();

	if (targetIndex) {
		targetIndex -= 1;
	}

	//if (MYLAN.Utils.isOldIE) {
	//	self.$slides.parent().height(this.$slides.parent().height());
	//}

	curTab.removeClass(this.activeClass);

	self._prepAnimation(curTab, nextTab, forward).done(function() {

		if (!targetIndex) {
			nextTab.data('slide').slideUp(0, function() {
				nextTab.data('slide').removeClass('visuallyHidden').slideDown(speed, function() {
					//if (MYLAN.Utils.isOldIE) {
						//self.$slides.parent().height('auto');
					//}
				});
			});
		}
		if (forward) {
			curTab
				.css(self.tabStyles.entering)
				.appendTo(self.$tabs)
				.animate(self.tabStyles.idle, speed, function() {
				});
		} else {
			nextTab
				.css(self.tabStyles.exiting)
				.prependTo(self.$tabs)
				.animate(self.tabStyles.active, speed);
		}
		self._updateState();
		self.enableControls();

		if (forward && targetIndex) {
			self.advance(true, targetIndex);
		} else {
			self.animateSpeed = self.baseSpeed; // reset in case speed was changed
		}

		self._sendGA(curTab, nextTab);
	});

};

/**
 * Sends GA code on rotation
 *
 * @param {jQuery} curTab Current active tab
 * @param {jQuery} nextTab Tab to become active
 */
 Rotator.prototype._sendGA = function(curTab, nextTab) {
	// Send analytics code
	var category = 'Slider';
	var label = this.$el.attr('data-label');
	var action = $.trim(curTab.text());
	//window._gaq.push(['_trackEvent', category, action, label]);
 }

/**
 * Performs first wave of rotation
 *
 * @param {jQuery} curTab Current active tab
 * @param {jQuery} nextTab Tab to become active
 * @param {boolean} forward Direction to rotate
 * @returns {jQuery.Deferred}
 */
Rotator.prototype._prepAnimation = function(curTab, nextTab, forward) {
	var self = this;
	var result = $.Deferred();
	var animations = 5;
	var speed = self.animateSpeed / 2;
	var curTabBg = curTab.children('.rotator-tab-bg');
	var nextTabBg = nextTab.children('.rotator-tab-bg');
	//var oldIE = MYLAN.Utils.isOldIE;

	result.progress(function() {
		animations -= 1;
		if (animations === 0) {
			//if (oldIE) { // adds style from skipped animation
			//	curTabBg.css('bottom', 0);
			//}


			result.resolve();
		}
	});

	curTab.data('slide').slideUp(speed, function() {
		curTab.data('slide').addClass('visuallyHidden').slideDown(0, result.notify); // keep accessible
	});


	if (forward) {
		// move current tab out of frame
		curTab.animate(self.tabStyles.exiting, speed, result.notify);

		//if (oldIE) { // fixes issue with shadow showing through opacity animation
		//	result.notify();
		//} else {
			curTabBg.animate({ 'bottom': 0 }, speed, result.notify);
		//}

		// move next tab into active position
		nextTab.animate(self.tabStyles.active, speed, result.notify);
		nextTabBg.animate({ 'bottom': '-74px' }, speed, result.notify);
	} else {
		// move next tab out of frame
		nextTab.animate(self.tabStyles.entering, speed, result.notify);
		nextTabBg.animate({ 'bottom': '-74px' }, speed, result.notify);

		// move current tab out of active position
		curTab.animate(self.tabStyles.idle, speed, result.notify);
		curTabBg.animate({ 'bottom': '0' }, speed, result.notify);
	}

	return result;
};

/**
 * Go to previous tab
 */
Rotator.prototype.prev = function() {
	this.advance(false);
};

/**
 * Go to next tab
 */
Rotator.prototype.next = function() {
	this.advance(true);
};

/**
 * Disable use of prev/next controls
 */
Rotator.prototype.disableControls = function() {
	this.disabled = true;
	this.$el.find('.rotator-control').each(function(index, el) {
		var $btn = $(el);
		if ($btn.hasClass('navBtn_prev')) {
			$btn.addClass('navBtn_prev_isDisabled');
		} else {
			$btn.addClass('navBtn_next_isDisabled');
		}
		$btn.attr('aria-disabled', true);
	});
};

/**
 * Enable use of prev/next controls
 */
Rotator.prototype.enableControls = function() {
	this.disabled = false;
	this.$el
		.find('.rotator-control')
		.attr('aria-disabled', false)
		.removeClass('navBtn_prev_isDisabled')
		.removeClass('navBtn_next_isDisabled');
};