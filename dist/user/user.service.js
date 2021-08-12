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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require('jsonwebtoken');
const config_1 = require("../config");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const common_2 = require("@nestjs/common");
const argon2 = require("argon2");
const prisma_service_1 = require("../shared/services/prisma.service");
const select = {
    email: true,
    username: true,
    bio: true,
    image: true
};
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findMany({ select });
        });
    }
    login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const _user = yield this.prisma.user.findUnique({
                where: { email: payload.email }
            });
            const errors = { User: 'email or password wrong' };
            if (!_user) {
                throw new http_exception_1.HttpException({ errors }, 401);
            }
            const authenticated = yield argon2.verify(_user.password, payload.password);
            if (!authenticated) {
                throw new http_exception_1.HttpException({ errors }, 401);
            }
            const token = yield this.generateJWT(_user);
            const { password } = _user, user = __rest(_user, ["password"]);
            return {
                user: Object.assign({ token }, user)
            };
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = dto;
            const userNotUnique = yield this.prisma.user.findUnique({
                where: { email }
            });
            if (userNotUnique) {
                const errors = { username: 'Username and email must be unique.' };
                throw new http_exception_1.HttpException({ message: 'Input data validation failed', errors }, common_2.HttpStatus.BAD_REQUEST);
            }
            const hashedPassword = yield argon2.hash(password);
            const data = {
                username,
                email,
                password: hashedPassword,
            };
            const user = yield this.prisma.user.create({ data, select });
            return { user };
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { id };
            const user = yield this.prisma.user.update({ where, data, select });
            return { user };
        });
    }
    delete(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.delete({ where: { email }, select });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({ where: { id }, select: Object.assign({ id: true }, select) });
            return { user };
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({ where: { email }, select });
            return { user };
        });
    }
    generateJWT(user) {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            exp: exp.getTime() / 1000,
        }, config_1.SECRET);
    }
    ;
};
UserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map