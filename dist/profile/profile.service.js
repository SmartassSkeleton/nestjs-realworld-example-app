"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const prisma_service_1 = require("../shared/services/prisma.service");
const profileSelect = {
    username: true,
    bio: true,
    image: true,
    id: true
};
let ProfileService = class ProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findProfile(userId, followingUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const followed = yield this.prisma.user.findUnique({
                where: { username: followingUsername },
                select: profileSelect
            });
            if (!followed) {
                throw new http_exception_1.HttpException({ errors: { user: 'not found' } }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const meFollowing = yield this.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            id: followed.id
                        },
                        {
                            followedBy: {
                                some: { id: +userId }
                            }
                        }
                    ]
                }
            });
            const { id } = followed, rest = __rest(followed, ["id"]);
            const profile = Object.assign(Object.assign({}, rest), { following: Array.isArray(meFollowing) && meFollowing.length > 0 });
            return { profile };
        });
    }
    follow(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                throw new http_exception_1.HttpException('Follower username not provided.', common_1.HttpStatus.BAD_REQUEST);
            }
            const followed = yield this.prisma.user.findUnique({
                where: { username },
                select: profileSelect,
            });
            if (!followed) {
                throw new http_exception_1.HttpException('User to follow not found.', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            yield this.prisma.user.update({
                where: { id: +userId },
                data: {
                    following: {
                        connect: {
                            id: followed.id
                        }
                    }
                }
            });
            const { id } = followed, rest = __rest(followed, ["id"]);
            const profile = Object.assign(Object.assign({}, rest), { following: true });
            return { profile };
        });
    }
    unFollow(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                throw new http_exception_1.HttpException('Follower username not provided.', common_1.HttpStatus.BAD_REQUEST);
            }
            const followed = yield this.prisma.user.findUnique({
                where: { username },
                select: profileSelect,
            });
            if (!followed) {
                throw new http_exception_1.HttpException('User to follow not found.', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            yield this.prisma.user.update({
                where: { id: +userId },
                data: {
                    following: {
                        disconnect: {
                            id: followed.id
                        }
                    }
                }
            });
            const { id } = followed, rest = __rest(followed, ["id"]);
            const profile = Object.assign(Object.assign({}, rest), { following: false });
            return { profile };
        });
    }
};
ProfileService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map