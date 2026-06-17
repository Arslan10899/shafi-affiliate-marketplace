// Auto-add CSRF token to all POST forms
document.addEventListener('submit', function(e) {
  var form = e.target;
  if ((form.method || '').toLowerCase() === 'post') {
    if (!form.querySelector('input[name="csrf_token"]')) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'csrf_token';
      input.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      form.appendChild(input);
    }
  }
});

$(document).ready(function () {
  // Tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map(function (el) { return new bootstrap.Tooltip(el) })

  // Scrollbar
  if ($.fn.scrollbar) { $('.scrollbar-inner').scrollbar() }

  // Sidebar toggle
  var navOpen = false
  $('.sidenav-toggler').on('click', function () {
    navOpen = !navOpen
    $('html').toggleClass('nav_open', navOpen)
    $(this).toggleClass('toggled', navOpen)
  })

  // Topbar toggle
  var topbarOpen = false
  $('.topbar-toggler').on('click', function () {
    topbarOpen = !topbarOpen
    $('html').toggleClass('topbar_open', topbarOpen)
    $(this).toggleClass('toggled', topbarOpen)
  })

  // Select all checkbox
  $('[data-select="checkbox"]').on('change', function () {
    var target = $(this).data('target')
    $(target).prop('checked', $(this).prop('checked'))
  })

  // AJAX CSRF setup
  var token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', token);
        }
      }
    });
  }
})
