/**
 * Zahrat El-Rabea production CMS
 * Zero runtime dependencies – Node.js 18+.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { URL } = require('url');

const ROOT = __dirname;
function loadEnvFile(filePath) {
  try {
    const raw=fs.readFileSync(filePath,'utf8');
    for(const line of raw.split(/\r?\n/)){
      const trimmed=line.trim();
      if(!trimmed || trimmed.startsWith('#')) continue;
      const match=/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
      if(!match || process.env[match[1]]!==undefined) continue;
      let value=match[2].trim();
      if((value.startsWith('\"')&&value.endsWith('\"'))||(value.startsWith("'")&&value.endsWith("'"))) value=value.slice(1,-1);
      process.env[match[1]]=value.replace(/\\n/g,'\n');
    }
  } catch(err) {
    if(err.code!=='ENOENT') console.warn('Environment file could not be read:',err.message);
  }
}
loadEnvFile(path.join(ROOT,'.env'));
const PUBLIC_DIR = path.join(ROOT, 'public');
const ADMIN_DIR = path.join(ROOT, 'admin');
const DATA_DIR = path.join(ROOT, 'data');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const SITE_URL = String(process.env.SITE_URL || '').replace(/\/+$/, '');
const SESSION_TTL = 12 * 60 * 60 * 1000;
const MAX_JSON = 35 * 1024 * 1024;
const sessions = new Map();
const loginAttempts = new Map();
const formAttempts = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2'
};

const allowedUploads = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['application/pdf', '.pdf']
]);

function nowIso() { return new Date().toISOString(); }
function randomId(prefix = '') { return prefix + crypto.randomBytes(10).toString('hex'); }
function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || 'unknown';
}
function requestProto(req) {
  const forwarded=String(req.headers['x-forwarded-proto']||'').split(',')[0].trim().toLowerCase();
  return forwarded==='https'||req.socket.encrypted?'https':'http';
}
function requestHost(req) {
  const candidate=String(req.headers['x-forwarded-host']||req.headers.host||'app.internal').split(',')[0].trim();
  return /^[a-z0-9.:[\]-]+$/i.test(candidate)?candidate:'app.internal';
}
function publicBase(req) { return SITE_URL || `${requestProto(req)}://${requestHost(req)}`; }
function safeEqual(a, b) {
  try {
    const aa = Buffer.from(String(a), 'hex');
    const bb = Buffer.from(String(b), 'hex');
    return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
  } catch { return false; }
}
function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), String(salt), 64).toString('hex');
}
async function readJson(name, fallback) {
  try {
    return JSON.parse(await fsp.readFile(path.join(DATA_DIR, name), 'utf8'));
  } catch { return fallback; }
}
async function writeJson(name, value) {
  const serialized=JSON.stringify(value, null, 2);
  const target = path.join(DATA_DIR, name);
  const temp = `${target}.${process.pid}.tmp`;
  await fsp.writeFile(temp, serialized, 'utf8');
  await fsp.rename(temp, target);
  if(name==='content.json'){
    const fallbackDir=path.join(PUBLIC_DIR,'assets','data');
    const fallback=path.join(fallbackDir,'content.json');
    const fallbackTemp=`${fallback}.${process.pid}.tmp`;
    await fsp.mkdir(fallbackDir,{recursive:true});
    await fsp.writeFile(fallbackTemp,serialized,'utf8');
    await fsp.rename(fallbackTemp,fallback);
  }
}
function json(res, status, data, extraHeaders = {}) {
  const body = Buffer.from(JSON.stringify(data));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}
function text(res, status, body, type='text/plain; charset=utf-8', extraHeaders={}) {
  const data = Buffer.from(String(body));
  res.writeHead(status, {'Content-Type':type,'Content-Length':data.length,...extraHeaders});
  res.end(data);
}
function redirect(res, location, status=302) {
  res.writeHead(status, {Location: location, 'Cache-Control':'no-store'});
  res.end();
}
function parseCookies(req) {
  const out={};
  String(req.headers.cookie || '').split(';').forEach(part=>{
    const idx=part.indexOf('=');
    if(idx>0) out[part.slice(0,idx).trim()]=decodeURIComponent(part.slice(idx+1).trim());
  });
  return out;
}
function setSecurityHeaders(res, req) {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy','same-origin');
  res.setHeader('Cross-Origin-Resource-Policy','same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies','none');
  res.setHeader('Origin-Agent-Cluster','?1');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: data: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-src https://www.google.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ].join('; '));
  if (requestProto(req) === 'https') {
    res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  }
}
async function readBody(req, max=MAX_JSON) {
  return await new Promise((resolve,reject)=>{
    const chunks=[];
    let size=0;
    req.on('data',chunk=>{
      size+=chunk.length;
      if(size>max){
        reject(Object.assign(new Error('Payload too large'),{status:413}));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end',()=>{
      try {
        const raw=Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error('Invalid JSON'),{status:400}));
      }
    });
    req.on('error',reject);
  });
}
function cleanString(value, max=5000) {
  return String(value ?? '').replace(/\u0000/g,'').trim().slice(0,max);
}
function rateAllowed(bucket, key, max, windowMs) {
  const now=Date.now();
  const record=bucket.get(key);
  if(!record || now-record.start>windowMs){
    bucket.set(key,{start:now,count:1});
    return true;
  }
  record.count++;
  return record.count<=max;
}
function getSession(req) {
  const token=parseCookies(req).zr_session;
  if(!token) return null;
  const session=sessions.get(token);
  if(!session || session.expires<Date.now()){
    if(token) sessions.delete(token);
    return null;
  }
  session.expires=Date.now()+SESSION_TTL;
  return {...session,token};
}
function requireAuth(req,res,csrf=false) {
  const session=getSession(req);
  if(!session){ json(res,401,{ok:false,error:'AUTH_REQUIRED'}); return null; }
  if(csrf && req.headers['x-csrf-token']!==session.csrf){
    json(res,403,{ok:false,error:'INVALID_CSRF'});
    return null;
  }
  return session;
}
async function serveFile(req,res,filePath,cache='public, max-age=3600') {
  try {
    const stat=await fsp.stat(filePath);
    if(!stat.isFile()) throw new Error('not file');
    const ext=path.extname(filePath).toLowerCase();
    const type=mimeTypes[ext] || 'application/octet-stream';
    const etag=`W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
    const common={'Content-Type':type,'Cache-Control':cache,'ETag':etag,'Last-Modified':stat.mtime.toUTCString()};
    if(req.headers['if-none-match']===etag){res.writeHead(304,common);res.end();return;}
    const range=req.headers.range;
    if(range && (type.startsWith('video/') || type==='application/pdf')){
      const match=/bytes=(\d*)-(\d*)/.exec(range);
      if(match){
        const start=match[1]?Number(match[1]):0;
        const end=match[2]?Number(match[2]):Math.min(start+1024*1024-1,stat.size-1);
        if(start>=stat.size || end>=stat.size || start>end){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
        res.writeHead(206,{...common,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes'});
        if(req.method==='HEAD'){res.end();return;}
        fs.createReadStream(filePath,{start,end}).pipe(res);return;
      }
    }
    const compressible=/^(text\/|application\/(javascript|json|xml)|image\/svg\+xml)/.test(type);
    const accept=String(req.headers['accept-encoding']||'');
    const canCompress=compressible&&stat.size>1024;
    const headers={...common,...(type.startsWith('video/')||type==='application/pdf'?{'Accept-Ranges':'bytes'}:{})};
    if(req.method==='HEAD'){res.writeHead(200,{...headers,'Content-Length':stat.size});res.end();return;}
    if(canCompress&&accept.includes('br')){
      res.writeHead(200,{...headers,'Content-Encoding':'br','Vary':'Accept-Encoding'});
      fs.createReadStream(filePath).pipe(zlib.createBrotliCompress({params:{[zlib.constants.BROTLI_PARAM_QUALITY]:5}})).pipe(res);return;
    }
    if(canCompress&&accept.includes('gzip')){
      res.writeHead(200,{...headers,'Content-Encoding':'gzip','Vary':'Accept-Encoding'});
      fs.createReadStream(filePath).pipe(zlib.createGzip({level:6})).pipe(res);return;
    }
    res.writeHead(200,{...headers,'Content-Length':stat.size});
    fs.createReadStream(filePath).pipe(res);
  } catch {
    text(res,404,'Not found');
  }
}
function safePath(base, requested) {
  const normalized=path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/, '');
  const full=path.resolve(base, normalized);
  return full.startsWith(path.resolve(base)+path.sep) || full===path.resolve(base) ? full : null;
}
function publicContent(content) {
  return content; // Content file contains public/editorial data only.
}
function languageText(value, lang='en') {
  if(value && typeof value==='object') return value[lang] || value.en || value.ar || Object.values(value)[0] || '';
  return String(value || '');
}
async function buildSitemap(req) {
  const content=await readJson('content.json',{site:{languages:['ar','en','es','it']},products:[],news:[]});
  const base=publicBase(req);
  const langs=content.site.languages || ['ar','en','es','it'];
  const staticRoutes=['','about','products','catalog','certifications','achievements','news','faq','contact','quote','brochure','privacy','terms'];
  const urls=[];
  for(const lang of langs){
    for(const route of staticRoutes) urls.push(`${base}/${lang}${route?'/'+route:''}`);
    for(const p of content.products||[]) if(p.status!=='draft') urls.push(`${base}/${lang}/products/${encodeURIComponent(p.slug)}`);
    for(const n of content.news||[]) urls.push(`${base}/${lang}/news/${encodeURIComponent(n.slug)}`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u.replace(/&/g,'&amp;')}</loc></url>`).join('\n')}\n</urlset>`;
}
function normalizeContent(input) {
  if(!input || typeof input!=='object' || Array.isArray(input)) throw Object.assign(new Error('Invalid content'),{status:400});
  const raw=JSON.stringify(input);
  if(raw.length>8*1024*1024) throw Object.assign(new Error('Content is too large'),{status:413});
  return input;
}
async function appendAnalytics(payload, req) {
  const analytics=await readJson('analytics.json',{daily:{},pages:{},sources:{},countries:{}});
  const date=new Date().toISOString().slice(0,10);
  analytics.daily[date]=(analytics.daily[date]||0)+1;
  const page=cleanString(payload.page||'/',180);
  analytics.pages[page]=(analytics.pages[page]||0)+1;
  const source=cleanString(payload.source||'direct',80);
  analytics.sources[source]=(analytics.sources[source]||0)+1;
  const country=cleanString(payload.country||'Unknown',80);
  analytics.countries[country]=(analytics.countries[country]||0)+1;
  await writeJson('analytics.json',analytics);
}
function sortCounts(obj,limit=10){
  return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([label,value])=>({label,value}));
}

async function apiRoute(req,res,url) {
  const pathname=url.pathname;

  if(pathname==='/api/health' && req.method==='GET'){
    return json(res,200,{ok:true,service:'Zahrat El-Rabea CMS',time:nowIso(),admin:'/eslammm'});
  }

  if(pathname==='/api/content' && req.method==='GET'){
    const content=await readJson('content.json',{});
    return json(res,200,{ok:true,content:publicContent(content)});
  }

  if(pathname==='/api/auth/login' && req.method==='POST'){
    const ip=clientIp(req);
    if(!rateAllowed(loginAttempts,ip,8,15*60*1000)) return json(res,429,{ok:false,error:'TOO_MANY_ATTEMPTS'});
    const body=await readBody(req,1024*32);
    const email=cleanString(body.email,160).toLowerCase();
    const password=String(body.password||'');
    const users=await readJson('users.json',[]);
    const user=users.find(u=>u.active!==false && String(u.email).toLowerCase()===email);
    const storedHash=user&&(user.passwordHash||user.hash);
    const valid=user && storedHash && safeEqual(hashPassword(password,user.salt),storedHash);
    // Similar response timing.
    if(!valid){
      hashPassword(password||'invalid','fixed-login-timing-salt');
      return json(res,401,{ok:false,error:'INVALID_CREDENTIALS'});
    }
    const token=crypto.randomBytes(32).toString('hex');
    const session={userId:user.id,email:user.email,name:user.name,role:user.role,csrf:crypto.randomBytes(24).toString('hex'),expires:Date.now()+SESSION_TTL};
    sessions.set(token,session);
    const secure=requestProto(req)==='https' ? '; Secure' : '';
    return json(res,200,{ok:true,user:{id:user.id,name:user.name,email:user.email,role:user.role,mustChangePassword:!!user.mustChangePassword},csrf:session.csrf},{
      'Set-Cookie':`zr_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL/1000)}${secure}`
    });
  }

  if(pathname==='/api/auth/logout' && req.method==='POST'){
    const session=getSession(req);
    if(session) sessions.delete(session.token);
    return json(res,200,{ok:true},{'Set-Cookie':'zr_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'});
  }

  if(pathname==='/api/admin/me' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    return json(res,200,{ok:true,user:{id:session.userId,name:session.name,email:session.email,role:session.role},csrf:session.csrf,adminPath:'/eslammm'});
  }

  if(pathname==='/api/admin/change-password' && req.method==='POST'){
    const session=requireAuth(req,res,true); if(!session) return;
    const body=await readBody(req,1024*32);
    const current=String(body.current||'');
    const next=String(body.next||'');
    if(next.length<10 || !/[A-Z]/.test(next) || !/[a-z]/.test(next) || !/\d/.test(next)){
      return json(res,400,{ok:false,error:'WEAK_PASSWORD'});
    }
    const users=await readJson('users.json',[]);
    const idx=users.findIndex(u=>u.id===session.userId);
    const currentHash=idx>=0&&(users[idx].passwordHash||users[idx].hash);
    if(idx<0 || !currentHash || !safeEqual(hashPassword(current,users[idx].salt),currentHash)){
      return json(res,400,{ok:false,error:'CURRENT_PASSWORD_WRONG'});
    }
    const salt=crypto.randomBytes(16).toString('hex');
    users[idx].salt=salt;
    users[idx].passwordHash=hashPassword(next,salt);
    delete users[idx].hash;
    users[idx].mustChangePassword=false;
    users[idx].updatedAt=nowIso();
    await writeJson('users.json',users);
    return json(res,200,{ok:true});
  }

  if(pathname==='/api/admin/dashboard' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    const [content,messages,quotes,analytics]=await Promise.all([
      readJson('content.json',{}),readJson('messages.json',[]),readJson('quotes.json',[]),
      readJson('analytics.json',{daily:{},pages:{},sources:{},countries:{}})
    ]);
    const days=Object.entries(analytics.daily||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14).map(([date,value])=>({date,value}));
    return json(res,200,{ok:true,data:{
      totals:{
        products:(content.products||[]).length,
        published:(content.products||[]).filter(x=>x.status!=='draft').length,
        heroSlides:content.site?.hero?.slides?.length||0,
        news:(content.news||[]).length,
        unreadMessages:messages.filter(x=>!x.read).length,
        openQuotes:quotes.filter(x=>!['closed','archived'].includes(x.status)).length,
        visits:Object.values(analytics.daily||{}).reduce((a,b)=>a+Number(b||0),0)
      },
      daily:days,
      topPages:sortCounts(analytics.pages),
      sources:sortCounts(analytics.sources),
      countries:sortCounts(analytics.countries),
      recentMessages:messages.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,5),
      recentQuotes:quotes.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,5)
    }});
  }

  if(pathname==='/api/admin/content' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    return json(res,200,{ok:true,content:await readJson('content.json',{})});
  }

  if(pathname==='/api/admin/content' && req.method==='PUT'){
    const session=requireAuth(req,res,true); if(!session) return;
    const body=await readBody(req);
    const content=normalizeContent(body.content);
    content._meta={...(content._meta||{}),updatedAt:nowIso(),updatedBy:session.email};
    await writeJson('content.json',content);
    return json(res,200,{ok:true,updatedAt:content._meta.updatedAt});
  }

  if(pathname==='/api/admin/upload' && req.method==='POST'){
    const session=requireAuth(req,res,true); if(!session) return;
    const body=await readBody(req,MAX_JSON);
    const dataUrl=String(body.dataUrl||'');
    const match=/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
    if(!match || !allowedUploads.has(match[1])) return json(res,400,{ok:false,error:'UNSUPPORTED_FILE'});
    const buffer=Buffer.from(match[2].replace(/\s/g,''),'base64');
    const max=match[1].startsWith('video/')?30*1024*1024:match[1]==='application/pdf'?15*1024*1024:8*1024*1024;
    if(!buffer.length || buffer.length>max) return json(res,413,{ok:false,error:'FILE_TOO_LARGE'});
    const category=['logos','hero','products','documents'].includes(body.category)?body.category:'documents';
    const ext=allowedUploads.get(match[1]);
    const stem=cleanString(path.basename(body.filename||'upload',path.extname(body.filename||'')),60).replace(/[^A-Za-z0-9_-]+/g,'-')||'upload';
    const filename=`${Date.now()}-${stem}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const dir=path.join(UPLOADS_DIR,category);
    await fsp.mkdir(dir,{recursive:true});
    await fsp.writeFile(path.join(dir,filename),buffer,{flag:'wx'});
    return json(res,201,{ok:true,url:`/uploads/${category}/${filename}`,filename,mime:match[1],size:buffer.length});
  }

  if(pathname==='/api/admin/messages' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    const rows=await readJson('messages.json',[]);
    return json(res,200,{ok:true,items:rows.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))});
  }
  if(pathname.startsWith('/api/admin/messages/') && req.method==='PATCH'){
    const session=requireAuth(req,res,true); if(!session) return;
    const id=decodeURIComponent(pathname.split('/').pop());
    const body=await readBody(req,1024*32);
    const rows=await readJson('messages.json',[]);
    const item=rows.find(x=>x.id===id);
    if(!item) return json(res,404,{ok:false,error:'NOT_FOUND'});
    item.read=body.read!==false;
    item.status=cleanString(body.status||item.status||'new',30);
    item.updatedAt=nowIso();
    await writeJson('messages.json',rows);
    return json(res,200,{ok:true,item});
  }
  if(pathname==='/api/admin/quotes' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    const rows=await readJson('quotes.json',[]);
    return json(res,200,{ok:true,items:rows.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))});
  }
  if(pathname.startsWith('/api/admin/quotes/') && req.method==='PATCH'){
    const session=requireAuth(req,res,true); if(!session) return;
    const id=decodeURIComponent(pathname.split('/').pop());
    const body=await readBody(req,1024*32);
    const rows=await readJson('quotes.json',[]);
    const item=rows.find(x=>x.id===id);
    if(!item) return json(res,404,{ok:false,error:'NOT_FOUND'});
    item.status=cleanString(body.status||item.status||'new',30);
    item.notes=cleanString(body.notes||item.notes||'',3000);
    item.updatedAt=nowIso();
    await writeJson('quotes.json',rows);
    return json(res,200,{ok:true,item});
  }

  if(pathname==='/api/admin/backup' && req.method==='GET'){
    const session=requireAuth(req,res); if(!session) return;
    const data={
      exportedAt:nowIso(),content:await readJson('content.json',{}),
      messages:await readJson('messages.json',[]),quotes:await readJson('quotes.json',[]),
      analytics:await readJson('analytics.json',{})
    };
    const body=Buffer.from(JSON.stringify(data,null,2));
    res.writeHead(200,{
      'Content-Type':'application/json; charset=utf-8',
      'Content-Disposition':`attachment; filename="zahrat-backup-${new Date().toISOString().slice(0,10)}.json"`,
      'Content-Length':body.length,'Cache-Control':'no-store'
    });
    return res.end(body);
  }

  if(pathname==='/api/contact' && req.method==='POST'){
    const ip=clientIp(req);
    if(!rateAllowed(formAttempts,`contact:${ip}`,6,60*60*1000)) return json(res,429,{ok:false,error:'TOO_MANY_REQUESTS'});
    const body=await readBody(req,1024*128);
    if(body.website) return json(res,200,{ok:true}); // honeypot
    const name=cleanString(body.name,120), email=cleanString(body.email,160), message=cleanString(body.message,5000);
    if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length<10) return json(res,400,{ok:false,error:'INVALID_FORM'});
    const rows=await readJson('messages.json',[]);
    const item={id:randomId('msg_'),name,email,phone:cleanString(body.phone,80),company:cleanString(body.company,160),
      subject:cleanString(body.subject,200),message,language:cleanString(body.language,8),read:false,status:'new',createdAt:nowIso()};
    rows.push(item); await writeJson('messages.json',rows);
    return json(res,201,{ok:true,id:item.id});
  }

  if(pathname==='/api/quote' && req.method==='POST'){
    const ip=clientIp(req);
    if(!rateAllowed(formAttempts,`quote:${ip}`,5,60*60*1000)) return json(res,429,{ok:false,error:'TOO_MANY_REQUESTS'});
    const body=await readBody(req,1024*180);
    if(body.website) return json(res,200,{ok:true});
    const name=cleanString(body.name,120), email=cleanString(body.email,160);
    if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res,400,{ok:false,error:'INVALID_FORM'});
    const rows=await readJson('quotes.json',[]);
    const item={id:randomId('rfq_'),name,email,phone:cleanString(body.phone,80),company:cleanString(body.company,160),
      country:cleanString(body.country,100),product:cleanString(body.product,200),format:cleanString(body.format,120),
      packaging:cleanString(body.packaging,200),quantity:cleanString(body.quantity,120),destination:cleanString(body.destination,160),
      message:cleanString(body.message,5000),language:cleanString(body.language,8),status:'new',notes:'',createdAt:nowIso()};
    rows.push(item); await writeJson('quotes.json',rows);
    return json(res,201,{ok:true,id:item.id});
  }

  if(pathname==='/api/analytics' && req.method==='POST'){
    const body=await readBody(req,1024*16);
    if(rateAllowed(formAttempts,`analytics:${clientIp(req)}`,120,60*60*1000)) await appendAnalytics(body,req);
    return json(res,200,{ok:true});
  }

  return false;
}

async function handle(req,res) {
  setSecurityHeaders(res,req);
  const url=new URL(req.url,'http://app.internal');
  const pathname=decodeURIComponent(url.pathname);

  try {
    if(pathname.startsWith('/api/')){
      const handled=await apiRoute(req,res,url);
      if(handled!==false) return;
      return json(res,404,{ok:false,error:'API_NOT_FOUND'});
    }

    if(pathname==='/robots.txt'){
      return text(res,200,`User-agent: *\nAllow: /\nDisallow: /eslammm\nDisallow: /api/admin\nSitemap: ${publicBase(req)}/sitemap.xml\n`,'text/plain; charset=utf-8',{'Cache-Control':'public, max-age=3600'});
    }
    if(pathname==='/sitemap.xml'){
      return text(res,200,await buildSitemap(req),'application/xml; charset=utf-8',{'Cache-Control':'public, max-age=1800'});
    }

    if(pathname==='/zr-admin-portal-2026' || pathname.startsWith('/zr-admin-portal-2026/')){
      return redirect(res,'/eslammm',301);
    }

    if(pathname==='/eslammm' || pathname.startsWith('/eslammm/')){
      return serveFile(req,res,path.join(ADMIN_DIR,'index.html'),'no-store');
    }
    if(pathname.startsWith('/eslammm-assets/')){
      const rel=pathname.slice('/eslammm-assets/'.length);
      const file=safePath(path.join(ADMIN_DIR,'assets'),rel);
      return file?serveFile(req,res,file,'public, max-age=3600, stale-while-revalidate=300'):text(res,404,'Not found');
    }
    if(pathname.startsWith('/uploads/')){
      const file=safePath(UPLOADS_DIR,pathname.slice('/uploads/'.length));
      return file?serveFile(req,res,file,'public, max-age=31536000, immutable'):text(res,404,'Not found');
    }
    if(pathname.startsWith('/assets/')){
      const file=safePath(path.join(PUBLIC_DIR,'assets'),pathname.slice('/assets/'.length));
      return file?serveFile(req,res,file,'public, max-age=604800, stale-while-revalidate=86400'):text(res,404,'Not found');
    }

    // Public app routes.
    if(req.method==='GET' || req.method==='HEAD'){
      return serveFile(req,res,path.join(PUBLIC_DIR,'index.html'),'no-cache');
    }
    text(res,405,'Method not allowed');
  } catch(err) {
    const status=Number(err.status)||500;
    if(status>=500) console.error(err);
    if(pathname.startsWith('/api/')) return json(res,status,{ok:false,error:status===500?'SERVER_ERROR':err.message});
    return text(res,status,status===500?'Server error':err.message);
  }
}

async function init() {
  for(const dir of [DATA_DIR,UPLOADS_DIR,path.join(UPLOADS_DIR,'logos'),path.join(UPLOADS_DIR,'hero'),path.join(UPLOADS_DIR,'products'),path.join(UPLOADS_DIR,'documents')]){
    await fsp.mkdir(dir,{recursive:true});
  }
  const required=['content.json','users.json','messages.json','quotes.json','analytics.json'];
  for(const file of required){
    try { await fsp.access(path.join(DATA_DIR,file)); }
    catch { throw new Error(`Missing required data file: ${file}`); }
  }
  await writeJson('content.json',await readJson('content.json',{}));
  const server=http.createServer(handle);
  server.keepAliveTimeout=65000;
  server.headersTimeout=66000;
  server.requestTimeout=120000;
  server.listen(PORT,HOST,()=>{
    console.log(`Zahrat El-Rabea CMS listening on ${HOST}:${PORT}`);
    console.log('Admin path: /eslammm');
  });
  const shutdown=signal=>{
    console.log(`${signal} received; closing server.`);
    server.close(()=>process.exit(0));
    setTimeout(()=>process.exit(1),10000).unref();
  };
  process.once('SIGINT',()=>shutdown('SIGINT'));
  process.once('SIGTERM',()=>shutdown('SIGTERM'));
  return server;
}

process.on('uncaughtException',err=>console.error('Uncaught:',err));
process.on('unhandledRejection',err=>console.error('Unhandled:',err));
init().then(server=>{module.exports=server}).catch(err=>{console.error(err);process.exit(1);});
