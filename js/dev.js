

class Gallery {
  constructor(element, options = {}) {
    this.el = element;
    this.options = Object.assign({
      current: 0,
      autoplay: true,
      interval: 2000,
    }, options);

    this.support3d = CSS.supports("transform-style", "preserve-3d");
    this.support2d = CSS.supports("transform", "translateX(0)");
    this.supportTrans = CSS.supports("transition", "all 0.3s");

    this.wrapper = this.el.querySelector(".dg-wrapper");
    this.items = Array.from(this.wrapper.children);
    this.itemsCount = this.items.length;

    this.nav = this.el.querySelector("nav");
    this.navPrev = this.nav.querySelector(".dg-prev");
    this.navNext = this.nav.querySelector(".dg-next");

    if (this.itemsCount < 3) {
      this.nav.remove();
      return;
    }

    this.current = this.options.current;
    this.isAnim = false;

    this.items.forEach(item => {
      item.style.opacity = "0";
      item.style.visibility = "hidden";
    });

    this._validate();
    this._layout();
    this._loadEvents();

    if (this.options.autoplay) {
      this._startSlideshow();
    }
  }

  _validate() {
    if (this.options.current < 0 || this.options.current > this.itemsCount - 1) {
      this.current = 0;
    }
  }

  _layout() {
    this._setItems();

    let leftCSS, rightCSS, currentCSS;

    if (this.support3d && this.supportTrans) {
      leftCSS = {
        transform: 'translateX(-350px) translateZ(-200px) rotateY(45deg)',
        opacity: '1',
        visibility: 'visible'
      };
      rightCSS = {
        transform: 'translateX(350px) translateZ(-200px) rotateY(-45deg)',
        opacity: '1',
        visibility: 'visible'
      };
    } else if (this.support2d && this.supportTrans) {
      leftCSS = {
        transform: 'translate(-350px) scale(0.8)',
        opacity: '1',
        visibility: 'visible'
      };
      rightCSS = {
        transform: 'translate(350px) scale(0.8)',
        opacity: '1',
        visibility: 'visible'
      };
      currentCSS = {
        zIndex: 999
      };
    }

    this._applyStyles(this.leftItem, leftCSS || {});
    this._applyStyles(this.rightItem, rightCSS || {});

    let currentStyles = Object.assign({}, currentCSS || {}, {
      opacity: '1',
      visibility: 'visible'
    });
    this._applyStyles(this.currentItem, currentStyles);
    this.currentItem.classList.add('dg-center');
  }

  _setItems() {
    this.items.forEach(item => item.classList.remove('dg-center'));

    this.currentItem = this.items[this.current];
    this.leftItem = this.current === 0 ? this.items[this.itemsCount - 1] : this.items[this.current - 1];
    this.rightItem = this.current === this.itemsCount - 1 ? this.items[0] : this.items[this.current + 1];

    if (!this.support3d && this.support2d && this.supportTrans) {
      this.items.forEach(item => item.style.zIndex = 1);
      this.currentItem.style.zIndex = 999;
    }

    if (this.itemsCount > 3) {
      this.nextItem = this.rightItem === this.items[this.itemsCount - 1] ? this.items[0] : this.items[this.items.indexOf(this.rightItem) + 1];
      this.prevItem = this.leftItem === this.items[0] ? this.items[this.itemsCount - 1] : this.items[this.items.indexOf(this.leftItem) - 1];

      this._applyStyles(this.nextItem, this._getCoordinates('outright'));
      this._applyStyles(this.prevItem, this._getCoordinates('outleft'));
    }
  }

  _applyStyles(el, styles) {
    if (!el) return;
    for (const prop in styles) {
      el.style[prop] = styles[prop];
    }
  }

  _loadEvents() {
    this.navPrev.addEventListener('click', e => {
      e.preventDefault();
      if (this.options.autoplay) {
        clearTimeout(this.slideshow);
        this.options.autoplay = false;
      }
      this._navigate('prev');
    });

    this.navNext.addEventListener('click', e => {
      e.preventDefault();
      if (this.options.autoplay) {
        clearTimeout(this.slideshow);
        this.options.autoplay = false;
      }
      this._navigate('next');
    });

    this.wrapper.addEventListener('transitionend', () => {
      this.currentItem.classList.add('dg-center');
      this.items.forEach(item => item.classList.remove('dg-transition'));
      this.isAnim = false;
    });
  }

  _getCoordinates(position) {
    if (this.support3d && this.supportTrans) {
      switch (position) {
        case 'outleft':
          return { transform: 'translateX(-450px) translateZ(-300px) rotateY(45deg)', opacity: '0', visibility: 'hidden' };
        case 'outright':
          return { transform: 'translateX(450px) translateZ(-300px) rotateY(-45deg)', opacity: '0', visibility: 'hidden' };
        case 'left':
          return { transform: 'translateX(-350px) translateZ(-200px) rotateY(45deg)', opacity: '1', visibility: 'visible' };
        case 'right':
          return { transform: 'translateX(350px) translateZ(-200px) rotateY(-45deg)', opacity: '1', visibility: 'visible' };
        case 'center':
          return { transform: 'translateX(0) translateZ(0) rotateY(0)', opacity: '1', visibility: 'visible' };
      }
    } else if (this.support2d && this.supportTrans) {
      switch (position) {
        case 'outleft':
          return { transform: 'translate(-450px) scale(0.7)', opacity: '0', visibility: 'hidden' };
        case 'outright':
          return { transform: 'translate(450px) scale(0.7)', opacity: '0', visibility: 'hidden' };
        case 'left':
          return { transform: 'translate(-350px) scale(0.8)', opacity: '1', visibility: 'visible' };
        case 'right':
          return { transform: 'translate(350px) scale(0.8)', opacity: '1', visibility: 'visible' };
        case 'center':
          return { transform: 'translate(0) scale(1)', opacity: '1', visibility: 'visible' };
      }
    } else {
      switch (position) {
        case 'outleft':
        case 'outright':
        case 'left':
        case 'right':
          return { opacity: '0', visibility: 'hidden' };
        case 'center':
          return { opacity: '1', visibility: 'visible' };
      }
    }
  }

 _navigate(dir) {
  if (this.supportTrans && this.isAnim) return;

  this.isAnim = true;

  let newCurrent;

  switch (dir) {
    case 'next':
      newCurrent = this.items.indexOf(this.rightItem);

      this.currentItem.classList.add('dg-transition');
      this._applyStyles(this.currentItem, this._getCoordinates('left'));

      this.rightItem.classList.add('dg-transition');
      this._applyStyles(this.rightItem, this._getCoordinates('center'));

      if (this.nextItem) {
        this.leftItem.classList.add('dg-transition');
        this._applyStyles(this.leftItem, this._getCoordinates('outleft'));

        this.nextItem.classList.add('dg-transition');
        this._applyStyles(this.nextItem, this._getCoordinates('right'));
      } else {
        this.leftItem.classList.add('dg-transition');
        this._applyStyles(this.leftItem, this._getCoordinates('right'));
      }
      break;

    case 'prev':
      newCurrent = this.items.indexOf(this.leftItem);

      this.currentItem.classList.add('dg-transition');
      this._applyStyles(this.currentItem, this._getCoordinates('right'));

      this.leftItem.classList.add('dg-transition');
      this._applyStyles(this.leftItem, this._getCoordinates('center'));

      if (this.prevItem) {
        this.rightItem.classList.add('dg-transition');
        this._applyStyles(this.rightItem, this._getCoordinates('outright'));

        this.prevItem.classList.add('dg-transition');
        this._applyStyles(this.prevItem, this._getCoordinates('left'));
      } else {
        this.rightItem.classList.add('dg-transition');
        this._applyStyles(this.rightItem, this._getCoordinates('left'));
      }
      break;
  }

  // 상태 갱신은 transition 끝난 후에 하도록 변경
  this.wrapper.addEventListener('transitionend', () => {
    this.current = newCurrent;  // 현재 인덱스 업데이트
    this._setItems();

    this.currentItem.classList.add('dg-center');
    this.items.forEach(item => item.classList.remove('dg-transition'));

    this.isAnim = false;
  }, { once: true });  // 이벤트 리스너는 한 번만 실행되도록

  if (!this.supportTrans) {
    this.current = newCurrent;
    this._setItems();
    this.currentItem.classList.add('dg-center');
    this.isAnim = false;
  }
}

  _startSlideshow() {
    this.slideshow = setTimeout(() => {
      this._navigate('next');
      if (this.options.autoplay) {
        this._startSlideshow();
      }
    }, this.options.interval);
  }
}

// Dev 페이지 초기화 함수 (메인에서 호출하기 위한 함수)
function initDevPage() {
  const galleryElement = document.getElementById('dg-container');
  if (galleryElement) {
    new Gallery(galleryElement);
  }
}

// 기존 DOMContentLoaded 제거 (SPA라서 필요 없음)
// document.addEventListener('DOMContentLoaded', () => {
//   initDevPage();
// });