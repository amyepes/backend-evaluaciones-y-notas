import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/service/auth.service';
import { UserService } from 'src/infrastructure/service/user.service';
import { CreateUserDto } from 'src/application/dto/create-user.dto';
import { CoreUser } from 'generated/prisma';

type SafeCoreUser = Omit<CoreUser, 'passwordHash'>;
import { LocalAuthGuard } from 'src/core/guards/local.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import type { IRequestAuth } from 'src/core/model/request-auth.model';

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
        return await this.authService.login(req.user as SafeCoreUser)
    }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getProfile(@Request() req: IRequestAuth){
        return await this.userService.getUserById(req.user.userId)
    }
}
