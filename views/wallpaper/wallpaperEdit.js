// 변수 및 선택자 선언
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();
const noContentText = '내용을 입력하세요.';
const $title = document.querySelector('.wallpaper__title #title');
const $wallpaper__form = document.querySelector('#wallpaper__form');
const $editor__btn = document.querySelectorAll('.editor__btn');
const $editor__img__selector = document.querySelector('#editor__img__selector');
const $editor__content = document.querySelector('.editor__content');
const $preview__img = document.querySelector('#preview__img');
const $preview__img__filename = document.querySelector('#preview__img__filename');
const $preview__img__fileUrl = document.querySelector('#preview__img__fileUrl');
const $wallpaper__operator = document.querySelector('.wallpaper__operator');
const $cancel__wallpaper = document.querySelector('#cancel__wallpaper');
let $delete__wallpaper = null;
const $register__wallpaper = document.querySelector('#register__wallpaper');
let isNew = true;
let postId = null;
let modalFlag = false;

// 로직 및 함수 선언
function onPageLoad() {
  //글이 신규인지 수정인지 구분하기
  isNewOrEdit();
  if (!isNew) {
    //수정일 경우 기존 데이터 불러오고 삭제 버튼 추가
    loadContent();
    renderDeleteLogic();
  }
}

const getDateString = () => {
  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }
  const date = new Date();
  return(
    date.getFullYear().toString() 
    + padZero(date.getMonth() + 1)
    + padZero(date.getDate())
    + padZero(date.getHours())
    + padZero(date.getMinutes())
    + padZero(date.getSeconds())
  );
}

const isNewOrEdit = () => {
  const urlSearch = new URLSearchParams(location.search);
  if (urlSearch.has('postId')) {
    isNew = false;
    postId = urlSearch.get('postId');
  }
}

const loadContent = () => {
  db.collection('wallpaper').doc(postId).get()
    .then((doc) => {
      const data = doc.data();
      $editor__content.classList.remove('no__content');
      $title.value = data.title;
      $editor__content.innerHTML = data.contentHTML;
      $preview__img__fileUrl.value = data.previewImgURL;
      $preview__img__filename.value = data.previewImgName;
    })
    .catch((err) => {
      alert(`데이터 불러오기에 실패했습니다. ${err.code}`);
    })
}

const renderDeleteLogic = () => {
  const btnTag = document.createElement('button');
  btnTag.type = 'button';
  btnTag.id = 'delete__wallpaper';
  btnTag.className = 'operator__btn';
  btnTag.textContent = '삭제';
  $wallpaper__operator.appendChild(btnTag);
  $delete__wallpaper = document.querySelector('#delete__wallpaper');
  $delete__wallpaper.addEventListener('click',onClickDeleteBtn);
}

$editor__btn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let command = btn.dataset.operation

    if (modalFlag) return;
    modalFlag = true;
    if ('insertImage' === command) {
      $editor__img__selector.click();
    } else if ('createLink' === command) {
      const linkInput = prompt('링크를 입력해주세요.','https://');
      if (linkInput) {
        document.execCommand(command, false, linkInput);
      }
    } else {
      document.execCommand(command, false, null);
    }
    modalFlag = false;
  })
});

const imageSelect = (e) => {
  const file = e.target.files[0];
  const fileName = getDateString()+ "_" + file.name;
  const storageImgMain = storageRef.child('image/wallpaper/content/' + fileName);
  storageImgMain.put(file) //fireStorage 에 파일 업로드
    .then((snapshot) => {
      snapshot.ref.getDownloadURL()
        .then((url) => { //업로드한 파일 url 받아오기
          document.execCommand('insertImage', false, url);
        })
    })
    .catch((err) => {
      alert(err.code);
    })
    .finally(() => {
      $editor__img__selector.value = null;
    })
}

const isContentFocus = (e) => {
  if (e.target.classList.contains('no__content')) {
    e.target.textContent = '';
    e.target.classList.remove('no__content');
  }
};

const isContentBlur = (e) => {
  if (e.target.classList.contains('no__content')) return;
  if (e.target.textContent === '') {
    e.target.classList.add('no__content');
    e.target.textContent = noContentText;
  }
}

const uploadPreviewImage = (e) => {
  const file = e.target.files[0];
  const fileName = getDateString()+ "_" + file.name;
  const storageImgMain = storageRef.child('image/wallpaper/preview/' + fileName);
  storageImgMain.put(file) //fireStorage 에 파일 업로드
    .then((snapshot) => {
      snapshot.ref.getDownloadURL()
        .then((url) => { //업로드한 파일 url 받아오기
          $preview__img__filename.value = fileName;
          $preview__img__fileUrl.value = url;
        })
    })
    .catch((err) => {
      alert(err.code);
    })
}

const onClickCancelBtn = (e) => {
  //취소버튼 누를 시 뒤로 이동
  if (confirm('내용이 저장되지 않았습니다. 뒤로 가시겠습니까?')) {
    history.back();
  }
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

const onClickRegisterBtn = (e) => {
  //글 등록을 누른 경우
  if ($title.value === '') {
    //제목을 입력하지 않은 경우
    alert('제목을 입력해 주세요.');
    $title.focus();
    return;
  } else if ($editor__content.classList.contains('no__content')) {
    //내용을 입력하지 않은 경우
    alert('내용을 입력해 주세요.');
    $editor__content.focus();
    return;
  } else if ($preview__img__filename.value === '') {
    alert('미리보기 사진을 등록해주세요.');
    return;
  }

  let param = {
    title: $title.value,
    contentHTML: $editor__content.innerHTML,
    previewImgURL: $preview__img__fileUrl.value,
    previewImgName: $preview__img__filename.value,
    lastModifyDate: new Date(),
  };
  if (isNew) {
    // 글 등록인 경우
    param.createDate = param.lastModifyDate;
    db.collection('wallpaper').add(param)
      .then((doc) => {
        alert('정상적으로 글을 등록했습니다.');
        window.location.href = '/views/wallpaper/wallpaperDetail.html?postId=' + doc.id;
      })
      .catch((err) => {
        alert(err.code);
      })
  } else {
    // 글 수정인 경우
    db.collection('wallpaper').doc(postId).update(param)
      .then((_) => {
        alert('정상적으로 글을 수정했습니다.');
        window.location.href = '/views/wallpaper/wallpaperDetail.html?postId=' + postId;
      })
      .catch((err) => {
        alert(err.code);
      })
  }
}

// 이벤트 리스너
window.addEventListener('DOMContentLoaded',onPageLoad);
$editor__img__selector.addEventListener('change',imageSelect);
$editor__content.addEventListener('focus',isContentFocus);
$editor__content.addEventListener('blur',isContentBlur);
$preview__img.addEventListener('change',uploadPreviewImage);
$cancel__wallpaper.addEventListener('click',onClickCancelBtn);
$register__wallpaper.addEventListener('click',onClickRegisterBtn);