import bus from "./pubsub";

export default class ToDo{
    constructor(title, desc){
        this.title = title;
        this.desc = desc;
        this.completed = false;
        this.id = crypto.randomUUID();
    }
    
    toggle(){
        this.completed ? this.completed = false : this.completed = true;
    }
}