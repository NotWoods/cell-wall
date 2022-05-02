import{S as N,i as q,s as F,w as g,x as _,y as w,q as h,o as v,B as P,e as j,t as S,k as O,c as k,a as C,h as L,d as u,m as E,b as D,g as m,M as G}from"./index-6bece970.js";import{F as M,S as V}from"./Form-1a153f1b.js";import{p as z}from"./_form-52443b97.js";function A(s){let n;return{c(){n=S("Launch")},l(a){n=L(a,"Launch")},m(a,t){m(a,n,t)},d(a){a&&u(n)}}}function H(s){let n;return{c(){n=S("Off")},l(a){n=L(a,"Off")},m(a,t){m(a,n,t)},d(a){a&&u(n)}}}function I(s){let n;return{c(){n=S("On")},l(a){n=L(a,"On")},m(a,t){m(a,n,t)},d(a){a&&u(n)}}}function J(s){let n,a,t,i,f,l,$,r,b;return i=new V({props:{loading:s[3].submitterName?s[1]:s[3].loading,colors:B,disabled:s[0]===void 0,class:"rounded-r-none",formaction:"/api/action/launch/"+s[0],"aria-label":"Launch client app",$$slots:{default:[A]},$$scope:{ctx:s}}}),l=new V({props:{loading:s[3].submitterValue==="false"?s[3].loading:s[1],colors:B,name:"on",value:"false",disabled:s[0]===void 0,class:"rounded-r-none rounded-l-none border-l border-r border-slate-500",formaction:"/api/device/power/"+s[0],"aria-label":"Power off",$$slots:{default:[H]},$$scope:{ctx:s}}}),r=new V({props:{loading:s[3].submitterValue==="true"?s[3].loading:s[1],colors:B,name:"on",value:"true",disabled:s[0]===void 0,class:"rounded-l-none",formaction:"/api/device/power/"+s[0],"aria-label":"Power on",$$slots:{default:[I]},$$scope:{ctx:s}}}),{c(){n=j("legend"),a=S("Power"),t=O(),g(i.$$.fragment),f=O(),g(l.$$.fragment),$=O(),g(r.$$.fragment),this.h()},l(e){n=k(e,"LEGEND",{class:!0});var o=C(n);a=L(o,"Power"),o.forEach(u),t=E(e),_(i.$$.fragment,e),f=E(e),_(l.$$.fragment,e),$=E(e),_(r.$$.fragment,e),this.h()},h(){D(n,"class","sr-only")},m(e,o){m(e,n,o),G(n,a),m(e,t,o),w(i,e,o),m(e,f,o),w(l,e,o),m(e,$,o),w(r,e,o),b=!0},p(e,o){const d={};o&8&&(d.loading=e[3].submitterName?e[1]:e[3].loading),o&1&&(d.disabled=e[0]===void 0),o&1&&(d.formaction="/api/action/launch/"+e[0]),o&16&&(d.$$scope={dirty:o,ctx:e}),i.$set(d);const p={};o&8&&(p.loading=e[3].submitterValue==="false"?e[3].loading:e[1]),o&1&&(p.disabled=e[0]===void 0),o&1&&(p.formaction="/api/device/power/"+e[0]),o&16&&(p.$$scope={dirty:o,ctx:e}),l.$set(p);const c={};o&8&&(c.loading=e[3].submitterValue==="true"?e[3].loading:e[1]),o&1&&(c.disabled=e[0]===void 0),o&1&&(c.formaction="/api/device/power/"+e[0]),o&16&&(c.$$scope={dirty:o,ctx:e}),r.$set(c)},i(e){b||(h(i.$$.fragment,e),h(l.$$.fragment,e),h(r.$$.fragment,e),b=!0)},o(e){v(i.$$.fragment,e),v(l.$$.fragment,e),v(r.$$.fragment,e),b=!1},d(e){e&&u(n),e&&u(t),P(i,e),e&&u(f),P(l,e),e&&u($),P(r,e)}}}function K(s){let n,a;return n=new M({props:{class:"flex",method:"post",action:"",onSubmit:s[2],$$slots:{default:[J,({status:t})=>({3:t}),({status:t})=>t?8:0]},$$scope:{ctx:s}}}),{c(){g(n.$$.fragment)},l(t){_(n.$$.fragment,t)},m(t,i){w(n,t,i),a=!0},p(t,[i]){const f={};i&25&&(f.$$scope={dirty:i,ctx:t}),n.$set(f)},i(t){a||(h(n.$$.fragment,t),a=!0)},o(t){v(n.$$.fragment,t),a=!1},d(t){P(n,t)}}}const B={pending:"bg-slate-700",success:"bg-slate-700 hover:bg-slate-800"};function Q(s,n,a){const t=Promise.resolve();let{serial:i}=n;async function f(l,$){const r=Object.fromEntries(l);await z($.toString(),r)}return s.$$set=l=>{"serial"in l&&a(0,i=l.serial)},[i,t,f]}class W extends N{constructor(n){super(),q(this,n,Q,K,F,{serial:0})}}export{W as P};