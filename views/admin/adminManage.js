const $editor__content = document.querySelector('.editor__content');
const $editor__btn = document.querySelectorAll('.editor__btn');
const $editor__img__selector = document.querySelector('#editor__img__selector');
const $main__img = document.querySelector('#main__img');

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

const uploadMainImage = (e) => {
  const fileName = e.target.files[0].name;
  $main__img__filename = document.querySelector('#main__img__filename');
  $main__img__filename.value = fileName;
}

$editor__img__selector.addEventListener('change',imageSelect);
$editor__content.addEventListener('focus',isContentFocus);
$editor__content.addEventListener('blur',isContentBlur);
$main__img.addEventListener('change',uploadMainImage);