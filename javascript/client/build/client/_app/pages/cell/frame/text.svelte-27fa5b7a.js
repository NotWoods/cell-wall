import{S as C,i as k,s as v,e as c,t as x,c as p,a as u,h as E,d as i,b as d,f as _,g as S,M as f,j as I,E as m,F as O}from"../../../chunks/index-6bece970.js";import{f as R}from"../../../chunks/filter-state-ca8b8a84.js";import"../../../chunks/web-75f832b0.js";import{R as T}from"../../../chunks/color-8cc37c09.js";import{r as A}from"../../../chunks/random-ca7fbb84.js";import{getFrameContext as F}from"./__layout.svelte-278ede7d.js";import"../../../chunks/index-2a0b6ee6.js";import"../../../chunks/state-socket-92adeb5a.js";import"../../../chunks/singletons-d1fb5791.js";import"../../../chunks/index-82b3cc87.js";function M(o){let t,e,n;return{c(){t=c("main"),e=c("h1"),n=x(o[1]),this.h()},l(a){t=p(a,"MAIN",{class:!0,style:!0});var r=u(t);e=p(r,"H1",{class:!0});var s=u(e);n=E(s,o[1]),s.forEach(i),r.forEach(i),this.h()},h(){d(e,"class","headline-1 svelte-cak7yr"),d(t,"class","fill center svelte-cak7yr"),_(t,"background",o[0])},m(a,r){S(a,t,r),f(t,e),f(e,n)},p(a,[r]){r&2&&I(n,a[1]),r&1&&_(t,"background",a[0])},i:m,o:m,d(a){a&&i(t)}}}function N(o,t,e){let n,a,r,s,l=m,h=()=>(l(),l=O(n,g=>e(3,s=g)),n);o.$$.on_destroy.push(()=>l());const b=A(T),{state:y}=F();return o.$$.update=()=>{o.$$.dirty&8&&e(1,a=(s==null?void 0:s.payload)||"CellWall"),o.$$.dirty&8&&e(0,r=(s==null?void 0:s.backgroundColor)||b)},h(e(2,n=R("TEXT",y))),[r,a,n,s]}class G extends C{constructor(t){super(),k(this,t,N,M,v,{})}}export{G as default};
