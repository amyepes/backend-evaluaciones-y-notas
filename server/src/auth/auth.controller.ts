import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IRequestAuth } from './request-auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService){}

    @Post("/register")
    async register(@Body() body: CreateUserDto){
        return await this.userService.createUser(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    async login(@Request() req){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return await this.authService.login(req.user as UserEntity)
    }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getProfile(@Request() req: IRequestAuth){
        return await this.userService.getUserById(req.user.userId)
    }
}
