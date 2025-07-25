import emailjs from 'emailjs-com';

export default function sendVerificationCode(email, code) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_VERIFICATION;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const params = {
    email: email,
    verification_code: code,
  };

  return emailjs.send(serviceId, templateId, params, publicKey);
}