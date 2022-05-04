"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAllFile = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var importAllFile = function (targetPath, regx, store) {
    if (regx === void 0) { regx = /.(t|j)s$/; }
    if (store === void 0) { store = []; }
    var requireList = store ? store : [];
    return new Promise(function (resolve, reject) {
        fs_1.default.readdir(targetPath, function (err, files) {
            if (err) {
                reject(err);
            }
            files.map(function (filePath) {
                if (regx.test(filePath)) {
                    requireList.push(require(path_1.default.join(targetPath, filePath)));
                }
                else {
                    if (fs_1.default.statSync(targetPath + filePath).isDirectory()) {
                        exports.importAllFile(path_1.default.join(targetPath, filePath), regx, requireList);
                    }
                }
            });
            resolve(requireList);
        });
    });
};
exports.importAllFile = importAllFile;
//# sourceMappingURL=utils.js.map