(function(){
var form=document.getElementById('af');if(!form)return;form.classList.add('js');
var steps=[].slice.call(form.querySelectorAll('.step')),dots=[].slice.call(document.querySelectorAll('.stepper li')),cur=1,max=1;
function show(n){cur=n;max=Math.max(max,n);steps.forEach(function(s){s.classList.toggle('on',+s.dataset.step===n)});
 dots.forEach(function(d){var i=+d.dataset.s;d.classList.toggle('on',i===n);d.classList.toggle('ok',i<n||(i<=max&&i!==n));d.querySelector('span').textContent=(i<n)?'✓':i});
 if(n===5)summary();var w=document.getElementById('wiz');var y=w.getBoundingClientRect().top+scrollY-90;if(scrollY>y)scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
dots.forEach(function(d){d.addEventListener('click',function(){var i=+d.dataset.s;if(i<=max&&i!==cur&&valid(Math.min(i,cur)-0===i?0:cur))show(i)})});
// calendar
var today=new Date();today.setHours(0,0,0,0);var view=new Date(today.getFullYear(),today.getMonth(),1),sel=null,slot=null;
var M=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
var HOL=['01-01','05-01','10-03','10-31','12-24','12-25','12-26','12-31','2026-11-18'];function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function avail(d){var lim=new Date(today);lim.setDate(lim.getDate()+60);var k=iso(d);return d>today&&d<=lim&&d.getDay()!==0&&HOL.indexOf(k.slice(5))<0&&HOL.indexOf(k)<0}
function slotsFor(d){return d.getDay()===6?['09:00 – 09:30','11:00 – 11:30']:(d.getDate()%2?['08:00 – 08:30','12:30 – 13:00','16:00 – 16:30']:['10:00 – 10:30','16:00 – 16:30','17:00 – 17:30'])}
function render(){document.getElementById('calm').textContent=M[view.getMonth()]+' '+view.getFullYear();
 var g=document.getElementById('cald');g.innerHTML='';var first=(view.getDay()+6)%7,days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
 for(var i=0;i<first;i++)g.appendChild(document.createElement('span'));
 for(var d=1;d<=days;d++){var dt=new Date(view.getFullYear(),view.getMonth(),d),b=document.createElement('button');b.type='button';b.textContent=d;
  if(avail(dt)){b.className='av';b.setAttribute('aria-label',dt.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'})+' – Termine verfügbar')}else b.disabled=true;
  if(sel&&+dt===+sel)b.classList.add('sel');
  (function(dt){b.addEventListener('click',function(){sel=dt;slot=null;render();renderSlots()})})(dt);g.appendChild(b)}
 document.getElementById('calp').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);}
function renderSlots(){var s=document.getElementById('slots');s.innerHTML='';if(!sel)return;var l=slotsFor(sel);
 document.getElementById('seld').innerHTML=sel.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'<br><small style="font-weight:400;color:#4b5a52;font-family:Roboto,sans-serif">'+l.length+' verfügbare Termine (Beispiel)</small>';
 l.forEach(function(t){var lb=document.createElement('label');lb.innerHTML='<input type="radio" name="slot" value="'+t+'"> '+t;lb.querySelector('input').addEventListener('change',function(){slot=t;document.getElementById('e1').hidden=true});s.appendChild(lb)})}
document.getElementById('calp').addEventListener('click',function(){view.setMonth(view.getMonth()-1);render()});
document.getElementById('caln').addEventListener('click',function(){view.setMonth(view.getMonth()+1);render()});
render();
// validation
function chk(id,re){var el=document.getElementById(id),ok=el.value.trim()&&(!re||re.test(el.value.trim()));el.closest('.fld').classList.toggle('bad',!ok);return !!ok}
function valid(n){var ok=true;
 if(n===1)ok=!!(sel&&slot);
 if(n===2)ok=[chk('name'),chk('email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/),chk('telefon',/[0-9 +\/()-]{6,}/)].every(Boolean);
 if(n===3)ok=[chk('adresse'),chk('plz',/^\d{5}$/),chk('ort'),chk('objekttyp'),chk('leistung')].every(Boolean);
 if(n===5)ok=document.getElementById('ds').checked;
 var e=document.getElementById('e'+n);if(e)e.hidden=ok;return ok}
form.querySelectorAll('.next').forEach(function(b){b.addEventListener('click',function(){if(valid(cur))show(cur+1)})});
form.querySelectorAll('.back').forEach(function(b){b.addEventListener('click',function(){show(cur-1)})});
// photos (local preview only)
var fi=document.getElementById('fotos'),th=document.getElementById('thumbs');
fi.addEventListener('change',function(){th.innerHTML='';[].slice.call(fi.files,0,12).forEach(function(f){var i=document.createElement('img');i.alt=f.name;i.src=URL.createObjectURL(f);th.appendChild(i)})});
function v(id){var e=document.getElementById(id);return e&&e.value?e.value:'–'}
function summary(){var lt=document.getElementById('leistung');var rows=[['Termin',sel?sel.toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'long'})+', '+slot+' Uhr':'–'],['Leistung',lt.options[lt.selectedIndex].text],['Name',v('name')],['E-Mail',v('email')],['Telefon',v('telefon')],['Objekt',v('adresse')+', '+v('plz')+' '+v('ort')],['Objekttyp',v('objekttyp')],['Umfang',v('umfang')],['Fotos',fi.files.length+' ausgewählt']];
 document.getElementById('sum').innerHTML=rows.map(function(r){return '<dt>'+r[0]+'</dt><dd></dd>'}).join('');
 var dd=document.querySelectorAll('#sum dd');rows.forEach(function(r,i){dd[i].textContent=r[1]})}
form.addEventListener('submit',function(e){e.preventDefault();if(!valid(5))return;steps.forEach(function(s){s.classList.remove('on')});var dn=document.getElementById('done');dn.hidden=false;dn.scrollIntoView({block:'center'});dots.forEach(function(d){d.classList.remove('on');d.classList.add('ok');d.querySelector('span').textContent='✓'})});
// prefill
var q=new URLSearchParams(location.search),L=document.getElementById('leistung');
if(q.get('leistung')){L.value=q.get('leistung')}
try{var d=JSON.parse(sessionStorage.getItem('rx_kurz')||'null');if(d&&q.get('von')){
 if(d.tel)document.getElementById('telefon').value=d.tel;if(d.plz)document.getElementById('plz').value=d.plz;
 if(d.objekt)document.getElementById('objekttyp').value=d.objekt;
 var u=[d.umfang,d.etage,d.aufzug?'Aufzug: '+d.aufzug:''].filter(Boolean).join(', ');if(u)document.getElementById('umfang').value=u;
 if(d.info)document.getElementById('worum').value=d.info;
 if(d.leistung){[].slice.call(L.options).forEach(function(o){if(o.text===d.leistung)L.value=o.value})}
 document.getElementById('prefill').hidden=false;}}catch(_){}
show(1);
})();
