import{S as v,i as w,s as I,F as N,e as g,w as C,k as F,c as k,a as L,x as V,m as q,d as u,b as r,g as d,y,J as E,G as P,H as T,I as U,q as h,o as b,B as j,t as A,h as B,j as D}from"./vendor-92048905.js";import{L as G}from"./Label-cb141bcc.js";const H=l=>({}),p=l=>({inputClassName:S});function J(l){let e;return{c(){e=A(l[2])},l(t){e=B(t,l[2])},m(t,o){d(t,e,o)},p(t,o){o&4&&D(e,t[2])},d(t){t&&u(e)}}}function z(l){let e;return{c(){e=g("input"),this.h()},l(t){e=k(t,"INPUT",{type:!0,id:!0,class:!0}),this.h()},h(){r(e,"type","text"),r(e,"id",l[1]),r(e,"class",S)},m(t,o){d(t,e,o)},p(t,o){o&2&&r(e,"id",t[1])},d(t){t&&u(e)}}}function K(l){let e,t,o,f,i;t=new G({props:{class:"mb-1",for:l[1],$$slots:{default:[J]},$$scope:{ctx:l}}});const _=l[3].default,c=N(_,l,l[4],p),s=c||z(l);return{c(){e=g("div"),C(t.$$.fragment),o=F(),s&&s.c(),this.h()},l(a){e=k(a,"DIV",{class:!0});var n=L(e);V(t.$$.fragment,n),o=q(n),s&&s.l(n),n.forEach(u),this.h()},h(){r(e,"class",f="text-black "+l[0])},m(a,n){d(a,e,n),y(t,e,null),E(e,o),s&&s.m(e,null),i=!0},p(a,[n]){const m={};n&2&&(m.for=a[1]),n&20&&(m.$$scope={dirty:n,ctx:a}),t.$set(m),c?c.p&&(!i||n&16)&&P(c,_,a,a[4],i?U(_,a[4],n,H):T(a[4]),p):s&&s.p&&(!i||n&2)&&s.p(a,i?n:-1),(!i||n&1&&f!==(f="text-black "+a[0]))&&r(e,"class",f)},i(a){i||(h(t.$$.fragment,a),h(s,a),i=!0)},o(a){b(t.$$.fragment,a),b(s,a),i=!1},d(a){a&&u(e),j(t),s&&s.d(a)}}}const S="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md";function M(l,e,t){let{$$slots:o={},$$scope:f}=e,{class:i=""}=e,{for:_=void 0}=e,{label:c}=e;return l.$$set=s=>{"class"in s&&t(0,i=s.class),"for"in s&&t(1,_=s.for),"label"in s&&t(2,c=s.label),"$$scope"in s&&t(4,f=s.$$scope)},[i,_,c,o,f]}class R extends v{constructor(e){super();w(this,e,M,K,I,{class:0,for:1,label:2})}}export{R as V};
