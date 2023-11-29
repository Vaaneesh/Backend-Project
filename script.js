const express=require("express");
const app=express();
let path=require("path");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

let todo=require("./todos/JS/script");
app.use(express.static(path.join(__dirname,"static")))

app.get("/gettodo",async(req,res)=>{
    let data=await todo.gettodo();
    res.send(data);
})
app.post("/addtodo",async(req,res)=>{
    let {task}=req.body;
    let msg=await todo.addtodo(task);
    res.redirect("/");
})
app.delete("/deletetodo",async (req,res)=>{
    const taskToDelete = req.body.task;
        await todo.deletetodo(taskToDelete);
        res.json({ message: "Task deleted successfully" });
    // try {
    //     const taskToDelete = req.body.task;
    //     await todo.deletetodo(taskToDelete);
    //     res.json({ message: "Task deleted successfully" });
    // } catch (error) {
    //     console.error("Error deleting todo:", error);
    //     res.status(500).json({ error: "Internal Server Error" });
    // }
})
app.put("/edittodo",async(req,res)=>{
    const{oldTask,newTask}=req.body;
    await todo.edittodo(oldTask,newTask);
    res.json({message:"Task edited"});
})
app.listen(3333,()=>{
    console.log("server started!...");
})