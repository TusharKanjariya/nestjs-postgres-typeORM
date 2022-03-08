import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-crendentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
    constructor(@InjectRepository(UsersRepository) private userRepositoy: UsersRepository, private jwtService: JwtService) { }

    async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
        return this.userRepositoy.createUser(authCredentials);
    }

    async signIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentials;
        const user = await this.userRepositoy.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please Check Your Login Credentials');
        }
    }
}
