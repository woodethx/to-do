import bus from "./pubsub";

export default function init(){
    bus.subscribe("project:added", renderProjects);
    bus.subscribe("todo:added", renderList);
}

let currentProjectBtn = null;

function renderProjects(projects){
    const projCon = document.querySelector("#projCon");
    projCon.innerHTML = "";
    projects.forEach(project => {
        const projDiv = document.createElement("button");
        projDiv.innerText = project.name;
        projDiv.dataset.id = project.id;
        projCon.appendChild(projDiv);
        projDiv.addEventListener("click", () => {
            if(currentProjectBtn) currentProjectBtn.classList.remove("selectedProject");
            projDiv.classList.add("selectedProject");
            currentProjectBtn = projDiv;
            renderList(project);
        })
        if(currentProjectBtn) currentProjectBtn.classList.remove("selectedProject");
        projDiv.classList.add("selectedProject");
        currentProjectBtn = projDiv;
        renderList(project);
    });
    const addDiv = document.createElement("button");
    addDiv.classList.add("addProj");
    addDiv.textContent = "+";
    const projInput = document.createElement("input");
    projInput.addEventListener("blur", () => {
        projInput.value = "";              
        projInput.classList.add("invisible");
    });
    projInput.addEventListener("keydown", e=>{
        if(e.key === "Enter"){
            const name = projInput.value.trim();
            if (!name) return;
            bus.publish("addProj", { name });
            projInput.value = "";              
            projInput.classList.add("invisible");
        }
        if(e.key === "Escape"){
            projInput.value = "";              
            projInput.classList.add("invisible");
        }
    });
    projInput.classList.add("invisible");
    addDiv.append(projInput);
    addDiv.addEventListener("click", () => {
        projInput.classList.remove("invisible");
        projInput.focus();
    });
    projCon.appendChild(addDiv);
}
function renderList(project){
    const toDoHead = document.getElementById("toDoHead");
    toDoHead.innerText = project.name+" Tasks:"
    const listCon = document.querySelector("#listCon");
    listCon.innerHTML = "";
    project.toDos.forEach(toDo => {
        const toDoDiv = document.createElement("div");
        toDo.completed ? toDoDiv.classList.add("completedToDo") : toDoDiv.classList.remove("completedToDo");
        toDoDiv.classList.add("toDoItem");
        toDoDiv.dataset.id = toDo.id;
        const checkbox = document.createElement("button");
        checkbox.classList.add("checkbox");
        toDo.completed ? checkbox.innerHTML = "&#x2713" : checkbox.innerHTML = "";
        checkbox.addEventListener("click", () => {
            toDo.toggle();
            console.log(toDo.completed);
            toDoDiv.classList.toggle('completedToDo', toDo.completed);
            toDo.completed ? checkbox.innerHTML = "&#x2713" : checkbox.innerHTML = "";
        })
        const toDoTitle = document.createElement("h3");
        toDoTitle.innerText = toDo.title;
        const toDoDesc = document.createElement("p");
        toDoDesc.classList.add("secondRow");
        toDoDesc.innerText = toDo.desc;
        toDoDiv.append(checkbox, toDoTitle, toDoDesc);
        listCon.appendChild(toDoDiv);
    });
    const toDoAdd = document.createElement("div")
    toDoAdd.classList.add("toDoItem");
    const toDoPlus = document.createElement("p");
    toDoPlus.textContent = "+";
    toDoPlus.classList.add("addToDo");
    const addTitle = document.createElement("input");
    const addDesc = document.createElement("input");
    addTitle.placeholder = "Enter Title";
    addDesc.placeholder = "Enter Description";
    addDesc.classList.add("secondRow");
    const addToDoDiv = (e) => {
        if(e.key === "Enter"){
            const projID = currentProjectBtn.dataset.id;
            const toDoTitle = addTitle.value.trim();
            const toDoDesc = addDesc.value.trim();
            bus.publish("addToDo", {           
            projID,  
            name: toDoTitle,         
            desc: toDoDesc 
        });
        }
    }
    addTitle.addEventListener("keydown", addToDoDiv);
    addDesc.addEventListener("keydown", addToDoDiv);
    toDoAdd.append(toDoPlus,addTitle,addDesc);
    listCon.append(toDoAdd);
}