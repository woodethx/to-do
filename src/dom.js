import bus from "./pubsub";

export default function init(){
    bus.subscribe("project:added", renderProjects);
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
}