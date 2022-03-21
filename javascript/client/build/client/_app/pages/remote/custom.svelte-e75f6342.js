var he=Object.defineProperty,de=Object.defineProperties;var $e=Object.getOwnPropertyDescriptors;var J=Object.getOwnPropertySymbols;var ge=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable;var Q=(o,e,t)=>e in o?he(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,V=(o,e)=>{for(var t in e||(e={}))ge.call(e,t)&&Q(o,t,e[t]);if(J)for(var t of J(e))be.call(e,t)&&Q(o,t,e[t]);return o},X=(o,e)=>de(o,$e(e));import{S as F,i as I,s as N,F as ae,e as y,c as T,a as C,d as m,b as _,g,G as ie,H as ue,I as fe,q as h,o as $,l as S,w as b,x as v,y as k,B as w,n as z,a6 as ce,a8 as _e,p as B,a9 as P,k as O,m as D,t as U,h as j,J as R,j as pe,aa as ve,Y as E,O as me,a5 as ke,L as Y,ab as we,K as ye,ac as Te,a2 as Ee,ad as Ce,Q as Se,ae as Z}from"../../chunks/vendor-92048905.js";import{R as Ae,D as Ne}from"../../chunks/DeviceOptions-75d7ee13.js";import{H}from"../../chunks/HorizontalField-6331c5bf.js";import{F as Oe}from"../../chunks/SubmitButton-e9d712ee.js";import{a as De,s as Fe}from"../../chunks/__layout-d4660940.js";import{g as W,a as M}from"../../chunks/cell-state-schema-a24ecc56.js";import{P as Ie}from"../../chunks/_PowerButtons-29f42cf5.js";import{p as Le}from"../../chunks/_form-52443b97.js";import"../../chunks/LoadingSpinner-d8b77dcc.js";import"../../chunks/snackbar-host-0696384f.js";import"../../chunks/stores-666d7af9.js";import"../../chunks/TopBar-adf9860c.js";const qe=["#0F172A","#7F1D1D","#7C2D12","#78350F","#713F12","#365314","#14532D","#064E3B","#134E4A","#164E63","#0C4A6E","#1E3A8A","#312E81","#4C1D95","#581C87","#701A75","#831843","#881337"];class ze{constructor(e=qe){if(this.colors=e,e.length===0)throw new TypeError("No colors provided");this.reset()}reset(){this.unusedColors=this.colors.slice()}next(){if(this.unusedColors.length<=1){const s=this.unusedColors[0];return this.reset(),s}const e=Math.floor(Math.random()*this.unusedColors.length),t=this.unusedColors[e];return this.unusedColors.splice(e,1),t}}function Be(o){let e,t;const s=o[1].default,i=ae(s,o,o[0],null);return{c(){e=y("ul"),i&&i.c(),this.h()},l(n){e=T(n,"UL",{class:!0,role:!0});var a=C(e);i&&i.l(a),a.forEach(m),this.h()},h(){_(e,"class","flex flex-wrap border-b-2 border-slate-700"),_(e,"role","tablist")},m(n,a){g(n,e,a),i&&i.m(e,null),t=!0},p(n,[a]){i&&i.p&&(!t||a&1)&&ie(i,s,n,n[0],t?fe(s,n[0],a,null):ue(n[0]),null)},i(n){t||(h(i,n),t=!0)},o(n){$(i,n),t=!1},d(n){n&&m(e),i&&i.d(n)}}}function Re(o,e,t){let{$$slots:s={},$$scope:i}=e;return o.$$set=n=>{"$$scope"in n&&t(0,i=n.$$scope)},[i,s]}class Pe extends F{constructor(e){super();I(this,e,Re,Be,N,{})}}function x(o,e,t){const s=o.slice();return s[6]=e[t].name,s[7]=e[t].type,s[8]=e[t].property,s[9]=e[t].fallback,s}function ee(o,e,t){const s=o.slice();return s[13]=e[t],s}function Me(o){let e,t,s,i,n,a,l;return{c(){e=y("input"),this.h()},l(r){e=T(r,"INPUT",{id:!0,class:!0,name:!0,type:!0}),this.h()},h(){var r,u;_(e,"id",t="control-"+o[6]),_(e,"class",s=o[7]==="color"?"":o[12]),_(e,"name",i=o[6]),_(e,"type",n=o[7]),e.required=a=o[2].has(o[6]),e.value=l=(u=(r=o[0])==null?void 0:r[o[6]])!=null?u:o[9]},m(r,u){g(r,e,u)},p(r,u){var c,d;u&2&&t!==(t="control-"+r[6])&&_(e,"id",t),u&4098&&s!==(s=r[7]==="color"?"":r[12])&&_(e,"class",s),u&2&&i!==(i=r[6])&&_(e,"name",i),u&2&&n!==(n=r[7])&&_(e,"type",n),u&6&&a!==(a=r[2].has(r[6]))&&(e.required=a),u&3&&l!==(l=(d=(c=r[0])==null?void 0:c[r[6]])!=null?d:r[9])&&e.value!==l&&(e.value=l)},d(r){r&&m(e)}}}function Ue(o){let e,t,s,i,n=o[8].enum,a=[];for(let l=0;l<n.length;l+=1)a[l]=te(ee(o,n,l));return{c(){e=y("select");for(let l=0;l<a.length;l+=1)a[l].c();this.h()},l(l){e=T(l,"SELECT",{id:!0,name:!0,class:!0});var r=C(e);for(let u=0;u<a.length;u+=1)a[u].l(r);r.forEach(m),this.h()},h(){_(e,"id",t="control-"+o[6]),_(e,"name",s=o[6]),_(e,"class",i=o[12])},m(l,r){g(l,e,r);for(let u=0;u<a.length;u+=1)a[u].m(e,null)},p(l,r){if(r&2){n=l[8].enum;let u;for(u=0;u<n.length;u+=1){const c=ee(l,n,u);a[u]?a[u].p(c,r):(a[u]=te(c),a[u].c(),a[u].m(e,null))}for(;u<a.length;u+=1)a[u].d(1);a.length=n.length}r&2&&t!==(t="control-"+l[6])&&_(e,"id",t),r&2&&s!==(s=l[6])&&_(e,"name",s),r&4096&&i!==(i=l[12])&&_(e,"class",i)},d(l){l&&m(e),ve(a,l)}}}function te(o){let e,t=o[13]+"",s,i;return{c(){e=y("option"),s=U(t),this.h()},l(n){e=T(n,"OPTION",{});var a=C(e);s=j(a,t),a.forEach(m),this.h()},h(){e.__value=i=o[13],e.value=e.__value},m(n,a){g(n,e,a),R(e,s)},p(n,a){a&2&&t!==(t=n[13]+"")&&pe(s,t),a&2&&i!==(i=n[13])&&(e.__value=i,e.value=e.__value)},d(n){n&&m(e)}}}function je(o){let e,t;function s(a,l){return l&2&&(e=null),e==null&&(e=!!Array.isArray(a[8].enum)),e?Ue:Me}let i=s(o,-1),n=i(o);return{c(){n.c(),t=O()},l(a){n.l(a),t=D(a)},m(a,l){n.m(a,l),g(a,t,l)},p(a,l){i===(i=s(a,l))&&n?n.p(a,l):(n.d(1),n=i(a),n&&(n.c(),n.m(t.parentNode,t)))},d(a){n.d(a),a&&m(t)}}}function le(o,e){let t,s,i;return s=new H({props:{for:"control-"+e[6],label:e[3](e[6]),$$slots:{default:[je,({inputClassName:n})=>({12:n}),({inputClassName:n})=>n?4096:0]},$$scope:{ctx:e}}}),{key:o,first:null,c(){t=S(),b(s.$$.fragment),this.h()},l(n){t=S(),v(s.$$.fragment,n),this.h()},h(){this.first=t},m(n,a){g(n,t,a),k(s,n,a),i=!0},p(n,a){e=n;const l={};a&2&&(l.for="control-"+e[6]),a&10&&(l.label=e[3](e[6])),a&69639&&(l.$$scope={dirty:a,ctx:e}),s.$set(l)},i(n){i||(h(s.$$.fragment,n),i=!0)},o(n){$(s.$$.fragment,n),i=!1},d(n){n&&m(t),w(s,n)}}}function He(o){let e=[],t=new Map,s,i,n=o[1];const a=l=>l[6];for(let l=0;l<n.length;l+=1){let r=x(o,n,l),u=a(r);t.set(u,e[l]=le(u,r))}return{c(){for(let l=0;l<e.length;l+=1)e[l].c();s=S()},l(l){for(let r=0;r<e.length;r+=1)e[r].l(l);s=S()},m(l,r){for(let u=0;u<e.length;u+=1)e[u].m(l,r);g(l,s,r),i=!0},p(l,[r]){r&4111&&(n=l[1],z(),e=ce(e,r,a,1,l,n,t,s.parentNode,_e,le,s,x),B())},i(l){if(!i){for(let r=0;r<n.length;r+=1)h(e[r]);i=!0}},o(l){for(let r=0;r<e.length;r+=1)$(e[r]);i=!1},d(l){for(let r=0;r<e.length;r+=1)e[r].d(l);l&&m(s)}}}function We(o,e){if(Array.isArray(e.enum))return"select";if(o.endsWith("Color"))return"color";if(e.format==="uri")return"url";switch(e.type){case"number":return"number";default:return"text"}}function Ge(o,e,t){let s,i,n;const a=new ze;let{schema:l}=e,{state:r=void 0}=e;return o.$$set=u=>{"schema"in u&&t(4,l=u.schema),"state"in u&&t(0,r=u.state)},o.$$.update=()=>{o.$$.dirty&16&&t(3,s=u=>{var c,d,A;if(u==="payload")switch((A=(d=(c=l==null?void 0:l.properties)==null?void 0:c.type)==null?void 0:d.enum)==null?void 0:A[0]){case"WEB":return"URL";case"IMAGE":return"Source";case"TEXT":return"Text";default:return P(u)}return P(u)}),o.$$.dirty&16&&t(2,i=new Set((l==null?void 0:l.required)||[])),o.$$.dirty&16&&t(1,n=Object.entries((l==null?void 0:l.properties)||{}).filter(([u])=>u!=="type").map(([u,c])=>{const d=We(u,c);return{name:u,property:c,type:d,fallback:d==="color"?a.next():""}}))},[r,n,i,s,l]}class Ke extends F{constructor(e){super();I(this,e,Ge,He,N,{schema:4,state:0})}}function Je(o){let e,t,s,i,n;const a=o[3].default,l=ae(a,o,o[2],null);return{c(){e=y("li"),t=y("button"),l&&l.c(),this.h()},l(r){e=T(r,"LI",{class:!0});var u=C(e);t=T(u,"BUTTON",{type:!0,class:!0,role:!0,"aria-selected":!0,"aria-controls":!0});var c=C(t);l&&l.l(c),c.forEach(m),u.forEach(m),this.h()},h(){_(t,"type","button"),_(t,"class","border-b-2 -mb-[2px] px-4 py-2 transition-colors"),_(t,"role","tab"),_(t,"aria-selected",o[0]),_(t,"aria-controls",o[1]),E(t,"text-green-400",o[0]),E(t,"border-current",o[0]),E(t,"border-transparent",!o[0]),E(t,"hover:border-white",!o[0]),_(e,"class","inline-block")},m(r,u){g(r,e,u),R(e,t),l&&l.m(t,null),s=!0,i||(n=me(t,"click",o[4]),i=!0)},p(r,[u]){l&&l.p&&(!s||u&4)&&ie(l,a,r,r[2],s?fe(a,r[2],u,null):ue(r[2]),null),(!s||u&1)&&_(t,"aria-selected",r[0]),(!s||u&2)&&_(t,"aria-controls",r[1]),u&1&&E(t,"text-green-400",r[0]),u&1&&E(t,"border-current",r[0]),u&1&&E(t,"border-transparent",!r[0]),u&1&&E(t,"hover:border-white",!r[0])},i(r){s||(h(l,r),s=!0)},o(r){$(l,r),s=!1},d(r){r&&m(e),l&&l.d(r),i=!1,n()}}}function Qe(o,e,t){let{$$slots:s={},$$scope:i}=e,{selected:n=!1}=e,{controls:a}=e;function l(r){ke.call(this,o,r)}return o.$$set=r=>{"selected"in r&&t(0,n=r.selected),"controls"in r&&t(1,a=r.controls),"$$scope"in r&&t(2,i=r.$$scope)},[n,a,i,s,l]}class Ve extends F{constructor(e){super();I(this,e,Qe,Je,N,{selected:0,controls:1})}}function Xe(o){let e;return{c(){e=U(o[2])},l(t){e=j(t,o[2])},m(t,s){g(t,e,s)},p(t,s){s&4&&pe(e,t[2])},d(t){t&&m(e)}}}function Ye(o){let e,t;return e=new Ve({props:{selected:o[1]===o[0],controls:"custom-form",$$slots:{default:[Xe]},$$scope:{ctx:o}}}),e.$on("click",o[4]),{c(){b(e.$$.fragment)},l(s){v(e.$$.fragment,s)},m(s,i){k(e,s,i),t=!0},p(s,[i]){const n={};i&3&&(n.selected=s[1]===s[0]),i&36&&(n.$$scope={dirty:i,ctx:s}),e.$set(n)},i(s){t||(h(e.$$.fragment,s),t=!0)},o(s){$(e.$$.fragment,s),t=!1},d(s){w(e,s)}}}function Ze(o,e,t){let s,i,{selectedType:n}=e,{schema:a}=e;const l=()=>{t(0,n=s)};return o.$$set=r=>{"selectedType"in r&&t(0,n=r.selectedType),"schema"in r&&t(3,a=r.schema)},o.$$.update=()=>{o.$$.dirty&8&&t(1,s=W(a)),o.$$.dirty&2&&t(2,i=P(s.toLocaleLowerCase()))},[n,s,i,a,l]}class xe extends F{constructor(e){super();I(this,e,Ze,Ye,N,{selectedType:0,schema:3})}}function se(o,e,t){const s=o.slice();return s[13]=e[t],s}function re(o,e){let t,s,i,n;function a(r){e[9](r)}let l={schema:e[13]};return e[0]!==void 0&&(l.selectedType=e[0]),s=new xe({props:l}),Ee.push(()=>Ce(s,"selectedType",a)),{key:o,first:null,c(){t=S(),b(s.$$.fragment),this.h()},l(r){t=S(),v(s.$$.fragment,r),this.h()},h(){this.first=t},m(r,u){g(r,t,u),k(s,r,u),n=!0},p(r,u){e=r;const c={};!i&&u&1&&(i=!0,c.selectedType=e[0],we(()=>i=!1)),s.$set(c)},i(r){n||(h(s.$$.fragment,r),n=!0)},o(r){$(s.$$.fragment,r),n=!1},d(r){r&&m(t),w(s,r)}}}function et(o){let e=[],t=new Map,s,i,n=M;const a=l=>W(l[13]);for(let l=0;l<n.length;l+=1){let r=se(o,n,l),u=a(r);t.set(u,e[l]=re(u,r))}return{c(){for(let l=0;l<e.length;l+=1)e[l].c();s=S()},l(l){for(let r=0;r<e.length;r+=1)e[r].l(l);s=S()},m(l,r){for(let u=0;u<e.length;u+=1)e[u].m(l,r);g(l,s,r),i=!0},p(l,r){r&1&&(n=M,z(),e=ce(e,r,a,1,l,n,t,s.parentNode,_e,re,s,se),B())},i(l){if(!i){for(let r=0;r<n.length;r+=1)h(e[r]);i=!0}},o(l){for(let r=0;r<e.length;r+=1)$(e[r]);i=!1},d(l){for(let r=0;r<e.length;r+=1)e[r].d(l);l&&m(s)}}}function tt(o){let e,t,s,i,n,a,l,r;return i=new Ne({props:{devices:o[4]}}),{c(){e=y("select"),t=y("option"),s=U("All devices"),b(i.$$.fragment),this.h()},l(u){e=T(u,"SELECT",{class:!0,id:!0});var c=C(e);t=T(c,"OPTION",{});var d=C(t);s=j(d,"All devices"),d.forEach(m),v(i.$$.fragment,c),c.forEach(m),this.h()},h(){t.__value="",t.value=t.__value,_(e,"class",n=o[12]+" cursor-pointer"),_(e,"id","control-serial"),o[1]===void 0&&Se(()=>o[10].call(e))},m(u,c){g(u,e,c),R(e,t),R(t,s),k(i,e,null),Z(e,o[1]),a=!0,l||(r=me(e,"change",o[10]),l=!0)},p(u,c){const d={};c&16&&(d.devices=u[4]),i.$set(d),(!a||c&4096&&n!==(n=u[12]+" cursor-pointer"))&&_(e,"class",n),c&2&&Z(e,u[1])},i(u){a||(h(i.$$.fragment,u),a=!0)},o(u){$(i.$$.fragment,u),a=!1},d(u){u&&m(e),w(i),l=!1,r()}}}function ne(o){let e,t;return e=new H({props:{label:"Power",$$slots:{default:[lt]},$$scope:{ctx:o}}}),{c(){b(e.$$.fragment)},l(s){v(e.$$.fragment,s)},m(s,i){k(e,s,i),t=!0},p(s,i){const n={};i&65538&&(n.$$scope={dirty:i,ctx:s}),e.$set(n)},i(s){t||(h(e.$$.fragment,s),t=!0)},o(s){$(e.$$.fragment,s),t=!1},d(s){w(e,s)}}}function lt(o){let e,t;return e=new Ie({props:{serial:o[1]}}),{c(){b(e.$$.fragment)},l(s){v(e.$$.fragment,s)},m(s,i){k(e,s,i),t=!0},p(s,i){const n={};i&2&&(n.serial=s[1]),e.$set(n)},i(s){t||(h(e.$$.fragment,s),t=!0)},o(s){$(e.$$.fragment,s),t=!1},d(s){w(e,s)}}}function oe(o){var s;let e,t;return e=new Ke({props:{schema:o[2],state:(s=o[3])==null?void 0:s.state}}),{c(){b(e.$$.fragment)},l(i){v(e.$$.fragment,i)},m(i,n){k(e,i,n),t=!0},p(i,n){var l;const a={};n&4&&(a.schema=i[2]),n&8&&(a.state=(l=i[3])==null?void 0:l.state),e.$set(a)},i(i){t||(h(e.$$.fragment,i),t=!0)},o(i){$(e.$$.fragment,i),t=!1},d(i){w(e,i)}}}function st(o){var d,A;let e,t,s=!o[3]||((A=(d=o[3])==null?void 0:d.connection)==null?void 0:A.includes("android")),i,n=o[0],a,l,r;e=new H({props:{for:"control-serial",label:"Device",$$slots:{default:[tt,({inputClassName:f})=>({12:f}),({inputClassName:f})=>f?4096:0]},$$scope:{ctx:o}}});let u=s&&ne(o),c=oe(o);return l=new Ae({props:{loading:o[11]}}),{c(){b(e.$$.fragment),t=O(),u&&u.c(),i=O(),c.c(),a=O(),b(l.$$.fragment)},l(f){v(e.$$.fragment,f),t=D(f),u&&u.l(f),i=D(f),c.l(f),a=D(f),v(l.$$.fragment,f)},m(f,p){k(e,f,p),g(f,t,p),u&&u.m(f,p),g(f,i,p),c.m(f,p),g(f,a,p),k(l,f,p),r=!0},p(f,p){var G,K;const L={};p&69650&&(L.$$scope={dirty:p,ctx:f}),e.$set(L),p&8&&(s=!f[3]||((K=(G=f[3])==null?void 0:G.connection)==null?void 0:K.includes("android"))),s?u?(u.p(f,p),p&8&&h(u,1)):(u=ne(f),u.c(),h(u,1),u.m(i.parentNode,i)):u&&(z(),$(u,1,1,()=>{u=null}),B()),p&1&&N(n,n=f[0])?(z(),$(c,1,1,ye),B(),c=oe(f),c.c(),h(c),c.m(a.parentNode,a)):c.p(f,p);const q={};p&2048&&(q.loading=f[11]),l.$set(q)},i(f){r||(h(e.$$.fragment,f),h(u),h(c),h(l.$$.fragment,f),r=!0)},o(f){$(e.$$.fragment,f),$(u),$(c),$(l.$$.fragment,f),r=!1},d(f){w(e,f),f&&m(t),u&&u.d(f),f&&m(i),c.d(f),f&&m(a),w(l,f)}}}function rt(o){let e,t,s,i,n;return t=new Pe({props:{$$slots:{default:[et]},$$scope:{ctx:o}}}),i=new Oe({props:{id:"custom-form",class:"flex flex-col gap-y-4 px-2",role:"tabpanel",action:"/api/device/state/"+o[1],onSubmit:o[7],$$slots:{default:[st,({loading:a})=>({11:a}),({loading:a})=>a?2048:0]},$$scope:{ctx:o}}}),{c(){e=y("nav"),b(t.$$.fragment),s=O(),b(i.$$.fragment),this.h()},l(a){e=T(a,"NAV",{class:!0});var l=C(e);v(t.$$.fragment,l),l.forEach(m),s=D(a),v(i.$$.fragment,a),this.h()},h(){_(e,"class","mb-6")},m(a,l){g(a,e,l),k(t,e,null),g(a,s,l),k(i,a,l),n=!0},p(a,[l]){const r={};l&65537&&(r.$$scope={dirty:l,ctx:a}),t.$set(r);const u={};l&2&&(u.action="/api/device/state/"+a[1]),l&67614&&(u.$$scope={dirty:l,ctx:a}),i.$set(u)},i(a){n||(h(t.$$.fragment,a),h(i.$$.fragment,a),n=!0)},o(a){$(t.$$.fragment,a),$(i.$$.fragment,a),n=!1},d(a){a&&m(e),w(t),a&&m(s),w(i,a)}}}function nt(o,e,t){let s,i,n,a;const{state:l}=De();Y(o,l,p=>t(8,n=p));const r=Fe(l);Y(o,r,p=>t(4,a=p));let u="BLANK",c="";async function d(p,L){const q=Object.fromEntries(p);await Le(L.toString(),X(V({},q),{type:u}))}function A(p){u=p,t(0,u)}function f(){c=Te(this),t(1,c)}return o.$$.update=()=>{o.$$.dirty&258&&t(3,s=n.get(c)),o.$$.dirty&1&&t(2,i=M.find(p=>W(p)===u))},[u,c,i,s,a,l,r,d,n,A,f]}class bt extends F{constructor(e){super();I(this,e,nt,rt,N,{})}}export{bt as default};
