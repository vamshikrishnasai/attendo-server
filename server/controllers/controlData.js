const userModel = require("../models/userModel");

exports.sendDataToDb = async (req, res) => {
    try {
        console.log(" Received data:", req.body); 

        const { barcode, timestamp } = req.body;  

        if (!barcode || !timestamp) {
            console.log(" Missing required fields:", { barcode, timestamp });
            return res.status(400).json({
                success: false,
                message: "Barcode and timestamp are required",
            });
        }

        const formattedTime = new Date(timestamp);
        if (isNaN(formattedTime.getTime())) {
            console.log("Invalid Timestamp:", timestamp);
            return res.status(400).json({
                success: false,
                message: "Invalid timestamp format",
            });
        }

        console.log(" Attempting to save to MongoDB:", { rollno: barcode, time: formattedTime });

        const data = await userModel.create({ rollno: barcode, time: formattedTime });

        console.log("Data successfully inserted:", data);
        return res.status(201).json({
            success: true,
            message: "Data saved successfully",
            data,
        });
    } catch (error) {
        console.error("Error saving data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


exports.getDataFromDb = async (req, res) => {
    try {
        console.log("Fetching all attendance records...");

       
        const data = await userModel.find({}, "rollno time -_id");

        if (!data||data.length==0) {
            console.log("No attendance records found.");
            return res.status(404).json({ success: false, message: "No attendance records found", data: [] });
        }

        console.log(`Fetched ${data.length} records successfully.`);
        return res.status(200).json(data); 
    } catch (error) {
        console.error("Error retrieving attendance data:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};