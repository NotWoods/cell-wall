import"./web-1a0de502.js";function s(t){return typeof t=="number"&&!Number.isNaN(t)}function u(t={}){return s(t.width)&&s(t.height)}function c(t={}){return s(t.x)&&s(t.y)&&u(t)}function f(t){const n=[],h=[],e=[];for(const[o,{info:i}]of t){if(!i){e.push({serial:o});continue}c(i)?n.push(i):u(i)?h.push(i):e.push(i)}return{rectWithPos:n,rect:h,rest:e}}function a(t,n){const{width:h,height:e}=n,o=t.width/h,i=t.height/e;return Math.min(o,i)}function p(t,n){const{x:h,y:e,width:o,height:i}=t;return{x:h*n,y:e*n,width:o*n,height:i*n}}export{p as a,a as f,f as s};