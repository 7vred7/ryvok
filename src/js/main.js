/*
* to include js file write: `//= include ./path-to-file`
* */

//= include lib/jquery.min.js
//= include lib/iphone-inline-video.js
//= include lib/ScrollMagic.js
//= include lib/TweenMax.min.js
//= include lib/animation.gsap.js

/**
 * CUSTOM SCRIPTS
 **/

$(document).ready(function () {
  var scrolled;
  function addScrollClass () {
    scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 100) {
      $('.header').addClass('on-scroll');
    } else {
      $('.header').removeClass('on-scroll');
    }
  }

  addScrollClass();

  /**
   * MOB MENU SCRIPT
   **/

  var nav = $('.menu-header');
  $('.burger').click(function (e) {
    e.preventDefault();
    nav.addClass('open');
  });
  $('.close-menu').click(function (e) {
    e.preventDefault();
    nav.removeClass('open');
  });

  /**
   * MAGIC SCROLL SCRIPT | BANNER SECTION
   **/

  var maxFirst = $('.block-max');
  var controller = new ScrollMagic.Controller();
  var backPhotos = $('#blockImagesID');
  var book = $('.block-book');
  var photosHeight = document.getElementById('blockImagesID').getBoundingClientRect().height;

  var scrollMax = new ScrollMagic.Scene({
    triggerElement: '#screen-one',
    triggerHook: 0,
    duration: photosHeight / 1.5
  }).addTo(controller).setTween(backPhotos, {
    y: -(photosHeight),
    ease: Sine.easeIn
  });

  var scrollPhotos = new ScrollMagic.Scene({
    triggerElement: '#screen-one',
    triggerHook: 0,
    duration: maxFirst.height()
  }).addTo(controller).setTween(maxFirst, {
    y: -(maxFirst.height() * 0.25),
    ease: Sine.easeIn
  });

  var scrollBook = new ScrollMagic.Scene({
    triggerElement: '#screen-one',
    triggerHook: '0',
    duration: book.height() / 1.25
  }).addTo(controller).setTween(book, {
    y: -(book.height() * 0.30),
    ease: Sine.easeIn
  });

  var scrollPhoneRight = new ScrollMagic.Scene({
    triggerElement: '#screen-two',
    triggerHook: 'onLeave'
  })
    .setClassToggle('#phoneRight', 'updown')
    .addTo(controller);

  var scrollPhoneLeft = new ScrollMagic.Scene({
    triggerElement: '#screen-three',
    triggerHook: 'onLeave',
    offset: -100
  })
    .setClassToggle('#phoneLeft', 'updown')
    .addTo(controller);

  var controllerUaperio = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: 'onEnter'}});

  new ScrollMagic.Scene({triggerElement: '#trigger4', duration: '100%', reverse: false})
    .setClassToggle('.we-make', 'animate')
    .addTo(controllerUaperio);

  /**
   * IPHONE VIDEO FIX SCRIPT
   **/

  $('video').each(function () {
    enableInlineVideo(this);
  });

  /**
   * DIET SECTION SCRIPT
   **/

  $.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var viewportTop = $(window).scrollTop();
    return elementTop + $(this).height() - $(window).height() <= viewportTop;
  };

  var dietSection = $('#diet-section');
  var flag = !dietSection.isInViewport();

  function ineractiveSection () {
    var scrollTop = dietSection.offset().top + dietSection.height() - $(window).height();

    if ((dietSection.isInViewport() && flag)) {
      scrollToScreen('#diet-section', scrollTop, 0);
      flag = false;
      $('body').css({overflow: 'hidden'});
    }
  }

  var previous = window.scrollY;

  window.addEventListener('scroll', function () {
    addScrollClass();
    if (window.scrollY > previous) {
      ineractiveSection();
    }
    previous = window.scrollY;
  });

  /**
   * DIET SECTION CANVAS SCRIPT
   **/

  function addClick (x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  function redraw () {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = '#00b7f4';
    context.lineJoin = 'round';
    context.lineWidth = 15;
    for (var i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();
    }
  }

  function scrollToScreen (screen, scrollTop, time) {
    $('html, body').animate({
      scrollTop: scrollTop
    }, time);
  }

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var paint = false;
  var paintEnabled = true;
  var crossed = {
    start: {},
    length: 0,
    max: 600,
    height: 75
  };
  var draw = $('#draw');

  canvas.width = draw.width();
  canvas.height = draw.height();

  draw.on('touchstart mousedown', function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (!paintEnabled) return;

    var ev = e.touches ? e.touches[0] : e;
    var mouseX = ev.pageX - draw.offset().left;
    var mouseY = ev.pageY - draw.offset().top;

    paint = true;
    addClick(mouseX, mouseY);
    redraw();

    crossed.width = $('.proposal-section-title').width() / 2;
    crossed.length = 0;
    crossed.start = {
      x: mouseX,
      y: mouseY
    };
    crossed.paint = true;

  }).on('touchmove mousemove', function (e) {
    if (paint) {
      var ev = e.touches ? e.touches[0] : e;
      var draw = $('#draw');

      var mouseX = ev.pageX - draw.offset().left;
      var mouseY = ev.pageY - draw.offset().top;

      addClick(mouseX, mouseY, true);
      redraw();

      var ww = $(window).width() / 2;
      var wh = $(window).height() / 2;

      if (crossed.paint) {
        crossed.length = Math.max(crossed.length, Math.abs(mouseX - crossed.start.x));
        if (crossed.length > crossed.width) {
          crossed.end = true;
        }
      }
    }
  }).on('touchend mouseup', function (e) {
    paint = false;
    crossed.paint = false;

    var sectionOffset = $('#next').offset().top;

    $(window).on('resize', function (e) {
      sectionOffset = $('#next').offset().top;
    });

    if (crossed.end) {
      paintEnabled = false;
      $('body').css({overflow: 'visible'});
      $('#draw').css({
        cursor: 'default',
        pointerEvents: 'none'
      });
      scrollToScreen('#next', sectionOffset - 70, 500);
    }
  }).mouseleave(function (e) {
    paint = false;
    crossed.paint = false;
  });
  var clickX = [];
  var clickY = [];
  var clickDrag = [];
});
