(() => {
'use strict';

const S={
  user:null,csrf:'',content:null,dashboard:null,messages:[],quotes:[],
  view:'dashboard',lang:'ar',dirty:false,saving:false,saveTimer:null,
  modal:null,search:''
};
const LANGS=[['ar','العربية'],['en','English'],['es','Español'],['it','Italiano']];
const VIEWS={
  dashboard:['نظرة عامة','ملخص حي للمحتوى والزيارات والطلبات.'],
  landing:['الواجهة الرئيسية','إدارة شرائح الواجهة الرئيسية كصور أو فيديو مع ترتيب وتشغيل ديناميكي.'],
  identity:['هوية الموقع','تغيير الشعار واسم الشركة والعبارة التعريفية والألوان الأساسية.'],
  contact:['التواصل والفوتر','تعديل بيانات التواصل والموقع والخريطة والروابط الاجتماعية.'],
  products:['المنتجات','إدارة المنتجات والمواصفات والتعبئة والصور والحالة.'],
  categories:['التصنيفات','تنظيم فئات المنتجات وصورها وروابطها.'],
  content:['محتوى الشركة','تحرير مقدمة الرئيسية ونبذة الشركة والقدرات.'],
  certificates:['الشهادات','إدارة الشهادات والاعتمادات وصورها.'],
  achievements:['الإنجازات','إضافة المحطات والإنجازات وترتيب عرضها.'],
  news:['الأخبار والمقالات','إنشاء وإدارة المحتوى المعرفي متعدد اللغات.'],
  faq:['الأسئلة الشائعة','تحرير الأسئلة والإجابات الظاهرة بالموقع.'],
  seo:['SEO والتحليلات','العناوين والوصف وصورة المشاركة وأكواد القياس.'],
  messages:['رسائل التواصل','استعراض رسائل نموذج التواصل وتحديث حالتها.'],
  quotes:['طلبات الأسعار','متابعة طلبات عروض الأسعار ومرحلة كل طلب.'],
  settings:['الإعدادات والأمان','إدارة الوصول وكلمة المرور والنسخ الاحتياطي.']
};
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const attr=esc;
const icon=(n,c='')=>window.ZRIcon?window.ZRIcon(n,c):'';
const local=v=>{
  if(v&&typeof v==='object'&&!Array.isArray(v))return v[S.lang]??v.en??v.ar??Object.values(v)[0]??'';
  return v??'';
};
const get=(path,obj=S.content)=>{
  if(!path)return obj;
  return String(path).split('.').reduce((acc,k)=>acc==null?undefined:acc[k],obj);
};
const set=(path,value,obj=S.content)=>{
  const keys=String(path).split('.');
  let cur=obj;
  for(let i=0;i<keys.length-1;i++){
    const k=keys[i],next=keys[i+1];
    if(cur[k]==null||typeof cur[k]!=='object')cur[k]=/^\d+$/.test(next)?[]:{};
    cur=cur[k];
  }
  cur[keys[keys.length-1]]=value;
};
const makeId=prefix=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
const short=s=>String(s||'').slice(0,110);
const fmtDate=x=>{
  if(!x)return '—';
  try{return new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',timeStyle:x.includes('T')?'short':undefined}).format(new Date(x))}
  catch{return x}
};

async function api(url,options={}){
  const opts={credentials:'same-origin',...options,headers:{...(options.headers||{})}};
  if(options.body&&typeof options.body!=='string'){
    opts.headers['Content-Type']='application/json';
    opts.body=JSON.stringify(options.body);
  }
  if(options.method&&options.method!=='GET')opts.headers['X-CSRF-Token']=S.csrf;
  const res=await fetch(url,opts);
  const type=res.headers.get('content-type')||'';
  const data=type.includes('application/json')?await res.json():await res.text();
  if(!res.ok)throw Object.assign(new Error(data?.error||`HTTP ${res.status}`),{status:res.status,data});
  return data;
}
function toast(message,type='success'){
  let stack=$('.admin-toast-stack');
  if(!stack){stack=document.createElement('div');stack.className='admin-toast-stack';document.body.appendChild(stack)}
  const el=document.createElement('div');
  el.className=`admin-toast ${type}`;
  el.innerHTML=`${icon(type==='error'?'x':'check')}<span>${esc(message)}</span>`;
  stack.appendChild(el);setTimeout(()=>el.remove(),4300);
}
function confirmAction(message){return window.confirm(message)}
function updateSaveIndicator(mode,text){
  const el=$('#save-indicator');if(!el)return;
  el.className=`save-indicator ${mode||''}`;
  const labels={dirty:'تعديلات غير محفوظة',saving:'جارٍ الحفظ...',saved:'تم الحفظ',error:'تعذر الحفظ'};
  el.innerHTML=`<i></i><span>${esc(text||labels[mode]||'المحتوى محدث')}</span>`;
}
function markDirty(){
  S.dirty=true;updateSaveIndicator('dirty');
  clearTimeout(S.saveTimer);
  S.saveTimer=setTimeout(()=>saveContent(true),1300);
}
async function saveContent(silent=false){
  if(!S.content||S.saving||!S.dirty)return;
  S.saving=true;updateSaveIndicator('saving');
  try{
    await api('/api/admin/content',{method:'PUT',body:{content:S.content}});
    S.dirty=false;updateSaveIndicator('saved');
    if(!silent)toast('تم حفظ المحتوى بنجاح');
    setTimeout(()=>updateSaveIndicator('','المحتوى محدث'),1800);
    await loadDashboard(false);
  }catch(e){
    updateSaveIndicator('error');toast('تعذر حفظ المحتوى: '+errorText(e),'error');
  }finally{S.saving=false}
}
function errorText(e){
  const m={INVALID_CREDENTIALS:'البريد أو كلمة المرور غير صحيحة.',AUTH_REQUIRED:'انتهت الجلسة. سجّل الدخول مرة أخرى.',INVALID_CSRF:'انتهت صلاحية الجلسة. أعد تحميل الصفحة.',FILE_TOO_LARGE:'حجم الملف أكبر من المسموح.',UNSUPPORTED_FILE:'نوع الملف غير مدعوم.',WEAK_PASSWORD:'استخدم 10 أحرف على الأقل مع حرف كبير وصغير ورقم.',CURRENT_PASSWORD_WRONG:'كلمة المرور الحالية غير صحيحة.'};
  return m[e?.message]||m[e?.data?.error]||e?.message||'حدث خطأ غير متوقع.';
}

/* Login */
function loginScreen(message=''){
  document.documentElement.lang='ar';document.documentElement.dir='rtl';
  $('#admin-root').innerHTML=`<main class="login-shell">
    <section class="login-visual">
      <img src="/assets/images/hero-groves.webp" alt="">
      <div class="login-visual-copy">
        <img class="login-visual-logo" src="/assets/images/logo-default.svg" alt="Zahrat El-Rabea">
        <h1>إدارة المحتوى<br>بوضوح وسرعة.</h1>
        <p>لوحة موحدة للتحكم في الواجهة الرئيسية والمنتجات والشعار والتواصل والمحتوى متعدد اللغات، من دون ظهور رابط الإدارة للزوار.</p>
        <div class="login-points"><span class="login-point">${icon('image')}صور وفيديو</span><span class="login-point">${icon('globe')}أربع لغات</span><span class="login-point">${icon('shieldCheck')}دخول محمي</span></div>
      </div>
    </section>
    <section class="login-panel"><div class="login-card">
      <img class="mini-logo" src="/assets/images/logo-default.svg" alt="Zahrat El-Rabea">
      <h2>مرحبًا بعودتك</h2><p>سجّل الدخول لإدارة الموقع من المسار الداخلي <bdi>/eslammm</bdi>.</p>
      <form class="login-form" id="login-form">
        <div class="field"><label for="login-email">البريد الإلكتروني</label><div class="input-wrap">${icon('mail')}<input id="login-email" name="email" type="email" autocomplete="username" required></div></div>
        <div class="field"><label for="login-password">كلمة المرور</label><div class="input-wrap">${icon('shield')}<input id="login-password" name="password" type="password" autocomplete="current-password" required><button class="password-toggle" type="button" data-toggle-password>${icon('eye')}</button></div></div>
        <div class="login-error ${message?'show':''}" id="login-error">${esc(message)}</div>
        <button class="login-btn" type="submit">${icon('arrowRight')}دخول لوحة التحكم</button>
      </form>
    </div></section>
  </main>`;
  window.hydrateIcons?.();
  $('[data-toggle-password]')?.addEventListener('click',()=>{
    const input=$('#login-password');input.type=input.type==='password'?'text':'password';
  });
  $('#login-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=e.currentTarget.querySelector('button[type="submit"]'),err=$('#login-error');
    btn.disabled=true;btn.textContent='جارٍ التحقق...';err.classList.remove('show');
    const fd=Object.fromEntries(new FormData(e.currentTarget).entries());
    try{
      const data=await api('/api/auth/login',{method:'POST',body:fd});
      S.user=data.user;S.csrf=data.csrf;await loadApp();
    }catch(ex){
      err.textContent=errorText(ex);err.classList.add('show');btn.disabled=false;btn.innerHTML=`${icon('arrowRight')}دخول لوحة التحكم`;
    }
  });
}

/* Layout */
function navButton(view,label,ic,badge=''){
  return `<button class="${S.view===view?'active':''}" data-view="${view}">${icon(ic)}<span>${esc(label)}</span>${badge!==''?`<span class="nav-badge">${esc(badge)}</span>`:''}</button>`;
}
function shell(){
  const d=S.dashboard?.totals||{};
  return `<div class="admin-shell">
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="sidebar-brand"><img src="${attr(S.content.site.logo)}" alt="${attr(S.content.site.companyName)}"></div>
      <div class="sidebar-scroll">
        <div class="nav-section-label">الرئيسية</div><nav class="admin-nav">
          ${navButton('dashboard','نظرة عامة','layoutDashboard')}
          ${navButton('landing','الواجهة الرئيسية','image',d.heroSlides||0)}
          ${navButton('identity','هوية الموقع','palette')}
          ${navButton('contact','التواصل والفوتر','mapPin')}
        </nav>
        <div class="nav-section-label">المحتوى</div><nav class="admin-nav">
          ${navButton('products','المنتجات','package',d.products||0)}
          ${navButton('categories','التصنيفات','grid')}
          ${navButton('content','محتوى الشركة','fileText')}
          ${navButton('certificates','الشهادات','shieldCheck')}
          ${navButton('achievements','الإنجازات','award')}
          ${navButton('news','الأخبار والمقالات','newspaper',d.news||0)}
          ${navButton('faq','الأسئلة الشائعة','circleHelp')}
        </nav>
        <div class="nav-section-label">العمليات</div><nav class="admin-nav">
          ${navButton('messages','رسائل التواصل','messages',d.unreadMessages||0)}
          ${navButton('quotes','طلبات الأسعار','clipboardCheck',d.openQuotes||0)}
          ${navButton('seo','SEO والتحليلات','search')}
          ${navButton('settings','الإعدادات والأمان','settings')}
        </nav>
      </div>
      <div class="sidebar-footer"><div class="user-mini"><span class="user-avatar">${esc((S.user.name||'A').charAt(0))}</span><div><strong>${esc(S.user.name)}</strong><small>${esc(S.user.email)}</small></div><button class="logout-mini" data-action="logout" title="تسجيل الخروج">${icon('logout')}</button></div></div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <section class="admin-main">
      <header class="admin-topbar">
        <button class="sidebar-mobile-toggle" data-action="sidebar-toggle">${icon('menu')}</button>
        <div class="topbar-title"><h1 id="topbar-title">${esc(VIEWS[S.view][0])}</h1><p id="topbar-subtitle">${esc(VIEWS[S.view][1])}</p></div>
        <div class="topbar-actions">
          <div class="save-indicator" id="save-indicator"><i></i><span>المحتوى محدث</span></div>
          <select class="content-lang" id="content-lang" title="لغة المحتوى">${LANGS.map(([v,l])=>`<option value="${v}" ${v===S.lang?'selected':''}>${v.toUpperCase()}</option>`).join('')}</select>
          <a class="topbar-icon open-site" href="/${S.lang}" target="_blank" title="فتح الموقع">${icon('externalLink')}</a>
          <button class="topbar-icon" data-action="save" title="حفظ">${icon('save')}</button>
          <button class="topbar-icon" data-view="messages" title="الإشعارات">${icon('bell')}${(d.unreadMessages||0)?'<span class="dot"></span>':''}</button>
        </div>
      </header>
      <main class="admin-content"><div id="admin-view"></div></main>
    </section>
    <div class="admin-modal" id="admin-modal"></div>
    <div class="admin-toast-stack"></div>
  </div>`;
}
function updateTopbar(){
  const [title,sub]=VIEWS[S.view]||VIEWS.dashboard;
  if($('#topbar-title'))$('#topbar-title').textContent=title;
  if($('#topbar-subtitle'))$('#topbar-subtitle').textContent=sub;
  $$('.admin-nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===S.view));
}
function openSidebar(open=true){
  $('#admin-sidebar')?.classList.toggle('open',open);
  $('#sidebar-overlay')?.classList.toggle('open',open);
}
async function loadDashboard(rerender=true){
  try{const x=await api('/api/admin/dashboard');S.dashboard=x.data;if(rerender&&S.view==='dashboard')renderView();}
  catch(e){if(e.status===401)loginScreen('انتهت الجلسة.');}
}
async function loadApp(){
  const [content,dash]=await Promise.all([api('/api/admin/content'),api('/api/admin/dashboard')]);
  S.content=content.content;S.dashboard=dash.data;S.view='dashboard';
  $('#admin-root').innerHTML=shell();bindShell();renderView();
}
function bindShell(){
  const root=$('#admin-root');
  root.addEventListener('click',handleClick);
  root.addEventListener('input',handleInput);
  root.addEventListener('change',handleChange);
  $('#sidebar-overlay')?.addEventListener('click',()=>openSidebar(false));
  $('#content-lang')?.addEventListener('change',e=>{S.lang=e.target.value;renderView();if(S.modal)renderModal()});
  window.hydrateIcons?.();
}

/* Shared view elements */
function viewHeader(title,desc,actions=''){
  return `<div class="view-header"><div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div><div class="view-actions">${actions}</div></div>`;
}
function langLabel(){return `<span class="lang-chip">${S.lang.toUpperCase()}</span>`}
function inputField(label,path,value=get(path),opts={}){
  const type=opts.type||'text',full=opts.full?' full':'',ph=opts.placeholder||'',hint=opts.hint||'';
  if(type==='textarea')return `<div class="field${full}"><label>${esc(label)}${opts.localized?langLabel():''}</label><textarea data-bind="${attr(path)}" placeholder="${attr(ph)}">${esc(value||'')}</textarea>${hint?`<small>${esc(hint)}</small>`:''}</div>`;
  if(type==='select')return `<div class="field${full}"><label>${esc(label)}${opts.localized?langLabel():''}</label><select data-bind="${attr(path)}">${(opts.options||[]).map(([v,l])=>`<option value="${attr(v)}" ${String(value)===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select>${hint?`<small>${esc(hint)}</small>`:''}</div>`;
  return `<div class="field${full}"><label>${esc(label)}${opts.localized?langLabel():''}</label><input data-bind="${attr(path)}" type="${attr(type)}" value="${attr(value??'')}" placeholder="${attr(ph)}" ${opts.min!=null?`min="${attr(opts.min)}"`:''} ${opts.max!=null?`max="${attr(opts.max)}"`:''}>${hint?`<small>${esc(hint)}</small>`:''}</div>`;
}
function switchField(label,path,desc=''){
  return `<div class="switch-row"><div class="switch-copy"><strong>${esc(label)}</strong>${desc?`<span>${esc(desc)}</span>`:''}</div><label class="switch"><input type="checkbox" data-bind="${attr(path)}" ${get(path)?'checked':''}><span class="switch-track"></span></label></div>`;
}
function uploadBox(target,category,accept,label='رفع ملف'){
  return `<label class="upload-box">${icon('upload')}<div><strong>${esc(label)}</strong><small>اختر صورة أو فيديو أو مستندًا من جهازك</small></div><input type="file" data-upload-target="${attr(target)}" data-upload-category="${attr(category)}" accept="${attr(accept)}"></label>`;
}
function statusPill(text,mode=''){return `<span class="status-pill ${mode}">${esc(text)}</span>`}
function emptyTable(text){return `<div class="empty-table">${icon('inbox')}<div>${esc(text)}</div></div>`}

/* Dashboard */
function chartSvg(points){
  const vals=(points||[]).map(x=>Number(x.value)||0);
  const max=Math.max(1,...vals),w=700,h=235,p=25;
  const n=Math.max(2,vals.length);
  const coords=vals.map((v,i)=>[p+(w-2*p)*(i/Math.max(1,n-1)),h-p-(h-2*p)*(v/max)]);
  const line=coords.map((a,i)=>(i?'L':'M')+a.join(',')).join(' ');
  const area=coords.length?`${line} L ${coords.at(-1)[0]},${h-p} L ${coords[0][0]},${h-p} Z`:'';
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e8053" stop-opacity=".25"/><stop offset="1" stop-color="#2e8053" stop-opacity="0"/></linearGradient></defs>
    ${[0,.25,.5,.75,1].map(t=>`<line class="chart-grid-line" x1="${p}" x2="${w-p}" y1="${p+(h-2*p)*t}" y2="${p+(h-2*p)*t}"/>`).join('')}
    ${area?`<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${coords.map(c=>`<circle class="chart-dot" cx="${c[0]}" cy="${c[1]}" r="4"/>`).join('')}`:''}
    ${(points||[]).map((x,i)=>i%Math.max(1,Math.ceil(points.length/5))===0?`<text class="chart-label" x="${coords[i]?.[0]||p}" y="${h-4}" text-anchor="middle">${esc(String(x.date||'').slice(5))}</text>`:'').join('')}
  </svg>`;
}
function renderDashboard(){
  const d=S.dashboard||{totals:{},daily:[],topPages:[],recentMessages:[]},t=d.totals||{};
  const metrics=[
    ['package','المنتجات',t.products||0,'منها '+(t.published||0)+' منشور'],
    ['eye','إجمالي الزيارات',t.visits||0,'منذ تفعيل الإحصاءات'],
    ['messages','رسائل غير مقروءة',t.unreadMessages||0,'تحتاج متابعة'],
    ['clipboardCheck','طلبات أسعار مفتوحة',t.openQuotes||0,'طلبات نشطة']
  ];
  return `<section class="admin-view">
    ${viewHeader('لوحة التحكم','ملخص تفاعلي للموقع والمحتوى والطلبات.',`<button class="a-btn a-btn-primary" data-view="landing">${icon('image')}إدارة الواجهة</button><a class="a-btn a-btn-secondary" href="/${S.lang}" target="_blank">${icon('externalLink')}فتح الموقع</a>`)}
    <div class="dashboard-grid">${metrics.map(([ic,l,v,n])=>`<article class="metric-card"><div><div class="metric-label">${esc(l)}</div><div class="metric-value">${esc(v)}</div><div class="metric-note">${esc(n)}</div></div><span class="metric-icon">${icon(ic)}</span></article>`).join('')}</div>
    <div class="dashboard-layout">
      <article class="panel"><div class="panel-head"><div><h3>الزيارات خلال آخر 14 يومًا</h3><p>بيانات الزيارات المسجلة، مع إمكانية ربط Google Analytics 4 من إعدادات SEO.</p></div>${statusPill('Live')}</div><div class="panel-body"><div class="chart-wrap">${chartSvg(d.daily||[])}</div></div></article>
      <article class="panel"><div class="panel-head"><div><h3>الصفحات الأكثر زيارة</h3><p>حسب بيانات تصفح صفحات الموقع.</p></div></div><div class="panel-body"><div class="list-stack">${(d.topPages||[]).length?(d.topPages||[]).slice(0,6).map((x,i)=>`<div class="list-row"><span class="list-icon">${icon('fileText')}</span><div><strong dir="ltr">${esc(x.label)}</strong><small>ترتيب ${i+1}</small></div><span class="list-value">${esc(x.value)}</span></div>`).join(''):emptyTable('لا توجد بيانات زيارات بعد.')}</div></div></article>
    </div>
    <article class="panel" style="margin-bottom:20px"><div class="panel-head"><div><h3>اختصارات الإدارة</h3><p>انتقل مباشرة إلى أكثر الأقسام استخدامًا.</p></div></div><div class="panel-body"><div class="quick-grid">
      <button class="quick-action" data-view="landing"><span class="metric-icon">${icon('video')}</span><strong>إضافة صورة أو فيديو</strong><span>تعديل شرائح الواجهة الرئيسية وترتيبها.</span></button>
      <button class="quick-action" data-view="products"><span class="metric-icon">${icon('package')}</span><strong>إضافة منتج</strong><span>صور ومواصفات وتعبئة بأربع لغات.</span></button>
      <button class="quick-action" data-view="identity"><span class="metric-icon">${icon('image')}</span><strong>تغيير الشعار</strong><span>رفع شعار جديد يظهر فور الحفظ.</span></button>
      <button class="quick-action" data-view="contact"><span class="metric-icon">${icon('mapPin')}</span><strong>تحديث التواصل</strong><span>الهاتف والبريد والعنوان والخريطة.</span></button>
    </div></div></article>
    <div class="dashboard-layout">
      <article class="panel"><div class="panel-head"><div><h3>أحدث الرسائل</h3><p>آخر ما وصل من نموذج التواصل.</p></div><button class="a-btn a-btn-secondary" data-view="messages">عرض الكل</button></div><div class="panel-body"><div class="list-stack">${(d.recentMessages||[]).length?d.recentMessages.map(m=>`<div class="list-row"><span class="list-icon">${icon('mail')}</span><div><strong>${esc(m.name)}</strong><small>${esc(m.subject||short(m.message))}</small></div><span class="list-value">${m.read?'مقروء':'جديد'}</span></div>`).join(''):emptyTable('لم تصل رسائل بعد.')}</div></div></article>
      <article class="panel"><div class="panel-head"><div><h3>صحة المحتوى</h3><p>نقاط سريعة قبل النشر النهائي.</p></div></div><div class="panel-body"><div class="list-stack">
        ${healthRow('الشعار',!!S.content.site.logo,'قابل للتغيير من الهوية')}
        ${healthRow('بيانات الهاتف',!String(S.content.site.contact.phones?.[0]||'').includes('000 0000'),'أدخل رقم الشركة الرسمي')}
        ${healthRow('الشهادات الرسمية',!(S.content.certificates||[]).some(x=>x.placeholder),'ارفع الوثائق الحقيقية')}
        ${healthRow('SEO',!!local(S.content.site.seo.description),'وصف متاح للغة الحالية')}
      </div></div></article>
    </div>
  </section>`;
}
function healthRow(label,ok,note){return `<div class="list-row"><span class="list-icon">${icon(ok?'check':'alertTriangle')}</span><div><strong>${esc(label)}</strong><small>${esc(note)}</small></div><span class="table-status ${ok?'':'new'}">${ok?'مكتمل':'مطلوب'}</span></div>`}

/* Landing */
function renderLanding(){
  const h=S.content.site.hero;
  return `<section class="admin-view">
    ${viewHeader('الواجهة الرئيسية','قسم العرض الرئيسي كبير وديناميكي؛ كل شريحة يمكن أن تكون صورة أو فيديو مع نصوص مستقلة لكل لغة.',`<button class="a-btn a-btn-primary" data-action="hero-add">${icon('plus')}إضافة شريحة</button><button class="a-btn a-btn-secondary" data-action="save">${icon('save')}حفظ الآن</button>`)}
    <div class="hero-settings">
      <div class="form-card">${inputField('الارتفاع الأدنى (px)','site.hero.minHeight',h.minHeight,{type:'number',min:620,max:1100})}</div>
      <div class="form-card">${inputField('مدة الشريحة (ms)','site.hero.interval',h.interval,{type:'number',min:3500,max:20000})}</div>
      <div class="form-card">${switchField('تشغيل تلقائي','site.hero.autoplay','يبدأ الانتقال تلقائيًا ويمكن للزائر إيقافه.')}</div>
    </div>
    <div class="inline-note" style="margin-bottom:17px">${icon('video')}<span>لأفضل أداء: استخدم فيديو MP4/WebM قصيرًا بلا صوت مع صورة Poster، وحافظ على حجم مناسب. عند تعذر تشغيل الفيديو تظهر صورة الـPoster.</span></div>
    <div class="hero-slide-list">${(h.slides||[]).map((s,i)=>heroCard(s,i)).join('')}</div>
  </section>`;
}
function heroCard(s,i){
  const preview=s.type==='video'?`<video muted loop playsinline poster="${attr(s.poster||'')}"><source src="${attr(s.media)}"></video>`:`<img src="${attr(s.media)}" alt="">`;
  return `<article class="hero-editor-card">
    <div class="hero-preview">${preview}<span class="media-tag">${icon(s.type==='video'?'video':'image')}${s.type==='video'?'فيديو':'صورة'}</span></div>
    <div class="hero-editor-copy"><h3>${esc(local(s.title)||'شريحة بلا عنوان')}</h3><p>${esc(local(s.text)||'أضف وصف الشريحة باللغة الحالية.')}</p><div class="hero-meta">${statusPill(s.enabled!==false?'مفعلة':'موقوفة',s.enabled!==false?'':'off')}${statusPill(`ترتيب ${i+1}`,'off')}</div></div>
    <div class="hero-editor-actions">
      <button class="a-btn a-btn-secondary a-btn-icon" data-action="hero-edit" data-index="${i}" title="تعديل">${icon('edit')}</button>
      <button class="a-btn a-btn-soft a-btn-icon" data-action="hero-toggle" data-index="${i}" title="تشغيل/إيقاف">${icon(s.enabled!==false?'eyeOff':'eye')}</button>
      <button class="a-btn a-btn-secondary a-btn-icon" data-action="hero-up" data-index="${i}" title="أعلى" ${i===0?'disabled':''}>${icon('arrowUp')}</button>
      <button class="a-btn a-btn-secondary a-btn-icon" data-action="hero-down" data-index="${i}" title="أسفل" ${i===(S.content.site.hero.slides.length-1)?'disabled':''}>${icon('arrowDown')}</button>
      <button class="a-btn a-btn-danger a-btn-icon" data-action="hero-delete" data-index="${i}" title="حذف">${icon('trash')}</button>
    </div>
  </article>`;
}

/* Identity */
function renderIdentity(){
  const s=S.content.site;
  return `<section class="admin-view">
    ${viewHeader('هوية الموقع','الشعار واسم الشركة والعبارة التعريفية والألوان المستخدمة في الموقع.',`<button class="a-btn a-btn-primary" data-action="save">${icon('save')}حفظ الهوية</button>`)}
    <div class="panel" style="margin-bottom:20px"><div class="panel-head"><div><h3>شعار الشركة</h3><p>يمكن رفع PNG أو WebP، ويظهر في الهيدر والفوتر ولوحة التحكم.</p></div></div><div class="panel-body">
      <div class="logo-editor"><div><div class="logo-preview"><img src="${attr(s.logo)}" alt=""></div><div class="logo-preview dark" style="margin-top:12px"><img src="${attr(s.logo)}" alt=""></div></div>
      <div class="form-section">${uploadBox('site.logo','logos','image/png,image/jpeg,image/webp','رفع شعار جديد')}${inputField('رابط الشعار','site.logo',s.logo,{hint:'يمكن استخدام ملف مرفوع أو رابط داخلي.'})}<div class="inline-note warn">${icon('alertTriangle')}<span>استخدم شعارًا بخلفية شفافة ومساحة أفقية مناسبة. اسم الشركة الرسمي يبقى كما هو في جميع اللغات.</span></div></div></div>
    </div></div>
    <div class="form-grid">
      <div class="form-card">${inputField('اسم الشركة الرسمي','site.companyName',s.companyName,{full:true,hint:'لا تتم ترجمته عند تغيير اللغة.'})}</div>
      <div class="form-card">${inputField('العبارة التعريفية',`site.tagline.${S.lang}`,get(`site.tagline.${S.lang}`),{localized:true})}</div>
      <div class="form-card full"><h3>ألوان الهوية</h3><div class="form-grid three">
        ${inputField('الأخضر الرئيسي','site.theme.primary',s.theme.primary,{type:'color'})}
        ${inputField('الأخضر الداكن','site.theme.dark',s.theme.dark,{type:'color'})}
        ${inputField('اللون المساعد','site.theme.accent',s.theme.accent,{type:'color'})}
      </div><div class="inline-note" style="margin-top:15px">${icon('palette')}<span>الثيم العام مبني على الأبيض والأخضر، وهذه القيم تُحفظ لاستخدامها عند توسيع نظام الثيم.</span></div></div>
    </div>
  </section>`;
}

/* Contact */
function renderContact(){
  const c=S.content.site.contact,social=c.social||{};
  return `<section class="admin-view">
    ${viewHeader('التواصل والفوتر','بيانات تظهر في الفوتر وصفحة التواصل وأزرار الاتصال السريع.',`<button class="a-btn a-btn-primary" data-action="save">${icon('save')}حفظ البيانات</button>`)}
    <div class="form-grid">
      <div class="form-card"><h3>بيانات الاتصال الأساسية</h3><div class="form-section">
        ${inputField('رقم الهاتف','site.contact.phones.0',c.phones?.[0]||'',{type:'tel',hint:'أدخل رقم الشركة متضمنًا كود الدولة.'})}
        ${inputField('البريد العام','site.contact.email',c.email,{type:'email'})}
        ${inputField('بريد التصدير','site.contact.exportEmail',c.exportEmail,{type:'email'})}
        ${inputField('رقم WhatsApp','site.contact.whatsapp',c.whatsapp,{type:'tel',hint:'اكتب كود الدولة بدون مسافات إن أمكن.'})}
      </div></div>
      <div class="form-card"><h3>العنوان وساعات العمل</h3><div class="form-section">
        ${inputField('العنوان',`site.contact.address.${S.lang}`,get(`site.contact.address.${S.lang}`),{localized:true,type:'textarea'})}
        ${inputField('ساعات العمل',`site.contact.hours.${S.lang}`,get(`site.contact.hours.${S.lang}`),{localized:true})}
      </div></div>
      <div class="form-card full"><h3>الخريطة</h3><div class="form-grid">
        ${inputField('رابط تضمين الخريطة','site.contact.mapEmbed',c.mapEmbed,{full:true,hint:'يفضل رابط Google Maps بصيغة output=embed.'})}
        ${inputField('رابط فتح الموقع','site.contact.mapLink',c.mapLink,{full:true})}
      </div></div>
      <div class="form-card full"><h3>وسائل التواصل الاجتماعي</h3><div class="form-grid">
        ${inputField('Facebook','site.contact.social.facebook',social.facebook||'',{type:'url'})}
        ${inputField('Instagram','site.contact.social.instagram',social.instagram||'',{type:'url'})}
        ${inputField('LinkedIn','site.contact.social.linkedin',social.linkedin||'',{type:'url'})}
        ${inputField('YouTube','site.contact.social.youtube',social.youtube||'',{type:'url'})}
      </div></div>
      <div class="form-card full"><h3>نص الفوتر</h3>${inputField('نبذة مختصرة',`site.footer.summary.${S.lang}`,get(`site.footer.summary.${S.lang}`),{localized:true,type:'textarea',full:true})}${switchField('عرض الخريطة في الفوتر','site.footer.showMap','يتم تحميل الخريطة عند الحاجة للحفاظ على الأداء.')}</div>
    </div>
  </section>`;
}

/* Products */
function renderProducts(){
  const items=S.content.products||[];
  return `<section class="admin-view">
    ${viewHeader('المنتجات','منتجات غير محدودة مع صور ووصف ومواصفات وتعبئة بأربع لغات.',`<button class="a-btn a-btn-primary" data-action="product-add">${icon('plus')}منتج جديد</button><button class="a-btn a-btn-secondary" data-action="save">${icon('save')}حفظ</button>`)}
    <div class="panel table-panel">
      <div class="table-toolbar"><label class="table-search">${icon('search')}<input id="table-search" placeholder="بحث بالاسم أو الرابط..." value="${attr(S.search)}"></label><span class="text-muted">${items.length} منتج</span></div>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>المنتج</th><th>التصنيف</th><th>الحالة</th><th>مميز</th><th>التعبئة</th><th></th></tr></thead><tbody>
        ${items.map((p,i)=>`<tr data-search-row="${attr((local(p.name)+' '+p.slug).toLowerCase())}">
          <td><div class="table-product"><img class="table-thumb" src="${attr(p.image)}" alt=""><div><strong>${esc(local(p.name)||'منتج بلا اسم')}</strong><small dir="ltr">/${esc(p.slug)}</small></div></div></td>
          <td>${esc(local(S.content.categories.find(c=>c.id===p.category)?.name)||p.category)}</td>
          <td><span class="table-status ${p.status==='draft'?'draft':''}">${p.status==='draft'?'مسودة':'منشور'}</span></td>
          <td>${p.featured?icon('star'):'—'}</td><td>${esc(short(local(p.packaging)))}</td>
          <td><div class="table-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="product-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="product-delete" data-index="${i}">${icon('trash')}</button></div></td>
        </tr>`).join('')}
      </tbody></table></div>
    </div>
  </section>`;
}

/* Categories */
function renderCategories(){
  const items=S.content.categories||[];
  return `<section class="admin-view">
    ${viewHeader('تصنيفات المنتجات','التصنيفات المستخدمة في الفلاتر وبطاقات الصفحة الرئيسية.',`<button class="a-btn a-btn-primary" data-action="category-add">${icon('plus')}تصنيف جديد</button>`)}
    <div class="collection-grid">${items.map((x,i)=>`<article class="collection-card"><div class="collection-cover"><img src="${attr(x.image)}" alt=""></div><div class="collection-body"><h3>${esc(local(x.name)||'تصنيف بلا اسم')}</h3><p dir="ltr">${esc(x.slug)}</p><div class="collection-foot"><small>${esc(x.id)}</small><div class="collection-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="category-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="category-delete" data-index="${i}">${icon('trash')}</button></div></div></div></article>`).join('')}</div>
  </section>`;
}

/* Company content */
function renderContent(){
  const c=S.content;
  return `<section class="admin-view">
    ${viewHeader('محتوى الشركة','النصوص الأساسية للصفحة الرئيسية وصفحة من نحن والقدرات.',`<button class="a-btn a-btn-primary" data-action="save">${icon('save')}حفظ المحتوى</button><button class="a-btn a-btn-secondary" data-action="capability-add">${icon('plus')}قدرة جديدة</button>`)}
    <div class="form-grid">
      <div class="form-card"><h3>مقدمة الصفحة الرئيسية ${langLabel()}</h3><div class="form-section">
        ${inputField('العنوان الصغير',`home.intro.eyebrow.${S.lang}`,get(`home.intro.eyebrow.${S.lang}`),{localized:true})}
        ${inputField('العنوان الرئيسي',`home.intro.title.${S.lang}`,get(`home.intro.title.${S.lang}`),{localized:true,type:'textarea'})}
        ${inputField('النص',`home.intro.text.${S.lang}`,get(`home.intro.text.${S.lang}`),{localized:true,type:'textarea'})}
      </div></div>
      <div class="form-card"><h3>صفحة من نحن ${langLabel()}</h3><div class="form-section">
        ${inputField('العنوان',`about.title.${S.lang}`,get(`about.title.${S.lang}`),{localized:true})}
        ${inputField('المقدمة',`about.lead.${S.lang}`,get(`about.lead.${S.lang}`),{localized:true,type:'textarea'})}
        ${inputField('النص الكامل',`about.body.${S.lang}`,get(`about.body.${S.lang}`),{localized:true,type:'textarea'})}
      </div></div>
      <div class="form-card full"><h3>منهج الجودة ${langLabel()}</h3><div class="form-grid">
        ${inputField('العنوان',`home.quality.title.${S.lang}`,get(`home.quality.title.${S.lang}`),{localized:true})}
        ${inputField('النص',`home.quality.text.${S.lang}`,get(`home.quality.text.${S.lang}`),{localized:true,type:'textarea'})}
      </div></div>
    </div>
    <div class="panel" style="margin-top:20px"><div class="panel-head"><div><h3>القدرات التشغيلية</h3><p>تظهر في الصفحة الرئيسية ومن نحن.</p></div></div><div class="panel-body"><div class="collection-grid">${(c.capabilities||[]).map((x,i)=>simpleCollectionCard(x,i,'capability')).join('')}</div></div></div>
  </section>`;
}
function simpleCollectionCard(x,i,type){
  return `<article class="collection-card"><div class="collection-body"><span class="metric-icon">${icon(x.icon||'leaf')}</span><h3 style="margin-top:13px">${esc(local(x.title)||'عنصر بلا عنوان')}</h3><p>${esc(local(x.text)||'')}</p><div class="collection-foot"><small>${esc(x.icon||'')}</small><div class="collection-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="${type}-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="${type}-delete" data-index="${i}">${icon('trash')}</button></div></div></div></article>`;
}

/* Generic collections */
function renderCertificates(){
  const items=S.content.certificates||[];
  return `<section class="admin-view">${viewHeader('الشهادات والاعتمادات','ارفع الملفات والصور الرسمية بدل المحتوى التمهيدي.',`<button class="a-btn a-btn-primary" data-action="certificate-add">${icon('plus')}إضافة شهادة</button>`)}
    <div class="collection-grid">${items.map((x,i)=>`<article class="collection-card"><div class="collection-cover"><img src="${attr(x.image)}" alt=""></div><div class="collection-body"><h3>${esc(local(x.title)||'شهادة بلا عنوان')}</h3><p>${esc(local(x.text)||'')}</p><div class="collection-foot"><small>${x.placeholder?'تمهيدي':'رسمي'}</small><div class="collection-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="certificate-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="certificate-delete" data-index="${i}">${icon('trash')}</button></div></div></div></article>`).join('')}</div>
  </section>`;
}
function renderAchievements(){
  const items=S.content.achievements||[];
  return `<section class="admin-view">${viewHeader('الإنجازات','محطات زمنية يمكن إضافتها أو حذفها أو تحديثها.',`<button class="a-btn a-btn-primary" data-action="achievement-add">${icon('plus')}إضافة إنجاز</button>`)}
    <div class="panel"><div class="panel-body"><div class="list-stack">${items.map((x,i)=>`<div class="list-row"><span class="list-icon">${icon('award')}</span><div><strong>${esc(local(x.title)||'إنجاز بلا عنوان')}</strong><small>${esc(local(x.text)||'')}</small></div><div class="table-actions"><span class="list-value">${esc(x.year)}</span><button class="a-btn a-btn-secondary a-btn-icon" data-action="achievement-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="achievement-delete" data-index="${i}">${icon('trash')}</button></div></div>`).join('')}</div></div></div>
  </section>`;
}
function renderNews(){
  const items=S.content.news||[];
  return `<section class="admin-view">${viewHeader('الأخبار والمقالات','محتوى معرفي متعدد اللغات يدعم الظهور العضوي وثقة المشتري.',`<button class="a-btn a-btn-primary" data-action="news-add">${icon('plus')}مقال جديد</button>`)}
    <div class="collection-grid">${items.map((x,i)=>`<article class="collection-card"><div class="collection-cover"><img src="${attr(x.image)}" alt=""></div><div class="collection-body"><h3>${esc(local(x.title)||'مقال بلا عنوان')}</h3><p>${esc(local(x.excerpt)||'')}</p><div class="collection-foot"><small>${esc(fmtDate(x.date))}</small><div class="collection-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="news-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="news-delete" data-index="${i}">${icon('trash')}</button></div></div></div></article>`).join('')}</div>
  </section>`;
}
function renderFaq(){
  const items=S.content.faqs||[];
  return `<section class="admin-view">${viewHeader('الأسئلة الشائعة','أسئلة وإجابات تساعد المشتري على تجهيز طلبه.',`<button class="a-btn a-btn-primary" data-action="faq-add">${icon('plus')}إضافة سؤال</button>`)}
    <div class="panel"><div class="panel-body"><div class="list-stack">${items.map((x,i)=>`<div class="list-row"><span class="list-icon">${icon('circleHelp')}</span><div><strong>${esc(local(x.q)||'سؤال بلا عنوان')}</strong><small>${esc(short(local(x.a)))}</small></div><div class="table-actions"><button class="a-btn a-btn-secondary a-btn-icon" data-action="faq-edit" data-index="${i}">${icon('edit')}</button><button class="a-btn a-btn-danger a-btn-icon" data-action="faq-delete" data-index="${i}">${icon('trash')}</button></div></div>`).join('')}</div></div></div>
  </section>`;
}

/* SEO */
function renderSeo(){
  const seo=S.content.site.seo;
  return `<section class="admin-view">${viewHeader('SEO والتحليلات','بيانات ديناميكية حسب اللغة مع Sitemap وRobots وCanonical وhreflang.',`<button class="a-btn a-btn-primary" data-action="save">${icon('save')}حفظ SEO</button>`)}
    <div class="form-grid">
      <div class="form-card full"><h3>بيانات محركات البحث ${langLabel()}</h3><div class="form-grid">
        ${inputField('Meta Title',`site.seo.title.${S.lang}`,get(`site.seo.title.${S.lang}`),{localized:true,full:true,hint:'يفضل أن يكون واضحًا ومحددًا للنشاط والسوق.'})}
        ${inputField('Meta Description',`site.seo.description.${S.lang}`,get(`site.seo.description.${S.lang}`),{localized:true,type:'textarea',full:true})}
      </div></div>
      <div class="form-card"><h3>صورة المشاركة</h3><img src="${attr(seo.socialImage)}" alt="" style="width:100%;height:190px;object-fit:cover;border-radius:13px;margin-bottom:14px">${uploadBox('site.seo.socialImage','documents','image/png,image/jpeg,image/webp','رفع صورة Open Graph')}</div>
      <div class="form-card"><h3>أكواد القياس</h3><div class="form-section">
        ${inputField('Google Analytics 4 ID','site.seo.googleAnalyticsId',seo.googleAnalyticsId,{placeholder:'G-XXXXXXXXXX'})}
        ${inputField('Search Console Verification','site.seo.searchConsoleVerification',seo.searchConsoleVerification,{placeholder:'verification token'})}
        <div class="inline-note">${icon('search')}<span>ملفات <bdi>/sitemap.xml</bdi> و<bdi>/robots.txt</bdi> يتم توليدها تلقائيًا بواسطة الخادم.</span></div>
      </div></div>
    </div>
  </section>`;
}

/* Messages and quotes */
async function ensureMessages(){
  if(!S.messages.length){try{S.messages=(await api('/api/admin/messages')).items}catch(e){toast(errorText(e),'error')}}
}
async function ensureQuotes(){
  if(!S.quotes.length){try{S.quotes=(await api('/api/admin/quotes')).items}catch(e){toast(errorText(e),'error')}}
}
function renderMessages(){
  return `<section class="admin-view">${viewHeader('رسائل التواصل','الرسائل الواردة من نموذج الموقع.',`<button class="a-btn a-btn-secondary" data-action="messages-refresh">${icon('refresh')}تحديث</button>`)}
    <div>${S.messages.length?S.messages.map(m=>`<article class="message-card ${m.read?'':'unread'}"><div><div class="message-head"><span class="user-avatar">${esc((m.name||'?').charAt(0))}</span><div><strong>${esc(m.name)}</strong><small>${esc(m.email)} ${m.company?' • '+esc(m.company):''}</small></div></div><div class="message-subject">${esc(m.subject||'بدون موضوع')}</div><div class="message-text">${esc(m.message)}</div><div class="message-meta"><span>${icon('phone')}${esc(m.phone||'بدون هاتف')}</span><span>${icon('calendar')}${esc(fmtDate(m.createdAt))}</span><span>${esc((m.language||'').toUpperCase())}</span></div></div><div class="message-actions"><button class="a-btn a-btn-soft" data-action="message-read" data-id="${attr(m.id)}">${icon(m.read?'check':'eye')}${m.read?'مقروء':'تحديد كمقروء'}</button></div></article>`).join(''):emptyTable('لا توجد رسائل حتى الآن.')}</div>
  </section>`;
}
function renderQuotes(){
  return `<section class="admin-view">${viewHeader('طلبات عروض الأسعار','طلبات منظمة تحتوي على المنتج والتعبئة والكمية والوجهة.',`<button class="a-btn a-btn-secondary" data-action="quotes-refresh">${icon('refresh')}تحديث</button>`)}
    <div class="panel table-panel"><div class="data-table-wrap"><table class="data-table"><thead><tr><th>العميل</th><th>المنتج</th><th>الكمية</th><th>الوجهة</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>
      ${S.quotes.map(q=>`<tr><td><div class="table-product"><span class="user-avatar">${esc((q.name||'?').charAt(0))}</span><div><strong>${esc(q.name)}</strong><small>${esc(q.company||q.email)}</small></div></div></td><td>${esc(q.product||'—')}<br><small class="text-muted">${esc(q.packaging||'')}</small></td><td>${esc(q.quantity||'—')}</td><td>${esc(q.destination||q.country||'—')}</td><td>${esc(fmtDate(q.createdAt))}</td><td><select class="content-lang" data-quote-status="${attr(q.id)}"><option value="new" ${q.status==='new'?'selected':''}>جديد</option><option value="reviewing" ${q.status==='reviewing'?'selected':''}>قيد المراجعة</option><option value="quoted" ${q.status==='quoted'?'selected':''}>تم التسعير</option><option value="closed" ${q.status==='closed'?'selected':''}>مغلق</option><option value="archived" ${q.status==='archived'?'selected':''}>مؤرشف</option></select></td></tr>`).join('')}
    </tbody></table>${S.quotes.length?'':emptyTable('لا توجد طلبات أسعار بعد.')}</div></div>
  </section>`;
}

/* Settings */
function renderSettings(){
  const adminUrl=`${location.origin}/eslammm`;
  return `<section class="admin-view">${viewHeader('الإعدادات والأمان','إدارة الوصول وكلمة المرور والنسخ الاحتياطي.',`<a class="a-btn a-btn-secondary" href="/api/admin/backup">${icon('download')}تنزيل نسخة احتياطية</a>`)}
    <div class="security-grid">
      <div class="form-card"><h3>مسار لوحة التحكم</h3><div class="route-box">${icon('shieldCheck')}<code>${esc(adminUrl)}</code><p>المسار منفصل عن روابط الموقع العامة ومحمي بتسجيل الدخول والجلسة.</p></div></div>
      <div class="form-card"><h3>تغيير كلمة المرور</h3><form id="password-form" class="form-section">
        <div class="field"><label>كلمة المرور الحالية</label><input name="current" type="password" required autocomplete="current-password"></div>
        <div class="field"><label>كلمة المرور الجديدة</label><input name="next" type="password" required minlength="10" autocomplete="new-password"><small>10 أحرف على الأقل، وتتضمن حرفًا كبيرًا وصغيرًا ورقمًا.</small></div>
        <button class="a-btn a-btn-primary" type="submit">${icon('shield')}تحديث كلمة المرور</button>
      </form></div>
      <div class="form-card"><h3>النسخ الاحتياطي</h3><p class="text-muted" style="font-size:.75rem;line-height:1.8">يتضمن ملف النسخة الاحتياطية المحتوى والرسائل وطلبات الأسعار وبيانات الإحصاءات.</p><a class="a-btn a-btn-secondary" href="/api/admin/backup">${icon('download')}تنزيل النسخة الآن</a></div>
      <div class="form-card"><h3>طبقات الحماية</h3><div class="list-stack">
        <div class="list-row"><span class="list-icon">${icon('shieldCheck')}</span><div><strong>جلسة دخول محمية</strong><small>كوكيز HttpOnly والتحقق من CSRF للعمليات الحساسة.</small></div><span class="table-status">مفعّل</span></div>
        <div class="list-row"><span class="list-icon">${icon('upload')}</span><div><strong>تحقق من الملفات</strong><small>أنواع وأحجام الرفع مقيدة قبل الحفظ.</small></div><span class="table-status">مفعّل</span></div>
        <div class="list-row"><span class="list-icon">${icon('refresh')}</span><div><strong>نسخ احتياطي مباشر</strong><small>تصدير البيانات بصيغة JSON من داخل اللوحة.</small></div><span class="table-status">متاح</span></div>
      </div></div>
    </div>
  </section>`;
}

/* View dispatcher */
async function renderView(){
  updateTopbar();
  if(S.view==='messages'){await ensureMessages()}
  if(S.view==='quotes'){await ensureQuotes()}
  let html='';
  switch(S.view){
    case 'dashboard':html=renderDashboard();break;
    case 'landing':html=renderLanding();break;
    case 'identity':html=renderIdentity();break;
    case 'contact':html=renderContact();break;
    case 'products':html=renderProducts();break;
    case 'categories':html=renderCategories();break;
    case 'content':html=renderContent();break;
    case 'certificates':html=renderCertificates();break;
    case 'achievements':html=renderAchievements();break;
    case 'news':html=renderNews();break;
    case 'faq':html=renderFaq();break;
    case 'seo':html=renderSeo();break;
    case 'messages':html=renderMessages();break;
    case 'quotes':html=renderQuotes();break;
    case 'settings':html=renderSettings();break;
    default:html=renderDashboard();
  }
  $('#admin-view').innerHTML=html;window.hydrateIcons?.();
  if(S.view==='products')applyTableSearch();
  if(S.view==='settings')bindPasswordForm();
}

/* Modals */
function openModal(type,index,newItem=false){
  S.modal={type,index,lang:S.lang,newItem};
  renderModal();
}
function closeModal(){
  S.modal=null;$('#admin-modal').className='admin-modal';$('#admin-modal').innerHTML='';document.body.style.overflow='';
}
function modalShell(title,body,wide=false){
  return `<div class="modal-backdrop" data-action="modal-close"></div><div class="modal-dialog ${wide?'wide':''}"><div class="modal-head"><h2>${esc(title)}</h2><button class="modal-close" data-action="modal-close">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="a-btn a-btn-secondary" data-action="modal-close">إغلاق</button><button class="a-btn a-btn-primary" data-action="modal-save">${icon('save')}حفظ وإغلاق</button></div></div>`;
}
function modalLangTabs(){
  return `<div class="modal-tabs">${LANGS.map(([v,l])=>`<button class="modal-tab ${S.modal.lang===v?'active':''}" data-action="modal-lang" data-lang="${v}">${esc(l)}</button>`).join('')}</div>`;
}
function mfield(label,path,opts={}){
  const val=get(path),type=opts.type||'text';
  if(type==='textarea')return `<div class="field ${opts.full?'full':''}"><label>${esc(label)}${opts.localized?`<span class="lang-chip">${S.modal.lang.toUpperCase()}</span>`:''}</label><textarea data-bind="${attr(path)}">${esc(val||'')}</textarea></div>`;
  if(type==='select')return `<div class="field ${opts.full?'full':''}"><label>${esc(label)}</label><select data-bind="${attr(path)}">${opts.options.map(([v,l])=>`<option value="${attr(v)}" ${String(val)===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select></div>`;
  return `<div class="field ${opts.full?'full':''}"><label>${esc(label)}${opts.localized?`<span class="lang-chip">${S.modal.lang.toUpperCase()}</span>`:''}</label><input type="${attr(type)}" data-bind="${attr(path)}" value="${attr(val??'')}"></div>`;
}
function renderModal(){
  if(!S.modal)return;
  const el=$('#admin-modal');el.className='admin-modal open';document.body.style.overflow='hidden';
  const {type,index}=S.modal;
  let title='',body='',wide=false;
  if(type==='hero'){title='تحرير شريحة الواجهة الرئيسية';body=heroModal(index);wide=true}
  else if(type==='product'){title='تحرير المنتج';body=productModal(index);wide=true}
  else if(type==='category'){title='تحرير التصنيف';body=genericModal('categories',index,'category')}
  else if(type==='capability'){title='تحرير القدرة';body=genericModal('capabilities',index,'capability')}
  else if(type==='certificate'){title='تحرير الشهادة';body=genericModal('certificates',index,'certificate');wide=true}
  else if(type==='achievement'){title='تحرير الإنجاز';body=genericModal('achievements',index,'achievement')}
  else if(type==='news'){title='تحرير المقال';body=genericModal('news',index,'news');wide=true}
  else if(type==='faq'){title='تحرير السؤال';body=genericModal('faqs',index,'faq')}
  el.innerHTML=modalShell(title,body,wide);window.hydrateIcons?.();
}
function heroModal(i){
  const base=`site.hero.slides.${i}`,s=get(base),lang=S.modal.lang;
  return `${modalLangTabs()}<div class="media-editor" style="margin-bottom:22px">
    <div class="media-preview-large">${s.type==='video'?`<video controls muted poster="${attr(s.poster||'')}"><source src="${attr(s.media)}"></video>`:`<img src="${attr(s.media)}" alt="">`}</div>
    <div class="media-upload-actions">
      ${mfield('نوع الوسائط',`${base}.type`,{type:'select',options:[['image','صورة'],['video','فيديو']]})}
      ${mfield('رابط الملف',`${base}.media`)}
      ${uploadBox(`${base}.media`,'hero',s.type==='video'?'video/mp4,video/webm':'image/png,image/jpeg,image/webp',s.type==='video'?'رفع فيديو':'رفع صورة')}
      ${s.type==='video'?`${mfield('صورة Poster',`${base}.poster`)}${uploadBox(`${base}.poster`,'hero','image/png,image/jpeg,image/webp','رفع صورة Poster')}`:''}
    </div>
  </div><div class="form-grid">
    ${mfield('العنوان الصغير',`${base}.eyebrow.${lang}`,{localized:true})}
    ${mfield('العنوان الرئيسي',`${base}.title.${lang}`,{localized:true,type:'textarea'})}
    ${mfield('الوصف',`${base}.text.${lang}`,{localized:true,type:'textarea',full:true})}
    ${mfield('نص الزر الأول',`${base}.primaryLabel.${lang}`,{localized:true})}
    ${mfield('رابط الزر الأول',`${base}.primaryUrl`)}
    ${mfield('نص الزر الثاني',`${base}.secondaryLabel.${lang}`,{localized:true})}
    ${mfield('رابط الزر الثاني',`${base}.secondaryUrl`)}
  </div>${switchFieldModal('تفعيل الشريحة',`${base}.enabled`,s.enabled!==false)}`;
}
function switchFieldModal(label,path,checked){
  return `<div class="switch-row" style="margin-top:18px"><div class="switch-copy"><strong>${esc(label)}</strong></div><label class="switch"><input type="checkbox" data-bind="${attr(path)}" ${checked?'checked':''}><span class="switch-track"></span></label></div>`;
}
function productModal(i){
  const base=`products.${i}`,p=get(base),lang=S.modal.lang;
  return `${modalLangTabs()}<div class="media-editor" style="margin-bottom:22px"><div class="media-preview-large"><img src="${attr(p.image)}" alt=""></div><div class="media-upload-actions">${mfield('رابط الصورة الرئيسية',`${base}.image`)}${uploadBox(`${base}.image`,'products','image/png,image/jpeg,image/webp','رفع صورة المنتج')}</div></div>
  <div class="form-grid">
    ${mfield('اسم المنتج',`${base}.name.${lang}`,{localized:true})}
    ${mfield('الرابط Slug',`${base}.slug`)}
    ${mfield('التصنيف',`${base}.category`,{type:'select',options:(S.content.categories||[]).map(c=>[c.id,local(c.name)])})}
    ${mfield('الحالة',`${base}.status`,{type:'select',options:[['published','منشور'],['draft','مسودة']]})}
    ${mfield('وصف مختصر',`${base}.short.${lang}`,{localized:true,type:'textarea',full:true})}
    ${mfield('الوصف الكامل',`${base}.description.${lang}`,{localized:true,type:'textarea',full:true})}
    ${mfield('طرق التعبئة',`${base}.packaging.${lang}`,{localized:true,type:'textarea',full:true})}
  </div>
  ${switchFieldModal('منتج مميز',`${base}.featured`,!!p.featured)}
  <div class="panel" style="margin-top:20px"><div class="panel-head"><div><h3>المواصفات ${lang.toUpperCase()}</h3><p>أضف اسم الخاصية وقيمتها.</p></div><button class="a-btn a-btn-secondary" data-action="spec-add" data-index="${i}">${icon('plus')}إضافة خاصية</button></div><div class="panel-body"><div class="form-section">${(p.specs||[]).map((sp,si)=>`<div class="form-grid" style="align-items:end"><div class="field"><label>الخاصية</label><input data-bind="${base}.specs.${si}.key.${lang}" value="${attr(sp.key?.[lang]||'')}"></div><div class="field"><label>القيمة</label><input data-bind="${base}.specs.${si}.value.${lang}" value="${attr(sp.value?.[lang]||'')}"></div><button class="a-btn a-btn-danger a-btn-icon" data-action="spec-delete" data-index="${i}" data-spec="${si}">${icon('trash')}</button></div>`).join('')||'<p class="text-muted">لا توجد مواصفات بعد.</p>'}</div></div></div>`;
}
function genericModal(collection,i,type){
  const base=`${collection}.${i}`,x=get(base),lang=S.modal.lang;
  let fields='';
  if(type==='category')fields=`${mfield('معرّف التصنيف',`${base}.id`)}${mfield('Slug',`${base}.slug`)}${mfield('الاسم',`${base}.name.${lang}`,{localized:true})}${mfield('رابط الصورة',`${base}.image`)}<div class="full">${uploadBox(`${base}.image`,'products','image/png,image/jpeg,image/webp','رفع صورة التصنيف')}</div>`;
  if(type==='capability')fields=`${mfield('الأيقونة',`${base}.icon`)}${mfield('العنوان',`${base}.title.${lang}`,{localized:true})}${mfield('الوصف',`${base}.text.${lang}`,{localized:true,type:'textarea',full:true})}`;
  if(type==='certificate')fields=`${mfield('الأيقونة',`${base}.icon`)}${mfield('العنوان',`${base}.title.${lang}`,{localized:true})}${mfield('الوصف',`${base}.text.${lang}`,{localized:true,type:'textarea',full:true})}${mfield('رابط الصورة',`${base}.image`)}<div class="full">${uploadBox(`${base}.image`,'documents','image/png,image/jpeg,image/webp','رفع صورة الشهادة')}</div>${switchFieldModal('محتوى تمهيدي',`${base}.placeholder`,!!x.placeholder)}`;
  if(type==='achievement')fields=`${mfield('السنة',`${base}.year`)}${mfield('العنوان',`${base}.title.${lang}`,{localized:true})}${mfield('الوصف',`${base}.text.${lang}`,{localized:true,type:'textarea',full:true})}`;
  if(type==='news')fields=`${mfield('التاريخ',`${base}.date`,{type:'date'})}${mfield('Slug',`${base}.slug`)}${mfield('العنوان',`${base}.title.${lang}`,{localized:true,full:true})}${mfield('المقدمة',`${base}.excerpt.${lang}`,{localized:true,type:'textarea',full:true})}${mfield('نص المقال',`${base}.body.${lang}`,{localized:true,type:'textarea',full:true})}${mfield('رابط الصورة',`${base}.image`)}<div class="full">${uploadBox(`${base}.image`,'documents','image/png,image/jpeg,image/webp','رفع صورة المقال')}</div>`;
  if(type==='faq')fields=`${mfield('السؤال',`${base}.q.${lang}`,{localized:true,type:'textarea',full:true})}${mfield('الإجابة',`${base}.a.${lang}`,{localized:true,type:'textarea',full:true})}`;
  return `${modalLangTabs()}<div class="form-grid">${fields}</div>`;
}

/* Event handling */
async function handleClick(e){
  const viewBtn=e.target.closest('[data-view]');
  if(viewBtn){
    S.view=viewBtn.dataset.view;S.search='';openSidebar(false);await renderView();return;
  }
  const btn=e.target.closest('[data-action]');if(!btn)return;
  const a=btn.dataset.action,idx=Number(btn.dataset.index);
  if(a==='sidebar-toggle'){openSidebar(!$('#admin-sidebar').classList.contains('open'));return}
  if(a==='logout'){try{await api('/api/auth/logout',{method:'POST'})}catch{}S.user=null;S.csrf='';loginScreen();return}
  if(a==='save'){await saveContent(false);return}
  if(a==='modal-close'){closeModal();return}
  if(a==='modal-save'){await saveContent(false);closeModal();renderView();return}
  if(a==='modal-lang'){S.modal.lang=btn.dataset.lang;renderModal();return}
  if(a==='hero-add'){const arr=S.content.site.hero.slides;arr.push(blankHero());markDirty();openModal('hero',arr.length-1,true);return}
  if(a==='hero-edit'){openModal('hero',idx);return}
  if(a==='hero-toggle'){const x=S.content.site.hero.slides[idx];x.enabled=x.enabled===false;markDirty();renderView();return}
  if(a==='hero-up'||a==='hero-down'){const arr=S.content.site.hero.slides,to=a==='hero-up'?idx-1:idx+1;if(to>=0&&to<arr.length){[arr[idx],arr[to]]=[arr[to],arr[idx]];markDirty();renderView()}return}
  if(a==='hero-delete'){if(confirmAction('حذف هذه الشريحة؟')){S.content.site.hero.slides.splice(idx,1);markDirty();renderView()}return}
  if(a==='product-add'){S.content.products.push(blankProduct());markDirty();openModal('product',S.content.products.length-1,true);return}
  if(a==='product-edit'){openModal('product',idx);return}
  if(a==='product-delete'){if(confirmAction('حذف المنتج نهائيًا؟')){S.content.products.splice(idx,1);markDirty();renderView()}return}
  if(a==='category-add'){S.content.categories.push(blankCategory());markDirty();openModal('category',S.content.categories.length-1,true);return}
  if(a==='category-edit'){openModal('category',idx);return}
  if(a==='category-delete'){if(confirmAction('حذف التصنيف؟ تأكد أن المنتجات لا تعتمد عليه.')){S.content.categories.splice(idx,1);markDirty();renderView()}return}
  if(a==='capability-add'){S.content.capabilities.push(blankCapability());markDirty();openModal('capability',S.content.capabilities.length-1,true);return}
  if(a==='capability-edit'){openModal('capability',idx);return}
  if(a==='capability-delete'){if(confirmAction('حذف هذه القدرة؟')){S.content.capabilities.splice(idx,1);markDirty();renderView()}return}
  if(a==='certificate-add'){S.content.certificates.push(blankCertificate());markDirty();openModal('certificate',S.content.certificates.length-1,true);return}
  if(a==='certificate-edit'){openModal('certificate',idx);return}
  if(a==='certificate-delete'){if(confirmAction('حذف هذا العنصر؟')){S.content.certificates.splice(idx,1);markDirty();renderView()}return}
  if(a==='achievement-add'){S.content.achievements.push(blankAchievement());markDirty();openModal('achievement',S.content.achievements.length-1,true);return}
  if(a==='achievement-edit'){openModal('achievement',idx);return}
  if(a==='achievement-delete'){if(confirmAction('حذف هذا الإنجاز؟')){S.content.achievements.splice(idx,1);markDirty();renderView()}return}
  if(a==='news-add'){S.content.news.push(blankNews());markDirty();openModal('news',S.content.news.length-1,true);return}
  if(a==='news-edit'){openModal('news',idx);return}
  if(a==='news-delete'){if(confirmAction('حذف المقال؟')){S.content.news.splice(idx,1);markDirty();renderView()}return}
  if(a==='faq-add'){S.content.faqs.push(blankFaq());markDirty();openModal('faq',S.content.faqs.length-1,true);return}
  if(a==='faq-edit'){openModal('faq',idx);return}
  if(a==='faq-delete'){if(confirmAction('حذف السؤال؟')){S.content.faqs.splice(idx,1);markDirty();renderView()}return}
  if(a==='spec-add'){const p=S.content.products[idx];p.specs=p.specs||[];p.specs.push({key:langsEmpty(),value:langsEmpty()});markDirty();renderModal();return}
  if(a==='spec-delete'){S.content.products[idx].specs.splice(Number(btn.dataset.spec),1);markDirty();renderModal();return}
  if(a==='messages-refresh'){S.messages=[];await ensureMessages();renderView();return}
  if(a==='quotes-refresh'){S.quotes=[];await ensureQuotes();renderView();return}
  if(a==='message-read'){try{await api('/api/admin/messages/'+encodeURIComponent(btn.dataset.id),{method:'PATCH',body:{read:true,status:'read'}});S.messages=[];await ensureMessages();await loadDashboard(false);renderView();toast('تم تحديث الرسالة')}catch(ex){toast(errorText(ex),'error')}return}
}
function handleInput(e){
  const el=e.target;
  if(el.id==='table-search'){S.search=el.value;applyTableSearch();return}
  if(!el.dataset.bind)return;
  let value=el.type==='checkbox'?el.checked:el.value;
  if(el.type==='number')value=Number(value);
  set(el.dataset.bind,value);markDirty();
}
async function handleChange(e){
  const el=e.target;
  if(el.dataset.uploadTarget){await uploadFile(el);return}
  if(el.dataset.quoteStatus){
    try{await api('/api/admin/quotes/'+encodeURIComponent(el.dataset.quoteStatus),{method:'PATCH',body:{status:el.value}});const q=S.quotes.find(x=>x.id===el.dataset.quoteStatus);if(q)q.status=el.value;await loadDashboard(false);toast('تم تحديث حالة الطلب')}
    catch(ex){toast(errorText(ex),'error')}
  }
}
async function uploadFile(input){
  const file=input.files?.[0];if(!file)return;
  const target=input.dataset.uploadTarget,category=input.dataset.uploadCategory||'documents';
  const label=input.closest('.upload-box');if(label)label.style.opacity='.55';
  try{
    const dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
    const out=await api('/api/admin/upload',{method:'POST',body:{filename:file.name,dataUrl,category}});
    set(target,out.url);markDirty();toast('تم رفع الملف');
    if(S.modal)renderModal();else renderView();
    const logo=$('.sidebar-brand img');if(target==='site.logo'&&logo)logo.src=out.url;
  }catch(ex){toast(errorText(ex),'error')}finally{if(label)label.style.opacity='1';input.value=''}
}
function applyTableSearch(){
  const term=String(S.search||'').toLowerCase().trim();
  $$('[data-search-row]').forEach(row=>row.style.display=!term||row.dataset.searchRow.includes(term)?'':'none');
}
function bindPasswordForm(){
  $('#password-form')?.addEventListener('submit',async e=>{
    e.preventDefault();const btn=e.currentTarget.querySelector('button');btn.disabled=true;
    try{await api('/api/admin/change-password',{method:'POST',body:Object.fromEntries(new FormData(e.currentTarget).entries())});e.currentTarget.reset();toast('تم تغيير كلمة المرور بنجاح')}
    catch(ex){toast(errorText(ex),'error')}finally{btn.disabled=false}
  });
}

/* Blank records */
function langsEmpty(value=''){return {ar:value,en:value,es:value,it:value}}
function blankHero(){return {id:makeId('hero'),enabled:true,type:'image',media:'/assets/images/hero-groves.webp',poster:'/assets/images/hero-groves.webp',eyebrow:langsEmpty(),title:langsEmpty('عنوان جديد'),text:langsEmpty(),primaryLabel:langsEmpty('استكشف المنتجات'),primaryUrl:'/products',secondaryLabel:langsEmpty('طلب عرض سعر'),secondaryUrl:'/quote'}}
function blankProduct(){return {id:makeId('p'),slug:'new-product-'+Date.now(),category:S.content.categories?.[0]?.id||'green',featured:false,status:'draft',name:langsEmpty('منتج جديد'),short:langsEmpty(),description:langsEmpty(),image:'/assets/images/product-whole-green.webp',gallery:[],packaging:langsEmpty(),specs:[]}}
function blankCategory(){return {id:makeId('cat'),slug:'new-category-'+Date.now(),name:langsEmpty('تصنيف جديد'),image:'/assets/images/category-green.webp'}}
function blankCapability(){return {icon:'package',title:langsEmpty('قدرة جديدة'),text:langsEmpty()}}
function blankCertificate(){return {id:makeId('cert'),icon:'shieldCheck',title:langsEmpty('شهادة جديدة'),text:langsEmpty(),image:'/assets/images/certificate-placeholder.webp',placeholder:true}}
function blankAchievement(){return {id:makeId('ach'),year:String(new Date().getFullYear()),title:langsEmpty('إنجاز جديد'),text:langsEmpty()}}
function blankNews(){return {id:makeId('news'),slug:'new-article-'+Date.now(),date:new Date().toISOString().slice(0,10),image:'/assets/images/news-supplier.webp',title:langsEmpty('مقال جديد'),excerpt:langsEmpty(),body:langsEmpty()}}
function blankFaq(){return {id:makeId('faq'),q:langsEmpty('سؤال جديد'),a:langsEmpty()}}

/* Boot */
async function boot(){
  try{
    const me=await api('/api/admin/me');S.user=me.user;S.csrf=me.csrf;await loadApp();
  }catch(e){loginScreen()}
}
document.addEventListener('DOMContentLoaded',boot);
})();