import{c as t}from"./singletons-d1fb5791.js";import{b as s}from"./cell-state-schema-a24ecc56.js";import{U as l}from"./vendor-92048905.js";t.disable_scroll_handling;const m=t.goto;t.invalidate;t.prefetch;const p=t.prefetch_routes;t.before_navigate;t.after_navigate;function g(e){return new WebSocket(`ws://${window.location.host}/cells/${e}`)}function c(e){return Boolean(e&&typeof e=="object"&&"type"in e)}function d(e){return e instanceof ArrayBuffer?e.byteLength===0:e instanceof Blob?e.size===0:!1}function w(e){let n=s;return l(s,r=>{const i=new AbortController;function f({data:o}){if(typeof o=="string"){const a=JSON.parse(o);if(c(a)){n=a;return}}d(o)||(n.payload=o),r(n)}return e==null||e.addEventListener("message",f,i),()=>i.abort()})}function v(e,n){if(e){const r=()=>{const i={width:window.innerWidth,height:window.innerHeight};e.send(JSON.stringify(i))};switch(document.addEventListener("resize",r,n),e.addEventListener("close",()=>{document.removeEventListener("resize",r)}),e.readyState){case 0:e.addEventListener("open",r,n);break;case 1:r();break}}}function y(e,n){return`/cell/frame/${e.toLowerCase()}?id=${n}`}export{w as a,g as c,y as f,m as g,p,v as s};
