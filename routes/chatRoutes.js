import express from 'express';
import axios from 'axios';
import Conversation from '../models/conversations.js';

const router = express.Router();

router.post('/', async(req, res) => {
  
  try{   
    const { message, conversationId } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        data: {"contents": [ {  "parts": [   {   "text": `${message}`   }   ]  }]  }
    });
    const reply = response.data.candidates[0].content.parts[0].text;

    // Save to conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: [
            {sender: "user", text: message, timeStamp: new Date()},
            {sender: "bot", text: reply, timeStamp: new Date()},
          ]
        },
        updatedAt: new Date()
      }
    );

    res.json({ reply });
  }

  catch (error) {
    console.log("Error: ", error.message);
    if (error.response && error.response.status === 429) {
      return res.status(429).json({ error: "Rate limit reached. Please try again later." });
    }
    res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;