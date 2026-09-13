const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

const rail = document.querySelector('.project-rail');
let down = false, startX = 0, startScroll = 0, moved = false;
rail.addEventListener('pointerdown', e => {
  down = true;
  moved = false;
  startX = e.pageX;
  startScroll = rail.parentElement.scrollLeft;
  rail.classList.add('dragging');
  rail.setPointerCapture(e.pointerId);
});
rail.addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.pageX - startX;
  if (Math.abs(dx) > 6) moved = true;
  if (moved) e.preventDefault();
  rail.parentElement.scrollLeft = startScroll - dx * 1.15;
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(name => rail.addEventListener(name, () => {
  down = false;
  rail.classList.remove('dragging');
}));
// Swallow the click that follows a drag so it doesn't accidentally
// trigger a "View Project" button or a GitHub/Live link underneath the pointer.
rail.addEventListener('click', e => {
  if (moved) {
    e.preventDefault();
    e.stopPropagation();
    moved = false;
  }
}, true);

// Project detail modal — populated from each project's hidden <template class="project-detail">
const projectModal = document.querySelector('.project-modal');
const projectModalBody = projectModal.querySelector('.project-modal-body');
const projectModalClose = projectModal.querySelector('.project-modal-close');

const openProjectModal = article => {
  const detail = article.querySelector('.project-detail');
  const actions = article.querySelector('.project-actions');
  projectModalBody.innerHTML = '';
  if (detail) projectModalBody.appendChild(detail.content.cloneNode(true));
  if (actions) {
    const links = actions.cloneNode(true);
    links.querySelectorAll('[data-open-project]').forEach(btn => btn.remove());
    if (links.children.length) {
      links.classList.add('project-modal-links');
      projectModalBody.appendChild(links);
    }
  }
  projectModal.classList.add('is-open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closeProjectModal = () => {
  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('[data-open-project]').forEach(btn => {
  btn.addEventListener('click', () => openProjectModal(btn.closest('.project')));
});

projectModalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', e => { if (e.target === projectModal) closeProjectModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.animate([{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}); }), { threshold: .12 });
document.querySelectorAll('.statement h2,.statement-foot,.work-head,.project,.tool-cloud,.contact-title').forEach(el => { el.style.opacity = 0; observer.observe(el); });

const revealOnce = (selector, className, opts) => {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add(className);
      io.unobserve(entry.target);
    }
  }), opts || { threshold: 0.25 });
  els.forEach(el => io.observe(el));
};

revealOnce('.exp-node', 'in-view', { threshold: 0.35 });
revealOnce('.skill-flow-wrap', 'in-view', { threshold: 0.08 });
revealOnce('.cert-item', 'in-view', { threshold: 0.3 });

const slides = [...document.querySelectorAll('main > section')];
slides.forEach((slide, index) => {
  if (index === 0) return;
  slide.classList.add('slide-scene');
});
const slideObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('is-on-stage', entry.isIntersecting);
}), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
slides.slice(1).forEach(slide => slideObserver.observe(slide));
