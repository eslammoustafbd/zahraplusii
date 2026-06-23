(() => {
'use strict';

const LANGS=['ar','en','es','it'];
const langNames={ar:'العربية',en:'English',es:'Español',it:'Italiano'};
const ui={
  ar:{
    home:'الرئيسية',about:'من نحن',products:'منتجاتنا',catalog:'الكتالوج',certifications:'الشهادات',achievements:'الإنجازات',news:'المعرفة',faq:'الأسئلة الشائعة',contact:'اتصل بنا',quote:'طلب عرض سعر',
    explore:'استكشف',viewAll:'عرض الكل',featured:'منتج مميز',all:'الكل',searchProducts:'ابحث عن منتج',noProducts:'لا توجد منتجات مطابقة.',
    capabilities:'قدراتنا',packaging:'خيارات التعبئة',quality:'منهج الجودة',markets:'خدمة أسواق التصدير',insights:'محتوى يساعدك على اتخاذ قرار أفضل',
    qualityEyebrow:'جودة يمكن متابعتها',qualityTitle:'خطوات واضحة من استلام المنتج حتى التجهيز للشحن',
    qualityText:'نحوّل متطلبات الطلب إلى نقاط تنفيذ ومراجعة، بحيث يكون الحوار حول المنتج أكثر دقة قبل بدء التوريد.',
    step1:'تأكيد المواصفة والعينة المرجعية',step1t:'الحجم والشكل والطعم والملوحة والوزن والتعبئة.',
    step2:'التجهيز والفحص أثناء العمل',step2t:'متابعة التجانس والعبوة والبيانات في نقاط محددة.',
    step3:'المراجعة قبل الشحن',step3t:'مراجعة الكميات والعلامات وتجهيز مستندات الطلب.',
    trustLead:'حلول عملية للمستوردين والموزعين والعلامات الخاصة',
    trust1:'مواصفات قابلة للتخصيص',trust2:'تعبئة للتجزئة والجملة',trust3:'دعم متعدد اللغات',trust4:'متابعة موجهة للتصدير',
    marketTitle:'نتحدث لغة السوق قبل أن نعبّئ المنتج',marketText:'نوفر تجربة محتوى وتواصل بالعربية والإنجليزية والإسبانية والإيطالية، ونبني عرض المنتج حول متطلبات الوجهة وقناة البيع.',
    marketCore:'دعم موجه للأسواق العالمية',market1:'مستوردون وموزعون',market2:'علامات خاصة',market3:'خدمات غذائية',market4:'مصانع إعادة التعبئة',
    ctaTitle:'لديك مواصفة أو سوق مستهدف؟ لنحوّلها إلى طلب واضح.',ctaText:'أرسل تفاصيل المنتج والعبوة والكمية والوجهة، وسيساعدك النموذج على جمع المعلومات الأساسية قبل التواصل التجاري.',
    readMore:'اقرأ المزيد',downloadCatalog:'تحميل الكتالوج',printBrochure:'طباعة / حفظ PDF',companyProfile:'بروفايل الشركة',
    quickLinks:'روابط سريعة',productsFooter:'المنتجات',contactInfo:'بيانات التواصل',location:'الموقع',openMap:'فتح الخريطة',copyright:'جميع الحقوق محفوظة.',
    phone:'الهاتف',email:'البريد',exportEmail:'بريد التصدير',address:'العنوان',hours:'ساعات العمل',whatsapp:'واتساب',language:'اللغة',
    scroll:'استكشف',prev:'السابق',next:'التالي',pause:'إيقاف',play:'تشغيل',
    pageAboutTitle:'شركة غذائية تبني التوريد على الوضوح والجودة',pageAboutSub:'تعرف على طريقة عملنا والقيم التي توجه تجهيز المنتجات وخدمة العملاء.',
    ourStory:'قصتنا وطريقة عملنا',values:'قيمنا في العمل',whyUs:'لماذا Zahrat El-Rabea؟',
    pageProductsTitle:'تشكيلة مرنة لاحتياجات التجزئة والجملة',pageProductsSub:'اختر الشكل والتعبئة، ثم شاركنا المواصفة والكمية المطلوبة.',
    productDetails:'تفاصيل المنتج',specifications:'المواصفات',packingOptions:'طرق التعبئة',requestThis:'اطلب عرضًا لهذا المنتج',backProducts:'العودة للمنتجات',
    pageCatalogTitle:'كتالوج منظم للمنتجات والتعبئة',pageCatalogSub:'استعرض المنتجات الأساسية واطبع نسخة محدثة من بيانات الموقع.',
    catalogIntroTitle:'كتالوج يتغير مع بيانات الموقع',catalogIntroText:'هذه النسخة تُبنى من المنتجات الحالية، لذلك تظهر التعديلات بعد حفظها من لوحة التحكم.',
    pageCertTitle:'الشهادات وإجراءات الاعتماد',pageCertSub:'مساحة مخصصة لعرض الملفات الرسمية وإجراءات الجودة بعد رفعها من لوحة التحكم.',
    placeholder:'محتوى تمهيدي — استبدله بالوثيقة الرسمية من لوحة التحكم',
    pageAchTitle:'خطوات تطوير تدعم التوسع',pageAchSub:'محطات قابلة للإدارة تعكس تطور الشركة والمنتجات والأسواق.',
    pageNewsTitle:'معرفة عملية للمشترين والعلامات التجارية',pageNewsSub:'مقالات قصيرة حول المواصفات والتعبئة والتوريد.',
    pageFaqTitle:'إجابات واضحة قبل بدء الطلب',pageFaqSub:'أسئلة شائعة تساعد على تجهيز طلب أكثر دقة.',
    pageContactTitle:'تواصل مع فريقنا',pageContactSub:'شاركنا استفسارك وسنحتفظ به داخل لوحة التحكم للمتابعة.',
    contactCardTitle:'نقطة اتصال واحدة لطلبك',contactCardText:'استخدم النموذج أو بيانات التواصل، مع ذكر السوق والمنتج والكمية كلما أمكن.',
    sendMessage:'إرسال الرسالة',name:'الاسم',company:'الشركة',subject:'الموضوع',message:'الرسالة',phoneOptional:'الهاتف',required:'مطلوب',sending:'جارٍ الإرسال...',sent:'تم استلام رسالتك بنجاح.',formError:'تعذر الإرسال. راجع البيانات وحاول مرة أخرى.',
    pageQuoteTitle:'ابدأ طلب عرض سعر منظم',pageQuoteSub:'كلما كانت التفاصيل أوضح، كان تقييم المنتج والتعبئة والكمية أدق.',
    quoteAsideTitle:'جهّز هذه البيانات',quoteAsideText:'المعلومات التالية تساعد على تقليل الأسئلة المتكررة وتسريع المراجعة الأولية.',
    q1:'المنتج والشكل والحجم',q2:'نوع العبوة والوزن',q3:'الكمية المتوقعة',q4:'الدولة أو ميناء الوصول',q5:'متطلبات الملصق والمستندات',
    country:'الدولة',product:'المنتج',format:'الشكل / المقاس',quantity:'الكمية',destination:'الوجهة',notes:'ملاحظات إضافية',submitQuote:'إرسال طلب العرض',quoteSent:'تم تسجيل طلب عرض السعر.',
    selectProduct:'اختر منتجًا',selectPacking:'اختر التعبئة',
    pageBrochureTitle:'بروشور ديناميكي من محتوى الموقع',pageBrochureSub:'نسخة جاهزة للطباعة والحفظ كملف PDF من المتصفح.',
    pagePrivacyTitle:'سياسة الخصوصية',pageTermsTitle:'الشروط والأحكام',lastUpdate:'آخر تحديث: يونيو 2026',
    latestArticles:'أحدث المقالات',notFound:'الصفحة غير موجودة',notFoundText:'ربما تغير الرابط أو تم حذف المحتوى.',goHome:'العودة للرئيسية',
    dateLocale:'ar-EG',wholeRange:'تفاصيل التعبئة متاحة حسب المنتج والكمية.',browseProducts:'تصفح المنتجات'
  },
  en:{
    home:'Home',about:'About',products:'Products',catalog:'Catalog',certifications:'Certifications',achievements:'Achievements',news:'Insights',faq:'FAQ',contact:'Contact',quote:'Request a quote',
    explore:'Explore',viewAll:'View all',featured:'Featured',all:'All',searchProducts:'Search products',noProducts:'No matching products.',
    capabilities:'Capabilities',packaging:'Packaging options',quality:'Quality approach',markets:'Export market support',insights:'Practical insight for better buying decisions',
    qualityEyebrow:'Reviewable quality',qualityTitle:'Clear steps from receiving to shipment preparation',
    qualityText:'We turn order requirements into execution and review points, making product discussions more precise before supply begins.',
    step1:'Confirm specification and reference sample',step1t:'Size, format, flavor, salt profile, weight and packing.',
    step2:'Process and check during execution',step2t:'Review uniformity, pack and batch details at defined points.',
    step3:'Pre-shipment review',step3t:'Review quantities, marks and order documents.',
    trustLead:'Practical solutions for importers, distributors and private labels',
    trust1:'Configurable specifications',trust2:'Retail and bulk packing',trust3:'Multilingual support',trust4:'Export-focused follow-up',
    marketTitle:'We understand the market before packing the product',marketText:'A content and communication experience in Arabic, English, Spanish and Italian, with product presentation shaped around destination and sales channel.',
    marketCore:'Support for global markets',market1:'Importers & distributors',market2:'Private labels',market3:'Foodservice',market4:'Repacking operations',
    ctaTitle:'Have a specification or target market? Turn it into a clear request.',ctaText:'Share product, packing, quantity and destination. The form helps collect the essentials before commercial follow-up.',
    readMore:'Read more',downloadCatalog:'Download catalog',printBrochure:'Print / Save PDF',companyProfile:'Company profile',
    quickLinks:'Quick links',productsFooter:'Products',contactInfo:'Contact information',location:'Location',openMap:'Open map',copyright:'All rights reserved.',
    phone:'Phone',email:'Email',exportEmail:'Export email',address:'Address',hours:'Working hours',whatsapp:'WhatsApp',language:'Language',
    scroll:'Explore',prev:'Previous',next:'Next',pause:'Pause',play:'Play',
    pageAboutTitle:'A food manufacturer built around clarity and quality',pageAboutSub:'Learn how we work and the values guiding product preparation and customer support.',
    ourStory:'Our story and approach',values:'Our working values',whyUs:'Why Zahrat El-Rabea?',
    pageProductsTitle:'A flexible range for retail and bulk needs',pageProductsSub:'Choose the format and packing, then share the specification and quantity.',
    productDetails:'Product details',specifications:'Specifications',packingOptions:'Packing options',requestThis:'Quote this product',backProducts:'Back to products',
    pageCatalogTitle:'A structured catalog for products and packing',pageCatalogSub:'Browse the core range and print an updated copy from live site data.',
    catalogIntroTitle:'A catalog that follows site data',catalogIntroText:'This version is built from current products, so dashboard changes appear after saving.',
    pageCertTitle:'Certifications and approval procedures',pageCertSub:'A dedicated space for official documents and quality procedures uploaded from the dashboard.',
    placeholder:'Introductory content — replace with the official document in the dashboard',
    pageAchTitle:'Development steps that support growth',pageAchSub:'Editable milestones reflecting the company, products and markets.',
    pageNewsTitle:'Practical knowledge for buyers and brands',pageNewsSub:'Focused articles on specifications, packing and supply.',
    pageFaqTitle:'Clear answers before the order begins',pageFaqSub:'Common questions that help prepare a more accurate request.',
    pageContactTitle:'Talk to our team',pageContactSub:'Share your inquiry and it will be stored in the dashboard for follow-up.',
    contactCardTitle:'One point of contact for your request',contactCardText:'Use the form or contact details, mentioning market, product and quantity where possible.',
    sendMessage:'Send message',name:'Name',company:'Company',subject:'Subject',message:'Message',phoneOptional:'Phone',required:'Required',sending:'Sending...',sent:'Your message has been received.',formError:'Could not send. Check the details and try again.',
    pageQuoteTitle:'Start a structured quote request',pageQuoteSub:'Clearer details allow a more accurate review of product, packing and quantity.',
    quoteAsideTitle:'Prepare these details',quoteAsideText:'The following information reduces repeated questions and speeds the initial review.',
    q1:'Product, format and size',q2:'Pack type and weight',q3:'Expected quantity',q4:'Country or destination port',q5:'Label and document requirements',
    country:'Country',product:'Product',format:'Format / size',quantity:'Quantity',destination:'Destination',notes:'Additional notes',submitQuote:'Submit quote request',quoteSent:'Your quote request has been recorded.',
    selectProduct:'Select product',selectPacking:'Select packing',
    pageBrochureTitle:'A dynamic brochure from website content',pageBrochureSub:'A print-ready version you can save as PDF from the browser.',
    pagePrivacyTitle:'Privacy policy',pageTermsTitle:'Terms and conditions',lastUpdate:'Last updated: June 2026',
    latestArticles:'Latest articles',notFound:'Page not found',notFoundText:'The link may have changed or the content was removed.',goHome:'Return home',
    dateLocale:'en-GB',wholeRange:'Packing details are available according to product and quantity.',browseProducts:'Browse products'
  },
  es:{
    home:'Inicio',about:'Nosotros',products:'Productos',catalog:'Catálogo',certifications:'Certificaciones',achievements:'Logros',news:'Conocimiento',faq:'Preguntas',contact:'Contacto',quote:'Solicitar cotización',
    explore:'Explorar',viewAll:'Ver todo',featured:'Destacado',all:'Todos',searchProducts:'Buscar productos',noProducts:'No hay productos coincidentes.',
    capabilities:'Capacidades',packaging:'Opciones de envase',quality:'Enfoque de calidad',markets:'Soporte a mercados',insights:'Información práctica para mejores decisiones',
    qualityEyebrow:'Calidad verificable',qualityTitle:'Pasos claros desde la recepción hasta el envío',qualityText:'Convertimos requisitos en puntos de ejecución y revisión antes del suministro.',
    step1:'Confirmar especificación y muestra',step1t:'Calibre, formato, sabor, salinidad, peso y envase.',step2:'Proceso y control',step2t:'Revisión de uniformidad, envase y lote.',step3:'Revisión antes del envío',step3t:'Cantidades, marcas y documentos.',
    trustLead:'Soluciones para importadores, distribuidores y marcas privadas',trust1:'Especificaciones configurables',trust2:'Envase retail y granel',trust3:'Soporte multilingüe',trust4:'Seguimiento exportador',
    marketTitle:'Entendemos el mercado antes de envasar',marketText:'Experiencia en árabe, inglés, español e italiano, adaptada al destino y canal de venta.',marketCore:'Soporte a mercados globales',market1:'Importadores y distribuidores',market2:'Marcas privadas',market3:'Foodservice',market4:'Reenvasado',
    ctaTitle:'¿Tiene especificación o mercado objetivo? Conviértalo en una solicitud clara.',ctaText:'Comparta producto, envase, cantidad y destino.',
    readMore:'Leer más',downloadCatalog:'Descargar catálogo',printBrochure:'Imprimir / Guardar PDF',companyProfile:'Perfil de empresa',
    quickLinks:'Enlaces',productsFooter:'Productos',contactInfo:'Contacto',location:'Ubicación',openMap:'Abrir mapa',copyright:'Todos los derechos reservados.',
    phone:'Teléfono',email:'Correo',exportEmail:'Correo exportación',address:'Dirección',hours:'Horario',whatsapp:'WhatsApp',language:'Idioma',scroll:'Explorar',prev:'Anterior',next:'Siguiente',pause:'Pausa',play:'Reproducir',
    pageAboutTitle:'Fabricante alimentario basado en claridad y calidad',pageAboutSub:'Conozca cómo trabajamos y nuestros valores.',ourStory:'Nuestra historia y enfoque',values:'Nuestros valores',whyUs:'¿Por qué Zahrat El-Rabea?',
    pageProductsTitle:'Gama flexible para retail y granel',pageProductsSub:'Elija formato y envase y comparta su especificación.',productDetails:'Detalles',specifications:'Especificaciones',packingOptions:'Envases',requestThis:'Cotizar producto',backProducts:'Volver a productos',
    pageCatalogTitle:'Catálogo estructurado de productos y envases',pageCatalogSub:'Explore la gama e imprima una copia actualizada.',catalogIntroTitle:'Catálogo conectado con el sitio',catalogIntroText:'Los cambios del panel aparecen tras guardar.',
    pageCertTitle:'Certificaciones y aprobaciones',pageCertSub:'Espacio para documentos oficiales y procesos de calidad.',placeholder:'Contenido introductorio — sustituir por documento oficial',
    pageAchTitle:'Desarrollo que apoya el crecimiento',pageAchSub:'Hitos editables de empresa, productos y mercados.',
    pageNewsTitle:'Conocimiento práctico para compradores y marcas',pageNewsSub:'Artículos sobre especificaciones, envase y suministro.',
    pageFaqTitle:'Respuestas claras antes del pedido',pageFaqSub:'Preguntas para preparar una solicitud precisa.',
    pageContactTitle:'Contacte con nuestro equipo',pageContactSub:'Su consulta quedará registrada para seguimiento.',contactCardTitle:'Un punto de contacto',contactCardText:'Indique mercado, producto y cantidad cuando sea posible.',
    sendMessage:'Enviar mensaje',name:'Nombre',company:'Empresa',subject:'Asunto',message:'Mensaje',phoneOptional:'Teléfono',required:'Obligatorio',sending:'Enviando...',sent:'Mensaje recibido.',formError:'No se pudo enviar. Revise los datos.',
    pageQuoteTitle:'Inicie una solicitud estructurada',pageQuoteSub:'Más detalle permite una revisión más precisa.',quoteAsideTitle:'Prepare estos datos',quoteAsideText:'Ayudan a acelerar la revisión.',
    q1:'Producto, formato y calibre',q2:'Envase y peso',q3:'Cantidad esperada',q4:'País o puerto',q5:'Etiqueta y documentos',
    country:'País',product:'Producto',format:'Formato / calibre',quantity:'Cantidad',destination:'Destino',notes:'Notas',submitQuote:'Enviar solicitud',quoteSent:'Solicitud registrada.',selectProduct:'Seleccione producto',selectPacking:'Seleccione envase',
    pageBrochureTitle:'Folleto dinámico del contenido del sitio',pageBrochureSub:'Versión lista para imprimir o guardar en PDF.',pagePrivacyTitle:'Política de privacidad',pageTermsTitle:'Términos y condiciones',lastUpdate:'Actualizado: junio de 2026',
    latestArticles:'Últimos artículos',notFound:'Página no encontrada',notFoundText:'El enlace puede haber cambiado.',goHome:'Volver al inicio',dateLocale:'es-ES',wholeRange:'Detalles según producto y cantidad.',browseProducts:'Ver productos'
  },
  it:{
    home:'Home',about:'Chi siamo',products:'Prodotti',catalog:'Catalogo',certifications:'Certificazioni',achievements:'Traguardi',news:'Approfondimenti',faq:'FAQ',contact:'Contatti',quote:'Richiedi preventivo',
    explore:'Esplora',viewAll:'Vedi tutto',featured:'In evidenza',all:'Tutti',searchProducts:'Cerca prodotti',noProducts:'Nessun prodotto corrispondente.',
    capabilities:'Capacità',packaging:'Packaging',quality:'Approccio qualità',markets:'Supporto mercati export',insights:'Informazioni pratiche per decisioni migliori',
    qualityEyebrow:'Qualità verificabile',qualityTitle:'Passaggi chiari dalla ricezione alla spedizione',qualityText:'Trasformiamo i requisiti in punti di esecuzione e controllo.',
    step1:'Conferma specifica e campione',step1t:'Calibro, formato, gusto, salinità, peso e confezione.',step2:'Lavorazione e controllo',step2t:'Verifica di uniformità, confezione e lotto.',step3:'Controllo pre-spedizione',step3t:'Quantità, marcature e documenti.',
    trustLead:'Soluzioni per importatori, distributori e private label',trust1:'Specifiche configurabili',trust2:'Packaging retail e bulk',trust3:'Supporto multilingue',trust4:'Follow-up export',
    marketTitle:'Comprendiamo il mercato prima di confezionare',marketText:'Esperienza in arabo, inglese, spagnolo e italiano, adattata a destinazione e canale.',marketCore:'Supporto ai mercati globali',market1:'Importatori e distributori',market2:'Private label',market3:'Foodservice',market4:'Riconfezionamento',
    ctaTitle:'Hai una specifica o un mercato target? Rendila una richiesta chiara.',ctaText:'Condividi prodotto, packaging, quantità e destinazione.',
    readMore:'Leggi',downloadCatalog:'Scarica catalogo',printBrochure:'Stampa / Salva PDF',companyProfile:'Profilo aziendale',
    quickLinks:'Link rapidi',productsFooter:'Prodotti',contactInfo:'Contatti',location:'Posizione',openMap:'Apri mappa',copyright:'Tutti i diritti riservati.',
    phone:'Telefono',email:'Email',exportEmail:'Email export',address:'Indirizzo',hours:'Orari',whatsapp:'WhatsApp',language:'Lingua',scroll:'Esplora',prev:'Precedente',next:'Successivo',pause:'Pausa',play:'Riproduci',
    pageAboutTitle:'Produttore alimentare fondato su chiarezza e qualità',pageAboutSub:'Scopri come lavoriamo e i nostri valori.',ourStory:'La nostra storia e il metodo',values:'I nostri valori',whyUs:'Perché Zahrat El-Rabea?',
    pageProductsTitle:'Gamma flessibile per retail e bulk',pageProductsSub:'Scegli formato e packaging e condividi la specifica.',productDetails:'Dettagli prodotto',specifications:'Specifiche',packingOptions:'Packaging',requestThis:'Richiedi preventivo',backProducts:'Torna ai prodotti',
    pageCatalogTitle:'Catalogo strutturato di prodotti e packaging',pageCatalogSub:'Esplora la gamma e stampa una copia aggiornata.',catalogIntroTitle:'Catalogo collegato ai dati del sito',catalogIntroText:'Le modifiche della dashboard appaiono dopo il salvataggio.',
    pageCertTitle:'Certificazioni e procedure di approvazione',pageCertSub:'Spazio per documenti ufficiali e procedure qualità.',placeholder:'Contenuto introduttivo — sostituire con documento ufficiale',
    pageAchTitle:'Sviluppo a supporto della crescita',pageAchSub:'Traguardi modificabili per azienda, prodotti e mercati.',
    pageNewsTitle:'Conoscenza pratica per buyer e brand',pageNewsSub:'Articoli su specifiche, packaging e fornitura.',
    pageFaqTitle:'Risposte chiare prima dell’ordine',pageFaqSub:'Domande utili per preparare una richiesta precisa.',
    pageContactTitle:'Parla con il nostro team',pageContactSub:'La richiesta sarà registrata per il follow-up.',contactCardTitle:'Un unico punto di contatto',contactCardText:'Indica mercato, prodotto e quantità quando possibile.',
    sendMessage:'Invia messaggio',name:'Nome',company:'Azienda',subject:'Oggetto',message:'Messaggio',phoneOptional:'Telefono',required:'Obbligatorio',sending:'Invio...',sent:'Messaggio ricevuto.',formError:'Invio non riuscito. Controlla i dati.',
    pageQuoteTitle:'Avvia una richiesta di preventivo strutturata',pageQuoteSub:'Più dettagli consentono una valutazione accurata.',quoteAsideTitle:'Prepara questi dati',quoteAsideText:'Aiutano ad accelerare la prima verifica.',
    q1:'Prodotto, formato e calibro',q2:'Confezione e peso',q3:'Quantità prevista',q4:'Paese o porto',q5:'Etichetta e documenti',
    country:'Paese',product:'Prodotto',format:'Formato / calibro',quantity:'Quantità',destination:'Destinazione',notes:'Note',submitQuote:'Invia richiesta',quoteSent:'Richiesta registrata.',selectProduct:'Seleziona prodotto',selectPacking:'Seleziona packaging',
    pageBrochureTitle:'Brochure dinamica dai contenuti del sito',pageBrochureSub:'Versione pronta per stampa o PDF.',pagePrivacyTitle:'Privacy policy',pageTermsTitle:'Termini e condizioni',lastUpdate:'Aggiornato: giugno 2026',
    latestArticles:'Ultimi articoli',notFound:'Pagina non trovata',notFoundText:'Il link potrebbe essere cambiato.',goHome:'Torna alla home',dateLocale:'it-IT',wholeRange:'Dettagli secondo prodotto e quantità.',browseProducts:'Sfoglia prodotti'
  }
};

let state={content:null,lang:'ar',route:[],query:new URLSearchParams(location.search),hero:null};

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const attr=esc;
const loc=v=>{
  if(v && typeof v==='object' && !Array.isArray(v)) return v[state.lang] ?? v.en ?? v.ar ?? Object.values(v)[0] ?? '';
  return v ?? '';
};
const U=key=>ui[state.lang]?.[key] ?? ui.en[key] ?? key;
const icon=(name,cls='')=>window.ZRIcon?window.ZRIcon(name,cls):'';
const pathFor=(route='',lang=state.lang)=>{
  const clean=String(route).replace(/^\/+/,'');
  return `/${lang}${clean?'/'+clean:''}`;
};
const routeName=()=>state.route[0]||'home';
const isHome=()=>state.route.length===0 || state.route[0]==='home';

function parseLocation(){
  const segments=location.pathname.split('/').filter(Boolean);
  let lang=segments[0];
  if(LANGS.includes(lang)) segments.shift();
  else lang=localStorage.getItem('zr_lang')||state.content?.site?.defaultLanguage||'ar';
  state.lang=LANGS.includes(lang)?lang:'ar';
  state.route=segments;
  state.query=new URLSearchParams(location.search);
  localStorage.setItem('zr_lang',state.lang);
  document.documentElement.lang=state.lang;
  document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';
}

function navItems(){
  return [
    ['home','',U('home')],['about','about',U('about')],['products','products',U('products')],
    ['catalog','catalog',U('catalog')],['certifications','certifications',U('certifications')],
    ['news','news',U('news')],['contact','contact',U('contact')]
  ];
}
function activeRoute(id){return (id==='home'&&isHome())||routeName()===id}

function header(){
  const c=state.content,site=c.site;
  return `<header class="site-header ${isHome()?'':'solid'}" id="site-header">
    <div class="header-inner">
      <a class="site-logo" href="${pathFor()}" aria-label="${attr(site.companyName)}">
        <img src="${attr(site.logo)}" alt="${attr(site.companyName)}" width="560" height="150">
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        ${navItems().map(([id,r,label])=>`<a class="nav-link ${activeRoute(id)?'active':''}" href="${pathFor(r)}">${esc(label)}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <a class="btn header-quote" href="${pathFor('quote')}">${esc(U('quote'))}${icon('arrowUpRight')}</a>
        <div class="lang-wrap" id="lang-wrap">
          <button class="lang-button" type="button" id="lang-button" aria-expanded="false" aria-label="${attr(U('language'))}">
            ${icon('globe')}<span class="lang-code">${state.lang.toUpperCase()}</span><span class="chev">${icon('chevronDown')}</span>
          </button>
          <div class="lang-menu" role="menu">
            ${LANGS.map(l=>`<a class="lang-option ${l===state.lang?'active':''}" href="${pathFor(state.route.join('/'),l)}${location.search}">
              <span>${esc(langNames[l])}</span><small>${l.toUpperCase()}</small></a>`).join('')}
          </div>
        </div>
        <button class="mobile-toggle" id="mobile-toggle" type="button" aria-label="Menu">${icon('menu')}</button>
      </div>
    </div>
  </header>`;
}
function mobilePanel(){
  const s=state.content.site;
  return `<div class="mobile-panel" id="mobile-panel" aria-hidden="true">
    <div class="mobile-overlay" data-close-menu></div>
    <aside class="mobile-drawer">
      <div class="mobile-drawer-head">
        <img src="${attr(s.logo)}" alt="${attr(s.companyName)}">
        <button class="mobile-close" type="button" data-close-menu>${icon('x')}</button>
      </div>
      <nav class="mobile-nav">
        ${navItems().map(([id,r,label])=>`<a href="${pathFor(r)}"><span>${esc(label)}</span>${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>`).join('')}
        <a href="${pathFor('faq')}"><span>${esc(U('faq'))}</span>${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>
        <a href="${pathFor('quote')}"><span>${esc(U('quote'))}</span>${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>
      </nav>
      <strong>${esc(U('language'))}</strong>
      <div class="mobile-languages">${LANGS.map(l=>`<a class="${l===state.lang?'active':''}" href="${pathFor(state.route.join('/'),l)}${location.search}">${esc(langNames[l])}</a>`).join('')}</div>
      <div class="mobile-contact">
        <a href="tel:${attr((s.contact.phones||[])[0])}">${icon('phone')}<span>${esc((s.contact.phones||[])[0]||'')}</span></a>
        <a href="mailto:${attr(s.contact.exportEmail)}">${icon('mail')}<span>${esc(s.contact.exportEmail||'')}</span></a>
        <a href="https://wa.me/${attr(String(s.contact.whatsapp||'').replace(/\D/g,''))}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(U('whatsapp'))}</span></a>
      </div>
    </aside>
  </div>`;
}
function sideRail(){
  const s=state.content.site,wa=String(s.contact.whatsapp||'').replace(/\D/g,'');
  return `<aside class="side-rail" aria-label="Quick actions">
    <a class="rail-btn whatsapp-rail" href="https://wa.me/${attr(wa)}" target="_blank" rel="noopener">${icon('whatsapp')}<span class="rail-tip">${esc(U('whatsapp'))}</span></a>
    <a class="rail-btn" href="${pathFor('quote')}">${icon('fileText')}<span class="rail-tip">${esc(U('quote'))}</span></a>
    <a class="rail-btn" href="${pathFor('contact')}">${icon('mail')}<span class="rail-tip">${esc(U('contact'))}</span></a>
    <button class="rail-btn back-to-top" id="back-to-top" type="button">${icon('arrowUp')}<span class="rail-tip">Top</span></button>
  </aside>`;
}
function footer(){
  const s=state.content.site,c=s.contact;
  const social=Object.entries(c.social||{}).filter(([,url])=>url);
  const prod=(state.content.categories||[]).slice(0,4);
  return `<footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <img src="${attr(s.logo)}" alt="${attr(s.companyName)}">
        <p>${esc(loc(s.footer.summary))}</p>
        ${social.length?`<div class="footer-social">${social.map(([name,url])=>`<a href="${attr(url)}" target="_blank" rel="noopener" aria-label="${attr(name)}">${icon(name)}</a>`).join('')}</div>`:''}
      </div>
      <div class="footer-col">
        <h3>${esc(U('quickLinks'))}</h3>
        <div class="footer-links">
          ${[['about',U('about')],['products',U('products')],['catalog',U('catalog')],['certifications',U('certifications')],['achievements',U('achievements')],['news',U('news')],['faq',U('faq')]].map(([r,l])=>`<a href="${pathFor(r)}">${esc(l)}</a>`).join('')}
        </div>
      </div>
      <div class="footer-col">
        <h3>${esc(U('productsFooter'))}</h3>
        <div class="footer-links">${prod.map(cat=>`<a href="${pathFor('products')}?category=${attr(cat.id)}">${esc(loc(cat.name))}</a>`).join('')}
          <a href="${pathFor('quote')}">${esc(U('quote'))}</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>${esc(U('contactInfo'))}</h3>
        <div class="contact-list">
          <div class="contact-row"><span class="contact-row-icon">${icon('phone')}</span><div><strong>${esc(U('phone'))}</strong>${(c.phones||[]).map(p=>`<a href="tel:${attr(p)}">${esc(p)}</a>`).join('<br>')}</div></div>
          <div class="contact-row"><span class="contact-row-icon">${icon('mail')}</span><div><strong>${esc(U('exportEmail'))}</strong><a href="mailto:${attr(c.exportEmail)}">${esc(c.exportEmail)}</a></div></div>
          <div class="contact-row"><span class="contact-row-icon">${icon('mapPin')}</span><div><strong>${esc(U('address'))}</strong><span>${esc(loc(c.address))}</span></div></div>
          <div class="contact-row"><span class="contact-row-icon">${icon('clock')}</span><div><strong>${esc(U('hours'))}</strong><span>${esc(loc(c.hours))}</span></div></div>
        </div>
      </div>
      ${s.footer.showMap?`<div class="footer-col footer-map-col">
        <h3>${esc(U('location'))}</h3>
        <div class="footer-map">
          <iframe src="${attr(c.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${attr(U('location'))}"></iframe>
          <a class="footer-map-link" href="${attr(c.mapLink)}" target="_blank" rel="noopener">${icon('externalLink')}${esc(U('openMap'))}</a>
        </div>
      </div>`:''}
    </div>
    <div class="footer-bottom"><div class="container footer-bottom-inner">
      <span>© ${new Date().getFullYear()} ${esc(s.companyName)}. ${esc(U('copyright'))}</span>
      <div class="footer-legal"><a href="${pathFor('privacy')}">${esc(U('pagePrivacyTitle'))}</a><a href="${pathFor('terms')}">${esc(U('pageTermsTitle'))}</a></div>
    </div></div>
  </footer>`;
}
function pageHero(title,subtitle,image='/assets/images/hero-groves.webp',crumb=''){
  return `<section class="page-hero">
    <div class="page-hero-media"><img src="${attr(image)}" alt="" fetchpriority="high"></div>
    <div class="page-hero-inner">
      <div class="breadcrumb"><a href="${pathFor()}">${esc(U('home'))}</a>${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}<span>${esc(crumb||title)}</span></div>
      <h1 class="page-title">${esc(title)}</h1>
      ${subtitle?`<p class="page-subtitle">${esc(subtitle)}</p>`:''}
    </div>
  </section>`;
}
function sectionHeading(eyebrow,title,lead='',action=''){
  return `<div class="section-heading reveal"><div class="section-heading-copy"><span class="eyebrow">${esc(eyebrow)}</span><h2 class="section-title">${esc(title)}</h2>${lead?`<p class="section-lead">${esc(lead)}</p>`:''}</div>${action}</div>`;
}
function productCard(p){
  const cat=state.content.categories.find(c=>c.id===p.category);
  return `<article class="product-card reveal" data-category="${attr(p.category)}" data-name="${attr(loc(p.name).toLowerCase())}">
    <a class="product-image" href="${pathFor('products/'+p.slug)}">
      <img src="${attr(p.image)}" alt="${attr(loc(p.name))}" loading="lazy" width="1200" height="800">
      ${p.featured?`<span class="product-badge">${esc(U('featured'))}</span>`:''}
    </a>
    <div class="product-card-body">
      <h3><a href="${pathFor('products/'+p.slug)}">${esc(loc(p.name))}</a></h3>
      <p>${esc(loc(p.short))}</p>
      <div class="product-card-foot">
        <span class="product-format">${icon('leaf')}${esc(cat?loc(cat.name):'')}</span>
        <a class="link-arrow" href="${pathFor('products/'+p.slug)}">${esc(U('explore'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>
      </div>
    </div>
  </article>`;
}
function newsCard(n,compact=false){
  const date=new Intl.DateTimeFormat(U('dateLocale'),{year:'numeric',month:'short',day:'numeric'}).format(new Date(n.date+'T12:00:00'));
  if(compact) return `<article class="article-card reveal">
    <a class="article-card-image" href="${pathFor('news/'+n.slug)}"><img src="${attr(n.image)}" alt="${attr(loc(n.title))}" loading="lazy"></a>
    <div class="article-card-body"><div class="news-meta">${icon('calendar')}${esc(date)}</div><h3><a href="${pathFor('news/'+n.slug)}">${esc(loc(n.title))}</a></h3><p>${esc(loc(n.excerpt))}</p><a class="link-arrow" href="${pathFor('news/'+n.slug)}">${esc(U('readMore'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a></div>
  </article>`;
  return `<article class="news-card reveal">
    <a class="news-card-image" href="${pathFor('news/'+n.slug)}"><img src="${attr(n.image)}" alt="${attr(loc(n.title))}" loading="lazy"></a>
    <div class="news-card-body"><div class="news-meta">${icon('calendar')}${esc(date)}</div><h3><a href="${pathFor('news/'+n.slug)}">${esc(loc(n.title))}</a></h3><p>${esc(loc(n.excerpt))}</p><a class="link-arrow" href="${pathFor('news/'+n.slug)}">${esc(U('readMore'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a></div>
  </article>`;
}

function renderHero(){
  const h=state.content.site.hero,slides=(h.slides||[]).filter(x=>x.enabled!==false);
  if(!slides.length) return '';
  const heroMin=Math.min(1080,Math.max(720,Number(h.minHeight)||900));
  const mediaMarkup=(slide,index)=>{
    const poster=slide.poster||'/assets/images/hero-groves.webp';
    if(slide.type==='video'){
      const mime=String(slide.media||'').toLowerCase().endsWith('.webm')?'video/webm':'video/mp4';
      return `<video muted loop playsinline preload="${index===0?'metadata':'none'}" poster="${attr(poster)}" aria-hidden="true"><source src="${attr(slide.media)}" type="${mime}"></video>`;
    }
    return `<img src="${attr(slide.media||poster)}" alt="" width="1920" height="1080" decoding="async" ${index===0?'fetchpriority="high" loading="eager"':'loading="lazy"'} data-fallback="${attr(poster)}">`;
  };
  return `<section class="hero" id="hero" style="--hero-min:${heroMin}px" aria-label="${attr(loc(state.content.site.tagline))}">
    <div class="hero-slides">
      ${slides.map((slide,index)=>`<article class="hero-slide ${index===0?'active':''}" data-slide="${index}" aria-hidden="${index===0?'false':'true'}">
        <div class="hero-media">${mediaMarkup(slide,index)}</div>
        <div class="hero-content-wrap"><div class="hero-stage">
          <div class="hero-copy">
            <div class="hero-eyebrow">${esc(loc(slide.eyebrow))}</div>
            <h1 class="hero-title">${esc(loc(slide.title))}</h1>
            <p class="hero-text">${esc(loc(slide.text))}</p>
            <div class="hero-actions">
              <a class="btn btn-light" href="${pathFor(String(slide.primaryUrl||'/products').replace(/^\//,''))}">${esc(loc(slide.primaryLabel))}${icon('arrowUpRight')}</a>
              <a class="btn btn-ghost-light" href="${pathFor(String(slide.secondaryUrl||'/quote').replace(/^\//,''))}">${esc(loc(slide.secondaryLabel))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>
            </div>
          </div>
          <aside class="hero-assurance">
            <span class="hero-assurance-icon">${icon('shieldCheck')}</span>
            <span class="hero-assurance-kicker">${esc(U('qualityEyebrow'))}</span>
            <strong>${esc(U('trustLead'))}</strong>
            <div class="hero-assurance-lines">
              <span>${icon('package')}${esc(U('trust2'))}</span>
              <span>${icon('globe')}${esc(U('trust3'))}</span>
              <span>${icon('ship')}${esc(U('trust4'))}</span>
            </div>
          </aside>
        </div></div>
      </article>`).join('')}
    </div>
    <div class="hero-bottom"><div class="hero-bottom-inner">
      <div class="hero-pagination" role="tablist" aria-label="Hero slides">${slides.map((_,i)=>`<button class="hero-dot ${i===0?'active':''}" data-hero-to="${i}" role="tab" aria-selected="${i===0?'true':'false'}" aria-label="${attr(U('next'))} ${i+1}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div>
      <div class="hero-controls">
        <button class="hero-control" type="button" data-hero-prev aria-label="${attr(U('prev'))}">${icon(state.lang==='ar'?'chevronRight':'chevronLeft')}</button>
        <button class="hero-control" type="button" data-hero-toggle aria-label="${attr(U('pause'))}">${icon('pause')}</button>
        <button class="hero-control" type="button" data-hero-next aria-label="${attr(U('next'))}">${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</button>
      </div>
    </div><div class="hero-progress" aria-hidden="true"><span></span></div></div>
  </section>`;
}
function renderHome(){
  const c=state.content,home=c.home;
  const featured=c.products.filter(p=>p.featured&&p.status!=='draft').slice(0,6);
  const trust=[['target',U('trust1')],['package',U('trust2')],['globe',U('trust3')],['ship',U('trust4')]];
  return `${renderHero()}
  <section class="trust-strip"><div class="trust-grid">
    <div class="trust-lead">${esc(U('trustLead'))}</div>
    ${trust.map(([ic,tx])=>`<div class="trust-item"><span class="trust-item-icon">${icon(ic)}</span><span>${esc(tx)}</span></div>`).join('')}
  </div></section>
  <main id="main-content">
    <section class="section"><div class="container intro-grid">
      <div class="intro-visual reveal">
        <div class="intro-main-image"><img src="/assets/images/hero-groves.webp" alt="Olive groves" loading="lazy"></div>
        <div class="intro-small-image"><img src="/assets/images/hero-packaging.webp" alt="Olive packaging" loading="lazy"></div>
        <div class="intro-mark">${icon('leaf')}<span>${esc(loc(c.site.tagline))}</span></div>
      </div>
      <div class="intro-copy reveal">
        <span class="eyebrow">${esc(loc(home.intro.eyebrow))}</span>
        <h2 class="section-title">${esc(loc(home.intro.title))}</h2>
        <p>${esc(loc(home.intro.text))}</p>
        <div class="feature-list">
          ${c.about.values.slice(0,3).map(v=>`<div class="feature-line"><span class="feature-line-icon">${icon(v.icon)}</span><div><strong>${esc(loc(v.title))}</strong><span>${esc(loc(v.text))}</span></div></div>`).join('')}
        </div>
        <a class="btn btn-primary" href="${pathFor('about')}">${esc(U('about'))}${icon('arrowUpRight')}</a>
      </div>
    </div></section>

    <section class="section section-surface"><div class="container">
      ${sectionHeading(U('products'),U('pageProductsTitle'),U('pageProductsSub'),`<a class="link-arrow" href="${pathFor('products')}">${esc(U('viewAll'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>`)}
      <div class="category-grid">${c.categories.map(cat=>`<a class="category-card reveal" href="${pathFor('products')}?category=${attr(cat.id)}">
        <img src="${attr(cat.image)}" alt="${attr(loc(cat.name))}" loading="lazy"><div class="category-content"><h3>${esc(loc(cat.name))}</h3><span class="category-arrow">${icon('arrowUpRight')}</span></div>
      </a>`).join('')}</div>
    </div></section>

    <section class="section section-dark"><div class="container">
      ${sectionHeading(U('capabilities'),U('qualityTitle'),U('qualityText'))}
      <div class="capabilities-grid">${c.capabilities.map(x=>`<article class="capability-card reveal"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></article>`).join('')}</div>
    </div></section>

    <section class="section"><div class="container">
      ${sectionHeading(U('products'),U('pageProductsTitle'),'',`<a class="btn btn-outline btn-sm" href="${pathFor('products')}">${esc(U('browseProducts'))}${icon('arrowUpRight')}</a>`)}
      <div class="product-grid">${featured.map(productCard).join('')}</div>
    </div></section>

    <section class="quality-split">
      <div class="quality-media"><img src="/assets/images/hero-process.webp" alt="Food manufacturing process" loading="lazy"></div>
      <div class="quality-content"><div class="quality-content-inner reveal">
        <span class="eyebrow">${esc(U('qualityEyebrow'))}</span>
        <h2 class="section-title small">${esc(U('qualityTitle'))}</h2>
        <p class="section-lead">${esc(loc(home.quality.text))}</p>
        <div class="process-list">
          <div class="process-item"><div><h4>${esc(U('step1'))}</h4><p>${esc(U('step1t'))}</p></div></div>
          <div class="process-item"><div><h4>${esc(U('step2'))}</h4><p>${esc(U('step2t'))}</p></div></div>
          <div class="process-item"><div><h4>${esc(U('step3'))}</h4><p>${esc(U('step3t'))}</p></div></div>
        </div>
      </div></div>
    </section>

    <section class="section section-surface"><div class="container">
      ${sectionHeading(U('packaging'),U('packaging'),U('wholeRange'))}
      <div class="packaging-grid">${c.packaging.map(x=>`<article class="packaging-card reveal"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></article>`).join('')}</div>
    </div></section>

    <section class="stats-band"><div class="container stats-grid">${c.site.stats.map(x=>`<div class="stat-item reveal"><div class="stat-value" data-counter="${attr(x.value)}">${esc(x.value)}${esc(x.suffix||'')}</div><div class="stat-label">${esc(loc(x.label))}</div></div>`).join('')}</div></section>

    <section class="section"><div class="container">
      ${sectionHeading(U('certifications'),U('pageCertTitle'),U('pageCertSub'),`<a class="link-arrow" href="${pathFor('certifications')}">${esc(U('viewAll'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>`)}
      <div class="certificate-grid">
        ${c.certificates[0]?`<article class="certificate-feature reveal"><img src="${attr(c.certificates[0].image)}" alt=""><div class="certificate-copy"><span class="capability-icon">${icon(c.certificates[0].icon)}</span><h3>${esc(loc(c.certificates[0].title))}</h3><p>${esc(loc(c.certificates[0].text))}</p>${c.certificates[0].placeholder?`<span class="placeholder-note">${icon('clipboardCheck')}${esc(U('placeholder'))}</span>`:''}</div></article>`:''}
        <div class="certificate-stack">${c.certificates.slice(1).map(x=>`<article class="certificate-card reveal"><span class="capability-icon">${icon(x.icon)}</span><div><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></div></article>`).join('')}
          <article class="certificate-card reveal"><span class="capability-icon">${icon('fileText')}</span><div><h3>${esc(U('downloadCatalog'))}</h3><p>${esc(U('catalogIntroText'))}</p><a class="link-arrow" href="${pathFor('brochure')}">${esc(U('companyProfile'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a></div></article>
        </div>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container market-wrap">
      <div class="market-visual reveal"><div class="globe-ring"><span class="axis"></span><span class="market-dot"></span><span class="market-dot"></span><span class="market-dot"></span><span class="market-dot"></span><div class="globe-core">${icon('globe')}<strong>${esc(U('marketCore'))}</strong></div></div></div>
      <div class="market-copy reveal"><span class="eyebrow">${esc(U('markets'))}</span><h2 class="section-title">${esc(U('marketTitle'))}</h2><p class="section-lead">${esc(U('marketText'))}</p>
        <div class="market-list">${['market1','market2','market3','market4'].map(k=>`<span>${icon('check')}${esc(U(k))}</span>`).join('')}</div>
      </div>
    </div></section>

    <section class="section"><div class="container">
      ${sectionHeading(U('news'),U('insights'),U('pageNewsSub'),`<a class="link-arrow" href="${pathFor('news')}">${esc(U('viewAll'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a>`)}
      <div class="news-grid">${c.news.slice(0,2).map(n=>newsCard(n)).join('')}</div>
    </div></section>

    <section class="home-cta"><div class="container"><div class="cta-card reveal"><div class="cta-card-copy"><h2>${esc(U('ctaTitle'))}</h2><p>${esc(U('ctaText'))}</p></div><div class="cta-actions"><a class="btn btn-light" href="${pathFor('quote')}">${esc(U('quote'))}${icon('arrowUpRight')}</a><a class="btn btn-ghost-light" href="${pathFor('contact')}">${esc(U('contact'))}</a></div></div></div></section>
  </main>`;
}

function renderAbout(){
  const c=state.content,a=c.about;
  return `${pageHero(U('pageAboutTitle'),U('pageAboutSub'),'/assets/images/hero-groves.webp',U('about'))}<main id="main-content" class="page-content">
    <section class="section"><div class="container about-story">
      <div class="about-story-sticky reveal"><span class="eyebrow">${esc(U('ourStory'))}</span><h2 class="section-title">${esc(loc(a.title))}</h2></div>
      <div class="about-story-body reveal"><p>${esc(loc(a.lead))}</p><p>${esc(loc(a.body))}</p><a class="btn btn-primary" href="${pathFor('quote')}">${esc(U('quote'))}${icon('arrowUpRight')}</a></div>
    </div></section>
    <section class="section section-surface"><div class="container">
      ${sectionHeading(U('values'),U('whyUs'))}
      <div class="values-grid">${a.values.map(v=>`<article class="value-card reveal"><span class="capability-icon">${icon(v.icon)}</span><h3>${esc(loc(v.title))}</h3><p>${esc(loc(v.text))}</p></article>`).join('')}</div>
    </div></section>
    <section class="section section-dark"><div class="container">${sectionHeading(U('capabilities'),U('qualityTitle'),U('qualityText'))}<div class="capabilities-grid">${c.capabilities.map(x=>`<article class="capability-card reveal"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></article>`).join('')}</div></div></section>
  </main>`;
}
function renderProducts(){
  const c=state.content;
  const selected=state.query.get('category')||'all';
  return `${pageHero(U('pageProductsTitle'),U('pageProductsSub'),'/assets/images/hero-packaging.webp',U('products'))}<main id="main-content" class="page-content">
    <section class="section"><div class="container">
      <div class="products-page-toolbar">
        <div class="product-filters"><button class="filter-chip ${selected==='all'?'active':''}" data-product-filter="all">${esc(U('all'))}</button>${c.categories.map(cat=>`<button class="filter-chip ${selected===cat.id?'active':''}" data-product-filter="${attr(cat.id)}">${esc(loc(cat.name))}</button>`).join('')}</div>
        <label class="search-box">${icon('search')}<span class="sr-only">${esc(U('searchProducts'))}</span><input id="product-search" type="search" placeholder="${attr(U('searchProducts'))}"></label>
      </div>
      <div class="product-grid" id="products-grid">${c.products.filter(p=>p.status!=='draft').map(productCard).join('')}<div class="no-results" hidden>${esc(U('noProducts'))}</div></div>
    </div></section>
    <section class="section section-surface"><div class="container">${sectionHeading(U('packaging'),U('packaging'),U('wholeRange'))}<div class="packaging-grid">${c.packaging.map(x=>`<article class="packaging-card reveal"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></article>`).join('')}</div></div></section>
  </main>`;
}
function renderProductDetail(slug){
  const p=state.content.products.find(x=>x.slug===slug && x.status!=='draft');
  if(!p) return render404();
  const gallery=(p.gallery?.length?p.gallery:[p.image]).filter(Boolean);
  return `${pageHero(U('productDetails'),loc(p.short),p.image,loc(p.name))}<main id="main-content" class="page-content">
    <section class="section"><div class="container product-detail-grid">
      <div class="product-gallery reveal">
        <div class="product-main-photo"><img id="product-main-image" src="${attr(gallery[0])}" alt="${attr(loc(p.name))}"></div>
        <div class="product-thumbs">${gallery.map((g,i)=>`<button class="product-thumb ${i===0?'active':''}" data-gallery-image="${attr(g)}"><img src="${attr(g)}" alt=""></button>`).join('')}</div>
      </div>
      <div class="product-detail-copy reveal"><span class="eyebrow">${esc(U('products'))}</span><h1>${esc(loc(p.name))}</h1><p class="lead">${esc(loc(p.description||p.short))}</p>
        <div class="detail-block"><h3>${esc(U('packingOptions'))}</h3><p>${esc(loc(p.packaging))}</p></div>
        ${(p.specs||[]).length?`<div class="detail-block"><h3>${esc(U('specifications'))}</h3><div class="spec-table">${p.specs.map(s=>`<div class="spec-row"><strong>${esc(loc(s.key))}</strong><span>${esc(loc(s.value))}</span></div>`).join('')}</div></div>`:''}
        <div class="product-detail-actions"><a class="btn btn-primary" href="${pathFor('quote')}?product=${encodeURIComponent(p.slug)}">${esc(U('requestThis'))}${icon('arrowUpRight')}</a><a class="btn btn-outline" href="${pathFor('products')}">${esc(U('backProducts'))}</a></div>
      </div>
    </div></section>
  </main>`;
}
function renderCatalog(){
  const c=state.content;
  return `${pageHero(U('pageCatalogTitle'),U('pageCatalogSub'),'/assets/images/hero-packaging.webp',U('catalog'))}<main id="main-content" class="page-content">
    <section class="section"><div class="container">
      <div class="catalog-cover reveal"><div class="catalog-copy"><span class="eyebrow">${esc(U('catalog'))}</span><h2>${esc(U('catalogIntroTitle'))}</h2><p>${esc(U('catalogIntroText'))}</p><div class="catalog-actions"><a class="btn btn-light" href="${pathFor('brochure')}">${icon('fileText')}${esc(U('companyProfile'))}</a><button class="btn btn-ghost-light" type="button" onclick="window.print()">${icon('download')}${esc(U('printBrochure'))}</button></div></div><div class="catalog-media"><img src="/assets/images/hero-packaging.webp" alt="" loading="lazy"></div></div>
      <div class="catalog-list">${c.categories.map(cat=>`<article class="catalog-item reveal"><span class="capability-icon">${icon('leaf')}</span><h3>${esc(loc(cat.name))}</h3><p>${esc(c.products.filter(p=>p.category===cat.id).map(p=>loc(p.name)).join(' • '))}</p><a class="link-arrow" href="${pathFor('products')}?category=${attr(cat.id)}">${esc(U('explore'))}${icon(state.lang==='ar'?'chevronLeft':'chevronRight')}</a></article>`).join('')}</div>
    </div></section>
  </main>`;
}
function renderCertifications(){
  const c=state.content;
  return `${pageHero(U('pageCertTitle'),U('pageCertSub'),'/assets/images/hero-process.webp',U('certifications'))}<main id="main-content" class="page-content"><section class="section"><div class="container">
    <div class="certs-page-grid">${c.certificates.map(x=>`<article class="cert-large reveal"><img src="${attr(x.image)}" alt="${attr(loc(x.title))}"><div class="cert-large-body"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p>${x.placeholder?`<span class="placeholder-note">${icon('clipboardCheck')}${esc(U('placeholder'))}</span>`:''}</div></article>`).join('')}</div>
  </div></section></main>`;
}
function renderAchievements(){
  const a=state.content.achievements;
  return `${pageHero(U('pageAchTitle'),U('pageAchSub'),'/assets/images/hero-groves.webp',U('achievements'))}<main id="main-content" class="page-content"><section class="section section-surface"><div class="container">
    <div class="timeline">${a.map(x=>`<article class="timeline-item reveal"><div class="timeline-year">${esc(x.year)}</div><div class="timeline-card"><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></div></article>`).join('')}</div>
  </div></section></main>`;
}
function renderNews(){
  const n=state.content.news;
  return `${pageHero(U('pageNewsTitle'),U('pageNewsSub'),'/assets/images/news-supplier.webp',U('news'))}<main id="main-content" class="page-content"><section class="section"><div class="container">
    <div class="article-grid">${n.map(x=>newsCard(x,true)).join('')}</div>
  </div></section></main>`;
}
function renderArticle(slug){
  const n=state.content.news.find(x=>x.slug===slug);
  if(!n) return render404();
  const date=new Intl.DateTimeFormat(U('dateLocale'),{year:'numeric',month:'long',day:'numeric'}).format(new Date(n.date+'T12:00:00'));
  return `${pageHero(loc(n.title),loc(n.excerpt),n.image,U('news'))}<main id="main-content" class="page-content"><section class="section"><article class="container article-content">
    <div class="article-hero-image reveal"><img src="${attr(n.image)}" alt="${attr(loc(n.title))}"></div><div class="news-meta">${icon('calendar')}${esc(date)}</div><p class="article-lead">${esc(loc(n.excerpt))}</p><p>${esc(loc(n.body))}</p><a class="btn btn-outline" href="${pathFor('news')}">${esc(U('latestArticles'))}</a>
  </article></section></main>`;
}
function renderFaq(){
  return `${pageHero(U('pageFaqTitle'),U('pageFaqSub'),'/assets/images/hero-groves.webp',U('faq'))}<main id="main-content" class="page-content"><section class="section"><div class="container faq-layout">
    <div class="faq-intro reveal"><span class="eyebrow">${esc(U('faq'))}</span><h2 class="section-title small">${esc(U('pageFaqTitle'))}</h2><p class="section-lead">${esc(U('pageFaqSub'))}</p><a class="btn btn-primary" href="${pathFor('contact')}">${esc(U('contact'))}${icon('arrowUpRight')}</a></div>
    <div class="faq-list">${state.content.faqs.map((x,i)=>`<div class="faq-item ${i===0?'open':''}"><button class="faq-question" type="button"><span>${esc(loc(x.q))}</span><span class="faq-icon">${icon('plus')}</span></button><div class="faq-answer"><div><p>${esc(loc(x.a))}</p></div></div></div>`).join('')}</div>
  </div></section></main>`;
}
function contactRows(){
  const c=state.content.site.contact;
  return `<div class="contact-list">
    <div class="contact-row"><span class="contact-row-icon">${icon('phone')}</span><div><strong>${esc(U('phone'))}</strong>${(c.phones||[]).map(p=>`<a href="tel:${attr(p)}">${esc(p)}</a>`).join('<br>')}</div></div>
    <div class="contact-row"><span class="contact-row-icon">${icon('mail')}</span><div><strong>${esc(U('exportEmail'))}</strong><a href="mailto:${attr(c.exportEmail)}">${esc(c.exportEmail)}</a></div></div>
    <div class="contact-row"><span class="contact-row-icon">${icon('mapPin')}</span><div><strong>${esc(U('address'))}</strong><span>${esc(loc(c.address))}</span></div></div>
    <div class="contact-row"><span class="contact-row-icon">${icon('clock')}</span><div><strong>${esc(U('hours'))}</strong><span>${esc(loc(c.hours))}</span></div></div>
  </div>`;
}
function renderContact(){
  const c=state.content.site.contact;
  return `${pageHero(U('pageContactTitle'),U('pageContactSub'),'/assets/images/hero-process.webp',U('contact'))}<main id="main-content" class="page-content"><section class="section"><div class="container">
    <div class="contact-layout">
      <aside class="contact-info-card reveal"><h2>${esc(U('contactCardTitle'))}</h2><p>${esc(U('contactCardText'))}</p>${contactRows()}</aside>
      <div class="contact-form-card reveal"><form id="contact-form"><div class="form-grid">
        <div class="form-field"><label for="name">${esc(U('name'))} *</label><input id="name" name="name" required minlength="2"></div>
        <div class="form-field"><label for="email">${esc(U('email'))} *</label><input id="email" name="email" type="email" required></div>
        <div class="form-field"><label for="phone">${esc(U('phoneOptional'))}</label><input id="phone" name="phone" type="tel"></div>
        <div class="form-field"><label for="company">${esc(U('company'))}</label><input id="company" name="company"></div>
        <div class="form-field full"><label for="subject">${esc(U('subject'))}</label><input id="subject" name="subject"></div>
        <div class="form-field full"><label for="message">${esc(U('message'))} *</label><textarea id="message" name="message" required minlength="10"></textarea></div>
        <div class="honeypot"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <div class="form-field full"><div class="form-status" id="contact-status"></div><button class="btn btn-primary" type="submit">${esc(U('sendMessage'))}${icon('arrowUpRight')}</button></div>
      </div></form></div>
    </div>
    <div class="contact-map-large reveal"><iframe src="${attr(c.mapEmbed)}" loading="lazy" title="${attr(U('location'))}"></iframe></div>
  </div></section></main>`;
}
function renderQuote(){
  const c=state.content,selected=state.query.get('product')||'';
  return `${pageHero(U('pageQuoteTitle'),U('pageQuoteSub'),'/assets/images/hero-packaging.webp',U('quote'))}<main id="main-content" class="page-content"><section class="section"><div class="container quote-layout">
    <aside class="quote-aside reveal"><span class="capability-icon">${icon('fileText')}</span><h3>${esc(U('quoteAsideTitle'))}</h3><p>${esc(U('quoteAsideText'))}</p><div class="quote-checks">${['q1','q2','q3','q4','q5'].map(k=>`<span class="quote-check">${icon('check')}${esc(U(k))}</span>`).join('')}</div></aside>
    <div class="contact-form-card reveal"><form id="quote-form"><div class="form-grid">
      <div class="form-field"><label>${esc(U('name'))} *</label><input name="name" required minlength="2"></div>
      <div class="form-field"><label>${esc(U('email'))} *</label><input name="email" type="email" required></div>
      <div class="form-field"><label>${esc(U('phone'))}</label><input name="phone" type="tel"></div>
      <div class="form-field"><label>${esc(U('company'))}</label><input name="company"></div>
      <div class="form-field"><label>${esc(U('country'))}</label><input name="country"></div>
      <div class="form-field"><label>${esc(U('product'))} *</label><select name="product" required><option value="">${esc(U('selectProduct'))}</option>${c.products.filter(p=>p.status!=='draft').map(p=>`<option value="${attr(p.slug)}" ${p.slug===selected?'selected':''}>${esc(loc(p.name))}</option>`).join('')}</select></div>
      <div class="form-field"><label>${esc(U('format'))}</label><input name="format"></div>
      <div class="form-field"><label>${esc(U('packingOptions'))}</label><select name="packaging"><option value="">${esc(U('selectPacking'))}</option>${c.packaging.map(p=>`<option value="${attr(loc(p.title))}">${esc(loc(p.title))}</option>`).join('')}</select></div>
      <div class="form-field"><label>${esc(U('quantity'))}</label><input name="quantity"></div>
      <div class="form-field"><label>${esc(U('destination'))}</label><input name="destination"></div>
      <div class="form-field full"><label>${esc(U('notes'))}</label><textarea name="message"></textarea></div>
      <div class="honeypot"><label>Website<input name="website" tabindex="-1"></label></div>
      <div class="form-field full"><div class="form-status" id="quote-status"></div><button class="btn btn-primary" type="submit">${esc(U('submitQuote'))}${icon('arrowUpRight')}</button></div>
    </div></form></div>
  </div></section></main>`;
}
function renderBrochure(){
  const c=state.content;
  return `${pageHero(U('pageBrochureTitle'),U('pageBrochureSub'),'/assets/images/hero-packaging.webp',U('companyProfile'))}<main id="main-content" class="page-content"><section class="section section-surface"><div class="container">
    <div class="print-actions"><button class="btn btn-primary" type="button" onclick="window.print()">${icon('download')}${esc(U('printBrochure'))}</button></div>
    <article class="brochure-sheet">
      <section class="brochure-cover"><img src="/assets/images/hero-groves.webp" alt=""><div class="brochure-cover-copy"><img src="${attr(c.site.logo)}" alt="${attr(c.site.companyName)}" style="width:320px;filter:brightness(0) invert(1);margin-bottom:35px"><h2>${esc(loc(c.site.tagline))}</h2><p>${esc(loc(c.site.footer.summary))}</p></div></section>
      <div class="brochure-body">
        <span class="eyebrow">${esc(U('about'))}</span><h2 class="section-title small">${esc(loc(c.about.title))}</h2><p class="section-lead">${esc(loc(c.about.body))}</p>
        <div class="packaging-grid" style="margin-top:45px">${c.capabilities.slice(0,4).map(x=>`<article class="packaging-card"><span class="capability-icon">${icon(x.icon)}</span><h3>${esc(loc(x.title))}</h3><p>${esc(loc(x.text))}</p></article>`).join('')}</div>
        <div style="margin-top:60px">${sectionHeading(U('products'),U('pageProductsTitle'))}<div class="product-grid">${c.products.filter(p=>p.status!=='draft').slice(0,6).map(productCard).join('')}</div></div>
      </div>
    </article>
  </div></section></main>`;
}
function renderLegal(type){
  const title=type==='privacy'?U('pagePrivacyTitle'):U('pageTermsTitle');
  const body=loc(state.content.legal[type]);
  return `${pageHero(title,'','/assets/images/hero-groves.webp',title)}<main id="main-content" class="page-content"><section class="section"><div class="container legal-content"><div class="legal-meta">${esc(U('lastUpdate'))}</div><p>${esc(body)}</p></div></section></main>`;
}
function render404(){
  return `${pageHero(U('notFound'),U('notFoundText'),'/assets/images/hero-groves.webp','404')}<main id="main-content"><section class="section"><div class="container empty-state"><a class="btn btn-primary" href="${pathFor()}">${esc(U('goHome'))}</a></div></section></main>`;
}
function renderPage(){
  const r=state.route;
  if(!r.length||r[0]==='home') return renderHome();
  switch(r[0]){
    case 'about':return renderAbout();
    case 'products':return r[1]?renderProductDetail(r[1]):renderProducts();
    case 'catalog':return renderCatalog();
    case 'certifications':return renderCertifications();
    case 'achievements':return renderAchievements();
    case 'news':return r[1]?renderArticle(r[1]):renderNews();
    case 'faq':return renderFaq();
    case 'contact':return renderContact();
    case 'quote':return renderQuote();
    case 'brochure':return renderBrochure();
    case 'privacy':return renderLegal('privacy');
    case 'terms':return renderLegal('terms');
    default:return render404();
  }
}

function updateMeta(){
  const s=state.content.site.seo;
  let title=loc(s.title),description=loc(s.description);
  if(routeName()==='products'&&state.route[1]){
    const p=state.content.products.find(x=>x.slug===state.route[1]);
    if(p){title=`${loc(p.name)} | ${state.content.site.companyName}`;description=loc(p.short);}
  }else if(routeName()==='news'&&state.route[1]){
    const n=state.content.news.find(x=>x.slug===state.route[1]);
    if(n){title=`${loc(n.title)} | ${state.content.site.companyName}`;description=loc(n.excerpt);}
  }else if(!isHome()){
    const map={about:'pageAboutTitle',products:'pageProductsTitle',catalog:'pageCatalogTitle',certifications:'pageCertTitle',achievements:'pageAchTitle',news:'pageNewsTitle',faq:'pageFaqTitle',contact:'pageContactTitle',quote:'pageQuoteTitle',brochure:'pageBrochureTitle',privacy:'pagePrivacyTitle',terms:'pageTermsTitle'};
    title=`${U(map[routeName()]||'home')} | ${state.content.site.companyName}`;
  }
  document.title=title;
  const ensureMeta=(selector,attrs,content)=>{
    let node=document.querySelector(selector);
    if(!node){node=document.createElement('meta');Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));document.head.appendChild(node);}
    node.setAttribute('content',String(content||''));return node;
  };
  ensureMeta('meta[name="description"]',{name:'description'},description);
  let favicon=document.querySelector('link[rel="icon"]');
  if(!favicon){favicon=document.createElement('link');favicon.rel='icon';document.head.appendChild(favicon);}
  favicon.href=state.content.site.favicon||'/assets/images/favicon.svg';
  const socialImage=state.content.site.seo.socialImage||state.content.site.logo;
  const absoluteImage=/^https?:/i.test(socialImage)?socialImage:location.origin+socialImage;
  ensureMeta('meta[property="og:title"]',{property:'og:title'},title);
  ensureMeta('meta[property="og:description"]',{property:'og:description'},description);
  ensureMeta('meta[property="og:type"]',{property:'og:type'},'website');
  ensureMeta('meta[property="og:image"]',{property:'og:image'},absoluteImage);
  ensureMeta('meta[property="og:url"]',{property:'og:url'},location.href);
  ensureMeta('meta[name="twitter:card"]',{name:'twitter:card'},'summary_large_image');
  ensureMeta('meta[name="twitter:title"]',{name:'twitter:title'},title);
  ensureMeta('meta[name="twitter:description"]',{name:'twitter:description'},description);
  ensureMeta('meta[name="twitter:image"]',{name:'twitter:image'},absoluteImage);
  let canonical=document.querySelector('link[rel="canonical"]');
  if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}
  canonical.href=location.origin+pathFor(state.route.join('/'));
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(x=>x.remove());
  LANGS.forEach(l=>{const link=document.createElement('link');link.rel='alternate';link.hreflang=l;link.href=location.origin+pathFor(state.route.join('/'),l);document.head.appendChild(link)});
  let schema=document.getElementById('site-schema');
  if(schema) schema.remove();
  schema=document.createElement('script');schema.type='application/ld+json';schema.id='site-schema';
  schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":state.content.site.companyName,"url":location.origin,"logo":location.origin+state.content.site.logo,"email":state.content.site.contact.email,"telephone":state.content.site.contact.phones?.[0],"address":{"@type":"PostalAddress","addressLocality":"Wadi El Natrun","addressRegion":"Beheira","addressCountry":"EG"}});
  document.head.appendChild(schema);
}

function initHeader(){
  const head=document.getElementById('site-header');
  const onScroll=()=>{
    if(head&&!head.classList.contains('solid')) head.classList.toggle('scrolled',scrollY>32);
    document.getElementById('back-to-top')?.classList.toggle('visible',scrollY>550);
  };
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  const langWrap=document.getElementById('lang-wrap'),langBtn=document.getElementById('lang-button');
  langBtn?.addEventListener('click',e=>{e.stopPropagation();langWrap.classList.toggle('open');langBtn.setAttribute('aria-expanded',langWrap.classList.contains('open'))});
  document.addEventListener('click',()=>{langWrap?.classList.remove('open');langBtn?.setAttribute('aria-expanded','false')});
  const panel=document.getElementById('mobile-panel');
  document.getElementById('mobile-toggle')?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');document.body.classList.add('menu-open')});
  panel?.querySelectorAll('[data-close-menu]').forEach(x=>x.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');document.body.classList.remove('menu-open')}));
  document.getElementById('back-to-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
}
function initHero(){
  const hero=document.getElementById('hero');if(!hero)return;
  const slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('.hero-dot')];
  const progress=hero.querySelector('.hero-progress span'),toggle=hero.querySelector('[data-hero-toggle]');
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=Boolean(navigator.connection?.saveData);
  let current=0,playing=state.content.site.hero.autoplay!==false&&!reduceMotion&&!saveData,start=performance.now(),raf=0,visible=true;
  const duration=Math.max(4000,Number(state.content.site.hero.interval)||7000);
  const replaceVideo=video=>{
    const poster=video.getAttribute('poster');if(!poster)return;
    const img=document.createElement('img');img.src=poster;img.alt='';img.width=1920;img.height=1080;img.decoding='async';video.replaceWith(img);
  };
  slides.forEach(slide=>{
    const video=slide.querySelector('video');
    if(video)video.addEventListener('error',()=>replaceVideo(video),{once:true});
  });
  const updateMedia=()=>{
    slides.forEach((slide,index)=>{
      const video=slide.querySelector('video');if(!video)return;
      if(index===current&&playing&&visible&&!document.hidden){
        const promise=video.play();if(promise?.catch)promise.catch(()=>{});
      }else video.pause();
    });
    if(toggle){toggle.innerHTML=icon(playing?'pause':'play');toggle.setAttribute('aria-label',U(playing?'pause':'play'));}
  };
  const show=index=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));});
    dots.forEach((dot,i)=>{const active=i===current;dot.classList.toggle('active',active);dot.setAttribute('aria-selected',String(active));});
    start=performance.now();if(progress)progress.style.width='0%';updateMedia();
  };
  const loop=now=>{
    if(playing&&visible&&!document.hidden){
      const pct=Math.min(100,(now-start)/duration*100);if(progress)progress.style.width=pct+'%';
      if(pct>=100)show(current+1);
    }
    raf=requestAnimationFrame(loop);
  };
  dots.forEach((dot,index)=>dot.addEventListener('click',()=>show(index)));
  hero.querySelector('[data-hero-prev]')?.addEventListener('click',()=>show(current-1));
  hero.querySelector('[data-hero-next]')?.addEventListener('click',()=>show(current+1));
  toggle?.addEventListener('click',()=>{playing=!playing;start=performance.now();updateMedia();});
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting!==false;updateMedia();},{threshold:.08});
    observer.observe(hero);
    state.hero={destroy:()=>{cancelAnimationFrame(raf);observer.disconnect();slides.forEach(x=>x.querySelector('video')?.pause());}};
  }else state.hero={destroy:()=>{cancelAnimationFrame(raf);slides.forEach(x=>x.querySelector('video')?.pause());}};
  document.addEventListener('visibilitychange',updateMedia,{passive:true});
  updateMedia();raf=requestAnimationFrame(loop);
}
function initMediaFallbacks(){
  document.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{
    const fallback=img.dataset.fallback;if(fallback&&img.src!==new URL(fallback,location.href).href)img.src=fallback;
  },{once:true}));
}
function initReveal(){
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)){els.forEach(x=>x.classList.add('visible'));return}
  const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -30px'});
  els.forEach(el=>ob.observe(el));
}
function initProductFilter(){
  const grid=document.getElementById('products-grid');if(!grid)return;
  let category=state.query.get('category')||'all',term='';
  const apply=()=>{
    let count=0;
    grid.querySelectorAll('.product-card').forEach(card=>{
      const show=(category==='all'||card.dataset.category===category)&&(!term||card.dataset.name.includes(term));
      card.hidden=!show;if(show)count++;
    });
    const empty=grid.querySelector('.no-results');if(empty)empty.hidden=count!==0;
  };
  document.querySelectorAll('[data-product-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    category=btn.dataset.productFilter;document.querySelectorAll('[data-product-filter]').forEach(x=>x.classList.toggle('active',x===btn));apply();
  }));
  document.getElementById('product-search')?.addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();apply()});
  apply();
}
function initFaq(){
  document.querySelectorAll('.faq-question').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')));
}
function initGallery(){
  const main=document.getElementById('product-main-image');if(!main)return;
  document.querySelectorAll('[data-gallery-image]').forEach(btn=>btn.addEventListener('click',()=>{
    main.src=btn.dataset.galleryImage;document.querySelectorAll('[data-gallery-image]').forEach(x=>x.classList.toggle('active',x===btn));
  }));
}
function formDataObject(form){return Object.fromEntries(new FormData(form).entries())}
async function sendForm(form,url,statusId,successText){
  const status=document.getElementById(statusId),button=form.querySelector('button[type="submit"]'),original=button.innerHTML;
  status.className='form-status';status.textContent='';button.disabled=true;button.textContent=U('sending');
  try{
    const payload={...formDataObject(form),language:state.lang};
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json();
    if(!res.ok||!data.ok)throw new Error(data.error||'Error');
    status.className='form-status success';status.textContent=successText;form.reset();toast(successText,'success');
  }catch(e){status.className='form-status error';status.textContent=U('formError');toast(U('formError'),'error')}
  finally{button.disabled=false;button.innerHTML=original}
}
function initForms(){
  const cf=document.getElementById('contact-form');cf?.addEventListener('submit',e=>{e.preventDefault();sendForm(cf,'/api/contact','contact-status',U('sent'))});
  const qf=document.getElementById('quote-form');qf?.addEventListener('submit',e=>{e.preventDefault();sendForm(qf,'/api/quote','quote-status',U('quoteSent'))});
}
function toast(message,type=''){
  let stack=document.querySelector('.toast-stack');
  if(!stack){stack=document.createElement('div');stack.className='toast-stack';document.body.appendChild(stack)}
  const el=document.createElement('div');el.className=`toast ${type}`;el.innerHTML=`${icon(type==='error'?'x':'check')}<span>${esc(message)}</span>`;stack.appendChild(el);
  setTimeout(()=>el.remove(),4200);
}
function initPage(){
  initHeader();initHero();initMediaFallbacks();initReveal();initProductFilter();initFaq();initGallery();initForms();
  window.hydrateIcons?.();
}
function applyTheme(){
  const th=state.content?.site?.theme||{};
  if(th.primary)document.documentElement.style.setProperty('--green-700',th.primary);
  if(th.dark)document.documentElement.style.setProperty('--green-950',th.dark);
  if(th.accent)document.documentElement.style.setProperty('--olive-500',th.accent);
}
function render(){
  state.hero?.destroy?.();parseLocation();applyTheme();updateMeta();
  document.getElementById('site-shell').innerHTML=`${header()}${mobilePanel()}${renderPage()}${footer()}${sideRail()}<div class="toast-stack"></div>`;
  initPage();scrollTo(0,0);
  fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:location.pathname,source:document.referrer?new URL(document.referrer).hostname:'direct'})}).catch(()=>{});
}
async function boot(){
  try{
    let content=null;
    try{
      const res=await fetch('/api/content',{cache:'no-store'}),data=await res.json();
      if(res.ok&&data.ok)content=data.content;
    }catch{}
    if(!content){
      const fallback=await fetch('/assets/data/content.json',{cache:'no-cache'});
      if(!fallback.ok)throw new Error('Content unavailable');
      content=await fallback.json();
    }
    state.content=content;parseLocation();render();
  }catch{
    document.getElementById('site-shell').innerHTML=`<main class="load-error"><img src="/assets/images/logo-default.svg" alt="Zahrat El-Rabea"><h1>Content is temporarily unavailable</h1><p>Please refresh the page shortly.</p></main>`;
  }
}
document.addEventListener('DOMContentLoaded',boot);
})();