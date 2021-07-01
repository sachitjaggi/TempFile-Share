const express=require('express');
const path=require('path');

const app =express();
const port= process.env.PORT || 5000 ; 

app.use(express.static('public'));

const connectDb=require('./Config/database.js');
connectDb();


// Template Engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');


// Routes
app.use(express.json());
app.use('/api/files',require('./Routes/files'));
app.use('/files' ,require('./Routes/show'))
app.use('/files/download',require('./Routes/download'));

app.listen(port,() =>{
    console.log(`Server is listening at port ${port} ..`);
});
    
