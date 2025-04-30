import nodemailer from 'nodemailer'
import { format } from 'sequelize/lib/utils';



const transporter = nodemailer.createTransport({
    service:"yandex",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (toEmail, code) =>{
    const mailOptions = {
        from: "w.aim2017@yandex.ru",
        to: toEmail,
        subject:"Подтверждение регистрации",
        text:`Ваш код подтверждения: ${code}. Код действителен 10 минут.`,
        html: `<h1>Подтверждение регистрации</h1><p>Ваш код подтверждения: <strong>${code}</strong>. Код действителен 10 минут.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email отправлен на", toEmail);
    } catch (error) {
      console.error("Ошибка отправки email:", error);
      throw new Error("Не удалось отправить email");
    }
}
