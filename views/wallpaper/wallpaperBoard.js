// 변수 및 선택자 선언
const db = firebase.firestore();
const $wallpaper__container = document.querySelector('.wallpaper__container');
const $wallpaper__write = document.querySelector('.wallpaper__write');

// 로직 및 함수 선언
function onPageLoad() {
  if (document.cookie.includes('userUid')) {
    //admin 의 경우 글쓰기 버튼 보이게
    addWriteBtn();
  }

  db.collection('wallpaper').get()
    .then((querySnapshot) => {
      if (querySnapshot.docs[0]) {
        querySnapshot.forEach((doc) => {
          const postId = doc.id;
          const data = doc.data();
          addItem(postId, data);
        })
      }
    })
    .catch((err) => {
      alert(`불러오기에 실패했습니다. ${err.code}`);
    })
}

const getDateString = (date) => {
  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }
  return(
    date.getFullYear().toString() 
    + '-'
    + padZero(date.getMonth() + 1)
    + '-'
    + padZero(date.getDate())
  );
}

const addItem = (postId, data) => {
  const wallpaper__item = document.createElement('div');
  const post__image__preview = document.createElement('div');
  const imgTag = document.createElement('img');
  const post__content = document.createElement('div');
  const post__title = document.createElement('div');
  const post__info = document.createElement('div');
  const post__date = document.createElement('div');
  
  wallpaper__item.className = 'wallpaper__item';
  post__image__preview.className = 'post__image__preview';
  post__content.className = 'post__content';
  post__title.className = 'post__title';
  post__info.className = 'post__info';
  post__date.className = 'post__date';
  
  wallpaper__item.setAttribute('data-postid',postId);
  imgTag.src = data.previewImgURL;
  imgTag.alt = data.title;
  post__title.textContent = data.title;
  post__date.textContent = getDateString(data.createDate.toDate());

  post__image__preview.appendChild(imgTag);
  post__info.appendChild(post__date);
  post__content.appendChild(post__title);
  post__content.appendChild(post__info);
  wallpaper__item.appendChild(post__image__preview);
  wallpaper__item.appendChild(post__content);
  wallpaper__item.addEventListener('click',onClickWallpaper);
  $wallpaper__container.appendChild(wallpaper__item);
}

const onClickWallpaper = (e) => {
  const postId = e.currentTarget.dataset.postid;
  document.location.href = `/views/wallpaper/wallpaperDetail.html?postId=${postId}`; 
}

const addWriteBtn = () => {
  const btn = document.createElement('button');
  btn.id = 'write__btn';
  btn.textContent = '글쓰기';
  btn.addEventListener('click', onClickWriteBtn);
  $wallpaper__write.appendChild(btn);
}

const onClickWriteBtn = (e) => {
  document.location.href = `/views/wallpaper/wallpaperEdit.html`; 
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded', onPageLoad);