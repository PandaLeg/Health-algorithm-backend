import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as process from 'process';

@Injectable()
export class MailService {
  constructor(@Inject('TRANSPORTER') private transporter: Transporter) {}

  async sendActivationCode(to: string, activationCode: string) {
    const url: string =
      process.env.API_URL + '/auth/activate/' + activationCode;
    await this.transporter.sendMail({
      from: String(process.env.SMTP_EMAIL),
      to,
      subject: 'Activation account on the HealthAlgorithm',
      html: `
                <div>
                    <h1>Email Confirmation</h1>
                    <p>To activate your account, follow the link below</p>
                    <a>${url}</a>
                 </div>`,
    });
  }

  async sendResetCode(to: string, id: string, resetCode: string) {
    const url: string =
      process.env.CLIENT_URL + `/reset-password/${id}?code=${resetCode}`;

    await this.transporter.sendMail({
      from: String(process.env.SMTP_EMAIL),
      to,
      subject: 'Reset password on the HealthAlgorithm',
      html: `
                <div>
                    <h1>Reset Password</h1>
                    <p>To reset your password, follow the link below and follow the instruction</p>
                    <a>${url}</a>
                 </div>`,
    });
  }
}
