const express=require('express');
router=express();
const File=require('../Model/file');

router.get('/:uuid' ,async (req,res) => {
    try{

       const file= await File.findOne({uuid:req.params.uuid})
        
       if(!file){
           return res.render('download',{error:"Link has expired"});
       }
       const filePath=`${__dirname}/../${file.path}`;
       res.download(filePath);
    }
    catch (err){

    }
});



module.exports=router;


