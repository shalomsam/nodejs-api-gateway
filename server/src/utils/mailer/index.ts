import nodemailer from 'nodemailer';
import nodemailerConfig from '../../config/nodemailer.config';

// Example
//
// mailer.sendMail({
//     from: `no-reply@${domain}`,
//     to: email,
//     html: `
//         <p>
//             Hi ${user.firstName},

//             Please use the below link to reset your Password.

//             Reset Password - ${baseUrl}/${user.resetToken}

//             Please Note: The link will expire at ${new Date(user.resetTokenExpires).toDateString()}.
//         </p>
//     `
// });

const mailer = nodemailer.createTransport(nodemailerConfig);
export default mailer;
