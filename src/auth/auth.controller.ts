import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-crendentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() authCredentials: AuthCredentialsDto) {
        return this.authService.signUp(authCredentials);
    }

    @Post('signin')
    signin(@Body() authCredentials: AuthCredentialsDto) {
        return this.authService.signIn(authCredentials);
    }
}
