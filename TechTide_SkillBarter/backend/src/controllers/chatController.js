const Chat = require('../models/Chat');
const Match = require('../models/Match');

// @desc    Get or create chat for a match
// @route   GET /api/chats/match/:matchId
// @access  Private
exports.getOrCreateChat = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    // Verify user is part of the match
    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1: req.user.id },
        { user2: req.user.id }
      ],
      status: { $in: ['accepted', 'completed'] }
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found or not accepted'
      });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      match: matchId,
      participants: { $all: [match.user1, match.user2] }
    }).populate('participants', 'name avatar');

    if (!chat) {
      chat = await Chat.create({
        participants: [match.user1, match.user2],
        match: matchId
      });
      
      await chat.populate('participants', 'name avatar');
    }

    // Get messages with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Chat.aggregate([
      { $match: { _id: chat._id } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: '$messages._id',
          sender: '$messages.sender',
          content: '$messages.content',
          messageType: '$messages.messageType',
          fileUrl: '$messages.fileUrl',
          readBy: '$messages.readBy',
          createdAt: '$messages.createdAt',
          updatedAt: '$messages.updatedAt'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        chat: {
          _id: chat._id,
          participants: chat.participants,
          match: chat.match,
          lastMessage: chat.lastMessage
        },
        messages: messages.reverse() // Return in chronological order
      },
      pagination: {
        page,
        limit,
        total: chat.messages.length,
        pages: Math.ceil(chat.messages.length / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text', fileUrl } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const message = {
      sender: req.user.id,
      content,
      messageType,
      fileUrl,
      readBy: [{ user: req.user.id }]
    };

    chat.messages.push(message);
    chat.lastMessage = chat.messages[chat.messages.length - 1]._id;
    await chat.save();

    // Populate the new message for response
    const newMessage = chat.messages[chat.messages.length - 1];
    await newMessage.populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:chatId/messages/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all unread messages as read
    chat.messages.forEach(message => {
      const alreadyRead = message.readBy.some(
        read => read.user.toString() === req.user.id
      );
      
      if (!alreadyRead) {
        message.readBy.push({ user: req.user.id });
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      data: { updated: true }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    // Get unread counts
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = chat.messages.filter(message => 
          !message.readBy.some(read => read.user.toString() === req.user.id)
        ).length;

        return {
          ...chat.toObject(),
          unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: chatsWithUnread
    });
  } catch (error) {
    next(error);
  }
};