import{S as _,i as h,s as b,e as y,c as d,a as g,d as f,b as c,Z as m,g as q,K as u,L as C,a2 as E}from"../../../chunks/vendor-e399076d.js";import{f as k}from"../../../chunks/index-36b7e429.js";import"../../../chunks/cell-state-schema-b294815b.js";import{getFrameContext as F}from"./__layout.svelte-e6670114.js";import"../../../chunks/navigation-0e6511d1.js";import"../../../chunks/singletons-d1fb5791.js";function S(s){let t,r;return{c(){t=y("iframe"),this.h()},l(e){t=d(e,"IFRAME",{class:!0,src:!0,title:!0}),g(t).forEach(f),this.h()},h(){c(t,"class","fill svelte-znqehi"),m(t.src,r=s[1])||c(t,"src",r),c(t,"title","Cell content")},m(e,o){q(e,t,o),s[5](t)},p(e,[o]){o&2&&!m(t.src,r=e[1])&&c(t,"src",r)},i:u,o:u,d(e){e&&f(t),s[5](null)}}}function W(s,t,r){let e,o,a;const{state:l}=F();C(s,l,n=>r(4,a=n));let i;function p(n){E[n?"unshift":"push"](()=>{i=n,r(0,i),r(4,a),r(1,o),r(3,e)})}return s.$$.update=()=>{s.$$.dirty&16&&r(3,e=k("WEB",a)),s.$$.dirty&24&&console.log(a,a.type,e),s.$$.dirty&8&&r(1,o=(e==null?void 0:e.payload)||"about:blank"),s.$$.dirty&19&&i&&(console.log("web state",a,o),r(0,i.src=o,i))},[i,o,l,e,a,p]}class K extends _{constructor(t){super();h(this,t,W,S,b,{})}}export{K as default};
