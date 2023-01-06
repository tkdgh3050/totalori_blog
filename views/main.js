// 변수 및 선택자 선언
const db = firebase.firestore();
$main__img = document.querySelector('.main__img');

// 로직 및 함수 선언
function loadMainImg () {
  // db.collection('mainImg').doc('mainImgOne').get()
  //   .then((doc) => {
    //     const fileUrl = doc.data().fileUrl;
    //     const imgTag = document.createElement('img');
    //     imgTag.src = fileUrl;
    //     imgTag.alt = 'main background image';
    //     $main__img.appendChild(imgTag);
    //   })
  // 메인페이지 이미지 호출 로딩이 오래 걸려 같은 이름의 파일을 올리도록 고정시킴
  const fileUrl = 'https://firebasestorage.googleapis.com/v0/b/totalori-blog.appspot.com/o/image%2Fmain%2Fmain_bg.png?alt=media';
  const imgTag = document.createElement('img');
  imgTag.src = fileUrl;
  imgTag.alt = 'main background image';
  $main__img.appendChild(imgTag);
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded', loadMainImg);