const $wallpaper__item = document.querySelectorAll('.wallpaper__item');

$wallpaper__item.forEach(element => {
    element.addEventListener('click',(e) => {
        const postId = e.currentTarget.id;
        document.location.href = `wallpaperDetail.html?postId=${postId}`;
    })
});