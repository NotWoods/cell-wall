export const manifest = {
	appDir: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/tiger.jpg","logo.png","manifest.webmanifest","preset/info.json","preset/tea.json"]),
	_: {
		mime: {".css":"text/css",".jpg":"image/jpeg",".png":"image/png",".webmanifest":"application/manifest+json",".json":"application/json"},
		entry: {"file":"start-86a6a364.js","js":["start-86a6a364.js","chunks/vendor-972526c7.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js'),
			() => import('./nodes/7.js'),
			() => import('./nodes/8.js'),
			() => import('./nodes/9.js'),
			() => import('./nodes/10.js'),
			() => import('./nodes/11.js'),
			() => import('./nodes/12.js')
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
				pattern: /^\/remote\/?$/,
				params: null,
				path: "/remote",
				a: [0,3,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/custom\/?$/,
				params: null,
				path: "/remote/custom",
				a: [0,3,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/image\/?$/,
				params: null,
				path: "/remote/image",
				a: [0,3,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/edit\/?$/,
				params: null,
				path: "/remote/edit",
				a: [0,3,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/remote\/text\/?$/,
				params: null,
				path: "/remote/text",
				a: [0,3,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/cell\/?$/,
				params: null,
				path: "/cell",
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/cell\/frame\/?$/,
				params: null,
				path: "/cell/frame",
				a: [0,10],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/page\/busy\/([^/]+?)\/?$/,
				params: (m) => ({ person: m[1]}),
				path: null,
				a: [0,11],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/page\/text\/?$/,
				params: null,
				path: "/page/text",
				a: [0,12],
				b: [1]
			}
		]
	}
};
