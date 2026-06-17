$(document).ready(function() {
    // ====== FLASH SALE COUNTDOWN ======
    function startCountdown(hours, minutes, seconds) {
        var totalSeconds = hours * 3600 + minutes * 60 + seconds;
        function updateTimer() {
            if (totalSeconds <= 0) {
                $('#cd-hours').text('00');
                $('#cd-minutes').text('00');
                $('#cd-seconds').text('00');
                return;
            }
            var h = Math.floor(totalSeconds / 3600);
            var m = Math.floor((totalSeconds % 3600) / 60);
            var s = totalSeconds % 60;
            $('#cd-hours').text(String(h).padStart(2, '0'));
            $('#cd-minutes').text(String(m).padStart(2, '0'));
            $('#cd-seconds').text(String(s).padStart(2, '0'));
            totalSeconds--;
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }
    startCountdown(2, 35, 48);

    // ====== CART MANAGEMENT (server-side AJAX) ======
    $(document).on('click', '.add-cart', function() {
        var pid = $(this).data('pid');
        var btn = $(this);
        var name = btn.closest('.product-card').find('.product-name').text();
        $.ajax({
            url: '/cart/add/' + pid,
            method: 'POST',
            success: function(res) {
                if (res.success) {
                    $('.cart-count').text(res.count);
                    toast('success', name + ' added to cart!');
                }
            },
            error: function() {
                toast('error', 'Please login to add items to cart');
            }
        });
    });

    // ====== WISHLIST (server-side AJAX) ======
    $(document).on('click', '.add-wishlist', function() {
        var pid = $(this).data('pid');
        var btn = $(this);
        var name = btn.closest('.product-card').find('.product-name').text();
        $.ajax({
            url: '/wishlist/add/' + pid,
            method: 'POST',
            success: function(res) {
                if (res.success) {
                    $('.wishlist-count').text(res.count);
                    toast('success', name + ' added to wishlist!');
                }
            },
            error: function() {
                toast('error', 'Please login to add items to wishlist');
            }
        });
    });

    // ====== QUICK VIEW ======
    $(document).on('click', '.quick-view', function() {
        var card = $(this).closest('.product-card');
        var name = card.find('.product-name').text();
        var price = card.find('.current-price').text();
        toast('info', name + ' - ' + price);
    });

    // ====== TOAST NOTIFICATION ======
    function toast(type, message) {
        var bg = type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db';
        var toastHtml = '<div style="position:fixed;bottom:20px;right:20px;z-index:9999;background:' + bg + ';color:#fff;padding:12px 25px;border-radius:8px;font-size:14px;font-weight:600;box-shadow:0 5px 15px rgba(0,0,0,0.2);transition:all 0.3s;opacity:0;transform:translateY(20px);">' + message + '</div>';
        var $toast = $(toastHtml);
        $('body').append($toast);
        setTimeout(function() {
            $toast.css({ opacity: 1, transform: 'translateY(0)' });
        }, 50);
        setTimeout(function() {
            $toast.css({ opacity: 0, transform: 'translateY(20px)' });
            setTimeout(function() { $toast.remove(); }, 300);
        }, 2500);
    }

    // ====== LOGIN FORM ======
    function showMessage(el, type, text) {
        $(el).removeClass('d-none alert-success alert-danger alert-info');
        $(el).addClass('alert alert-' + type + ' d-block').text(text);
    }
    function hideMessage(el) {
        $(el).addClass('d-none').removeClass('alert-success alert-danger alert-info d-block').text('');
    }
    function setLoading(btn, textEl, spinnerEl, isLoading) {
        if (isLoading) {
            $(textEl).addClass('d-none');
            $(spinnerEl).removeClass('d-none');
            $(btn).prop('disabled', true);
        } else {
            $(textEl).removeClass('d-none');
            $(spinnerEl).addClass('d-none');
            $(btn).prop('disabled', false);
        }
    }

    $('#homeLoginForm').on('submit', async function(e) {
        e.preventDefault();
        hideMessage('#loginMessage');
        var username = $('#homeUsername').val().trim();
        var password = $('#homePassword').val().trim();
        if (!username || !password) {
            showMessage('#loginMessage', 'danger', 'Please fill in all fields');
            return;
        }
        setLoading('#homeLoginBtn', '#homeBtnText', '#homeBtnSpinner', true);
        try {
            var res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });
            var data = await res.json();
            if (res.ok) {
                showMessage('#loginMessage', 'success', data.message);
                setTimeout(function() {
                    window.location.href = '/dashboard';
                }, 800);
            } else {
                showMessage('#loginMessage', 'danger', data.message);
            }
        } catch (err) {
            showMessage('#loginMessage', 'danger', 'Connection error. Please try again.');
        } finally {
            setLoading('#homeLoginBtn', '#homeBtnText', '#homeBtnSpinner', false);
        }
    });

    // ====== REGISTER FORM ======
    $('#homeRegisterForm').on('submit', async function(e) {
        e.preventDefault();
        hideMessage('#regMessage');
        var username = $('#homeRegUsername').val().trim();
        var email = $('#homeRegEmail').val().trim();
        var password = $('#homeRegPassword').val().trim();
        var confirm = $('#homeRegConfirm').val().trim();
        if (!username || !email || !password || !confirm) {
            showMessage('#regMessage', 'danger', 'Please fill in all fields');
            return;
        }
        if (password !== confirm) {
            showMessage('#regMessage', 'danger', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            showMessage('#regMessage', 'danger', 'Password must be at least 6 characters');
            return;
        }
        setLoading('#homeRegBtn', '#homeRegBtnText', '#homeRegBtnSpinner', true);
        try {
            var res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, email: email, password: password })
            });
            var data = await res.json();
            if (res.ok) {
                showMessage('#regMessage', 'success', data.message);
                $('#homeRegisterForm')[0].reset();
                setTimeout(function() {
                    $('#registerModal').modal('hide');
                    showMessage('#loginMessage', 'success', 'Account created! You can now login.');
                }, 1000);
            } else {
                showMessage('#regMessage', 'danger', data.message);
            }
        } catch (err) {
            showMessage('#regMessage', 'danger', 'Connection error. Please try again.');
        } finally {
            setLoading('#homeRegBtn', '#homeRegBtnText', '#homeRegBtnSpinner', false);
        }
    });

    // ====== NEWSLETTER ======
    $('#newsletterForm').on('submit', function(e) {
        e.preventDefault();
        var email = $(this).find('input[type="email"]').val().trim();
        if (email) {
            toast('success', 'Thank you for subscribing!');
            $(this)[0].reset();
        }
    });

    // ====== MODAL CLEANUP ======
    $('#registerModal').on('hidden.bs.modal', function() {
        hideMessage('#regMessage');
        $('#homeRegisterForm')[0].reset();
    });
});
