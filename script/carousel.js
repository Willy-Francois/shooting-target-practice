const carousel = document.getElementById('carousel');
let currentIndex = 1; // Commence par la div du milieu
console.log("caroussel")

document.addEventListener('DOMContentLoaded', function() {
    var contentGalleries = document.querySelectorAll('.content-gallery');
    var maxHeight = 0;

    // Trouver la hauteur maximale
    contentGalleries.forEach(function(gallery) {
        if (gallery.offsetHeight > maxHeight) {
            maxHeight = gallery.offsetHeight;
        }
    });

    // Appliquer la hauteur maximale à tous les éléments
    contentGalleries.forEach(function(gallery) {
        gallery.style.height = maxHeight + 'px';
    });
});


document.getElementById('navigateLeft').addEventListener('click', function() {
    navigate('left');
});

document.getElementById('navigateRight').addEventListener('click', function() {
    navigate('right');
});

function navigate(direction) {
    const items = document.querySelectorAll('.carousel-item');
    items[currentIndex].classList.remove('visible');

    if (direction === 'right') {
        currentIndex = (currentIndex + 1) % items.length;
    } else if (direction === 'left') {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    }

    items[currentIndex].classList.add('visible');
}

// Ajoutez des écouteurs d'événements pour gérer les swipes ou les clics sur des boutons de navigation
carousel.addEventListener('swipeleft', function() {
    console.log("a")
    navigate('left'); });
carousel.addEventListener('swiperight', function() {
    console.log("b")
    navigate('right'); });
