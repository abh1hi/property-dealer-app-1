const Chat = require('../models/Chat');
const asyncHandler = require('express-async-handler');

// @desc    Initiate chat with property owner
// @route   POST /api/chat/start
// @access  Private
const startChat = asyncHandler(async (req, res) => {
  const { ownerId } = req.body;
  const userId = req.user.id;

  const chat = await Chat.findOrCreate([userId, ownerId]);

  res.status(200).json(chat);
});

// @desc    Get chat messages
// @route   GET /api/chat/:chatId/messages
// @access  Private
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Chat.getMessages(chatId);

  if (!messages) {
    res.status(404);
    throw new Error('Chat not found');
  }

  res.status(200).json(messages);
});

module.exports = {
  startChat,
  getChatMessages,
};
