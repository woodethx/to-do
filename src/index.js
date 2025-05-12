import "./styles.css";
import bus from "./pubsub";
import Project from "./projects";
import initDOM from "./dom";

initDOM();
const proj = new Project("Default Project", "This is a default project");
proj.addToDo("Here's a To-Do", "Click any To-Do fields to edit them", Date(Date.now), "High");
