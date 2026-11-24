const fmt=n=>n==null?"—":new Intl.NumberFormat("pt-PT").format(n);
const dateFmt=v=>new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();
function renderDownloadsChart(history){
 const chart=document.getElementById("downloads-chart");
 const caption=document.getElementById("chart-caption");
 if(!chart)return;
 const rows=history.filter(x=>Number.isFinite(Number(x.downloads))&&x.date).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 if(!rows.length){chart.innerHTML='<div class="chart-empty"><span class="chart-empty-icon">↗</span><strong>O histórico está a começar</strong><small>Quando forem guardadas sincronizações, a evolução aparecerá aqui.</small></div>';if(caption)caption.textContent="Ainda não existem dados históricos suficientes para desenhar a evolução.";return;}
 if(rows.length===1){chart.innerHTML='<div class="chart-single"><span class="chart-single-label">PRIMEIRO REGISTO</span><strong>'+fmt(rows[0].downloads)+'</strong><span>downloads · '+esc(rows[0].date)+'</span><small>O gráfico ganha uma linha de evolução assim que existir uma segunda sincronização.</small></div>';if(caption)caption.textContent="Este é o primeiro ponto guardado. Os próximos registos vão construir a linha de evolução.";return;}
 const values=rows.map(x=>Number(x.downloads));
 const min=Math.min(...values),max=Math.max(...values),spread=max-min;
 const pad=Math.max(2,spread*.22,Math.abs(max)*.015);
 const lo=Math.max(0,min-pad),hi=max+pad,range=Math.max(1,hi-lo);
 const W=920,H=330,L=76,R=28,T=30,B=66,plotW=W-L-R,plotH=H-T-B;
 const x=i=>L+(i/(rows.length-1))*plotW;
 const y=v=>T+((hi-v)/range)*plotH;
 const pts=rows.map((r,i)=>({x:x(i),y:y(Number(r.downloads)),r}));
 const path=pts.map((p,i)=>(i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)).join(" ");
 const area=path+" L "+pts[pts.length-1].x+" "+(T+plotH)+" L "+pts[0].x+" "+(T+plotH)+" Z";
 const ticks=4;
 let grid="";
 for(let i=0;i<=ticks;i++){const val=hi-(range/ticks)*i,yy=T+(plotH/ticks)*i;grid+='<line class="chart-grid-line" x1="'+L+'" y1="'+yy+'" x2="'+(W-R)+'" y2="'+yy+'"/><text class="chart-axis-label" x="'+(L-13)+'" y="'+(yy+4)+'" text-anchor="end">'+esc(fmt(Math.round(val)))+'</text>';}
 const labelIdx=[...new Set([0,Math.floor((rows.length-1)/2),rows.length-1])];
 let dates=labelIdx.map(i=>'<text class="chart-date-label" x="'+pts[i].x+'" y="'+(H-25)+'" text-anchor="'+(i===0?"start":i===rows.length-1?"end":"middle")+'">'+esc(rows[i].date)+'</text>').join("");
 const dots=pts.map((p,i)=>'<g class="chart-point-group"><circle class="chart-point-halo" cx="'+p.x+'" cy="'+p.y+'" r="'+(i===pts.length-1?10:7)+'"/><circle class="chart-point-core" cx="'+p.x+'" cy="'+p.y+'" r="'+(i===pts.length-1?4.5:3.5)+'"/><title>'+esc(p.r.date)+' · '+fmt(p.r.downloads)+' downloads</title></g>').join("");
 const first=values[0],last=values[values.length-1],delta=last-first,pct=first?delta/first*100:null;
 const trend=delta>0?"↑ "+fmt(delta)+" downloads":delta<0?"↓ "+fmt(Math.abs(delta))+" downloads":"Sem variação";
 const trendText=delta>0?"crescimento":delta<0?"descida":"sem alteração";
 chart.innerHTML='<div class="chart-headline"><div><span class="chart-eyebrow">TOTAL DE DOWNLOADS</span><strong>'+fmt(last)+'</strong></div><span class="chart-trend '+(delta>0?"positive":delta<0?"negative":"neutral")+'">'+trend+'</span></div><svg class="downloads-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Gráfico de evolução de downloads, de '+fmt(first)+' para '+fmt(last)+'">'+grid+'<defs><linearGradient id="downloadsArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f2f2f2" stop-opacity=".22"/><stop offset="100%" stop-color="#f2f2f2" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="'+area+'"/><path class="chart-line-shadow" d="'+path+'"/><path class="chart-line" d="'+path+'"/>'+dots+dates+'</svg><div class="chart-legend"><span><i></i> Downloads acumulados</span><span>'+rows.length+' registos guardados</span></div>';
 if(caption)caption.textContent=trend+" ("+(pct===null?"—":(pct>0?"+":"")+pct.toLocaleString("pt-PT",{maximumFractionDigits:1})+"%")+") entre "+rows[0].date+" e "+rows[rows.length-1].date+". Variação observada: "+trendText+".";
}
fetch("data/curseforge.json?"+Date.now()).then(r=>{if(!r.ok)throw Error("Dados indisponíveis");return r.json()}).then(d=>{
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set("total-downloads",fmt(d.downloads));set("total-followers",fmt(d.followers));set("total-projects",fmt(d.projects));set("autoloot-downloads",fmt(d.autolootDownloads));
 const updated=d.updatedAt?dateFmt(d.updatedAt):"Sem dados";set("last-update",updated);set("sync-status",updated);set("followers-source",d.followers==null?"INDISPONÍVEL":"PÚBLICO");
 const history=Array.isArray(d.history)?d.history.filter(x=>Number.isFinite(Number(x.downloads))):[];
 set("history-range",history.length+" registo"+(history.length===1?"":"s")+" guardado"+(history.length===1?"":"s"));
 renderDownloadsChart(history);
}).catch(()=>{
 document.querySelectorAll("#total-downloads,#total-followers,#total-projects,#autoloot-downloads,#last-update").forEach(el=>el.textContent="—");
 const s=document.getElementById("sync-status");if(s)s.textContent="Dados temporariamente indisponíveis";
 const c=document.getElementById("downloads-chart");if(c)c.innerHTML='<div class="chart-empty"><strong>Não foi possível carregar os dados</strong><small>Tenta atualizar a página dentro de momentos.</small></div>';
});