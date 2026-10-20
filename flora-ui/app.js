/* Flora UI - interactive browser prototype. No 3ds Max or file-system integration. */
(() => {
"use strict";
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const repoKey = "flora-ui-design-v1";
const collections = [
  {id:"explorer",label:"Explorer",builtin:true},
  {id:"favorites",label:"Favorites",builtin:true},
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
const state={catalog:"explorer",folder:34,favFilter:"All Favorites",category:"Flowerbed Plants",expandFav:true,treeOpen:true,grid:true,search:"",sort:"asc",selected:new Set(),lastClicked:-1,favorites:new Set(favoritesStorage()),favCollections:readCollections(),basket:readBasket(),basketTileSize:readTileSize(),explorerDataFiles:readDataFiles(),proxy:"Geometry",settings:{useSceneMaterials:true,autoRefresh:true,proxy:"Geometry",useInstances:false,pointCloud:true,proxyCachePath:"FloraProxyCache"},workingModal:null};

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
const floraTaxonomy={"Деревья":["Лиственные","Хвойные","Пальмы"],"Кусты":["Лиственные","Хвойные","Папоротники","Злаки","Вьющиеся","Многолетники","Суккуленты"],"Трава":["Травы","Цветы","Почвопокровные","Луковичные"]};
const naturalCategories=["Лесная","Луговая","Водная","Прибрежная","Степная","Пустынная","Горная"];
const landscapedCategories=["Улицы","Парки","Сады","Дворы","Интерьеры"];
function demoBotanical(m){
  if(!state.atlasPreviewActive)return null;
 if(m.type==="Deciduous Trees")return {group:"Деревья",category:"Лиственные",natural:["Лесная"],landscaped:["Улицы","Парки","Сады"],flowering:"Нет"};
 if(m.type==="Coniferous Trees")return {group:"Деревья",category:"Хвойные",natural:["Лесная","Горная"],landscaped:["Парки","Сады"],flowering:"Нет"};
 if(m.type==="Shrubs")return {group:"Кусты",category:"Лиственные",natural:["Лесная","Прибрежная"],landscaped:["Парки","Сады","Дворы"],flowering:"Да"};
 if(m.type==="Ornamental Grasses")return {group:"Кусты",category:"Злаки",natural:["Луговая","Степная"],landscaped:["Парки","Сады"],flowering:"Нет"};
 return {group:"Трава",category:"Цветы",natural:["Луговая"],landscaped:["Сады"],flowering:"Да"};
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
 ["Названия",[["model","Имя модели",true],["ru","Название на русском",true],["en","Название на английском",true],["lat","Название на латыни",true]]],
 ["Ботанические сведения",[["flowering","Цветение",true],["group","Группа растения",true],["category","Категория растения",true],["natural","Природные",true],["landscaped","Домашние",true],["similar","Похожие растения",true]]]
];
const propDefault=()=>propDefs.flatMap(([_,items])=>items.filter(a=>a[2]).map(a=>a[0]));
const prefRead=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(repoKey+"-"+key));return v??fallback}catch{return fallback}};
const prefWrite=(key,v)=>{try{localStorage.setItem(repoKey+"-"+key,JSON.stringify(v))}catch{}};

state.selected.add(models.find(m=>m.family==="Acer")?.id||models[0].id);
state.themeSelection="Modern Residential Courtyard";
state.themeExpanded=new Set(["Courtyards","Woodland Types","Designed Gardens"]);
state.filterGroup="";state.filterCategory="";state.filterFlower="";
state.filterEnvironment="";state.filterEnvironmentCategory="";
state.propWidth=prefRead("properties-width",225);
state.propCollapsed=new Set(prefRead("properties-collapsed-atlas",[]));
state.themeMode=false;
state.atlasPreviewActive=prefRead("atlas-preview-active-v2",true);
state.tileSize=Math.max(136,Math.min(260,Number(prefRead("tile-size-v2",readTileSize()))||176));
state.lastGridSize=state.tileSize===260?176:state.tileSize;
state.grid=state.tileSize!==260;
state.tableSortKey=prefRead("table-sort-key-v2","model");
state.tableSortDir=prefRead("table-sort-dir-v2","asc");
state.propertiesHidden=Boolean(prefRead("properties-hidden-v2",false));
try{Object.assign(state.settings,JSON.parse(localStorage.getItem(repoKey+"-settings")||"{}"))}catch{}
if(!["Geometry","Proxy"].includes(state.settings.proxy))state.settings.proxy="Geometry";
state.propertyOverrides=prefRead("property-overrides-v2",{});
state.editModelId=null;state.editDraft=null;state.editOriginal=null;state.pendingAction=null;
const orphanSceneModel={id:"Missing_Source_Pinus_07",family:"",type:"",botanical:"",color:"#66876c",imageSeed:9271,missing:true};
const sceneEntries=[
 {id:models[0].id,mode:"Geometry",count:21,floraSource:"F:/001_Model/Maxtree/MT - Volume 34/"+models[0].id+".max"},
 {id:models[0].id,mode:"Proxy",count:3,floraSource:"F:/001_Model/Maxtree/MT - Volume 34/"+models[0].id+".max"},
 {id:models[14].id,mode:"Proxy",count:8,floraSource:"F:/001_Model/Maxtree/MT - Volume 34/"+models[14].id+".max"},
 {id:orphanSceneModel.id,mode:"Geometry",count:2,floraSource:"D:/Archive/Missing_Source_Pinus_07.max"}
];
function sceneCounts(){const out=new Map();for(const rec of sceneEntries){if(!rec.floraSource)continue;const k=rec.floraSource.replace(/\\/g,"/").toLocaleLowerCase();const current=out.get(k)||{id:rec.id,count:0};current.count+=rec.count;out.set(k,current)}return out}
function sceneModels(){const ids=new Set([...sceneCounts().values()].map(x=>x.id));return [...models,orphanSceneModel].filter(m=>ids.has(m.id))}
function sceneCount(m){const rec=[...sceneCounts().values()].find(x=>x.id===m.id);return rec?.count||0}
function allSelectedModels(){return [...models,orphanSceneModel].filter(m=>state.selected.has(m.id))}
function hasUnsavedProperties(){return state.editDraft!==null&&JSON.stringify(state.editDraft)!==JSON.stringify(state.editOriginal)}
function propertyPath(m){return (m.path||"F:/001_Model/Maxtree/MT - Volume 34/"+m.id+".max").replace(/\\/g,"/").toLocaleLowerCase()}
function exitPropertyEdit(){state.editModelId=null;state.editDraft=null;state.editOriginal=null}
function guardPropertyChange(action){if(hasUnsavedProperties()){state.pendingAction=action;showModal("unsavedProps");return}exitPropertyEdit();action()}
window.addEventListener("beforeunload",e=>{if(hasUnsavedProperties()){e.preventDefault();e.returnValue=""}});

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
 $("#catalogTabs").innerHTML='<button type="button" class="catalog-tab '+(state.catalog==="explorer"?"active":"")+'" data-catalog="explorer">Explorer</button>';
 const selected=collections.find(x=>x.id===state.catalog);
 const thematic=!["explorer","favorites","basket","scene"].includes(state.catalog);
 $("#catalogsButton").classList.toggle("active",thematic);
 $("#catalogsButton").title=thematic?"Catalogs / "+(selected?.label||""):"Catalogs";
 $("#catalogsMenu").innerHTML='<div class="catalog-menu-heading">INSTALLED CATALOGS</div>'+
  collections.filter(x=>!x.builtin).map(x=>'<button type="button" role="menuitem" class="catalog-menu-item '+(x.id===state.catalog?'active':'')+'" data-catalog="'+clean(x.id)+'"><span class="catalog-menu-dot"></span>'+clean(x.label)+'</button>').join("")+
  '<div class="catalog-menu-divider"></div><button type="button" class="catalog-menu-add" id="addCatalogButton">+ Add Catalog</button>';
 $$(".catalog-actions [data-catalog]").forEach(b=>{const active=b.dataset.catalog===state.catalog;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
 const count=$("#navBasketCount");count.textContent=String(state.basket.size);count.hidden=!state.basket.size;
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
 guardPropertyChange(()=>{state.catalog=id;state.selected.clear();state.search="";$("#modelSearch").value="";
 if(themes[id]){state.themeSelection=themes[id].sections[0].items[0];state.themeExpanded.add(themes[id].sections[0].name);}
 hideContextMenu();render();});
}
function folderList(){
 const host=$("#sidebarContent"),head=$("#sidebarHeading"),foot=$("#sidebarFooter");
 if(state.catalog==="explorer"){
  head.textContent="FOLDERS";foot.textContent="F:/001_Model/Maxtree";
  const demoFolders=[1,8,9,19,21,23,27,28,34,40,41,49,51,61,63,65,66,67,69,74,77,82,83,85,86,100];
  host.innerHTML='<button type="button" class="tree-item" data-folder="1">'+iconFolder()+'<span class="tree-name">IstWood</span></button>'+
   demoFolders.map(n=>'<button type="button" class="tree-item '+(state.folder===n?'active':'')+'" data-folder="'+n+'">'+iconFolder()+'<span class="tree-name">MT - Volume '+n+'</span></button>').join("");
 }else if(state.catalog==="scene"){
   head.textContent="SCENE";foot.textContent="FloraSource · browser demo";
   host.innerHTML='<div class="scene-sidebar-note"><strong>Демо Scene</strong><p>Условные узлы с меткой FloraSource. Реальная сцена 3ds Max недоступна браузеру.</p><p>Geometry и Proxy одного исходника сгруппированы.</p></div>';
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
function similarPlantNames(m){
 if(!state.atlasPreviewActive)return [];
 const groups=[...new Set(models.filter(x=>x.family!==m.family&&x.type===m.type).map(x=>x.family))].slice(0,6);
 return groups.map(f=>({ru:(botanicalNames[f]||[])[0]||"",en:(botanicalNames[f]||[])[1]||"",lat:plants.find(x=>x[1]===f)?.[0]||f}));
}
function propertyValue(key,m){
 if(key==="model")return m.id+".max";
 const override=state.propertyOverrides[propertyPath(m)];
 if(override&&Object.prototype.hasOwnProperty.call(override,key))return override[key];
 if(m.missing)return "";
 if(!state.atlasPreviewActive)return "";
 const names=botanicalNames[m.family]||[],bot=demoBotanical(m);
 if(!bot)return "";
 const values={ru:names[0]||"",en:names[1]||"",lat:m.botanical,
 flowering:bot.flowering,group:bot.group,category:bot.category,
 natural:bot.natural.join(", "),landscaped:bot.landscaped.join(", "),
 similar:similarPlantNames(m).map(x=>x.ru||x.en||x.lat).join(", ")};
 return values[key]||"";
}
function tableValue(key,m){
 if(key==="environmentType")return [propertyValue("natural",m)?"Природные":"",propertyValue("landscaped",m)?"Домашние":""].filter(Boolean).join(", ");
 if(key==="environmentCategory")return [propertyValue("natural",m)?"Природные: "+propertyValue("natural",m):"",propertyValue("landscaped",m)?"Домашние: "+propertyValue("landscaped",m):""].filter(Boolean).join("; ");
 return propertyValue(key,m);
}
function visibleModels(){
 let arr=(state.catalog==="scene"?sceneModels():models).filter(m=>{
  if(state.catalog==="favorites"&&!state.favorites.has(m.id))return false;
  if(getTheme()&&!themeIds().includes(m.id))return false;
  const group=propertyValue("group",m),category=propertyValue("category",m);
   if(state.filterGroup&&group!==state.filterGroup)return false;
   if(state.filterCategory&&state.filterCategory!==group+"|"+category)return false;
   if(state.filterFlower&&propertyValue("flowering",m)!==state.filterFlower)return false;
   if(state.filterEnvironment){
    const values=propertyValue(state.filterEnvironment==="Природные"?"natural":"landscaped",m).split(",").map(x=>x.trim()).filter(Boolean);
    if(!values.length)return false;
    if(state.filterEnvironmentCategory&&!values.includes(state.filterEnvironmentCategory))return false;
   }
  return true;
 });
 const q=state.search.trim().toLocaleLowerCase();
 if(q)arr=arr.filter(m=>[m.id+".max",propertyValue("ru",m),propertyValue("en",m),propertyValue("lat",m),propertyValue("similar",m),...similarPlantNames(m).flatMap(x=>[x.ru,x.en,x.lat])].some(x=>String(x).toLocaleLowerCase().includes(q)));
 const key=state.grid?"model":state.tableSortKey;
 arr.sort((a,b)=>String(tableValue(key,a)).localeCompare(String(tableValue(key,b)),undefined,{numeric:true,sensitivity:"base"}));
 if((state.grid?state.sort:state.tableSortDir)==="desc")arr.reverse();
 return arr;
}
function properties(){
 const selected=models.filter(m=>state.selected.has(m.id));
 $("#propertyRows").innerHTML=propDefs.map(([group,defs])=>{
  const collapsed=state.propCollapsed.has(group);
  const content=collapsed?"":defs.map(([key,label])=>{
   const vals=selected.map(m=>propertyValue(key,m));
   const value=vals.length&&vals.every(v=>v===vals[0])?vals[0]:"";
   return '<div class="property-row"><span>'+clean(label)+'</span><span>'+clean(value)+'</span></div>';
  }).join("");
  return '<section class="property-group"><button type="button" class="property-group-title" data-propgroup="'+clean(group)+'" aria-expanded="'+(!collapsed)+'"><span>'+(collapsed?'▸':'▾')+'</span>'+clean(group)+'</button>'+content+'</section>';
 }).join("");
}
$("#propertyRows").addEventListener("click",e=>{
 const header=e.target.closest("[data-propgroup]");if(!header)return;
 const group=header.dataset.propgroup;
 if(state.propCollapsed.has(group))state.propCollapsed.delete(group);else state.propCollapsed.add(group);
 prefWrite("properties-collapsed-atlas",[...state.propCollapsed]);properties();
});
(function(){
 const resizer=$("#propertiesResize"),shell=$("#resultsShell");
 shell.style.setProperty("--properties-width",state.propWidth+"px");
 let moving=false;
 function resize(x){const width=Math.max(180,Math.min(440,shell.getBoundingClientRect().right-x-3));state.propWidth=width;shell.style.setProperty("--properties-width",width+"px");}
 resizer.addEventListener("pointerdown",e=>{moving=true;e.preventDefault();resizer.setPointerCapture?.(e.pointerId)});
 resizer.addEventListener("pointermove",e=>{if(moving)resize(e.clientX)});
 resizer.addEventListener("pointerup",()=>{if(moving){moving=false;prefWrite("properties-width",state.propWidth)}});
 resizer.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){state.propWidth=Math.max(180,Math.min(440,state.propWidth+(e.key==="ArrowLeft"?12:-12)));shell.style.setProperty("--properties-width",state.propWidth+"px");prefWrite("properties-width",state.propWidth);e.preventDefault()}});
})();
const TABLE_COLS=[
 ["model","Имя модели",205],["ru","Название на русском",155],
 ["en","Название на английском",155],["lat","Название на латыни",180],
 ["flowering","Цветение",92],["group","Группа растения",125],
 ["category","Категория растения",145],["environmentType","Тип среды",135],
 ["environmentCategory","Категория среды",255]
];
const tableKeys=TABLE_COLS.map(c=>c[0]);
const savedTableOrder=prefRead("table-order-v2",tableKeys);
state.tableOrder=[...new Set([...(Array.isArray(savedTableOrder)?savedTableOrder:[]).filter(x=>tableKeys.includes(x)),...tableKeys])];
state.tableWidths=prefRead("table-widths-v2",{});
function tableColumns(){return state.tableOrder.map(k=>TABLE_COLS.find(c=>c[0]===k));}
function tableWidth(k){return Math.max(80,Math.min(440,Number(state.tableWidths[k])||TABLE_COLS.find(c=>c[0]===k)[2]));}
function modelCard(m,i){
 const fav=state.favorites.has(m.id),selected=state.selected.has(m.id),inBasket=state.basket.has(m.id);
 const ru=propertyValue("ru",m),en=propertyValue("en",m);
 const preview=m.missing?'<div class="missing-preview">Нет превью</div>':leafSVG(m);
 const add=m.missing?"":'<button type="button" class="basket-add-button '+(inBasket?'is-added':'')+'" data-addbasket="'+clean(m.id)+'" aria-label="Добавить в Basket" draggable="false">'+(inBasket?'✓':'＋')+'</button>';
 return '<article class="model-card '+(selected?'selected':'')+'" role="listitem" draggable="'+(!m.missing)+'" tabindex="0" data-model="'+clean(m.id)+'" data-index="'+i+'"><div class="plant-image">'+preview+'</div>'+add+
 '<div class="card-caption"><span class="card-name" title="'+clean(m.id)+'.max">'+clean(m.id)+'.max</span><button type="button" class="star-button '+(fav?'active':'')+'" data-favorite="'+clean(m.id)+'" aria-label="Избранное">'+(fav?'★':'☆')+'</button></div>'+
 (state.catalog==="scene"?'<span class="scene-node-count">×'+sceneCount(m)+' узлов · Demo</span>':'')+
 (ru?'<span class="card-secondary">'+clean(ru)+'</span>':'')+(en?'<span class="card-secondary">'+clean(en)+'</span>':'')+'</article>';
}
function modelTable(arr){
 const cols=tableColumns();
 const head=cols.map(c=>'<th scope="col" draggable="true" data-colhead="'+c[0]+'"><button type="button" data-sortcol="'+c[0]+'">'+clean(c[1])+(state.tableSortKey===c[0]?(state.tableSortDir==="asc"?' ↑':' ↓'):'')+'</button><span class="table-resize" data-resizecol="'+c[0]+'" title="Изменить ширину"></span></th>').join("");
 const rows=arr.map((m,i)=>'<tr class="model-row '+(state.selected.has(m.id)?'selected':'')+'" tabindex="0" data-model="'+clean(m.id)+'" data-index="'+i+'">'+cols.map(c=>{
  const value=tableValue(c[0],m);
  const actions=c[0]==="model"?'<span class="table-actions"><button type="button" data-favorite="'+clean(m.id)+'" aria-label="Избранное">'+(state.favorites.has(m.id)?'★':'☆')+'</button><button type="button" data-addbasket="'+clean(m.id)+'" aria-label="Добавить в Basket">'+(state.basket.has(m.id)?'✓':'＋')+'</button></span>':"";
  return '<td title="'+clean(value)+'"><span class="table-cell-value">'+clean(value)+(c[0]==="model"&&state.catalog==="scene"?" · ×"+sceneCount(m):"")+'</span>'+actions+'</td>';
 }).join("")+'</tr>').join("");
 return '<table class="flora-table" style="width:'+cols.reduce((s,c)=>s+tableWidth(c[0]),0)+'px"><colgroup>'+cols.map(c=>'<col data-colwidth="'+c[0]+'" style="width:'+tableWidth(c[0])+'px">').join("")+'</colgroup><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table>';
}
function applyGridSizing(count){
 const host=$("#modelGrid");if(!state.grid)return;
 const width=Math.max(0,host.clientWidth-8),size=state.tileSize,gap=6;
 if(!width)return;
 const columns=Math.max(1,Math.floor((width+gap)/(size+gap)));
 const actual=Math.max(1,Math.min(columns,count));
 const value=count<=columns?'repeat('+actual+', minmax(0, '+Math.min(size,width)+'px))':'repeat('+columns+', minmax(0, 1fr))';
 if(host.style.gridTemplateColumns!==value)host.style.gridTemplateColumns=value;
}
function syncTileControls(){
 $("#tileSize").value=state.tileSize;$("#basketTileSize").value=state.tileSize;
 const label=state.tileSize===260?"Table":state.tileSize+" px";
 $("#tileSizeValue").textContent=label;$("#basketTileValue").textContent=label;
 $("#gridButton").classList.toggle("active",state.grid);
 $("#listButton").classList.toggle("active",!state.grid);
}
function setTileSize(value){
 state.tileSize=Math.max(136,Math.min(260,Number(value)||176));
 if(state.tileSize<260)state.lastGridSize=state.tileSize;
 state.grid=state.tileSize!==260;state.basketTileSize=state.tileSize;
 prefWrite("tile-size-v2",state.tileSize);save();syncTileControls();
 if(state.catalog==="basket")renderBasket();else renderModels();
}
function renderModels(){
 const arr=visibleModels(),host=$("#modelGrid");
 host.classList.toggle("table-mode",!state.grid);
 if(state.grid){
  host.setAttribute("role","list");
  if(getTheme()){
   const grouped=roles.map(r=>{const subset=arr.filter(m=>getRole(m)===r.title);
    return subset.length?'<div class="role-heading">'+clean(r.title)+' <span>'+subset.length+' models</span></div>'+subset.map(m=>modelCard(m,arr.indexOf(m))).join(""):"";
   }).join("");
   host.innerHTML=grouped||'<div class="empty-state">Нет моделей по выбранным условиям.</div>';
  }else host.innerHTML=arr.length?arr.map((m,i)=>modelCard(m,i)).join(""):'<div class="empty-state">Нет моделей по выбранным условиям.</div>';
  applyGridSizing(arr.length);
 }else{
  host.removeAttribute("role");host.style.gridTemplateColumns="";
  host.innerHTML=arr.length?modelTable(arr):'<div class="empty-state">Нет моделей по выбранным условиям.</div>';
 }
 let title,path;
 if(state.catalog==="explorer"){title="Explorer";path="F:/001_Model/Maxtree";}
 else if(state.catalog==="scene"){title="Scene";path="Демонстрация FloraSource · реальные узлы 3ds Max недоступны";}
  else if(state.catalog==="favorites"){title=state.favFilter;path="Favorites / Saved plants";}
 else if(getTheme()){title=state.themeSelection;path=getTheme().name+" / "+getTheme().sections.find(x=>x.items.includes(state.themeSelection))?.name+" / "+state.themeSelection;}
 else{const meta=collections.find(x=>x.id===state.catalog);title=meta?.label||"Catalog";path="Imported / "+title;}
 $("#collectionTitle").textContent=title;$("#collectionPath").textContent=path;
 $("#contentTag").hidden=["explorer","favorites","scene"].includes(state.catalog);
 const intro=$("#collectionDescription");intro.hidden=!getTheme();
 if(getTheme()){const purpose=getTheme().name==="City"?"Urban and residential landscaping":getTheme().name==="Forest"?"Layered woodland planting":"Designed outdoor planting";
  intro.innerHTML='<strong>Purpose:</strong> '+clean(purpose)+' <span> · Sample groups, not automatic planting.</span>';}
 $("#modelCount").textContent=arr.length+(state.catalog==="scene"?" source models · Demo":" models");
 $("#selectionCount").textContent=state.selected.size+" selected";
 properties();
}
if(typeof ResizeObserver!=="undefined")new ResizeObserver(()=>applyGridSizing(visibleModels().length)).observe($("#modelGrid"));
function render(){
 const basket=state.catalog==="basket";
 $("#catalogBody").hidden=basket;$("#catalogFooter").hidden=basket;$("#basketWorkspace").hidden=!basket;
 syncTileControls();
 showCatalogTabs();
 $("#explorerInfoButton").hidden=true;
 const info=$("#explorerInfoStatus");info.hidden=state.catalog!=="explorer"||state.explorerDataFiles.length===0;
 info.textContent=state.explorerDataFiles.length?"Descriptions selected: "+state.explorerDataFiles.length+" file(s) · demo":"No descriptions imported";
 if(basket)renderBasket();else{folderList();renderModels()} renderFilterControls();
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
 grid.style.setProperty("--basket-card-size",state.tileSize+"px");
 grid.classList.toggle("basket-table-view",!state.grid);
 syncTileControls();
 const entries=[...state.basket].map(([id,checked])=>({model:models.find(m=>m.id===id),checked})).filter(x=>x.model);
 const selected=entries.filter(x=>x.checked).length;
 $("#basketCount").textContent=entries.length+" plant"+(entries.length===1?"":"s");
 $("#basketSummary").textContent=entries.length+" models in Basket";
 $("#basketSelectedCount").textContent=selected+" checked";
 $("#basketImport").disabled=selected===0;
 $("#basketClear").disabled=entries.length===0;
 if(!state.grid&&entries.length){
 const cols=tableColumns();
 grid.innerHTML='<table class="flora-table basket-table" style="width:'+cols.reduce((sum,c)=>sum+tableWidth(c[0]),0)+'px"><colgroup>'+cols.map(c=>'<col style="width:'+tableWidth(c[0])+'px">').join("")+'</colgroup><thead><tr>'+cols.map(c=>'<th scope="col">'+clean(c[1])+'</th>').join("")+'</tr></thead><tbody>'+entries.map(({model:m,checked})=>'<tr data-basketid="'+clean(m.id)+'">'+cols.map(c=>'<td>'+(c[0]==="model"?'<label><input type="checkbox" data-basketcheck="'+clean(m.id)+'" '+(checked?"checked":"")+'> <span>'+clean(tableValue("model",m))+'</span></label><button class="basket-remove-table" type="button" data-basketremove="'+clean(m.id)+'" aria-label="Удалить">×</button>':clean(tableValue(c[0],m)))+'</td>').join("")+'</tr>').join("")+'</tbody></table>';
 return;
 }
 grid.innerHTML=entries.length?entries.map(({model:m,checked})=>
  '<article class="basket-card" role="listitem" data-basketid="'+clean(m.id)+'">'+
  '<div class="basket-preview">'+leafSVG(m)+
  '<label class="basket-check" title="Include in import"><input type="checkbox" data-basketcheck="'+clean(m.id)+'" '+(checked?'checked':'')+' aria-label="Include '+clean(m.id)+' in import"><span>Include</span></label>'+
  '<button type="button" class="basket-remove" data-basketremove="'+clean(m.id)+'" title="Remove from Basket" aria-label="Remove '+clean(m.id)+'">×</button></div>'+
  '<div class="basket-card-title" title="'+clean(m.id)+'">'+clean(m.id)+'.max</div>'+
  (propertyValue('ru',m)?'<div class="basket-card-description">'+clean(propertyValue('ru',m))+'</div>':'')+
   (propertyValue('en',m)?'<div class="basket-card-description">'+clean(propertyValue('en',m))+'</div>':'')+
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
 setTileSize(e.target.value);
});
$("#basketClear").addEventListener("click",()=>showModal("basketClear"));
$("#basketImport").addEventListener("click",()=>{if([...state.basket.values()].some(Boolean))showModal("basketImport")});
$("#explorerInfoButton").addEventListener("click",()=>showModal("explorerData"));
const contextMenu=$("#plantContextMenu");
let contextIds=[];
function hideContextMenu(){contextMenu.hidden=true;contextIds=[]}
$("#modelGrid").addEventListener("contextmenu",e=>{
 const card=e.target.closest("[data-model]");
 if(!card)return;
 e.preventDefault();e.stopPropagation();
 const id=card.dataset.model,ids=basketTargetIds(id);
 if(e.shiftKey){hideContextMenu();addModelsToBasket(ids);return}
 contextIds=ids;
 $("#contextAddBasket").textContent="Add to Basket"+(ids.length>1?" ("+ids.length+" models)":"");
 $("#contextAddBasket").disabled=Boolean(sceneModels().some(m=>m.id===id&&m.missing));
 contextMenu.hidden=false;
 contextMenu.style.left=Math.max(6,Math.min(e.clientX,window.innerWidth-214))+"px";
 contextMenu.style.top=Math.max(6,Math.min(e.clientY,window.innerHeight-62))+"px";
});
$("#contextAddBasket").addEventListener("click",()=>{const ids=[...contextIds];hideContextMenu();addModelsToBasket(ids)});
$("#contextSelectModel").addEventListener("click",()=>{const n=contextIds.length;hideContextMenu();toast("Select Model: демо для "+n+" источника(ов). Выделение узлов доступно только в 3ds Max.")});
document.addEventListener("click",e=>{if(!e.target.closest("#plantContextMenu"))hideContextMenu()});
window.addEventListener("blur",hideContextMenu);

function selectModel(id,index,shift,ctrl){
 guardPropertyChange(()=>{
  const ids=visibleModels().map(m=>m.id);
  if(shift&&state.lastClicked>=0){if(!ctrl)state.selected.clear();const a=Math.min(state.lastClicked,index),b=Math.max(state.lastClicked,index);for(let i=a;i<=b;i++)if(ids[i])state.selected.add(ids[i]);}
  else if(ctrl){if(state.selected.has(id))state.selected.delete(id);else state.selected.add(id);state.lastClicked=index;}
  else{state.selected.clear();state.selected.add(id);state.lastClicked=index;}
  renderModels();
 });
}
$("#catalogTabs").addEventListener("click",e=>{const b=e.target.closest("[data-catalog]");if(b)selectCatalog(b.dataset.catalog)});
$(".catalog-actions").addEventListener("click",e=>{const b=e.target.closest("[data-catalog]");if(b)selectCatalog(b.dataset.catalog)});
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
 const card=e.target.closest("[data-model]");
 if(card)selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey);
});
$("#modelGrid").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest("[data-model]")){const card=e.target.closest("[data-model]");selectModel(card.dataset.model,Number(card.dataset.index),e.shiftKey,e.ctrlKey||e.metaKey)}});
$("#modelGrid").addEventListener("dragstart",e=>{if(e.target.closest("[data-colhead]")){e.dataTransfer.setData("text/flora-column",e.target.closest("[data-colhead]").dataset.colhead);return}if(e.target.closest("[data-addbasket]")){e.preventDefault();return}const card=e.target.closest("[data-model]");if(!card)return;const id=card.dataset.model;e.dataTransfer.setData("text/plain",id);e.dataTransfer.effectAllowed="copy";toast("Drag & Drop is a design preview. Actual placement works inside 3ds Max.")});
$("#modelGrid").addEventListener("click",e=>{
 const sort=e.target.closest("[data-sortcol]");if(!sort)return;
 const key=sort.dataset.sortcol;
 state.tableSortDir=state.tableSortKey===key&&state.tableSortDir==="asc"?"desc":"asc";
 state.tableSortKey=key;prefWrite("table-sort-key-v2",key);prefWrite("table-sort-dir-v2",state.tableSortDir);renderModels();
});
$("#modelGrid").addEventListener("dragover",e=>{if(e.target.closest("[data-colhead]"))e.preventDefault()});
$("#modelGrid").addEventListener("drop",e=>{
 const target=e.target.closest("[data-colhead]");
 const source=e.dataTransfer.getData("text/flora-column");
 if(!target||!tableKeys.includes(source)||source===target.dataset.colhead)return;
 e.preventDefault();state.tableOrder=state.tableOrder.filter(k=>k!==source);
 state.tableOrder.splice(state.tableOrder.indexOf(target.dataset.colhead),0,source);
 prefWrite("table-order-v2",state.tableOrder);renderModels();
});
$("#modelGrid").addEventListener("pointerdown",e=>{
 const grip=e.target.closest("[data-resizecol]");if(!grip)return;
 e.preventDefault();e.stopPropagation();
 const key=grip.dataset.resizecol,initial=tableWidth(key),x=e.clientX;
 const col=$("#modelGrid").querySelector('[data-colwidth="'+key+'"]');
 const table=$("#modelGrid").querySelector(".flora-table");
 const startingWidth=table.getBoundingClientRect().width;
 function moving(ev){const next=Math.max(80,Math.min(440,initial+ev.clientX-x));col.style.width=next+"px";table.style.width=(startingWidth+next-initial)+"px";state.tableWidths[key]=next;}
 function done(){window.removeEventListener("pointermove",moving);window.removeEventListener("pointerup",done);prefWrite("table-widths-v2",state.tableWidths);renderModels();}
 window.addEventListener("pointermove",moving);window.addEventListener("pointerup",done,{once:true});
});
$("#tileSize").addEventListener("input",e=>setTileSize(e.target.value));
/* FloraAtlas v1 filters: simulated data, never represents local 3ds Max analysis. */
function renderFilterControls(){
 const group=$("#filterGroup"),category=$("#filterCategory");
 group.innerHTML='<option value="">Все группы</option>'+Object.keys(floraTaxonomy).map(n=>'<option value="'+clean(n)+'">'+clean(n)+'</option>').join("");
 group.value=state.filterGroup;
 // A plant category can only be chosen within an explicitly selected group.
 const plantCategories=state.filterGroup?(floraTaxonomy[state.filterGroup]||[]):[];
 category.disabled=!state.filterGroup;
 category.innerHTML='<option value="">'+(state.filterGroup?"Все категории":"Сначала выберите группу")+'</option>'+
  plantCategories.map(name=>'<option value="'+clean(state.filterGroup+"|"+name)+'">'+clean(name)+'</option>').join("");
 category.value=state.filterCategory;
 if(category.value!==state.filterCategory){state.filterCategory="";category.value="";}
 // Natural and domestic environments are mutually exclusive UI modes.
 const environment=$("#filterEnvironment"),environmentCategory=$("#filterEnvironmentCategory");
 environment.value=state.filterEnvironment;
 const environmentItems=state.filterEnvironment==="Природные"?naturalCategories:
  state.filterEnvironment==="Домашние"?landscapedCategories:[];
 environmentCategory.disabled=!state.filterEnvironment;
 environmentCategory.innerHTML='<option value="">'+(state.filterEnvironment?"Все категории":"Сначала выберите тип среды")+'</option>'+
  environmentItems.map(name=>'<option value="'+clean(name)+'">'+clean(name)+'</option>').join("");
 environmentCategory.value=state.filterEnvironmentCategory;
 if(environmentCategory.value!==state.filterEnvironmentCategory){state.filterEnvironmentCategory="";environmentCategory.value="";}
 $$("#filterFlowerSegments button").forEach(b=>{
  const active=b.dataset.flowering===state.filterFlower;
  b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
 });
 const total=[state.filterGroup,state.filterCategory,state.filterFlower,state.filterEnvironment,state.filterEnvironmentCategory].filter(Boolean).length;
 $("#filterCount").textContent=total?"("+total+")":"";
 $("#filterPanelCount").textContent=String(total);$("#filterPanelCount").hidden=total===0;
 $("#filterButton").classList.toggle("active",total>0);
}
function resizeFilterPanel(){
 const area=$(".library-area");if(!area)return;
 $("#filterPanel").style.setProperty("--filter-max-height",Math.max(125,Math.min(345,Math.round(area.getBoundingClientRect().height*.43)))+"px");
}
if(typeof ResizeObserver!=="undefined")new ResizeObserver(resizeFilterPanel).observe($(".library-area"));
window.addEventListener("resize",resizeFilterPanel);resizeFilterPanel();
$("#filterButton").addEventListener("click",()=>{const p=$("#filterPanel");p.hidden=!p.hidden;$("#filterButton").setAttribute("aria-expanded",String(!p.hidden));if(!p.hidden){resizeFilterPanel();renderFilterControls();}});
$("#resetFilters").addEventListener("click",()=>{
 state.filterGroup="";state.filterCategory="";state.filterFlower="";
 state.filterEnvironment="";state.filterEnvironmentCategory="";state.selected.clear();
 renderFilterControls();renderModels();
});
$("#filterGroup").addEventListener("change",e=>{
 state.filterGroup=e.target.value;state.filterCategory="";state.selected.clear();
 renderFilterControls();renderModels();
});
$("#filterCategory").addEventListener("change",e=>{
 if(!state.filterGroup)return;
 state.filterCategory=e.target.value;state.selected.clear();renderFilterControls();renderModels();
});
$("#filterFlowerSegments").addEventListener("click",e=>{
 const b=e.target.closest("[data-flowering]");if(!b)return;
 state.filterFlower=b.dataset.flowering;state.selected.clear();renderFilterControls();renderModels();
});
$("#filterEnvironment").addEventListener("change",e=>{
 state.filterEnvironment=e.target.value;state.filterEnvironmentCategory="";state.selected.clear();
 renderFilterControls();renderModels();
});
$("#filterEnvironmentCategory").addEventListener("change",e=>{
 if(!state.filterEnvironment)return;
 state.filterEnvironmentCategory=e.target.value;state.selected.clear();
 renderFilterControls();renderModels();
});
if(state.propertiesHidden)$(".library-area").classList.add("properties-hidden");
$("#propertyPanelButton").classList.toggle("active",!state.propertiesHidden);
$("#propertyPanelButton").setAttribute("aria-pressed",String(!state.propertiesHidden));
$("#propertyPanelButton").addEventListener("click",()=>{state.propertiesHidden=!state.propertiesHidden;prefWrite("properties-hidden-v2",state.propertiesHidden);$(".library-area").classList.toggle("properties-hidden",state.propertiesHidden);const b=$("#propertyPanelButton");b.classList.toggle("active",!state.propertiesHidden);b.setAttribute("aria-pressed",String(!state.propertiesHidden));});

$("#modelSearch").addEventListener("input",e=>{state.search=e.target.value;state.selected.clear();renderModels()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderModels()});
$("#gridButton").addEventListener("click",()=>setTileSize(state.lastGridSize));
$("#listButton").addEventListener("click",()=>setTileSize(260));
function setImportMode(mode){if(!["Geometry","Proxy"].includes(mode))return;state.proxy=mode;state.settings.proxy=mode;save();$("[data-proxy]").forEach(b=>{b.classList.toggle("active",b.dataset.proxy===mode);b.setAttribute("aria-pressed",String(b.dataset.proxy===mode))})}
$("#proxyControls").addEventListener("click",e=>{const b=e.target.closest("[data-proxy]");if(b){setImportMode(b.dataset.proxy);toast("Import Mode: "+state.proxy+" · демо без импорта в 3ds Max.")}});
$("#basketProxyControls").addEventListener("click",e=>{const b=e.target.closest("[data-proxy]");if(b){setImportMode(b.dataset.proxy);toast("Basket использует общий Import Mode: "+state.proxy)}});

$("#refreshButton").addEventListener("click",()=>{render();toast(state.catalog==="scene"?"Scene обновлена по демо-узлам. Реальная сцена 3ds Max недоступна.":"Данные библиотеки не сканируются браузером.")});
$("#settingsButton").addEventListener("click",()=>showModal("settings"));
$("#libraryButton").addEventListener("click",()=>showModal("library"));

const modal=$("#modalBackdrop");
function hideModal(){modal.hidden=true;state.workingModal=null}
$("#closeModal").addEventListener("click",hideModal);
$("#modalCancel").addEventListener("click",hideModal);
$("#modalBody").addEventListener("click",e=>{
 const analyzer=e.target.closest("[data-open-analyzer]");
 if(analyzer){
  if(typeof window.openFloraAnalyzer==="function")window.openFloraAnalyzer();
  else window.open("./model-analyzer.html","flora-model-analyzer","popup=yes,width=1170,height=830,resizable=yes,scrollbars=yes");
  return;
 }
 const action=e.target.closest("[data-settings-action]")?.dataset.settingsAction;
 if(action==="atlas")showModal("explorerData");
 if(action==="col")showModal("catalog");
 if(action==="clear")showModal("clearModelData");
 if(action==="export")toast("Демо: JSON содержит только name и path. Браузер не читает файловую библиотеку.");
 if(action==="choose")showModal("library");
});

modal.addEventListener("click",e=>{if(e.target===modal)hideModal()});
window.addEventListener("keydown",e=>{if(e.key==="Escape")hideModal()});
function showModal(kind){
 state.workingModal=kind;modal.hidden=false;
 const body=$("#modalBody"),title=$("#modalTitle"),confirm=$("#modalConfirm");
 if(kind==="clearModelData"){
  title.textContent="Очистить данные о моделях?";confirm.textContent="Очистить данные";
  body.innerHTML='<div class="modal-body-section"><p><b>Подтвердите удаление импортированных метаданных FloraAtlas/FloraCOL и связанных описаний/категорий (демонстрация).</b></p><p>Избранное, коллекции, Basket, настройки, библиотека, исходные .max, изображения, .cgeo, внешние файлы каталогов и сцена не затрагиваются. Реальные SQLite-файлы браузер не изменяет.</p></div>';
 }else if(kind==="basketClear"){
  title.textContent="Clear Basket?";confirm.textContent="Clear Basket";
  body.innerHTML='<div class="modal-body-section"><p>Remove all models from the Basket? Favorites, library files, installed catalogs and scene objects remain unchanged.</p></div>';
 }else if(kind==="basketImport"){
  title.textContent="Import Basket - Preview";confirm.textContent="Close Preview";
  const count=[...state.basket.values()].filter(Boolean).length;
  body.innerHTML='<div class="modal-body-section"><h3>'+count+' model(s) selected</h3><p>Inside 3ds Max, these models would be imported with pivots at <b>(0, 0, 0)</b>, with original names and scales, into the shared layer <b>Flora Import</b>.</p><p>One <b>Import duplicate?</b> dialog would handle object-name conflicts found anywhere in the scene. Material merging and Corona Proxy conversion would use the same Flora settings as normal drag-and-drop.</p><p><b>Browser prototype only:</b> the scene cannot be checked here. No actual import or clearing will occur.</p></div>';
 }else if(kind==="explorerData"){
  title.textContent="Импорт FloraAtlas";confirm.textContent="Закрыть";
  body.innerHTML='<div class="modal-body-section"><h3>Подключить ботанический FloraAtlas v1</h3><input type="file" multiple accept=".floratlas" id="explorerInfoFiles"><p>Выберите файл FloraAtlas v1. В рабочем плагине он сопоставляется с .max по относительному пути. В браузере содержимое SQLite не разбирается.</p><p><b>Prototype:</b> only selected filenames are remembered. SQLite content is not parsed here.</p><p>'+(state.explorerDataFiles.length?'Selected: '+clean(state.explorerDataFiles.join(", ")):'No files selected yet.')+'</p></div>';
 }else if(kind==="settings"){
  title.textContent="Flora Settings";confirm.textContent="Сохранить настройки";
  body.innerHTML='<div class="modal-body-section"><h3>Material Import</h3><label><input id="sceneMaterials" type="checkbox" '+(state.settings.useSceneMaterials?'checked':'')+'> Use Scene Materials</label><p>ON: #useSceneMtlDups; OFF: #renameMtlDups (в работающем плагине).</p></div>'+
  '<div class="modal-body-section"><h3>Library</h3><p>Браузерная демонстрация, без доступа к локальной библиотеке и SQLite.</p><div class="settings-actions"><button type="button" class="toolbar-button" data-settings-action="choose">Choose Library</button><button type="button" class="toolbar-button" data-open-analyzer>Model Analyzer</button><button type="button" class="toolbar-button" data-settings-action="export">Export JSON</button><button type="button" class="toolbar-button" data-settings-action="atlas">Import FloraAtlas (.floratlas)</button><button type="button" class="toolbar-button" data-settings-action="col">Import FloraCOL (.floracol)</button></div></div>'+
  '<div class="modal-body-section"><h3>Отображение</h3><label><input id="autoRefresh" type="checkbox" '+(state.settings.autoRefresh?'checked':'')+'> Refresh library when opened</label><p>Tile Size, Table View, ширина таблицы и Properties сохраняются в браузере.</p><details class="font-settings"><summary>Fonts</summary><p>Интерфейс: Inter / Segoe UI / Arial (референс).</p></details></div>'+
  '<div class="modal-body-section"><h3>Импортированные данные</h3><p>Очистить только импортированные метаданные и каталоги. Не затрагивать библиотеку и пользовательские данные.</p><button type="button" class="toolbar-button danger-button" data-settings-action="clear">Очистить данные о моделях</button></div>'+
  '<small class="modal-meta">Только UI-макет - изменения 3ds Max/SQLite не выполняются.</small>';
 }else if(kind==="library"){
  title.textContent="Library";confirm.textContent="Save";
  body.innerHTML='<div class="modal-body-section"><h3>Library Root</h3><input id="libraryPathInput" value="F:/001_Model/Maxtree" aria-label="Local library root"><p>Select the source library in the installed Flora plugin. The browser mockup does not access folders on your computer.</p></div>';
 }else if(kind==="catalog"){
  title.textContent="Add Catalog";confirm.textContent="Add to Preview";
  body.innerHTML='<div class="modal-body-section"><h3>Import FloraCOL</h3><input type="file" accept=".floracol" id="catalogFile"><p>Thematic collections use the separate .floracol format. This prototype can add a visual catalog tab, but cannot parse or install a real catalog.</p></div>';
 }else if(kind==="newCollection"){
  title.textContent="New Favorites Collection";confirm.textContent="Create Collection";
  body.innerHTML='<div class="modal-body-section"><h3>Collection Name</h3><input id="collectionNameInput" placeholder="e.g. Riverside Garden" maxlength="55"></div>';
 }
}
$("#modalConfirm").addEventListener("click",()=>{
 const kind=state.workingModal;
 if(kind==="clearModelData"){
   state.explorerDataFiles=[];state.atlasPreviewActive=false;prefWrite("atlas-preview-active-v2",false);
   for(let i=collections.length-1;i>=0;i--)if(collections[i].id.startsWith("cat-")){delete themes[collections[i].id];collections.splice(i,1);}
   if(!collections.some(c=>c.id===state.catalog))state.catalog="explorer";
   state.filterGroup="";state.filterCategory="";state.filterFlower="";state.filterEnvironment="";state.filterEnvironmentCategory="";
   state.selected.clear();save();render();toast("Демо-метаданные очищены. Избранное и файлы не изменены.");
  }
  if(kind==="basketClear"){state.basket.clear();save();render();toast("Basket cleared in this preview.")}
 if(kind==="basketImport"){toast("No objects imported - preview only. Basket kept intact.")}
 if(kind==="explorerData"){
  const files=[...$("#explorerInfoFiles").files];if(!files.length){toast("Choose a .floratlas file first.");return}
  if(files.some(f=>!f.name.toLowerCase().endsWith(".floratlas"))){toast("Only .floratlas files are supported.");return}
  state.explorerDataFiles.push(...files.map(f=>f.name));state.atlasPreviewActive=true;prefWrite("atlas-preview-active-v2",true);save();render();toast("Только имена файлов сохранены. Показаны встроенные тестовые метаданные, SQLite не читалась.");
 }
 if(kind==="settings"){state.settings.useSceneMaterials=$("#sceneMaterials").checked;state.settings.autoRefresh=$("#autoRefresh").checked;save();toast("Design settings saved locally.");}
 if(kind==="library"){toast("Library root saved for preview. Actual folder access requires 3ds Max.")}
 if(kind==="catalog"){
  const file=$("#catalogFile").files[0];if(!file){toast("Choose a .floracol file first.");return}
  const id="cat-"+Date.now();const name=file.name.replace(/\.floracol$/i,"");collections.push({id,label:name,builtin:false});themes[id]={name,sections:[{name:"Example Space Types",items:["Sample Planting Composition","Mixed Planting Scheme"]}]};state.catalog=id;state.themeSelection="Sample Planting Composition";state.themeExpanded.add("Example Space Types");state.selected.clear();render();toast("Catalog added to dropdown as a demo. Source database was not parsed.");
 }
 if(kind==="newCollection"){const v=$("#collectionNameInput").value.trim();if(!v)return;state.favCollections.push(v);save();state.favFilter=v;render();toast("Collection created. Drag model assignment is planned for Flora.");}
 hideModal();
});
state.proxy=state.settings.proxy||"Geometry";
setImportMode(state.proxy);
syncTileControls();render();
})();