import "./styles.css";
import bus from "./pubsub";
import Project from "./projects";
import initDOM from "./dom";

initDOM();
const proj = new Project("Default Project", "This is a default project");
proj.addToDo("Default ToDo", "This is a default ToDo");
const proj2 = new Project("Default Project 2", "This is a default project");
proj2.addToDo("Default ToDo", "This is a default ToDo 2");
