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
var db_1 = require("../lib/db");
var auth_1 = require("../lib/auth");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, adminUser, customerPassword, customerUser, category1, category2, subcategory1, subcategory2, product1, product2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding database...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, 13, 15]);
                    return [4 /*yield*/, (0, auth_1.hashPassword)("admin123")];
                case 2:
                    adminPassword = _a.sent();
                    return [4 /*yield*/, db_1.prisma.user.upsert({
                            where: { email: "admin@solvia.com" },
                            update: {},
                            create: {
                                uuid: crypto.randomUUID(),
                                name: "Admin User",
                                email: "admin@solvia.com",
                                password_hash: adminPassword,
                                role: "ADMIN",
                                user_type: "INDIVIDUAL",
                                status: "ACTIVE",
                                email_verified: true,
                            },
                        })];
                case 3:
                    adminUser = _a.sent();
                    console.log("Admin user created:", adminUser.email);
                    return [4 /*yield*/, (0, auth_1.hashPassword)("customer123")];
                case 4:
                    customerPassword = _a.sent();
                    return [4 /*yield*/, db_1.prisma.user.upsert({
                            where: { email: "customer@solvia.com" },
                            update: {},
                            create: {
                                uuid: crypto.randomUUID(),
                                name: "Customer User",
                                email: "customer@solvia.com",
                                password_hash: customerPassword,
                                role: "CUSTOMER",
                                user_type: "INDIVIDUAL",
                                status: "ACTIVE",
                                email_verified: true,
                            },
                        })];
                case 5:
                    customerUser = _a.sent();
                    console.log("Customer user created:", customerUser.email);
                    return [4 /*yield*/, db_1.prisma.category.upsert({
                            where: { slug: "billboard" },
                            update: {},
                            create: {
                                name: "Billboard",
                                slug: "billboard",
                                description: "Various billboard advertisements",
                                active: true,
                            },
                        })];
                case 6:
                    category1 = _a.sent();
                    return [4 /*yield*/, db_1.prisma.category.upsert({
                            where: { slug: "digital-signage" },
                            update: {},
                            create: {
                                name: "Digital Signage",
                                slug: "digital-signage",
                                description: "Digital signage solutions",
                                active: true,
                            },
                        })];
                case 7:
                    category2 = _a.sent();
                    console.log("Categories created:", category1.name, "and", category2.name);
                    return [4 /*yield*/, db_1.prisma.subCategory.upsert({
                            where: { slug: "indoor-billboards" },
                            update: {},
                            create: {
                                name: "Indoor Billboards",
                                slug: "indoor-billboards",
                                description: "Billboards for indoor use",
                                category_id: category1.id,
                                active: true,
                            },
                        })];
                case 8:
                    subcategory1 = _a.sent();
                    return [4 /*yield*/, db_1.prisma.subCategory.upsert({
                            where: { slug: "outdoor-billboards" },
                            update: {},
                            create: {
                                name: "Outdoor Billboards",
                                slug: "outdoor-billboards",
                                description: "Billboards for outdoor use",
                                category_id: category1.id,
                                active: true,
                            },
                        })];
                case 9:
                    subcategory2 = _a.sent();
                    console.log("Subcategories created:", subcategory1.name, "and", subcategory2.name);
                    return [4 /*yield*/, db_1.prisma.product.upsert({
                            where: { slug: "premium-city-center-billboard" },
                            update: {},
                            create: {
                                uuid: crypto.randomUUID(),
                                name: "Premium City Center Billboard",
                                slug: "premium-city-center-billboard",
                                description: "High visibility billboard in the heart of the city",
                                location: "Downtown Jakarta",
                                latitude: -6.2088,
                                longitude: 106.8456,
                                size_width: 10,
                                size_height: 5,
                                illumination: true,
                                visibility: "ALWAYSON",
                                price_daily: 500000,
                                price_weekly: 3000000,
                                price_monthly: 12000000,
                                price_yearly: 144000000,
                                stock_quantity: 1,
                                images: ["https://example.com/billboard1.jpg"],
                                specifications: {
                                    material: "Vinyl",
                                    mounting: "Wall mounted",
                                    wind_resistance: "Up to 120 km/h",
                                },
                                featured: true,
                                published: true,
                                created_by: adminUser.id,
                                status: "APPROVED",
                                approved_by: adminUser.id,
                                approved_at: new Date(),
                                category_id: category1.id,
                                subcategory_id: subcategory2.id,
                            },
                        })];
                case 10:
                    product1 = _a.sent();
                    return [4 /*yield*/, db_1.prisma.product.upsert({
                            where: { slug: "digital-indoor-display" },
                            update: {},
                            create: {
                                uuid: crypto.randomUUID(),
                                name: "Digital Indoor Display",
                                slug: "digital-indoor-display",
                                description: "High-resolution digital display for indoor environments",
                                location: "Mall Grand Indonesia, Jakarta",
                                latitude: -6.1927,
                                longitude: 106.8215,
                                size_width: 4,
                                size_height: 3,
                                illumination: true,
                                visibility: "DAYTIME",
                                price_daily: 200000,
                                price_weekly: 1000000,
                                price_monthly: 4000000,
                                price_yearly: 48000000,
                                stock_quantity: 1,
                                images: ["https://example.com/digital-display.jpg"],
                                specifications: {
                                    resolution: "1920x1080",
                                    brightness: "500 nits",
                                    connectivity: "WiFi, Ethernet",
                                },
                                featured: true,
                                published: true,
                                created_by: adminUser.id,
                                status: "APPROVED",
                                approved_by: adminUser.id,
                                approved_at: new Date(),
                                category_id: category2.id,
                                subcategory_id: subcategory1.id,
                            },
                        })];
                case 11:
                    product2 = _a.sent();
                    console.log("Sample products created:", product1.name, "and", product2.name);
                    console.log("Database seeding completed successfully!");
                    return [3 /*break*/, 15];
                case 12:
                    error_1 = _a.sent();
                    console.error("Error during seeding:", error_1);
                    throw error_1;
                case 13: return [4 /*yield*/, db_1.prisma.$disconnect()];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// Execute seeding if this file is run directly
if (require.main === module) {
    seedDatabase().catch(function (e) {
        console.error(e);
        process.exit(1);
    });
}
exports.default = seedDatabase;
