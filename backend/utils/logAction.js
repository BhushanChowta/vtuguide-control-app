// utils/logAction.js
const ActionLog = require('../models/ActionLog');

const logAction = async (userId, actionType, blogId = null, postId = null) => {
  try {

    const log = new ActionLog({
      userId,
      actionType,
      blogId,
      postId,
    });
    await log.save();

    console.log('Action logged: ',userId, actionType, blogId, postId);

  } catch (error) {
    console.error('Error logging action:', error);
  }
};

module.exports = logAction;
