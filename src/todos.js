import bus from "./pubsub";

export default class ToDo{
    constructor(title, desc, date, priority){
        this.title = title;
        this.desc = desc;
        this.completed = false;
        this.id = crypto.randomUUID();
        this.date = date;
        this.priority = priority;
    }
    
    toggle(){
        this.completed ? this.completed = false : this.completed = true;
    }
}