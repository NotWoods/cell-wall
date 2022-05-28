export const manifest = {
	appDir: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/jsconf.mp4","img/jsconfbp.png","img/tiger.jpg","logo.png","manifest.webmanifest","maskable_icon.png","preset/info.json","preset/jsconfbp.json","preset/tea.json","preset/visualize.json"]),
	mimeTypes: {".css":"text/css",".jpg":"image/jpeg",".mp4":"video/mp4",".png":"image/png",".webmanifest":"application/manifest+json",".json":"application/json"},
	_: {
		entry: {"file":"start-d9fd72c2.js","js":["start-d9fd72c2.js","chunks/index-629ae59a.js","chunks/index-6cd92273.js","chunks/singletons-d1fb5791.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/14.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/12.js'),
			() => import('./server/nodes/13.js'),
			() => import('./server/nodes/4.js'),
			() => import('./server/nodes/19.js'),
			() => import('./server/nodes/5.js'),
			() => import('./server/nodes/15.js'),
			() => import('./server/nodes/16.js'),
			() => import('./server/nodes/17.js'),
			() => import('./server/nodes/18.js'),
			() => import('./server/nodes/21.js'),
			() => import('./server/nodes/22.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/6.js'),
			() => import('./server/nodes/7.js'),
			() => import('./server/nodes/8.js'),
			() => import('./server/nodes/9.js'),
			() => import('./server/nodes/10.js'),
			() => import('./server/nodes/11.js')
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
				id: "cell",
				pattern: /^\/cell\/?$/,
				names: [],
				types: [],
				path: "/cell",
				shadow: null,
				a: [0,3,4],
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
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				id: "remote",
				pattern: /^\/remote\/?$/,
				names: [],
				types: [],
				path: "/remote",
				shadow: null,
				a: [0,6,7],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/canvas",
				pattern: /^\/remote\/canvas\/?$/,
				names: [],
				types: [],
				path: "/remote/canvas",
				shadow: null,
				a: [0,6,9],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/custom",
				pattern: /^\/remote\/custom\/?$/,
				names: [],
				types: [],
				path: "/remote/custom",
				shadow: null,
				a: [0,6,10],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/edit",
				pattern: /^\/remote\/edit\/?$/,
				names: [],
				types: [],
				path: "/remote/edit",
				shadow: null,
				a: [0,6,11],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/image",
				pattern: /^\/remote\/image\/?$/,
				names: [],
				types: [],
				path: "/remote/image",
				shadow: null,
				a: [0,6,12],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/text",
				pattern: /^\/remote\/text\/?$/,
				names: [],
				types: [],
				path: "/remote/text",
				shadow: null,
				a: [0,6,13],
				b: [1,8]
			},
			{
				type: 'page',
				id: "remote/third_party",
				pattern: /^\/remote\/third_party\/?$/,
				names: [],
				types: [],
				path: "/remote/third_party",
				shadow: null,
				a: [0,6,14],
				b: [1,8]
			},
			{
				type: 'page',
				id: "cell/frame/blank",
				pattern: /^\/cell\/frame\/blank\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/blank",
				shadow: null,
				a: [0,3,15,16],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/busy",
				pattern: /^\/cell\/frame\/busy\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/busy",
				shadow: null,
				a: [0,3,15,17],
				b: [1]
			},
			{
				type: 'page',
				id: "cell/frame/clock",
				pattern: /^\/cell\/frame\/clock\/?$/,
				names: [],
				types: [],
				path: "/cell/frame/clock",
				shadow: null,
				a: [0,3,15,18],
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
				a: [0,3,15,19],
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
				a: [0,3,15,20],
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
				a: [0,3,15,21],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
