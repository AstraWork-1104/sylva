/* Flora UI - interactive browser prototype. No 3ds Max or file-system integration. */
(() => {
"use strict";
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const repoKey = "flora-ui-design-v1";
const collections = [
  {id:"explorer",label:"Explorer",builtin:true},
  {id:"favorites",label:"★ Favorites",builtin:true},
  {id:"landscape",label:"Landscape",builtin:false}
];
const plants = [
 ["Catharanthus roseus","Catharanthus","Flowerbed Plants",6,"#df83c1",65],
 ["Clerodendrum thomsoniae","Clerodendrum","Shrubs",6,"#ede8d5",145],
 ["Cuphea hyssopifolia","Cuphea","Flowerbed Plants",6,"#ae7cd2",80],
 ["Hydrangea paniculata","Hydrangea","Shrubs",6,"#ede9d6",190],
 ["Rhododendron ponticum","Rhododendron","Shrubs",6,"#e9a7d4",215],
 ["Lavandula angustifolia","Lavandula","Flowerbed Plants",6,"#9e8cca",70],
 ["Acer palmatum","Acer","Deciduous Trees",6,"#d68c77",420],
 ["Betula pendula","Betula","Deciduous Trees",6,"#a2b27c",690],
 ["Juniperus communis","Juniperus","Coniferous Trees",6,"#b7c7a4",235],
 ["Picea abies","Picea","Coniferous Trees",6,"#719b7a",780],
 ["Pennisetum alopecuroides","Pennisetum","Ornamental Grasses",6,"#d7c690",110],
 ["Miscanthus sinensis","Miscanthus","Ornamental Grasses",6,"#cac0a0",160]
];
const models=plants.flatMap(([bot,genus,type,num,color,height],group)=>Array.from({length:num},(_,j)=>({
 id:"MT_PM_V34_"+genus+"_"+String(j+1).padStart(2,"0"),botanical:bot,
 family:genus,type,color,height:height+j*4,volume:34,imageSeed:group*17+j*13,
 width:Math.round(height*.65),season:group<=5?"Summer":"All seasons"
})));
const favoritesStorage=()=>{try{return JSON.parse(localStorage.getItem(repoKey+"-favorites")||"[]")}catch{return []}};
const readCollections=()=>{try{return JSON.parse(localStorage.getItem(repoKey+"-collections")||'["My Garden","Courtyard","Park Ideas"]')}catch{return ["My Garden","Courtyard","Park Ideas"]}};
const state={view:"catalog",catalog:"explorer",folder:34,favFilter:"All Favorites",category:"Flowerbed Plants",expandFav:true,treeOpen:true,grid:true,search:"",sort:"asc",selected:new Set(),lastClicked:-1,favorites:new Set(favoritesStorage()),favCollections:readCollections(),proxy:"Point Cloud",scatter:"spring",scatterSources:new Set([0,1,2]),settings:{useSceneMaterials:true,autoRefresh:true,proxy:"Point Cloud"},workingModal:null};
try{Object.assign(state.settings,JSON.parse(localStorage.getItem(repoKey+"-settings")||"{}"))}catch{}
const clean=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const save=()=>{try{localStorage.setItem(repoKey+"-favorites",JSON.stringify([...state.favorites]));localStorage.setItem(repoKey+"-collections",JSON.stringify(state.favCollections));localStorage.setItem(repoKey+"-settings",JSON.stringify(state.settings))}catch{}};
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4400)}
function iconFolder(){return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7V5h6l2 3h10v12H3z"/></svg>'}
function leafSVG(model) {
 const rnd = n => {const s=Math.sin((n+model.imageSeed)*127.1)*43758.5453;return s-Math.floor(s)};
 const flowerColor=model.color;
 const tree = ["Deciduous Trees","Coniferous Trees"].includes(model.type);
 const grass = model.type==="Ornamental Grasses";
 const stems=Array.from({length:tree?22:grass?36:22},(_,i)=>{
   const x=100+(rnd(i*3)-.5)*(tree?61:80),y=83+(rnd(i*5)-.5)*(tree?88:72);
   return '<path d="M100 164 Q '+(100+(rnd(i*8)-.5)*28)+' 110 '+x.toFixed(1)+' '+y.toFixed(1)+'" stroke="'+(i%2?'#577949':'#3e683c')+'" stroke-width="'+(tree?2.2:1.65)+'" fill="none"/>';
 }).join("");
 const leaves=Array.from({length:tree?68:grass?40:64},(_,i)=>{
  const a=i*2.39996,r=Math.sqrt((i+.5)/(tree?68:grass?40:64));
  const dx=Math.cos(a)*r*(tree?58:grass?62:52),dy=Math.sin(a)*r*(tree?47:grass?62:47);
  const cx=100+dx+(rnd(i*4)-.5)*14,cy=(tree?67:grass?86:83)+dy+(rnd(i*7)-.5)*12;
  const rot=(i*37)%180;
  if(grass)return '<path d="M100 164Q '+(cx+(rnd(i)-.5)*30).toFixed(1)+' 100 '+cx.toFixed(1)+' '+(cy-20).toFixed(1)+'" stroke="'+(i%3?'#87a76a':'#b2ae84')+'" stroke-width="1.8" fill="none"/>';
  return '<ellipse cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" rx="'+(tree?9:7)+'" ry="'+(tree?4:3.8)+'" transform="rotate('+rot+' '+cx.toFixed(1)+' '+cy.toFixed(1)+')" fill="'+(i%4===0?'#87aa6a':i%3===0?'#385b37':'#477d43')+'" opacity=".94"/>';
 }).join("");
 const petals=Array.from({length:tree?19:grass?13:44},(_,i)=>{
  const a=i*2.39996,r=Math.sqrt((i+.6)/(tree?19:grass?13:44));
  const x=100+Math.cos(a)*r*(tree?54:grass?62:42)+(rnd(i*11)-.5)*11;
  const y=(tree?57:grass?82:72)+Math.sin(a)*r*(tree?44:grass?60:43)+(rnd(i*9)-.5)*7;
  const size=grass?2:tree?2.7:3.1+r*1.9;
  if(tree&&model.family==="Picea")return "";
  return '<g><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(size+1).toFixed(1)+'" fill="'+flowerColor+'" opacity=".85"/><circle cx="'+(x+3).toFixed(1)+'" cy="'+(y-1).toFixed(1)+'" r="'+(size*.57).toFixed(1)+'" fill="#fff3e6" opacity=".72"/><circle cx="'+(x-2).toFixed(1)+'" cy="'+(y+1).toFixed(1)+'" r="'+(size*.45).toFixed(1)+'" fill="'+flowerColor+'"/></g>';
 }).join("");
 return '<svg viewBox="0 0 200 186" xmlns="http://www.w3.org/2000/svg" aria-label="'+clean(model.botanical)+' preview illustration"><defs><radialGradient id="ground'+model.imageSeed+'"><stop stop-color="#1b211e"/><stop offset="1" stop-color="#1b211e" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="163" rx="79" ry="12" fill="url(#ground'+model.imageSeed+')"/><g>'+stems+leaves+petals+'</g><g stroke="#536052" stroke-width="1.2" opacity=".55"><path d="M181 18v144M178 48h4M178 91h4M178 134h4"/></g><g font-family="Arial,sans-serif" font-size="8" fill="#657167"><text x="166" y="50">30</text><text x="166" y="94">20</text><text x="166" y="137">10</text></g></svg>';
}
function showCatalogTabs(){const host=$("#catalogTabs");host.innerHTML=collections.map(c=>'<button class="catalog-tab '+(state.catalog===c.id?'active':'')+'" data-catalog="'+clean(c.id)+'">'+clean(c.label)+'</button>').join("");}
function folderList(){
 const host=$("#sidebarContent"),head=$("#sidebarHeading"),foot=$("#sidebarFooter");
 if(state.catalog==="explorer"){
  head.textContent="FOLDERS";foot.textContent="F:/001_Model/Maxtree";
  host.innerHTML=Array.from({length:28},(_,i)=>{const n=20+i;return '<button type="button" class="tree-item '+(state.folder===n?'active':'')+'" data-folder="'+n+'" title="Maxtree - Plant Models Vol '+n+'"><span class="twisty">›</span>'+iconFolder()+'<span class="tree-name">Maxtree - Plant Models Vol '+n+'</span></button>'}).join("");
 }else if(state.catalog==="favorites"){
  head.textContent="FAVORITES";foot.textContent=state.favorites.size+" saved plants";
  host.innerHTML='<button class="tree-item '+(state.favFilter==="All Favorites"?'active':'')+'" data-fav="All Favorites"><span class="twisty">★</span><span class="tree-name">All Favorites</span></button>'+
   state.favCollections.map(f=>'<button class="tree-item child '+(state.favFilter===f?'active':'')+'" data-fav="'+clean(f)+'"><span class="twisty">›</span>'+iconFolder()+'<span class="tree-name">'+clean(f)+'</span></button>').join("")+
   '<button class="sidebar-section-button" id="addFavCollection">+ New Collection</button>';
 }else{
  head.textContent="CATEGORIES";foot.textContent=state.catalog==="landscape"?"Landscape / Local catalog":"Imported catalog";
  const cats=["Deciduous Trees","Coniferous Trees","Shrubs","Flowerbed Plants","Ornamental Grasses"];
  host.innerHTML='<div style="font-size:10px;color:#8ea895;padding:6px 8px">Filter categories</div>'+
  cats.map(t=>'<button class="tree-item category '+(state.category===t?'active':'')+'" data-category="'+clean(t)+'"><span class="twisty">›</span><span class="tree-name">'+clean(t)+'</span></button>').join("")+
  (state.catalog!=="landscape"?'<div style="color:#718b78;font-size:10px;padding:12px 8px">Preview categories shown for this imported catalog.</div>':'');
 }
}
function visibleModels(){
 let arr=models.filter(m=>{
  if(state.catalog==="favorites")return state.favorites.has(m.id);
  if(state.catalog==="explorer")return true;
  return m.type===state.category;
 });
 const q=state.search.trim().toLowerCase();
 if(q)arr=arr.filter(m=>[m.id,m.botanical,m.type,m.family].some(x=>x.toLowerCase().includes(q)));
 arr=[...arr].sort((a,b)=>a.id.localeCompare(b.id));
 if(state.sort==="desc")arr.reverse();
 return arr;
}
function properties(){
 const selectedModel=models.find(m=>state.selected.has(m.id));
 const container=$("#propertyRows");
 if(!selectedModel){container.innerHTML='<p class="empty-property">Select a model to inspect its properties.</p>';return;}
 const rows=[["File",selectedModel.id],["Botanical",selectedModel.botanical],["Category",selectedModel.type],["Height",selectedModel.height+" cm"],["Width",selectedModel.width+" cm"],["Season",selectedModel.season],["Renderer","Corona 14"],["Proxy",state.proxy]];
 container.innerHTML=rows.map(([k,v])=>'<div class="property-row"><span>'+clean(k)+'</span><span>'+clean(v)+'</span></div>').join("");
}
function renderModels(){
 const arr=visibleModels(),host=$("#modelGrid");
 host.classList.toggle("list-view",!state.grid);
 host.innerHTML=arr.length?arr.map((m,i)=>{
 const fav=state.favorites.has(m.id),selected=state.selected.has(m.id);
 return '<article class="model-card '+(selected?'selected':'')+'" role="listitem" draggable="true" tabindex="0" data-model="'+clean(m.id)+'" data-index="'+i+'" title="'+clean(m.botanical)+'"><div class="plant-image">'+leafSVG(m)+'</div><div class="card-caption"><span class="card-name">'+clean(m.id)+'</span><button type="button" class="star-button '+(fav?'active':'')+'" data-favorite="'+clean(m.id)+'" aria-label="Toggle favorite" title="Favorite">'+(fav?'★':'☆')+'</button></div><span class="card-botanical">'+clean(m.botanical)+'</span><span class="card-height">H '+m.height+' cm</span></article>';
 }).join(""):'<div class="empty-state">No plants match the current filter.<br>Try another category or search.</div>';
 let title,path;
 if(state.catalog==="explorer"){title="Maxtree - Plant Models Vol "+state.folder;path="F:\\001_Model\\Maxtree\\Maxtree - Plant Models Vol "+state.folder;}
 else if(state.catalog==="favorites"){title=state.favFilter;path="Favorites / Saved plants";}
 else{const meta=collections.find(c=>c.id===state.catalog);title=state.category;path=(meta?.label||"Catalog")+" / "+state.category;}
 $("#collectionTitle").textContent=title;$("#collectionPath").textContent=path;$("#contentTag").hidden=["explorer","favorites"].includes(state.catalog);
 $("#modelCount").textContent=(state.catalog==="explorer"?72:arr.length)+" models";
 $("#selectionCount").textContent=state.selected.size+" selected";
 properties();
}
function render(){showCatalogTabs();folderList();renderModels()}
function selectModel(id,index,shift,ctrl){
 const ids=visibleModels().map(m=>m.id);
 if(shift && state.lastClicked>=0){if(!ctrl)state.selected.clear();const a=Math.min(state.lastClicked,index),b=Math.max(state.lastClicked,index);for(let i=a;i<=b;i++)state.selected.add(ids[i]);}
 else if(ctrl){if(state.selected.has(id))state.selected.delete(id);else state.selected.add(id);state.lastClicked=index;}
 else{state.selected.clear();state.selected.add(id);state.lastClicked=index;}
 renderModels();
}
$("#catalogTabs").addEventListener("click",e=>{const b=e.target.closest("[data-catalog]");if(!b)return;state.catalog=b.dataset.catalog;state.selected.clear();state.search="";$("#modelSearch").value="";render()});
$("#sidebarContent").addEventListener("click",e=>{
 if(e.target.closest("[data-folder]")){state.folder=Number(e.target.closest("[data-folder]").dataset.folder);state.selected.clear();render();}
 if(e.target.closest("[data-fav]")){state.favFilter=e.target.closest("[data-fav]").dataset.fav;render();}
 if(e.target.closest("[data-category]")){state.category=e.target.closest("[data-category]").dataset.category;state.selected.clear();render();}
 if(e.target.closest("#addFavCollection"))showModal("newCollection");
});
$("#modelGrid").addEventListener("click",e=>{
 const fav=e.target.closest("[data-favorite]");
 if(fav){const id=fav.dataset.favorite;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);save();render();return;}
 const card=e.target.closest(".model-card");
 if(card)selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey);
});
$("#modelGrid").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest(".model-card")){const card=e.target.closest(".model-card");selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey)}});
$("#modelGrid").addEventListener("dragstart",e=>{const card=e.target.closest("[data-model]");if(!card)return;const id=card.dataset.model;e.dataTransfer.setData("text/plain",id);e.dataTransfer.effectAllowed="copy";toast("Drag & Drop is a design preview. Actual placement works inside 3ds Max.")});
$("#modelSearch").addEventListener("input",e=>{state.search=e.target.value;state.selected.clear();renderModels()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderModels()});
$("#gridButton").addEventListener("click",()=>{state.grid=true;$("#gridButton").classList.add("active");$("#listButton").classList.remove("active");renderModels()});
$("#listButton").addEventListener("click",()=>{state.grid=false;$("#listButton").classList.add("active");$("#gridButton").classList.remove("active");renderModels()});
$("#proxyControls").addEventListener("click",e=>{const b=e.target.closest("[data-proxy]");if(!b)return;state.proxy=b.dataset.proxy;state.settings.proxy=state.proxy;save();$$("[data-proxy]").forEach(x=>x.classList.toggle("active",x===b));properties();toast("Proxy view: "+state.proxy+" (prototype setting)")});
$$("[data-workspace]").forEach(b=>b.addEventListener("click",()=>{state.view=b.dataset.workspace;$$("[data-workspace]").forEach(x=>x.classList.toggle("active",x===b));$("#catalogWorkspace").hidden=state.view!=="catalog";$("#scatterWorkspace").hidden=state.view!=="scatter";if(state.view==="scatter")renderScatter()}));
$("#refreshButton").addEventListener("click",()=>{render();toast("Catalog preview refreshed. Local 3ds Max files are not scanned in the browser.")});
$("#settingsButton").addEventListener("click",()=>showModal("settings"));
$("#libraryButton").addEventListener("click",()=>showModal("library"));
$("#addCatalogButton").addEventListener("click",()=>showModal("catalog"));
const modal=$("#modalBackdrop");
function hideModal(){modal.hidden=true;state.workingModal=null}
$("#closeModal").addEventListener("click",hideModal);
$("#modalCancel").addEventListener("click",hideModal);
modal.addEventListener("click",e=>{if(e.target===modal)hideModal()});
window.addEventListener("keydown",e=>{if(e.key==="Escape")hideModal()});
function showModal(kind){
 state.workingModal=kind;modal.hidden=false;
 const body=$("#modalBody"),title=$("#modalTitle"),confirm=$("#modalConfirm");
 if(kind==="settings"){
  title.textContent="Flora Settings";confirm.textContent="Save Settings";
  body.innerHTML='<div class="modal-body-section"><h3>Material Import</h3><label><input id="sceneMaterials" type="checkbox" '+(state.settings.useSceneMaterials?'checked':'')+'> <b>Use Scene Materials</b></label><p>Enabled: native 3ds Max <code>#useSceneMtlDups</code>. Disabled: <code>#renameMtlDups</code>. This control is part of the planned material import policy.</p></div><div class="modal-body-section"><h3>Catalog</h3><label><input id="autoRefresh" type="checkbox" '+(state.settings.autoRefresh?'checked':'')+'> Refresh library when opened</label><p>Explorer reads local folders in 3ds Max. This browser prototype uses sample model data.</p></div><small class="modal-meta">3ds Max 2026 · Corona Renderer 14 · UI prototype</small>';
 }else if(kind==="library"){
  title.textContent="Library";confirm.textContent="Save";
  body.innerHTML='<div class="modal-body-section"><h3>Library Root</h3><input id="libraryPathInput" value="F:/001_Model/Maxtree" aria-label="Local library root"><p>Select the source library in the installed Flora plugin. The browser mockup does not access folders on your computer.</p></div>';
 }else if(kind==="catalog"){
  title.textContent="Add Catalog";confirm.textContent="Add to Preview";
  body.innerHTML='<div class="modal-body-section"><h3>Import .floracat</h3><input type="file" accept=".floracat" id="catalogFile"><p>Installed catalogs are external portable SQLite .floracat files. This prototype can add a visual catalog tab, but cannot parse or install a real catalog.</p></div>';
 }else if(kind==="newCollection"){
  title.textContent="New Favorites Collection";confirm.textContent="Create Collection";
  body.innerHTML='<div class="modal-body-section"><h3>Collection Name</h3><input id="collectionNameInput" placeholder="e.g. Riverside Garden" maxlength="55"></div>';
 }
}
$("#modalConfirm").addEventListener("click",()=>{
 const kind=state.workingModal;
 if(kind==="settings"){state.settings.useSceneMaterials=$("#sceneMaterials").checked;state.settings.autoRefresh=$("#autoRefresh").checked;save();toast("Design settings saved locally.");}
 if(kind==="library"){toast("Library root saved for preview. Actual folder access requires 3ds Max.")}
 if(kind==="catalog"){
  const file=$("#catalogFile").files[0];if(!file){toast("Choose a .floracat file first.");return}
  const id="cat-"+Date.now();collections.push({id,label:file.name.replace(/\.floracat$/i,""),builtin:false});state.catalog=id;state.category="Shrubs";state.selected.clear();render();toast("Added a preview tab. Catalog database was not imported.");
 }
 if(kind==="newCollection"){const v=$("#collectionNameInput").value.trim();if(!v)return;state.favCollections.push(v);save();state.favFilter=v;render();toast("Collection created. Drag model assignment is planned for Flora.");}
 hideModal();
});
function scatterSourceList(){
 $("#scatterPlants").innerHTML=plants.slice(0,8).map(([bot,genus,type,,color],i)=>'<label class="source-item"><input type="checkbox" data-scatterplant="'+i+'" '+(state.scatterSources.has(i)?'checked':'')+'><span class="source-swatch" style="color:'+color+'">✿</span><span><strong>'+clean(genus)+'</strong><small>'+clean(bot)+'</small></span></label>').join("");
}
$("#scatterPlants").addEventListener("change",e=>{if(e.target.matches("[data-scatterplant]")){const n=Number(e.target.dataset.scatterplant);if(e.target.checked)state.scatterSources.add(n);else state.scatterSources.delete(n);renderScatterMap()}});
const scatterInfo={
 spring:{subtitle:"Quick Placement",desc:"Create a local planting composition from editable Corona Proxy instances.",note:"One-time instances. Apply ends procedural editing."},
 grove:{subtitle:"Editable Distribution",desc:"Edit a controlled planting layout using a scene Helper and manual Update.",note:"Managed instance distribution. Preserve manually edited plants when updating."},
 biome:{subtitle:"Large-Scale Distribution",desc:"Plan forests and large landscapes using the native Chaos Scatter engine.",note:"Chaos Scatter controls depend on its actual API; this is only a concept."}
};
$$("[data-scatter]").forEach(b=>b.addEventListener("click",()=>{state.scatter=b.dataset.scatter;renderScatter()}));
function renderScatter(){
 const info=scatterInfo[state.scatter];$$("[data-scatter]").forEach(b=>b.classList.toggle("active",b.dataset.scatter===state.scatter));
 $("#scatterModeName").textContent=state.scatter.toUpperCase();
 $("#scatterHeading").innerHTML=clean(state.scatter[0].toUpperCase()+state.scatter.slice(1))+" <span>"+clean(info.subtitle)+"</span>";
 $("#scatterDescription").textContent=info.desc;
 $("#scatterHelper").textContent=info.note;
 $("#scatterFootNote").textContent=state.scatter[0].toUpperCase()+state.scatter.slice(1)+" · "+info.subtitle;
 $("#scatterApply").textContent=state.scatter==="grove"?"Update":state.scatter==="biome"?"Create Scatter":"Apply";
 renderScatterMap();
}
function renderScatterMap(){
 const mode=$("#distributionSelect").value,amount=Number($("#densityRange").value),seed=Number($("#seedInput").value)||42;
 $("#densityNumber").textContent=amount;
 $("#distributionInfo").textContent=(mode.startsWith("Cluster")?"Cluster":"Random")+" · "+amount+" plants/m²";
 let points='';
 const n=Math.min(225,Math.round(amount*11)),source=[...state.scatterSources];
 for(let i=0;i<n;i++){
  const rand=k=>{let n=Math.sin((i*17+seed+k*31)*47.777)*7531.22;return n-Math.floor(n)};
  let x=24+rand(1)*352,y=22+rand(2)*306;
  if(mode.startsWith("Cluster")){const cluster=i%5,cx=[95,265,160,315,205][cluster],cy=[80,115,220,255,165][cluster];x=Math.max(18,Math.min(384,cx+(rand(3)-.5)*120));y=Math.max(18,Math.min(334,cy+(rand(4)-.5)*90))}
  const palette=source.length?plants[source[i%source.length]][4]:"#9fc59a";
  points+='<g transform="translate('+x.toFixed(2)+' '+y.toFixed(2)+')"><circle r="'+(4+rand(5)*4).toFixed(1)+'" fill="#243a29" stroke="#719d63" stroke-width=".9"/><circle r="'+(1.5+rand(6)*2).toFixed(1)+'" fill="'+palette+'"/></g>';
 }
 $("#scatterMap").innerHTML='<rect x="9" y="9" width="382" height="332" rx="14" fill="#1c3223" stroke="#36583e"/><path d="M40 55 C110 10 190 38 240 60 S350 66 370 120 M30 205 C100 180 132 285 215 295 S338 240 380 275" stroke="#3f6045" stroke-width="2" fill="none"/><path d="M60 330 Q130 190 180 85 T365 12" fill="none" stroke="#3c573d" stroke-width="7" opacity=".35"/>'+points;
}
$("#densityRange").addEventListener("input",renderScatterMap);
$("#seedInput").addEventListener("input",renderScatterMap);
$("#distributionSelect").addEventListener("change",renderScatterMap);
$("#selectSurface").addEventListener("click",()=>toast("Surface picker is a design concept. Pick geometry in 3ds Max."));
$("#addScatterPlants").addEventListener("click",()=>toast("Choose source plants from the list above. Full library picker is planned."));
["scatterGenerate","scatterApply","scatterDelete"].forEach(id=>$("#"+id).addEventListener("click",()=>{renderScatterMap();toast("Scatter / "+state.scatter+": concept preview only. No objects created in 3ds Max.")}));
state.proxy=state.settings.proxy||"Point Cloud";
$$("[data-proxy]").forEach(x=>x.classList.toggle("active",x.dataset.proxy===state.proxy));
render();scatterSourceList();renderScatter();
})();