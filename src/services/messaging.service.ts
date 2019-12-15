import { Injectable, Inject, Scope } from '@nestjs/common';
import { MESSAGER_PROVIDER } from 'src/utils/constants';

import Mail = require('nodemailer/lib/mailer');
import { Twilio } from 'twilio';

@Injectable({ scope: Scope.DEFAULT })
export class MessagingService {
  constructor(
    @Inject(MESSAGER_PROVIDER)
    private readonly messenger: {
      mailTransporter: Mail;
      twilioClient: Twilio;
      twilioDetails: { phoneNumbers: string[] };
    },
  ) {}

  async sendEmail(to: string, subject: string, text: string) {
    const mail = {
      to,
      subject,
      text,
    };
    try {
      await this.messenger.mailTransporter.sendMail(mail);
    } catch (err) {
      throw err;
    }
  }

  async sendSms(to: string, text: string) {
    const message = {
      body: text,
      from: this.messenger.twilioDetails.phoneNumbers[0],
      to,
    };
    try {
      await this.messenger.twilioClient.messages.create(message);
    } catch (err) {
      throw err;
    }
  }
}
