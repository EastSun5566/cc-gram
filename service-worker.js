if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let c=Promise.resolve();return r[e]||(c=new Promise(async c=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=c}else importScripts(e),c()})),c.then(()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]})},c=(c,r)=>{Promise.all(c.map(e)).then(e=>r(1===e.length?e[0]:e))},r={require:Promise.resolve(c)};self.define=(c,s,i)=>{r[c]||(r[c]=Promise.resolve().then(()=>{let r={};const t={uri:location.origin+c.slice(1)};return Promise.all(s.map(c=>{switch(c){case"exports":return r;case"module":return t;default:return e(c)}})).then(e=>{const c=i(...e);return r.default||(r.default=c),r})}))}}define("./service-worker.js",["./workbox-dce9cbc5"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.clientsClaim(),e.precacheAndRoute([{url:"/cc-gram/index.html",revision:"3ad9fb7ec5d346946ab8091a92c3125f"},{url:"/cc-gram/static/css/main.34a7607b.chunk.css",revision:"f0352cfcb832ec5c6f0d15d2db799f4f"},{url:"/cc-gram/static/js/2.f71e6a0f.chunk.js",revision:"df798539e31c696568e7fed4e395f4b3"},{url:"/cc-gram/static/js/2.f71e6a0f.chunk.js.LICENSE.txt",revision:"e88a3e95b5364d46e95b35ae8c0dc27d"},{url:"/cc-gram/static/js/main.72c5a4cd.chunk.js",revision:"528728d62f0a3622b17768b43564afc9"},{url:"/cc-gram/static/js/runtime-main.1e2cb8a3.js",revision:"d9a8ad178c8889fba3ce20e28130861b"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/cc-gram/index.html"),{denylist:[/^\/_/,/\/[^/?]+\.[^/]+$/]}))}));
//# sourceMappingURL=service-worker.js.map
