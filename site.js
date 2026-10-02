(function(){
var f=document.getElementById('qform');
if(f){
 var up=f.querySelector('.up input'),ub=f.querySelector('.up b');
 if(up)up.addEventListener('change',function(){ub.textContent=up.files.length?up.files.length+' Foto(s) ausgewählt':'Fotos hochladen'});
 f.addEventListener('submit',function(e){e.preventDefault();var d={};
  ['objekt','umfang','etage','aufzug','plz','tel','info'].forEach(function(k){var el=f.elements[k];if(el&&el.value)d[k]=el.value});
  if(f.dataset.leistung)d.leistung=f.dataset.leistung;d.fotos=up&&up.files?up.files.length:0;
  try{sessionStorage.setItem('rx_kurz',JSON.stringify(d))}catch(_){}
  location.href='/kostenlose-anfrage?von=kurzformular';});
}
document.querySelectorAll('.mpanel a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.open=false})});
})();
