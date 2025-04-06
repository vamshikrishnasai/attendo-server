const express = require("express");
const { sendDataToDb, getDataFromDb } = require("../controllers/controlData");
const router = express.Router();

router.post("/sendData", async (req, res) => {
  try {
    const response = await sendDataToDb(req.body);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getData", getDataFromDb);

module.exports = router;
