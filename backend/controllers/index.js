const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');
const connect = require('../database/connectdb');

const pool = connect.pool;


// post method get doc details
exports.connectDb = async (req,res)=>{
    
  if(!req.files){
    res.send({
      success: false,
      msg:'No file selected, Please select a file'
    });
  }else{  
    const uploadedFile = req.files.document;    
    const allowedExtensions = /pdf|doc|docx/;
    const extname = path.extname(uploadedFile.name);
        
    const fileSize = uploadedFile.size;
    const maxAllowedSize = 1024*1024*100;
    if(!allowedExtensions.test(extname)){
        res.send({
            success: false,
            msg: `You have uploaded a file with extension ${extname}, Please a upload either a pdf or a doc file`
        });
    }
    else if(fileSize>maxAllowedSize){
        res.send({
            success: false,
            msg: "The file uploaded is too large!! Please try again with a smaller file size"
        });
    }else{
      const uploadRemark = req.body.name;
      const docFile = {[uploadRemark]:uploadedFile};
      const loggedUserData ={
          userId: 1000
      // userEmail: req.body.emailId 
      };
    //working
      let fileKeys = Object.keys(docFile);    
      var insertData;   
      try{            
        fileKeys.map((value)=>{  
          fs.writeFileSync('./docs/' + docFile[value].md5, docFile[value].data);
          insertData = {
            doc_no: "",
            doc_name: value,      
            file_Name: docFile[value].name,
            gen_doc_label: value,
            file_hash: docFile[value].md5,
            //file: docFile[value].data,
            valid_upto: null,
            category: 16,
            mst_doc_id:54,
            created_at: new Date(),
            created_by: loggedUserData.userId,
            modified_at: new Date()
          }        
        });       
        

      //inserting data into db
        const docDetails = await insertDocData(insertData)
        console.log(docDetails);
        console.log("Successfull!!!");
        res.send({
          success: true,
          message: docDetails
        })
      }catch(err){
        console.log("Some error!!!");
        res.send({
          success: false,
          message: "Failed"
        })
      }
    }//2nd else 
  }//else
}

//inserting the doc details into the table
let insertDocData =  async function(insertData){
  return new Promise(async (resolve,reject)=>{
    try{
      pool.getConnection((err,connection)=>{
        if(err) console.log(err);
        else{
        console.log("Connection made succesfully!!!!!");
    
        //Inserting
        connection.query('INSERT INTO tbl_document_details SET ?',insertData,(err,rows)=>{
        connection.release();
          
        if(!err){        
          
          resolve({
            "docDetails": "Insertion of row done!!"
          });
         // console.log("File uploaded successfully");
         
        }else{        
          console.log(err);
        }
          
        });
        } 
      });

    }catch(err){
      reject(err);
    }
  });
}



//post request for filehash
exports.getDocRoute = async (req, res) => {
  //console.log("am i reachable")
  
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

//filehash function
let getDocFunc = async function(fileHash){
  return new Promise((resolve,reject)=>{
    try{
     // console.log(fileHash);
      if (!fileHash) {
        throw ('Invalid Request! Required params not found.')
      }else {        
        let docPath = `./docs/${fileHash}`;        
        var filebase64 = base64_encode(docPath);
        resolve({
            "filebase64": filebase64,
        });
      }
    }catch(err){
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



//get req
exports.getAllDocs = (req,res)=>{
  try{
    pool.getConnection((err,connection)=>{
      if(err)console.log(err);
      else{
        var whoCreated = 1000;
        var sqlQuery = 'SELECT* FROM  tbl_document_details WHERE created_by =' + mysql.escape(whoCreated);
        connection.query(sqlQuery,(err,rows)=>{
          if(err)console.log(err);
          else{
            res.json({
              success: true,
              message: rows
          });
          }
        });
      }
    });
  }catch(err){
    res.json({
      success: false,
      message: 'User has uploaded no files'
  });
  }    
}


//get doc details
exports.getDocDetails =(req,res)=>{
  
  try{
    const id = req.params.id;
    pool.getConnection((err,connection)=>{
      var sqlQuery = "SELECT* FROM tbl_document_details WHERE id =" +mysql.escape(id);
      connection.query(sqlQuery,(err,rows)=>{
        if(err)console.log(err);
        else{
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








