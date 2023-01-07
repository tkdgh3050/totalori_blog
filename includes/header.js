// 변수 및 선택자 선언
import { firebaseConfig } from '/includes/firebase-config.js';
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const $sideToggle = document.querySelector('header .header__icons .fa-bars');
const $header__menu = document.querySelector('header .header__menu');
const $menu__close = document.querySelector('header .header__menu .menu__close .fa-x');

// 로직 및 함수 선언
function checkAdmin() {
  //관리자일 경우만 admin이 보이도록 추가하는 로직
  const $menu__admin = document.querySelector('#menu__admin');
  if (document.cookie.includes('userUid')) {
    if (!$menu__admin) {
      const aTag = document.createElement('a');
      const liTag = document.createElement('li');
      aTag.href = "/views/admin/adminManage.html";
      aTag.innerHTML = 'admin';
      liTag.appendChild(aTag);
      liTag.id = 'menu__admin';
      $header__menu.appendChild(liTag);
    }
  } else {
    if ($menu__admin) {
      $menu__admin.remove();
    }
  }
};

const onClickSideToggle = () => {
  //사이드토글 눌렀을 시
  $header__menu.classList.toggle('clicked');
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded',checkAdmin)
$sideToggle.addEventListener('click',onClickSideToggle);
$menu__close.addEventListener('click',onClickSideToggle);
