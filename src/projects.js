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
        bus.publish("project:added", projects);
        bus.publish("new:project", this);
    }
    addToDo(title, desc){
        const toDo = new ToDo(title,desc);
        this.toDos.push(toDo);
        bus.publish("todo:added", this);
    }
    removeToDo(toDoID){
        const toDo = this.toDos.find(toDo => toDo.id === toDoID);
        if(!toDo) return;
        const index = this.toDos.indexOf(toDo);
        this.toDos.splice(index, 1);
        bus.publish("todo:removed", toDo);
    }
}
bus.subscribe("addProj", ({ name, desc = "" }) => {
    const proj = new Project(name, desc); 
});
bus.subscribe("addToDo", ({projID, name, desc }) => {
    const proj = projects.find(project => project.id === projID);
    proj.addToDo(name,desc);   
});