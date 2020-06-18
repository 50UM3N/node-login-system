function sendmail({ nodemailer, email, password, data }, done) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    var mailOptions = {
        from: `"PANGOLIN" <${email}>`,
        to: 'soumen2015.s.k@gmail.com',
        subject: 'Project Contact',
        text: `
        From: ${data.name}
        Email: ${data.email}
                
        ${data.comment}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            done('message not send', null);
        } else {
            done(null, info.response);
        }
    });
}

module.exports = sendmail