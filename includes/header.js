const $sideToggle = document.querySelector('header .header__icons .fa-bars');
const $header__menu = document.querySelector('header .header__menu');
const $menu__close = document.querySelector('header .header__menu .menu__close .fa-x');

const onClickSideToggle = () => {
    $header__menu.classList.toggle('clicked');
}

$sideToggle.addEventListener('click',onClickSideToggle);
$menu__close.addEventListener('click',onClickSideToggle);