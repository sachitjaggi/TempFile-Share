const express=require('express');
const multer=require('multer');
const path=require('path');
const File=require('../Model/file');
const { v4:uuid4 }=require('uuid');
router=express();

let storage=multer.diskStorage({

    destination:(req,file,cb) => cb(null,'uploads/'),
    filename:(req,file,cb) =>{
        // Get a unique name
        const uniqueName =`${Date.now()}-${Math.round(Math.random()*1E9)}-${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }

});

let upload=multer({
    storage:storage,
    limit:{ fileSize : 100000*1024},

}).single('upfile');


router.post('/', (req,res) =>{
    // Store File

    upload(req,res,async (err)=>{
         // validate request
        if(!req.file){
            return res.json({error :"File is missing"})
        }
        if(err){
            return res.status(500).json({status:"error",error:err});
        }
        // Store Database
        const currFile=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        });
        // Response ->Link
        const response=await currFile.save();
        console.log('File upload successfull');
        return res.status(200).json({file:`file: ${process.env.App_Base_Url}/files/${response.uuid}`})
    })



})

router.post('/send', async (req,res) =>{
    const {uuid,emailTo,emailFrom}=req.body;
    // Validate request
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error: 'All fields are required'});
    }
    const file=await File.findOne({uuid:uuid});

    if(file.sender){
        return res.status(422).send({error: 'Email already sent'});

    }
    file.sender=emailFrom;
    file.reciever=emailTo;

    const response= await file.save();

    // Send email
    const sendMail=require('../Services/emailService');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:`TempShare file sharing`,
        text:`${emailFrom} shared a  file with you `,
        html:require('../Services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.App_Base_Url}/files/${file.uuid}`,
            size:parseInt(file.size/1024)+'KB',
            expires:'24 Hours'
        })
    });

    return res.send({success:true});



})

module.exports=router;