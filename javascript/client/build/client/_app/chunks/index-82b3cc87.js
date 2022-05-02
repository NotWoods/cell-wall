import{W as m}from"./index-6bece970.js";function d(t){const n=t-1;return n*n*n+1}function $(t){return t*t*t*t*t}function g(t,{delay:n=0,duration:o=400,easing:r=m}={}){const s=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:r,css:c=>`opacity: ${c*s}`}}function x(t,{delay:n=0,duration:o=400,easing:r=d,x:s=0,y:c=0,opacity:f=0}={}){const a=getComputedStyle(t),e=+a.opacity,u=a.transform==="none"?"":a.transform,p=e*(1-f);return{delay:n,duration:o,easing:r,css:(i,y)=>`
			transform: ${u} translate(${(1-i)*s}px, ${(1-i)*c}px);
			opacity: ${e-p*y}`}}export{x as a,g as f,$ as q};
