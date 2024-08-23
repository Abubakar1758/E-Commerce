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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const supabase_service_1 = require("../supabase/supabase.service");
const path = require("path");
const uuid_1 = require("uuid");
let UserService = class UserService {
    constructor(prisma, supabaseService) {
        this.prisma = prisma;
        this.supabaseService = supabaseService;
    }
    async createUser(data, fileBuffer, originalFileName) {
        const { firstName, lastName, email, password, role, ...userData } = data;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let pictureUrl = null;
        if (fileBuffer && originalFileName) {
            const uniqueFileName = `${(0, uuid_1.v4)()}${path.extname(originalFileName)}`;
            const bucket = process.env.SUPABASE_USER_BUCKET;
            try {
                await this.supabaseService.uploadImage({ buffer: fileBuffer, originalname: originalFileName }, uniqueFileName, bucket);
                pictureUrl = await this.supabaseService.getImageUrl(uniqueFileName, bucket);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Failed to upload display picture.');
            }
        }
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...userData,
                    name: `${firstName} ${lastName}`,
                    email,
                    password: hashedPassword,
                    role,
                    displayPicture: pictureUrl,
                },
            });
            return {
                message: 'Sign-up successful!',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    displayPicture: user.displayPicture,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while creating the user.');
        }
    }
    async loginUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        return {
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                displayPicture: user.displayPicture,
            },
        };
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                displayPicture: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map