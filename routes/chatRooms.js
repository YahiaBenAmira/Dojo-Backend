const router = require('express').Router();
const { createChatRoom,joinChatRoom,inviteToChatroom,userChatRooms,sendChatRoomMessage, ValidationCode, joinedChatRooms,SendingPrivateMessage, JunctionAll, getUserChatRoom } = require('../controllers/chatRooms')

router.post('/create/:company_id',createChatRoom);
router.post('/allinfo/',JunctionAll)
router.post('/send-message',sendChatRoomMessage)
router.post('/private-message',SendingPrivateMessage)
router.get('/user/:user_id',getUserChatRoom)
router.get('/chatroom/:chatroom_id',userChatRooms)
router.post('/join/:user_id/:invitation_key', joinChatRoom);
router.post('/invite/:invited_user_id/:inviter_id/:invitation_key', inviteToChatroom);
module.exports = router