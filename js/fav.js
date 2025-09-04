import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'

const body = document.querySelector('body');
const openBtn = document.querySelectorAll('[data-open]'); //開くボタン
const closeBtn = document.querySelectorAll('[data-close]'); //閉じるボタン
const closeArea = document.querySelector('[data-closearea]'); //モーダル背景
const slideBtn = document.querySelectorAll('[data-slide]'); //スライド切替ボタン
const modalAction = document.querySelectorAll('[data-modalaction]'); //モーダル表示時にクラスを追加
let windowTop = 0;

//モーダル表示
const modalOpen = () => {
  modalAction.forEach((item) => {
    item.classList.add("modal-active");
  });
  windowTop = window.scrollY;
  body.style.top = - windowTop + "px";
  body.classList.add("modal-active"); //bodyの位置をずらすことで、見た目上は、コンテンツの位置を変えない
}

//モーダル非表示
const modalClose = (id) => {
  modalAction.forEach((item) => {
    item.classList.remove("modal-active");
  });
  body.classList.remove("modal-active"); //fixedを解除
  body.style.top = "";
  window.scrollTo({
    top: windowTop, //元の位置にスクロール
  });
}

//ボタン クリック
openBtn.forEach((item) => {
  item.addEventListener('click', () => {
    modalOpen();
  });
});
closeBtn.forEach((item) => {
  item.addEventListener('click', () => {
    modalClose();
  });
});
window.addEventListener('click', (e) => {
  if (e.target == closeArea) {
    modalClose();
  }
});

//スワイパー
const swiper = new Swiper("[data-modalswiper]", {
  speed: 300,
  effect: 'fade',
  autoHeight: true,
  loop: true,
  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: "[data-modalnext]",
    prevEl: "[data-modalprev]",
  },
  pagination: {
    el: "[data-modalpagination]",
  },
});

slideBtn.forEach((item) => {
  item.addEventListener('click', () => {
    const index = item.dataset.slide;
    swiper.slideTo(index, 0);
  });
});