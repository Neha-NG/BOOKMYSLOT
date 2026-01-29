  (() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');
    console.log("Validation script loaded");

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          console.log("Form blocked due to validation");
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();
