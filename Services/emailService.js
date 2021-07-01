const nodemailer=require('nodemailer');
async function sendMail( {from,to,subject,text,html} ){

    let transpoter=nodemailer.createTransport({
        host:process.env.SMTP_HOST_NAME,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });

    let info = await transpoter.sendMail({
        from : `TempShare <${from}>`,
        to,
        subject,
        text,
        html
    })
    console.log(info);

}

module.exports=sendMail;