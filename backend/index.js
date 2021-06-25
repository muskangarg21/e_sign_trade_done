const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(cors())
app.use(fileUpload());
app.use(express.urlencoded({limit:'50mb',extended:true}));
app.use(express.json({limit:'50mb',extended:true}));

 //app.set('view engine','ejs');

app.use('/',require('./routes/index'));

const PORT =3012;

app.listen(PORT,()=>{console.log(`Listening to PORT ${PORT}`)});