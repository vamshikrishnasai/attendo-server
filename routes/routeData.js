const express = require("express");
const { sendDataToDb,getDataFromDb} = require("../controllers/controlData"); 
const router = express.Router();

router.post("/sendData", sendDataToDb);
router.get("/getData", getDataFromDb); 

module.exports = router;
