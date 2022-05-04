"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var home_1 = __importDefault(require("../controller/home"));
exports.default = [
    {
        path: '/',
        method: 'get',
        controller: home_1.default.getIndexHtml
    },
    {
        path: '/download/text',
        method: 'get',
        controller: home_1.default.getDownloadFile
    }
];
//# sourceMappingURL=home.js.map