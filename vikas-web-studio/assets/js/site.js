(function(){
 const cfg=window.VWS_CONFIG||{};
 const header=document.querySelector('[data-header]');
 if(header){
  const path=location.pathname.split('/').pop()||'index.html';
  header.innerHTML=`<div class="topbar"><div class="container"><span>Independent creative web studio</span><span>Available for selected projects · India</span></div></div><div class="container nav"><a class="brand" href="index.html"><span class="brand-mark">VS</span><span>Vikas Web Studio<small>Turning Ideas Into Digital Reality.</small></span></a><button class="menu-toggle" aria-label="Open menu">☰</button><nav class="nav-links"><a href="index.html">Home</a><a href="about.html">About</a><a href="services.html">Services</a><a href="portfolio.html">Portfolio</a><a href="contact.html">Contact</a></nav><a class="btn" href="contact.html">Start a project ↗</a></div>`;
  const toggle=header.querySelector('.menu-toggle'),nav=header.querySelector('.nav-links');
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
 }
 const footer=document.querySelector('[data-footer]');
 if(footer)footer.innerHTML=`<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="index.html"><span class="brand-mark">VS</span><span>Vikas Web Studio<small>Turning Ideas Into Digital Reality.</small></span></a><p style="max-width:330px;margin-top:20px">A creative web development studio focused on modern, responsive and professional websites that help businesses grow online.</p></div><div><h4>Explore</h4><div class="footer-links"><a href="about.html">About studio</a><a href="services.html">Services</a><a href="portfolio.html">Portfolio</a><a href="contact.html">Contact</a></div></div><div><h4>Get in touch</h4><div class="footer-links"><a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a><a href="https://wa.me/${cfg.whatsappNumber}" target="_blank" rel="noopener">WhatsApp · +91 79050 17138</a></div></div></div><div class="copyright"><span>© ${new Date().getFullYear()} Vikas Web Studio. All rights reserved.</span><span>Designed with clarity and purpose.</span></div><a class="admin-footer-link" href="/admin/" aria-label="Admin login">Admin Login</a></div></footer>`;
 document.querySelectorAll('[data-whatsapp]').forEach(a=>a.href=`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent("Hello Vikas Web Studio, I would like to discuss a website project.")}`);
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
})();
