import{S as D,i as L,s as H,w as d,x as h,y as g,q as v,o as b,B as w,L as q,k as O,m as I,g as _,d as u,e as E,c as C,a as k,b as c,af as A,t as S,h as z,J as T}from"../../chunks/vendor-92048905.js";import{R as V,D as y}from"../../chunks/DeviceOptions-75d7ee13.js";import{H as P}from"../../chunks/HorizontalField-6331c5bf.js";import{V as J}from"../../chunks/VerticalField-3fc71dc9.js";import{F as K}from"../../chunks/SubmitButton-e9d712ee.js";import{a as U,s as X,b as j}from"../../chunks/__layout-d4660940.js";import"../../chunks/LoadingSpinner-d8b77dcc.js";import"../../chunks/snackbar-host-0696384f.js";import"../../chunks/cell-state-schema-a24ecc56.js";import"../../chunks/stores-666d7af9.js";import"../../chunks/TopBar-adf9860c.js";function G(l){let e,r;return{c(){e=E("textarea"),this.h()},l(s){e=C(s,"TEXTAREA",{class:!0,id:!0,name:!0,rows:!0,placeholder:!0}),k(e).forEach(u),this.h()},h(){c(e,"class",r=l[6]),e.required=!0,c(e,"id","control-text"),c(e,"name","text"),c(e,"rows","10"),c(e,"placeholder"," Apple \r Banana \r Carrot")},m(s,o){_(s,e,o)},p(s,o){o&64&&r!==(r=s[6])&&c(e,"class",r)},d(s){s&&u(e)}}}function M(l){let e;return{c(){e=E("input"),this.h()},l(r){e=C(r,"INPUT",{id:!0,name:!0,type:!0}),this.h()},h(){c(e,"id","control-color"),c(e,"name","backgroundColor"),c(e,"type","color"),e.value="#ffffff"},m(r,s){_(r,e,s)},d(r){r&&u(e)}}}function Q(l){let e,r,s,o;return r=new y({props:{devices:l[1]}}),{c(){e=E("select"),d(r.$$.fragment),this.h()},l(a){e=C(a,"SELECT",{name:!0,id:!0,class:!0});var n=k(e);h(r.$$.fragment,n),n.forEach(u),this.h()},h(){e.multiple=!0,c(e,"name","device"),c(e,"id","control-serial"),c(e,"class",s=l[6])},m(a,n){_(a,e,n),g(r,e,null),A(e,l[0]),o=!0},p(a,n){const f={};n&2&&(f.devices=a[1]),r.$set(f),(!o||n&64&&s!==(s=a[6]))&&c(e,"class",s),(!o||n&1)&&A(e,a[0])},i(a){o||(v(r.$$.fragment,a),o=!0)},o(a){b(r.$$.fragment,a),o=!1},d(a){a&&u(e),w(r)}}}function W(l){let e,r,s,o,a,n,f,m;return{c(){e=E("select"),r=E("option"),s=S("Ignore"),o=E("option"),a=S("Blank"),n=E("option"),f=S("Off"),this.h()},l($){e=C($,"SELECT",{id:!0,name:!0,class:!0});var p=k(e);r=C(p,"OPTION",{});var t=k(r);s=z(t,"Ignore"),t.forEach(u),o=C(p,"OPTION",{});var i=k(o);a=z(i,"Blank"),i.forEach(u),n=C(p,"OPTION",{});var x=k(n);f=z(x,"Off"),x.forEach(u),p.forEach(u),this.h()},h(){r.__value="ignore",r.value=r.__value,o.__value="blank",o.value=o.__value,n.__value="off",n.value=n.__value,c(e,"id","control-rest"),c(e,"name","rest"),c(e,"class",m=l[6])},m($,p){_($,e,p),T(e,r),T(r,s),T(e,o),T(o,a),T(e,n),T(n,f)},p($,p){p&64&&m!==(m=$[6])&&c(e,"class",m)},d($){$&&u(e)}}}function Y(l){let e,r,s,o,a,n,f,m,$,p;return e=new J({props:{for:"control-text",label:"Text",$$slots:{default:[G,({inputClassName:t})=>({6:t}),({inputClassName:t})=>t?64:0]},$$scope:{ctx:l}}}),s=new P({props:{for:"control-color",label:"Background Color",$$slots:{default:[M]},$$scope:{ctx:l}}}),a=new P({props:{for:"control-serial",label:"Devices",$$slots:{default:[Q,({inputClassName:t})=>({6:t}),({inputClassName:t})=>t?64:0]},$$scope:{ctx:l}}}),f=new P({props:{for:"control-rest",label:"Remaining Cells",$$slots:{default:[W,({inputClassName:t})=>({6:t}),({inputClassName:t})=>t?64:0]},$$scope:{ctx:l}}}),$=new V({props:{loading:l[5]}}),{c(){d(e.$$.fragment),r=O(),d(s.$$.fragment),o=O(),d(a.$$.fragment),n=O(),d(f.$$.fragment),m=O(),d($.$$.fragment)},l(t){h(e.$$.fragment,t),r=I(t),h(s.$$.fragment,t),o=I(t),h(a.$$.fragment,t),n=I(t),h(f.$$.fragment,t),m=I(t),h($.$$.fragment,t)},m(t,i){g(e,t,i),_(t,r,i),g(s,t,i),_(t,o,i),g(a,t,i),_(t,n,i),g(f,t,i),_(t,m,i),g($,t,i),p=!0},p(t,i){const x={};i&192&&(x.$$scope={dirty:i,ctx:t}),e.$set(x);const B={};i&128&&(B.$$scope={dirty:i,ctx:t}),s.$set(B);const R={};i&195&&(R.$$scope={dirty:i,ctx:t}),a.$set(R);const F={};i&192&&(F.$$scope={dirty:i,ctx:t}),f.$set(F);const N={};i&32&&(N.loading=t[5]),$.$set(N)},i(t){p||(v(e.$$.fragment,t),v(s.$$.fragment,t),v(a.$$.fragment,t),v(f.$$.fragment,t),v($.$$.fragment,t),p=!0)},o(t){b(e.$$.fragment,t),b(s.$$.fragment,t),b(a.$$.fragment,t),b(f.$$.fragment,t),b($.$$.fragment,t),p=!1},d(t){w(e,t),t&&u(r),w(s,t),t&&u(o),w(a,t),t&&u(n),w(f,t),t&&u(m),w($,t)}}}function Z(l){let e,r;return e=new K({props:{class:"flex flex-col gap-y-4",action:"/api/action/text",onSubmit:ee,$$slots:{default:[Y,({loading:s})=>({5:s}),({loading:s})=>s?32:0]},$$scope:{ctx:l}}}),{c(){d(e.$$.fragment)},l(s){h(e.$$.fragment,s)},m(s,o){g(e,s,o),r=!0},p(s,[o]){const a={};o&163&&(a.$$scope={dirty:o,ctx:s}),e.$set(a)},i(s){r||(v(e.$$.fragment,s),r=!0)},o(s){b(e.$$.fragment,s),r=!1},d(s){w(e,s)}}}const me=!0;async function ee(l,e){const r=l.get("backgroundColor");r!=="#ffffff"&&e.searchParams.set("backgroundColor",r),e.searchParams.set("rest",l.get("rest"));try{const s=await fetch(e.toString(),{method:"post",headers:{"content-type":"text/plain"},body:l.get("text")});if(!s.ok)throw new Error(s.statusText)}catch(s){throw console.error(s),s}}function te(l,e,r){let s,o;const{state:a}=U(),n=X(a);q(l,n,m=>r(1,o=m));const f=j(a);return q(l,f,m=>r(0,s=m)),[s,o,n,f]}class pe extends D{constructor(e){super();L(this,e,te,Z,H,{})}}export{pe as default,me as prerender};
