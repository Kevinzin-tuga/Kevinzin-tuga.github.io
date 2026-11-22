const number=n=>n==null?"—":new Intl.NumberFormat("pt-PT").format(n);
document.querySelector("#year").textContent=new Date().getFullYear();
fetch("data/curseforge.json?"+Date.now()).then(r=>{if(!r.ok)throw Error("No data");return r.json()}).then(d=>{
 document.querySelector("#total-downloads").textContent=number(d.downloads);
 document.querySelector("#total-followers").textContent=number(d.followers);
 document.querySelector("#total-projects").textContent=number(d.projects);
 document.querySelector("#autoloot-downloads").textContent=number(d.autolootDownloads);
 const t=d.updatedAt?new Date(d.updatedAt):null;
 document.querySelector("#last-update").textContent=t?new Intl.DateTimeFormat("pt-PT",{day:"2-digit",month:"short"}).format(t):"—";
 document.querySelector("#sync-status").textContent=t?"Última sincronização: "+new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(t):"Sem sincronização";
 const history=Array.isArray(d.history)?d.history:[];
 if(history.length>1){
  const values=history.map(x=>x.downloads).filter(Number.isFinite),min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
  const points=values.map((v,i)=>{const x=20+i*(760/Math.max(1,values.length-1)),y=175-((v-min)/range)*145;return x+","+y}).join(" ");
  document.querySelector("#downloads-chart").innerHTML='<svg viewBox="0 0 800 210" role="img" aria-label="Histórico de downloads"><defs><linearGradient id="pinkfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#03fcd7" stop-opacity=".32"/><stop offset="1" stop-color="#03fcd7" stop-opacity="0"/></linearGradient></defs><path d="M '+points+' L 780 190 L 20 190 Z" fill="url(#aquafill)"/><polyline points="'+points+'" fill="none" stroke="#03fcd7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.querySelector("#history-range").textContent=history.length+" registos guardados";
 }
}).catch(()=>{document.querySelector("#sync-status").textContent="À espera da primeira sincronização automática";});
