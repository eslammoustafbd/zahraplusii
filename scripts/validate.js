'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const {spawnSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const errors=[];
const passes=[];
const fail=m=>errors.push(m);
const pass=m=>passes.push(m);
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const exists=p=>fs.existsSync(path.join(ROOT,p));
const required=[
  'server.js','public/index.html','public/assets/css/site.css','public/assets/js/site.js',
  'public/assets/js/icons.js','public/assets/data/content.json','admin/index.html',
  'admin/assets/admin.css','admin/assets/admin.js','data/content.json','data/users.json'
];
for(const file of required) exists(file)?pass(`required: ${file}`):fail(`missing: ${file}`);

let content;
try{content=JSON.parse(read('data/content.json'));pass('content JSON parses');}catch(e){fail('content JSON: '+e.message);content={};}
try{
  const fallback=JSON.parse(read('public/assets/data/content.json'));
  if(JSON.stringify(fallback)!==JSON.stringify(content)) fail('public content fallback is out of sync');
  else pass('public content fallback synced');
}catch(e){fail('public fallback JSON: '+e.message);}

if(content?.site?.companyName!=='Zahrat El-Rabea For Food Manufacturing') fail('official company name changed');
else pass('official company name preserved');
const langs=['ar','en','es','it'];
const configured=content?.site?.languages||[];
for(const lang of langs) if(!configured.includes(lang)) fail(`missing language: ${lang}`);
if(langs.every(x=>configured.includes(x))) pass('four languages configured');

// Validate icon pack, literal icon calls and content-driven icon names.
try{
  const sandbox={window:{}};
  vm.createContext(sandbox);
  vm.runInContext(read('public/assets/js/icons.js'),sandbox,{filename:'icons.js'});
  const has=sandbox.window.ZRIcon?.has;
  if(typeof has!=='function') throw new Error('ZRIcon.has unavailable');
  const used=new Set();
  for(const file of ['public/assets/js/site.js','admin/assets/admin.js']){
    const source=read(file);
    for(const m of source.matchAll(/icon\(\s*['"]([A-Za-z0-9_-]+)['"]/g)) used.add(m[1]);
  }
  (function walk(v){
    if(Array.isArray(v))return v.forEach(walk);
    if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(k==='icon'&&typeof x==='string')used.add(x);walk(x);}
  })(content);
  const missing=[...used].filter(x=>!has(x));
  if(missing.length) fail('unknown icons: '+missing.join(', '));
  else pass(`${used.size} icon names validated`);
}catch(e){fail('icon validation: '+e.message);}

// Validate local editorial assets.
const assetRefs=new Set();
(function walk(v){
  if(Array.isArray(v))return v.forEach(walk);
  if(v&&typeof v==='object')return Object.values(v).forEach(walk);
  if(typeof v==='string'&&v.startsWith('/assets/'))assetRefs.add(v);
})(content);
for(const ref of assetRefs){
  const file=path.join(ROOT,'public',ref.replace(/^\//,''));
  if(!fs.existsSync(file)) fail(`missing content asset: ${ref}`);
}
if(!errors.some(x=>x.startsWith('missing content asset')))pass(`${assetRefs.size} content assets resolved`);

for(const cssFile of ['public/assets/css/site.css','admin/assets/admin.css']){
  const css=read(cssFile).replace(/\/\*[\s\S]*?\*\//g,'');
  let depth=0,min=0;
  for(const ch of css){if(ch==='{')depth++;else if(ch==='}')depth--;min=Math.min(min,depth);}
  if(depth!==0||min<0)fail(`unbalanced CSS braces: ${cssFile}`);else pass(`CSS structure: ${cssFile}`);
}

const uiFiles=['public/index.html','public/assets/js/site.js','admin/index.html','admin/assets/admin.js'];
for(const file of uiFiles){
  const source=read(file);
  if(/127\.0\.0\.1|localhost|start\.bat|node server\.js/i.test(source))fail(`host-specific/startup text remains in UI: ${file}`);
}
if(!errors.some(x=>x.includes('remains in UI')))pass('UI is host-neutral and contains no startup tips');

const server=read('server.js');
if(!/process\.env\.HOST\s*\|\|\s*'0\.0\.0\.0'/.test(server))fail('server does not default to 0.0.0.0');
else pass('server binds to all interfaces by default');
if(!server.includes("'/eslammm'"))fail('admin route /eslammm not found');else pass('admin route /eslammm present');

for(const file of ['server.js','public/assets/js/icons.js','public/assets/js/site.js','admin/assets/admin.js']){
  const result=spawnSync(process.execPath,['--check',path.join(ROOT,file)],{encoding:'utf8'});
  if(result.status!==0)fail(`syntax: ${file}: ${result.stderr.trim()}`);else pass(`syntax: ${file}`);
}

if(errors.length){
  console.error('\nVALIDATION FAILED');
  errors.forEach(x=>console.error('FAIL',x));
  process.exit(1);
}
console.log('VALIDATION PASSED');
passes.forEach(x=>console.log('PASS',x));
