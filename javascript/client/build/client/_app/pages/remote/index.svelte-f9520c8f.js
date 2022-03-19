import{S as B,i as D,s as F,F as j,e as h,c as b,a as I,d as m,b as p,g as _,G as q,H,I as R,q as d,o as g,w as S,x as A,y as P,B as k,t as v,k as C,h as w,m as N,Y as T,J as E,j as W,Z as J}from"../../chunks/vendor-75710b0b.js";import{S as G,F as M}from"../../chunks/SubmitButton-c2efd1a2.js";import{V as Y}from"../../chunks/VerticalField-6d675f87.js";import{f as Z}from"../../chunks/_form-52443b97.js";import"../../chunks/snackbar-host-c0618c11.js";import"../../chunks/cell-state-schema-de0c81a8.js";import"../../chunks/LoadingSpinner-2691eeec.js";function z(f){let e,s,l;const n=f[2].default,o=j(n,f,f[1],null);return{c(){e=h("article"),o&&o.c(),this.h()},l(r){e=b(r,"ARTICLE",{class:!0});var i=I(e);o&&o.l(i),i.forEach(m),this.h()},h(){p(e,"class",s="bg-slate-800 p-4 border rounded border-slate-700 "+f[0])},m(r,i){_(r,e,i),o&&o.m(e,null),l=!0},p(r,[i]){o&&o.p&&(!l||i&2)&&q(o,n,r,r[1],l?R(n,r[1],i,null):H(r[1]),null),(!l||i&1&&s!==(s="bg-slate-800 p-4 border rounded border-slate-700 "+r[0]))&&p(e,"class",s)},i(r){l||(d(o,r),l=!0)},o(r){g(o,r),l=!1},d(r){r&&m(e),o&&o.d(r)}}}function Q(f,e,s){let{$$slots:l={},$$scope:n}=e,{class:o=""}=e;return f.$$set=r=>{"class"in r&&s(0,o=r.class),"$$scope"in r&&s(1,n=r.$$scope)},[o,n,l]}class K extends B{constructor(e){super();D(this,e,Q,z,F,{class:0})}}function U(f){let e;return{c(){e=v(f[4])},l(s){e=w(s,f[4])},m(s,l){_(s,e,l)},p(s,l){l&16&&W(e,s[4])},d(s){s&&m(e)}}}function X(f){let e,s,l,n,o,r,i;const $=f[7].default,t=j($,f,f[8],null);return r=new G({props:{class:"mt-auto self-end",loading:f[5],name:"preset",value:f[1],formaction:f[2],$$slots:{default:[U]},$$scope:{ctx:f}}}),{c(){e=h("h3"),s=v(f[0]),l=C(),n=h("div"),t&&t.c(),o=C(),S(r.$$.fragment),this.h()},l(a){e=b(a,"H3",{});var u=I(e);s=w(u,f[0]),u.forEach(m),l=N(a),n=b(a,"DIV",{class:!0});var c=I(n);t&&t.l(c),c.forEach(m),o=N(a),A(r.$$.fragment,a),this.h()},h(){T(e,"text-2xl",f[3]),T(e,"text-xl",!f[3]),p(n,"class","")},m(a,u){_(a,e,u),E(e,s),_(a,l,u),_(a,n,u),t&&t.m(n,null),_(a,o,u),P(r,a,u),i=!0},p(a,u){(!i||u&1)&&W(s,a[0]),u&8&&T(e,"text-2xl",a[3]),u&8&&T(e,"text-xl",!a[3]),t&&t.p&&(!i||u&256)&&q(t,$,a,a[8],i?R($,a[8],u,null):H(a[8]),null);const c={};u&32&&(c.loading=a[5]),u&2&&(c.value=a[1]),u&4&&(c.formaction=a[2]),u&272&&(c.$$scope={dirty:u,ctx:a}),r.$set(c)},i(a){i||(d(t,a),d(r.$$.fragment,a),i=!0)},o(a){g(t,a),g(r.$$.fragment,a),i=!1},d(a){a&&m(e),a&&m(l),a&&m(n),t&&t.d(a),a&&m(o),k(r,a)}}}function y(f){let e,s;return e=new K({props:{class:"flex flex-col gap-y-4",$$slots:{default:[X]},$$scope:{ctx:f}}}),{c(){S(e.$$.fragment)},l(l){A(e.$$.fragment,l)},m(l,n){P(e,l,n),s=!0},p(l,[n]){const o={};n&319&&(o.$$scope={dirty:n,ctx:l}),e.$set(o)},i(l){s||(d(e.$$.fragment,l),s=!0)},o(l){g(e.$$.fragment,l),s=!1},d(l){k(e,l)}}}function x(f,e,s){let l,{$$slots:n={},$$scope:o}=e,{title:r}=e,{preset:i=void 0}=e,{formAction:$=void 0}=e,{large:t=!1}=e,{button:a="Activate"}=e,{status:u}=e;return f.$$set=c=>{"title"in c&&s(0,r=c.title),"preset"in c&&s(1,i=c.preset),"formAction"in c&&s(2,$=c.formAction),"large"in c&&s(3,t=c.large),"button"in c&&s(4,a=c.button),"status"in c&&s(6,u=c.status),"$$scope"in c&&s(8,o=c.$$scope)},f.$$.update=()=>{f.$$.dirty&66&&s(5,l=u.submitterName==="preset"&&u.submitterValue===i?u.loading:Promise.resolve())},[r,i,$,t,a,l,u,n,o]}class L extends B{constructor(e){super();D(this,e,x,y,F,{title:0,preset:1,formAction:2,large:3,button:4,status:6})}}function ee(f){let e,s,l,n,o,r,i,$;return{c(){e=h("select"),s=h("option"),l=v("Ignore"),n=h("option"),o=v("Blank"),r=h("option"),i=v("Off"),this.h()},l(t){e=b(t,"SELECT",{id:!0,name:!0,class:!0});var a=I(e);s=b(a,"OPTION",{});var u=I(s);l=w(u,"Ignore"),u.forEach(m),n=b(a,"OPTION",{});var c=I(n);o=w(c,"Blank"),c.forEach(m),r=b(a,"OPTION",{});var O=I(r);i=w(O,"Off"),O.forEach(m),a.forEach(m),this.h()},h(){s.__value="ignore",s.value=s.__value,n.__value="blank",n.value=n.__value,r.__value="off",r.value=r.__value,p(e,"id","control-rest"),p(e,"name","rest"),p(e,"class",$=f[2]+" cursor-pointer")},m(t,a){_(t,e,a),E(e,s),E(s,l),E(e,n),E(n,o),E(e,r),E(r,i)},p(t,a){a&4&&$!==($=t[2]+" cursor-pointer")&&p(e,"class",$)},d(t){t&&m(e)}}}function te(f){let e,s,l,n,o,r,i,$;return n=new Y({props:{label:"Remaining cells",for:"control-rest",$$slots:{default:[ee,({inputClassName:t})=>({2:t}),({inputClassName:t})=>t?4:0]},$$scope:{ctx:f}}}),{c(){e=h("h2"),s=v("Presets"),l=C(),S(n.$$.fragment),o=C(),r=h("img"),this.h()},l(t){e=b(t,"H2",{class:!0});var a=I(e);s=w(a,"Presets"),a.forEach(m),l=N(t),A(n.$$.fragment,t),o=N(t),r=b(t,"IMG",{class:!0,alt:!0,src:!0}),this.h()},h(){p(e,"class","text-3xl mb-4"),p(r,"class","block mt-4 shadow-inner rounded"),p(r,"alt",""),J(r.src,i="https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg")||p(r,"src",i)},m(t,a){_(t,e,a),E(e,s),_(t,l,a),P(n,t,a),_(t,o,a),_(t,r,a),$=!0},p(t,a){const u={};a&12&&(u.$$scope={dirty:a,ctx:t}),n.$set(u)},i(t){$||(d(n.$$.fragment,t),$=!0)},o(t){g(n.$$.fragment,t),$=!1},d(t){t&&m(e),t&&m(l),k(n,t),t&&m(o),t&&m(r)}}}function se(f){let e;return{c(){e=v("Calendar indicators and the week's weather.")},l(s){e=w(s,"Calendar indicators and the week's weather.")},m(s,l){_(s,e,l)},d(s){s&&m(e)}}}function le(f){let e;return{c(){e=v("What's avaliable to drink?")},l(s){e=w(s,"What's avaliable to drink?")},m(s,l){_(s,e,l)},d(s){s&&m(e)}}}function ae(f){let e;return{c(){e=v("Install")},l(s){e=w(s,"Install")},m(s,l){_(s,e,l)},d(s){s&&m(e)}}}function re(f){let e,s,l,n,o;return n=new G({props:{name:"action",value:"install",loading:f[1].submitterName==="action"&&f[1].submitterValue==="install"?f[1].loading:Promise.resolve(),formaction:"/api/action/install",$$slots:{default:[ae]},$$scope:{ctx:f}}}),{c(){e=h("a"),s=v("SDK Login"),l=C(),S(n.$$.fragment),this.h()},l(r){e=b(r,"A",{class:!0,href:!0});var i=I(e);s=w(i,"SDK Login"),i.forEach(m),l=N(r),A(n.$$.fragment,r),this.h()},h(){p(e,"class","px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800"),p(e,"href","/remote/third_party")},m(r,i){_(r,e,i),E(e,s),_(r,l,i),P(n,r,i),o=!0},p(r,i){const $={};i&2&&($.loading=r[1].submitterName==="action"&&r[1].submitterValue==="install"?r[1].loading:Promise.resolve()),i&8&&($.$$scope={dirty:i,ctx:r}),n.$set($)},i(r){o||(d(n.$$.fragment,r),o=!0)},o(r){g(n.$$.fragment,r),o=!1},d(r){r&&m(e),r&&m(l),k(n,r)}}}function ne(f){let e,s,l,n,o,r,i,$;return e=new K({props:{class:"row-span-2",$$slots:{default:[te]},$$scope:{ctx:f}}}),l=new L({props:{title:"Info",preset:"info",large:!0,status:f[1],$$slots:{default:[se]},$$scope:{ctx:f}}}),o=new L({props:{title:"Tea list",preset:"tea",large:!0,status:f[1],$$slots:{default:[le]},$$scope:{ctx:f}}}),i=new L({props:{title:"Actions",button:"Launch on devices",formAction:"/api/action/launch",status:f[1],$$slots:{default:[re]},$$scope:{ctx:f}}}),{c(){S(e.$$.fragment),s=C(),S(l.$$.fragment),n=C(),S(o.$$.fragment),r=C(),S(i.$$.fragment)},l(t){A(e.$$.fragment,t),s=N(t),A(l.$$.fragment,t),n=N(t),A(o.$$.fragment,t),r=N(t),A(i.$$.fragment,t)},m(t,a){P(e,t,a),_(t,s,a),P(l,t,a),_(t,n,a),P(o,t,a),_(t,r,a),P(i,t,a),$=!0},p(t,a){const u={};a&8&&(u.$$scope={dirty:a,ctx:t}),e.$set(u);const c={};a&2&&(c.status=t[1]),a&8&&(c.$$scope={dirty:a,ctx:t}),l.$set(c);const O={};a&2&&(O.status=t[1]),a&8&&(O.$$scope={dirty:a,ctx:t}),o.$set(O);const V={};a&2&&(V.status=t[1]),a&10&&(V.$$scope={dirty:a,ctx:t}),i.$set(V)},i(t){$||(d(e.$$.fragment,t),d(l.$$.fragment,t),d(o.$$.fragment,t),d(i.$$.fragment,t),$=!0)},o(t){g(e.$$.fragment,t),g(l.$$.fragment,t),g(o.$$.fragment,t),g(i.$$.fragment,t),$=!1},d(t){k(e,t),t&&m(s),k(l,t),t&&m(n),k(o,t),t&&m(r),k(i,t)}}}function oe(f){let e,s;return e=new M({props:{class:"grid sm:grid-cols-2 lg:grid-cols-3 gap-6",action:"/api/device/preset",onSubmit:f[0],$$slots:{default:[ne,({status:l})=>({1:l}),({status:l})=>l?2:0]},$$scope:{ctx:f}}}),{c(){S(e.$$.fragment)},l(l){A(e.$$.fragment,l)},m(l,n){P(e,l,n),s=!0},p(l,[n]){const o={};n&10&&(o.$$scope={dirty:n,ctx:l}),e.$set(o)},i(l){s||(d(e.$$.fragment,l),s=!0)},o(l){g(e.$$.fragment,l),s=!1},d(l){k(e,l)}}}const de=!0;function fe(f){async function e(s,l){const o=await(await fetch(l.toString(),{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:Z(s)})).json();console.log(o)}return[e]}class ge extends B{constructor(e){super();D(this,e,fe,oe,F,{})}}export{ge as default,de as prerender};
