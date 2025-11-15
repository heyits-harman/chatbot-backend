import express from 'express';
import Conversation from '../models/conversations.js'
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: "uploads/" });  

router.post('/analyze', upload.single("image"), async(req, res) => {
  
  try{
    const image = req.file;  
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenerativeAI(apiKey);  

    console.log("File received:", image);
    console.log("Prompt:", req.body.prompt);

    if(!image){
      return res.status(400).json({ error: "No Image Uploaded" });
    }

    const base64Image = fs.readFileSync(image.path, { encoding: "base64" });

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });  

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: image.mimetype,  
          data: base64Image,
        }
      },
      req.body.prompt || "Describe this image",
    ]);

    const response = result.response.text();  
    
    fs.unlinkSync(image.path);  // Clean up uploaded file
    
    await Conversation.findByIdAndUpdate(
      req.body.conversationId,
      {
        $push: {
          messages: [
            {sender: "user", text: req.body.prompt || 'Analyze this image', timeStamp: new Date()},
            {sender: "bot", text: response, timeStamp: new Date()},
          ]
        },
        updatedAt: new Date()
      }
    );

    res.json({ reply: response }); 
    
  }

  catch(err){
    console.log("Error: ", err.message);
    console.log("Full error:", err); 
    
    if(req.file && req.file.path && fs.existsSync(req.file.path)){
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: "Error understanding the image!" });
  }

});

export default router;