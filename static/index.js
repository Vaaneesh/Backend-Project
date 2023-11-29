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
        div.innerHTML=`${taskitem}<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>`;
        tasklist.append(div);
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
        div.innerHTML=`${task}<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>`;
        tasklist.append(div);

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
        const updatedDiv=document.createElement("div");
        updatedDiv.innerHTML=`${newTaskname} <button class="edit-btn">Edit</button><button class="delete-btn">Delete</button>`;
        inputField.replaceWith(updatedDiv);
        
        updatedDiv.querySelector(".edit-btn").addEventListener("click",async()=>{
            editTask(task,updatedDiv);
        })

        updatedDiv.querySelector(".delete-btn").addEventListener("click",async()=>{
            await deletetask(task,updatedDiv);
        })
    })
    inputField.focus();
}
async function getdata(Api){
    let data=await fetch(`http://localhost:3333${Api}`);
    let responsedata=await data.json();
    console.log(responsedata);
    showData(responsedata);
}
getdata("/gettodo");
