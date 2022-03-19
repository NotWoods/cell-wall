export const manifest = {
	appDir: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/tiger.jpg","logo.png","manifest.webmanifest","maskable_icon.png","preset/info.json","preset/tea.json"]),
	mimeTypes: {".css":"text/css",".jpg":"image/jpeg",".png":"image/png",".webmanifest":"application/manifest+json",".json":"application/json"},
	_: {
		entry: {"file":"start-c15babb3.js","js":["start-c15babb3.js","chunks/vendor-98a08ead.js","chunks/singletons-d1fb5791.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/6.js'),
			() => import('./server/nodes/4.js'),
			() => import('./server/nodes/7.js'),
			() => import('./server/nodes/8.js'),
			() => import('./server/nodes/9.js'),
			() => import('./server/nodes/10.js'),
			() => import('./server/nodes/12.js'),
			() => import('./server/nodes/13.js'),
			() => import('./server/nodes/14.js'),
			() => import('./server/nodes/15.js'),
			() => import('./server/nodes/16.js'),
			() => import('./server/nodes/17.js'),
			() => import('./server/nodes/18.js'),
			() => import('./server/nodes/19.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "remote/third_party",
				pattern: /^\/remote\/third_party\/?$/,
				names: [],
				types: [],
				path: "/remote/third_party",
				shadow: null,
				a: [0,3,4],
				b: [1,5]
			},
			{
				type: 'page',
				id: "remote/canvas",
				pattern: /^\/remote\/canvas\/?$/,
				names: [],
				types: [],
				path: "/remote/canvas",
				shadow: null,
				a: [0,3,6],
				b: [1,5]
			},
			{
				type: 'page',
				id: "remote/custom",
				pattern: /^\/remote\/custom\/?$/,
				names: [],
				types: [],
				path: "/remote/custom",
				shadow: null,
				a: [0,3,7],
				b: [1,5]
			},
			{
				type: 'page',
				id: "remote/image",
				pattern: /^\/remote\/image\/?$/,
				names: [],
				types: [],
				path: "/remote/image",
				shadow: null,
				a: [0,3,8],
				b: [1,5]
			},
			{
				type: 'page',
				id: "remote/edit",
				pattern: /^\/remote\/edit\/?$/,
				names: [],
				types: [],
				path: "/remote/edit",
				shadow: null,
				a: [0,3,9],
				b: [1,5]
			},
			{
				type: 'page',
				id: "cell",
				pattern: /^\/cell\/?$/,
				names: [],
				types: [],
				path: "/cell",
				shadow: null,
				a: [0,10],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/blank",
				pattern: /^\/cell\/frame\/blank\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/blank",
				shadow: null,
				a: [0,11,12],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/image",
				pattern: /^\/cell\/frame\/image\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/image",
				shadow: null,
				a: [0,11,13],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/text",
				pattern: /^\/cell\/frame\/text\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/text",
				shadow: null,
				a: [0,11,14],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/web",
				pattern: /^\/cell\/frame\/web\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/web",
				shadow: null,
				a: [0,11,15],
				b: [1]
			},
			{
				type: 'page',
				id: "demo",
				pattern: /^\/demo\/?$/,
				names: [],
				types: [],
				path: "/demo",
				shadow: null,
				a: [0,16],
				b: [1]
			},
			{
				type: 'page',
				id: "page/busy/[person]",
				pattern: /^\/page\/busy\/([^/]+?)\/?$/,
				names: ["person"],
				types: [null],
				path: null,
				shadow: null,
				a: [0,17],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
