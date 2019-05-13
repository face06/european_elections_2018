/*
* Closure for Page Load
*/
(function ($, window, document) {
    "use strict";

// Define global vars
    var $window = $(window),
        $html = $("html"),
        $body = $("body"),
        $header = $("#header");

// FIX mask for Safari Browser
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.getElementsByTagName('body')[0].className += ' is-safari';
    }
// END FIX mask for Safari Browser


// PRELOADER *to deactivate erase or comment this code*
    $(window).on('load', function () {
        $('body').removeClass('preloader');
    });
// END PRELOADER

// Responsive Main-Menu
    var page_wrapper = $('#page_wrapper'),
        responsive_trigger = $('.zn-res-trigger'),
        zn_back_text = 'Retour',
        back_text = '<li class="zn_res_menu_go_back"><span class="zn_res_back_icon fas fa-chevron-left"></span><a href="#">' + zn_back_text + '</a><a href="#" class="zn-close-menu-button"><span class="fas fa-times"></span></a></li>',
        cloned_menu = $('#main-menu > ul').clone().attr({id: "zn-res-menu", "class": ""});

    var start_responsive_menu = function () {

        var responsive_menu = cloned_menu.prependTo(page_wrapper);
        var responsive_menu_overlay = $('<div class="zn-res-menu-overlay"/>').insertAfter(cloned_menu);

        var set_height = function () {
            var _menu = $('.zn-menu-visible').last(),
                height = _menu.css({height: 'auto'}).outerHeight(true),
                window_height = $(window).height(),
                adminbar_height = 0,
                admin_bar = $('#wpadminbar');

            // CHECK IF WE HAVE THE ADMIN BAR VISIBLE
            if (height < window_height) {
                height = window_height;
                if (admin_bar.length > 0) {
                    adminbar_height = admin_bar.outerHeight(true);
                    height = height - adminbar_height;
                }
            }
            _menu.attr('style', '');
            page_wrapper.css({'height': height});
        };


        // BIND OPEN MENU TRIGGER
        responsive_trigger.click(function (e) {
            e.preventDefault();

            responsive_menu.addClass('zn-menu-visible');
            set_height();

        });

        // Close the menu when a link is clicked
        responsive_menu.find('a:not([rel*="mfp-"])').on('click', function (e) {
            $('.zn_res_menu_go_back').first().trigger('click');
        });

        // ADD ARROWS TO SUBMENUS TRIGGERS
        responsive_menu.find('li:has(> ul)').addClass('zn_res_has_submenu').prepend('<span class="zn_res_submenu_trigger glyphicon glyphicon-chevron-right"></span>');
        // ADD BACK BUTTONS
        responsive_menu.find('.zn_res_has_submenu > ul').addBack().prepend(back_text);

        // REMOVE BACK BUTTON LINK
        $('.zn_res_menu_go_back').click(function (e) {
            e.preventDefault();
            var active_menu = $(this).closest('.zn-menu-visible');
            active_menu.removeClass('zn-menu-visible');
            set_height();
            if (active_menu.is('#zn-res-menu')) {
                page_wrapper.css({'height': 'auto'});
            }
        });

        // OPEN SUBMENU'S ON CLICK
        $('.zn_res_submenu_trigger').click(function (e) {
            e.preventDefault();
            $(this).siblings('ul').addClass('zn-menu-visible');
            set_height();
        });

        var closeMenu = function () {
            cloned_menu.removeClass('zn-menu-visible');
            responsive_trigger.removeClass('is-active');
            removeHeight();
        };
    };

    // MAIN TRIGGER FOR ACTIVATING THE RESPONSIVE MENU
    var menu_activated = false,
        triggerMenu = function () {
            if ($(window).width() < 1200) {
                if (!menu_activated) {
                    start_responsive_menu();
                    menu_activated = true;
                }
                page_wrapper.addClass('zn_res_menu_visible');
            } else {
                // WE SHOULD HIDE THE MENU
                $('.zn-menu-visible').removeClass('zn-menu-visible');
                page_wrapper.css({'height': 'auto'}).removeClass('zn_res_menu_visible');
            }
        };

    $(document).ready(function () {
        triggerMenu();
    });

    $(window).on('load resize', function () {
        triggerMenu();
        var is = false;
        if ($(window).width() < 1200) {
            if (is) return;
            //@wpk
            // Close button for the responsive menu
            var closeMenuSender = $('.zn-close-menu-button, .zn-res-menu-overlay');
            if (closeMenuSender) {
                closeMenuSender.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var parent = $('#zn-res-menu');
                    parent.removeClass('zn-menu-visible');
                    //parent.removeClass('zn-menu-visible');
                    $('.zn-menu-visible', parent).removeClass('zn-menu-visible');
                    $('#page_wrapper').css({'height': 'auto'});
                });
            }
            is = true;
        }
    });
// END Responsive Main-Menu


// Scroll to top
    if (KallyasConfig.enableBackToTop) {
        if ($('#totop').length) {
            var scrollTrigger = 200, // px
                backToTop = function () {
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop > scrollTrigger) {
                        $('#totop').addClass('show');
                    } else {
                        $('#totop').removeClass('show');
                    }
                };
            backToTop();
            $(window).on('scroll', function () {
                backToTop();
            });
            $('#totop').on('click', function (e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            });
        }
    }
// END Scroll to top

// Tonext button - Scrolls to next block (used for fullscreen slider)
    if (typeof ($(".js-tonext-btn")) != 'undefined') {
        $(".js-tonext-btn").on('click', function (e) {
            e.preventDefault();
            var endof = $(this).attr('data-endof') ? $(this).attr('data-endof') : false,
                dest = 0;

            if (endof)
                dest = $(endof).height() + $(endof).offset().top;

            //go to destination
            $('html,body').animate({scrollTop: dest}, 1000, 'easeOutExpo');
        });
    }
// END Tonext button - Scrolls to next block (used for fullscreen slider)


// Blog Isotope item
    var enable_blog_isotope = function (scope) {
        var elements = scope.find('.hg_blog_columns, .masonry-columns');
        if (elements.length == 0) {
            return;
        }

        if (typeof $.fn.imagesLoaded != 'undefined' && typeof $.fn.isotope != 'undefined') {
            elements.imagesLoaded(function () {
                elements.isotope({
                    itemSelector: ".blog-isotope-item, .item",
                    animationEngine: "jquery",
                    animationOptions: {
                        duration: 250,
                        easing: "easeOutExpo",
                        queue: false
                    },
                    filter: '',
                    sortAscending: true,
                    sortBy: ''
                });
            });
        }
    };
    var blog_isotope = $('.hg_blog_archive_element, .portfolio-masonry');
    if (blog_isotope) {
        enable_blog_isotope(blog_isotope);
    }
// END Blog Isotope item

// Words play
    jQuery('#textplay .textplay-line').each(function (index, el) {
        var words = jQuery(el).children('.textplay-word'),
            randlast;
        setInterval(function () {
            var rand = Math.floor((Math.random() * words.length));
            if (rand == randlast)
                rand = Math.floor((Math.random() * words.length));
            words.removeClass('active');
            setTimeout(function () {
                words.eq(rand).addClass('active');
            }, 300);
            randlast = rand;
        }, 3000);
    });
// END Words play


// Sub-header mask effect
    if (matchMedia('only screen and (min-width: 767px)').matches && $html.hasClass('js')) {
        var scrollSvg = $('.kl-slideshow, #page_header');
        if (scrollSvg && scrollSvg.length > 0) {
            var scrollSvgHeight = (parseFloat(scrollSvg.css('height')) + 20),
                svgEffect = scrollSvg.find('.screffect');
            $window.scroll(function () {
                var scrollPos = $window.scrollTop();
                if (scrollPos < scrollSvgHeight) {
                    var maxSkew = 2;
                    var effectPos = (maxSkew / scrollSvgHeight) * scrollPos;
                    svgEffect.css({
                        '-webkit-transform': 'skewY(-' + effectPos + 'deg)',
                        'transform': 'skewY(-' + effectPos + 'deg)'
                    });
                }
            });
        }
    }
// END Sub-header mask effect


// Bubble Boxes
    $('.bubble-box').each(function (index, el) {
        var $el = $(el),
            $revealAt = $el.attr('data-reveal-at'),
            $hideAfter = $el.attr('data-hide-after'),
            defaultRevealAt = 1000; // default reveal when scrolling is at xx px
        if (typeof $revealAt == 'undefined' && $revealAt.length <= 0) $revealAt = defaultRevealAt;
        $window.smartscroll(function (event) {
            // reveal the popup
            if ($el.length > 0 && $(window).scrollTop() > $revealAt && (!$el.hasClass('bb--anim-show') && !$el.hasClass('bb--anim-hide'))) {
                $el.addClass("bb--anim-show");
                // check if hide after is defined and hide the popupbox
                if (typeof $hideAfter != 'undefined' && $hideAfter.length >= 0) {
                    setTimeout(function () {
                        $el.removeClass('bb--anim-show').addClass('bb--anim-hide').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
                            function () {
                                $(this).remove();
                            });
                    }, $hideAfter)
                }
            }
        });
        $el.find('.bb--close').on('click', function () {
            $el.addClass('bb--anim-hide').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
                function () {
                    $(this).remove();
                });
        });

    });
// END Bubble Boxes

// Tooltips
// ** for more details how to use tooltips, you can check bootstrap documentation: http://getbootstrap.com/javascript/#tooltips
    if (typeof ($.fn.tooltip) != 'undefined' && typeof ($('[data-toggle="tooltip"]')) != 'undefined') {
        $('[data-toggle="tooltip"]').tooltip();
    }
// END Tooltips


//  Hover buttons icons in action bar
    jQuery(".cms-hov-icon").each(function (index, el) {
        var $el = jQuery(el),
            hovIcon = $el.attr('data-hovicon');
        $el.on('mouseover', function () {
            jQuery("#" + hovIcon).addClass('hovered');
            jQuery("#cms-icon-github-circled").removeClass('hovered');
        }).on('mouseout', function () {
            jQuery("#" + hovIcon).removeClass('hovered');
            jQuery("#cms-icon-github-circled").addClass('hovered');
        });
    });
//  END Hover buttons icons in action bar


// Appear Events
    if ($.fn.appear != 'undefined') {
        $('[data-animated], .appear').appear({force_process: true});

        $('[data-animated="fade"]').on('appear', function () {
            $(this).each(function (i, el) {
                $(el).addClass('fade-animation')
            });
        });
        $('[data-animated="execute"]').on('appear', function () {
            $(this).each(function (i, el) {
                $(el).addClass('started')
            });
        });
    }
// end Appear Events

    /**** Initialize carousels based on CarouFredSel
     * .caroufredsel class mandatory
     * data-setup attribute needed (please find examples within the site)
     * */
    var initCarouFredSels = function (dom) {
        // check if dom param is added, if not use $body
        dom = typeof dom !== 'undefined' ? dom : $body;
        // start carousel trigger with options
        var cfs_container = $(dom).find(".caroufredsel:not(.custom)");
        // check if element exists so it can begin the job
        if (!cfs_container.length) return;
        // iterate through finds
        $.each(cfs_container, function (index, el) {
            var _el = $(el),
                _data_attribs = _el.attr("data-setup"),
                _options = typeof _data_attribs != 'undefined' ? JSON.parse(_data_attribs) : '{}',
                _nav = $('<div class="cfs--navigation"><a href="#" class="cfs--prev"></a><a href="#" class="cfs--next"></a></div>'),
                _pag = $('<div class="cfs--pagination"></div>'),
                _cfParent = _el.closest('.caroufredsel').parent();

            if (_options.navigation)
                (_options.appendToParent ? _cfParent : _el).append(_nav);

            if (_options.pagination)
                (_options.appendToParent ? _cfParent : _el).append(_pag);

            if (_options.swipe_touch || _options.swipe_mouse)
                _el.addClass('stl-swiper');

            var doCarouFredSels = function () {
                _el.children('ul.slides').carouFredSel({
                    responsive: _options.hasOwnProperty('responsive') ? _options.responsive : true,
                    width: _options.hasOwnProperty('width') ? _options.width : null,
                    height: _options.hasOwnProperty('height') ? _options.height : null,
                    align: _options.hasOwnProperty('align') ? _options.align : 'left',
                    scroll: {
                        items: _options.hasOwnProperty('scroll') ? _options.scroll : 1,
                        fx: _options.hasOwnProperty('fx') ? _options.fx : "scroll"
                    },
                    items: {
                        visible: _options.hasOwnProperty('items') ? _options.items : 1,
                        minimum: _options.hasOwnProperty('items_minimum') ? _options.items_minimum : 1,
                        start: _options.hasOwnProperty('items_start') ? _options.items_start : 0,
                        width: _options.hasOwnProperty('items_width') ? _options.items_width : null,
                        height: _options.hasOwnProperty('items_height') ? _options.items_height : null
                    },
                    auto: {
                        play: _options.hasOwnProperty('autoplay') ? _options.autoplay : true,
                        timeoutDuration: _options.hasOwnProperty('auto_duration') ? _options.auto_duration : 10000
                    },
                    prev: {
                        button: (_options.appendToParent ? _cfParent : _el.closest('.caroufredsel')).find('.cfs--prev'),
                        key: "left"
                    },
                    next: {
                        button: (_options.appendToParent ? _cfParent : _el.closest('.caroufredsel')).find('.cfs--next'),
                        key: "right"
                    },
                    pagination: {
                        container: (_options.appendToParent ? _cfParent : _el.closest('.caroufredsel')).find('.cfs--pagination'),
                        anchorBuilder: function (nr, item) {
                            return '<a href="#' + nr + '"></a>';
                        }
                    },
                    swipe: {
                        onTouch: _options.hasOwnProperty('swipe_touch') || Modernizr.touch ? _options.swipe_touch : false,
                        onMouse: _options.hasOwnProperty('swipe_mouse') || Modernizr.touch ? _options.swipe_mouse : false
                    }
                });
            };

            cfs_container.imagesLoaded(doCarouFredSels);

        });
    };
// end Initialize carousels based on CarouFredSel


    /* Photo Gallery Alternative - Caroufredsel */
    if ($.fn.carouFredSel != 'undefined') {

        /* Caroufredsel Trigger with options */
        initCarouFredSels();

        /**
         * PhotoGallery Widget */


        $('.photogallery-widget .caroufredsel').each(function (index, el) {

            var _cfs_main = $(el),
                _cfs_main_slides = _cfs_main.children('ul.slides');

            _cfs_main_slides.children('li').slice(10).remove();

            var updPhotoGalWdgtCounter = function (c) {
                    var cfscounter = c.closest('.caroufredsel').find('.cfs-counter'),
                        current = c.triggerHandler('currentPosition');
                    cfscounter.html((current + 1) + " of " + c.children().length);
                },
                doPhotoGalWdgt = function () {
                    _cfs_main_slides.carouFredSel({
                        responsive: true,
                        width: 850,
                        items: 1,
                        auto: 10000,
                        prev: {
                            button: _cfs_main.find('.cfs--prev'),
                            key: "left"
                        },
                        next: {
                            button: _cfs_main.find('.cfs--next'),
                            key: "right"
                        },
                        scroll: {
                            fx: 'crossfade',
                            onBefore: function (data) {
                                updPhotoGalWdgtCounter(_cfs_main_slides);
                            }
                        },
                        onCreate: function (data) {
                            updPhotoGalWdgtCounter(_cfs_main_slides);
                        },
                        pagination: {
                            container: _cfs_main.next('.cfs--pagination'),
                            anchorBuilder: function (nr, item) {
                                var th = _cfs_main.height() / 5,
                                    ths = _cfs_main_slides.children('li'),
                                    thbg = ths.eq(nr - 1).attr('data-thumb'),
                                    thdesc = ths.eq(nr - 1).find('.pg-caption'),
                                    thdesc_html = thdesc.length > 0 ? thdesc.get(0).outerHTML : '';
                                return '<div class="pg-thumb" style="height: ' + th + 'px"><a href="#' + nr + '" style="background-image:url(' + thbg + ');"></a>' + thdesc_html + '</div>';
                            }
                        },
                        swipe: {
                            onTouch: Modernizr.touch ? true : false,
                            onMouse: Modernizr.touch ? true : false
                        }
                    });
                };
            // append pagination
            _cfs_main.after('<div class="cfs--pagination"></div>');
            // Load Carousel after images are loaded
            _cfs_main.imagesLoaded(doPhotoGalWdgt);

        });

    } // end checking if carouFredSel is loaded
    /* end Photo Gallery Alternative - Caroufredsel */

// Process items: make the line behind the elements
    var selectors = $(".processitems li");
    if (selectors && selectors.length > 0) {
        $(".processitems li").each(function (i, el) {
            $(el).on({
                'mouseenter': function () {
                    $(this).prevAll().each(function () {
                        $(this).addClass("lined");
                    });
                },
                'mouseleave': function () {
                    $(this).siblings().each(function () {
                        $(this).removeClass("lined");
                    });
                }
            });
        });
    }
// end Process items: make the line behind the elements


// Circular carousel element more buttom function
    var selectors = $('.ca-container .ca-wrapper');
    if (selectors && selectors.length > 0) {
        selectors.each(function (i, el) {

            var self = $(el);

            // Open wrapper panel
            var opened = false;
            self.find('.js-ca-more').on('click', function (e) {
                e.preventDefault();
                var th = $(this).closest('.ca-item'),
                    thpos = th.position().left;

                if (!opened) {
                    self.slick('slickPause');
                    self.closest('.ca-container').addClass('ca--is-rolling');
                    th.addClass('ca--opened');

                    var activeItems = self.find('.ca-item.slick-active'),
                        openedIndex = activeItems.index(th),
                        moveTo = (self.width() / activeItems.length) * openedIndex;

                    th.css({
                        "-webkit-transform": "translateX(-" + moveTo + "px)",
                        "-ms-transform": "translateX(-" + moveTo + "px)",
                        "transform": "translateX(-" + moveTo + "px)"
                    });
                    opened = true;

                } else if (opened) {

                    if ($(this).hasClass('js-ca-more-close')) {

                        self.slick('slickPlay', true);
                        self.closest('.ca-container').removeClass('ca--is-rolling');
                        th.removeClass('ca--opened');
                        th.css({
                            "-webkit-transform": "translateX(0)",
                            "-ms-transform": "translateX(0)",
                            "transform": "translateX(0)"
                        });
                        opened = false;
                    }
                }
            });
            // Close wrapper panel
            self.find('.js-ca-close').on('click', function (e) {
                e.preventDefault();
                var th = $(this).closest('.ca-item');
                if (opened) {
                    self.slick('slickPlay', true);
                    self.closest('.ca-container').removeClass('ca--is-rolling');
                    th.removeClass('ca--opened');
                    th.css({
                        "-webkit-transform": "translateX(0)",
                        "-ms-transform": "translateX(0)",
                        "transform": "translateX(0)"
                    });
                }
                opened = false;
            });
        });
    }
// end Circular carousel element more buttom function


})(window.jQuery, window, document);


// ScollSpy One page Menu
if (KallyasConfig.enableScrollSpy) {
    //#! [Configure ScrollSpy] Set the attribute on body
    $(window).on('load scroll resize', function () {
        var bodyScrollSpy = $('body[data-spy="scroll"]');
        if (KallyasConfig.enableChaserMenu && $(window).scrollTop() > KallyasConfig.chaserMenuOffsetDisplay) {
            bodyScrollSpy.attr('data-target', '#wpk-main-menu');
        } else {
            bodyScrollSpy.attr('data-target', '#main-menu');
        }
    });

    jQuery(function ($) {
        var bodyScrollSpy = $('body')
        bodyScrollSpy
            .css('position', 'relative')
            .attr('data-spy', 'scroll')
            .attr('data-offset', '5');

        // OnLoad
        var hash = window.location.hash;
        if (hash) {
            // check the main menu first
            var targets = $('#menu-main-menu > li > a');
            $.each(targets, function (a, b) {
                if (hash == $(b).attr('href')) {
                    $(b).parents('ul').first().find('*').removeClass('active');
                    $(b).addClass('active');
                    $(hash).attr('tabindex', '-1');
                    $(hash).focus();
                }
            });
        }
        // Menu item OnClick
        $('#menu-main-menu > li > a, .chaser li a').on('click', function (e) {
            var item = $(this);
            if (!item.hasClass('active')) {
                item.parents('ul').find('*').removeClass('active');
                item.addClass('active');
            }
        });
    });
}
// end ScollSpy One page Menu


// disable empty link click
(function ($) {
    // Disable clicking # anchor links
    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });

})(jQuery);