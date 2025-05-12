import { makeEditable } from "./inlineEdit";
import bus from "./pubsub";
import trashIcon from './assets/trash.svg'

export default function init(){
    bus.subscribe("project:updated", renderProjects);
    bus.subscribe("todo:updated", renderList);
}

let currentProjectBtn = null;

function renderProjects(projects){
    const projCon = document.querySelector("#projCon");
    projCon.innerHTML = "";
    projects.forEach(project => {
        const projDiv = document.createElement("button");
        projDiv.innerText = project.name;
        projDiv.classList.add("projDiv");
        const removeProj = document.createElement("img");
        removeProj.classList.add("littleTrash");
        removeProj.src = trashIcon;
        removeProj.addEventListener("click", () =>{
            bus.publish("removeProj", project.id);
        });
        projDiv.appendChild(removeProj);
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
};


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
        const toDoDate = document.createElement("p");
        toDoDate.innerText = "Due Date: "+toDo.date;
        const toDoPrio = document.createElement("p");
        toDoPrio.innerText = "Priority: "+toDo.priority;
        const removeToDo = document.createElement("img");
        removeToDo.classList.add("trash");
        removeToDo.src = trashIcon;
        removeToDo.addEventListener("click", () => {
            bus.publish("removeToDo", ({
                projID: project.id, 
                toDoID: toDo.id
            }));
        });
        toDoDiv.append(checkbox, toDoTitle, toDoDesc);
        if(toDo.date !== undefined) toDoDiv.append(toDoDate);
        toDoDiv.append(toDoPrio, removeToDo);
        listCon.append(toDoDiv);
        makeEditable(toDoTitle, newTxt => {
            toDo.title = newTxt;
            renderList(project);
        });
        makeEditable(toDoDesc, newTxt => {
            toDo.desc = newTxt;
            renderList(project);
        });
        makeEditable(toDoDate, newDate => {
            toDo.date = newDate;
            renderList(project);
        },"date");
        makeEditable(toDoPrio, newOp => {
            toDo.priority = newOp;
            renderList(project);
        },"prio");
    });
    const toDoAdd = document.createElement("div")
    toDoAdd.classList.add("toDoItem");
    const toDoPlus = document.createElement("p");
    toDoPlus.textContent = "+";
    toDoPlus.classList.add("addToDo");
    const addTitle = document.createElement("input");
    const addDesc = document.createElement("input");
    const addDate = document.createElement("input");
    const addPrio = document.createElement("select");
    addDate.type = "date";
    addPrio.classList.add("secondRow")
    const priorities = ["Low", "Medium", "High"];
    priorities.forEach(priority => {
        const el = document.createElement("option");
        el.textContent = priority;
        addPrio.appendChild(el);
    });
    addTitle.placeholder = "Enter Title";
    addDesc.placeholder = "Enter Description";
    addDesc.classList.add("secondRow");
    const addToDoDiv = (e) => {
        if(e.key === "Enter"){
            bus.publish("addToDo", {           
            projID: project.id,
            name: addTitle.value.trim(),         
            desc: addDesc.value.trim(),
            date: addDate.value,
            priority: addPrio.value
        });
        }
    };
    addTitle.addEventListener("keydown", addToDoDiv);
    addDesc.addEventListener("keydown", addToDoDiv);
    addDate.addEventListener("keydown", addToDoDiv);
    addPrio.addEventListener("keydown", addToDoDiv);
    toDoAdd.append(toDoPlus,addTitle,addDesc,addDate, addPrio);
    listCon.append(toDoAdd);
}