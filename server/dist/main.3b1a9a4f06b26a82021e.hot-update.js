/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "main";
exports.ids = null;
exports.modules = {

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export dbConnectionOptions [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.dbConnectionOptions = void 0;\nvar user_entity_1 = __webpack_require__(/*! ./entity/user.entity */ \"./src/entity/user.entity.ts\");\nexports.dbConnectionOptions = {\n    type: 'sqlite',\n    //  host: 'localhost',\n    //  port: 3306,\n    //  username: 'root',\n    //  password: 'admin',\n    database: './db.sqlite',\n    entities: [\n        user_entity_1.User,\n    ],\n    synchronize: true,\n    logging: false\n};\n\n\n//# sourceURL=webpack://server/./src/config.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__, module */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__webpack_require__(/*! reflect-metadata */ \"reflect-metadata\");\nvar typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nvar app_1 = __importDefault(__webpack_require__(/*! ./app */ \"./src/app.ts\"));\nvar config_1 = __webpack_require__(/*! ./config */ \"./src/config.ts\");\ntypeorm_1.createConnection(config_1.dbConnectionOptions).then(function (connection) {\n    /**\n    * Server Activation\n    */\n    var PORT = parseInt(process.env.PORT, 10);\n    var server = app_1.default.listen(PORT, function () {\n        console.log(\"Listening on port \" + PORT);\n    });\n    /**\n     * Webpack HMR Activation\n     */\n    if (true) {\n        module.hot.accept();\n        module.hot.dispose(function () { return server.close(); });\n    }\n}).catch(function (error) { return console.log(error); });\n\n\n//# sourceURL=webpack://server/./src/index.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "acd92c24cb636ce802f2"
/******/ 	})();
/******/ 	
/******/ }
;