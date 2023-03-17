// 변수 및 선택자 선언
const db = firebase.firestore();
const $wallpaper__edit = document.querySelector('.wallpaper__edit');
const $wallpaper__title = document.querySelector('.wallpaper__title');
const $wallpaper__create__date = document.querySelector('.wallpaper__create__date');
const $wallpaper__content = document.querySelector('.wallpaper__content');
const $wallpaper__operator = document.querySelector('.wallpaper__operator');
let postId = null;

// 로직 및 함수 선언
function onPageLoad() {
  //페이지 로드 시 실행
  const urlSearch = new URLSearchParams(location.search);
  if (!urlSearch.has('postId')) {
    //파라미터가 없을 시 접근 불가 로직
    window.location.href = '/views/wallpaper/wallpaperBoard.html';
    return;
  }
  postId = urlSearch.get('postId');

  //게시글 내용 불러오기
  db.collection('wallpaper').doc(postId).get()
    .then((doc) => {
      if (!doc.data()) {
        //게시글 아이디가 잘못 된 경우 접근 불가 로직
        alert('존재하지 않는 게시물입니다.');
        window.location.href = '/views/wallpaper/wallpaperBoard.html';
        return;
      }
      //해당 글 불러오기
      const data = doc.data();
      const createDate = data.createDate.toDate();
      $wallpaper__title.textContent = data.title;
      $wallpaper__create__date.textContent = getDateString(createDate);
      $wallpaper__content.innerHTML = data.contentHTML;

      //다음 글 가져오기
      db.collection('wallpaper').where('createDate', ">", data.createDate).limit(1).get()
        .then((doc) => {
          if (doc.docs[0]) {
            const postId = doc.docs[0].id;
            appendOperator('prev', postId, doc.docs[0].data().title);
          }
        });

      //이전 글 가져오기
      db.collection('wallpaper').where('createDate', "<", data.createDate).orderBy('createDate', 'desc').limit(1).get()
        .then((doc) => {
          if (doc.docs[0]) {
            const postId = doc.docs[0].id;
            appendOperator('next', postId, doc.docs[0].data().title);
          }
        });
    })

  // admin 의 경우 수정,삭제 버튼 추가
  if (document.cookie.includes('userUid')) {
    appendEditBtn('modify__btn', '수정');
    appendEditBtn('delete__btn', '삭제');
    addEventBtn();
  }
}

const getDateString = (date) => {
  // date 서식 변경해주는 함수
  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }
  return (
    date.getFullYear().toString()
    + '-'
    + padZero(date.getMonth() + 1)
    + '-'
    + padZero(date.getDate())
    + ' '
    + padZero(date.getHours())
    + ':'
    + padZero(date.getMinutes())
    + ':'
    + padZero(date.getSeconds())
  );
}

const appendOperator = (flag, postId, title) => {
  // 이전글, 다음글 존재하는 경우 화면에 뿌려주는 로직
  // flag = 'prev' or 'next'
  const operator__btn = document.createElement('a');
  const fa_solid = document.createElement('i');
  const content__title = document.createElement('span');
  operator__btn.className = 'operator__btn';
  operator__btn.href = '/views/wallpaper/wallpaperDetail.html?postId=' + postId;

  if (flag === 'prev') {
    //이전글
    fa_solid.className = 'fa-solid fa-chevron-up';
    content__title.id = 'prev__content__title';
    content__title.textContent = title;
  } else if (flag === 'next') {
    //다음글
    fa_solid.className = 'fa-solid fa-chevron-down';
    content__title.id = 'next__content__title';
    content__title.textContent = title;
  }
  operator__btn.appendChild(fa_solid);
  operator__btn.appendChild(content__title);
  $wallpaper__operator.appendChild(operator__btn);
}

const appendEditBtn = (id, textContent) => {
  //관리자일 경우 글 수정, 삭제 버튼 추가
  const btnTag = document.createElement('button');
  btnTag.type = 'button';
  btnTag.className = 'edit__btn';
  btnTag.id = id;
  btnTag.textContent = textContent;
  $wallpaper__edit.appendChild(btnTag);
}

const onClickModifyBtn = (e) => {
  // 수정을 누른 경우
  window.location.href = '/views/wallpaper/wallpaperEdit.html?postId=' + postId;
}

const onClickDeleteBtn = (e) => {
  //글 삭제를 누른 경우
  const deleteConfirm = confirm('정말로 삭제하겠습니까?');
  if (deleteConfirm) {
    db.collection('wallpaper').doc(postId).delete()
      .then(() => {
        alert('정상적으로 삭제하였습니다.');
        window.location.href = '/views/wallpaper/wallpaperBoard.html';
      })
      .catch((err) => {
        alert(`삭제에 실패하였습니다. ${err.code}`);
      })
  }
}

const addEventBtn = () => {
  // 수정, 삭제 버튼에 이벤트리스너 장착
  const $modify__btn = document.querySelector('#modify__btn');
  const $delete__btn = document.querySelector('#delete__btn');
  $modify__btn.addEventListener('click', onClickModifyBtn);
  $delete__btn.addEventListener('click', onClickDeleteBtn);
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded', onPageLoad);