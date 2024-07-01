const router = require('express').Router();
const {createTaskMsg,getCommentsForTask } = require('../controllers/tasksMessages')
router.post('/create-taskmsg/:task_id',createTaskMsg)
router.get("/get-comments/:task_id",getCommentsForTask )
module.exports = router