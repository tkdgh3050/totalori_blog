// 변수 및 선택자 선언
const db = firebase.firestore();
$main__introduce = document.querySelector('.main__introduce');

// 로직 및 함수 선언
function loadContact() {
  db.collection('contact').doc('article').get()
    .then((doc) => {
      $main__introduce.innerHTML = doc.data().innerHTML;
    })
    .catch((err) => {
      alert(err.code);
    })
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded',loadContact);