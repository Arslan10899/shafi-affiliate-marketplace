function getCSRFToken() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

$(document).ready(function() {

    function showMessage(el, type, text) {
        $(el).removeClass('d-none alert-success alert-danger');
        $(el).addClass('alert alert-' + type + ' d-block').text(text);
    }

    function hideMessage(el) {
        $(el).addClass('d-none').removeClass('alert-success alert-danger alert-warning d-block').text('');
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

    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        hideMessage('#message');

        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        if (!username || !password) {
            showMessage('#message', 'danger', 'Please fill in all fields');
            return;
        }

        setLoading('#loginBtn', '#btnText', '#btnSpinner', true);

        try {
            var res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
                body: JSON.stringify({ username: username, password: password })
            });

            var data = await res.json();

            if (res.ok) {
                showMessage('#message', 'success', data.message);
                setTimeout(function() {
                    window.location.href = '/dashboard';
                }, 800);
            } else {
                showMessage('#message', 'danger', data.message);
            }
        } catch (err) {
            showMessage('#message', 'danger', 'Connection error. Please try again.');
        } finally {
            setLoading('#loginBtn', '#btnText', '#btnSpinner', false);
        }
    });

    $('#registerForm').on('submit', async function(e) {
        e.preventDefault();
        hideMessage('#regMessage');

        var username = $('#regUsername').val().trim();
        var email = $('#regEmail').val().trim();
        var password = $('#regPassword').val().trim();
        var confirm = $('#regConfirm').val().trim();

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

        setLoading('#regBtn', '#regBtnText', '#regBtnSpinner', true);

        try {
            var res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, email: email, password: password })
            });

            var data = await res.json();

            if (res.ok) {
                showMessage('#regMessage', 'success', data.message);
                $('#registerForm')[0].reset();
                setTimeout(function() {
                    $('#registerModal').modal('hide');
                    showMessage('#message', 'success', 'Account created! You can now login.');
                }, 1000);
            } else {
                showMessage('#regMessage', 'danger', data.message);
            }
        } catch (err) {
            showMessage('#regMessage', 'danger', 'Connection error. Please try again.');
        } finally {
            setLoading('#regBtn', '#regBtnText', '#regBtnSpinner', false);
        }
    });

    $('#registerModal').on('hidden.bs.modal', function() {
        hideMessage('#regMessage');
        $('#registerForm')[0].reset();
    });

});
