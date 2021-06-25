const express = require('express');
const icontrollers = require('../controllers/index');
const econtrollers = require('../controllers/embedd');
const scontrollers = require('../controllers/addSign');
const emailcontrollers = require('../controllers/emailPreview');
const router = express.Router();


//doc details
router.post('/userdocument',icontrollers.connectDb);

//getting the details of a particular fileHash
router.post('/userdochash',icontrollers.getDocRoute);

//getting the details of a particular doc
router.post('/userdocdetails/:id',icontrollers.getDocDetails);

// getting all docs uploaded by the user
router.get('/alldocs',icontrollers.getAllDocs);

router.post('/signimage',econtrollers.hello);

router.post('/signposition',econtrollers.signPos);


router.post('/addsign/:filehash',scontrollers.sendMail)


//email----
router.post('/signid',emailcontrollers.sendDocDetails);
router.post('/signfilehash',emailcontrollers.sendFileHash);
module.exports = router;
