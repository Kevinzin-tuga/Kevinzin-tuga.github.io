const tabButtons=[...document.querySelectorAll(".nav-tab")],panels=[...document.querySelectorAll(".tab-panel")];function openTab(name){tabButtons.forEach(b=>{const active=b.dataset.tab===name;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active))});panels.forEach(p=>{const active=p.id==="tab-"+name;p.hidden=!active;p.classList.toggle("active",active)});document.querySelector(".nav-right").classList.remove("open");document.querySelector("#mobile-menu").setAttribute("aria-expanded","false");history.replaceState(null,"","#"+name)}tabButtons.forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.tab)));document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.go)));document.querySelectorAll("[data-tab-link]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();openTab(a.dataset.tabLink)}));const initial=location.hash.slice(1);if(tabButtons.some(b=>b.dataset.tab===initial))openTab(initial);const menu=document.querySelector("#mobile-menu"),nav=document.querySelector(".nav-right");menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});document.querySelector("#ano").textContent=new Date().getFullYear();const filterButtons=[...document.querySelectorAll("[data-filter]")],cards=[...document.querySelectorAll(".project[data-category]")],empty=document.querySelector("#filter-empty");filterButtons.forEach(b=>b.addEventListener("click",()=>{filterButtons.forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});let shown=0;cards.forEach(c=>{const visible=b.dataset.filter==="all"||c.dataset.category===b.dataset.filter;c.hidden=!visible;if(visible)shown++});empty.hidden=shown!==0}));const lang=document.querySelector("#lang");lang.addEventListener("click",()=>{const en=document.documentElement.lang!=="en";document.documentElement.lang=en?"en":"pt-PT";lang.textContent=en?"PT":"ENG";document.querySelectorAll("[data-pt][data-en]").forEach(el=>el.textContent=en?el.dataset.en:el.dataset.pt)});const fmt=n=>n==null?"—":new Intl.NumberFormat("pt-PT").format(n);fetch("data/curseforge.json?"+Date.now()).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{document.querySelector("#cf-followers").textContent=fmt(d.followers);document.querySelector("#cf-downloads").textContent=fmt(d.downloads);document.querySelector("#cf-projects").textContent=fmt(d.projects);const t=d.updatedAt?new Date(d.updatedAt):null;document.querySelector("#cf-updated").textContent=t?"Atualizado "+new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(t):"Dados ainda não disponíveis"}).catch(()=>document.querySelector("#cf-updated").textContent="À espera da primeira sincronização");const titleText="_Kevinzin_tuga_";let titleIndex=1,erasing=false;function animateTitle(){document.title=titleText.slice(0,titleIndex);if(!erasing){if(titleIndex<titleText.length){titleIndex++;setTimeout(animateTitle,240)}else{erasing=true;setTimeout(animateTitle,1100)}}else if(titleIndex>1){titleIndex--;setTimeout(animateTitle,130)}else{erasing=false;setTimeout(animateTitle,550)}}setTimeout(animateTitle,600);
/* Small motion details: reveal cards when their tab becomes visible. */
const revealTargets=[...document.querySelectorAll(".page-heading,.project,.skill-group,.creator-card,.contact-panel,.home-bottom")];
if("IntersectionObserver"in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(el=>{el.classList.add("reveal-ready");revealObserver.observe(el)})}
document.querySelectorAll(".nav-tab,.filter-btn,.btn").forEach(el=>{el.addEventListener("pointerdown",()=>{el.classList.remove("tap-pop");void el.offsetWidth;el.classList.add("tap-pop")})});


/* Aqua pixel cursor trail — disabled on touch devices and reduced-motion setups. */
(function(){
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const fine=window.matchMedia&&window.matchMedia("(pointer: fine)").matches;
 if(reduce||!fine)return;
 const aura=document.createElement("div");aura.className="cursor-aura";document.body.appendChild(aura);
 let last=0;
 window.addEventListener("pointermove",e=>{
  if(e.pointerType!=="mouse")return;
  aura.style.transform="translate3d("+(e.clientX-135)+"px,"+(e.clientY-135)+"px,0)";
  aura.classList.add("is-active");
  const now=performance.now();if(now-last<22)return;last=now;
  for(let i=0;i<2;i++){
   const p=document.createElement("i");p.className="cursor-pixel";
   const size=3+Math.random()*5,dx=(Math.random()-.5)*46,dy=(Math.random()-.5)*46;
   p.style.left=e.clientX+"px";p.style.top=e.clientY+"px";p.style.setProperty("--size",size+"px");p.style.setProperty("--dx",dx+"px");p.style.setProperty("--dy",dy+"px");
   document.body.appendChild(p);p.addEventListener("animationend",()=>p.remove(),{once:true});
  }
 },{passive:true});
 window.addEventListener("pointerleave",()=>aura.classList.remove("is-active"));
})();
