import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signUp(body: any, displayPicture: Express.Multer.File): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            displayPicture: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            displayPicture: string;
        };
    }>;
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        displayPicture: string;
        role: string;
    }>;
}
