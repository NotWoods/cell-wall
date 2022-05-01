import{S as de,i as _e,s as ue,e as p,c as g,a as k,d as _,b as w,g as A,E as O,Y as ve,t as I,k as D,h as R,m as N,M as c,j as X,w as ee,N as me,x as te,y as se,$ as le,q as ae,o as ne,B as re,R as pe,a0 as oe}from"../../chunks/index-36754a35.js";import{f as ge,a as ke,s as Ee}from"../../chunks/fit-scale-8174d2ad.js";import{L as be}from"../../chunks/LinkButton-9ce6f138.js";import{c as ye}from"../../chunks/web-9961d8d9.js";import{g as $e}from"../../chunks/__layout-fb12489c.js";import"../../chunks/TopBar-b37596c0.js";import"../../chunks/index-2d3b577e.js";import"../../chunks/snackbar-host-48cbce91.js";function we(a){let t;return{c(){t=p("canvas"),this.h()},l(e){t=g(e,"CANVAS",{class:!0,height:!0,width:!0}),k(t).forEach(_),this.h()},h(){w(t,"class","fill shadow shadow-green-900 rounded-lg border-8 svelte-nnt7wc"),w(t,"height","700"),w(t,"width","1200")},m(e,l){A(e,t,l),a[5](t)},p:O,i:O,o:O,d(e){e&&_(t),a[5](null)}}}function Ce(a,t,e){if(!!a){a.clearRect(0,0,a.canvas.width,a.canvas.height),a.font="20px sans-serif";for(const l of e){const{x:o,y:r,width:n,height:h}=ke(l,t);a.fillStyle="#EFEFEF",a.fillRect(o,r,n,h),a.fillStyle="#1b5e20",a.fillText(l.deviceName||l.serial,o+10,r+30,n-20)}}}function Se(a,t,e){let l,o,r,{rects:n=[]}=t,h;function v(d){ve[d?"unshift":"push"](()=>{h=d,e(0,h)})}return a.$$set=d=>{"rects"in d&&e(1,n=d.rects)},a.$$.update=()=>{var d;a.$$.dirty&1&&e(3,l=(d=h==null?void 0:h.getContext("2d"))!=null?d:void 0),a.$$.dirty&2&&e(4,o=ye(n)),a.$$.dirty&17&&e(2,r=h?ge(h,o):1),a.$$.dirty&14&&Ce(l,r,n)},[h,n,r,l,o,v]}class De extends de{constructor(t){super(),_e(this,t,Se,we,ue,{rects:1})}}function ie(a,t,e){const l=a.slice();return l[3]=t[e],l}function ce(a,t,e){const l=a.slice();return l[3]=t[e],l}function Ne(a){let t;return{c(){t=I("Edit Cells")},l(e){t=R(e,"Edit Cells")},m(e,l){A(e,t,l)},d(e){e&&_(t)}}}function he(a,t){let e,l,o=t[3].serial+"",r,n,h,v=t[3].width+"",d,y,C=t[3].height+"",S,$;return{key:a,first:null,c(){e=p("div"),l=p("dt"),r=I(o),n=D(),h=p("dd"),d=I(v),y=I(" x "),S=I(C),$=D(),this.h()},l(u){e=g(u,"DIV",{});var m=k(e);l=g(m,"DT",{class:!0});var V=k(l);r=R(V,o),V.forEach(_),n=N(m),h=g(m,"DD",{class:!0});var E=k(h);d=R(E,v),y=R(E," x "),S=R(E,C),E.forEach(_),$=N(m),m.forEach(_),this.h()},h(){w(l,"class","svelte-1htb5k2"),w(h,"class","svelte-1htb5k2"),this.first=e},m(u,m){A(u,e,m),c(e,l),c(l,r),c(e,n),c(e,h),c(h,d),c(h,y),c(h,S),c(e,$)},p(u,m){t=u,m&1&&o!==(o=t[3].serial+"")&&X(r,o),m&1&&v!==(v=t[3].width+"")&&X(d,v),m&1&&C!==(C=t[3].height+"")&&X(S,C)},d(u){u&&_(e)}}}function fe(a,t){let e,l=t[3].serial+"",o;return{key:a,first:null,c(){e=p("li"),o=I(l),this.h()},l(r){e=g(r,"LI",{class:!0});var n=k(e);o=R(n,l),n.forEach(_),this.h()},h(){w(e,"class","svelte-1htb5k2"),this.first=e},m(r,n){A(r,e,n),c(e,o)},p(r,n){t=r,n&1&&l!==(l=t[3].serial+"")&&X(o,l)},d(r){r&&_(e)}}}function Ie(a){let t,e,l,o,r,n,h,v,d,y,C,S,$,u=[],m=new Map,V,E,T,j,z,q,b=[],U=new Map,F;l=new De({props:{rects:a[0].rectWithPos}}),n=new be({props:{href:"/remote/edit",$$slots:{default:[Ne]},$$scope:{ctx:a}}});let M=a[0].rect;const G=s=>s[3].serial;for(let s=0;s<M.length;s+=1){let i=ce(a,M,s),f=G(i);m.set(f,u[s]=he(f,i))}let W=a[0].rest;const J=s=>s[3].serial;for(let s=0;s<W.length;s+=1){let i=ie(a,W,s),f=J(i);U.set(f,b[s]=fe(f,i))}return{c(){t=D(),e=p("section"),ee(l.$$.fragment),o=D(),r=p("div"),ee(n.$$.fragment),h=D(),v=p("aside"),d=p("div"),y=p("h2"),C=I("No X/Y"),S=D(),$=p("dl");for(let s=0;s<u.length;s+=1)u[s].c();V=D(),E=p("div"),T=p("h2"),j=I("No width/height"),z=D(),q=p("ul");for(let s=0;s<b.length;s+=1)b[s].c();this.h()},l(s){me('[data-svelte="svelte-p288z0"]',document.head).forEach(_),t=N(s),e=g(s,"SECTION",{class:!0});var f=k(e);te(l.$$.fragment,f),o=N(f),r=g(f,"DIV",{});var B=k(r);te(n.$$.fragment,B),B.forEach(_),h=N(f),v=g(f,"ASIDE",{class:!0});var Y=k(v);d=g(Y,"DIV",{});var H=k(d);y=g(H,"H2",{class:!0});var K=k(y);C=R(K,"No X/Y"),K.forEach(_),S=N(H),$=g(H,"DL",{});var Q=k($);for(let L=0;L<u.length;L+=1)u[L].l(Q);Q.forEach(_),H.forEach(_),V=N(Y),E=g(Y,"DIV",{});var P=k(E);T=g(P,"H2",{class:!0});var Z=k(T);j=R(Z,"No width/height"),Z.forEach(_),z=N(P),q=g(P,"UL",{});var x=k(q);for(let L=0;L<b.length;L+=1)b[L].l(x);x.forEach(_),P.forEach(_),Y.forEach(_),f.forEach(_),this.h()},h(){document.title="Canvas | CellWall",w(y,"class","font-bold"),w(T,"class","font-bold"),w(v,"class","mt-4 svelte-1htb5k2"),w(e,"class","fill")},m(s,i){A(s,t,i),A(s,e,i),se(l,e,null),c(e,o),c(e,r),se(n,r,null),c(e,h),c(e,v),c(v,d),c(d,y),c(y,C),c(d,S),c(d,$);for(let f=0;f<u.length;f+=1)u[f].m($,null);c(v,V),c(v,E),c(E,T),c(T,j),c(E,z),c(E,q);for(let f=0;f<b.length;f+=1)b[f].m(q,null);F=!0},p(s,[i]){const f={};i&1&&(f.rects=s[0].rectWithPos),l.$set(f);const B={};i&256&&(B.$$scope={dirty:i,ctx:s}),n.$set(B),i&1&&(M=s[0].rect,u=le(u,i,G,1,s,M,m,$,oe,he,null,ce)),i&1&&(W=s[0].rest,b=le(b,i,J,1,s,W,U,q,oe,fe,null,ie))},i(s){F||(ae(l.$$.fragment,s),ae(n.$$.fragment,s),F=!0)},o(s){ne(l.$$.fragment,s),ne(n.$$.fragment,s),F=!1},d(s){s&&_(t),s&&_(e),re(l),re(n);for(let i=0;i<u.length;i+=1)u[i].d();for(let i=0;i<b.length;i+=1)b[i].d()}}}function Re(a,t,e){let l,o;const{state:r}=$e();return pe(a,r,n=>e(2,o=n)),a.$$.update=()=>{a.$$.dirty&4&&e(0,l=Ee(o))},[l,r,o]}class We extends de{constructor(t){super(),_e(this,t,Re,Ie,ue,{})}}export{We as default};
