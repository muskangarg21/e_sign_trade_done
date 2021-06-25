//const e = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const connect = require('../database/connectdb');

const pool = connect.pool;

exports.sendDocDetails = (req,res)=>{
    try{
        const ido = req.body;
        const id = ido.id;
        console.log(ido)
        pool.getConnection((err,connection)=>{
            
            var sqlQuery = "SELECT* FROM tbl_document_details WHERE tbl_document_details.id =(SELECT tblDocId FROM tbl_add_sign_details WHERE tbl_add_sign_details.id=" +mysql.escape(id) +")";
            connection.query(sqlQuery,(err,rows)=>{
            if(err)console.log(err);
            else{
              console.log(rows[0]);
              res.json({
                success: true,
                message: rows[0]
              });
            }
          })
        });
      }catch(err){
        res.json({
          success: false,
          message: `NO files found with id ${id}`
        });
      }
}


exports.sendFileHash = async(req,res)=>{
  try {
    const fileHash = 'ba48df56abf360af7098d085058079ed';
    let docObj = await getDocFunc(fileHash);
    console.log("Successfully done");
    //console.log(docObj);
    res.send({
        success: true,
        message: docObj
    });
} catch (error) {
    console.log(error)
    res.send({
        success: false,
        message: 'Cannot get file!'
    })
}
}

let getDocFunc = async function(fileHash){
  return new Promise((resolve,reject)=>{
    try{
      console.log(fileHash);
      if (!fileHash) {
        throw ('Invalid Request! Required params not found.')
      }else {        
        let docPath = `./docs/${fileHash}`;        
        var filebase64 = base64_encode(docPath);
        console.log("Filebase64");
        resolve({
            
            "filebase64": filebase64,
        });
      }
    }catch(err){
      console.log(err);
      reject(err);
    }
  })
}




function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer.from(bitmap).toString('base64');
}

