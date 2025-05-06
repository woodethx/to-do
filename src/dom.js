import bus from "./pubsub";

export default function init(){
    bus.subscribe("project:added", renderProjects);
    bus.subscribe("todo:added", renderList);
    bus.subscribe("new:project", renderList);
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
    });
    const addDiv = document.createElement("button");
    addDiv.classList.add("addProj");
    addDiv.textContent = "+";
    const projInput = document.createElement("input");
    projInput.placeholder = "Project Title";
    const projSub = document.createElement("button");
    projSub.addEventListener("click", () => {
        const name = projInput.value.trim();
        if (!name) return;                 
        bus.publish("addProj", { name });  
        projInput.value = "";              
        projInput.classList.add("invisible");
        projSub.classList.add("invisible");
    });
    projInput.classList.add("invisible");
    projSub.classList.add("invisible");
    projSub.textContent = "Add Project";
    addDiv.append(projInput,projSub);
    addDiv.addEventListener("click", () => {
        projInput.classList.remove("invisible");
        projSub.classList.remove("invisible");
        projInput.focus();
    });
    projCon.appendChild(addDiv);
}
function renderList(project){
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
        toDoDesc.innerText = toDo.desc;
        toDoDiv.append(checkbox, toDoTitle, toDoDesc);
        listCon.appendChild(toDoDiv);
    });
    const toDoAdd = document.createElement("div")
    toDoAdd.classList.add("toDoItem");
    const toDoPlus = document.createElement("button");
    toDoPlus.textContent = "Add To-Do";
    toDoPlus.classList.add("addToDo");
    const addTitle = document.createElement("input");
    const addDesc = document.createElement("input");
    addTitle.placeholder = "Enter To-Do Title";
    addDesc.placeholder = "Enter To-Do Description";
    toDoPlus.addEventListener("click", () =>{
        const projID = currentProjectBtn.dataset.id;
        const toDoTitle = addTitle.value.trim();
        const toDoDesc = addDesc.value.trim();
        bus.publish("addToDo", {           
            projID,           
            name: toDoTitle,         
            desc: toDoDesc
        });
    });
    toDoAdd.append(toDoPlus,addTitle,addDesc);
    listCon.append(toDoAdd);
}