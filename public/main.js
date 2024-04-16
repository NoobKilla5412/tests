/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst test_1 = __webpack_require__(/*! ./test */ \"./src/test.ts\");\n(0, test_1.test)();\n\n\n//# sourceURL=webpack://tests/./src/index.ts?");

/***/ }),

/***/ "./src/test.ts":
/*!*********************!*\
  !*** ./src/test.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.test = void 0;\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n(0, utils_1.useUtils)();\nfunction calculateProgressBar(percent, cap = 100) {\n    let index = Math.round(Math.lerp(0, cap - 1, percent));\n    let res = \"\";\n    for (let i = 0; i < cap; i++) {\n        if (i == index)\n            res += \"X\";\n        else\n            res += \".\";\n    }\n    return res;\n}\nasync function test() {\n    const res = document.body.appendChild(document.createElement(\"div\"));\n    for (let i = 0; i <= 1000; i++) {\n        res.innerHTML = `${calculateProgressBar(i / 1000)} - ${i / 10}%`;\n        await (0, utils_1.sleep)(10);\n    }\n}\nexports.test = test;\n\n\n//# sourceURL=webpack://tests/./src/test.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.sleep = exports.useUtils = void 0;\nfunction useUtils() {\n    if (typeof Math.lerp == \"undefined\")\n        Math.lerp = (a, b, alpha) => {\n            return a + alpha * (b - a);\n        };\n    if (typeof Math.sign == \"undefined\")\n        Math.sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);\n    document.write = (text) => document.body.append(text);\n}\nexports.useUtils = useUtils;\nasync function sleep(ms) {\n    return new Promise((resolve) => setTimeout(resolve, ms));\n}\nexports.sleep = sleep;\n\n\n//# sourceURL=webpack://tests/./src/utils.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;