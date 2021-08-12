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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/services/prisma.service");
const slug = require('slug');
const articleAuthorSelect = {
    email: true,
    username: true,
    bio: true,
    image: true,
    followedBy: { select: { id: true } }
};
const commentSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    body: true,
    author: { select: articleAuthorSelect }
};
const articleInclude = {
    author: { select: articleAuthorSelect },
    favoritedBy: { select: { id: true } },
};
const mapAuthorFollowing = (userId, _a) => {
    var { followedBy } = _a, rest = __rest(_a, ["followedBy"]);
    return (Object.assign(Object.assign({}, rest), { following: Array.isArray(followedBy) && followedBy.map(f => f.id).includes(userId) }));
};
const mapDynamicValues = (userId, _a) => {
    var { favoritedBy, author } = _a, rest = __rest(_a, ["favoritedBy", "author"]);
    return (Object.assign(Object.assign({}, rest), { favorited: Array.isArray(favoritedBy) && favoritedBy.map(f => f.id).includes(userId), author: mapAuthorFollowing(userId, author) }));
};
let ArticleService = class ArticleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const andQueries = this.buildFindAllQuery(query);
            let articles = yield this.prisma.article.findMany(Object.assign(Object.assign({ where: { AND: andQueries }, orderBy: { createdAt: 'desc' }, include: articleInclude }, ('limit' in query ? { first: +query.limit } : {})), ('offset' in query ? { skip: +query.offset } : {})));
            const articlesCount = yield this.prisma.article.count({
                where: { AND: andQueries },
                orderBy: { createdAt: 'desc' },
            });
            articles = articles.map((a) => mapDynamicValues(userId, a));
            return { articles, articlesCount };
        });
    }
    buildFindAllQuery(query) {
        const queries = [];
        if ('tag' in query) {
            queries.push({
                tagList: {
                    contains: query.tag
                }
            });
        }
        if ('author' in query) {
            queries.push({
                author: {
                    username: {
                        equals: query.author
                    }
                }
            });
        }
        if ('favorited' in query) {
            queries.push({
                favoritedBy: {
                    some: {
                        username: {
                            equals: query.favorited
                        }
                    }
                }
            });
        }
        return queries;
    }
    findFeed(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                author: {
                    followedBy: { some: { id: +userId } }
                }
            };
            let articles = yield this.prisma.article.findMany(Object.assign(Object.assign({ where, orderBy: { createdAt: 'desc' }, include: articleInclude }, ('limit' in query ? { first: +query.limit } : {})), ('offset' in query ? { skip: +query.offset } : {})));
            const articlesCount = yield this.prisma.article.count({
                where,
                orderBy: { createdAt: 'desc' },
            });
            articles = articles.map((a) => mapDynamicValues(userId, a));
            return { articles, articlesCount };
        });
    }
    findOne(userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.prisma.article.findUnique({
                where: { slug },
                include: articleInclude,
            });
            article = mapDynamicValues(userId, article);
            return { article };
        });
    }
    addComment(userId, slug, { body }) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.prisma.comment.create({
                data: {
                    body,
                    article: {
                        connect: { slug }
                    },
                    author: {
                        connect: { id: userId }
                    }
                },
                select: commentSelect
            });
            return { comment };
        });
    }
    deleteComment(slug, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.comment.delete({ where: { id: +id } });
        });
    }
    favorite(userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.prisma.article.update({
                where: { slug },
                data: {
                    favoritedBy: {
                        connect: { id: userId }
                    }
                },
                include: articleInclude
            });
            article = mapDynamicValues(userId, article);
            return { article };
        });
    }
    unFavorite(userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.prisma.article.update({
                where: { slug },
                data: {
                    favoritedBy: {
                        disconnect: { id: userId }
                    }
                },
                include: articleInclude
            });
            article = mapDynamicValues(userId, article);
            return { article };
        });
    }
    findComments(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.prisma.comment.findMany({
                where: { article: { slug } },
                orderBy: { createdAt: 'desc' },
                select: commentSelect
            });
            return { comments };
        });
    }
    create(userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, payload), { slug: this.slugify(payload.title), tagList: payload.tagList.join(','), author: {
                    connect: { id: userId }
                } });
            let article = yield this.prisma.article.create({
                data,
                include: articleInclude
            });
            article = mapDynamicValues(userId, article);
            return { article };
        });
    }
    update(userId, slug, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.prisma.article.update({
                where: { slug },
                data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
                include: articleInclude,
            });
            article = mapDynamicValues(userId, article);
            return { article };
        });
    }
    delete(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.article.delete({ where: { slug } });
        });
    }
    slugify(title) {
        return slug(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }
};
ArticleService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map