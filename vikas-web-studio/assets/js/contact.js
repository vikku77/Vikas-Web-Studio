document.addEventListener('DOMContentLoaded',()=>{
 const form=document.querySelector('#enquiry-form'); if(!form)return;
 const msg=document.querySelector('#form-message');
 form.addEventListener('submit',async e=>{
  e.preventDefault(); msg.textContent='Sending your enquiry…'; msg.style.color='#77746f';
  const fd=new FormData(form), email=String(fd.get('email')||'').trim(), mobile=String(fd.get('mobile')||'').replace(/[\s()-]/g,'');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){msg.textContent='Please enter a valid email address.';return;}
  const digits=mobile.replace(/^\+91/,'');
  if(!/^[6-9]\d{9}$/.test(digits)){msg.textContent='Enter a valid 10-digit Indian mobile number (optionally with +91).';return;}
  const payload={name:fd.get('name'),email,mobile:digits,service:fd.get('service'),budget:fd.get('budget'),description:fd.get('description')||'',source:'Vikas Web Studio website'};
  const cfg=window.VWS_CONFIG||{};
  const tasks=[];
  if(cfg.formspreeEndpoint){
   const emailData=new FormData();
   Object.entries(payload).forEach(([k,v])=>emailData.append(k,v));
   emailData.append('_subject','New website enquiry — Vikas Web Studio');
   emailData.append('_replyto',email);
   tasks.push(fetch(cfg.formspreeEndpoint,{method:'POST',body:emailData,headers:{Accept:'application/json'}}).then(async r=>{if(!r.ok)throw new Error('Email notification failed');return 'email';}));
  }
  if(window.vwsSupabase){
   tasks.push(window.vwsSupabase.from('enquiries').insert([payload]).then(({error})=>{if(error)throw error;return 'database';}));
  }
  const results=await Promise.allSettled(tasks);
  const success=results.filter(x=>x.status==='fulfilled').map(x=>x.value);
  const failures=results.filter(x=>x.status==='rejected');
  if(success.length===2){msg.textContent='Thank you! Your enquiry was sent and saved successfully.';msg.style.color='#16804a';form.reset();}
  else if(success.length===1){msg.textContent='Your enquiry reached one service, but the other service needs configuration. Please also contact us on WhatsApp.';msg.style.color='#a45a16';}
  else{msg.textContent='Sorry, the enquiry could not be confirmed. Please contact us on WhatsApp.';msg.style.color='#b33';}
 });
});
