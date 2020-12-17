const fs = require('fs')

require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    secure: true,
    user: process.env.SENDER_GMAIL_EMAIL,
    pass: process.env.SENDER_GMAIL_PASSWORD,
  },
});

const managerOptions = (data) => ({
  to: data.email,
  from: `Steingot <${process.env.SENDER_GMAIL_EMAIL}>`,
  subject: `Отчет о плитке`,
  text: `
    Общая площадь: ${data.area} м2 \n
    Количество поддонов: ${data.quantityPallets} шт \n
    Общий вес: ${data.weightPallets} кг \n
    ----------------------Данные о поддонах----------------------
    Название: ${data.name} \n
    Размер поддона: ${data.one_pallet} м2 \n
    Вес одного поддона: ${data.weight_pallet} кг \n
    Цвет: ${data.color} \n
    Почта пользователя: ${data.user_email} \n
    Номер пользователя: ${data.phone}`,
  attachments: [{ path: data.imageHomeBase64 }],
});

const userOptions = (data) => ({
  to: data.email,
  from: `Steingot <${process.env.SENDER_GMAIL_EMAIL}>`,
  subject: `Отчет о плитке`,
  text: `
    Общая площадь: ${data.area} м2 \n
    Количество поддонов: ${data.quantityPallets} шт \n
    Общий вес: ${data.weightPallets} кг \n
    ----------------------Данные о поддонах----------------------
    Название: ${data.name} \n
    Размер поддона: ${data.one_pallet} м2 \n
    Вес одного поддона: ${data.weight_pallet} кг \n
    Цвет: ${data.color}`,
  attachments: [{ path: data.imageHomeBase64 }],
});

const getOptions = (data) => {
  let options;
  if (data.email === process.env.SENDER_GMAIL_EMAIL) {
    options = managerOptions(data);
  } else {
    options = userOptions(data);
  }
  return options;
};

const saveImage = (data, name) => {
  name = name.replace(/\|&;\$%@"<>\(\)\+,/g, "");
  let matches = data.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFile(
    `./screenshots/${name}.png`,
    matches,
    { encoding: "base64" },
    (err) => {
      if (err) throw new Error(err);
    }
  );
};

const send = (data) => {
  saveImage(data.imageHomeBase64, data.user_email);
  const mailOptions = getOptions(data);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) =>
      error ? reject(error) : resolve(info)
    );
  });
};

export default send;
