import{S as v,i as w,s as k,e as m,c as _,a as I,d as f,b as c,g as b,G as T,H as E,I as q,q as p,Q as M,ag as z,o as d,l as g,n as C,K as D,p as K,F as A,ah as L,ai as N,k as P,w as S,X as B,m as F,x as G,J as h,y as H,B as J,L as O}from"../../chunks/vendor-92048905.js";import{p as Q}from"../../chunks/stores-666d7af9.js";function y(o){let s,l,a;const e=o[2].default,t=A(e,o,o[1],null);return{c(){s=m("div"),t&&t.c(),this.h()},l(n){s=_(n,"DIV",{class:!0});var i=I(s);t&&t.l(i),i.forEach(f),this.h()},h(){c(s,"class","layout svelte-1kgdfam")},m(n,i){b(n,s,i),t&&t.m(s,null),a=!0},p(n,i){o=n,t&&t.p&&(!a||i&2)&&T(t,e,o,o[1],a?q(e,o[1],i,null):E(o[1]),null)},i(n){a||(p(t,n),l||M(()=>{l=z(s,N,{duration:W,easing:L}),l.start()}),a=!0)},o(n){d(t,n),a=!1},d(n){n&&f(s),t&&t.d(n)}}}function V(o){let s=o[0],l,a,e=y(o);return{c(){e.c(),l=g()},l(t){e.l(t),l=g()},m(t,n){e.m(t,n),b(t,l,n),a=!0},p(t,[n]){n&1&&k(s,s=t[0])?(C(),d(e,1,1,D),K(),e=y(t),e.c(),p(e),e.m(l.parentNode,l)):e.p(t,n)},i(t){a||(p(e),a=!0)},o(t){d(e),a=!1},d(t){t&&f(l),e.d(t)}}}const W=300;function X(o,s,l){let{$$slots:a={},$$scope:e}=s,{key:t=""}=s;return o.$$set=n=>{"key"in n&&l(0,t=n.key),"$$scope"in n&&l(1,e=n.$$scope)},[t,e,a]}class j extends v{constructor(s){super();w(this,s,X,V,k,{key:0})}}function R(o){let s;const l=o[1].default,a=A(l,o,o[2],null);return{c(){a&&a.c()},l(e){a&&a.l(e)},m(e,t){a&&a.m(e,t),s=!0},p(e,t){a&&a.p&&(!s||t&4)&&T(a,l,e,e[2],s?q(l,e[2],t,null):E(e[2]),null)},i(e){s||(p(a,e),s=!0)},o(e){d(a,e),s=!1},d(e){a&&a.d(e)}}}function U(o){let s,l,a,e,t,n,i;return n=new j({props:{key:o[0].url.pathname,$$slots:{default:[R]},$$scope:{ctx:o}}}),{c(){s=m("meta"),l=m("meta"),a=m("meta"),e=m("link"),t=P(),S(n.$$.fragment),this.h()},l(r){const u=B('[data-svelte="svelte-s5oyw9"]',document.head);s=_(u,"META",{name:!0,content:!0}),l=_(u,"META",{name:!0,content:!0}),a=_(u,"META",{name:!0,content:!0}),e=_(u,"LINK",{rel:!0,sizes:!0,href:!0}),u.forEach(f),t=F(r),G(n.$$.fragment,r),this.h()},h(){c(s,"name","apple-mobile-web-app-capable"),c(s,"content","yes"),c(l,"name","apple-mobile-web-app-status-bar-style"),c(l,"content","black-translucent"),c(a,"name","apple-mobile-web-app-title"),c(a,"content","CellWall"),c(e,"rel","apple-touch-icon"),c(e,"sizes","274x274"),c(e,"href","/maskable_icon.png")},m(r,u){h(document.head,s),h(document.head,l),h(document.head,a),h(document.head,e),b(r,t,u),H(n,r,u),i=!0},p(r,[u]){const $={};u&1&&($.key=r[0].url.pathname),u&4&&($.$$scope={dirty:u,ctx:r}),n.$set($)},i(r){i||(p(n.$$.fragment,r),i=!0)},o(r){d(n.$$.fragment,r),i=!1},d(r){f(s),f(l),f(a),f(e),r&&f(t),J(n,r)}}}function Y(o,s,l){let a;O(o,Q,n=>l(0,a=n));let{$$slots:e={},$$scope:t}=s;return o.$$set=n=>{"$$scope"in n&&l(2,t=n.$$scope)},[a,e,t]}class ee extends v{constructor(s){super();w(this,s,Y,U,k,{})}}export{ee as default};
