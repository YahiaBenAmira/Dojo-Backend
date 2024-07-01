const router = require("express").Router();
const { CreateTask, GetAllTasks, UpdateTaskStatus, postDC, AssignTaskToUser, RetrieveAssignedUsers } = require("../controllers/tasks");

router.post("/create-task", CreateTask);
router.post('/assign-user/:task_id',AssignTaskToUser)
router.get("/get-tasks", GetAllTasks);
router.get("/user-tasks/:task_id",RetrieveAssignedUsers)
router.put("/update-status/:task_id",UpdateTaskStatus)
module.exports = router;
