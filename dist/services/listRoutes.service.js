"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logMessage_service_1 = __importDefault(require("./logMessage.service"));
const listRoutes = (app) => {
    const routes = [];
    // Iterates all routes
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Directly defined routes
            routes.push({
                method: Object.keys(middleware.route.methods)[0].toUpperCase(),
                path: middleware.route.path,
            });
        }
        else if (middleware.name === "router" && middleware.handle.stack) {
            // Routes added via router
            const basePath = middleware.regexp
                .toString()
                .replace(/^\/\^/, "") // Remove leading "/^"
                .replace(/\\\//g, "/") // Replace escaped slashes
                .replace(/\?\(\?=\/\|\$\)\//g, "") // Remove "?(?=/|$)"
                .replace(/\$\//, "") // Remove trailing "$/"
                // .replace(/^\/api/, "") // Remove "/api"
                .replace(/\/i/g, "") // Remove all "/i" occurrences from the path
                .replace(/^\/maps/, "/maps"); // Ensure /maps stays as is
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        method: Object.keys(handler.route.methods)[0].toUpperCase(),
                        path: `${basePath}${handler.route.path}`,
                    });
                }
            });
        }
    });
    // Log the routes and made the logMessage function
    (0, logMessage_service_1.default)("Mapped routes:", "LOG");
    routes.forEach((route) => (0, logMessage_service_1.default)(`[RouterExplorer] Mapped {${route.path}, ${route.method}} route`, "LOG"));
};
exports.default = listRoutes;
