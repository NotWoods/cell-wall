const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/base.css","img/daphne.jpg","img/jsconf.mp4","img/jsconfbp.png","img/tiger.jpg","logo.png","manifest.webmanifest","maskable_icon.png"]),
	mimeTypes: {".css":"text/css",".jpg":"image/jpeg",".mp4":"video/mp4",".png":"image/png",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.7c33ac23.js","app":"_app/immutable/entry/app.3e3372d1.js","imports":["_app/immutable/entry/start.7c33ac23.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/singletons.b467ccca.js","_app/immutable/chunks/index.5159c792.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.3e3372d1.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-58e53900.js')),
			__memo(() => import('./chunks/1-717ae083.js')),
			__memo(() => import('./chunks/2-ee9f2bcf.js')),
			__memo(() => import('./chunks/3-e2c206d8.js')),
			__memo(() => import('./chunks/4-8a531a90.js')),
			__memo(() => import('./chunks/5-b243115c.js')),
			__memo(() => import('./chunks/6-937cfe0a.js')),
			__memo(() => import('./chunks/7-bfc30dc6.js')),
			__memo(() => import('./chunks/8-5a811392.js')),
			__memo(() => import('./chunks/9-7e44d38e.js')),
			__memo(() => import('./chunks/10-0753f138.js')),
			__memo(() => import('./chunks/11-eb213ebd.js')),
			__memo(() => import('./chunks/12-f175c716.js')),
			__memo(() => import('./chunks/13-f91bf1f1.js')),
			__memo(() => import('./chunks/14-e519b935.js')),
			__memo(() => import('./chunks/15-f089413f.js')),
			__memo(() => import('./chunks/16-8b3fb590.js')),
			__memo(() => import('./chunks/17-06bfad91.js')),
			__memo(() => import('./chunks/18-af93cf95.js')),
			__memo(() => import('./chunks/19-5616ef56.js')),
			__memo(() => import('./chunks/21-964161d3.js')),
			__memo(() => import('./chunks/22-bbb5e906.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/cell",
				pattern: /^\/cell\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/cell/frame/blank",
				pattern: /^\/cell\/frame\/blank\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/cell/frame/busy",
				pattern: /^\/cell\/frame\/busy\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/cell/frame/clock",
				pattern: /^\/cell\/frame\/clock\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/cell/frame/image",
				pattern: /^\/cell\/frame\/image\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/cell/frame/text",
				pattern: /^\/cell\/frame\/text\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/cell/frame/web",
				pattern: /^\/cell\/frame\/web\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/demo",
				pattern: /^\/demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/remote",
				pattern: /^\/remote\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/remote/canvas",
				pattern: /^\/remote\/canvas\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/remote/custom",
				pattern: /^\/remote\/custom\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/remote/edit",
				pattern: /^\/remote\/edit\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/remote/image",
				pattern: /^\/remote\/image\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/remote/text",
				pattern: /^\/remote\/text\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/remote/third_party",
				pattern: /^\/remote\/third_party\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,5,], leaf: 21 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set(["/remote/presets"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
