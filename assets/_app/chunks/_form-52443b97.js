async function e(o,r){try{const t=await fetch(o,{method:"post",headers:{"content-type":"application/json"},body:JSON.stringify(r)});if(!t.ok)throw new Error(t.statusText);return t}catch(t){throw console.error(t),t}}function n(o){const r=new URLSearchParams;for(const[t,a]of o)typeof a=="string"&&r.append(t,a);return r}export{n as f,e as p};
