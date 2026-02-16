"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var trpc_1 = require("./trpc");
var auth_1 = require("./routers/auth");
var projects_1 = require("./routers/projects");
var content_1 = require("./routers/content");
var clientProfiles_1 = require("./routers/clientProfiles");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_1.authRouter,
    projects: projects_1.projectsRouter,
    content: content_1.contentRouter,
    clientProfiles: clientProfiles_1.clientProfilesRouter,
});
