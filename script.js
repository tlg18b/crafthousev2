(() => {
  const items = [...document.querySelectorAll('.project')];
  const bgs   = [...document.querySelectorAll('.bg')];
  const N     = items.length;

  let active = 0;
  let locked = false;
  const LOCK_MS = 850;          // matches list/background transition feel

  /* Signed shortest distance from the active index, wrapped so the list loops forever.
     e.g. N=6, active=0 -> offsets: 0,1,2,3(-3),-2,-1 */
  const offsetOf = (i) => {
    let d = i - active;
    const half = N / 2;
    if (d > half)  d -= N;
    if (d < -half) d += N;
    return d;
  };

  function render(initial = false) {
    items.forEach((el, i) => {
      const o = offsetOf(i);
      const prev = parseFloat(el.style.getPropertyValue('--o'));
      const jumped = !initial && !Number.isNaN(prev) && Math.abs(o - prev) > 1;

      if (jumped) {
        /* Item is wrapping from one end to the other: hide it, snap, then restore. */
        el.classList.add('is-wrapping');
        el.style.setProperty('--o', o);
        el.dataset.d = Math.min(Math.abs(o), 3);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-wrapping')));
      } else {
        el.style.setProperty('--o', o);
        el.dataset.d = Math.min(Math.abs(o), 3);
      }
    });

    bgs.forEach((bg, i) => {
      const on = i === active;
      bg.classList.toggle('is-active', on);
      const v = bg.querySelector('video');
      if (!v) return;
      if (on) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        /* let the crossfade finish before pausing */
        setTimeout(() => { if (i !== active) v.pause(); }, 1100);
      }
    });
  }

  function go(dir) {
    if (locked) return;
    locked = true;
    active = (active + dir + N) % N;
    render();
    setTimeout(() => (locked = false), LOCK_MS);
  }

  /* ---- Wheel / trackpad (accumulate to ignore tiny deltas + inertia) ---- */
  let acc = 0, accTimer;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (locked) { acc = 0; return; }
    acc += e.deltaY;
    clearTimeout(accTimer);
    accTimer = setTimeout(() => (acc = 0), 120);
    if (Math.abs(acc) > 40) {
      go(acc > 0 ? 1 : -1);
      acc = 0;
    }
  }, { passive: false });

  /* ---- Touch ---- */
  let touchY = null;
  window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) go(dy > 0 ? 1 : -1);
    touchY = null;
  }, { passive: true });

  /* ---- Keyboard ---- */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); go(-1); }
    if (e.key === 'Enter' && document.activeElement === document.body) {
      items[active].querySelector('a').click();
    }
  });

  /* ---- Hovering a background title previews nothing; clicking any visible title navigates (native links). ---- */

  render(true);
})();
