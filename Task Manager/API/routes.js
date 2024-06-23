let express=require("express")
let auth=require("./middleware/auth")
let authController=require("./controller/auth");
let router= express.Router()
let taskController=require("./controller/task")
let commentController=require("./controller/comment")


router.get("/",(req,res)=>{
    return res.send("welcome to my first Project")
})


// User Related Routes/APIs
router.post("/Register",authController.register);
router.post("/Login",authController.login);
router.put("/ForgetPassword",authController.forgetPassword);
router.put("/ResetPassword",authController.resetPassword);
router.put("/Logout",auth,authController.logout);
router.put("/ChangePassword",auth,authController.changePassword);


// Task Related Routes/APIs
router.post("/Task",auth,taskController.createTask);
router.put("/Task/assignTo/:taskId",auth,taskController.assignTo)
// WE  Should always Put Assignto above UPDate task 
router.put("/Task/:taskId",auth,taskController.updateTask);
router.get("/Task",auth,taskController.listTask);
router.get("/Task/:taskId",auth,taskController.detailTask);
router.delete("/Task/:taskId",auth,taskController.deleteTask);
router.put("/RestoreTask/:taskId",auth,taskController.restoreTask);
router.put("/Task/Status/:taskId",auth,taskController.taskStatus)

// Task Comment Related Routes/APIs
router.post("/Task/Comment/:taskId",auth,commentController.taskComment)
router.get("/Task/Comment/:taskId",auth,commentController.commentList);





module.exports=router; 