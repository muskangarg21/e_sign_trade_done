const pdfLib = require('pdf-lib');
const fs = require('fs');
const md5 =require('md5-file');
const connect =require('../database/connectdb');
const pool = connect.pool;

// const userPdf = fs.readFile('Week4_L20_1.pdf',(err,data)=>{
//     console.log(data);
// });

// const pdfDoc =  await pdfLib.PDFDocument.load(userPdf);
var imgHash;
exports.hello = async (req,res)=>
{
  try{
    const base64DataUrl = req.body; 
    //console.log(base64DataUrl);
    imgHash = decodeBase64img(base64DataUrl);   

  }catch(err)
  {
      console.log(err);
  }
  //res.send(ans);
//console.log(cover);
}










exports.signPos = async(req,res)=>{
  console.log("Working");
  try{
    var signData = req.body; 
    // var position = req.body.position;
    // var pageNum = req.body.name;
    //pageNum = pageNum-1;   

    // pdf-lib
    const pdfDoc = await pdfLib.PDFDocument.load(fs.readFileSync('Week1_L3_0.pdf'));
    
    const imgPath = 'uploads/1615.png'  
    const check = fs.readFileSync(imgPath);

    //getting the pages of the pdf file
    const pages = pdfDoc.getPages(); 
    const embeddSign = await pdfDoc.embedPng(check);
    const pngDims = embeddSign.scale(0.5);    
    //array of page numbers that are to be signed by the user
    //const pagesToBeSigned = [];
    //const embeddPlace = ['Top-Left','Top-Center','Top-Right','Middle-Right','Bottom-Right','Bottom-Center','Bottom-Left','Center-Left','Center'];
    //signing the pages
    // for(i=0;i<pagesToBeSigned.length;i++){
    //   let pageNo = pagesToBeSigned[i];
    //   let whereToEmbedd = embeddPlace[i];
    // let dimensions = pages[0].getSize();    
    //   //console.log(`Height is ${dimensions.height} and Width is ${dimensions.width}`);
    // embeddSignPageNo(embeddSign,pngDims,pages[0],dimensions,position);
    //}

    //working code ------------------------------------------------------
    // for(let i=0;i<signData.length;i++){
    //   let pageNo = signData[i].Pagenum - 1;
    //   console.log(pageNo);
    //   let whereToEmbedd = signData[i].position;
    //   let ratio = signData[i].ratio;
    //   let dimensions = pages[pageNo].getSize();
    //   embeddSignPageNo(embeddSign,pngDims,pages[pageNo],dimensions,whereToEmbedd,ratio);
    // }
    
    
    // const signedPdf = await pdfDoc.save();  
    // console.log("HuRRAYY!!!!!!!!");

    // let tempFilePath = './signed_docs/'+imgHash
    // fs.writeFileSync(tempFilePath,signedPdf);

    // //generating fileHash of the signed Pdf
    // const signedFileHash = md5.sync(tempFilePath);
    // console.log(signedFileHash);

    // const signedFilePath = './signed_docs/'+signedFileHash + '.pdf';
    // fs.rename(tempFilePath,signedFilePath,(err)=>{
    //   if(err)console.log(`ERROR: ${err}`);
    // })

    // //inserting the signedfilehash int the database
    // insertSignedFileHash(signedFileHash);
    //-- working code endssssssssssssssssssssssssss
    for(let i=0;i<signData.length;i++)
    {
      insertAddUserData(signData[i]);
    }
  }catch(err){
    console.log(err);
  }
};







let decodeBase64img = (base64DataUrl)=>{
  const refinedDataUrl = base64DataUrl.imagebase64.split(';base64,').pop();    
  const uploadPath = 'uploads/'

  const imgu = fs.writeFileSync(uploadPath +'1615.png',refinedDataUrl,{encoding: 'base64'});

  return md5.sync(uploadPath +'1615.png');

};

let embeddSignPageNo = (embeddSign,imgDims,pageNo,dimensions,whereToEmbedd,ratio)=>{
  const width = dimensions.width/ratio,height =dimensions.height/ratio;
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
                    SET signed_file_hash = ?
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


  