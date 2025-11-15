import express from 'express';
import Conversation from '../models/conversations.js';

const router = express.Router();

// Get all conversations for a user
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt');
    
    res.json({ conversations });
  } catch (error) {
    console.log("Error fetching conversations:", error.message);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get specific conversation with messages
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    res.json({ conversation });
  } catch (error) {
    console.log("Error fetching conversation:", error.message);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// Create new conversation
router.post('/', async (req, res) => {
  try {
    const newConversation = await Conversation.create({
      userId: req.userId,
      title: req.body.title || 'Conversation',
      messages: []
    });
    
    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    console.log("Error creating conversation:", error.message);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Delete conversation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!deleted) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.log("Error deleting conversation:", error.message);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// Clear all messages in a conversation
router.delete('/:id/messages', async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { messages: [], updatedAt: new Date() },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    res.json({ message: "Messages cleared successfully" });
  } catch (error) {
    console.log("Error clearing messages:", error.message);
    res.status(500).json({ error: "Failed to clear messages" });
  }
});

export default router;