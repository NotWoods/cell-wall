var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// node_modules/@sveltejs/adapter-node/files/shims.js
import { createRequire } from "module";

// node_modules/@sveltejs/kit/dist/install-fetch.js
import http from "http";
import https from "https";
import zlib from "zlib";
import Stream, { PassThrough, pipeline } from "stream";
import { types } from "util";
import { randomBytes } from "crypto";
import { format } from "url";
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = Stream;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => randomBytes(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = Stream.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof Stream) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof Stream)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof Stream && typeof body.getBoundary !== "function") {
    p1 = new PassThrough({ highWaterMark });
    p2 = new PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof Stream) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return format(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve3, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve3(response2);
      return;
    }
    const send2 = (options2.protocol === "https:" ? https : http).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send2(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve3(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = pipeline(response_, new PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = pipeline(body, zlib.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = pipeline(response_, new PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = pipeline(body, zlib.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = pipeline(body, zlib.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve3(response);
        });
        return;
      }
      if (codings === "br") {
        body = pipeline(body, zlib.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve3(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/adapter-node/files/shims.js
Object.defineProperty(globalThis, "require", {
  enumerable: true,
  value: createRequire(import.meta.url)
});

// .svelte-kit/output/server/app.js
import { google } from "googleapis";
import { ADB } from "appium-adb";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import startCase from "lodash.startcase";
import { Temporal } from "@js-temporal/polyfill";
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler(__spreadProps(__spreadValues({}, request), { params }));
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = __spreadProps(__spreadValues({}, headers), { "content-type": "application/json; charset=utf-8" });
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = __spreadValues({}, opts.headers);
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = __spreadProps(__spreadValues({}, opts.headers), {
                cookie: request.headers.cookie
              });
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text2() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text2;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text2());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: __spreadValues({}, context)
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path2) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path2);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path2.slice(path_match[0].length).split("/") : path2.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            }));
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  }));
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.context) {
          context = __spreadValues(__spreadValues({}, context), loaded.loaded.context);
        }
      }
    }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text2 = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text2();
    case "application/json":
      return JSON.parse(text2());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text2());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text2(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text2) {
  const { data, append } = read_only_form_data();
  text2.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text2, boundary) {
  const parts = text2.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path2 = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path2 + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = __spreadProps(__spreadValues({}, incoming), {
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  });
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function afterUpdate() {
}
var css$3 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\texport let props_3 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}>\\n\\t\\t\\t\\t\\t{#if components[3]}\\n\\t\\t\\t\\t\\t\\t<svelte:component this={components[3]} {...(props_3 || {})}/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</svelte:component>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA2DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css$3);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths2) {
  base = paths2.base;
  assets = paths2.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" type="image/png" href="/logo.png" sizes="192x192" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<link rel="stylesheet" href="/css/base.css" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-b9685f25.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-b9685f25.js", assets + "/_app/chunks/vendor-c77ecffb.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "css/base.css", "size": 293, "type": "text/css" }, { "file": "img/daphne.jpg", "size": 21205, "type": "image/jpeg" }, { "file": "img/tiger.jpg", "size": 17240, "type": "image/jpeg" }, { "file": "logo.png", "size": 7581, "type": "image/png" }, { "file": "manifest.webmanifest", "size": 380, "type": "application/manifest+json" }, { "file": "preset/info.json", "size": 255, "type": "application/json" }, { "file": "preset/tea.json", "size": 539, "type": "application/json" }],
  layout: ".svelte-kit/build/components/layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/oauth2callback\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return oauth2callback;
      })
    },
    {
      type: "page",
      pattern: /^\/remote\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/remote/__layout.svelte", "src/routes/remote/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/remote\/custom\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/remote/__layout.svelte", "src/routes/remote/custom.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/remote\/image\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/remote/__layout.svelte", "src/routes/remote/image.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/remote\/edit\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/remote/__layout.svelte", "src/routes/remote/edit.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/page\/busy\/([^/]+?)\/?$/,
      params: (m) => ({ person: d(m[1]) }),
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/page/__layout.svelte", "src/routes/page/busy/[person].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/page\/text\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/page/__layout.svelte", "src/routes/page/text.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/cellwall-version\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return cellwallVersion;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/third_party\/freebusy\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return freebusy;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/action\/refresh\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return refresh;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index$4;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/power\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index$3;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/power\/([^/]+?)\/?$/,
      params: (m) => ({ serial: d(m[1]) }),
      load: () => Promise.resolve().then(function() {
        return _serial_$2;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/state\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index$2;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/state\/preset\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return preset;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/state\/([^/]+?)\/?$/,
      params: (m) => ({ serial: d(m[1]) }),
      load: () => Promise.resolve().then(function() {
        return _serial_$1;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/device\/([^/]+?)\/?$/,
      params: (m) => ({ serial: d(m[1]) }),
      load: () => Promise.resolve().then(function() {
        return _serial_;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve22 }) => resolve22(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  ".svelte-kit/build/components/layout.svelte": () => Promise.resolve().then(function() {
    return layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/remote/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout$1;
  }),
  "src/routes/remote/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/remote/custom.svelte": () => Promise.resolve().then(function() {
    return custom;
  }),
  "src/routes/remote/image.svelte": () => Promise.resolve().then(function() {
    return image;
  }),
  "src/routes/remote/edit.svelte": () => Promise.resolve().then(function() {
    return edit;
  }),
  "src/routes/page/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/page/busy/[person].svelte": () => Promise.resolve().then(function() {
    return _person_;
  }),
  "src/routes/page/text.svelte": () => Promise.resolve().then(function() {
    return text;
  })
};
var metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "layout.svelte-eacce105.js", "css": [], "js": ["layout.svelte-eacce105.js", "chunks/vendor-c77ecffb.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-6cda78b1.js", "css": [], "js": ["error.svelte-6cda78b1.js", "chunks/vendor-c77ecffb.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-7923e694.js", "css": [], "js": ["pages/index.svelte-7923e694.js", "chunks/vendor-c77ecffb.js"], "styles": [] }, "src/routes/remote/__layout.svelte": { "entry": "pages/remote/__layout.svelte-bded134e.js", "css": [], "js": ["pages/remote/__layout.svelte-bded134e.js", "chunks/vendor-c77ecffb.js"], "styles": [] }, "src/routes/remote/index.svelte": { "entry": "pages/remote/index.svelte-fede2d47.js", "css": ["assets/pages/remote/index.svelte-3d98ee13.css"], "js": ["pages/remote/index.svelte-fede2d47.js", "chunks/vendor-c77ecffb.js", "chunks/Form-b849c358.js", "chunks/_form-52443b97.js"], "styles": [] }, "src/routes/remote/custom.svelte": { "entry": "pages/remote/custom.svelte-fe08e09f.js", "css": [], "js": ["pages/remote/custom.svelte-fe08e09f.js", "chunks/vendor-c77ecffb.js", "chunks/_DeviceOption-fe3247c8.js", "chunks/state-33679332.js", "chunks/Form-b849c358.js", "chunks/_PowerButton-155af822.js", "chunks/_form-52443b97.js"], "styles": [] }, "src/routes/remote/image.svelte": { "entry": "pages/remote/image.svelte-40be2477.js", "css": [], "js": ["pages/remote/image.svelte-40be2477.js", "chunks/vendor-c77ecffb.js", "chunks/_DeviceOption-fe3247c8.js", "chunks/Form-b849c358.js"], "styles": [] }, "src/routes/remote/edit.svelte": { "entry": "pages/remote/edit.svelte-53c12672.js", "css": [], "js": ["pages/remote/edit.svelte-53c12672.js", "chunks/vendor-c77ecffb.js", "chunks/_DeviceOption-fe3247c8.js", "chunks/Form-b849c358.js", "chunks/_PowerButton-155af822.js", "chunks/_form-52443b97.js"], "styles": [] }, "src/routes/page/__layout.svelte": { "entry": "pages/page/__layout.svelte-1936997b.js", "css": [], "js": ["pages/page/__layout.svelte-1936997b.js", "chunks/vendor-c77ecffb.js", "chunks/state-33679332.js"], "styles": [] }, "src/routes/page/busy/[person].svelte": { "entry": "pages/page/busy/[person].svelte-0a2d01f7.js", "css": ["assets/pages/page/busy/[person].svelte-eab96ff7.css"], "js": ["pages/page/busy/[person].svelte-0a2d01f7.js", "chunks/vendor-c77ecffb.js"], "styles": [] }, "src/routes/page/text.svelte": { "entry": "pages/page/text.svelte-e67ba09c.js", "css": ["assets/pages/page/text.svelte-690dba16.css"], "js": ["pages/page/text.svelte-e67ba09c.js", "chunks/vendor-c77ecffb.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond(__spreadProps(__spreadValues({}, request), { host }), options, { prerender: prerender2 });
}
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}
var POWER_BUTTON = 26;
async function checkIfOn(adb, cmdOutput = void 0) {
  var _a;
  const stdout = cmdOutput || await adb.shell(["dumpsys", "power"]);
  const wakefulness = (_a = /mWakefulness=(\w+)/.exec(stdout)) == null ? void 0 : _a[1];
  return wakefulness === "Awake";
}
async function togglePower(adb) {
  await adb.keyevent(POWER_BUTTON);
}
async function startIntent(adb, options2) {
  const { waitForLaunch = true, flags = [], extras = {} } = options2;
  const args = ["am", "start"];
  if (waitForLaunch) {
    args.push("-W");
  }
  if (options2.action) {
    args.push("-a", options2.action);
  }
  if (options2.dataUri) {
    args.push("-d", options2.dataUri);
  }
  if (options2.mimeType) {
    args.push("-t", options2.mimeType);
  }
  if (options2.category) {
    args.push("-c", options2.category);
  }
  if (options2.component) {
    args.push("-n", options2.component);
  }
  for (const flag of flags) {
    args.push("-f", flag);
  }
  for (const [key, extra] of Object.entries(extras)) {
    switch (typeof extra) {
      case "string":
        args.push("--es", key, extra);
        break;
      case "boolean":
        args.push("--ez", key, extra.toString());
        break;
      case "number":
        if (Number.isInteger(extra)) {
          args.push("--ei", key, extra.toString());
        } else {
          args.push("--ef", key, extra.toString());
        }
        break;
      case "object":
      case "undefined":
        if (extra == void 0) {
          args.push("--esn", key);
        } else if (Array.isArray(extra)) {
          const joined = extra.join(",");
          const flag = extra.every((n) => Number.isInteger(n)) ? "--eia" : "--efa";
          args.push(flag, key, joined);
        }
        break;
    }
  }
  let res;
  try {
    res = await adb.shell(args);
  } catch (err) {
    throw new Error(`Error attempting to start intent. Original error: ${err}`);
  }
  if (res.toLowerCase().includes("unable to resolve intent")) {
    throw new Error(res);
  }
}
var DeviceManager = class {
  constructor() {
    this._devices = writable(new Map());
    this.devices.subscribe((map) => {
      this._lastMap = map;
    });
  }
  get devices() {
    return this._devices;
  }
  async refreshDevices() {
    const adbGlobal = await ADB.createADB();
    const devices = await adbGlobal.getConnectedDevices();
    const clients = await Promise.all(devices.map(async (device) => {
      const adb = await ADB.createADB();
      adb.setDevice(device);
      return [device.udid, adb];
    }));
    const result = new Map(clients);
    this._devices.set(result);
    return result;
  }
  async checkIfOn(serial) {
    const adb = this._lastMap.get(serial);
    if (!adb)
      return false;
    return checkIfOn(adb);
  }
  async togglePower(serial) {
    const adb = this._lastMap.get(serial);
    if (!adb)
      return false;
    await togglePower(adb);
    return true;
  }
  async startIntent(serial, options2) {
    const adb = this._lastMap.get(serial);
    if (!adb)
      return false;
    await startIntent(adb, options2);
    return true;
  }
};
function asPower(primitive) {
  switch (primitive) {
    case "toggle":
    case true:
    case false:
      return primitive;
    case "true":
    case "false":
      return Boolean(primitive);
    default:
      return void 0;
  }
}
async function setPowerOne(client, on) {
  const isOn = await checkIfOn(client);
  if (isOn !== on) {
    await togglePower(client);
    return !isOn;
  }
  return on;
}
async function setPower(device, on) {
  if (device instanceof Map) {
    const devices = device;
    let allOn;
    if (on === "toggle") {
      const powerStates = await Promise.all(Array.from(devices.values()).map(async (client) => ({
        on: await checkIfOn(client),
        client
      })));
      const numOn = powerStates.filter((state) => state.on).length;
      const numOff = powerStates.length - numOn;
      allOn = numOn < numOff;
    } else {
      allOn = on;
    }
    await Promise.all(Array.from(devices.values()).map((client) => setPowerOne(client, allOn)));
    return allOn;
  } else {
    return await setPowerOne(device);
  }
}
var CellManager = class {
  constructor() {
    this._info = writable(new Map());
    this._state = writable(new Map());
  }
  get info() {
    return this._info;
  }
  get state() {
    return this._state;
  }
  async loadInfo(db) {
    try {
      const cells = await db.getCells();
      this._info.update((map) => {
        const newMap = new Map(map);
        for (const cell of cells) {
          newMap.set(cell.serial, cell);
        }
        return newMap;
      });
    } catch (err) {
      console.error("Could not load CellManager data", err);
    }
    return this;
  }
  async writeInfo(db) {
    await db.insertCells(Array.from(get_store_value(this.info).values()));
  }
  register(serial, info) {
    this._info.update((map) => new Map(map).set(serial, info));
  }
  setState(serial, state) {
    this._state.update((map) => new Map(map).set(serial, state));
  }
  setStateMap(states2) {
    const entries = typeof states2.entries === "function" ? states2.entries() : Object.entries(states2);
    this._state.update((map) => new Map([...map, ...entries]));
  }
};
function buildCellState(options2) {
  const { type, properties = {}, required = [] } = options2;
  return {
    type: "object",
    properties: __spreadValues({
      type: {
        type: "string",
        enum: [type]
      }
    }, properties),
    required: ["type", ...required]
  };
}
var cellStateBlankSchema = buildCellState({ type: "BLANK" });
var cellStateWebSchema = buildCellState({
  type: "WEB",
  properties: {
    url: { type: "string", format: "uri" }
  },
  required: ["url"]
});
var cellStateTextSchema = buildCellState({
  type: "TEXT",
  properties: {
    text: { type: "string" },
    backgroundColor: { type: "string" }
  },
  required: ["text"]
});
var cellStateImageSchema = buildCellState({
  type: "IMAGE",
  properties: {
    src: { type: "string", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["src"]
});
var allCellStateSchemas = [
  cellStateBlankSchema,
  cellStateImageSchema,
  cellStateTextSchema,
  cellStateWebSchema
];
function getTypeFromSchema(schema) {
  return schema.properties.type.enum[0];
}
var CellStateType;
(function(CellStateType2) {
  CellStateType2["BLANK"] = "BLANK";
  CellStateType2["CONFIGURE"] = "CONFIGURE";
  CellStateType2["TEXT"] = "TEXT";
  CellStateType2["IMAGE"] = "IMAGE";
  CellStateType2["BUTTON"] = "BUTTON";
  CellStateType2["WEB"] = "WEB";
})(CellStateType || (CellStateType = {}));
function blankState() {
  return { type: CellStateType.BLANK };
}
function toUri(state, base2) {
  const _a = state, { type } = _a, props = __objRest(_a, ["type"]);
  switch (type.toUpperCase()) {
    case CellStateType.WEB: {
      const web = props;
      return new URL(web.url, base2).toString();
    }
    case CellStateType.IMAGE: {
      const imgProps = props;
      imgProps.src = new URL(imgProps.src, base2).toString();
    }
    default: {
      const url = new URL(`cellwall://${type}`);
      for (const [key, value] of Object.entries(props)) {
        url.searchParams.append(key, value);
      }
      return url.toString();
    }
  }
}
config();
var VERSION = "4.0.0";
var SERVER_ADDRESS = process.env["SERVER_ADDRESS"];
var PACKAGE_NAME = "com.tigeroakes.cellwall.client";
var GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
var GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"];
var DATABASE_FILENAME = process.env["DATABASE_FILENAME"];
function initializeGoogle(credentials, googleClientId, googleClientServer) {
  const client = new google.auth.OAuth2(googleClientId, googleClientServer, "https://cellwall.tigeroakes.com/oauth2callback");
  if (credentials) {
    console.log("Loading Google authentication from storage");
    client.setCredentials(credentials);
    return { client };
  }
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"]
  });
  return { client, authorizeUrl };
}
async function authenticateGoogle(client, code) {
  const res = await client.getToken(code);
  client.setCredentials(res.tokens);
  return res.tokens;
}
function asArray(items) {
  return Array.isArray(items) ? items : [items];
}
function getAll(map, keys) {
  const result = new Map();
  for (const key of keys) {
    const value = map.get(key);
    if (value !== void 0) {
      result.set(key, value);
    }
  }
  return result;
}
function subscribeToMapStore(store, subscription) {
  let oldMap;
  return store.subscribe((newMap) => {
    subscription(newMap, oldMap);
    oldMap = newMap;
  });
}
function memo(func) {
  let result;
  return function memoized(...args) {
    if (result === void 0) {
      result = func.apply(this, args);
    }
    return result;
  };
}
var __classPrivateFieldSet$3 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet$3 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Writer_instances;
var _Writer_filename;
var _Writer_tempFilename;
var _Writer_locked;
var _Writer_prev;
var _Writer_next;
var _Writer_nextPromise;
var _Writer_nextData;
var _Writer_add;
var _Writer_write;
function getTempFilename(file) {
  return path.join(path.dirname(file), "." + path.basename(file) + ".tmp");
}
var Writer = class {
  constructor(filename) {
    _Writer_instances.add(this);
    _Writer_filename.set(this, void 0);
    _Writer_tempFilename.set(this, void 0);
    _Writer_locked.set(this, false);
    _Writer_prev.set(this, null);
    _Writer_next.set(this, null);
    _Writer_nextPromise.set(this, null);
    _Writer_nextData.set(this, null);
    __classPrivateFieldSet$3(this, _Writer_filename, filename, "f");
    __classPrivateFieldSet$3(this, _Writer_tempFilename, getTempFilename(filename), "f");
  }
  async write(data) {
    return __classPrivateFieldGet$3(this, _Writer_locked, "f") ? __classPrivateFieldGet$3(this, _Writer_instances, "m", _Writer_add).call(this, data) : __classPrivateFieldGet$3(this, _Writer_instances, "m", _Writer_write).call(this, data);
  }
};
_Writer_filename = new WeakMap(), _Writer_tempFilename = new WeakMap(), _Writer_locked = new WeakMap(), _Writer_prev = new WeakMap(), _Writer_next = new WeakMap(), _Writer_nextPromise = new WeakMap(), _Writer_nextData = new WeakMap(), _Writer_instances = new WeakSet(), _Writer_add = function _Writer_add2(data) {
  __classPrivateFieldSet$3(this, _Writer_nextData, data, "f");
  __classPrivateFieldSet$3(this, _Writer_nextPromise, __classPrivateFieldGet$3(this, _Writer_nextPromise, "f") || new Promise((resolve22, reject) => {
    __classPrivateFieldSet$3(this, _Writer_next, [resolve22, reject], "f");
  }), "f");
  return new Promise((resolve22, reject) => {
    var _a;
    (_a = __classPrivateFieldGet$3(this, _Writer_nextPromise, "f")) === null || _a === void 0 ? void 0 : _a.then(resolve22).catch(reject);
  });
}, _Writer_write = async function _Writer_write2(data) {
  var _a, _b;
  __classPrivateFieldSet$3(this, _Writer_locked, true, "f");
  try {
    await fs.promises.writeFile(__classPrivateFieldGet$3(this, _Writer_tempFilename, "f"), data, "utf-8");
    await fs.promises.rename(__classPrivateFieldGet$3(this, _Writer_tempFilename, "f"), __classPrivateFieldGet$3(this, _Writer_filename, "f"));
    (_a = __classPrivateFieldGet$3(this, _Writer_prev, "f")) === null || _a === void 0 ? void 0 : _a[0]();
  } catch (err) {
    (_b = __classPrivateFieldGet$3(this, _Writer_prev, "f")) === null || _b === void 0 ? void 0 : _b[1](err);
    throw err;
  } finally {
    __classPrivateFieldSet$3(this, _Writer_locked, false, "f");
    __classPrivateFieldSet$3(this, _Writer_prev, __classPrivateFieldGet$3(this, _Writer_next, "f"), "f");
    __classPrivateFieldSet$3(this, _Writer_next, __classPrivateFieldSet$3(this, _Writer_nextPromise, null, "f"), "f");
    if (__classPrivateFieldGet$3(this, _Writer_nextData, "f") !== null) {
      const nextData = __classPrivateFieldGet$3(this, _Writer_nextData, "f");
      __classPrivateFieldSet$3(this, _Writer_nextData, null, "f");
      await this.write(nextData);
    }
  }
};
var __classPrivateFieldSet$2 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet$2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TextFile_filename;
var _TextFile_writer;
var TextFile = class {
  constructor(filename) {
    _TextFile_filename.set(this, void 0);
    _TextFile_writer.set(this, void 0);
    __classPrivateFieldSet$2(this, _TextFile_filename, filename, "f");
    __classPrivateFieldSet$2(this, _TextFile_writer, new Writer(filename), "f");
  }
  async read() {
    let data;
    try {
      data = await fs.promises.readFile(__classPrivateFieldGet$2(this, _TextFile_filename, "f"), "utf-8");
    } catch (e) {
      if (e.code === "ENOENT") {
        return null;
      }
      throw e;
    }
    return data;
  }
  write(str) {
    return __classPrivateFieldGet$2(this, _TextFile_writer, "f").write(str);
  }
};
_TextFile_filename = new WeakMap(), _TextFile_writer = new WeakMap();
var __classPrivateFieldSet$1 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet$1 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JSONFile_adapter;
var JSONFile = class {
  constructor(filename) {
    _JSONFile_adapter.set(this, void 0);
    __classPrivateFieldSet$1(this, _JSONFile_adapter, new TextFile(filename), "f");
  }
  async read() {
    const data = await __classPrivateFieldGet$1(this, _JSONFile_adapter, "f").read();
    if (data === null) {
      return null;
    } else {
      return JSON.parse(data);
    }
  }
  write(obj) {
    return __classPrivateFieldGet$1(this, _JSONFile_adapter, "f").write(JSON.stringify(obj, null, 2));
  }
};
_JSONFile_adapter = new WeakMap();
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _Memory_data;
var Memory = class {
  constructor() {
    _Memory_data.set(this, null);
  }
  read() {
    return Promise.resolve(__classPrivateFieldGet(this, _Memory_data, "f"));
  }
  write(obj) {
    __classPrivateFieldSet(this, _Memory_data, obj, "f");
    return Promise.resolve();
  }
};
_Memory_data = new WeakMap();
var MissingAdapterError = class extends Error {
  constructor() {
    super();
    this.message = "Missing Adapter";
  }
};
var Low = class {
  constructor(adapter) {
    Object.defineProperty(this, "adapter", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
    if (adapter) {
      this.adapter = adapter;
    } else {
      throw new MissingAdapterError();
    }
  }
  async read() {
    this.data = await this.adapter.read();
  }
  async write() {
    if (this.data) {
      await this.adapter.write(this.data);
    }
  }
};
async function database(filename) {
  const adapter = filename ? new JSONFile(filename) : new Memory();
  const db = new Low(adapter);
  await db.read();
  function initData() {
    return db.data || (db.data = { cells: {} });
  }
  return {
    async getGoogleCredentials() {
      var _a;
      return (_a = db.data) == null ? void 0 : _a.googleCredentials;
    },
    async setGoogleCredentials(credentials) {
      initData().googleCredentials = credentials;
      await db.write();
    },
    async getCell(name) {
      var _a, _b;
      return (_b = (_a = db.data) == null ? void 0 : _a.cells) == null ? void 0 : _b[name];
    },
    async getCells() {
      return Object.values(initData().cells);
    },
    async insertCell(cell) {
      initData().cells[cell.serial] = cell;
      await db.write();
    },
    async insertCells(cells) {
      const data = initData();
      for (const cell of cells) {
        data.cells[cell.serial] = cell;
      }
      await db.write();
    }
  };
}
function sendIntentOnStateChange(cellManager, deviceManager) {
  subscribeToMapStore(cellManager.state, (newStates, oldStates) => {
    const changes = new Map(newStates);
    if (oldStates) {
      for (const [serial, state] of oldStates) {
        if (changes.get(serial) === state) {
          changes.delete(serial);
        }
      }
    }
    const info = get_store_value(cellManager.info);
    Promise.all(Array.from(changes).map(([serial, state]) => {
      var _a;
      console.log(serial, state);
      const base2 = ((_a = info.get(serial)) == null ? void 0 : _a.server) || SERVER_ADDRESS;
      return deviceManager.startIntent(serial, {
        action: `${PACKAGE_NAME}.DISPLAY`,
        dataUri: toUri(state, base2).replace(/&/g, "\\&").replace(/'/g, "%27")
      });
    }));
  });
}
function deriveCellInfo(cellManager, deviceManager) {
  return derived([cellManager.info, cellManager.state, deviceManager.devices], ([infoMap, states2, devices]) => {
    const cellInfoMap = new Map();
    for (const [serial, info] of infoMap) {
      cellInfoMap.set(serial, { serial, info, connected: false });
    }
    for (const [serial, state] of states2) {
      const existing = cellInfoMap.get(serial);
      if (existing) {
        existing.state = state;
      } else {
        cellInfoMap.set(serial, { serial, state, connected: false });
      }
    }
    for (const serial of devices.keys()) {
      const existing = cellInfoMap.get(serial);
      if (existing) {
        existing.connected = true;
      } else {
        cellInfoMap.set(serial, { serial, connected: true });
      }
    }
    return cellInfoMap;
  }, new Map());
}
function repository() {
  const dbPromise = database(DATABASE_FILENAME);
  const deviceManager = new DeviceManager();
  let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
  const cellManager = new CellManager();
  const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));
  sendIntentOnStateChange(cellManager, deviceManager);
  const cellData = deriveCellInfo(cellManager, deviceManager);
  const googleApi = memo(async function googleApi2() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error(`Missing Google API keys`);
    }
    const db = await dbPromise;
    const credentials = await db.getGoogleCredentials();
    const googleClient = initializeGoogle(credentials, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    if (googleClient.authorizeUrl) {
      console.log(`
---
Authenticate with Google:
${googleClient.authorizeUrl}
---
`);
    }
    return googleClient;
  });
  return {
    cellData,
    cellDataJson: derived(cellData, (map) => JSON.stringify(Object.fromEntries(map))),
    refreshDevices() {
      const refreshPromise = deviceManager.refreshDevices();
      deviceManagerPromise = refreshPromise.then(() => deviceManager);
      return refreshPromise;
    },
    googleApi,
    async authenticateGoogleApi(code) {
      const db = await dbPromise;
      const googleClient = await googleApi();
      const credentials = await authenticateGoogle(googleClient.client, code);
      await db.setGoogleCredentials(credentials);
    },
    async getPower(serial) {
      const deviceManager2 = await deviceManagerPromise;
      return deviceManager2.checkIfOn(serial);
    },
    async setPower(serial, on) {
      const deviceManager2 = await deviceManagerPromise;
      const devices = get_store_value(deviceManager2.devices);
      const serialList = asArray(serial);
      return setPower(getAll(devices, serialList), on);
    },
    async setState(serial, state) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.setState(serial, state);
    },
    async setStates(states2) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.setStateMap(states2);
    },
    async registerCell(info) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.register(info.serial, info);
      const db = await dbPromise;
      await cellManager2.writeInfo(db);
    }
  };
}
var repo = repository();
globalThis._repo = repo;
var get$7 = async function get2({ query }) {
  const code = query.get("code");
  if (!code) {
    return {
      status: 400,
      error: new Error("Missing code")
    };
  }
  await repo.authenticateGoogleApi(code);
  return {
    body: "Authentication successful! Please return to the console."
  };
};
var oauth2callback = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$7
});
var get$6 = async function get22() {
  return {
    body: { version: VERSION }
  };
};
var cellwallVersion = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$6
});
function bodyType({ headers, body }) {
  const [type] = (headers["content-type"] || "").split(/;\s*/);
  switch (type) {
    case "text/plain":
      if (typeof body === "string") {
        return { type: "text", body };
      } else {
        throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
      }
    case "application/json":
      return { type: "json", body };
    case "application/x-www-form-urlencoded":
    case "multipart/form-data":
      if (typeof body === "string" || body === null || body instanceof Uint8Array) {
        throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
      } else {
        return { type: "form", body };
      }
    default:
      if (body === null) {
        return { type: "null", body };
      } else if (body instanceof Uint8Array) {
        return { type: "raw", body };
      } else {
        throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
      }
  }
}
function isObject(maybe) {
  return typeof maybe === "object" && maybe !== null;
}
function bodyAsJson(input) {
  const body = bodyType(input);
  switch (body.type) {
    case "json":
      return body.body;
    case "text":
      return JSON.parse(body.body);
    case "form":
      return Object.fromEntries(body.body.entries());
    default:
      return void 0;
  }
}
var post$8 = async function post2(input) {
  const { client } = await repo.googleApi();
  const requestBody = bodyAsJson(input);
  if (!requestBody) {
    return {
      status: 400,
      error: `Request body should be JSON`
    };
  }
  const api = google.calendar({ version: "v3", auth: client });
  const res = await api.freebusy.query({
    requestBody
  });
  if (res.status < 200 || res.status >= 300) {
    return {
      status: res.status,
      error: new Error(`Could not load calendar, ${res.statusText}`)
    };
  }
  const { errors, busy } = Object.values(res.data.calendars)[0];
  if (errors && errors.length > 0) {
    return {
      status: 500,
      error: new Error(errors.map((error2) => error2.reason).join())
    };
  }
  return {
    status: res.status,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(busy)
  };
};
var freebusy = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  post: post$8
});
var post$7 = async function post22() {
  const devices = await repo.refreshDevices();
  return {
    body: Array.from(devices.keys())
  };
};
var refresh = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  post: post$7
});
var get$5 = async function get23() {
  return {
    body: JSON.stringify(Object.fromEntries(get_store_value(repo.cellData)))
  };
};
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$5
});
function transformMap(map, transform) {
  return new Map(Array.from(map.entries(), ([key, value]) => {
    return [key, transform(value, key)];
  }));
}
async function transformMapAsync(map, transform) {
  return new Map(await Promise.all(Array.from(map.entries(), async ([key, value]) => {
    return [key, await transform(value, key)];
  })));
}
function isRawBody(maybeRaw) {
  return maybeRaw === null || maybeRaw instanceof Uint8Array;
}
function asCellState(maybeState) {
  if (isObject(maybeState)) {
    const state = maybeState;
    if (state.type in CellStateType) {
      return state;
    }
  }
  return void 0;
}
function parsePowerBody(body) {
  if (typeof body === "string") {
    const json = JSON.parse(body);
    if (typeof json === "boolean" || typeof json === "string") {
      return asPower(json);
    } else if (typeof json === "object" && json !== null) {
      const { on } = json;
      return asPower(on);
    }
  } else if (!isRawBody(body)) {
    return asPower(body.get("on"));
  }
  return void 0;
}
var get$4 = async function get24() {
  return {
    body: {
      devices: Object.entries(await transformMapAsync(get_store_value(repo.cellData), (_data, serial) => repo.getPower(serial)))
    }
  };
};
var post$6 = async function post23({ body }) {
  const power = parsePowerBody(body);
  if (power === void 0) {
    return {
      status: 400,
      error: new Error(`Invalid body ${body}`)
    };
  }
  const serials = Array.from(get_store_value(repo.cellData).keys());
  return {
    body: await repo.setPower(serials, power)
  };
};
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$4,
  post: post$6
});
var get$3 = async function get25({ params }) {
  const { serial } = params;
  return {
    body: {
      devices: {
        [serial]: await repo.getPower(serial)
      }
    }
  };
};
var post$5 = async function post24({ params, body }) {
  const { serial } = params;
  const power = parsePowerBody(body);
  if (power === void 0) {
    return {
      status: 400,
      error: new Error(`Invalid body ${body}`)
    };
  }
  return {
    body: await repo.setPower(serial, power)
  };
};
var _serial_$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$3,
  post: post$5
});
var get$2 = async function get26() {
  return {
    body: Object.entries(transformMap(get_store_value(repo.cellData), (data) => {
      var _a;
      return (_a = data.state) != null ? _a : blankState();
    }))
  };
};
var post$4 = async function post25({ body }) {
  if (typeof body !== "string") {
    return {
      status: 400,
      error: new Error(`Invalid body ${body}`)
    };
  }
  const states2 = JSON.parse(body);
  await repo.setStates(states2);
  return {
    body: Object.keys(states2)
  };
};
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$2,
  post: post$4
});
var post$3 = async function post26({
  host,
  body
}) {
  const preset2 = body.get("preset");
  const presetResponse = await fetch(`https://${host}${assets}/preset/${preset2}.json`);
  const presetStates = await presetResponse.json();
  await repo.setStates(presetStates);
  return {
    body: Object.keys(presetStates)
  };
};
var preset = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  post: post$3
});
var get$1 = async function get27({ params }) {
  var _a, _b;
  const { serial } = params;
  return {
    body: JSON.stringify({
      [serial]: (_b = (_a = get_store_value(repo.cellData).get(serial)) == null ? void 0 : _a.state) != null ? _b : blankState()
    })
  };
};
var post$2 = async function post27(input) {
  const { serial } = input.params;
  const state = asCellState(bodyAsJson(input));
  if (!state) {
    return {
      status: 400,
      error: new Error(`Invalid body ${input.body}`)
    };
  }
  await repo.setState(serial, state);
  return {
    body: [serial]
  };
};
var _serial_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1,
  post: post$2
});
var get = async function get28({ params }) {
  var _a;
  const { serial } = params;
  return {
    body: JSON.stringify((_a = get_store_value(repo.cellData).get(serial)) != null ? _a : null)
  };
};
var post$1 = async function post28(input) {
  const { serial } = input.params;
  const info = bodyAsJson(input);
  if (!info) {
    return {
      status: 400,
      error: new Error(`Invalid body ${input.body}`)
    };
  }
  info.serial = serial;
  await repo.registerCell(info);
  return {
    body: [serial]
  };
};
var _serial_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get,
  post: post$1
});
var Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Layout
});
function load$5({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$5
});
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var load$4 = () => __awaiter$1(void 0, void 0, void 0, function* () {
  return { status: 301, redirect: "/remote/" };
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `Authentication successful! Please return to the console.`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$4
});
var _layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let open = false;
  return `${$$result.head += `${$$result.title = `<title>CellWall Remote</title>`, ""}<link rel="${"stylesheet"}" href="${"https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css"}" data-svelte="svelte-1nhegv1"><link rel="${"manifest"}" href="${"/manifest.webmanifest"}" data-svelte="svelte-1nhegv1">`, ""}

<nav class="${"navbar"}" role="${"navigation"}" aria-label="${"main navigation"}"><div class="${"navbar-brand"}"><a class="${"navbar-item"}" href="${"https://github.com/NotWoods/cell-wall"}"><img src="${"/logo.png"}" alt="${""}" width="${"28"}" height="${"28"}">
			<span style="${"margin-left: 0.5rem"}">CellWall Remote</span></a>

		
		<a role="${"button"}" class="${["navbar-burger burger", ""].join(" ").trim()}" aria-label="${"menu"}"${add_attribute("aria-expanded", open, 0)} data-target="${"navMenu"}"><span aria-hidden="${"true"}"></span>
			<span aria-hidden="${"true"}"></span>
			<span aria-hidden="${"true"}"></span></a></div>

	<div id="${"navMenu"}" class="${["navbar-menu", ""].join(" ").trim()}"><div class="${"navbar-start"}"><a class="${"navbar-item"}" href="${"/remote/"}">Preset </a>
			<a class="${"navbar-item"}" href="${"/remote/image"}">Image </a>
			<a class="${"navbar-item"}" href="${"/remote/custom"}">Custom </a></div>
		<div class="${"navbar-end"}"><a class="${"navbar-item"}" href="${"/remote/edit"}">Edit </a></div></div></nav>

<main class="${"section"}"><div class="${"container"}">${slots.default ? slots.default({}) : ``}</div></main>`;
});
var __layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout$1
});
var Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { action } = $$props;
  let { onSubmit } = $$props;
  let form;
  let loading = Promise.resolve();
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.onSubmit === void 0 && $$bindings.onSubmit && onSubmit !== void 0)
    $$bindings.onSubmit(onSubmit);
  return `<form method="${"post"}"${add_attribute("action", action, 0)}${add_attribute("this", form, 0)}>${slots.default ? slots.default({ loading }) : ``}</form>`;
});
async function post(action, body) {
  try {
    const res = await fetch(action, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function formDataAsSearchParams(formData) {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    if (typeof value === "string") {
      params.append(key, value);
    }
  }
  return params;
}
var css$2 = {
  code: "article.svelte-dvwrrs{display:flex;flex-direction:column}.buttons.svelte-dvwrrs{margin-top:auto}",
  map: '{"version":3,"file":"_PresetCard.svelte","sources":["_PresetCard.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let title;\\nexport let preset;\\n<\/script>\\n\\n<article class=\\"tile is-child box\\">\\n\\t<p class=\\"title\\">{title}</p>\\n\\t<p class=\\"subtitle\\">\\n\\t\\t<slot />\\n\\t</p>\\n\\t<div class=\\"buttons is-right\\">\\n\\t\\t<button type=\\"submit\\" name=\\"preset\\" value={preset} class=\\"button is-outlined\\">Activate</button>\\n\\t</div>\\n</article>\\n\\n<style>\\n\\tarticle {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t}\\n\\n\\t.buttons {\\n\\t\\tmargin-top: auto;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAeC,OAAO,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACvB,CAAC,AAED,QAAQ,cAAC,CAAC,AACT,UAAU,CAAE,IAAI,AACjB,CAAC"}'
};
var PresetCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { preset: preset2 } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.preset === void 0 && $$bindings.preset && preset2 !== void 0)
    $$bindings.preset(preset2);
  $$result.css.add(css$2);
  return `<article class="${"tile is-child box svelte-dvwrrs"}"><p class="${"title"}">${escape(title)}</p>
	<p class="${"subtitle"}">${slots.default ? slots.default({}) : ``}</p>
	<div class="${"buttons is-right svelte-dvwrrs"}"><button type="${"submit"}" name="${"preset"}"${add_attribute("value", preset2, 0)} class="${"button is-outlined"}">Activate</button></div>
</article>`;
});
var prerender$1 = true;
var Remote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  function submit(data, action) {
    return __awaiter2(this, void 0, void 0, function* () {
      const res = yield fetch(action.toString(), {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formDataAsSearchParams(data)
      });
      console.log(yield res.json());
    });
  }
  return `${validate_component(Form, "Form").$$render($$result, {
    action: "/api/device/state/preset",
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => `${function(__value) {
      if (is_promise(__value))
        return `
		<progress class="${"progress is-small is-primary"}" max="${"100"}">Loading</progress>
	`;
      return function(res) {
        return `
		<progress class="${"progress is-small is-primary"}"${add_attribute("value", res != void 0 ? "100" : "0", 0)} max="${"100"}">Done</progress>
	`;
      }(__value);
    }(loading)}

	<div class="${"tile is-ancestor"}"><div class="${"tile is-parent is-vertical"}">${validate_component(PresetCard, "PresetCard").$$render($$result, { title: "Info", preset: "info" }, {}, {
      default: () => `Calendar indicators and the week&#39;s weather.`
    })}
			${validate_component(PresetCard, "PresetCard").$$render($$result, { title: "Tea list", preset: "tea" }, {}, {
      default: () => `What&#39;s avaliable to drink?`
    })}</div>
		<div class="${"tile is-parent"}"><article class="${"tile is-child notification"}"><figure class="${"image"}"><img alt="${""}" src="${"https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg"}"></figure>
				<div class="${"field"}"><label class="${"label"}" for="${"control-rest"}">Remaining cells</label>
					<div class="${"control"}"><div class="${"select"}"><select id="${"control-rest"}" name="${"rest"}"><option value="${"ignore"}">Ignore</option><option value="${"blank"}">Blank</option><option value="${"off"}">Off</option></select></div></div></div></article></div></div>`
  })}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Remote,
  prerender: prerender$1
});
function createLoadWithDevices() {
  return async ({ fetch: fetch2 }) => {
    const res = await fetch2(`/api/device`);
    if (res.ok) {
      return {
        props: {
          devices: Object.values(await res.json())
        }
      };
    } else {
      return {
        status: res.status,
        error: new Error(`Could not load devices, ${res.statusText}`)
      };
    }
  };
}
var SubmitButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { loading } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  return `<p class="${"control"}">${function(__value) {
    if (is_promise(__value))
      return `
		<button type="${"submit"}" class="${"button is-primary is-loading"}">Loading</button>
	`;
    return function(_) {
      return `
		<button type="${"submit"}" class="${"button is-primary"}">Submit</button>
	`;
    }();
  }(loading)}</p>`;
});
var Field = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { label } = $$props;
  let { htmlFor = void 0 } = $$props;
  let { narrow = false } = $$props;
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.htmlFor === void 0 && $$bindings.htmlFor && htmlFor !== void 0)
    $$bindings.htmlFor(htmlFor);
  if ($$props.narrow === void 0 && $$bindings.narrow && narrow !== void 0)
    $$bindings.narrow(narrow);
  return `<div class="${"field is-horizontal"}"><div class="${"field-label is-normal"}"><label class="${"label"}"${add_attribute("for", htmlFor, 0)}>${escape(label)}</label></div>
	<div class="${"field-body"}"><div class="${["field", narrow ? "is-narrow" : ""].join(" ").trim()}"><div class="${"control"}">${slots.default ? slots.default({}) : ``}</div></div></div></div>`;
});
function getInputType(name, property) {
  if (Array.isArray(property.enum))
    return "select";
  if (name.endsWith("Color"))
    return "color";
  if (property.format === "uri")
    return "url";
  switch (property.type) {
    case "number":
      return "number";
    default:
      return "text";
  }
}
var ControllerFields = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let required;
  let properties;
  function getInputName(name) {
    switch (name) {
      case "url":
        return "URL";
      case "src":
        return "Source";
      default:
        return startCase(name);
    }
  }
  let { schema } = $$props;
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  required = new Set((schema === null || schema === void 0 ? void 0 : schema.required) || []);
  properties = Object.entries((schema === null || schema === void 0 ? void 0 : schema.properties) || {}).filter(([name]) => name !== "type").map(([name, property]) => ({
    name,
    property,
    type: getInputType(name, property)
  }));
  return `${each(properties, ({ name, type, property }) => `${validate_component(Field, "Field").$$render($$result, {
    htmlFor: "control-" + name,
    label: getInputName(name),
    narrow: type === "color"
  }, {}, {
    default: () => `${Array.isArray(property.enum) ? `<div class="${"select"}"><select id="${"control-" + escape(name)}"${add_attribute("name", name, 0)}>${each(property.enum, (option) => `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`)}</select>
			</div>` : `<input id="${"control-" + escape(name)}" class="${"input"}"${add_attribute("name", name, 0)}${add_attribute("type", type, 0)} ${required.has(name) ? "required" : ""}>`}
	`
  })}`)}`;
});
var PowerButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function(thisArg, _arguments, P, generator) {
    function adopt(value2) {
      return value2 instanceof P ? value2 : new P(function(resolve22) {
        resolve22(value2);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value2) {
        try {
          step(generator.next(value2));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value2) {
        try {
          step(generator["throw"](value2));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { serial } = $$props;
  let { value } = $$props;
  const props = {
    type: "button",
    name: "on",
    value: value.toString()
  };
  let loading = Promise.resolve();
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `${function(__value) {
    if (is_promise(__value))
      return `
	<button${spread([escape_object(props), { class: "button is-loading" }])}>${slots.default ? slots.default({}) : ``}</button>
`;
    return function(_) {
      return `
	<button${spread([escape_object(props), { class: "button" }])}>${slots.default ? slots.default({}) : ``}</button>
`;
    }();
  }(loading)}`;
});
var TypeTab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let type;
  let typeName;
  createEventDispatcher();
  let { selected } = $$props;
  let { schema } = $$props;
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  type = getTypeFromSchema(schema);
  typeName = startCase(type.toLocaleLowerCase());
  return `<li${add_classes([type === selected ? "is-active" : ""].join(" ").trim())}>
	<a${add_attribute("data-type", type, 0)}>${escape(typeName)}</a></li>`;
});
var DeviceOption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let { device } = $$props;
  if ($$props.device === void 0 && $$bindings.device && device !== void 0)
    $$bindings.device(device);
  return `<option${add_attribute("value", device.serial, 0)} ${!device.connected ? "disabled" : ""}>${escape(((_a = device.info) == null ? void 0 : _a.deviceName) || device.serial)}</option>`;
});
var load$3 = createLoadWithDevices();
var Custom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let activeSchema;
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { devices } = $$props;
  let selectedType = "BLANK";
  let selectedDevice = "";
  function submit(formData, action) {
    return __awaiter2(this, void 0, void 0, function* () {
      const data = Object.fromEntries(formData);
      yield post(action.toString(), Object.assign(Object.assign({}, data), { type: selectedType }));
    });
  }
  if ($$props.devices === void 0 && $$bindings.devices && devices !== void 0)
    $$bindings.devices(devices);
  activeSchema = allCellStateSchemas.find((schema) => getTypeFromSchema(schema) === selectedType);
  return `<nav class="${"tabs is-centered"}"><ul>${each(allCellStateSchemas, (schema) => `${validate_component(TypeTab, "TypeTab").$$render($$result, { selected: selectedType, schema }, {}, {})}`)}</ul></nav>

${validate_component(Form, "Form").$$render($$result, {
    action: "/v3/device/state/" + selectedDevice,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => `${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-serial",
      label: "Device"
    }, {}, {
      default: () => `<div class="${"select"}"><select id="${"control-serial"}"><option value="${""}">All devices</option>${each(devices, (device) => `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`)}</select></div>`
    })}

	<div class="${"field is-horizontal"}"><div class="${"field-label is-normal"}"><span class="${"label"}">Power</span></div>
		<div class="${"field-body"}"><div class="${"buttons has-addons"}">${validate_component(PowerButton, "PowerButton").$$render($$result, { serial: selectedDevice, value: false }, {}, { default: () => `Off` })}
				${validate_component(PowerButton, "PowerButton").$$render($$result, { serial: selectedDevice, value: true }, {}, { default: () => `On` })}</div></div></div>

	${validate_component(ControllerFields, "ControllerFields").$$render($$result, { schema: activeSchema }, {}, {})}

	<div class="${"field is-grouped is-grouped-right"}" style="${"margin-top: 3rem"}"><p class="${"control"}"><button type="${"reset"}" class="${"button is-light"}">Reset</button></p>
		${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`
  })}`;
});
var custom = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Custom,
  load: load$3
});
var load$2 = createLoadWithDevices();
var Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { devices } = $$props;
  let fileName = "";
  function submit(data, action) {
    return __awaiter2(this, void 0, void 0, function* () {
      const image2 = data.get("image");
      data.delete("image");
      for (const [key, value] of data) {
        action.searchParams.append(key, value);
      }
      try {
        const res = yield fetch(action.toString(), {
          method: "post",
          headers: { "content-type": image2.type },
          body: image2
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    });
  }
  if ($$props.devices === void 0 && $$bindings.devices && devices !== void 0)
    $$bindings.devices(devices);
  return `${validate_component(Form, "Form").$$render($$result, {
    action: "/v3/action/image",
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => `${validate_component(Field, "Field").$$render($$result, { htmlFor: "control-image", label: "Image" }, {}, {
      default: () => `<div class="${"file has-name"}"><label class="${"file-label"}"><input class="${"file-input"}" type="${"file"}" required accept="${"image/*"}" name="${"image"}">
				<span class="${"file-cta"}"><span class="${"file-icon"}"><svg width="${"24"}" height="${"24"}" viewBox="${"4 3 18 17"}" style="${"fill: currentColor"}"><path d="${"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"}"></path></svg></span>
					<span class="${"file-label"}">Choose a file\u2026 </span></span>
				<span class="${"file-name"}">${escape(fileName)}</span></label></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-serial",
      label: "Devices"
    }, {}, {
      default: () => `<div class="${"select is-multiple"}"><select multiple name="${"device"}" id="${"control-serial"}">${each(devices, (device) => `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`)}</select></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-hozalign",
      label: "Horizontal Alignment"
    }, {}, {
      default: () => `<div class="${"select"}"><select id="${"control-hozalign"}" name="${"horizontalAlign"}"><option value="${"center"}">Center</option><option value="${"left"}">Left</option><option value="${"right"}">Right</option></select></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-veralign",
      label: "Vertical Alignment"
    }, {}, {
      default: () => `<div class="${"select"}"><select id="${"control-veralign"}" name="${"verticalAlign"}"><option value="${"middle"}">Middle</option><option value="${"top"}">Top</option><option value="${"bottom"}">Bottom</option></select></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-resize",
      label: "Resize Mode"
    }, {}, {
      default: () => `<div class="${"select"}"><select id="${"control-resize"}" name="${"resize"}"><option value="${"bilinearInterpolation"}">Bilinear</option><option value="${"bicubicInterpolation"}">Bicubic</option><option value="${"hermiteInterpolation"}">Hermite</option><option value="${"bezierInterpolation"}">Bezier</option><option value="${"nearestNeighbor"}">Nearest Neighbor</option></select></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-rest",
      label: "Remaining Cells"
    }, {}, {
      default: () => `<div class="${"select"}"><select id="${"control-rest"}" name="${"rest"}"><option value="${"ignore"}">Ignore</option><option value="${"blank"}">Blank</option><option value="${"off"}">Off</option></select></div>`
    })}

	<div class="${"field is-grouped is-grouped-right"}" style="${"margin-top: 3rem"}"><p class="${"control"}"><button type="${"reset"}" class="${"button is-light"}">Reset</button></p>
		${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`
  })}`;
});
var image = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Image,
  load: load$2
});
var load$1 = createLoadWithDevices();
var Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedCell;
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var _a;
  let { devices } = $$props;
  let selectedDeviceSerial = (_a = devices[0]) === null || _a === void 0 ? void 0 : _a.serial;
  function submit(formData, action) {
    return __awaiter2(this, void 0, void 0, function* () {
      const res = yield fetch(action.toString(), {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formDataAsSearchParams(formData)
      });
      console.log(yield res.json());
    });
  }
  if ($$props.devices === void 0 && $$bindings.devices && devices !== void 0)
    $$bindings.devices(devices);
  selectedCell = devices.find((cell) => cell.serial === selectedDeviceSerial);
  return `${validate_component(Form, "Form").$$render($$result, {
    action: "/api/device/" + selectedDeviceSerial,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => `${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-serial",
      label: "Device"
    }, {}, {
      default: () => `<div class="${"select"}"><select name="${"serial"}" id="${"control-serial"}">${each(devices, (device) => `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`)}</select></div>`
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-connected",
      label: "Connected"
    }, {}, {
      default: () => {
        var _a2;
        return `<input type="${"checkbox"}" id="${"control-connected"}" name="${"connected"}" disabled ${((_a2 = selectedCell == null ? void 0 : selectedCell.connected) != null ? _a2 : false) ? "checked" : ""}>`;
      }
    })}

	<div class="${"field is-horizontal"}"><div class="${"field-label is-normal"}"><span class="${"label"}">Power</span></div>
		<div class="${"field-body"}"><div class="${"buttons has-addons"}">${validate_component(PowerButton, "PowerButton").$$render($$result, {
      serial: selectedDeviceSerial,
      value: false
    }, {}, { default: () => `Off` })}
				${validate_component(PowerButton, "PowerButton").$$render($$result, {
      serial: selectedDeviceSerial,
      value: true
    }, {}, { default: () => `On` })}</div></div></div>

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-deviceName",
      label: "Device Name"
    }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-deviceName"}" class="${"input"}" name="${"deviceName"}" type="${"text"}"${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.deviceName) != null ? _b : "", 0)}>`;
      }
    })}

	${validate_component(Field, "Field").$$render($$result, { htmlFor: "control-width", label: "Width" }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-width"}" class="${"input"}" name="${"width"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.width) != null ? _b : "", 0)}>`;
      }
    })}
	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-height",
      label: "Height"
    }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-height"}" class="${"input"}" name="${"height"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.height) != null ? _b : "", 0)}>`;
      }
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-x",
      label: "X Position"
    }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-x"}" class="${"input"}" name="${"x"}" type="${"number"}"${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.x) != null ? _b : "", 0)}>`;
      }
    })}
	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-y",
      label: "Y Position"
    }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-y"}" class="${"input"}" name="${"y"}" type="${"number"}"${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.y) != null ? _b : "", 0)}>`;
      }
    })}

	${validate_component(Field, "Field").$$render($$result, {
      htmlFor: "control-server",
      label: "Asset Server"
    }, {}, {
      default: () => {
        var _a2, _b;
        return `<input id="${"control-server"}" class="${"input"}" name="${"server"}" type="${"url"}"${add_attribute("value", (_b = (_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.server) != null ? _b : "", 0)}>`;
      }
    })}

	<div class="${"field is-grouped is-grouped-right"}" style="${"margin-top: 3rem"}">${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`
  })}`;
});
var edit = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Edit,
  load: load$1
});
function socketStore(url, defaultValue) {
  {
    return readable(defaultValue);
  }
}
var ws = derived(socketStore("ws://localhost:3000", "{}"), (json) => JSON.parse(json));
function stateToUrl({ state, info } = {}) {
  switch (state === null || state === void 0 ? void 0 : state.type) {
    case CellStateType.WEB:
      return new URL(state.url, info === null || info === void 0 ? void 0 : info.server);
    default:
      return void 0;
  }
}
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cellData;
  let href;
  let $ws, $$unsubscribe_ws;
  $$unsubscribe_ws = subscribe(ws, (value) => $ws = value);
  var _a, _b;
  let { serial } = $$props;
  let anchor;
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  cellData = $ws[serial];
  href = (_b = (_a = stateToUrl(cellData)) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : "#";
  {
    {
      console.log(cellData);
    }
  }
  $$unsubscribe_ws();
  return `<a hidden${add_attribute("href", href, 0)}${add_attribute("this", anchor, 0)}>Refresh</a>

${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function convert(range) {
  function fromTimeStamp(timestamp) {
    if (timestamp) {
      return Temporal.Instant.from(timestamp).toZonedDateTimeISO("UTC");
    } else {
      return void 0;
    }
  }
  return {
    start: fromTimeStamp(range.start),
    end: fromTimeStamp(range.end)
  };
}
function isBusy(time, ranges) {
  for (const range of ranges) {
    const { start, end } = range;
    if (start && Temporal.ZonedDateTime.compare(time, start) < 0) {
      return { busy: false, next: range.start };
    } else if (!end || Temporal.ZonedDateTime.compare(time, end) <= 0) {
      return { busy: true, next: range.end };
    } else {
      continue;
    }
  }
  return { busy: false, next: void 0 };
}
function isBusyInterval(ranges, callback) {
  const dateTimeRanges = ranges.map(convert);
  function checkBusy() {
    const now = Temporal.Now.zonedDateTimeISO("UTC");
    const { busy, next } = isBusy(now, dateTimeRanges);
    callback(busy);
    if (next) {
      const duration = now.until(next);
      console.log(`Waiting until ${duration}`);
      const ms = duration.total({ unit: "milliseconds" });
      setTimeout(checkBusy, Math.max(ms, 1e3));
    }
  }
  checkBusy();
}
var css$1 = {
  code: "body.svelte-8rd6l6{display:flex;flex-direction:column;justify-content:center}.profile.svelte-8rd6l6{display:block;border-radius:50%}",
  map: `{"version":3,"file":"[person].svelte","sources":["[person].svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { Temporal } from '@js-temporal/polyfill';\\nimport { isBusyInterval } from './_range';\\nconst people = {\\n    tiger: {\\n        name: 'Tiger',\\n        image: '/assets/img/tiger.jpg',\\n        calendar: 'tigeroakes@gmail.com'\\n    },\\n    daphne: {\\n        name: 'Daphne',\\n        image: '/assets/img/daphne.jpg',\\n        calendar: 'daphne.liu97@gmail.com'\\n    }\\n};\\nconst states = {\\n    free: {\\n        text: 'Free',\\n        background: '#262626'\\n    },\\n    busy: {\\n        text: 'Busy',\\n        background: '#d87220'\\n    }\\n};\\nfunction isPerson(person) {\\n    return person in people;\\n}\\nexport const load = ({ page }) => __awaiter(void 0, void 0, void 0, function* () {\\n    const { person } = page.params;\\n    if (!isPerson(person)) {\\n        return {\\n            status: 404,\\n            error: new Error(\`No matching data for \${person}\`)\\n        };\\n    }\\n    const today = Temporal.Now.zonedDateTimeISO('UTC').startOfDay();\\n    const nextWeek = today.add({ days: 5 });\\n    const toStringOptions = {\\n        timeZoneName: 'never',\\n        smallestUnit: 'second'\\n    };\\n    const body = {\\n        timeMin: today.toString(toStringOptions),\\n        timeMax: nextWeek.toString(toStringOptions),\\n        items: [{ id: people[person].calendar }]\\n    };\\n    const res = yield fetch('/api/third_party/freebusy', {\\n        method: 'post',\\n        headers: {\\n            'Content-Type': 'application/json'\\n        },\\n        body: JSON.stringify(body)\\n    });\\n    if (!res.ok) {\\n        return {\\n            status: res.status,\\n            error: new Error(\`Could not load calendar, \${res.statusText}\`)\\n        };\\n    }\\n    const busy = yield res.json();\\n    return {\\n        props: {\\n            name: person,\\n            busyRanges: busy\\n        }\\n    };\\n});\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let busyRanges;\\nexport let name;\\n$: person = people[name];\\nlet stateName = 'free';\\n$: state = states[stateName];\\nisBusyInterval(busyRanges, (isBusy) => {\\n    stateName = isBusy ? 'busy' : 'free';\\n});\\n<\/script>\\n\\n<body style=\\"background: {state.background}\\">\\n\\t<img\\n\\t\\tclass=\\"profile\\"\\n\\t\\talt=\\"Portrait of \${person.name}\\"\\n\\t\\tsrc=\\"\${person.image}\\"\\n\\t\\twidth=\\"150\\"\\n\\t\\theight=\\"150\\"\\n\\t/>\\n\\t<h1 class=\\"headline-1\\">{state.text}</h1>\\n</body>\\n\\n<style>\\n\\tbody {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tjustify-content: center;\\n\\t}\\n\\t.profile {\\n\\t\\tdisplay: block;\\n\\t\\tborder-radius: 50%;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA6GC,IAAI,cAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,AACxB,CAAC,AACD,QAAQ,cAAC,CAAC,AACT,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,GAAG,AACnB,CAAC"}`
};
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var people = {
  tiger: {
    name: "Tiger",
    image: "/assets/img/tiger.jpg",
    calendar: "tigeroakes@gmail.com"
  },
  daphne: {
    name: "Daphne",
    image: "/assets/img/daphne.jpg",
    calendar: "daphne.liu97@gmail.com"
  }
};
var states = {
  free: { text: "Free", background: "#262626" },
  busy: { text: "Busy", background: "#d87220" }
};
function isPerson(person) {
  return person in people;
}
var load = ({ page: page2 }) => __awaiter(void 0, void 0, void 0, function* () {
  const { person } = page2.params;
  if (!isPerson(person)) {
    return {
      status: 404,
      error: new Error(`No matching data for ${person}`)
    };
  }
  const today = Temporal.Now.zonedDateTimeISO("UTC").startOfDay();
  const nextWeek = today.add({ days: 5 });
  const toStringOptions = {
    timeZoneName: "never",
    smallestUnit: "second"
  };
  const body = {
    timeMin: today.toString(toStringOptions),
    timeMax: nextWeek.toString(toStringOptions),
    items: [{ id: people[person].calendar }]
  };
  const res = yield fetch("/api/third_party/freebusy", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    return {
      status: res.status,
      error: new Error(`Could not load calendar, ${res.statusText}`)
    };
  }
  const busy = yield res.json();
  return {
    props: { name: person, busyRanges: busy }
  };
});
var U5Bpersonu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let person;
  let state;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { busyRanges } = $$props;
  let { name } = $$props;
  let stateName = "free";
  isBusyInterval(busyRanges, (isBusy2) => {
    stateName = isBusy2 ? "busy" : "free";
  });
  if ($$props.busyRanges === void 0 && $$bindings.busyRanges && busyRanges !== void 0)
    $$bindings.busyRanges(busyRanges);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css$1);
  person = people[name];
  state = states[stateName];
  return `<body style="${"background: " + escape(state.background)}" class="${"svelte-8rd6l6"}"><img class="${"profile svelte-8rd6l6"}" alt="${"Portrait of $" + escape(person.name)}" src="${"$" + escape(person.image)}" width="${"150"}" height="${"150"}">
	<h1 class="${"headline-1"}">${escape(state.text)}</h1>
</body>`;
});
var _person_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bpersonu5D,
  load
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var css = {
  code: "main.svelte-12o3ebn{display:flex;height:100vh;align-items:center}h1.svelte-12o3ebn{margin:8px}",
  map: `{"version":3,"file":"text.svelte","sources":["text.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">export const router = false;\\nexport const prerender = true;\\n<\/script>\\n\\n<script lang=\\"ts\\">import { page } from '$app/stores';\\n$: text = $page.query.get('text') || 'CellWall';\\n$: backgroundColor = $page.query.get('backgroundColor') || '#429A46';\\n<\/script>\\n\\n<main style=\\"background: {backgroundColor};\\">\\n\\t<h1 class=\\"headline-1\\">{text}</h1>\\n</main>\\n\\n<style>\\n\\tmain {\\n\\t\\tdisplay: flex;\\n\\t\\theight: 100vh;\\n\\t\\talign-items: center;\\n\\t}\\n\\th1 {\\n\\t\\tmargin: 8px;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAcC,IAAI,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,KAAK,CACb,WAAW,CAAE,MAAM,AACpB,CAAC,AACD,EAAE,eAAC,CAAC,AACH,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var router = false;
var prerender = true;
var Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let text2;
  let backgroundColor;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  text2 = $page.query.get("text") || "CellWall";
  backgroundColor = $page.query.get("backgroundColor") || "#429A46";
  $$unsubscribe_page();
  return `<main style="${"background: " + escape(backgroundColor) + ";"}" class="${"svelte-12o3ebn"}"><h1 class="${"headline-1 svelte-12o3ebn"}">${escape(text2)}</h1>
</main>`;
});
var text = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Text,
  router,
  prerender
});

// .svelte-kit/node/middlewares.js
import {
  createReadStream,
  existsSync,
  statSync
} from "fs";
import fs__default, { readdirSync, statSync as statSync2 } from "fs";
import { resolve as resolve2, join, normalize as normalize2, dirname } from "path";
import {
  parse
} from "querystring";
import { fileURLToPath } from "url";
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
function create_kit_middleware({ render: render2 }) {
  return async (req, res) => {
    const parsed = new URL(req.url || "", "http://localhost");
    let body;
    try {
      body = await getRawBody(req);
    } catch (err) {
      res.statusCode = err.status || 400;
      return res.end(err.reason || "Invalid request body");
    }
    const rendered = await render2({
      method: req.method,
      headers: req.headers,
      path: parsed.pathname,
      query: parsed.searchParams,
      rawBody: body
    });
    if (rendered) {
      res.writeHead(rendered.status, rendered.headers);
      if (rendered.body) {
        res.write(rendered.body);
      }
      res.end();
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  };
}
function parse2(req, toDecode) {
  let raw = req.url;
  if (raw == null)
    return;
  let prev = req._parsedUrl, encoded = !req._decoded;
  if (prev && prev.raw === raw && !toDecode === encoded)
    return prev;
  let pathname = raw, search = "", query;
  if (raw.length > 1) {
    let idx = raw.indexOf("?", 1);
    if (idx !== -1) {
      search = raw.substring(idx);
      pathname = raw.substring(0, idx);
      if (search.length > 1) {
        query = parse(search.substring(1));
      }
    }
    if (!!toDecode && encoded) {
      req._decoded = true;
      if (pathname.indexOf("%") !== -1) {
        try {
          pathname = decodeURIComponent(pathname);
        } catch (e) {
        }
      }
    }
  }
  return req._parsedUrl = { pathname, search, query, raw };
}
function list(dir, callback, pre = "") {
  dir = resolve2(".", dir);
  let arr = readdirSync(dir);
  let i = 0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = statSync2(abs);
    stats.isDirectory() ? list(abs, callback, join(pre, arr[i])) : callback(join(pre, arr[i]), abs, stats);
  }
}
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);
  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }
  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}
Mime.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();
    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      if (ext[0] === "*") {
        continue;
      }
      if (!force && ext in this._types) {
        throw new Error('Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".');
      }
      this._types[ext] = type;
    }
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
    }
  }
};
Mime.prototype.getType = function(path2) {
  path2 = String(path2);
  let last = path2.replace(/^.*[/\\]/, "").toLowerCase();
  let ext = last.replace(/^.*\./, "").toLowerCase();
  let hasPath = last.length < path2.length;
  let hasDot = ext.length < last.length - 1;
  return (hasDot || !hasPath) && this._types[ext] || null;
};
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};
var Mime_1 = Mime;
var standard = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma", "es"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/mrb-consumer+xml": ["*xdf"], "application/mrb-publish+xml": ["*xdf"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["*xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-error+xml": ["xer"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
var lite = new Mime_1(standard);
var noop2 = () => {
};
function isMatch(uri, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].test(uri))
      return true;
  }
}
function toAssume(uri, extns) {
  let i = 0, x, len = uri.length - 1;
  if (uri.charCodeAt(len) === 47) {
    uri = uri.substring(0, len);
  }
  let arr = [], tmp = `${uri}/index`;
  for (; i < extns.length; i++) {
    x = extns[i] ? `.${extns[i]}` : "";
    if (uri)
      arr.push(uri + x);
    arr.push(tmp + x);
  }
  return arr;
}
function viaCache(cache, uri, extns) {
  let i = 0, data, arr = toAssume(uri, extns);
  for (; i < arr.length; i++) {
    if (data = cache[arr[i]])
      return data;
  }
}
function viaLocal(dir, isEtag, uri, extns) {
  let i = 0, arr = toAssume(uri, extns);
  let abs, stats, name, headers;
  for (; i < arr.length; i++) {
    abs = normalize2(join(dir, name = arr[i]));
    if (abs.startsWith(dir) && existsSync(abs)) {
      stats = statSync(abs);
      if (stats.isDirectory())
        continue;
      headers = toHeaders(name, stats, isEtag);
      headers["Cache-Control"] = isEtag ? "no-cache" : "no-store";
      return { abs, stats, headers };
    }
  }
}
function is404(req, res) {
  return res.statusCode = 404, res.end();
}
function send(req, res, file, stats, headers) {
  let code = 200, tmp, opts = {};
  headers = __spreadValues({}, headers);
  for (let key in headers) {
    tmp = res.getHeader(key);
    if (tmp)
      headers[key] = tmp;
  }
  if (tmp = res.getHeader("content-type")) {
    headers["Content-Type"] = tmp;
  }
  if (req.headers.range) {
    code = 206;
    let [x, y] = req.headers.range.replace("bytes=", "").split("-");
    let end = opts.end = parseInt(y, 10) || stats.size - 1;
    let start = opts.start = parseInt(x, 10) || 0;
    if (start >= stats.size || end >= stats.size) {
      res.setHeader("Content-Range", `bytes */${stats.size}`);
      res.statusCode = 416;
      return res.end();
    }
    headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    headers["Content-Length"] = end - start + 1;
    headers["Accept-Ranges"] = "bytes";
  }
  res.writeHead(code, headers);
  createReadStream(file, opts).pipe(res);
}
function isEncoding(name, type, headers) {
  headers["Content-Encoding"] = type;
  headers["Content-Type"] = lite.getType(name.replace(/\.([^.]*)$/, "")) || "";
}
function toHeaders(name, stats, isEtag) {
  let headers = {
    "Content-Length": stats.size,
    "Content-Type": lite.getType(name) || "",
    "Last-Modified": stats.mtime.toUTCString()
  };
  if (isEtag)
    headers["ETag"] = `W/"${stats.size}-${stats.mtime.getTime()}"`;
  if (/\.br$/.test(name))
    isEncoding(name, "br", headers);
  if (/\.gz$/.test(name))
    isEncoding(name, "gzip", headers);
  return headers;
}
function sirv(dir, opts = {}) {
  dir = resolve2(dir || ".");
  let isNotFound = opts.onNoMatch || is404;
  let setHeaders = opts.setHeaders || noop2;
  let extensions = opts.extensions || ["html", "htm"];
  let gzips = opts.gzip && extensions.map((x) => `${x}.gz`).concat("gz");
  let brots = opts.brotli && extensions.map((x) => `${x}.br`).concat("br");
  const FILES = {};
  let fallback = "/";
  let isEtag = !!opts.etag;
  let isSPA = !!opts.single;
  if (typeof opts.single === "string") {
    let idx = opts.single.lastIndexOf(".");
    fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
  }
  let ignores = [];
  if (opts.ignores !== false) {
    ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/);
    if (opts.dotfiles)
      ignores.push(/\/\.\w/);
    else
      ignores.push(/\/\.well-known/);
    [].concat(opts.ignores || []).forEach((x) => {
      ignores.push(new RegExp(x, "i"));
    });
  }
  let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
  if (cc && opts.immutable)
    cc += ",immutable";
  else if (cc && opts.maxAge === 0)
    cc += ",must-revalidate";
  if (!opts.dev) {
    list(dir, (name, abs, stats) => {
      if (/\.well-known[\\+\/]/.test(name))
        ;
      else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name))
        return;
      let headers = toHeaders(name, stats, isEtag);
      if (cc)
        headers["Cache-Control"] = cc;
      FILES["/" + name.normalize().replace(/\\+/g, "/")] = { abs, stats, headers };
    });
  }
  let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);
  return function(req, res, next) {
    let extns = [""];
    let val = req.headers["accept-encoding"] || "";
    if (gzips && val.includes("gzip"))
      extns.unshift(...gzips);
    if (brots && /(br|brotli)/i.test(val))
      extns.unshift(...brots);
    extns.push(...extensions);
    let pathname = !!req._decoded && req.path || parse2(req, true).pathname;
    let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
    if (!data)
      return next ? next() : isNotFound(req, res);
    if (isEtag && req.headers["if-none-match"] === data.headers["ETag"]) {
      res.writeHead(304);
      return res.end();
    }
    if (gzips || brots) {
      res.setHeader("Vary", "Accept-Encoding");
    }
    setHeaders(res, pathname, data.stats);
    send(req, res, data.abs, data.stats, data.headers);
  };
}
var __dirname = dirname(fileURLToPath(import.meta.url));
var noop_handler = (_req, _res, next) => next();
var paths = {
  assets: join(__dirname, "/assets"),
  prerendered: join(__dirname, "/prerendered")
};
var prerenderedMiddleware = fs__default.existsSync(paths.prerendered) ? sirv(paths.prerendered, {
  etag: true,
  maxAge: 0,
  gzip: true,
  brotli: true
}) : noop_handler;
var assetsMiddleware = fs__default.existsSync(paths.assets) ? sirv(paths.assets, {
  setHeaders: (res, pathname) => {
    if (pathname.startsWith("/_app/")) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    }
  },
  gzip: true,
  brotli: true
}) : noop_handler;
var kitMiddleware = function() {
  init();
  return create_kit_middleware({ render });
}();
export {
  assetsMiddleware,
  kitMiddleware,
  prerenderedMiddleware
};
