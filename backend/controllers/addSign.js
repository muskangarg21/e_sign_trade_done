const nodemailer = require('nodemailer');

//const { pool } = require('../database/connectdb');
const uuid = require('uuid').v4();

const connect = require('../database/connectdb');

const pool = connect.pool;
//const hbs = require('nodemailer-express-handlebars');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.useremail,                   //this is the mail you have to use
    pass: process.env.userpass
  }
});
 
exports.sendMail = async(req,res)=>{
        //const uniqueId = uniqueId;
        const signData = req.body;        //console.log(signData);
        console.log(signData);
        insertAddSign(signData);
        console.log('asuyncc donee');        
        
}

function insertAddSign(signData){
  
    var userSignData =[]
    for(let i=0;i<signData.length;i++)
    {
      delete signData[i].errors;
      userSignData.push(Object.values(signData[i]));
    }
    pool.getConnection((err,connection)=>{   
      var sqlQuery = 'INSERT INTO tbl_add_sign_details (email,Pagenum,position,usertype,ratio,tblDocId) VALUES ?';
      connection.query(sqlQuery,[userSignData],(err,rows)=>{
        if(err)console.log(err);
        else{
          console.log('insertion of rows done');
          console.log(rows.insertId);
          console.log(rows);
          var firstId = rows.insertId;
          var lastid = firstId + rows.affectedRows;
          for(let i=0;i<signData.length;i++)
          {
            signData[i].id = firstId;
            firstId++;
          }
          //console.log(signData);
          sendEmailToUser(signData);
        }
      })
    })
  
}



function sendEmailToUser(signData){
  
  const baseUrl = 'http://localhost:3000/invite/';

  
  //const insertId ='5';
  for(let i=0;i<signData.length;i++)
  {
    var mailOptions = {
      from: 'harshalb1101@gmail.com',
      to: signData[i].email,
      subject: 'Invite Link',
      text: 'Helloo',
      html: `<p>Hey user, you have been added for Invoice Discounting Finance. For reviewing it <a href="${baseUrl}financerequest?id=${encodeURIComponent(signData[i].id)}&type=${encodeURIComponent(3)}">Click Here</a></p>`
    // attachments: [
    //     {filename:'Week3_L16.pdf',path:'./Week3_L16.pdf'}
    // ]
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      
      console.log(error);
      
    } else {

      console.log('Email sent: ' + info.response);
     
    }
    });
    console.log('cALLBACKKK');
 }

}
