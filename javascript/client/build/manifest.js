export const manifest = {
	appDir: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/tiger.jpg","logo.png","manifest.webmanifest","preset/info.json","preset/tea.json"]),
	mimeTypes: {".css":"text/css",".jpg":"image/jpeg",".png":"image/png",".webmanifest":"application/manifest+json",".json":"application/json"},
	_: {
		entry: {"file":"start-4d69d5a0.js","js":["start-4d69d5a0.js","chunks/vendor-e399076d.js","chunks/singletons-d1fb5791.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/6.js'),
			() => import('./server/nodes/4.js'),
			() => import('./server/nodes/7.js'),
			() => import('./server/nodes/8.js'),
			() => import('./server/nodes/10.js'),
			() => import('./server/nodes/11.js'),
			() => import('./server/nodes/12.js'),
			() => import('./server/nodes/13.js'),
			() => import('./server/nodes/14.js'),
			() => import('./server/nodes/15.js'),
			() => import('./server/nodes/16.js'),
			() => import('./server/nodes/17.js')
		],
		routes: [
			{
				type: 'page',
				key: "",
				pattern: /^\/$/,
				params: null,
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				key: "remote/custom",
				pattern: /^\/remote\/custom\/?$/,
				params: null,
				path: "/remote/custom",
				shadow: null,
				a: [0,3,4],
				b: [1,5]
			},
			{
				type: 'page',
				key: "remote/image",
				pattern: /^\/remote\/image\/?$/,
				params: null,
				path: "/remote/image",
				shadow: null,
				a: [0,3,6],
				b: [1,5]
			},
			{
				type: 'page',
				key: "remote/edit",
				pattern: /^\/remote\/edit\/?$/,
				params: null,
				path: "/remote/edit",
				shadow: null,
				a: [0,3,7],
				b: [1,5]
			},
			{
				type: 'page',
				key: "cell",
				pattern: /^\/cell\/?$/,
				params: null,
				path: "/cell",
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				key: "cell/frame/blank",
				pattern: /^\/cell\/frame\/blank\/?$/,
				params: null,
				path: "/cell/frame/blank",
				shadow: null,
				a: [0,9,10],
				b: [1]
			},
			{
				type: 'page',
				key: "cell/frame/image",
				pattern: /^\/cell\/frame\/image\/?$/,
				params: null,
				path: "/cell/frame/image",
				shadow: null,
				a: [0,9,11],
				b: [1]
			},
			{
				type: 'page',
				key: "cell/frame/text",
				pattern: /^\/cell\/frame\/text\/?$/,
				params: null,
				path: "/cell/frame/text",
				shadow: null,
				a: [0,9,12],
				b: [1]
			},
			{
				type: 'page',
				key: "cell/frame/web",
				pattern: /^\/cell\/frame\/web\/?$/,
				params: null,
				path: "/cell/frame/web",
				shadow: null,
				a: [0,9,13],
				b: [1]
			},
			{
				type: 'page',
				key: "demo",
				pattern: /^\/demo\/?$/,
				params: null,
				path: "/demo",
				shadow: null,
				a: [0,14],
				b: [1]
			},
			{
				type: 'page',
				key: "page/busy/[person]",
				pattern: /^\/page\/busy\/([^/]+?)\/?$/,
				params: (m) => ({ person: m[1]}),
				path: null,
				shadow: null,
				a: [0,15],
				b: [1]
			}
		]
	}
};
