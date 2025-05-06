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
    }
    addToDo(title, desc){
        const toDo = new ToDo(title,desc);
        this.toDos.push(toDo);
        bus.publish("todo:created", toDo);
    }
    removeToDo(toDoID){
        const toDo = this.toDos.find(toDo => toDo.id === toDoID);
        if(!toDo) return;
        const index = this.toDos.indexOf(toDo);
        this.toDos.splice(index, 1);
        bus.publish("todo:removed", toDo);
    }
}