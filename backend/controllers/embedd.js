const pdfLib = require('pdf-lib');
const fs = require('fs');
const md5 =require('md5-file');
const connect =require('../database/connectdb');
const mysql = require('mysql2');
const { sign } = require('crypto');
const pool = connect.pool;

// const userPdf = fs.readFile('Week4_L20_1.pdf',(err,data)=>{
//     console.log(data);
// });

// const pdfDoc =  await pdfLib.PDFDocument.load(userPdf);
var imgHash;
exports.hello = async (req,res)=>
{
  try{

    //fetch sign data from datbase


    let id = req.body.signer_id;
    let base64DataUrl = req.body;
    console.log("Hello");
    pool.getConnection((err,connection)=>{
      if(err){
        console.log("herer");
        console.log(err);
        res.json({
          success:false,
          msg:'Failed to connect'
        })
      }else{
        var sqlQuery = "SELECT* FROM `tbl_signdetails` WHERE id =" +mysql.escape(id);
        connection.query(sqlQuery,(err,rows)=>{
          if(err){
            res.json({
              success:false,
              msg:'Failed to connect'
            })
          }else{
            console.log(rows);
            
            embeddingimage(rows[0],base64DataUrl);
          }
        });
      }
    })
    // const base64DataUrl = req.body.imagebase64; 
    // console.log(req.body);
    // //console.log(base64DataUrl);
    // imgHash = decodeBase64img(base64DataUrl);
    // //docs\ba48df56abf360af7098d085058079ed
    // let docPath = './docs/ba48df56abf360af7098d085058079ed';
    // const pdfDoc = await pdfLib.PDFDocument.load(fs.readFileSync(docPath));
    // const imgPath = 'uploads/1615.png'  
    // const check = fs.readFileSync(imgPath);

    // //getting the pages of the pdf file
    // const pages = pdfDoc.getPages(); 
    // const embeddSign = await pdfDoc.embedPng(check);
    // const pngDims = embeddSign.scale(0.5);  
    // let id = req.body.signer_id;
    // getSignData(id);   

  }catch(err)
  {
      console.log(err);
  }
  //res.send(ans);
//console.log(cover);
}


async function embeddingimage(signData,base64DataUrl){
  imgHash =decodeBase64img(base64DataUrl);
  //docs\ba48df56abf360af7098d085058079ed
  let file_hash = signData.file_hash;
  let docPath = './docs/'+ file_hash+'.pdf';
  const pdfDoc = await pdfLib.PDFDocument.load(fs.readFileSync(docPath));
  const imgPath = 'uploads/1615.png'  
  const check = fs.readFileSync(imgPath);

  //pages
  const pages = pdfDoc.getPages(); 
  const embeddSign = await pdfDoc.embedPng(check);
  const pngDims = embeddSign.scale(0.5); 

  let pagesto = signData.Pagenum;
  let pagesToBeSigned = pagesto.split(",").map(Number);  
  let whereToEmbedd = signData.position;
  let ratio = signData.ratio;
  for(let i=0;i<pagesToBeSigned.length;i++){
    let pageNo = pagesToBeSigned[i]-1;
    let dimensions = pages[pageNo].getSize();
    embeddSignPageNo(embeddSign,pngDims,pages[pageNo],dimensions,whereToEmbedd,ratio);
  }


  const signedPdf = await pdfDoc.save();  
  console.log("HuRRAYY!!!!!!!!");

  let tempFilePath = './signed_docs/'+imgHash
  fs.writeFileSync(tempFilePath,signedPdf);

  //generating fileHash of the signed Pdf
  const signedFileHash = md5.sync(tempFilePath);
  console.log(signedFileHash);

  const signedFilePath = './docs/'+signedFileHash + '.pdf';
  fs.rename(tempFilePath,signedFilePath,(err)=>{
    if(err)console.log(`ERROR: ${err}`);
  })
  insertSignedFileHash(signedFileHash);
}












// exports.signPos = async(req,res)=>{
//   console.log("Working");
//   try{
//     var signData = req.body; 
//     // var position = req.body.position;
//     // var pageNum = req.body.name;
//     //pageNum = pageNum-1;   

//     // pdf-lib
    
//     const pdfDoc = await pdfLib.PDFDocument.load(fs.readFileSync('Week1_L3_0.pdf'));
    
//     const imgPath = 'uploads/1615.png'  
//     const check = fs.readFileSync(imgPath);

//     //getting the pages of the pdf file
//     const pages = pdfDoc.getPages(); 
//     const embeddSign = await pdfDoc.embedPng(check);
//     const pngDims = embeddSign.scale(0.5);    
//     //array of page numbers that are to be signed by the user
//     //const pagesToBeSigned = [];
//     //const embeddPlace = ['Top-Left','Top-Center','Top-Right','Middle-Right','Bottom-Right','Bottom-Center','Bottom-Left','Center-Left','Center'];
//     //signing the pages
//     // for(i=0;i<pagesToBeSigned.length;i++){
//     //   let pageNo = pagesToBeSigned[i];
//     //   let whereToEmbedd = embeddPlace[i];
//     // let dimensions = pages[0].getSize();    
//     //   //console.log(`Height is ${dimensions.height} and Width is ${dimensions.width}`);
//     // embeddSignPageNo(embeddSign,pngDims,pages[0],dimensions,position);
//     //}

//     //working code ------------------------------------------------------
//     for(let i=0;i<signData.length;i++){
//       let pageNo = signData[i].Pagenum - 1;
//       console.log(pageNo);
//       let whereToEmbedd = signData[i].position;
//       let ratio = signData[i].ratio;
//       let dimensions = pages[pageNo].getSize();
//       embeddSignPageNo(embeddSign,pngDims,pages[pageNo],dimensions,whereToEmbedd,ratio);
//     }
    
    
//     const signedPdf = await pdfDoc.save();  
//     console.log("HuRRAYY!!!!!!!!");

//     let tempFilePath = './signed_docs/'+imgHash
//     fs.writeFileSync(tempFilePath,signedPdf);

//     //generating fileHash of the signed Pdf
//     const signedFileHash = md5.sync(tempFilePath);
//     console.log(signedFileHash);

//     const signedFilePath = './signed_docs/'+signedFileHash + '.pdf';
//     fs.rename(tempFilePath,signedFilePath,(err)=>{
//       if(err)console.log(`ERROR: ${err}`);
//     })

//     //inserting the signedfilehash int the database
//     //insertSignedFileHash(signedFileHash);
//     //-- working code endssssssssssssssssssssssssss
//     // for(let i=0;i<signData.length;i++)
//     // {
//     //   insertAddUserData(signData[i]);
//     // }
//   }catch(err){
//     console.log(err);
//   }
// };







let decodeBase64img = (base64DataUrl)=>{
  const refinedDataUrl = base64DataUrl.imagebase64.split(';base64,').pop();    
  const uploadPath = 'uploads/'

  const imgu = fs.writeFileSync(uploadPath +'1615.png',refinedDataUrl,{encoding: 'base64'});

  return md5.sync(uploadPath +'1615.png');

};

let embeddSignPageNo = (embeddSign,imgDims,pageNo,dimensions,whereToEmbedd,ratio)=>{
  let numRatio;
  if(ratio=='small')numRatio = 12;
  else if(ratio=='medium')numRatio =8;
  else if(ratio=='large')numRatio=6;
  let width = dimensions.width/numRatio,height =dimensions.height/numRatio;
  if(whereToEmbedd=='Top-Right'){
    pageNo.drawImage(embeddSign,{
      x: dimensions.width -width,
      y: dimensions.height-height,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Middle-Right'){
    pageNo.drawImage(embeddSign,{
      x: dimensions.width -width,
      y: (dimensions.height-height)/2,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Bottom-Right'){
    pageNo.drawImage(embeddSign,{
      x: dimensions.width -width,
      y: 0,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Bottom-Center'){
    pageNo.drawImage(embeddSign,{
      x: (dimensions.width -width)/2,
      y: 0,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Bottom-Left'){
    pageNo.drawImage(embeddSign,{
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Middle-Left'){
    pageNo.drawImage(embeddSign,{
      x: 0,
      y: (dimensions.height-height)/2,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Top-Left'){
    pageNo.drawImage(embeddSign,{
      x: 0,
      y: dimensions.height-height,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Top-Center'){
    pageNo.drawImage(embeddSign,{
      x: (dimensions.width -width)/2,
      y: dimensions.height-height,
      width: width,
      height: height,
    })
  }else if(whereToEmbedd=='Middle-Center'){
    pageNo.drawImage(embeddSign,{
      x: (dimensions.width -width)/2,
      y: (dimensions.height-height)/2,
      width: width,
      height: height,
    })
  }
};

let insertSignedFileHash = (signedFileHash)=>{
  pool.getConnection((err,connection)=>{
    let sqlQuery = `UPDATE tbl_document_details
                    SET file_hash = ?
                    WHERE id = ?`;
    let insertData = [signedFileHash,1615];
    connection.query(sqlQuery,insertData,(err,rows)=>{
      if(err)console.log(err);
      else{
        console.log("Updated succesfully");
      }
    });
  });
}



let insertAddUserData = (signData)=>{
  // pool.getConnection((err,connection)=>{
  //   let sqlQuery = `INSERT INTO`
    
  // });
}


// res.writeHead(200,{
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition':  'inline',
  //     'Content-Length': signedPdf.length
  // })
  //res.write(signedPdf);


  