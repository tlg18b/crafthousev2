document.querySelectorAll('.header').forEach(function (header, index) {
  const primaryNav = header.querySelector('.nav--left');
  const socialNav = header.querySelector('.nav--right');
  if (!primaryNav || !socialNav) return;

  const menuId = 'mobile-menu-' + (index + 1);
  const toggle = document.createElement('button');
  toggle.className = 'mobile-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-controls', menuId);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span>';

  const backdrop = document.createElement('button');
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.type = 'button';
  backdrop.setAttribute('aria-label', 'Close menu');
  backdrop.hidden = true;

  const menu = document.createElement('nav');
  menu.className = 'mobile-menu';
  menu.id = menuId;
  menu.setAttribute('aria-label', 'Mobile');
  menu.hidden = true;
  [primaryNav, socialNav].forEach(function (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      menu.appendChild(link.cloneNode(true));
    });
  });

  header.append(toggle, backdrop, menu);

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.hidden = true;
    backdrop.hidden = true;
  }

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
      return;
    }

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.hidden = false;
    backdrop.hidden = false;
    menu.querySelector('a').focus();
  });

  backdrop.addEventListener('click', closeMenu);
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });

  header.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
});
