const fmt=n=>n==null?"—":new Intl.NumberFormat("pt-PT").format(n);
const dateFmt=v=>new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();
fetch("data/curseforge.json?"+Date.now()).then(r=>{if(!r.ok)throw Error("Dados indisponíveis");return r.json()}).then(d=>{
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set("total-downloads",fmt(d.downloads));set("total-followers",fmt(d.followers));set("total-projects",fmt(d.projects));set("autoloot-downloads",fmt(d.autolootDownloads));
 const updated=d.updatedAt?dateFmt(d.updatedAt):"Sem dados";set("last-update",updated);set("sync-status",updated);set("followers-source",d.followers==null?"INDISPONÍVEL":"PÚBLICO");
 const history=Array.isArray(d.history)?d.history.filter(x=>Number.isFinite(x.downloads)):[];
 set("history-range",history.length+" registo"+(history.length===1?"":"s")+" guardado"+(history.length===1?"":"s"));
 const chart=document.getElementById("downloads-chart");
 if(history.length>1){
  const values=history.map(x=>x.downloads),min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
  const pts=values.map((v,i)=>{const x=32+i*(736/Math.max(1,values.length-1)),y=190-((v-min)/range)*145;return [x,y]});
  const line=pts.map(p=>p.join(",")).join(" "),area="M "+pts[0].join(" ")+" L "+pts.slice(1).map(p=>p.join(" ")).join(" L ")+" L 768 218 L 32 218 Z";
  chart.innerHTML='<svg viewBox="0 0 800 245" role="img" aria-label="Histórico de downloads"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9f2f6" stop-opacity=".32"/><stop offset="1" stop-color="#d9f2f6" stop-opacity="0"/></linearGradient></defs><path d="'+area+'" fill="url(#chartFill)"/><polyline points="'+line+'" fill="none" stroke="#d9f2f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#e9f8fa"/>').join("")+'</svg>';
 }else if(history.length===1){chart.textContent="Primeiro registo: "+fmt(history[0].downloads)+" downloads em "+history[0].date+". O gráfico vai mostrar a evolução quando existirem novas sincronizações."}
 else{chart.textContent="Ainda não existem registos históricos. Aguardar pela primeira sincronização."}
}).catch(()=>{document.querySelectorAll("#total-downloads,#total-followers,#total-projects,#autoloot-downloads,#last-update").forEach(el=>el.textContent="—");const s=document.getElementById("sync-status");if(s)s.textContent="Dados temporariamente indisponíveis";});


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
