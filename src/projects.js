import bus from "./pubsub";
import ToDo from "./todos";

const projects = [];
export default class Project{
    constructor(name, desc){
        this.name = name;
        this.desc = desc;
        this.id = crypto.randomUUID();
        this.toDos = [];
        projects.push(this);
        bus.publish("project:updated", projects);
    }
    addToDo(title, desc, date, priority){
        const toDo = new ToDo(title,desc,date, priority);
        this.toDos.push(toDo);
        bus.publish("todo:updated", this);
    }
    removeToDo(toDoID){
        const toDo = this.toDos.find(toDo => toDo.id === toDoID);
        if(!toDo) return;
        const index = this.toDos.indexOf(toDo);
        this.toDos.splice(index, 1);
        bus.publish("todo:updated", this);
    }
}
bus.subscribe("addProj", ({ name, desc = "" }) => {
    const proj = new Project(name, desc);
    bus.publish("new:project", this);
});
bus.subscribe("addToDo", ({projID, name, desc, date, priority }) => {
    const proj = projects.find(project => project.id === projID);
    proj.addToDo(name,desc, date, priority);   
});
bus.subscribe("removeToDo", ({projID, toDoID}) => {
    const proj = projects.find(project => project.id === projID);
    proj.removeToDo(toDoID);
});
bus.subscribe("removeProj", (projID) => {
    const proj = projects.find(project => project.id === projID);
    if(!proj) return;
    const index = projects.indexOf(proj);
    projects.splice(index,1);
    bus.publish("project:updated", projects);
});