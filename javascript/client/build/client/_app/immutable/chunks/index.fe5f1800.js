import{q,t as u}from"./scheduler.fd4d87b3.js";function x(t){const n=t-1;return n*n*n+1}function C(t){return t*t*t*t*t}function S(t,{delay:n=0,duration:o=400,easing:s=q}={}){const c=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:s,css:a=>`opacity: ${a*c}`}}function U(t,{delay:n=0,duration:o=400,easing:s=x,x:c=0,y:a=0,opacity:f=0}={}){const r=getComputedStyle(t),e=+r.opacity,y=r.transform==="none"?"":r.transform,p=e*(1-f),[l,m]=u(c),[$,d]=u(a);return{delay:n,duration:o,easing:s,css:(i,g)=>`
			transform: ${y} translate(${(1-i)*l}${m}, ${(1-i)*$}${d});
			opacity: ${e-p*g}`}}export{U as a,S as f,C as q};
