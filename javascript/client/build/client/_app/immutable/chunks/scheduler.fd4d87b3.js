function w(){}const M=t=>t;function E(t,n){for(const e in n)t[e]=n[e];return t}function S(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function j(t){return t()}function A(){return Object.create(null)}function q(t){t.forEach(j)}function B(t){return typeof t=="function"}function D(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let l;function G(t,n){return t===n?!0:(l||(l=document.createElement("a")),l.href=n,t===l.href)}function H(t){return Object.keys(t).length===0}function m(t,...n){if(t==null){for(const o of n)o(void 0);return w}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function I(t){let n;return m(t,e=>n=e)(),n}function J(t,n,e){t.$$.on_destroy.push(m(n,e))}function K(t,n,e,o){if(t){const r=x(t,n,e,o);return t[0](r)}}function x(t,n,e,o){return t[1]&&o?E(e.ctx.slice(),t[1](o(n))):e.ctx}function L(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const a=[],h=Math.max(n.dirty.length,r.length);for(let u=0;u<h;u+=1)a[u]=n.dirty[u]|r[u];return a}return n.dirty|r}return n.dirty}function P(t,n,e,o,r,a){if(r){const h=x(n,e,o,a);t.p(h,r)}}function U(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}function N(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}function Q(t,n){const e={};n=new Set(n);for(const o in t)!n.has(o)&&o[0]!=="$"&&(e[o]=t[o]);return e}function R(t){return t??""}function T(t){const n=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return n?[parseFloat(n[1]),n[2]||"px"]:[t,"px"]}let f;function d(t){f=t}function _(){if(!f)throw new Error("Function called outside component initialization");return f}function V(t){_().$$.on_mount.push(t)}function W(t){_().$$.after_update.push(t)}function X(t,n){return _().$$.context.set(t,n),n}function Y(t){return _().$$.context.get(t)}function Z(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(o=>o.call(this,n))}const i=[],y=[];let s=[];const b=[],k=Promise.resolve();let g=!1;function C(){g||(g=!0,k.then(O))}function v(){return C(),k}function F(t){s.push(t)}function $(t){b.push(t)}const p=new Set;let c=0;function O(){if(c!==0)return;const t=f;do{try{for(;c<i.length;){const n=i[c];c++,d(n),z(n.$$)}}catch(n){throw i.length=0,c=0,n}for(d(null),i.length=0,c=0;y.length;)y.pop()();for(let n=0;n<s.length;n+=1){const e=s[n];p.has(e)||(p.add(e),e())}s.length=0}while(i.length);for(;b.length;)b.pop()();g=!1,p.clear(),d(t)}function z(t){if(t.fragment!==null){t.update(),q(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(F)}}function tt(t){const n=[],e=[];s.forEach(o=>t.indexOf(o)===-1?n.push(o):e.push(o)),e.forEach(o=>o()),s=n}export{O as A,Y as B,I as C,X as D,$ as E,A as F,H as G,tt as H,f as I,j as J,i as K,C as L,L as a,J as b,K as c,F as d,E as e,Q as f,U as g,N as h,m as i,B as j,R as k,G as l,y as m,w as n,V as o,Z as p,M as q,q as r,D as s,T as t,P as u,W as v,v as w,S as x,_ as y,d as z};
