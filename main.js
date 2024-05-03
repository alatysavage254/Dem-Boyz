const current = document.querySelector('#current');
const imgs = document.querySelectorAll('.imgs img');
const opacity = 0.6;

//const [current, imgs] = [document.querySelector('#current'), document.querySelectorAll('.imgs img')];

imgs.forEach(img => img.addEventListener('click', imgClick));

function imgClick(e) {
    //Reset the opacity
    imgs.forEach(img => (img.style.opacity = 1));
    // change current image to src of clicked image
    current.src = e.target.src;

    //Add fade in class
    current.classList.add('fade-in');

    // Remove fade-in class
    current.classList.add('fade-in')

    //change opacity to var
    e.target.style.opacity = opacity;
}
