const { rejects } = require("assert");
let fs=require("fs");
let path= require("path");
let filePath=path.join(__dirname,"..","data","todo.js")
class todo{
    static gettodo(){
        return new Promise((resolve,reject)=>{
            fs.readFile(filePath,
            {
                encoding:"utf-8"
            },
            (err,data)=>{
                if(err)return reject(err.message);
                resolve(JSON.parse(data));
            }
            )
        })
    }
    static addtodo(value){
        return new Promise((resolve,reject)=>{
            fs.readFile(filePath,
                {
                    encoding:"utf-8"
                },
                (err,data)=>{
                    if(err)return reject(err.message);
                    if(data.length>0){
                        data=JSON.parse(data);
                        data.push(value);
                        fs.writeFile(filePath,
                            JSON.stringify(data),
                            (err)=>{
                                if(err)return reject(err.message);
                                resolve("task added successfully!");
                            })
                    }
                }
                )
        })
    }
    static async edittodo(oldTask,newTask){
        return new Promise(async (resolve,reject)=>{
            try{
                let tasks=await this.gettodo();
                const index=tasks.indexOf(oldTask);
                if(index!=-1){
                    tasks[index]=newTask;// Update
                    // Save
                    await this.saveTasks(tasks);
                    resolve("task edited");
                }
                else{
                    resolve("Task not found");
                }
            } catch(error){
                reject(error);
            }
        })
    }

    static async saveTasks(tasks){
        return new Promise((resolve,reject)=>{
            fs.writeFile(filePath,JSON.stringify(tasks),(err)=>{
                if(err) {
                    reject(err.message);
                }
                else{
                resolve();
                }
            })
        })
    }
    static deletetodo(tasktodelete){
        return new Promise(async(resolve,reject)=>{
            try{
                let tasks=await this.gettodo();
                tasks=tasks.filter((task)=>task!==tasktodelete);
                await this.saveTasks(tasks);
                resolve("task deleted");
            }catch(error){
                reject(error);
            }
        })
        // return new Promise((resolve,reject)=>{
        //     fs.readFile(filePath,
        //         {
        //             encoding:"utf-8",
        //         },
        //         (err,data)=>{
        //             if(err)return reject(err.message);
        //             if(data.length>0){
        //                 data=JSON.parse(data);
        //                 data=data.filter((task)=>task!==tasktodelete);
        //                 fs.writeFile(
        //                     filePath,
        //                     JSON.stringify(data),
        //                     (err)=>{
        //                         if(err)return reject(err.message);
        //                         resolve("Task deleted successfully")
        //                     }
        //                 )
        //             }
        //         })
        // })
    }
}
module.exports=todo;