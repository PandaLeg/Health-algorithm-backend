import { Token } from './models/token.entity';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export const authProviders = [
  {
    provide: 'TOKENS_REPOSITORY',
    useValue: Token,
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
