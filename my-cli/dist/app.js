"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
//@ts-ignore
var koa_nunjucks_2_1 = __importDefault(require("koa-nunjucks-2"));
var route_1 = require("./init/route");
var path_1 = __importDefault(require("path"));
var load_1 = __importDefault(require("./init/load"));
var mime_1 = __importDefault(require("mime"));
var fs_1 = __importDefault(require("fs"));
var app = new koa_1.default();
app.use(koa_nunjucks_2_1.default({
    ext: "njk",
    path: path_1.default.resolve(__dirname, "./views"),
    nunjucksConfig: {
        trimBlocks: true,
    },
}));
app.use(function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var render;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                render = ctx.render;
                ctx._renderState = {};
                ctx.setState = function (state) {
                    ctx._renderState = Object.assign({}, ctx._renderState, state);
                };
                ctx.setHeader = function (opts) {
                    Object.keys(opts).map(function (key) {
                        ctx.set(key, opts[key]);
                    });
                };
                ctx.render = function (path, state) { return __awaiter(void 0, void 0, void 0, function () {
                    var renderState;
                    return __generator(this, function (_a) {
                        renderState = ctx._renderState;
                        ctx._renderState = Object.assign({});
                        render(path, state || renderState);
                        return [2 /*return*/];
                    });
                }); };
                ctx.setState({ loadJs: load_1.default.loadJs });
                return [4 /*yield*/, next()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.use(function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var urlPath, type, regx, _a, _, dir, filename;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                urlPath = ctx.path;
                type = mime_1.default.getType('js');
                regx = /\/public\/(\w+)\/(.*)/;
                if (regx.test(urlPath)) {
                    _a = __read(urlPath.match(regx), 3), _ = _a[0], dir = _a[1], filename = _a[2];
                    ctx.body = fs_1.default.createReadStream(path_1.default.resolve(__dirname, "../local/" + filename));
                }
                return [4 /*yield*/, next()];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
app.use(route_1.router.routes()).use(route_1.router.allowedMethods());
app.listen(3000, function () {
    console.log("server is on 3000");
});
//# sourceMappingURL=app.js.map