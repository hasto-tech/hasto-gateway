import { MESSAGER_PROVIDER } from 'src/utils/constants';

import { createTransport } from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { Twilio } from 'twilio';

import { readFileSync } from 'fs';

export const messagerProviders = [
  {
    provide: MESSAGER_PROVIDER,
    useFactory: async () => {
      (({ mailTransporter: Mail, twilioClient: Twilio } as any).Promise =
        global.Promise);
      const config: {
        mailUser: string;
        mailPassword: string;
        mailHost: string;
        mailHostPort: number;
        twilioAuthToken: string;
        twilioAccountSid: string;
        twilioPhoneNumber: string;
      } = JSON.parse(readFileSync('config.json', { encoding: 'utf8' }));

      return {
        twilioClient: new Twilio(
          config.twilioAccountSid,
          config.twilioAuthToken,
        ),
        mailTransporter: createTransport({
          host: config.mailHost,
          port: config.mailHostPort,
          auth: {
            user: config.mailUser,
            pass: config.mailPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        }),
        twilioDetails: { phoneNumbers: [config.twilioPhoneNumber] },
      };
    },
  },
];
