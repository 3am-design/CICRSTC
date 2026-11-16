"use strict";
/* RSTCS website revamp · tender prototype (Draft 02 · CIC alignment + RSTCS pentagon identity) */
const source = "https://rstc.cic.hk/en/";
const params = new URLSearchParams(location.search);
const theme = params.get("theme") === "b" ? "b" : "a";
const views = ["home","milestones","register","apply","updates","styles"];
const page = views.includes(params.get("view")) ? params.get("view") : "home";
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const reduceMotion = motionPreference.matches;
document.body.dataset.theme = theme;
document.body.dataset.page = page;
document.body.dataset.layout = theme === "b" && page === "milestones" ? "pentagon" : "cic";
document.body.dataset.clean = String(params.get("clean") === "1");
const url=(to=page, style=theme, extra="") => "index.html?view="+to+"&theme="+style+extra+(params.get("clean")==="1"?"&clean=1":"");

/* ---------- icons ---------- */
const icons={
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',chev:'<path d="m6 9 6 6 6-6"/>',
 left:'<path d="M20 12H5m6-6-6 6 6 6"/>',
 external:'<path d="M13 5h6v6m0-6-8 8M9 5H5v14h14v-4"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 notice:'<path d="M12 4 3 20h18L12 4Zm0 6v4m0 3h.01"/>',
 robot:'<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V5m0 0h.01M9 13h.01m5.99 0h.01M9.5 16.5h5M3 12v3m18-3v3"/>',
 star:'<path d="m12 4 2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.7Z"/>',
 replay:'<path d="M6 7a8 8 0 1 1-2 7M6 3v5h5"/>',
 play:'<path d="M8 5v14l11-7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-2 2.5-3.2 6.1-3.2 9S10 18.5 12 21c2-2.5 3.2-6.1 3.2-9S14 5.5 12 3Z"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.6 7.6-4.2m-7.6 7 7.6 4.2"/>',
 calendar:'<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M9 3v4m6-4v4"/>',
 clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
 mail:'<rect x="3" y="6" width="18" height="13" rx="1"/><path d="m3 7 9 7 9-7"/>',
 up:'<path d="M12 19V5m-6 6 6-6 6 6"/>',
 photo:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="9.5" r="1.5"/>'
};
const i=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(icons[name]||"")+"</svg>";
const cta=(label,href,kind="",icon="arrow")=>'<a class="btn '+kind+'" href="'+href+'">'+label+i(icon)+'</a>';
const link=(label,href,current=false)=>'<a href="'+href+'"'+(current?' aria-current="page"':'')+'>'+label+'</a>';

/* ---------- RSTCS pentagon identity ---------- */
/* Five scheme colours taken from the RSTCS logo, clockwise from the top. */
const P=["#8a5ba6","#d9472d","#3e8a3d","#f3cb5e","#4b72b6"];
const MID=["#e8873a","#8f7a35","#a2ab4f","#a3a98a","#6a66ad"]; /* blend points between neighbouring colours */
const vtx=(R,rot=-90)=>[0,1,2,3,4].map(k=>{const a=(rot+k*72)*Math.PI/180;return [R*Math.cos(a),R*Math.sin(a)]});
const f1=n=>n.toFixed(1);
const segPath=(R,k,bow=.45)=>{const v=vtx(R),a=v[k],b=v[(k+1)%5],m=(-90+k*72+36)*Math.PI/180;
 return "M"+f1(a[0])+" "+f1(a[1])+" Q"+f1(R*bow*Math.cos(m))+" "+f1(R*bow*Math.sin(m))+" "+f1(b[0])+" "+f1(b[1])};
const polyPts=(R,rot=-90)=>vtx(R,rot).map(p=>p.map(f1).join(",")).join(" ");
/* The ring: five gradient strokes meeting at five rounded "knots", as in the Scheme logo */
/* The ring, as in the Scheme logo: each colour grows out of its own knot as one single-colour stroke
   (lightening slightly towards its tip) and runs forward to tuck under the next knot:
   purple→red, red→green, green→yellow, yellow→blue, blue→purple. */
const TINT=["#a586c5","#e9735c","#62a75c","#f8dd92","#7598d2"];
function ring({R=92,w=30,knob=25,id="rg",cls="",bow=.9,mono=""}={}){
 const v=vtx(R);let defs="",segs="",knots="";
 for(let k=0;k<5;k++){
  const a=v[k],b=v[(k+1)%5],m=(-90+k*72+36)*Math.PI/180,c=mono||P[k];
  defs+='<linearGradient id="'+id+k+'" gradientUnits="userSpaceOnUse" x1="'+f1(a[0])+'" y1="'+f1(a[1])+'" x2="'+f1(b[0])+'" y2="'+f1(b[1])+'"><stop offset=".25" stop-color="'+c+'"/><stop offset="1" stop-color="'+(mono||TINT[k])+'"/></linearGradient>';
  const d="M"+f1(a[0])+" "+f1(a[1])+" Q"+f1(R*bow*Math.cos(m))+" "+f1(R*bow*Math.sin(m))+" "+f1(b[0])+" "+f1(b[1]);
  segs+='<path class="seg seg'+k+'" pathLength="100" d="'+d+'" stroke="url(#'+id+k+')" stroke-width="'+w+'" stroke-linecap="round" fill="none"/>';
  if(knob) knots+='<circle class="knot knot'+k+'" cx="'+f1(a[0])+'" cy="'+f1(a[1])+'" r="'+knob+'" fill="'+c+'"/>';
 }
 return '<defs>'+defs+'</defs><g class="ring '+cls+'">'+segs+knots+'</g>';
}
/* Full Scheme lockup (mark + trilingual name), rebuilt as vector from the official logo */
const rstcLogo=()=>'<img class="rstc-logo" src="assets/rstc_logo.png" width="188" height="59" alt="Registered Specialist Trade Contractors Scheme">';
const mark=(size=34,id="mk",extra="")=>'<svg class="pent-mark" width="'+size+'" height="'+size+'" viewBox="-128 -128 256 256" aria-hidden="true" '+extra+'>'+ring({id})+'</svg>';

/* ---------- header / navigation (cic.hk pattern) ---------- */
const menus={
 about:{title:"About the Scheme",desc:"Raising the professional standard of specialist trades in Hong Kong’s construction industry.",learn:url("milestones"),img:"summit.jpg",caption:"RSTCS Summit 2026",
  main:[["Chairperson’s Message",source+"about.aspx"],["Milestones",url("milestones")],["Objectives",source+"about.aspx#objectives"],["Benefits of Registration",source+"about.aspx#benefits"],["Core Elements for Registration",source+"about.aspx#core"]],
  groups:[["Regulatory Actions",[["Overview",source+"notice.aspx"],["Notices",source+"notice.aspx"]]],["Publications",[["Good Practice Manuals",source+"ebook_list.aspx"],["Leaflets and Videos",source+"ebook_list.aspx"]]]]},
 apply:{title:"Registration",desc:"Choose the registration route that matches your company before going to the application service.",learn:url("apply"),img:"site-team.jpg",caption:"Registration guidance for applicants",
  main:[["Apply as a Specialist Trade Contractor",url("apply")],["Apply as a Registered Sub-contractor",url("apply",theme,"&route=rs")],["Designated Trades",source+"reg_index.aspx"],["Renewal of Registration",source+"reg_index.aspx"]],
  groups:[["Application Service",[["Online Application",source+"reg_index.aspx#content102"],["Tutorials",source+"reg_index.aspx"],["Rules and Procedures",source+"reg_index.aspx"]]]]},
 registers:{title:"Registers",desc:"Search registered companies and check their status, trades and markings.",learn:url("register"),img:"lifting.jpg",caption:"Site Lifting Operations · designated trade S22",
  main:[["Register of Specialist Trade Contractors",url("register")],["Register of Sub-contractors",url("register",theme,"&register=rs")],["Regulatory Actions",source+"notice.aspx"]],
  groups:[["Markings Explained",[["Robotic Symbol",url("register",theme,"#legend")],["Excellent Marking",url("register",theme,"#legend")],["Substandard Marking",url("register",theme,"#legend")]]]]},
 quick:{title:"Quick Links",desc:"Access CIC websites and Scheme services.",
  main:[["Construction Industry Council","https://www.cic.hk/en"],["Hong Kong Institute of Construction","https://www.hkic.edu.hk/"]],
  groups:[["Scheme Services",[["Regulatory Actions",source+"notice.aspx"],["Good Practice Manuals",source+"ebook_list.aspx"]]]]},
 language:{title:"Language",desc:"This tender prototype uses English. See the existing RSTCS website for the other language editions.",
  main:[["English",url()],["繁體中文","https://rstc.cic.hk/tc/index.aspx"],["简体中文","https://rstc.cic.hk/sc/index.aspx"]],groups:[]}
};
const current={milestones:"about",apply:"apply",register:"registers",updates:"updates"}[page];
const header = () => `
 <header class="sitehead">
  <div class="bar wrap">
   <a class="brand" href="${url("home")}" aria-label="RSTCS home, a Construction Industry Council scheme">
    <img class="cic-logo" alt="" src="assets/cic-color.svg">
    <span class="brand-scheme">${rstcLogo()}</span>
   </a>
   <div class="header-right">
    <div class="tools" aria-label="Utility links">
     <a class="to-cic" href="https://www.cic.hk/en">CIC Website ${i("external")}</a>
     <button type="button" id="quickLinks" aria-expanded="false" aria-controls="navPanel">Quick Links ${i("chev")}</button>
     <a href="${source}contact.aspx">Contact Us</a>
     <button type="button" id="language" aria-label="Language options" aria-expanded="false" aria-controls="navPanel">${i("globe")} ${i("chev")}</button>
    </div>
    <nav id="nav" class="nav" aria-label="Main navigation">
     <button data-menu="about" aria-controls="navPanel" aria-expanded="false" ${current==="about"?'aria-current="true"':""}>About the Scheme</button>
     <button data-menu="apply" aria-controls="navPanel" aria-expanded="false" ${current==="apply"?'aria-current="true"':""}>Registration</button>
     <button data-menu="registers" aria-controls="navPanel" aria-expanded="false" ${current==="registers"?'aria-current="true"':""}>Registers</button>
     ${link("News &amp; Events",url("updates"),current==="updates")}
     ${link("Resources",source+"ebook_list.aspx")}
     <button data-menu="language" class="mobile-language" aria-controls="navPanel" aria-expanded="false">Language</button>
     <button data-menu="search" class="nav-search" aria-label="Site search" aria-controls="navPanel" aria-expanded="false">${i("search")}</button>
    </nav>
   </div>
   <button id="hamb" aria-expanded="false" aria-controls="nav" class="hamb">${i("menu")} Menu</button>
  </div>
  <div class="navPanel" id="navPanel" hidden></div>
 </header><div class="head-space" aria-hidden="true"></div>`;

/* footer: follows cic.hk */
const social={
 Email:['mailto:enquiry@cic.hk','<rect x="3" y="5.5" width="18" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'],
 Facebook:['https://www.facebook.com/CICHK/','<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z" fill="currentColor"/>'],
 Instagram:['https://www.instagram.com/cic_hk/','<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>'],
 Linkedin:['https://www.linkedin.com/company/construction-industry-council/','<path d="M4 9h3.4v11H4zM5.7 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM9.6 9h3.3v1.5c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.1 2.3 4.1 5.3v6H17v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H9.6z" fill="currentColor"/>'],
 YouTube:['https://www.youtube.com/user/hkcic','<path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8z" fill="currentColor"/><path d="m10 15 5.2-3L10 9z" fill="#fff"/>']};
const badges=[["award-10.gif","2024 HKMA Quality Award"],["CO_10_plus.jpg","Caring Organisation"],["CO_advanced_performance_logo.jpg","Caring Organisation advanced performance"],["20260709-happyorganisation.jpg","Hong Kong Happy Company"],["Good-MPF-Employer-10-Years.jpg","Good MPF Employer"],["award-4.png","Family-Friendly Employers"],["award-11.jpg","Silver Award"],["award-6.gif","Inclusive Organisation"],["award-7.png","Industry Cares"],["MD_Logo_Eng_4C.jpg","ERB Manpower Developer Award"]];
const footer = `
 <footer class="legal">
  <div class="wrap">
   <div class="legal-top">
    <a href="https://www.cic.hk/en" class="legal-logo"><img src="assets/cic-color.svg" alt="Construction Industry Council"></a>
    <div class="legal-actions">
     <nav class="social" aria-label="CIC social media">${Object.entries(social).map(([n,[h,p]])=>'<a href="'+h+'" aria-label="'+n+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg></a>').join("")}</nav>
     <a class="app-btn" href="https://www.cic.hk/en"><img src="assets/footer/download-app-icon.svg" alt="">Download App</a>
    </div>
   </div>
   <div class="badges">${badges.map(([f,a])=>'<img src="assets/footer/'+f+'" alt="'+a+'" loading="lazy">').join("")}</div>
   <nav class="legal-links" aria-label="Legal">${[["Careers at CIC","about/careers-at-cic/index"],["Tender Details","about/procurement/tender-details"],["Sitemap","sitemap"],["FAQ","faq"],["Privacy Policy &amp; Terms","privacy-policy-and-terms"]].map(([t,h])=>'<a href="https://www.cic.hk/en/'+h+'">'+t+'</a>').join("")}</nav>
   <p class="copyright">Copyright © 2026 (CIC). All Rights Reserved.</p>
  </div>
 </footer>`;
const switchState=["register","route","item","step"].map(k=>params.has(k)?"&"+k+"="+encodeURIComponent(params.get(k)):"").join("");
const reviewBar = `
 <div class="review-bar view" aria-label="Design review controls">
  ${link("A · Pentagon milestones",url(page,"a",switchState),theme === "a")}
  ${link("B · Journey milestones",url(page,"b",switchState),theme === "b")}
  ${link("Style tiles",url("styles"),page === "styles")}
  <button type="button" id="mono" aria-label="Toggle grayscale" aria-pressed="false">◐</button>
 </div>`;

/* ---------- inner page template (cic.hk: breadcrumb, teal title, share, side menu) ---------- */
const titleGeometry = '<i class="deco id-hexline id-tb" aria-hidden="true"></i><i class="deco id-lines-large id-tb-l" aria-hidden="true"></i>';
const hasRegisterBackdrop = page==="register";
const band = (over,title,sub="") => `
 <section class="titleBand">${hasRegisterBackdrop?"":titleGeometry}
  <div class="wrap">
   <nav class="crumb" aria-label="Breadcrumb">
    ${link("Home",url("home"))}
    ${over.split(" / ").map((part,index,parts) =>
     '<span aria-hidden="true">/</span> <span'+(index===parts.length-1?' aria-current="page"':'')+'>'+part+'</span>').join("")}
   </nav>
   <div class="page-title">
    <h1>${title}</h1>
    <button type="button" class="share" id="share" aria-label="Copy link to this page">${i("share")}</button>
   </div>
   ${sub ? "<p>"+sub+"</p>" : ""}
   <span class="share-status notes" id="shareStatus" role="status"></span>
  </div>
 </section>`;
/* Side menu items: [label, href, current] or {group, open, items:[...]} */
const sideItem=it=>Array.isArray(it)?link(it[0],it[1],it[2]):'<details class="side-group"'+(it.open?" open":"")+'><summary>'+it.group+'<span class="pm" aria-hidden="true"></span></summary><div class="side-children">'+it.items.map(sideItem).join("")+'</div></details>';
const rail=(name,items,box="")=>'<aside class="rail" aria-label="'+name+' navigation"><details class="rail-title" id="sectionRail" open><summary>'+name+'</summary><nav class="side">'+items.map(sideItem).join("")+'</nav></details>'+box+'</aside>';

/* ---------- content ---------- */
const updates = [
 {id:"lifting",type:"News",tag:"Registration",title:"Site Lifting Operations added as a designated trade", desc:"Site Lifting Operations (S22) joined the Scheme in March 2026. See the current RSTCS website for the requirements and application checklist.",date:"2026.03.02",asset:"lifting.jpg",href:source+"events.aspx#news"},
 {id:"summit",type:"Event",tag:"Technology and innovation",title:"RSTCS Summit 2026", desc:"The 2026 Summit explored the use of collaborative robots and construction technology on site. See the original Scheme listing for the event details.",date:"2026.11.12",asset:"summit.jpg",href:source+"events.aspx#courses"},
 {id:"workshop",type:"Course",tag:"Professional development",title:"Orientation workshop for registered specialist trade contractors",desc:"The Scheme’s online orientation workshop introduces registration and renewal. Refer to the official listing for current sessions and language details.",date:"Online",asset:"workshop.jpeg",href:source+"events.aspx#courses"},
 {id:"integrity",type:"Course",tag:"Integrity",title:"Integrity training from ICAC",desc:"Find recognised integrity training for relevant personnel at registered companies.",date:"Resource",asset:"integrity.jpeg",href:source+"events.aspx#courses"}
];
const feed = (rows=updates) => '<div class="feed">'+rows.map(e => `
 <a class="feature-card" href="${url("updates",theme,"&item="+e.id)}">
  <img src="assets/${e.asset}" alt="" loading="eager">
  <div class="feature-info">
   <div class="feature-meta">${e.date}<span>${e.type}</span></div>
   <h3>${e.title}</h3>
  </div>
 </a>`).join("")+'</div>';
const updateFilters = () => `
 <div class="update-tabs" aria-label="Filter updates">
  ${[["All","View All"],["News","Latest News"],["Event","Upcoming Events"],["Course","Courses"]].map(([key,title]) =>
   '<button type="button" data-update="'+key+'" aria-pressed="'+(key==="All")+'">'+title+'</button>').join("")}
 </div>`;

const milestones=[
 {y:"2003",t:"The first subcontractor scheme",d:"The voluntary scheme introduced a register for subcontractors with specialist skills.",n:"1st",u:"voluntary register for specialist subcontractors"},
 {y:"2019",t:"RSTCS established",d:"The new scheme raised registration requirements for seven designated trades. The subcontractor register continued to cover other trades.",n:"7",u:"designated trades at launch"},
 {y:"2021",t:"Integrity joins the framework",d:"Integrity management became the sixth core element for registration.",n:"6",u:"core elements for registration"},
 {y:"2024",t:"Six more designated trades",d:"Painting, metal work, structural steelwork and three greening trades were added as designated trades.",n:"+6",u:"designated trades added"},
 {y:"2025",t:"Truss-out scaffolding",d:"Truss-out Scaffolding became the 21st designated trade. CIC also introduced a metal brackets exchange programme.",n:"21",u:"designated trades"},
 {y:"2026",t:"Site Lifting Operations",d:"Site Lifting Operations joined the Scheme as designated trade S22 in March 2026.",n:"22",u:"designated trades today"}
];

/* HOME ------------------------------------------------------------ */
const heroRing=()=>'<svg class="hero-ring" viewBox="-520 -520 1040 1040" aria-hidden="true">'
 +[500,380].map(R=>'<polygon points="'+polyPts(R)+'" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/>').join("")
 +vtx(500).map(p=>'<path d="M0 0L'+f1(p[0])+' '+f1(p[1])+'" stroke="#fff" stroke-opacity=".1"/>').join("")
 +ring({R:430,w:2,knob:7,id:"hr",bow:.9,mono:"#ffffff"})+'</svg>';
/* the 22 designated trades, each with its own line icon (24×24, drawn for this prototype) */
const TRADES=[
 ["S01","Concreting",'<path d="M6 3h9l-1.2 6H7.2z"/><path d="M10.5 9v4"/><path d="M3 21h18M4.5 17h15v4h-15z"/>'],
 ["S02","Concreting Formwork",'<path d="M3.5 4h7v16h-7zM13.5 4h7v16h-7z"/><path d="M3.5 9h7M3.5 15h7M13.5 9h7M13.5 15h7M10.5 7h3M10.5 17h3"/>'],
 ["S03","Curtain Wall",'<path d="M5 3h14v18H5z"/><path d="M5 9h14M5 15h14M12 3v18"/><path d="M7.5 7l2.5-2.5M14.5 13l2.5-2.5"/>'],
 ["S04","Demolition",'<path d="M3 21h11M4 21v-7l3 2 2-3 3 2v6"/><path d="M13 3l5 8"/><circle cx="19" cy="14" r="3"/>'],
 ["S05","Erection of Concrete Precast Component",'<path d="M12 2v4M8 10l4-4 4 4"/><path d="M4 10h16v5H4z"/><path d="M7 15v4M17 15v4"/>'],
 ["S06","Reinforcement Bar Fixing",'<path d="M3 8h18M3 12h18M3 16h18M7 4v16M12 4v16M17 4v16"/>'],
 ["S07","Scaffolding",'<path d="M5 3v18M12 3v18M19 3v18M5 8h14M5 14h14M3 21h18"/><path d="M5 8l7 6M12 8l7 6"/>'],
 ["S08","Plastering",'<path d="M3 14h13l-2 4H5z"/><path d="M9.5 14V9.5A2.5 2.5 0 0 1 12 7h3"/><path d="M17 6l3-3"/>'],
 ["S09","Suspended Ceiling",'<path d="M3 3h18M7 3v4M17 3v4"/><path d="M3 7h18v4H3zM9 7v4M15 7v4"/><path d="M12 11v3M10 14h4l-2 3z"/>'],
 ["S10","Tower Crane",'<path d="M7 21V4M3 6h18M7 4l-4 2M7 4l13 2"/><path d="M8 6l-1 3M7 9l1 3M7 12l-1 3M7 15l1 3"/><path d="M17 6v6M15.5 12h3v2.5h-3z"/><path d="M4 21h6"/>'],
 ["S11","Building Drainage Installation",'<path d="M3 6h8a4 4 0 0 1 4 4v11"/><path d="M3 10h8"/><path d="M15 15h6M19 15v6"/><path d="M8 14.5c0 1-.8 1.8-1.8 1.8S4.5 15.5 4.5 14.5 6.2 12 6.2 12 8 13.5 8 14.5z"/>'],
 ["S12","Levelling and Setting Out",'<path d="M9 3h6v5H9z"/><path d="M12 8v3M12 11l-5 10M12 11l5 10M12 11v10"/><path d="M15 5h3"/>'],
 ["S13","Building Maintenance",'<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M14.5 12.5a2.5 2.5 0 0 0-3.4 3.2L9 18l1 1 2.3-2.1a2.5 2.5 0 0 0 3.2-3.4l-1.3 1.3-1.2-.3-.3-1.2z"/>'],
 ["S14","Interior Fitting-out",'<path d="M5 11V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><path d="M3 11h4v3h10v-3h4v6H3z"/><path d="M5 17v2.5M19 17v2.5"/>'],
 ["S15","Painting",'<path d="M4 4h13v5H4z"/><path d="M17 6.5h3V12h-8v3"/><path d="M11 15h2v6h-2z"/>'],
 ["S16","Metal Work",'<path d="M4 21V8M20 21V8M4 8h16M4 13h16"/><path d="M8 8v13M12 8v13M16 8v13"/><path d="M4 8l1-2 1 2M18 8l1-2 1 2M10 8l2-3 2 3"/>'],
 ["S17","Structural Steelwork",'<path d="M4 4h16v3h-6v10h6v3H4v-3h6V7H4z"/>'],
 ["S18","Horticultural Works",'<path d="M7.5 14h9l-1.5 7h-6z"/><path d="M12 14V9"/><path d="M12 10.5C9 10.5 7.5 8.5 7.5 6c3 0 4.5 2 4.5 4.5zM12 9c0-2.5 1.5-4.5 4.5-4.5 0 2.5-1.5 4.5-4.5 4.5z"/>'],
 ["S19","Arboricultural Works",'<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9 21h6M12 12l-2-2M12 13l2.5-2.5"/>'],
 ["S20","Skyrise Greenery Works",'<path d="M6 21V10h12v11"/><path d="M6 14h12M6 18h12M10 10v11M14 10v11"/><path d="M8 10c0-3 2-5 4-5 0 3-2 5-4 5zM16 10c0-3-2-5-4-5"/>'],
 ["S21","Truss-out Scaffolding",'<path d="M4 3v18"/><path d="M4 12h13M4 18l9-6"/><path d="M8 12V5M12 12V5M16 12V5M4 5h12"/><path d="M4 8.5h12"/>'],
 ["S22","Site Lifting Operations",'<path d="M12 2v6"/><path d="M12 8a2 2 0 1 0 2 2"/><path d="M12 11l-5 3M12 11l5 3"/><path d="M5 14h14v6H5z"/>']
];
const tradeTone=["#8a5ba6","#d9472d","#3e8a3d","#c99a1e","#4b72b6"],tradeTint=["#f0e9f6","#fbe8e3","#e6f2e5","#fcf3d9","#e6edf8"];
const tradesSection=()=>`
 <section class="wrap section home-trades" aria-labelledby="trades-title"><i class="deco id-lines id-tr" aria-hidden="true"></i>
  <div class="trades-head">
   <div><div class="eyebrow">Registered Specialist Trade Contractors</div><h2 id="trades-title">22 designated trades</h2></div>
   ${cta("View trade requirements",source+"reg_index.aspx","text")}
  </div>
  <ul class="trades">${TRADES.map(([c,n,p],k)=>'<li><a href="'+source+'reg_index.aspx" style="--tone:'+tradeTone[k%5]+';--tint:'+tradeTint[k%5]+'"><span class="trade-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg></span><span class="trade-code">'+c+'</span><span class="trade-name">'+n+'</span></a></li>').join("")}</ul>
 </section>`;
const home = () => `
 <section class="hero">
  <div class="hero-visual">
   ${theme==="a"?'<img src="assets/hero-bridge-survey.webp" alt="">':`<div class="hero-artwork" id="heroArtwork">
    <img class="illustration-fallback" src="assets/construction-scene-1.svg" width="3415" height="2500" alt="">
    <div class="illustration-player" aria-hidden="true"></div>
   </div>`}
  </div>

  <div class="wrap hero-in">
   <div class="hero-text">
    <div class="scheme-eyebrow">Registered Specialist Trade Contractors Scheme</div>
    <h1>Raising the standard of specialist trades</h1>
    <p>Search the public registers, or find out how to register your company under the Scheme.</p>
    ${theme==="a"?'<a class="hero-scroll" href="#about-the-scheme">Explore the Scheme '+i("chev")+'</a>':""}
   </div>
  </div>
 </section>
 <section class="wrap finder-wrap" ${theme==="a"?'aria-labelledby="finder-title"':'aria-label="Find a registered contractor"'}><i class="deco id-triangle" aria-hidden="true"></i>
  <form class="finder" action="index.html">
   <input type="hidden" name="view" value="register"><input type="hidden" name="theme" value="${theme}">
   ${theme==="a"?'<div class="finder-head"><h2 id="finder-title">Find a registered contractor</h2></div>':""}
   <label>Company or registration no.<input name="q" placeholder="e.g. DEMO–001"></label>
   <label>Register<select name="register"><option value="">Specialist Trade Contractors</option><option value="rs">Sub-contractors</option></select></label>
   <label>Designated trade<select name="trade"><option value="">All trades</option><option>Structural steelwork</option><option>Truss-out scaffolding</option><option>Site lifting operations</option></select></label>
   <button class="btn">${i("search")} Search</button>
  </form>
 </section>
 <section class="wrap section home-news" aria-labelledby="updates-title"><i class="deco id-lines-large id-news" aria-hidden="true"></i>
  <h2 id="updates-title">What’s New</h2>
  ${updateFilters()}
  <div id="feed">${feed()}</div>
  <div class="centred-link">${cta("Read More",url("updates"),"text")}</div>
 </section>
 <section class="scheme-overview"><i class="deco id-band" aria-hidden="true"></i><i class="deco id-sliver id-ov-s" aria-hidden="true"></i>
  <div class="wrap overview-in">
   <div class="overview-copy" id="about-the-scheme">
    <div class="eyebrow">About the Scheme</div>
    <h2>Every specialist trade.<br>One trusted register.</h2>
    <p>The Scheme sets registration requirements for specialist trade contractors and sub-contractors in Hong Kong. It covers civil, building, electrical and mechanical trades, and includes repair and maintenance work.</p>
    <div class="overview-stats">
     <div class="overview-stat"><strong>22</strong><span>Designated trades</span></div>
     <div class="overview-stat"><strong>6</strong><span>Core elements for registration</span></div>
    </div>
   </div>
   ${theme==="b"?
    '<div class="overview-graphics" aria-hidden="true"><img src="assets/about-harbour.webp" alt="" loading="lazy"><div class="scheme-graphic"></div></div>':
    `<div class="collage" aria-hidden="true">
    <i class="pent-back pent-back-solid"></i><i class="pent-back pent-back-outline pent-back-left"></i><i class="pent-back pent-back-outline pent-back-bottom"></i>
    <div class="pent-photo p1"><img src="assets/about-harbour.webp" alt=""></div>
    <div class="pent-photo p2"><img src="assets/about-workers.jpg" alt=""></div>
    <div class="pent-photo p3"><img src="assets/about-cic-sign.jpg" alt=""></div>
   </div>`}
  </div>
 </section>
 ${tradesSection()}
 <section class="wrap section home-milestones" aria-labelledby="ms-title"><i class="deco id-cmark id-ms" aria-hidden="true"></i>
  <div class="ms-teaser">
   <div><div class="eyebrow">Milestones</div><h2 id="ms-title">From one register to 22 designated trades</h2></div>
   <p class="ms-intro">The first subcontractor registration scheme began in 2003. Follow how registration evolved as new specialist trades were added.</p>
  </div>
  <ol class="track mini">${milestones.map((m,n)=>'<li><a href="'+url("milestones",theme,"&step="+(theme==="a"?[0,3,5,8,9,10][n]:n))+'"><span class="node" style="--c:'+P[n%P.length]+'"></span><b>'+m.y+'</b><span>'+m.t+'</span></a></li>').join("")}</ol>
  <div class="centred-link">${cta("Explore the milestones",url("milestones"),"text")}</div>
 </section>
 <section class="wrap section home-services" aria-labelledby="services-title"><i class="deco id-ring id-sv" aria-hidden="true"></i><i class="deco id-lines id-sv-l" aria-hidden="true"></i>
  <h2 id="services-title" class="visually-hidden">Registration and Registers</h2>
  <div class="service-panels">
   <article class="service-panel dark">
    <div class="eyebrow">Registers</div>
    <h3>Find a contractor</h3>
    <p>Search by trade or company name and check registration details and markings.</p>
    ${link("Register of Specialist Trade Contractors "+i("arrow"),url("register"))}
    ${link("Register of Sub-contractors "+i("arrow"),url("register",theme,"&register=rs"))}
   </article>
   <article class="service-panel">
    <div class="eyebrow">Registration</div>
    <h3>Join the Scheme</h3>
    <p>Check your trade’s requirements and prepare your application.</p>
    ${link("Specialist Trade Contractors "+i("arrow"),url("apply"))}
    ${link("Registered Sub-contractors "+i("arrow"),url("apply",theme,"&route=rs"))}
   </article>
  </div>
 </section>`;

/* MILESTONES ------------------------------------------------------ */
const aboutItems=()=>[["Chairperson’s Message",source+"about.aspx"],["Milestones",url("milestones"),page==="milestones"],["Objectives",source+"about.aspx#objectives"],["Benefits of Registration",source+"about.aspx#benefits"],["Core Elements for Registration",source+"about.aspx#core"],
 {group:"Regulatory Actions",items:[["Overview",source+"notice.aspx"],["Notices",source+"notice.aspx"]]},{group:"Publications",items:[["Good Practice Manuals",source+"ebook_list.aspx"]]}];
const stageSvg=()=>{
 const yrs=vtx(212).map((p,k)=>'<text class="vlabel vl'+k+'" x="'+f1(p[0])+'" y="'+f1(p[1]+(k===0?-6:k===1||k===4?6:24))+'" text-anchor="'+(k===1?"start":k===4?"end":"middle")+'">'+milestones[k].y+'</text>').join("");
 return '<svg class="stage-svg" viewBox="-238 -232 476 464" aria-hidden="true">'
 +[60,110,205].map(R=>'<polygon points="'+polyPts(R)+'" fill="none" stroke="#799db2" stroke-opacity=".36"/>').join("")
 +vtx(205).map(p=>'<path d="M0 0L'+f1(p[0])+' '+f1(p[1])+'" stroke="#799db2" stroke-opacity=".38" stroke-dasharray="3 5"/>').join("")
 +'<g class="ghost">'+ring({R:150,w:34,knob:32,id:"sg",bow:.9,mono:"#b4cdd6"})+'</g>'
 +ring({R:150,w:34,knob:32,id:"st",bow:.9})+yrs
 +'<text class="c-year" x="0" y="14" text-anchor="middle"></text><text class="c-sub" x="0" y="42" text-anchor="middle">RSTCS</text></svg>';
};
const milestone=()=>band("About the Scheme / Milestones","Milestones","Since 2003, trade registration has grown step by step into today’s Scheme. Each step completes another side of the RSTCS pentagon.")
 +'<div class="wrap layout"><div class="content-card">'
 +'<div class="stage" id="stage"><div class="stage-copy"><div class="micro" id="stepNo"></div><div class="stage-year" id="stYear"></div><div class="stage-stories">'
 +milestones.map(m=>'<section class="stage-story" aria-hidden="true"><h2>'+m.t+'</h2><p>'+m.d+'</p><div class="stage-stat"><strong>'+m.n+'</strong><span>'+m.u+'</span></div></section>').join("")
 +'</div><span class="visually-hidden" id="stageStatus" aria-live="polite"></span>'
 +'<div class="stage-ctrl"><button type="button" class="round" id="prev" aria-label="Previous milestone">'+i("left")+'</button><button type="button" class="round" id="next" aria-label="Next milestone">'+i("arrow")+'</button><button type="button" class="link-btn light" id="play"></button></div></div>'
 +'<div class="stage-visual">'+stageSvg()+'</div></div>'
 +'<div class="history"><h3>Chronology</h3><ol class="chrono">'+milestones.map((m,n)=>'<li data-chrono="'+n+'"><span class="node" style="--c:'+P[n%P.length]+'"></span><b>'+m.y+'</b><div><h4>'+m.t+'</h4><p>'+m.d+'</p></div></li>').join("")+'</ol></div></div>'
 +rail("About the Scheme",aboutItems())+'</div>';

/* REGISTER -------------------------------------------------------- */
const logos={
 steel:'<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#0f3d5c"/><path d="M20 24h40M20 56h40M40 24v32" stroke="#fff" stroke-width="7"/><text x="40" y="74" fill="#9fd3ff" font-size="8" text-anchor="middle" font-family="Fira Sans,Arial" font-weight="700" letter-spacing="1">SAMPLE</text></svg>',
 scaffold:'<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#fff4e6"/><path d="M18 64V16m22 48V16m22 48V16M14 28h52M14 46h52M18 28l22 18m0-18 22 18" stroke="#d26a12" stroke-width="3.5" fill="none"/></svg>',
 build:'<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#e9f3ec"/><path d="M14 40 40 18l26 22M22 34v28h36V34" stroke="#2f7a45" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="40" cy="47" r="7" fill="#2f7a45"/></svg>'
};
const demo=[
 {name:"Sample Steelworks Ltd",id:"DEMO–001",trade:"Structural steelwork",code:"S-sample 01",status:"Active",valid:"31.12.2028",logo:"steel",marks:["excellent","robot"],score:[90,78,72,86,82,93]},
 {name:"Sample Scaffolding Engineering Ltd",id:"DEMO–002",trade:"Truss-out scaffolding",code:"S-sample 21",status:"Active",valid:"30.06.2027",logo:"scaffold",marks:["substandard"],score:[59,75,68,74,62,71]},
 {name:"Sample Building Services Co.",id:"DEMO–003",trade:"Building maintenance",code:"RS sample",status:"Active",valid:"31.03.2028",logo:"build",marks:["robot"],score:[78,80,67,71,88,83],rs:true}
];
const avg=[72,74,70,73,72,76];
const axes=["Safety","Management","Finance","Job reference","Execution","Integrity"];
const markInfo={
 excellent:["Excellent marking","Top performance in the latest review"],
 robot:["Robotic symbol","Adopts robotics or automation on site"],
 substandard:["Substandard marking","Performance under review"]
};
let badgeId=0;
function badge(value,small=false){
 const id="bd"+(badgeId++);
 const icon=value==="substandard"
  ?'<svg class="badge-ico" viewBox="-128 -128 256 256" aria-hidden="true"><path d="M0 -104 112 92H-112Z" fill="#f4b223" stroke="#8a5300" stroke-width="10" stroke-linejoin="round"/><path d="M0 -36v64m0 34v2" stroke="#3a2600" stroke-width="20" stroke-linecap="round"/></svg>'
  :'<svg class="badge-ico" viewBox="-128 -128 256 256" aria-hidden="true">'+ring({id,mono:value==="robot"?"#2f69b3":""})+'<g transform="translate(-58 -58) scale(4.85)" fill="none" stroke="'+(value==="robot"?"#2f69b3":"#2e7d32")+'" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">'+icons[value==="robot"?"robot":"star"]+'</g></svg>';
 const [t,d]=markInfo[value];
 return '<span class="mark-badge '+value+(small?" small":"")+'">'+icon+'<span><strong>'+t+'</strong>'+(small?"":"<small>"+d+"</small>")+'</span></span>';
}
function radar(scores){
 const pt=(n,scale)=>[110+scale*82*Math.sin(n*Math.PI/3),100-scale*82*Math.cos(n*Math.PI/3)].map(f1).join(",");
 const poly=(r)=>axes.map((_,n)=>pt(n,r)).join(" ");
 const lab=axes.map((a,n)=>{const [x,y]=pt(n,1.22).split(",").map(Number);return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="'+(x>115?"start":x<105?"end":"middle")+'">'+a+'</text>'}).join("");
 return '<div class="radar"><svg viewBox="-48 0 316 205" role="img" aria-label="Spider diagram of the six registration elements">'
  +[.25,.5,.75,1].map(r=>'<polygon points="'+poly(r)+'" fill="'+(r===1?"#f3f8f7":"none")+'" stroke="#c2d6d2"/>').join("")
  +axes.map((_,n)=>'<path d="M110 100 '+pt(n,1)+'" stroke="#c2d6d2"/>').join("")
  +'<polygon points="'+avg.map((v,n)=>pt(n,v/100)).join(" ")+'" fill="none" stroke="#7b8a88" stroke-dasharray="4 3" stroke-width="1.4"/>'
  +'<polygon class="score" points="'+scores.map((v,n)=>pt(n,v/100)).join(" ")+'" fill="#00857a" fill-opacity=".28" stroke="#00857a" stroke-width="2.5" stroke-linejoin="round"/>'
  +scores.map((v,n)=>'<circle cx="'+pt(n,v/100).split(",")[0]+'" cy="'+pt(n,v/100).split(",")[1]+'" r="3.5" fill="#fff" stroke="#00857a" stroke-width="2"/>').join("")
  +lab+'</svg><dl class="scorelist">'+axes.map((a,n)=>'<div><dt>'+a+'</dt><dd>'+scores[n]+'</dd></div>').join("")+'</dl><p class="radar-key"><i></i>This company <i class="avg"></i>Trade average</p></div>';
}
const profile=(o)=>'<article class="profile">'
 +'<header class="profile-head"><div class="company-logo" role="img" aria-label="Fictional company logo">'+logos[o.logo]+'</div>'
 +'<div class="profile-id"><h2>'+o.name+'</h2><p>'+o.id+' · '+o.trade+'</p><span class="status-pill">'+o.status+'</span></div></header>'
 +(o.marks.length?'<div class="markings">'+o.marks.map(m=>badge(m)).join("")+'</div>':"")
 +'<div class="profile-grid"><div><h3>Registration particulars</h3><dl class="particulars">'
 +'<div><dt>Register</dt><dd>'+(o.rs?"Registered Sub-contractor":"Registered Specialist Trade Contractor")+'</dd></div>'
 +'<div><dt>Designated trade</dt><dd>'+o.trade+'</dd></div><div><dt>Registration no.</dt><dd>'+o.id+'</dd></div><div><dt>Valid until</dt><dd>'+o.valid+'</dd></div></dl>'
 +'<details class="showcase"><summary>Project showcase &amp; company links</summary><div class="thumbs">'+["site-team.jpg","lifting.jpg","workshop.jpeg"].map(a=>'<img src="assets/'+a+'" alt="">').join("")+'</div><p class="notes">Example project media and company website appear in the full profile when supplied.</p></details></div>'
 +'<div><h3>Registration elements</h3>'+radar(o.score)+'</div></div></article>';
const reg=()=>{const isRS=params.get("register")==="rs";
 const legend='<div class="rail-box" id="legend"><strong>Markings explained</strong>'+["robot","excellent","substandard"].map(m=>badge(m)).join("")+'<p class="notes">Illustrative marks for the tender mock-up.</p></div>';
 const backdrop=hasRegisterBackdrop?`<div class="register-background" aria-hidden="true">
  ${titleGeometry}
  <i class="register-triangle register-triangle-gold"></i>
  <i class="register-triangle register-triangle-purple"></i>
  <i class="register-triangle register-triangle-blue"></i>
 </div>`:"";
 return backdrop+band("Registers / "+(isRS?"Sub-contractors":"Specialist Trade Contractors"),isRS?"Register of Sub-contractors":"Register of Specialist Trade Contractors","Find a company by name, registration number or designated trade.")
 +'<div class="wrap layout"><div><form class="filters" id="filters"><label>Company or registration no.<input name="search" placeholder="e.g. DEMO–001"></label><label>Designated trade<select name="trade"><option value="">All trades</option>'+["Structural steelwork","Truss-out scaffolding","Building maintenance"].map(t=>'<option>'+t+'</option>').join("")+'</select></label><label>Marking<select name="mark"><option value="">All markings</option><option value="excellent">Excellent marking</option><option value="robot">Robotic symbol</option><option value="substandard">Substandard marking</option></select></label><button class="btn">'+i("search")+' Search</button></form>'
 +'<div class="result-bar"><span id="regCount" role="status"></span><button type="button" class="link-btn" id="maintenance" aria-pressed="false">Show maintenance state</button></div><div id="results"></div><p class="notes">Fictional records and illustrative marks. Do not use this prototype to verify a company.</p></div>'
 +rail("Registers",[{group:"Public Registers",open:true,items:[["Specialist Trade Contractors",url("register"),!isRS],["Registered Sub-contractors",url("register",theme,"&register=rs"),isRS]]},["How to Register",url("apply")],["Regulatory Actions",source+"notice.aspx"]],legend)+'</div>'};

/* OTHER VIEWS ----------------------------------------------------- */
const apply=()=>{const rs=params.get("route")==="rs";return band("Registration / "+(rs?"RS":"RSTC"),rs?"Apply as a Registered Sub-contractor":"Apply as a Registered Specialist Trade Contractor","Check the requirements for your trade before opening the application service.")+'<div class="wrap layout"><div class="content-card"><h2>Application guidance</h2><p>Choose the registration route that matches your company’s trade.</p><div class="guide-box"><h3>1. Check your trade requirements</h3><p>Review eligibility, company information and personnel requirements for each trade.</p>'+cta("View official trade guidance",source+(rs?"reg_subcontract.aspx":"reg_index.aspx"),"ghost","external")+'</div><div class="guide-box"><h3>2. Prepare documents and apply</h3><p>See the approved tutorials, Rules and Procedures and links to the current application service.</p>'+cta("Open official application guidance",source+(rs?"reg_subcontract.aspx":"reg_index.aspx#content102"),"","external")+'</div></div>'+rail("Registration",[{group:"Application Routes",open:true,items:[["Apply as RSTC",url("apply"),!rs],["Apply as RS",url("apply",theme,"&route=rs"),rs]]},["Search the Registers",url("register")]])+'</div>'};
const news = () => {
 const event = updates.find(item => item.id === params.get("item"));
 const menu = [["All Updates",url("updates"),!event],["Events &amp; Courses",source+"events.aspx#courses"],["Industry News",source+"events.aspx#news"]];
 if (!event) return band("News &amp; Events","News &amp; Events","Scheme updates, training and industry events.")
  + '<div class="wrap layout updates-layout"><div>'+updateFilters()+'<div id="feed">'+feed()+'</div></div>'+rail("News & Events",menu)+'</div>';
 const details = '<a class="back-btn" href="'+url("updates")+'">'+i("left")+' Back to News &amp; Events</a><div class="rail-box"><strong>'+event.type+' Details</strong><p>'+i("calendar")+' '+event.date+'<br>'+event.tag+'</p>'+link("Original listing "+i("external"),event.href)+'</div>';
 const related = '<div class="rail-related"><strong>More News &amp; Events</strong>'+updates.filter(item => item !== event).map(item => '<a href="'+url("updates",theme,"&item="+item.id)+'"><small>'+item.date+' | '+item.type+'</small>'+item.title+'</a>').join("")+'</div>';
 return band("News &amp; Events",event.title,event.date+"  |  "+event.tag)
  + '<div class="wrap layout"><article class="update-article"><p>'+event.desc+'</p><img src="assets/'+event.asset+'" alt="" class="event-cover">'+cta("View the original listing",event.href,"text","external")+'</article><aside class="rail">'+details+related+'</aside></div>';
};
const styles=()=>band("Design directions","Two milestone options","Same CIC-family site for both options; they differ in how the Milestones page is told and animated.")+'<div class="wrap styles-grid">'+[
 ["a","A / Building milestones","A tower rises on site, one storey per designated trade","#00857a","#0a4f60","#eef3f2","#ffffff"],
 ["b","B / Pentagon milestones","The Scheme mark assembles one side per milestone","#0d2538","#a8e9d2","#f3f5f6","#ffffff"]
 ].map(([key,name,copy,...colors])=>'<article class="stylecard">'+(key==="a"?'<img src="assets/construction-site.svg" alt="" style="object-fit:contain;background:#fff">':'<img src="assets/hero-skyline.jpg" alt="">')+'<h2>'+name+'</h2><p>'+copy+'</p><div class="swatches">'+colors.map(hex=>'<span class="swatch"><i style="background:'+hex+'"></i>'+hex+'</span>').join("")+'</div><div class="swatches">'+P.map(hex=>'<span class="swatch"><i style="background:'+hex+'"></i>'+hex+'</span>').join("")+'</div><p><strong>Typography:</strong> Fira Sans, as used on CIC’s English site. <strong>Scheme layer:</strong> the five RSTCS colours and pentagon geometry, used for backgrounds, markers and the milestone animation.</p><p class="tile-row">'+mark(28,"sw"+key)+' '+badge("excellent",true)+' '+badge("robot",true)+' '+badge("substandard",true)+'</p>'+cta("Open milestones",url("milestones",key))+'</article>').join("")+'</div>';


/* OPTION B · MILESTONES: a building rises on site with each milestone, from site formation in 2003
   to a finished tower in 2026 (one storey per designated trade). Scroll drives the build. */
const journey=[
 {y:"2003",t:"Launch of the Voluntary Subcontractor Registration Scheme (VSRS)",d:"Following the “Construct for Excellence” report, the Provisional Construction Industry Co-ordination Board set up VSRS to build a pool of capable, responsible subcontractors with specialised skills.",n:"VSRS",u:"voluntary register launched",x:910,py:3178},
 {y:"2009",t:"CIC operates VSRS",d:"CIC took over and reviewed the operation of VSRS, to keep improving the performance of subcontractors in the construction industry.",n:"CIC",u:"takes over the scheme",x:1064,py:2912},
 {y:"2013",t:"Renamed the Subcontractor Registration Scheme (SRS)",d:"The new name reflected a broader scope, including start-up companies, and stronger registration requirements.",n:"SRS",u:"wider scope",x:868,py:2604},
 {y:"2019",t:"Registered Specialist Trade Contractors Scheme established",d:"RSTCS raised the registration requirements of seven designated trades in safety, management, job experience, execution and finance.",n:"7",u:"designated trades",x:1106,py:2310},
 {y:"2020",t:"Tender limits on public works subcontracts",d:"Development Bureau and Housing Authority apply tender limits to subcontracts of the seven designated trades from 1 October 2020.",n:"7",u:"trades with tender limits",x:868,py:1988},
 {y:"2021",t:"Eighth designated trade, and Integrity Management",d:"Plastering became the eighth designated trade. Integrity Management was added as the sixth core element for registration.",n:"8",u:"designated trades",x:1092,py:1680},
 {y:"2022",t:"Ninth to eleventh designated trades",d:"Suspended Ceiling, Tower Crane (Erecting, Dismantling and Altering Height) and Building Drainage Installation were added.",n:"11",u:"designated trades",x:854,py:1372},
 {y:"2023",t:"Twelfth to fourteenth designated trades",d:"Levelling & Setting Out, Building Maintenance and Interior Fitting-out were added, and requirements for the first eight trades were enhanced.",n:"14",u:"designated trades",x:1078,py:1064},
 {y:"2024",t:"Fifteenth to twentieth designated trades",d:"Painting, Metal Work, Structural Steelwork, Horticultural Works, Arboricultural Works and Skyrise Greenery Works were added from 1 May 2024.",n:"20",u:"designated trades",x:854,py:728},
 {y:"2025",t:"Truss-out Scaffolding, and the Metal Brackets Exchange Programme",d:"Truss-out Scaffolding became the twenty-first designated trade. From October 2025 CIC runs a metal brackets exchange programme to raise safety standards.",n:"21",u:"designated trades",x:1064,py:560},
 {y:"2026",t:"Site Lifting Operations",d:"Site Lifting Operations becomes the twenty-second designated trade, as the Scheme keeps raising the professionalism of subcontractors.",n:"22",u:"designated trades today",x:1036,py:330}
];
const milestoneB=()=>""
 +'<section class="journey" id="journey" style="--n:'+journey.length+'" aria-label="Milestones journey">'
 +'<div class="journey-sticky"><i class="deco id-lines-large id-jr" aria-hidden="true"></i><i class="deco id-sliver id-jr-s" aria-hidden="true"></i><div class="wrap journey-head"><nav class="crumb" aria-label="Breadcrumb">'+link("Home",url("home"))+' <span aria-hidden="true">/</span> <span>About the Scheme</span> <span aria-hidden="true">/</span> <span aria-current="page">Milestones</span></nav>'
 +'<div class="page-title"><h1>Milestones</h1><button type="button" class="share" id="share" aria-label="Copy link to this page">'+i("share")+'</button></div><span class="share-status notes" id="shareStatus" role="status"></span></div>'
 +'<div class="wrap journey-in">'
 +'<div class="journey-copy"><span class="visually-hidden" id="jStep"></span>'
 +'<div class="journey-year" aria-hidden="true">'+[0,1,2,3].map(()=>'<span class="odo"><span class="odo-strip">'+"0123456789".split("").map(d=>'<b>'+d+'</b>').join("")+'</span></span>').join("")+'</div>'
 +'<div class="stage-stat"><strong id="jNum"></strong><span id="jUnit"></span></div>'
 +'<span class="jc-bar" aria-hidden="true"><i id="jBar"></i></span>'
 +'<div id="jYear" class="visually-hidden"></div>'
 +'<div class="jc-body" id="jBody" aria-live="polite"><div class="jc-text"><h2></h2><p></p></div><div class="jc-text"><h2></h2><p></p></div></div>'
 +'<div class="journey-controls"><label class="journey-picker">Milestone year<select id="journeyYear">'
 +journey.map((milestone,index)=>'<option value="'+index+'">'+milestone.y+'</option>').join("")
 +'</select></label><a class="btn text" href="#journey-chronology">Full chronology '+i("chev")+'</a></div>'
 +'</div>'
 +'<div class="journey-view" id="jView"><div class="rise-scene" id="jScene"><img class="journey-fallback" src="assets/construction-site.svg" alt=""></div></div>'
 +'<ol class="journey-years" aria-label="Jump to a year">'+journey.slice().reverse().map(m=>'<li><button type="button" data-jump="'+journey.indexOf(m)+'">'+m.y+'</button></li>').join("")+'</ol>'
 +'</div></div></section>'
 +'<div class="wrap layout"><div class="content-card"><div class="history" style="margin-top:0"><h3 id="journey-chronology">Chronology</h3><ol class="chrono">'
 +journey.slice().reverse().map(m=>'<li style="--c:var(--teal)"><span class="node"></span><b>'+m.y+'</b><div><h4>'+m.t+'</h4><p>'+m.d+'</p></div></li>').join("")
 +'</ol><p class="notes">Illustration: isometric construction site from Magnific, with the rising tower, facade and motion built in code for this proposal. Text summarised from the '+link("current RSTCS website",source+"about.aspx#milestone")+'.</p></div></div>'
 +rail("About the Scheme",aboutItems())+'</div>';

/* ---------- render ---------- */
const templates={home,milestones:theme==="a"?milestoneB:milestone,register:reg,apply,updates:news,styles};
/* sticky header: compacts once the page scrolls */
/* The Option A milestones stage uses the compact header from the start. */
if(page==="milestones"&&theme==="a")document.body.dataset.pin="1";
const syncHead=()=>document.body.classList.toggle("scrolled",scrollY>24||document.body.dataset.pin==="1");addEventListener("scroll",syncHead,{passive:true});
document.getElementById("app").innerHTML=header()+'<main id="main" tabindex="-1">'+templates[page]()+'</main>'+footer;syncHead();

/* ---------- Option B homepage illustration sequence ---------- */
if(theme==="b"&&page==="home"&&!motionPreference.matches){
 const artwork=document.getElementById("heroArtwork");
 const player=artwork.querySelector(".illustration-player");

 async function loadScene(number){
  const src="assets/construction-scene-"+number+".svg";
  const image=new Image();
  image.src=src;
  image.alt="";
  await image.decode();
  const frame=document.createElement("div");
  frame.className="illustration-frame";
  frame.append(image);
  return frame;
 }

 Promise.all([1,2,3,4].map(loadScene)).then(scenes=>{
  let current=0;
  let visible=true;

  function updatePlayback(){
   artwork.dataset.paused=String(!visible||document.hidden||motionPreference.matches);
  }

  scenes.forEach(frame=>frame.addEventListener("animationend",event=>{
   if(event.target!==frame)return;
   if(event.animationName==="illustration-fade-out"){
    frame.remove();
    delete frame.dataset.outgoing;
    return;
   }
   if(event.animationName!=="illustration-fade-in")return;
   frame.dataset.outgoing="";
   delete frame.dataset.first;
   current=(current+1)%scenes.length;
   player.append(scenes[current]);
  }));
  document.addEventListener("visibilitychange",updatePlayback);
  motionPreference.addEventListener("change",updatePlayback);
  if("IntersectionObserver" in window){
   new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    updatePlayback();
   },{threshold:.15}).observe(artwork);
  }
  updatePlayback();
  scenes[0].dataset.first="";
  player.append(scenes[0]);
  artwork.dataset.ready="true";
 }).catch(()=>{}); // The first illustration remains visible when the animation cannot load.
}

/* ---------- mega menu ---------- */
const panel=document.getElementById("navPanel"), nav=document.getElementById("nav"), hamb=document.getElementById("hamb");
let currentMenu="", opener=null;
function close(){panel.hidden=true;panel.innerHTML="";currentMenu="";opener?.setAttribute("aria-expanded","false");opener=null}
function openMenu(type,el){
 if(currentMenu===type){close();return}
 close();currentMenu=type;opener=el;el.setAttribute("aria-expanded","true");
 if(type==="search"){
  panel.innerHTML='<form class="wrap search-panel" id="siteSearch"><label for="siteQ">Search this prototype</label><input id="siteQ" placeholder="Try register, milestones or events" required><button class="btn primary">Search '+i("search")+'</button><span id="searchResponse" role="status"></span></form>';
  panel.hidden=false;document.getElementById("siteQ").focus();
  document.getElementById("siteSearch").addEventListener("submit",e=>{e.preventDefault();const s=document.getElementById("siteQ").value.toLowerCase();const target=/milestone|history|scheme/.test(s)?"milestones":/apply|registration|application/.test(s)?"apply":/register|contractor/.test(s)?"register":/event|news|course/.test(s)?"updates":null;if(target)location.href=url(target);else document.getElementById("searchResponse").textContent="No matching prototype page.";});
 }else{
  const m=menus[type];
  panel.innerHTML='<div class="wrap mega"><div class="mega-intro"><h2>'+m.title+'</h2><p>'+m.desc+'</p>'+(m.learn?'<a class="learn" href="'+m.learn+'">Learn more</a>':"")+(m.img?'<figure><img src="assets/'+m.img+'" alt=""><figcaption>'+m.caption+'</figcaption></figure>':"")+'</div>'
   +'<div class="mega-main">'+m.main.map(([t,h])=>link(t,h)).join("")+'</div>'
   +'<div class="mega-groups">'+m.groups.map(([g,ls])=>'<h3>'+g+'</h3><ul>'+ls.map(([t,h])=>'<li>'+link(t,h)+'</li>').join("")+'</ul>').join("")+'</div></div>';
  panel.hidden=false;
 }
 const r=el.getBoundingClientRect();panel.style.setProperty("--caret",(r.left+r.width/2)+"px");
 if(matchMedia("(max-width:980px)").matches){nav.classList.remove("open");hamb.setAttribute("aria-expanded","false");panel.querySelector("a")?.focus()}
}
document.querySelectorAll("[data-menu]").forEach(el=>el.addEventListener("click",()=>openMenu(el.dataset.menu,el)));
document.getElementById("language").addEventListener("click",e=>openMenu("language",e.currentTarget));
document.getElementById("quickLinks").addEventListener("click",e=>openMenu("quick",e.currentTarget));
document.getElementById("share")?.addEventListener("click", async () => {
 const status = document.getElementById("shareStatus");
 try { await navigator.clipboard.writeText(location.href); status.textContent = "Page link copied."; }
 catch { status.textContent = "Copy the page link from the browser’s address bar."; }
});
hamb.addEventListener("click",()=>{close();const isOpen=nav.classList.toggle("open");hamb.setAttribute("aria-expanded",String(isOpen));});
document.addEventListener("pointerdown",e=>{if(currentMenu&&!e.target.closest(".sitehead"))close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const focused=opener;close();const open=nav.classList.contains("open");nav.classList.remove("open");hamb.setAttribute("aria-expanded","false");if(focused&&!focused.getClientRects().length)hamb.focus();else if(focused)focused.focus();else if(open)hamb.focus();}});
document.getElementById("mono")?.addEventListener("click",e=>{const on=document.body.classList.toggle("gray");e.currentTarget.setAttribute("aria-pressed",String(on))});
const compact=matchMedia("(max-width:650px)");
const railEl=document.getElementById("sectionRail");
if(railEl){railEl.open=!compact.matches;compact.addEventListener("change",()=>railEl.open=!compact.matches)}

/* ---------- milestones: the pentagon assembles one side per milestone ---------- */
if(page==="milestones"&&theme==="b"){
 const stage=document.getElementById("stage");
 const svg=stage.querySelector(".stage-svg");
 const stories=stage.querySelectorAll(".stage-story");
 const segments=svg.querySelectorAll(":scope > .ring .seg");
 const knots=svg.querySelectorAll(":scope > .ring .knot");
 const labels=svg.querySelectorAll(".vlabel");
 const chronology=document.querySelectorAll("[data-chrono]");
 const prev=document.getElementById("prev");
 const next=document.getElementById("next");
 const playBtn=document.getElementById("play");
 const last=milestones.length-1;
 let step=Math.min(last,Math.max(0,parseInt(params.get("step"),10)||0));
 let timer=null;
 let startTimer=null;
 let autoPending=!params.has("step")&&!motionPreference.matches;
 let stageVisible=!("IntersectionObserver" in window);

 function paint(index){
  step=index;
  const milestone=milestones[step];
  document.getElementById("stepNo").textContent="Milestone "+(step+1)+" of "+milestones.length;
  document.getElementById("stYear").textContent=milestone.y;
  document.getElementById("stageStatus").textContent=milestone.y+" · "+milestone.t;
  svg.querySelector(".c-year").textContent=milestone.y;
  stories.forEach((story,k)=>story.setAttribute("aria-hidden",String(k!==step)));
  segments.forEach((segment,k)=>segment.classList.toggle("on",k<step));
  knots.forEach((knot,k)=>knot.classList.toggle("on",k<=step));
  labels.forEach((label,k)=>{
   label.classList.toggle("on",k<=step);
   label.classList.toggle("now",k===step);
  });
  chronology.forEach((entry,k)=>entry.classList.toggle("now",k===step));
  prev.disabled=step===0;
  next.disabled=step===last;
 }

 function setPlaying(playing){
  playBtn.innerHTML=playing?i("pause")+" Pause":i("play")+" Play the story";
  playBtn.setAttribute("aria-pressed",String(playing));
 }

 function stop(){
  clearTimeout(startTimer);
  clearInterval(timer);
  startTimer=null;
  timer=null;
  setPlaying(false);
 }

 function advance(){
  paint(step+1);
  if(step===last)stop();
 }

 function play(){
  setPlaying(true);
  timer=setInterval(advance,3600);
 }

 function syncAutoplay(){
  if(document.hidden||!stageVisible||motionPreference.matches){
   stop();
   return;
  }
  if(!autoPending||startTimer!==null)return;
  startTimer=setTimeout(()=>{
   startTimer=null;
   autoPending=false;
   play();
   advance();
  },1000);
 }

 function select(index){
  autoPending=false;
  stop();
  paint(index);
 }

 playBtn.addEventListener("click",()=>{
  autoPending=false;
  const wasPlaying=timer!==null;
  stop();
  if(wasPlaying)return;
  if(step===last)paint(0);
  play();
 });
 prev.addEventListener("click",()=>select(step-1));
 next.addEventListener("click",()=>select(step+1));
 document.addEventListener("visibilitychange",syncAutoplay);
 motionPreference.addEventListener("change",syncAutoplay);
 if("IntersectionObserver" in window){
  new IntersectionObserver(([entry])=>{
   stageVisible=entry.isIntersecting;
   syncAutoplay();
  }).observe(stage);
 }

 setPlaying(false);
 paint(step);
 syncAutoplay();
}


/* ---------- Option A milestones: the building rises through the chronology ----------
   The stock site SVG is split once into parts (site, ground floor, one repeatable floor, roof, crane, facade…),
   each rendered as an image. Steps then only move or reveal those images, so the motion stays smooth. */
if(page==="milestones"&&theme==="a"){
 const sec=document.getElementById("journey"),view=document.getElementById("jView"),scene=document.getElementById("jScene");
 const N=journey.length;
 const sticky=document.querySelector(".journey-sticky");
 const yearPicker=document.getElementById("journeyYear");
 const scrollScene=matchMedia("(min-width: 981px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)");
 let cur=0,S=-.4,FP=0,R=null,buildFrame=0,scrollFrame=0;
 const freeze=params.has("freeze")?Math.min(N-1,+params.get("freeze")||0):null;if(freeze!==null)sec.classList.add("frozen");
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 /* storeys standing at each milestone: site formation, foundations, ground floor, then one storey per designated trade */
 const STOREYS=[-.4,.3,1,7,7,8,11,14,20,21,22];
 /* left panel: fixed slots. The year rolls digit by digit; title and text crossfade in a box sized for the longest entry */
 let layerA=0;
 function fitBody(){const body=document.getElementById("jBody"),probe=body.querySelector(".jc-text").cloneNode(true);probe.style.cssText="position:absolute;visibility:hidden;left:0;right:0";body.append(probe);
  let h=0;journey.forEach(m=>{probe.querySelector("h2").textContent=m.t;probe.querySelector("p").textContent=m.d;h=Math.max(h,probe.offsetHeight)});probe.remove();body.style.minHeight=h+"px"}
 function copy(k){
  const m=journey[k];
  document.getElementById("jStep").textContent="Milestone "+(k+1)+" of "+N;document.getElementById("jBar").style.width=((k+1)/N*100)+"%";
  document.getElementById("jYear").textContent=m.y;
  document.querySelectorAll(".odo-strip").forEach((st,d)=>st.style.transform="translate3d(0,"+(-(+m.y[d])*10)+"%,0)");
  const layers=document.querySelectorAll(".jc-text"),next=layers[1-layerA];layerA=1-layerA;
  next.querySelector("h2").textContent=m.t;next.querySelector("p").textContent=m.d;
  layers.forEach(l=>l.classList.toggle("on",l===next));
  document.getElementById("jUnit").textContent=m.u;
  document.getElementById("jNum").textContent=m.n;
  yearPicker.value=String(k);
  layers.forEach(layer=>layer.setAttribute("aria-hidden",String(layer!==next)));
  document.querySelectorAll("[data-jump]").forEach(b=>{const j=+b.dataset.jump;b.setAttribute("aria-current",j===k?"step":"false");b.parentElement.classList.toggle("done",j<=k)});
 }

 /* geometry of the stock frame, in the artwork's units (viewBox 3000 × 2348) */
 const H=163.86,F0=1593.85,F1=1430.24,F3=1102.26,SL=.5774,AX=1290,MAXS=22,SPLIT=1000,MP=H;
 const Y0=F0-MAXS*H-420,Y1=2330;
 /* facade canvas: from below the podium up past the highest (back) corner of the roof */
 const FACB=[1040,1112.76-MAXS*H-80,880,1660-(1112.76-MAXS*H-80)];
 const SLAB=[[1059.4,1460.78],[1289.88,1593.85],[1484.9,1481.25],[1573.55,1532.43],[1768.57,1419.83],[1679.92,1368.66],[1892.67,1245.82],[1662.19,1112.76]];
 const vy=(y,x)=>y-Math.abs(x-AX)*SL;
 const below=y=>[[-4000,vy(y,-4000)],[AX,y],[7000,vy(y,7000)],[7000,9000],[-4000,9000]];
 const above=y=>[[-4000,-30000],[7000,-30000],[7000,vy(y,7000)],[AX,y],[-4000,vy(y,-4000)]];
 const between=(lo,hi)=>[[-4000,vy(lo,-4000)],[AX,lo],[7000,vy(lo,7000)],[7000,vy(hi,7000)],[AX,hi],[-4000,vy(hi,-4000)]];
 const pts=a=>a.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
 const pct=(a,c)=>"polygon("+a.map(([x,y])=>((x-c[0])/c[2]*100).toFixed(2)+"% "+((y-c[1])/c[3]*100).toFixed(2)+"%").join(",")+")";

 loadConstructionArtwork().then(txt=>{
  /* 1 · render once off-screen to identify the parts */
  const probe=document.createElement("div");probe.style.cssText="position:absolute;left:-99999px;top:0;width:1500px;visibility:hidden";probe.innerHTML=txt;document.body.append(probe);
  const svg=probe.querySelector("svg"),defsXML=new XMLSerializer().serializeToString(svg.querySelector("defs"));
  const layers=[...svg.children].filter(c=>c.tagName==="g"),main=layers[3];
  const grp=[...main.children].find(c=>c.querySelectorAll("path,polygon,rect").length>1400);
  const at=(list,x,y)=>list.map(g=>({g,b:g.getBBox()})).find(o=>Math.abs(o.b.x-x)<4&&Math.abs(o.b.y-y)<4)?.g;
  const gk=[...grp.children].filter(c=>c.tagName==="g"),mk=[...main.children].filter(c=>c.tagName==="g");
  const P={bld:at(gk,1059,457),crane:at(gk,752,28),load:at(gk,1282,433),dozer:at(mk,2021,1494),truck:at(mk,340,1310)};
  const roofBits=[at(gk,1642,492),at(gk,1266,483),at(gk,1401,713),at(mk,1152,905)].filter(Boolean);
  /* strays that belong to the original 4-storey scene: crane cable, power wires, a loose slab piece,
     and the building's and crane's shadows painted on the sand. The precast panels leaning on the
     ground floor go too, so the finished tower stands clean. */
  const fillOf=e=>getComputedStyle(e).fill,bb=e=>e.getBBox();
  const strays=[];
  [...main.children].forEach(c=>{if(c===grp)return;const b=bb(c);
   if((b.width<4&&b.height>500)||(Math.abs(b.x-1425)<4&&Math.abs(b.y-465)<4)||(Math.abs(b.x-1679)<4&&Math.abs(b.y-537)<4)||((c.tagName==="path"||c.tagName==="polygon")&&fillOf(c)==="rgb(109, 91, 94)"&&b.x>1660&&b.x<1760&&b.y>980&&b.y<1040)||(b.x>1690&&b.x<1760&&b.y>960&&b.y<1060&&b.height>200&&b.width<330&&[...c.querySelectorAll?.("path")||[],c].some(e=>e.tagName==="path"&&fillOf(e)==="rgb(109, 91, 94)")))strays.push(c)});
  [...layers[2].querySelectorAll("polygon,path")].forEach(e=>{const b=bb(e);if(fillOf(e)==="rgb(186, 135, 79)"&&b.width>120&&b.height>60&&b.x>700&&b.x<2100&&b.y>900&&b.y<1700)strays.push(e)});
  [...P.bld.querySelectorAll("path,polygon")].forEach(e=>{const b=bb(e);if(b.x>1570&&b.x+b.width<1765&&b.y>1395&&b.y+b.height<1645)strays.push(e)});
  strays.forEach(e=>e.remove());
  const front=mk.filter(g=>g.isConnected).slice(mk.indexOf(grp)+1).filter(g=>g.isConnected&&!roofBits.includes(g));
  const X=e=>new XMLSerializer().serializeToString(e);
  const urls=[];
  const img=(inner,crop,clipPts)=>{const id="pc"+urls.length;
   const body=clipPts?'<clipPath id="'+id+'" clipPathUnits="userSpaceOnUse"><polygon points="'+pts(clipPts)+'"/></clipPath><g clip-path="url(#'+id+')">'+inner+'</g>':inner;
   const s='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="'+crop.join(" ")+'">'+defsXML.replace("</defs>",(clipPts?"":"")+"</defs>")+body+'</svg>';
   const u=URL.createObjectURL(new Blob([s],{type:"image/svg+xml"}));urls.push(u);return u};

  /* site: everything except the moving parts */
  const hide=[layers[0],grp,P.dozer,P.truck,...roofBits,...front].filter(Boolean); /* the whole building+crane group stays out of the site layer */
  hide.forEach(e=>e.setAttribute("data-hide",""));
  const siteClone=svg.cloneNode(true);siteClone.querySelectorAll("[data-hide]").forEach(e=>e.remove());
  const siteInner=[...siteClone.children].filter(c=>c.tagName!=="defs").map(X).join("");
  hide.forEach(e=>e.removeAttribute("data-hide"));
  const FULL=[0,0,3000,2348];
  const BAND=[1040,F1-H-370,880,H+390],MAST=[880,SPLIT-MP,240,MP];
  const FAC=FACB,CAP=[1040,F0-MAXS*H-520,880,700];
  const u={site:img(siteInner,FULL),dozer:img(X(P.dozer),FULL),truck:img(X(P.truck),FULL),front:img(front.map(X).join(""),FULL),
   ground:img(X(P.bld),FULL,below(F1)),band:img(X(P.bld),BAND,between(F1,F1-H)),roof:img(X(P.bld)+roofBits.map(X).join(""),FULL,above(F3)),
   cBase:img(X(P.crane),FULL,[[-4000,SPLIT],[7000,SPLIT],[7000,9000],[-4000,9000]]),cMast:img(X(P.crane),MAST,[[880,SPLIT-MP],[1120,SPLIT-MP],[1120,SPLIT],[880,SPLIT]]),
   cTop:img(X(P.crane),FULL,[[-4000,-30000],[7000,-30000],[7000,SPLIT],[-4000,SPLIT]]),load:P.load?img(X(P.load),FULL):null};
  probe.remove();

  /* facade, roof cap and sign, trees: drawn in code */
  let f='<defs><linearGradient id="gl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7cc3c3"/><stop offset="1" stop-color="#cdeeed"/></linearGradient><linearGradient id="gd" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1f5d6b"/><stop offset="1" stop-color="#4f9ca8"/></linearGradient></defs>';
  const top=-MAXS*H+20;let cap="";
  for(let i=0;i<SLAB.length;i++){const [x1,y1]=SLAB[i],[x2,y2]=SLAB[(i+1)%SLAB.length];if(x2<=x1)continue;const lf=y2>y1;
   f+='<polygon points="'+pts([[x1,y1+20],[x2,y2+20],[x2,y2+top],[x1,y1+top]])+'" fill="url(#'+(lf?"gl":"gd")+')"/>';
   const n=Math.max(1,Math.round((x2-x1)/42));for(let m=1;m<n;m++){const x=x1+(x2-x1)*m/n,y=y1+(y2-y1)*m/n;f+='<line x1="'+x+'" y1="'+(y+20)+'" x2="'+x+'" y2="'+(y+top)+'" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>'}
   for(let k=1;k<=MAXS;k++){const o=-k*H;f+='<polygon points="'+pts([[x1,y1+o],[x2,y2+o],[x2,y2+o+20],[x1,y1+o+20]])+'" fill="'+(lf?"#e6f0ef":"#a9c4c7")+'"/>'}
   const c=-MAXS*H-34;cap+='<polygon points="'+pts([[x1,y1+c],[x2,y2+c],[x2,y2+c+54],[x1,y1+c+54]])+'" fill="'+(lf?"#f3f1ef":"#c9c1bf")+'"/>'}
  cap+='<polygon points="'+pts(SLAB.map(([x,y])=>[x,y-MAXS*H-34]))+'" fill="#e9e6e4"/>';
  const svgOf=(inner,crop)=>{const s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+crop.join(" ")+'">'+inner+'</svg>';const x=URL.createObjectURL(new Blob([s],{type:"image/svg+xml"}));urls.push(x);return x};
  u.facade=svgOf(f,FAC);u.cap=svgOf(cap,CAP);
  /* finished plaza on the same plate: paving, lawns, a path to the entrance */
  const PL=[146.36,1428.71],PB=[1554.67,2254.24],PR=[2905.29,1474.65];
  const uv=(a,b)=>[PB[0]+(PR[0]-PB[0])*a+(PL[0]-PB[0])*b,PB[1]+(PR[1]-PB[1])*a+(PL[1]-PB[1])*b];
  const quad=(a0,b0,a1,b1)=>[uv(a0,b0),uv(a1,b0),uv(a1,b1),uv(a0,b1)];
  let pz='<polygon points="'+pts([PL,[146.36,1465.95],[1555.03,2279.88],PB])+'" fill="#cdd6d2"/><polygon points="'+pts([[1555.03,2279.88],[2905.29,1500.31],PR,PB])+'" fill="#a9b8b3"/>';
  pz+='<polygon points="'+pts(quad(0,0,1,1))+'" fill="#ece9e2"/>';
  [[.06,.06,.42,.36],[.58,.06,.94,.36],[.06,.58,.36,.94],[.64,.62,.94,.94],[.06,.4,.3,.54],[.7,.4,.94,.56]].forEach(q=>{pz+='<polygon points="'+pts(quad(...q))+'" fill="#8cc47e"/><polygon points="'+pts(quad(q[0]+.012,q[1]+.012,q[2]-.012,q[3]-.012))+'" fill="#a3d293"/>'});
  pz+='<polygon points="'+pts(quad(.44,0,.56,.42))+'" fill="#f6f4ef"/><polygon points="'+pts(quad(.3,.38,.7,.44))+'" fill="#f6f4ef"/>';
  u.plaza=svgOf(pz,FULL);
  u.tree=svgOf('<ellipse cx="50" cy="128" rx="44" ry="22" fill="#4c3322" opacity=".2"/><rect x="44" y="80" width="12" height="46" fill="#7a5236"/><circle cx="50" cy="46" r="46" fill="#4f9a4f"/><circle cx="36" cy="32" r="26" fill="#7cc17a"/>',[0,0,100,150]);

  /* 2 · stage: absolutely positioned images inside one world box */
  scene.innerHTML="";const world=document.createElement("div");world.className="rise-world";scene.append(world);
  const layer=(cls="")=>{const d=document.createElement("div");d.className="rl "+cls;world.append(d);return d};
  const put=(parent,src,crop,cls="",dy=0)=>{const im=new Image();im.src=src;im.alt="";im.className="rp "+cls;im.dataset.crop=crop.join(",");im.dataset.dy=dy;im.decoding="async";parent.append(im);return im};
  const Ls=layer(),Lp=layer("plaza"),Lm=layer(),Lc=layer("crane"),Lk=layer(),Lb=layer(),Lf=layer(),Lt=layer();
  put(Lp,u.plaza,FULL);
  put(Ls,u.site,FULL);
  const dozer=put(Lm,u.dozer,FULL,"dozer"),truck=put(Lm,u.truck,FULL,"truck");
  put(Lc,u.cBase,FULL);const mastL=layer("mast");Lc.append(mastL);const mast=[];for(let j=0;j<MAXS;j++)mast.push(put(mastL,u.cMast,MAST,"",-j*MP));
  const cTop=layer("crane-top");Lc.append(cTop);put(cTop,u.cTop,FULL);if(u.load)put(cTop,u.load,FULL,"load");
  const ground=put(Lb,u.ground,FULL);const bands=[];for(let j=0;j<MAXS-2;j++)bands.push(put(Lb,u.band,BAND,"step",-j*H));
  const roofL=layer("roof");Lb.append(roofL);put(roofL,u.roof,FULL);
  put(Lf,u.front,FULL,"front");const facade=put(Lf,u.facade,FAC,"facade");const capL=layer("cap");Lf.append(capL);put(capL,u.cap,CAP);
  /* trees on the lawns; ones standing behind the tower are drawn before it, the rest after */
  const tower=SLAB.map(([x,y])=>{const d=(PR[0]-PB[0])*(PL[1]-PB[1])-(PR[1]-PB[1])*(PL[0]-PB[0]),X=x-PB[0],Y=y+61-PB[1];return [(X*(PL[1]-PB[1])-Y*(PL[0]-PB[0]))/d,((PR[0]-PB[0])*Y-(PR[1]-PB[1])*X)/d]});
  const ua=Math.min(...tower.map(t=>t[0])),va=Math.min(...tower.map(t=>t[1]));
  const spots=[];
  [[.06,.06,.42,.36],[.58,.06,.94,.36],[.06,.58,.36,.94],[.64,.62,.94,.94],[.06,.4,.3,.54],[.7,.4,.94,.56]].forEach(([a0,b0,a1,b1])=>{
   for(let a=a0+.04;a<a1-.02;a+=.085)for(let b=b0+.04;b<b1-.02;b+=.085)if(((a*97+b*131)%1)>.18)spots.push([a,b])});
  spots.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1])).reverse();
  const trees=spots.map(([a,b],k)=>{const [x,y]=uv(a,b),back=a>=ua-.02&&b>=va-.02;
   const t=put(back?Lk:Lt,u.tree,[x-50,y-128,100,150],"tree");t.style.transitionDelay=(k*.025)+"s";return t});
  R={world,mastL,Ls,Lp,Lf,Lc,cTop,roofL,ground,bands,mast,facade,capL,trees,dozer,truck,front:Lf.querySelector(".front"),sc:1};
  layout();apply(S,FP,true);
  if(freeze!==null){
   const index=Math.floor(clamp(freeze,0,N-1)), mix=freeze-index;
   go(index,true);
   if(mix>0&&index<N-1){
    S=STOREYS[index]+(STOREYS[index+1]-STOREYS[index])*mix;
    apply(S,FP,true);
   }
  }else{
   syncScrollScene();
   if(sec.classList.contains("scroll-scene")&&cur>0) scrollToYear(cur,"instant");
  }
 }).catch(error=>console.warn("Milestone illustration is showing its static version.",error));

 /* fit the fixed world into the stage, slightly smaller than the stage */
 function layout(){
  if(!R)return;const cw=view.clientWidth,ch=view.clientHeight,sc=Math.min(ch*.86/(Y1-Y0),cw*.9/3000);R.sc=sc;
  const ox=cw/2-1480*sc,oy=ch*.98-Y1*sc;
  R.world.style.transform="translate("+ox.toFixed(1)+"px,"+oy.toFixed(1)+"px)";
  R.world.querySelectorAll(".rp").forEach(im=>{const [x,y,w,h]=im.dataset.crop.split(",").map(Number),dy=+im.dataset.dy;
   im.style.left=x*sc+"px";im.style.top=(y+dy)*sc+"px";im.style.width=w*sc+"px";im.style.height=h*sc+"px"});
  apply(S,FP,true);
 }
 /* show the scene for a (fractional) storey count s and facade progress fp */
 function apply(s,fp,instant){
  if(!R)return;const sc=R.sc,Sr=Math.max(s,2),D=Math.max(0,s-4)*H;
  R.ground.style.clipPath=s>=1?"none":pct(below(F0-clamp(s,-1,1)*H),[0,0,3000,2348]);
  R.bands.forEach((b,j)=>b.classList.toggle("on",s>=1.6&&j<Sr-2-.001));
  R.roofL.style.transform="translate3d(0,"+(-(Sr-4)*H*sc).toFixed(2)+"px,0)";R.roofL.style.opacity=clamp((s-1.6)/.4)*(1-clamp((fp-.7)/.2)); /* the bare roof frame gives way to the clad top */
  R.cTop.style.transform="translate3d(0,"+(-D*sc).toFixed(2)+"px,0)";
  /* mast: segments are always present and trimmed to the exact gap between base and climbing top, so it never breaks */
  R.mast.forEach((m,j)=>m.style.display=j<Math.ceil(D/MP-.001)?"":"none");
  R.mastL.style.clipPath="polygon(-9999px "+((SPLIT-D)*sc-1).toFixed(1)+"px,9999px "+((SPLIT-D)*sc-1).toFixed(1)+"px,9999px "+(SPLIT*sc+1).toFixed(1)+"px,-9999px "+(SPLIT*sc+1).toFixed(1)+"px)";
  R.Lc.style.opacity=clamp((s+.1)/.5)*(1-clamp((fp-.1)/.3));
  const lag=clamp(s-3,0,MAXS),g=lag+(MAXS-lag)*fp;
  R.facade.style.visibility=g>.02?"visible":"hidden";
  R.facade.style.clipPath=pct(below(F0+20-g*H-fp*520),FACB);
  R.roofL.querySelector("img").style.opacity=1;
  R.capL.style.opacity=clamp((fp-.7)/.2);
  R.trees.forEach(t=>t.classList.toggle("on",fp>.72));
  const site=1-clamp((fp-.45)/.3);R.Ls.style.opacity=site;R.Lp.style.opacity=1-site;R.front.style.opacity=site;
  [R.dozer,R.truck].forEach(g=>g.style.opacity=1-clamp((fp-.3)/.4));
  R.world.classList.toggle("done",fp>=1);
 }
 /* The year picker changes the scene directly on narrow or short screens. */
 function go(index,instant=false){
  const next=clamp(index,0,N-1);
  if(instant||next!==cur){cur=next;copy(cur)}
  cancelAnimationFrame(buildFrame);
  const startFloor=S, endFloor=STOREYS[cur], startFacade=FP, endFacade=cur===N-1?1:0;
  if(instant||motionPreference.matches||freeze!==null){
   S=endFloor;FP=endFacade;apply(S,FP,true);return;
  }
  const began=performance.now();
  const duration=720;
  function animate(now){
   const progress=clamp((now-began)/duration);
   const eased=1-(1-progress)**3;
   S=startFloor+(endFloor-startFloor)*eased;
   FP=startFacade+(endFacade-startFacade)*eased;
   apply(S,FP);
   if(progress<1) buildFrame=requestAnimationFrame(animate);
  }
  buildFrame=requestAnimationFrame(animate);
 }

 /* The sticky illustration follows normal document scrolling on tall desktops. */
 const headerHeight=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hh"))||68;
 const scrollDistance=()=>Math.max(1,sec.offsetHeight-sticky.offsetHeight);
 let lastProgress=-1;
 function renderScrollScene(){
  scrollFrame=0;
  if(!sec.classList.contains("scroll-scene")||document.hidden)return;
  const progress=clamp((headerHeight()-sec.getBoundingClientRect().top)/scrollDistance())*(N-1);
  if(Math.abs(progress-lastProgress)<.001)return;
  lastProgress=progress;
  const index=Math.floor(progress);
  const next=Math.min(index+1,N-1);
  const fraction=progress-index;
  const ease=fraction*fraction*(3-2*fraction);
  const selected=Math.round(progress);
  if(selected!==cur){cur=selected;copy(cur)}
  S=STOREYS[index]+(STOREYS[next]-STOREYS[index])*ease;
  FP=index>=N-1?1:next===N-1?ease:0;
  apply(S,FP);
 }
 function queueScrollScene(){
  if(!scrollFrame&&sec.classList.contains("scroll-scene")){
   scrollFrame=requestAnimationFrame(renderScrollScene);
  }
 }
 function scrollToYear(index,behavior="smooth"){
  const start=window.scrollY+sec.getBoundingClientRect().top-headerHeight();
  window.scrollTo({top:start+index/(N-1)*scrollDistance(),behavior});
 }
 function syncScrollScene(){
  const enabled=Boolean(R)&&freeze===null&&scrollScene.matches;
  sec.classList.toggle("scroll-scene",enabled);
  cancelAnimationFrame(buildFrame);
  lastProgress=-1;
  if(enabled)queueScrollScene();
  else if(freeze===null)go(cur,true);
 }
 function pickYear(index){
  if(sec.classList.contains("scroll-scene"))scrollToYear(index);
  else go(index);
 }
 window.addEventListener("scroll",queueScrollScene,{passive:true});
 window.addEventListener("resize",()=>{layout();fitBody();queueScrollScene()});
 scrollScene.addEventListener("change",syncScrollScene);
 document.addEventListener("visibilitychange",()=>{
  sec.classList.toggle("scene-hidden",document.hidden);
  if(!document.hidden)queueScrollScene();
 });
 if("IntersectionObserver" in window){
  const sceneVisibility=new IntersectionObserver(([entry])=>{
   sec.classList.toggle("scene-offscreen",!entry.isIntersecting);
  });
  sceneVisibility.observe(sticky);
 }
 document.fonts?.ready.then(fitBody);
 const initialStep=Math.round(clamp(freeze??(Number(params.get("step"))||0),0,N-1));
 fitBody();
 go(initialStep,true);
 yearPicker.addEventListener("change",()=>pickYear(Number(yearPicker.value)));
 document.querySelectorAll("[data-jump]").forEach(button=>{
  button.addEventListener("click",()=>pickYear(Number(button.dataset.jump)));
 });

}

/* ---------- register ---------- */
if(page==="register"){
 const form=document.getElementById("filters"),mount=document.getElementById("results"), count=document.getElementById("regCount"), maintain=document.getElementById("maintenance");
 if(params.get("q"))form.elements.search.value=params.get("q");
 if(params.get("trade"))form.elements.trade.value=params.get("trade");
 let down=false;
 const normalized=s=>s.toLowerCase().replace(/[–—]/g,"-").trim();
 function render(){
  form.querySelectorAll("input,select,button").forEach(x=>x.disabled=down);
  if(down){count.textContent="Register unavailable";mount.innerHTML='<div class="state" role="status"><h3>Register search is under maintenance</h3><p>Please try again later.</p></div>';return}
  const f=new FormData(form),q=normalized(String(f.get("search")));
  const items=demo.filter(x=>Boolean(x.rs)===(params.get("register")==="rs")&&normalized(x.name+" "+x.id).includes(q)&&(!f.get("trade")||x.trade===f.get("trade"))&&(!f.get("mark")||x.marks.includes(f.get("mark"))));
  count.textContent=items.length+" sample result"+(items.length===1?"":"s");
  mount.innerHTML=items.length?items.map(profile).join(""):'<div class="state"><h3>No matches</h3><p>Try a different keyword, trade or marking.</p><button class="link-btn" id="reset">Clear filters</button></div>';
  document.getElementById("reset")?.addEventListener("click",()=>{form.reset();render();form.elements.search.focus()});
 }
 form.addEventListener("submit",e=>{e.preventDefault();render()});
 maintain.addEventListener("click",()=>{down=!down;maintain.setAttribute("aria-pressed",String(down));maintain.textContent=down?"Return to register":"Show maintenance state";render()});render();
}
if(page==="updates"||page==="home")document.querySelectorAll("[data-update]").forEach(button=>button.addEventListener("click",()=>{const type=button.dataset.update;document.querySelectorAll("[data-update]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));document.getElementById("feed").innerHTML=feed(type==="All"?updates:updates.filter(x=>x.type===type))}));

/* A script can load the same local SVG data when the prototype is opened from Finder. */
function loadConstructionArtwork(){
 if(location.protocol!=="file:"){
  return fetch("assets/construction-site.svg").then(response=>{
   if(!response.ok)throw new Error("Could not load the construction illustration.");
   return response.text();
  });
 }
 return new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  script.src="assets/construction-site-local.js";
  script.onload=()=>{
   const artwork=window.rstcsConstructionArtwork;
   delete window.rstcsConstructionArtwork;
   script.remove();
   if(typeof artwork==="string")resolve(artwork);
   else reject(new Error("Construction illustration data was unavailable."));
  };
  script.onerror=()=>{
   script.remove();
   reject(new Error("Could not load the local construction illustration."));
  };
  document.head.append(script);
 });
}

/* Reveal homepage content as each group enters the viewport. */
if(page==="home"&&theme==="a"&&"IntersectionObserver" in window){
 const content=document.getElementById("app");
 const newsFeed=document.getElementById("feed");
 const groups=[
  ".hero-text > *", ".finder-wrap > .id-triangle, .finder",
  ".home-news > h2, .home-news .update-tabs", ".home-news .feature-card",
  ".home-news .centred-link", ".overview-copy > :not(.overview-stats)",
  ".overview-stat", ".collage .pent-back", ".collage .pent-photo", ".trades-head > *", ".trades li",
  ".ms-teaser > *", ".home-milestones .track", ".home-milestones .track li",
  ".home-milestones .centred-link",
  ".home-services .service-panel",
  ".legal-top, .legal .badges, .legal-links, .copyright"
 ];
 const revealObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entry.target.dataset.reveal="shown";
   revealObserver.unobserve(entry.target);
  }
 },{rootMargin:"0px 0px -12px 0px",threshold:0});
 function armReveals(elements){
  if(motionPreference.matches||!elements.length)return;
  const row=elements[0].parentElement;
  const columns=row?.matches(".trades, .feed, .track")
   ?getComputedStyle(row).gridTemplateColumns.split(/\s+/).length
   :elements.length;
  elements.forEach((element,index)=>{
   if(element.hasAttribute("data-reveal"))return;
   element.style.setProperty("--a-stagger",String(index%columns));
   element.dataset.reveal="pending";
   revealObserver.observe(element);
  });
 }
 function finishReveal(element){
  revealObserver.unobserve(element);
  element.dataset.reveal="done";
 }
 function exposeReveals(){
  revealObserver.disconnect();
  content.querySelectorAll("[data-reveal]").forEach(finishReveal);
 }
 content.addEventListener("focusin",event=>{
  const target=event.target.closest('[data-reveal]:not([data-reveal="done"])');
  if(target)finishReveal(target);
 });
 content.addEventListener("animationend",event=>{
  if(event.animationName==="a-section-entry"||event.animationName==="a-track-entry"){
   finishReveal(event.target);
  }
 });
 motionPreference.addEventListener("change",()=>{
  if(motionPreference.matches)exposeReveals();
 });
 window.addEventListener("beforeprint",exposeReveals);
 content.classList.add("home-reveal-ready");
 groups.forEach(selector=>armReveals(content.querySelectorAll(selector)));
 new MutationObserver(records=>{
  for(const record of records){
   record.removedNodes.forEach(node=>{
    if(node.nodeType===Node.ELEMENT_NODE){
     node.querySelectorAll("[data-reveal]").forEach(element=>revealObserver.unobserve(element));
    }
   });
  }
  armReveals(newsFeed.querySelectorAll(".feature-card"));
 }).observe(newsFeed,{childList:true});
}
