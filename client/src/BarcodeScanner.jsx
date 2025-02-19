import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import jsQR from "jsqr"; 

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState(""); 
  const [timestamp, setTimestamp] = useState(""); 
  const [imageData, setImageData] = useState(""); 
  const [serverResponse, setServerResponse] = useState(""); 


  const sendToServer = async (barcode) => {
    const timestamp = new Date().toLocaleString(); 
    setTimestamp(timestamp); 

    try {
      const response = await fetch("http://localhost:8080/api/users/sendData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, timestamp }),
      });

      const data = await response.json();
      setServerResponse(data.message); 
      console.log("Server Response:", data.message);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            console.log("Scanned from Image:", code.data);
            setImageData(code.data);
            sendToServer(code.data); 
          } else {
            setImageData("No barcode found in image.");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      <h2>Scan Barcode</h2>

      <center>
      <BarcodeScannerComponent
        width={300}
        height={200}
        onUpdate={(err, result) => {
          if (result) {
            console.log("Scanned from Camera:", result.text);
            setScannedData(result.text);
            sendToServer(result.text); 
          }
        }}
        videoConstraints={{ facingMode: "user" }} // Use front camera
  
      />

      
      <p><strong>Scanned Data:</strong> {scannedData || "No barcode detected"}</p>
      <p><strong>Time Captured:</strong> {timestamp}</p>
       {/* <p><strong>Late comer:</strong> {}</p> */}
      <hr />

      
      <h3>Or Upload an Image</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      
      {imageData && <p><strong>Scanned from Image:</strong> {imageData}</p>}

      
      {serverResponse && <p style={{ color: "green" }}><strong>Server:</strong> {serverResponse}</p>}
      </center>
    </div>
  );
};

export default BarcodeScanner;

