import { Token } from './models/token.entity';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { TokenRepository } from './repos/token.repository';

export const authProviders = [
  {
    provide: 'TOKENS_REPOSITORY',
    useValue: Token,
  },
  {
    provide: 'ITokenRepository',
    useClass: TokenRepository,
  },
  {
    provide: 'TRANSPORTER',
    useFactory: () => {
      const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: String(process.env.SMTP_EMAIL),
          pass: String(process.env.SMTP_PASSWORD),
        },
      });
      return transporter;
    },
  },
];
