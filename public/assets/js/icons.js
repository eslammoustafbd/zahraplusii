(() => {
  const paths = {
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z"/>',
    chevronDown:'<path d="m7 10 5 5 5-5"/>',
    chevronLeft:'<path d="m14 7-5 5 5 5"/>',
    chevronRight:'<path d="m10 7 5 5-5 5"/>',
    arrowRight:'<path d="M5 12h14M14 7l5 5-5 5"/>',
    arrowUpRight:'<path d="M7 17 17 7M8 7h9v9"/>',
    arrowUp:'<path d="m7 11 5-5 5 5M12 6v12"/>',
    leaf:'<path d="M19 3C11.5 3 5.5 6.3 4 13.2c-.8 3.6 1.5 6.8 5.1 6.8 6.4 0 9.8-7.2 9.9-17Z"/><path d="M5 19c2.4-5.6 6.3-8.8 11.7-10.5"/>',
    sprout:'<path d="M12 21v-8"/><path d="M12 13c-5.2 0-8-2.7-8-7 5.2 0 8 2.7 8 7ZM12 16c0-4.3 2.8-7 8-7 0 4.3-2.8 7-8 7Z"/>',
    factory:'<path d="M3 21V10l6 3V9l6 3V5h4v16Z"/><path d="M3 21h18M7 17h2M12 17h2M17 17h2"/>',
    package:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5l8 4.5"/>',
    shield:'<path d="M12 3 20 6v5c0 5.2-3.2 8.6-8 10-4.8-1.4-8-4.8-8-10V6Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    shieldCheck:'<path d="M12 3 20 6v5c0 5.2-3.2 8.6-8 10-4.8-1.4-8-4.8-8-10V6Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    badgeCheck:'<path d="M9.3 3.4 12 2l2.7 1.4 3-.1 1.4 2.7 2.4 1.7-.7 2.9.7 2.9-2.4 1.7-1.4 2.7-3-.1L12 20l-2.7-1.4-3 .1-1.4-2.7-2.4-1.7.7-2.9-.7-2.9 2.4-1.7 1.4-2.7Z"/><path d="m8 11 2.5 2.5L16 8"/>',
    ship:'<path d="M3 17c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1"/><path d="m5 15-1-7h16l-2 7M8 8V4h8v4M12 4v11"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    messages:'<path d="M21 13a7 7 0 0 1-7 7H7l-4 2 1.5-4.5A8 8 0 1 1 21 13Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    scan:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/>',
    flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/>',
    clipboardCheck:'<path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m8 14 2 2 5-5"/>',
    headphones:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2ZM20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2ZM17 19c0 1.1-.9 2-2 2h-3"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    mapPin:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    whatsapp:'<path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3 20.4l1.4-5.1A8.4 8.4 0 1 1 20.5 11.6Z"/><path d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.5 0 .7.5.9 1.2 1.7 2.1 2.2.2.2.5.2.7 0l.9-1c.2-.2.5-.3.7-.2l1.8.9c.3.1.4.4.4.6 0 .4-.2 1.4-.9 2-.6.5-1.3.8-2.4.5-1.1-.3-2.8-1-4.4-2.5-1.4-1.3-2.4-2.9-2.7-4-.3-1 .1-1.9.5-2.3Z"/>',
    facebook:'<path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3.5l.5-4h-4V9c0-.7.3-1 1-1Z"/>',
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 0 1 6 0v4"/>',
    youtube:'<path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.6 6 12 6 12 6s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 8.2 26 26 0 0 0 3 16a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.2.4 7.2.4s5.6 0 7.2-.4A2.5 2.5 0 0 0 21 16a26 26 0 0 0 0-7.8Z"/><path d="m10 9 5 3-5 3Z"/>',
    play:'<path d="m8 5 11 7-11 7Z"/>',
    pause:'<path d="M9 5v14M15 5v14"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/>',
    jar:'<path d="M7 3h10M8 3v4a4 4 0 0 0-2 3.5V19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8.5A4 4 0 0 0 16 7V3M6 12h12"/>',
    bottle:'<path d="M9 3h6v4l2 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-3Z"/><path d="M9 7h6M7 13h10"/>',
    can:'<ellipse cx="12" cy="5" rx="7" ry="2.5"/><path d="M5 5v14c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5"/><ellipse cx="12" cy="19" rx="7" ry="2.5"/>',
    drum:'<ellipse cx="12" cy="5" rx="7" ry="2.5"/><path d="M5 5v14c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5M5 10h14M5 16h14"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    fileText:'<path d="M6 2h8l4 4v16H6Z"/><path d="M14 2v5h5M9 13h6M9 17h6M9 9h2"/>',
    quote:'<path d="M8 12H4a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3v1h2v5H3v-5c0-.3 0-.7.1-1M20 12h-4a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3v1h2v5h-5v-5c0-.3 0-.7.1-1"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    externalLink:'<path d="M14 4h6v6M10 14 20 4"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    building:'<path d="M4 21V5l8-3 8 3v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6M12 17v4"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:'<path d="m3 3 18 18M10.6 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16.4 16.4 0 0 1-3 4.2M6.1 6.1C3.4 8.2 2 12 2 12s3.5 7 10 7c1.8 0 3.3-.5 4.6-1.2M9.8 9.8a3 3 0 0 0 4.2 4.2"/>',
    layoutDashboard:'<rect x="3" y="3" width="7" height="8" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/>',
    palette:'<path d="M12 3a9 9 0 0 0 0 18h1.5a1.8 1.8 0 0 0 1.4-3l-.5-.6a1.8 1.8 0 0 1 1.4-3h2.1A3.1 3.1 0 0 0 21 11.2 9 9 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="15" cy="7" r="1"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    award:'<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9"/>',
    newspaper:'<path d="M5 4h14v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 8h7M8 12h7M8 16h4"/>',
    circleHelp:'<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 1 1 4.2 1.8c-1 .8-2 1.3-2 3.2M12 18h.01"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    save:'<path d="M5 3h12l3 3v15H4V4a1 1 0 0 1 1-1Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
    arrowDown:'<path d="M12 5v14M7 14l5 5 5-5"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    edit:'<path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20H4v-4Z"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    alertTriangle:'<path d="M10.3 3.7 2.6 18a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.9-2l2 2M4 16l2 2a7 7 0 0 0 11.9-2"/>',
    inbox:'<path d="M4 4h16v16H4Z"/><path d="M4 14h4l2 3h4l2-3h4"/>',
    logout:'<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
    server:'<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
    database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>'
  };
  const aliases={
    'badge-check':'badgeCheck','clipboard-check':'clipboardCheck','shield-check':'shieldCheck',
    'arrow-up-right':'arrowUpRight','arrow-right':'arrowRight','arrow-up':'arrowUp','arrow-down':'arrowDown',
    'chevron-left':'chevronLeft','chevron-right':'chevronRight','chevron-down':'chevronDown',
    'map-pin':'mapPin','file-text':'fileText','external-link':'externalLink',
    'layout-dashboard':'layoutDashboard','circle-help':'circleHelp','eye-off':'eyeOff'
  };
  const normalizeName=name=>{
    const raw=String(name||'leaf').trim();
    if(paths[raw])return raw;
    if(aliases[raw])return aliases[raw];
    const camel=raw.replace(/[-_ ]+([a-zA-Z0-9])/g,(_,c)=>c.toUpperCase());
    return paths[camel]?camel:'leaf';
  };
  window.ZRIcon = function(name, className=''){
    const key=normalizeName(name),body=paths[key];
    return `<svg class="zr-icon ${className}" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  };
  window.ZRIcon.has=name=>normalizeName(name)!=='leaf'||String(name)==='leaf';
  window.hydrateIcons = function(root=document){
    root.querySelectorAll('[data-icon]').forEach(el=>{
      if(el.dataset.iconReady) return;
      el.innerHTML=window.ZRIcon(el.dataset.icon,el.dataset.iconClass||'');
      el.dataset.iconReady='1';
    });
  };
})();