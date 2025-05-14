import nodemailer from 'nodemailer'
import { format } from 'sequelize/lib/utils';


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
    host: "smtp.rambler.ru",
    port: 465, 
    secure: true,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true, 
     debug: true,
});

export const sendVerificationEmail = async (toEmail, code) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Подтверждение регистрации",
      text: `Ваш код подтверждения: ${code}. Код действителен 10 минут.`,
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Подтверждение регистрации</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              background-color: rgb(29, 74, 143);
              line-height: 1.6;
              color: #333;
              width: 100%;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }
            a {
              color: #1890ff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
  
            .email-container {
              background-color: #ffffff;
              padding: 20px;
              margin: 20px auto;
              width: 100%;
              max-width: 600px;
              text-align: center;
            }
  
            .email-header {
              text-align: center;
              padding: 20px 0;
            }
            .email-header h1 {
              font-size: 24px;
              font-weight: 600;
              color: #333;
              margin: 0 auto;
            }
  
            .email-body {
              padding: 20px;
              text-align: center;
            }
            .email-body p {
              font-size: 16px;
              color: #333;
              margin: 0 auto 20px;
              max-width: 400px;
            }
  
            .code-card {
              display: inline-block;
              background-color: #1890ff;
              padding: 15px 30px;
              margin: 20px auto;
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: 5px;
          
            }
  
            .action-button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #1890ff;
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
              text-decoration: none;
              margin: 20px auto;
              border: 2px solid #40c4ff;
            }
  
            .email-footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #333;
            }
            .email-footer p {
              margin: 0 auto;
            }
            .email-footer a {
              color: #1890ff;
            }
  
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 15px !important;
                margin: 10px auto !important;
              }
              .email-header h1 {
                font-size: 20px;
              }
              .email-body p {
                font-size: 14px;
                max-width: 100%;
              }
              .code-card {
                font-size: 20px;
                padding: 10px 20px;
              }
              .action-button {
                font-size: 14px;
                padding: 10px 20px;
              }
            }
          </style>
        </head>
        <body style="background: black;">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td align="center" style="padding: 0;">
                <div class="email-container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; text-align: center;">
                  <div class="email-header" style="text-align: center; padding: 20px 0;">
                    <h1 style="font-size: 24px; font-weight: 600; color: #333; margin: 0 auto;">Подтверждение регистрации</h1>
                  </div>
  
                  <div class="email-body" style="padding: 20px; text-align: center;">
                    <p style="font-size: 16px; color: #333; margin: 0 auto 20px; max-width: 400px;">Спасибо за регистрацию! Чтобы завершить процесс, пожалуйста, используйте код ниже:</p>
                    <div class="code-card" style="display: inline-block; background-color: #1890ff; padding: 15px 30px; margin: 20px auto; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 5px; border-radius: 12px; ">
                      <span style="font-weight: 700;">${code.split("").join("</span><span style='font-weight: 700;'>")}</span>
                    </div>
                    <p style="font-size: 16px; color: #333; margin: 0 auto 20px; max-width: 400px;">Код действителен в течение 10 минут.</p>
                    <a href="#" class="action-button" style="display: inline-block; padding: 12px 30px; background-color: #1890ff; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; margin: 20px auto; border-radius: 12px; ">Подтвердить email</a>
                  </div>
  
                  <div class="email-footer" style="text-align: center; padding: 20px; font-size: 14px; color: #333;">
                    <p style="margin: 0 auto;">Если вы не регистрировались, просто проигнорируйте это письмо.</p>
                    <p style="margin: 0 auto;">Нужна помощь? <a href="mailto:tryenglish@rambler.ru" style="color: #1890ff; text-decoration: none;">Свяжитесь с нами</a></p>
                    <p style="margin: 0 auto;">© 2025 Ваше приложение. Все права защищены.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email отправлен на", toEmail);
    } catch (error) {
      console.error("Ошибка отправки email:", error);
      throw new Error("Не удалось отправить email");
    }
}
