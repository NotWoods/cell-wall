export const manifest = {
	appDir: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/tiger.jpg","logo.png","manifest.webmanifest","preset/info.json","preset/tea.json"]),
	_: {
		mime: {".css":"text/css",".jpg":"image/jpeg",".png":"image/png",".webmanifest":"application/manifest+json",".json":"application/json"},
		entry: {"file":"start-16ef0ce2.js","js":["start-16ef0ce2.js","chunks/vendor-972526c7.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/5.js'),
			() => import('./server/nodes/6.js'),
			() => import('./server/nodes/7.js'),
			() => import('./server/nodes/9.js'),
			() => import('./server/nodes/10.js'),
			() => import('./server/nodes/11.js'),
			() => import('./server/nodes/12.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/custom\/?$/,
				params: null,
				path: "/remote/custom",
				a: [0,3,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/image\/?$/,
				params: null,
				path: "/remote/image",
				a: [0,3,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/edit\/?$/,
				params: null,
				path: "/remote/edit",
				a: [0,3,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/cell\/?$/,
				params: null,
				path: "/cell",
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/cell\/frame\/?$/,
				params: null,
				path: "/cell/frame",
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/page\/busy\/([^/]+?)\/?$/,
				params: (m) => ({ person: m[1]}),
				path: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/page\/text\/?$/,
				params: null,
				path: "/page/text",
				a: [0,10],
				b: [1]
			}
		]
	}
};
