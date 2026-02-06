"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var client = globalThis.prisma || new client_1.PrismaClient();
exports.prisma = client;
if (process.env.NODE_ENV !== "production")
    globalThis.prisma = client;
