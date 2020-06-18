function sendmail({ nodemailer, email, password, data, structure }, done) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: email,
            pass: password
        }
    });
    var mailStructures = {
        contact: {
            from: `"PANGOLIN" <${email}>`,
            to: 'soumen2015.s.k@gmail.com',
            subject: 'Project Contact',
            text: `
        From: ${data.name}
        Email: ${data.email}
                
        ${data.comment}`
        },
        forget: {
            from: `"PANGOLIN" <${email}>`,
            to: data.email,
            subject: 'Forget Password',
            text: `${data.username} your password is "${data.password}"`
        }
    }
    var mailOptions = mailStructures[structure];

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            done('message not send', null);
        } else {
            done(null, info.response);
        }
    });
}

module.exports = sendmail