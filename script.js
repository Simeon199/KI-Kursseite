document.querySelectorAll('.faq-q').forEach(function(q) {
    q.addEventListener('click', function() {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
