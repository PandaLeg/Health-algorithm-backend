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
}
