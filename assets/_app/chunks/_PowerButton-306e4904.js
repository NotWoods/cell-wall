import{S as t,i as o,s as n,O as e,l,f as s,P as c,x as a,u as i,d as u,D as r,B as f,e as p,c as h,a as m,$ as d,N as b,E as v,F as $,G as y,p as k}from"./vendor-c77ecffb.js";import{p as w}from"./_form-52443b97.js";function g(t){let o,n,e,l,c;const w=t[6].default,g=r(w,t,t[5],null);let x=[t[2],{type:"submit"},{formaction:n="/api/device/power/$"+t[0]},{class:"button is-danger"}],T={};for(let s=0;s<x.length;s+=1)T=f(T,x[s]);return{c(){o=p("button"),g&&g.c(),this.h()},l(t){o=h(t,"BUTTON",{type:!0,formaction:!0,class:!0});var n=m(o);g&&g.l(n),n.forEach(u),this.h()},h(){d(o,T)},m(n,a){s(n,o,a),g&&g.m(o,null),o.autofocus&&o.focus(),e=!0,l||(c=b(o,"click",t[3]),l=!0)},p(t,l){g&&g.p&&(!e||32&l)&&v(g,w,t,t[5],e?y(w,t[5],l,null):$(t[5]),null),d(o,T=k(x,[t[2],{type:"submit"},(!e||1&l&&n!==(n="/api/device/power/$"+t[0]))&&{formaction:n},{class:"button is-danger"}]))},i(t){e||(a(g,t),e=!0)},o(t){i(g,t),e=!1},d(t){t&&u(o),g&&g.d(t),l=!1,c()}}}function x(t){let o,n,e,l,c;const w=t[6].default,g=r(w,t,t[5],null);let x=[t[2],{type:"submit"},{formaction:n="/api/device/power/$"+t[0]},{class:"button"}],T={};for(let s=0;s<x.length;s+=1)T=f(T,x[s]);return{c(){o=p("button"),g&&g.c(),this.h()},l(t){o=h(t,"BUTTON",{type:!0,formaction:!0,class:!0});var n=m(o);g&&g.l(n),n.forEach(u),this.h()},h(){d(o,T)},m(n,a){s(n,o,a),g&&g.m(o,null),o.autofocus&&o.focus(),e=!0,l||(c=b(o,"click",t[3]),l=!0)},p(t,l){g&&g.p&&(!e||32&l)&&v(g,w,t,t[5],e?y(w,t[5],l,null):$(t[5]),null),d(o,T=k(x,[t[2],{type:"submit"},(!e||1&l&&n!==(n="/api/device/power/$"+t[0]))&&{formaction:n},{class:"button"}]))},i(t){e||(a(g,t),e=!0)},o(t){i(g,t),e=!1},d(t){t&&u(o),g&&g.d(t),l=!1,c()}}}function T(t){let o,n,e,l,c;const w=t[6].default,g=r(w,t,t[5],null);let x=[t[2],{type:"submit"},{formaction:n="/api/device/power/$"+t[0]},{class:"button is-loading"}],T={};for(let s=0;s<x.length;s+=1)T=f(T,x[s]);return{c(){o=p("button"),g&&g.c(),this.h()},l(t){o=h(t,"BUTTON",{type:!0,formaction:!0,class:!0});var n=m(o);g&&g.l(n),n.forEach(u),this.h()},h(){d(o,T)},m(n,a){s(n,o,a),g&&g.m(o,null),o.autofocus&&o.focus(),e=!0,l||(c=b(o,"click",t[3]),l=!0)},p(t,l){g&&g.p&&(!e||32&l)&&v(g,w,t,t[5],e?y(w,t[5],l,null):$(t[5]),null),d(o,T=k(x,[t[2],{type:"submit"},(!e||1&l&&n!==(n="/api/device/power/$"+t[0]))&&{formaction:n},{class:"button is-loading"}]))},i(t){e||(a(g,t),e=!0)},o(t){i(g,t),e=!1},d(t){t&&u(o),g&&g.d(t),l=!1,c()}}}function N(t){let o,n,r,f={ctx:t,current:null,token:null,hasCatch:!0,pending:T,then:x,catch:g,value:9,error:9,blocks:[,,,]};return e(n=t[1],f),{c(){o=l(),f.block.c()},l(t){o=l(),f.block.l(t)},m(t,n){s(t,o,n),f.block.m(t,f.anchor=n),f.mount=()=>o.parentNode,f.anchor=o,r=!0},p(o,[l]){t=o,f.ctx=t,2&l&&n!==(n=t[1])&&e(n,f)||c(f,t,l)},i(t){r||(a(f.block),r=!0)},o(t){for(let o=0;o<3;o+=1){const t=f.blocks[o];i(t)}r=!1},d(t){t&&u(o),f.block.d(t),f.token=null,f=null}}}function B(t,o,n){let{$$slots:e={},$$scope:l}=o;var s=this&&this.__awaiter||function(t,o,n,e){return new(n||(n=Promise))((function(l,s){function c(t){try{i(e.next(t))}catch(o){s(o)}}function a(t){try{i(e.throw(t))}catch(o){s(o)}}function i(t){var o;t.done?l(t.value):(o=t.value,o instanceof n?o:new n((function(t){t(o)}))).then(c,a)}i((e=e.apply(t,o||[])).next())}))};let{serial:c}=o,{value:a}=o;const i={type:"button",name:"on",value:a.toString()};let u=Promise.resolve();return t.$$set=t=>{"serial"in t&&n(0,c=t.serial),"value"in t&&n(4,a=t.value),"$$scope"in t&&n(5,l=t.$$scope)},[c,u,i,function(){n(1,u=function(){return s(this,void 0,void 0,(function*(){yield w(`/api/device/power/${c}`,{on:a})}))}())},a,l,e]}class E extends t{constructor(t){super(),o(this,t,B,N,n,{serial:0,value:4})}}export{E as P};
