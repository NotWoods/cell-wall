import{S as b,i as y,s as g,e as c,t as v,c as m,a as p,h as C,d as l,b as u,f as d,g as k,J as f,j as x,K as h,L as E}from"../../../chunks/vendor-98a08ead.js";import"../../../chunks/cell-state-schema-a24ecc56.js";import{f as T}from"../../../chunks/index-31161e5d.js";import{getFrameContext as w}from"./__layout.svelte-dcfa5791.js";import"../../../chunks/navigation-0e6511d1.js";import"../../../chunks/singletons-d1fb5791.js";function A(r){let e,a,t;return{c(){e=c("main"),a=c("h1"),t=v(r[1]),this.h()},l(s){e=m(s,"MAIN",{style:!0,class:!0});var o=p(e);a=m(o,"H1",{class:!0});var n=p(a);t=C(n,r[1]),n.forEach(l),o.forEach(l),this.h()},h(){u(a,"class","headline-1 svelte-1xuwf3b"),d(e,"background",r[0]),u(e,"class","svelte-1xuwf3b")},m(s,o){k(s,e,o),f(e,a),f(a,t)},p(s,[o]){o&2&&x(t,s[1]),o&1&&d(e,"background",s[0])},i:h,o:h,d(s){s&&l(e)}}}function j(r,e,a){let t,s,o,n;const{state:i}=w();return E(r,i,_=>a(4,n=_)),r.$$.update=()=>{r.$$.dirty&16&&a(3,t=T("TEXT",n)),r.$$.dirty&8&&a(1,s=(t==null?void 0:t.payload)||"CellWall"),r.$$.dirty&8&&a(0,o=(t==null?void 0:t.backgroundColor)||"#429A46")},[o,s,i,t,n]}class L extends b{constructor(e){super();y(this,e,j,A,g,{})}}export{L as default};