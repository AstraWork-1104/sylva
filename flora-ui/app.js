/* Flora UI - interactive browser prototype. No 3ds Max or file-system integration. */
(() => {
"use strict";
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const repoKey = "flora-ui-design-v1";
const collections = [
  {id:"explorer",label:"Explorer",builtin:true},
  {id:"favorites",label:"★ Favorites",builtin:true},
  {id:"basket",label:"Basket",builtin:true},
  {id:"landscape",label:"Landscape",builtin:false},
  {id:"city",label:"City",builtin:false},
  {id:"forest",label:"Forest",builtin:false}
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
const readBasket=()=>{try{
 const saved=JSON.parse(localStorage.getItem(repoKey+"-basket")||"[]");
 return new Map(Array.isArray(saved)?saved.filter(x=>x&&typeof x.id==="string"&&models.some(m=>m.id===x.id)).map(x=>[x.id,x.checked!==false]):[]);
}catch{return new Map()}};
const readDataFiles=()=>{try{const a=JSON.parse(localStorage.getItem(repoKey+"-explorer-info")||"[]");return Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,40):[]}catch{return []}};
const readTileSize=()=>{try{return Math.max(136,Math.min(250,Number(localStorage.getItem(repoKey+"-basket-size"))||176))}catch{return 176}};
const state={catalog:"explorer",folder:34,favFilter:"All Favorites",category:"Flowerbed Plants",expandFav:true,treeOpen:true,grid:true,search:"",sort:"asc",selected:new Set(),lastClicked:-1,favorites:new Set(favoritesStorage()),favCollections:readCollections(),basket:readBasket(),basketTileSize:readTileSize(),explorerDataFiles:readDataFiles(),proxy:"Point Cloud",settings:{useSceneMaterials:true,autoRefresh:true,proxy:"Point Cloud"},workingModal:null};

/* Concept design v2: data is illustrative, not a definitive thematic catalog file schema. */
const themes={
 city:{name:"City",sections:[
  {name:"Courtyards",items:["Modern Residential Courtyard","Shaded Courtyard","Natural Courtyard"]},
  {name:"Streets & Boulevards",items:["Urban Street Planting","Boulevard Planting","Green Median"]},
  {name:"Lawn Areas",items:["Open Lawn with Trees","Ornamental Lawn","Meadow Lawn"]},
  {name:"Parks & Squares",items:["Formal City Park","Natural Park","Walking Areas"]}
 ]},
 forest:{name:"Forest",sections:[
  {name:"Woodland Types",items:["Coniferous Forest","Deciduous Forest","Forest Edge","Forest Clearing"]},
  {name:"Planting Layers",items:["Mixed Woodland Understory","Shade-Tolerant Groundcover"]}
 ]},
 landscape:{name:"Landscape",sections:[
  {name:"Designed Gardens",items:["Contemporary Garden","Seasonal Flower Garden","Naturalistic Garden"]},
  {name:"Open Spaces",items:["Meadow & Grasslands","Mixed Border"]}
 ]}
};
const roles=[
 {key:"Trees",title:"TREES",types:["Deciduous Trees"]},
 {key:"Shrubs & Low Conifers",title:"SHRUBS & LOW CONIFERS",types:["Shrubs","Coniferous Trees"]},
 {key:"Perennials & Groundcovers",title:"PERENNIALS & GROUNDCOVERS",types:["Flowerbed Plants","Ornamental Grasses"]}
];
const useCategories=[
 ["Decorative & Designed Planting",["Lawns","Flowerbeds","Mixed Borders","Border Planting","Groundcovers","Ornamental Grasses","Shrubs","Hedges","Urban Trees","Avenue Planting","Specimen Accents","Container Planting","Vertical Planting","Interior Planting","Conifer Planting","Ornamental Perennials","Low-Growing Conifers","Flowering Shrubs","Bulbs","Palms"]],
 ["Natural & Wild Vegetation",["Field Vegetation","Forest Vegetation","Forest Understory","Wild Shrubs","Steppe Vegetation","Coastal Vegetation","Aquatic Vegetation","Tropical Vegetation","Desert Vegetation","Ferns"]]
];
function modelUses(m){
 const type=m.type;
 if(type==="Deciduous Trees")return ["Urban Trees","Avenue Planting","Specimen Accents","Forest Vegetation"];
 if(type==="Coniferous Trees")return ["Conifer Planting","Low-Growing Conifers","Forest Vegetation"];
 if(type==="Shrubs")return ["Shrubs","Hedges","Flowering Shrubs","Forest Understory"];
 if(type==="Ornamental Grasses")return ["Ornamental Grasses","Lawns","Steppe Vegetation","Mixed Borders"];
 return ["Flowerbeds","Groundcovers","Ornamental Perennials","Mixed Borders"];
}
const botanicalNames={
 Acer:["Клён пальчатый","Japanese maple"],Betula:["Берёза повислая","Silver birch"],
 Juniperus:["Можжевельник","Common juniper"],Picea:["Ель европейская","Norway spruce"],
 Hydrangea:["Гортензия","Hydrangea"],Lavandula:["Лаванда","Lavender"],
 Miscanthus:["Мискантус","Miscanthus"],Pennisetum:["Пеннисетум","Fountain grass"]
};
function getTheme(){return themes[state.catalog]}
function getRole(m){return roles.find(r=>r.types.includes(m.type))?.title||"OTHER PLANTS"}
function themeIds(){
 if(!getTheme())return [];
 const seed=(state.themeSelection||"").length;
 return models.filter((m,i)=>((i+seed)%4!==0 || state.themeSelection?.includes("Forest"))).map(m=>m.id);
}
const propDefs=[
 ["Basic Information",[
  ["model","Model file",true],["ru","Russian name",false],["en","English name",true],["lat","Latin name",true],["type","Plant type",true]]],
 ["Visual Characteristics",[
  ["foliage","Foliage color",true],["density","Canopy density",false],["flowering","Flowering",false],["flowerColor","Flower color",false],["flowerHabit","Flowering pattern",false],
  ["uses","Landscaping uses",true],["description","Visual description",false],["keywords","Search keywords",false],["similar","Similar Plants",true]]],
 ["Geometry & Technical",[
  ["height","Height",true],["width","Width",true],["length","Length",false],["diameter","Maximum diameter",false],["base","Base width",false],
  ["width10","Width at 10% height",false],["widestAt","Height of max width",false],["vertices","Vertices",false],
  ["polygons","Polygons",false],["triangles","Triangles",false],["materials","Materials",false],["textures","Textures",false]]]
];
const propDefault=()=>propDefs.flatMap(([_,items])=>items.filter(a=>a[2]).map(a=>a[0]));
const prefRead=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(repoKey+"-"+key));return v??fallback}catch{return fallback}};
const prefWrite=(key,v)=>{try{localStorage.setItem(repoKey+"-"+key,JSON.stringify(v))}catch{}};

state.themeSelection="Modern Residential Courtyard";
state.themeExpanded=new Set(["Courtyards","Woodland Types","Designed Gardens"]);
state.usageSelected=new Set();
state.usageMore=[];
state.filterType="";state.filterFoliage="";state.filterFlower="";state.filterMinHeight="";
state.propWidth=prefRead("properties-width",240);
state.propVisible=prefRead("properties-visible",propDefault());
state.propOrder=prefRead("properties-order",propDefs.flatMap(([_,items])=>items.map(x=>x[0])));
state.propCollapsed=new Set(prefRead("properties-collapsed",["Geometry & Technical"]));
state.propCustomize=false;
state.themeMode=false;
try{Object.assign(state.settings,JSON.parse(localStorage.getItem(repoKey+"-settings")||"{}"))}catch{}
const clean=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const save=()=>{try{localStorage.setItem(repoKey+"-favorites",JSON.stringify([...state.favorites]));localStorage.setItem(repoKey+"-collections",JSON.stringify(state.favCollections));localStorage.setItem(repoKey+"-settings",JSON.stringify(state.settings));localStorage.setItem(repoKey+"-basket",JSON.stringify([...state.basket].map(([id,checked])=>({id,checked}))));localStorage.setItem(repoKey+"-basket-size",String(state.basketTileSize));localStorage.setItem(repoKey+"-explorer-info",JSON.stringify(state.explorerDataFiles))}catch{}};
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
function showCatalogTabs(){
 const builtin=collections.filter(x=>["explorer","favorites","basket"].includes(x.id));
 $("#catalogTabs").innerHTML=builtin.map(x=>'<button class="catalog-tab '+(state.catalog===x.id?'active':'')+'" data-catalog="'+clean(x.id)+'">'+clean(x.label)+(x.id==="basket"?'<span class="basket-tab-count" '+(state.basket.size?'':'hidden')+'>'+state.basket.size+'</span>':'')+'</button>').join("");
 const thematic=!builtin.some(x=>x.id===state.catalog);
 const selected=collections.find(x=>x.id===state.catalog);
 $("#catalogsButton").classList.toggle("active",thematic);
 $("#catalogsButton").innerHTML='Catalogs <span aria-hidden="true">▾</span>'+(thematic?'<small class="catalog-selected-name">'+clean(selected?.label||"")+'</small>':'');
 $("#catalogsMenu").innerHTML='<div class="catalog-menu-heading">INSTALLED CATALOGS</div>'+
 collections.filter(x=>!builtin.includes(x)).map(x=>'<button type="button" role="menuitem" class="catalog-menu-item '+(x.id===state.catalog?'active':'')+'" data-catalog="'+clean(x.id)+'"><span class="catalog-menu-dot"></span>'+clean(x.label)+'</button>').join("")+
 '<div class="catalog-menu-divider"></div><button type="button" class="catalog-menu-add" id="addCatalogButton">+ Add Catalog</button>';
}
function closeCatalogMenu(){$("#catalogsMenu").hidden=true;$("#catalogsButton").setAttribute("aria-expanded","false")}
$("#catalogsButton").addEventListener("click",()=>{
 const menu=$("#catalogsMenu");menu.hidden=!menu.hidden;$("#catalogsButton").setAttribute("aria-expanded",String(!menu.hidden));
});
$("#catalogsMenu").addEventListener("click",e=>{
 if(e.target.closest("#addCatalogButton")){closeCatalogMenu();showModal("catalog");return}
 const b=e.target.closest("[data-catalog]");if(!b)return;
 selectCatalog(b.dataset.catalog);closeCatalogMenu();
});
document.addEventListener("click",e=>{if(!e.target.closest("#catalogsDropdown"))closeCatalogMenu()});
function selectCatalog(id){
 if(id===state.catalog)return;
 state.catalog=id;state.selected.clear();state.search="";$("#modelSearch").value="";
 if(themes[id]){state.themeSelection=themes[id].sections[0].items[0];state.themeExpanded.add(themes[id].sections[0].name);}
 hideContextMenu();render();
}
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
 }else if(getTheme()){
  const theme=getTheme();
  head.textContent="COLLECTIONS";foot.textContent=theme.name+" / Curated combinations";
  host.innerHTML=theme.sections.map(section=>{
   const expanded=state.themeExpanded.has(section.name);
   return '<button type="button" class="tree-item theme-section" data-theme-section="'+clean(section.name)+'"><span class="twisty">'+(expanded?'⌄':'›')+'</span>'+iconFolder()+'<span class="tree-name">'+clean(section.name)+'</span></button>'+
    (expanded?section.items.map(item=>'<button type="button" class="tree-item theme-composition '+(state.themeSelection===item?'active':'')+'" data-theme-comp="'+clean(item)+'"><span class="theme-composition-mark">◈</span><span class="tree-name">'+clean(item)+'</span></button>').join(""):"");
  }).join("");
 }else{
  head.textContent="CATEGORIES";foot.textContent="Imported thematic catalog preview";
  const cats=["Garden Collections","Planting Schemes","Sample Combinations"];
  host.innerHTML=cats.map(t=>'<button type="button" class="tree-item category '+(state.category===t?'active':'')+'" data-category="'+clean(t)+'">'+iconFolder()+'<span class="tree-name">'+clean(t)+'</span></button>').join("");
 
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
 const fav=state.favorites.has(m.id),selected=state.selected.has(m.id),inBasket=state.basket.has(m.id);
 return '<article class="model-card '+(selected?'selected':'')+'" role="listitem" draggable="true" tabindex="0" data-model="'+clean(m.id)+'" data-index="'+i+'" title="'+clean(m.botanical)+'"><div class="plant-image">'+leafSVG(m)+'</div><button type="button" class="basket-add-button '+(inBasket?'is-added':'')+'" data-addbasket="'+clean(m.id)+'" title="'+(inBasket?'Already in Basket':'Add to Basket')+'" aria-label="Add to Basket" draggable="false">'+(inBasket?'✓':'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 2 11h10l2-11H5zM8 9l4-6 4 6M9 13v4m6-4v4"/></svg>')+'</button><div class="card-caption"><span class="card-name">'+clean(m.id)+'</span><button type="button" class="star-button '+(fav?'active':'')+'" data-favorite="'+clean(m.id)+'" aria-label="Toggle favorite" title="Favorite">'+(fav?'★':'☆')+'</button></div><span class="card-botanical">'+clean(m.botanical)+'</span><span class="card-height">H '+m.height+' cm</span></article>';
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
function render(){
 const basket=state.catalog==="basket";
 $("#catalogBody").hidden=basket;$("#catalogFooter").hidden=basket;$("#basketWorkspace").hidden=!basket;
 showCatalogTabs();
 $("#explorerInfoButton").hidden=state.catalog!=="explorer";
 const info=$("#explorerInfoStatus");info.hidden=state.catalog!=="explorer"||state.explorerDataFiles.length===0;
 info.textContent=state.explorerDataFiles.length+" info file(s) selected - preview only";
 if(basket)renderBasket();else{folderList();renderModels()}
}

/* Basket is an interactive browser preview; no actual 3ds Max scene operations. */
function addModelsToBasket(ids){
 let added=0;
 for(const id of [...new Set(ids)]){
  if(!models.some(m=>m.id===id)||state.basket.has(id))continue;
  state.basket.set(id,true);added++;
 }
 save();showCatalogTabs();
 if(state.catalog==="basket")renderBasket();else renderModels();
 toast(added?added+" model"+(added===1?"":"s")+" added to Basket":"Selected models are already in Basket.");
}
function basketTargetIds(id){
 return state.selected.has(id)&&state.selected.size>1?[...state.selected]:[id];
}
function renderBasket(){
 const grid=$("#basketGrid");
 grid.style.setProperty("--basket-card-size",state.basketTileSize+"px");
 $("#basketTileSize").value=state.basketTileSize;
 $("#basketTileValue").textContent=state.basketTileSize+" px";
 const entries=[...state.basket].map(([id,checked])=>({model:models.find(m=>m.id===id),checked})).filter(x=>x.model);
 const selected=entries.filter(x=>x.checked).length;
 $("#basketCount").textContent=entries.length+" plant"+(entries.length===1?"":"s");
 $("#basketSummary").textContent=entries.length+" models in Basket";
 $("#basketSelectedCount").textContent=selected+" checked";
 $("#basketImport").disabled=selected===0;
 $("#basketClear").disabled=entries.length===0;
 grid.innerHTML=entries.length?entries.map(({model:m,checked})=>
  '<article class="basket-card" role="listitem" data-basketid="'+clean(m.id)+'">'+
  '<div class="basket-preview">'+leafSVG(m)+
  '<label class="basket-check" title="Include in import"><input type="checkbox" data-basketcheck="'+clean(m.id)+'" '+(checked?'checked':'')+' aria-label="Include '+clean(m.id)+' in import"><span>Include</span></label>'+
  '<button type="button" class="basket-remove" data-basketremove="'+clean(m.id)+'" title="Remove from Basket" aria-label="Remove '+clean(m.id)+'">×</button></div>'+
  '<div class="basket-card-title" title="'+clean(m.id)+'">'+clean(m.id)+'</div>'+
  '<div class="basket-card-description">'+clean(m.botanical)+'</div>'+
  '</article>').join(""):
  '<div class="basket-empty"><strong>Basket is empty</strong><p>Add plants from Explorer, Favorites or a catalog with the hover icon, right-click menu, or Shift + right-click.</p></div>';
}
$("#basketGrid").addEventListener("change",e=>{
 const el=e.target.closest("[data-basketcheck]");if(!el)return;
 state.basket.set(el.dataset.basketcheck,el.checked);save();renderBasket();
});
$("#basketGrid").addEventListener("click",e=>{
 const button=e.target.closest("[data-basketremove]");if(!button)return;
 state.basket.delete(button.dataset.basketremove);save();render();
});
$("#basketTileSize").addEventListener("input",e=>{
 state.basketTileSize=Number(e.target.value);save();renderBasket();
});
$("#basketClear").addEventListener("click",()=>showModal("basketClear"));
$("#basketImport").addEventListener("click",()=>{if([...state.basket.values()].some(Boolean))showModal("basketImport")});
$("#explorerInfoButton").addEventListener("click",()=>showModal("explorerData"));
const contextMenu=$("#plantContextMenu");
let contextIds=[];
function hideContextMenu(){contextMenu.hidden=true;contextIds=[]}
$("#modelGrid").addEventListener("contextmenu",e=>{
 const card=e.target.closest(".model-card");
 if(!card)return;
 e.preventDefault();e.stopPropagation();
 const id=card.dataset.model,ids=basketTargetIds(id);
 if(e.shiftKey){hideContextMenu();addModelsToBasket(ids);return}
 contextIds=ids;
 $("#contextAddBasket").textContent="Add to Basket"+(ids.length>1?" ("+ids.length+" models)":"");
 contextMenu.hidden=false;
 contextMenu.style.left=Math.max(6,Math.min(e.clientX,window.innerWidth-214))+"px";
 contextMenu.style.top=Math.max(6,Math.min(e.clientY,window.innerHeight-62))+"px";
});
$("#contextAddBasket").addEventListener("click",()=>{const ids=[...contextIds];hideContextMenu();addModelsToBasket(ids)});
document.addEventListener("click",e=>{if(!e.target.closest("#plantContextMenu"))hideContextMenu()});
window.addEventListener("blur",hideContextMenu);

function selectModel(id,index,shift,ctrl){
 const ids=visibleModels().map(m=>m.id);
 if(shift && state.lastClicked>=0){if(!ctrl)state.selected.clear();const a=Math.min(state.lastClicked,index),b=Math.max(state.lastClicked,index);for(let i=a;i<=b;i++)state.selected.add(ids[i]);}
 else if(ctrl){if(state.selected.has(id))state.selected.delete(id);else state.selected.add(id);state.lastClicked=index;}
 else{state.selected.clear();state.selected.add(id);state.lastClicked=index;}
 renderModels();
}
$("#catalogTabs").addEventListener("click",e=>{const b=e.target.closest("[data-catalog]");if(!b)return;selectCatalog(b.dataset.catalog)});
$("#sidebarContent").addEventListener("click",e=>{
 if(e.target.closest("[data-folder]")){state.folder=Number(e.target.closest("[data-folder]").dataset.folder);state.selected.clear();render();}
 if(e.target.closest("[data-fav]")){state.favFilter=e.target.closest("[data-fav]").dataset.fav;render();}
 if(e.target.closest("[data-theme-section]")){const t=e.target.closest("[data-theme-section]").dataset.themeSection;if(state.themeExpanded.has(t))state.themeExpanded.delete(t);else state.themeExpanded.add(t);folderList();return;}
 if(e.target.closest("[data-theme-comp]")){state.themeSelection=e.target.closest("[data-theme-comp]").dataset.themeComp;state.selected.clear();render();return;}
 if(e.target.closest("[data-category]")){state.category=e.target.closest("[data-category]").dataset.category;state.selected.clear();render();}
 if(e.target.closest("#addFavCollection"))showModal("newCollection");
});
$("#modelGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-addbasket]");
 if(add){e.preventDefault();e.stopPropagation();addModelsToBasket([add.dataset.addbasket]);return;}
 const fav=e.target.closest("[data-favorite]");
 if(fav){const id=fav.dataset.favorite;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);save();render();return;}
 const card=e.target.closest(".model-card");
 if(card)selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey);
});
$("#modelGrid").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest(".model-card")){const card=e.target.closest(".model-card");selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey)}});
$("#modelGrid").addEventListener("dragstart",e=>{if(e.target.closest("[data-addbasket]")){e.preventDefault();return}const card=e.target.closest("[data-model]");if(!card)return;const id=card.dataset.model;e.dataTransfer.setData("text/plain",id);e.dataTransfer.effectAllowed="copy";toast("Drag & Drop is a design preview. Actual placement works inside 3ds Max.")});
$("#modelSearch").addEventListener("input",e=>{state.search=e.target.value;state.selected.clear();renderModels()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderModels()});
$("#gridButton").addEventListener("click",()=>{state.grid=true;$("#gridButton").classList.add("active");$("#listButton").classList.remove("active");renderModels()});
$("#listButton").addEventListener("click",()=>{state.grid=false;$("#listButton").classList.add("active");$("#gridButton").classList.remove("active");renderModels()});
$("#proxyControls").addEventListener("click",e=>{const b=e.target.closest("[data-proxy]");if(!b)return;state.proxy=b.dataset.proxy;state.settings.proxy=state.proxy;save();$$("[data-proxy]").forEach(x=>x.classList.toggle("active",x===b));properties();toast("Proxy view: "+state.proxy+" (prototype setting)")});
$("#refreshButton").addEventListener("click",()=>{render();toast("Catalog preview refreshed. Local 3ds Max files are not scanned in the browser.")});
$("#settingsButton").addEventListener("click",()=>showModal("settings"));
$("#libraryButton").addEventListener("click",()=>showModal("library"));

const modal=$("#modalBackdrop");
function hideModal(){modal.hidden=true;state.workingModal=null}
$("#closeModal").addEventListener("click",hideModal);
$("#modalCancel").addEventListener("click",hideModal);
modal.addEventListener("click",e=>{if(e.target===modal)hideModal()});
window.addEventListener("keydown",e=>{if(e.key==="Escape")hideModal()});
function showModal(kind){
 state.workingModal=kind;modal.hidden=false;
 const body=$("#modalBody"),title=$("#modalTitle"),confirm=$("#modalConfirm");
 if(kind==="basketClear"){
  title.textContent="Clear Basket?";confirm.textContent="Clear Basket";
  body.innerHTML='<div class="modal-body-section"><p>Remove all models from the Basket? Favorites, library files, installed catalogs and scene objects remain unchanged.</p></div>';
 }else if(kind==="basketImport"){
  title.textContent="Import Basket - Preview";confirm.textContent="Close Preview";
  const count=[...state.basket.values()].filter(Boolean).length;
  body.innerHTML='<div class="modal-body-section"><h3>'+count+' model(s) selected</h3><p>Inside 3ds Max, these models would be imported with pivots at <b>(0, 0, 0)</b>, with original names and scales, into the shared layer <b>Flora Import</b>.</p><p>One <b>Import duplicate?</b> dialog would handle object-name conflicts found anywhere in the scene. Material merging and Corona Proxy conversion would use the same Flora settings as normal drag-and-drop.</p><p><b>Browser prototype only:</b> the scene cannot be checked here. No actual import or clearing will occur.</p></div>';
 }else if(kind==="explorerData"){
  title.textContent="Explorer Plant Data";confirm.textContent="Add to Preview";
  body.innerHTML='<div class="modal-body-section"><h3>Attach information .floracat</h3><input type="file" multiple accept=".floracat" id="explorerInfoFiles"><p>Select one or more Explorer information files. These supplement existing .max models without creating new catalog tabs. The actual plugin matches by model filename and uses the most recently imported record on a conflict.</p><p><b>Prototype:</b> only selected filenames are remembered. SQLite content is not parsed here.</p><p>'+(state.explorerDataFiles.length?'Selected: '+clean(state.explorerDataFiles.join(", ")):'No files selected yet.')+'</p></div>';
 }else if(kind==="settings"){
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
 if(kind==="basketClear"){state.basket.clear();save();render();toast("Basket cleared in this preview.")}
 if(kind==="basketImport"){toast("No objects imported - preview only. Basket kept intact.")}
 if(kind==="explorerData"){
  const files=[...$("#explorerInfoFiles").files];if(!files.length){toast("Choose a .floracat file first.");return}
  if(files.some(f=>!f.name.toLowerCase().endsWith(".floracat"))){toast("Only .floracat files are supported.");return}
  state.explorerDataFiles.push(...files.map(f=>f.name));save();render();toast(files.length+" info file(s) selected for Explorer preview.");
 }
 if(kind==="settings"){state.settings.useSceneMaterials=$("#sceneMaterials").checked;state.settings.autoRefresh=$("#autoRefresh").checked;save();toast("Design settings saved locally.");}
 if(kind==="library"){toast("Library root saved for preview. Actual folder access requires 3ds Max.")}
 if(kind==="catalog"){
  const file=$("#catalogFile").files[0];if(!file){toast("Choose a .floracat file first.");return}
  const id="cat-"+Date.now();collections.push({id,label:file.name.replace(/\.floracat$/i,""),builtin:false});state.catalog=id;state.category="Shrubs";state.selected.clear();render();toast("Added a preview tab. Catalog database was not imported.");
 }
 if(kind==="newCollection"){const v=$("#collectionNameInput").value.trim();if(!v)return;state.favCollections.push(v);save();state.favFilter=v;render();toast("Collection created. Drag model assignment is planned for Flora.");}
 hideModal();
});
state.proxy=state.settings.proxy||"Point Cloud";
$$("[data-proxy]").forEach(x=>x.classList.toggle("active",x.dataset.proxy===state.proxy));
render();
})();