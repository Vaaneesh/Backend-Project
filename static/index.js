let tasklist=document.querySelector(".tasklist");
let form=document.querySelector(".myform");
let input=document.querySelector("#taskitem");


form.addEventListener("submit",(ev)=>{
    ev.preventDefault();
    let taskitem=input.value;
    axios.post("/addtodo",{
        task:taskitem
    }).then((data)=>{
        console.log(data);
        input.value="";
        let div=document.createElement("div");
        div.innerHTML=`<span class="task-item"><span class="circle"></span>${taskitem}</span><button class="edit-btn"><i class="fa-solid fa-user-pen"></i></button> <button class="delete-btn">X</button>`;
        tasklist.append(div);

        div.querySelector(".task-item").addEventListener("click",()=>{
            div.querySelector(".task-item").classList.toggle("completed");
        })

        div.querySelector(".edit-btn").addEventListener("click",async()=>{
            editTask(taskitem,div);
        })

        div.querySelector(".delete-btn").addEventListener("click",async()=>{
            await deletetask(taskitem,div);
        })

    })
})

function showData(data){
    data.forEach(task => {
        let div=document.createElement("div");
        div.innerHTML=`<span class="task-item"><span class="circle"></span>${task}</span><button class="edit-btn"><i class="fa-solid fa-user-pen"></i></button> <button class="delete-btn">X</button>`;
        tasklist.append(div);

        div.querySelector(".task-item").addEventListener("click",()=>{
            div.querySelector(".task-item").classList.toggle("completed");
        })

        div.querySelector(".edit-btn").addEventListener("click",async()=>{
            editTask(task,div);
        })

        div.querySelector(".delete-btn").addEventListener("click",async()=>{
            await deletetask(task,div);
        })
    })
};
async function deletetask(task,div){
    try{
        await axios.delete("/deletetodo",{
            data:{
                task:task,
            },
        });
        div.remove();
    }
    catch(error){
        console.log("Error deleting todo: ",error);
    }
}
function editTask(task,div){
    const inputField=document.createElement("input");
    inputField.type="text";
    inputField.value=task;
    
    const taskElement=div.firstChild;
    
    taskElement.replaceWith(inputField);

    inputField.addEventListener("blur",async ()=>{
        const newTaskname=inputField.value;

        await axios.put("/edittodo",{
            oldTask:task,
            newTask:newTaskname
        });

        // taskElement.textContent=newTaskname;
        const updatedDiv = div.cloneNode(true); //remove existing event listeners
        updatedDiv.innerHTML=`<span class="task-item"><span class="circle"></span>${newTaskname}</span><button class="edit-btn"><i class="fa-solid fa-user-pen"></i></button><button class="delete-btn">X</button>`;
        div.replaceWith(updatedDiv);
        
        updatedDiv.querySelector(".edit-btn").addEventListener("click",async()=>{
            editTask(newTaskname,updatedDiv);
        })

        updatedDiv.querySelector(".delete-btn").addEventListener("click",async()=>{
            await deletetask(newTaskname,updatedDiv);
        })

        updatedDiv.querySelector(".task-item").addEventListener("click",()=>{
            updatedDiv.querySelector(".task-item").classList.toggle("completed");
        })
        
    })
    inputField.focus();
}
async function getdata(Api){
    let data=await fetch(Api);
    let responsedata=await data.json();
    console.log(responsedata);
    showData(responsedata);
}
getdata("/gettodo");
