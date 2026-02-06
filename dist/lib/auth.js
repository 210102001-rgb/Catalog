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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomer = exports.isAdmin = exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
exports.getUserFromRequest = getUserFromRequest;
exports.getUserFromNextRequest = getUserFromNextRequest;
exports.isAuthenticated = isAuthenticated;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var server_1 = require("next/server");
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 10;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, saltRounds)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.hashPassword = hashPassword;
var verifyPassword = function (password, hashedPassword) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.compare(password, hashedPassword)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.verifyPassword = verifyPassword;
var generateToken = function (user) {
    var payload = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        userType: user.user_type,
    };
    var secret = process.env.JWT_SECRET || "fallback_secret_key";
    var expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresIn });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
exports.verifyToken = verifyToken;
var isAdmin = function (user) {
    return user.role === "ADMIN";
};
exports.isAdmin = isAdmin;
var isCustomer = function (user) {
    return user.role === "CUSTOMER";
};
exports.isCustomer = isCustomer;
function getUserFromRequest(req) {
    var _a;
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return null;
    }
    try {
        var decoded = (0, exports.verifyToken)(token);
        // In a real implementation, we would fetch the full user from the database
        // Here we're returning a partial user object with essential data from the token
        return {
            id: decoded.id,
            uuid: decoded.uuid,
            email: decoded.email,
            role: decoded.role,
            user_type: decoded.userType,
            name: decoded.name || "",
            password_hash: null,
            company_name: decoded.companyName || null,
            phone: null,
            address: null,
            city: null,
            postal_code: null,
            status: decoded.status || "ACTIVE",
            email_verified: false,
            email_verified_at: null,
            npwp_verified: false,
            npwp_valid_until: null,
            balance: { toString: function () { return "0"; } }, // Placeholder for Decimal
            points: 0,
            last_login_at: null,
            last_login_ip: null,
            remember_token: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
        };
    }
    catch (error) {
        return null;
    }
}
function getUserFromNextRequest(request) {
    var _a;
    var token = (_a = request.headers.get("authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return null;
    }
    try {
        var decoded = (0, exports.verifyToken)(token);
        // In a real implementation, we would fetch the full user from the database
        // Here we're returning a partial user object with essential data from the token
        return {
            id: decoded.id,
            uuid: decoded.uuid,
            email: decoded.email,
            role: decoded.role,
            user_type: decoded.userType,
            name: decoded.name || "",
            password_hash: null,
            company_name: decoded.companyName || null,
            phone: null,
            address: null,
            city: null,
            postal_code: null,
            status: decoded.status || "ACTIVE",
            email_verified: false,
            email_verified_at: null,
            npwp_verified: false,
            npwp_valid_until: null,
            balance: { toString: function () { return "0"; } }, // Placeholder for Decimal
            points: 0,
            last_login_at: null,
            last_login_ip: null,
            remember_token: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
        };
    }
    catch (error) {
        return null;
    }
}
function isAuthenticated(user) {
    return user !== null;
}
function requireAuth(handler) {
    var _this = this;
    return function (request) { return __awaiter(_this, void 0, void 0, function () {
        var user, token, decoded;
        var _a;
        return __generator(this, function (_b) {
            user = getUserFromNextRequest(request);
            // If no user from headers, try to get from cookies
            if (!user || !user.id) {
                token = (_a = request.cookies.get("auth_token")) === null || _a === void 0 ? void 0 : _a.value;
                if (token) {
                    try {
                        decoded = (0, exports.verifyToken)(token);
                        // We don't have access to the database here, so we reconstruct the user from the token
                        user = {
                            id: decoded.id,
                            uuid: decoded.uuid,
                            email: decoded.email,
                            role: decoded.role,
                            user_type: decoded.userType,
                            name: decoded.name || "",
                            password_hash: null,
                            company_name: decoded.companyName || null,
                            phone: null,
                            address: null,
                            city: null,
                            postal_code: null,
                            status: decoded.status || "ACTIVE",
                            email_verified: false,
                            email_verified_at: null,
                            npwp_verified: false,
                            npwp_valid_until: null,
                            balance: { toString: function () { return "0"; } }, // Placeholder for Decimal
                            points: 0,
                            last_login_at: null,
                            last_login_ip: null,
                            remember_token: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: null,
                        };
                    }
                    catch (error) {
                        // Token invalid, continue with null user
                    }
                }
            }
            if (!isAuthenticated(user)) {
                return [2 /*return*/, server_1.NextResponse.json({ error: "Authentication required" }, { status: 401 })];
            }
            return [2 /*return*/, handler(request, user)]; // Using non-null assertion since we checked isAuthenticated
        });
    }); };
}
function requireAdmin(handler) {
    var _this = this;
    return function (request) { return __awaiter(_this, void 0, void 0, function () {
        var user, token, decoded;
        var _a;
        return __generator(this, function (_b) {
            user = getUserFromNextRequest(request);
            // If no user from headers, try to get from cookies
            if (!user || !user.id) {
                token = (_a = request.cookies.get("auth_token")) === null || _a === void 0 ? void 0 : _a.value;
                if (token) {
                    try {
                        decoded = (0, exports.verifyToken)(token);
                        // We don't have access to the database here, so we reconstruct the user from the token
                        user = {
                            id: decoded.id,
                            uuid: decoded.uuid,
                            email: decoded.email,
                            role: decoded.role,
                            user_type: decoded.userType,
                            name: decoded.name || "",
                            password_hash: null,
                            company_name: decoded.companyName || null,
                            phone: null,
                            address: null,
                            city: null,
                            postal_code: null,
                            status: decoded.status || "ACTIVE",
                            email_verified: false,
                            email_verified_at: null,
                            npwp_verified: false,
                            npwp_valid_until: null,
                            balance: { toString: function () { return "0"; } }, // Placeholder for Decimal
                            points: 0,
                            last_login_at: null,
                            last_login_ip: null,
                            remember_token: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: null,
                        };
                    }
                    catch (error) {
                        // Token invalid, continue with null user
                    }
                }
            }
            if (!isAuthenticated(user)) {
                return [2 /*return*/, server_1.NextResponse.json({ error: "Authentication required" }, { status: 401 })];
            }
            if (!(0, exports.isAdmin)(user)) {
                // Using non-null assertion since we checked isAuthenticated
                return [2 /*return*/, server_1.NextResponse.json({ error: "Admin access required" }, { status: 403 })];
            }
            return [2 /*return*/, handler(request, user)]; // Using non-null assertion since we checked isAuthenticated
        });
    }); };
}
