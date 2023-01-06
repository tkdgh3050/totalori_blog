// 변수 및 선택자 선언
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();
const noContentText = '내용을 입력하세요.';
const $editor__content = document.querySelector('.editor__content');
const $editor__btn = document.querySelectorAll('.editor__btn');
const $editor__img__selector = document.querySelector('#editor__img__selector');
const $main__img = document.querySelector('#main__img');
const $file__button = document.querySelector('#file__button');
const $contact__button = document.querySelector('#contact__button');
const $main__img__filename = document.querySelector('#main__img__filename');
const $main__img__fileUrl = document.querySelector('#main__img__fileUrl');

// 로직 및 함수 선언
$editor__btn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let command = btn.dataset.operation

    if ('insertImage' === command) {
      //이미지를 삽입하는 경우
      $editor__img__selector.click();
    } else if ('createLink' === command) {
      //링크를 삽입하는 경우
      const linkInput = prompt('링크를 입력해주세요.','https://');
      document.execCommand(command, false, linkInput);
    } else {
      //나머지 에디터 기능 사용하는 경우
      document.execCommand(command, false, null);
    }
  })
});

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

const imageSelect = (e) => {
  const file = e.target.files;
  if (file) {
    imageInsert(file[0]);
  }
}

const imageInsert = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    //reader 가 파일을 정상적으로 읽어온 경우 에디터에 그림 삽입
    document.execCommand('insertImage', false, `${reader.result}`)
  };
}

const isContentFocus = (e) => {
  if (e.target.classList.contains('no__content')) {
    //에디터에 focus 갔을 때 placeholder 지워주는 역할
    e.target.textContent = '';
    e.target.classList.remove('no__content');
  }
};
const isContentBlur = (e) => {
  if (e.target.classList.contains('no__content')) return;
  if (e.target.textContent === '') {
    //에디터에 blur 했을 때 글이 없다면 placeholder 넣어주는 역할
    e.target.classList.add('no__content');
    e.target.textContent = noContentText;
  }
}

const uploadMainImage = (e) => {
  const file = e.target.files[0];
  // 메인페이지 이미지 호출 로딩이 오래 걸려 같은 이름의 파일을 올리도록 고정시킴
  const fileName = 'main_bg.png';//getDateString()+ "_" + file.name;
  const storageImgMain = storageRef.child('image/main/' + fileName);
  storageImgMain.put(file) //fireStorage 에 파일 업로드
    .then((snapshot) => {
      snapshot.ref.getDownloadURL()
        .then((url) => { //업로드한 파일 url 받아오기
          $main__img__filename.value = fileName;
          $main__img__fileUrl.value = url;
        })
    })
    .catch((err) => {
      alert(err.code);
    })
}

const onClickFileSaveBtn = (e) => {
  if (!$main__img__filename.value || !$main__img__fileUrl.value) {
    //파일 선택을 안한 경우
    alert('파일을 선택하세요.');
    return; 
  }
  const param = {
    filename: $main__img__filename.value,
    fileUrl: $main__img__fileUrl.value,
    createDate: new Date(),
  }
  db.collection('mainImg').doc('mainImgOne').set(param)
    .then((_) => {
      alert('사진 변경을 완료하였습니다.');
      window.location.reload();
    })
    .catch((err) => {
      alert(err.code);
    })
}

const onClickContactSaveBtn = (e) => {

}

// 이벤트 리스너
$editor__img__selector.addEventListener('change',imageSelect);
$editor__content.addEventListener('focus',isContentFocus);
$editor__content.addEventListener('blur',isContentBlur);
$main__img.addEventListener('change',uploadMainImage);
$file__button.addEventListener('click',onClickFileSaveBtn);
$contact__button.addEventListener('click',onClickContactSaveBtn);