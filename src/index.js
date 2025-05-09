import "./styles.css";
import bus from "./pubsub";
import Project from "./projects";
import initDOM from "./dom";

initDOM();
const proj = new Project("Default Project", "This is a default project");
proj.addToDo("Default ToDo", "This is a default ToDo");
