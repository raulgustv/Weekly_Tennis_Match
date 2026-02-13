import { Resend } from 'resend';

let resendInstance = null;

export const getResend = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is missing');
    }

    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }

  return resendInstance;
};
