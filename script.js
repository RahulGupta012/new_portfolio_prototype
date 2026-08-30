const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

const rail = document.querySelector('.project-rail');
let down = false, startX = 0, startScroll = 0;
rail.addEventListener('pointerdown', e => { down = true; startX = e.pageX; startScroll = rail.parentElement.scrollLeft; rail.classList.add('dragging'); rail.setPointerCapture(e.pointerId); });
rail.addEventListener('pointermove', e => { if (!down) return; e.preventDefault(); rail.parentElement.scrollLeft = startScroll - (e.pageX - startX) * 1.15; });
['pointerup','pointercancel','pointerleave'].forEach(name => rail.addEventListener(name, () => { down = false; rail.classList.remove('dragging'); }));

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.animate([{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}); }), { threshold: .12 });
document.querySelectorAll('.statement h2,.statement-foot,.work-head,.project,.tool-cloud,.contact-title').forEach(el => { el.style.opacity = 0; observer.observe(el); });

const slides = [...document.querySelectorAll('main > section')];
slides.forEach((slide, index) => {
  if (index === 0) return;
  slide.classList.add('slide-scene');
});
const slideObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('is-on-stage', entry.isIntersecting);
}), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
slides.slice(1).forEach(slide => slideObserver.observe(slide));
