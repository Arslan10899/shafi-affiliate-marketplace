// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.alert-dismissible').forEach(function(el) {
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(el);
            bsAlert.close();
        }, 5000);
    });

    // Product gallery thumbnail sync
    var gallery = document.getElementById('productGallery');
    if (gallery) {
        gallery.addEventListener('slid.bs.carousel', function(e) {
            document.querySelectorAll('.thumb-img').forEach(function(img) {
                img.classList.remove('active');
                img.style.opacity = '0.5';
                img.style.borderColor = 'transparent';
            });
            var active = document.querySelector('.thumb-img[data-bs-slide-to="' + e.to + '"]');
            if (active) {
                active.classList.add('active');
                active.style.opacity = '1';
                active.style.borderColor = '#f59e0b';
                active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }
});
