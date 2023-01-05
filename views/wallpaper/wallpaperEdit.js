// TODO: 이전, 삭제, 등록 동작
// TODO: 이미지 등록시 업로드 진행
// TODO: 수정일 시와 등록일 시 구분하기
const $wallpaper__form = document.querySelector('#wallpaper__form');
const $editor__btn = document.querySelectorAll('.editor__btn');
const $editor__img__selector = document.querySelector('#editor__img__selector');
const $editor__content = document.querySelector('.editor__content');
const $preview__img = document.querySelector('#preview__img');

$editor__btn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let command = btn.dataset.operation

    if ('insertImage' === command) {
      $editor__img__selector.click();
    } else if ('createLink' === command) {
      const linkInput = prompt('링크를 입력해주세요.','https://');
      document.execCommand(command, false, linkInput);
    } else {
      document.execCommand(command, false, null);
    }
  })
});

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
    console.log(reader.result);
    document.execCommand('insertImage', false, `${reader.result}`)
  };
}

const registerWallpaper = (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  console.log(title);
}

const noContentText = '내용을 입력하세요.';
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
  const fileName = e.target.files[0].name;
  $preview__img__filename = document.querySelector('#preview__img__filename');
  $preview__img__filename.value = fileName;
}

$editor__img__selector.addEventListener('change',imageSelect);
$wallpaper__form.addEventListener('submit',registerWallpaper);
$editor__content.addEventListener('focus',isContentFocus);
$editor__content.addEventListener('blur',isContentBlur);
$preview__img.addEventListener('change',uploadPreviewImage);