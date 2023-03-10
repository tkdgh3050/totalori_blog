// 변수 및 선택자 선언
const db = firebase.firestore();

const EXPIRE_DAYS = 30;
const $login__btn = document.querySelector('#login__btn');
const $email__input = document.querySelector('#email__input');
const $pw__input = document.querySelector('#pw__input');

// 로직 및 함수 선언
function checkLogined() {
  //이미 로그인 한 상태인지 확인
  if (document.cookie.includes('userUid')) {
    //로그인 한 상태면 다시 로그인 하지 못하도록 메인페이지 리다이렉트
    window.location.href = '/';
  }
}

const checkValidate = (e) => {
  //이메일 비밀번호 모두 입력했는지 확인하는 로직
  e.preventDefault();
  if ($email__input.value && $pw__input.value) {
    // 이메일 & 비밀번호 모두 입력
    checkUser($email__input.value, $pw__input.value);
  } else {
    // 이메일 & 비밀번호 입력 안했을 시
    alert('이메일 혹은 비밀번호를 입력하세요.');
  }
}

const checkUser = (email, password) => {
  //로그인 진행하는 로직
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      //로그인에 성공한 경우
      setCookies('userUid', userCredential.user.uid, EXPIRE_DAYS);
      alert(`${userCredential.user.email} 님 환영합니다.`);
      window.location.href = '/';
    })
    .catch((err) => {
      //로그인에 실패한 경우
      const errCode = err.code;
      const errMsg = err.message;

      if (errCode === "auth/wrong-password") {
        //비밀번호가 틀린 경우
        alert('비밀번호가 틀렸습니다.');
      } else {
        //이외 에러인 경우
        alert(`로그인에 실패하였습니다. ${errCode + " " + errMsg}`);
      }
    })
}

const setCookies = (cookieName, cookieValue, days) => {
  //로그인 성공 시 쿠키에 저장하는 로직
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + days);
  document.cookie = cookieName + '=' + cookieValue + '; path=/; expires=' + expireDate + ';';
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded',checkLogined);
$login__btn.addEventListener('click',checkValidate);