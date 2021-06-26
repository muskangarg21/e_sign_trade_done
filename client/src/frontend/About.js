import React, { useEffect, useState } from 'react';
import About from "./sign_pad.js";
import call from './service';           //here you can use axios
import toastDisplay from './toastNotification';


const FilePreview = ({fileData}) => {
    const [data, setData] = useState([]);
    const [fileResult, setfileResult] = useState({});
    const [showLoader, setshowLoader] = useState(false);
    const [docDetailsDB, setdocDetailsDB] = useState({});
    const [signData, setsignData]=useState({});
    //const [signId, setsignId]= useState(0);
   
    //const [flag, setflag] = useState(false);

    useEffect(() => {
        window.onload = function () {
        try {
        var url_string = (window.location.href);
        var url = new URL(url_string);
        var signer_id = url.searchParams.get('id');
        //setsignId(signer_id);
        //console.log("signid",signId);
        //setflag(true);
        var type = url.searchParams.get('type');
        
        console.log(signer_id + ' ', type);
        

        call('POST', 'signid',{"id":signer_id}).then((result1) => {
          console.log("userId Result-->", result1)
          setsignData(result1)
          // call('POST', 'userdocdetails/1621', { 'tbldocid': 1621 }).then((result) => {
          //     console.log("getdocId Result-->", result)
          setdocDetailsDB(result1)
          console.log("docdetails",docDetailsDB);
  
          call('POST', 'signfilehash', { 'fileHash': 'ba48df56abf360af7098d085058079ed' }).then((result2) => {
          console.log("getDoc fileResult-->", result2)               
          if (result2) {
              console.log(result2);
              setfileResult(result2)
              setshowLoader(false);
              console.log("FILEREUS",fileResult.filebase64);   
          }
          }).catch(err => {
          setshowLoader(false)
          console.log("previewFile error:->", err)
          toastDisplay(err, "error");
          })
  
          // }).catch(err => {
          //     console.log("getdocdetails error:->", err)
          //     toastDisplay(err, "error");
          // })
      }).catch(err => {
          console.log("getdocdetails error:->", err)
          toastDisplay(err, "error");
      })
        
        } catch (error) {
        
        }
        }
        }, []); 

    function getSourceType(mime) {
        return ((mime === "png" || mime === "PNG") ? "data:image/png;base64," :
          (mime === "jpg" || mime === "JPG") ? "data:image/jpeg;base64," :
            (mime === "pdf" || mime === "PDF") ? "data:application/pdf;base64," : "")
      }

    function viewTheFile(result) {
        console.log("filename",docDetailsDB.file_Name)
        let mime = docDetailsDB.file_name.split(".").pop()
        console.log("jkadbd",mime);        
        console.log(docDetailsDB.file_name);        
        let sourceType = getSourceType(mime)
        return (
          <div>
            {
              (mime === "pdf" || mime === "PDF") ?
                <iframe title="Document Preview" frameborder="0" width='100%' height='100%' 
                  src={sourceType + encodeURI(result.filebase64 ? result.filebase64 : "")}></iframe>
                :
                <img src={sourceType + encodeURI(result.filebase64 ? result.filebase64 : "")} alt={fileData.file_name} />
            }
          </div>
    
        )
      }


    //if(flag)      {
    
    //setflag(false);
//}
   // console.log("gkjhhfh",fileResult.filebase64);
    return (
        <div>
            <div>                          
                {fileResult.filebase64 && viewTheFile(fileResult)}
            </div>
            <About/>
        </div>)
}

export default FilePreview
