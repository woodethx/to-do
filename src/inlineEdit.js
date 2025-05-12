export function makeEditable(el, commit, iType) {
  if(iType !== "prio"){
    el.addEventListener("click",   start);
    el.addEventListener("keydown", e=>{
      if (e.key === "Enter" || e.key === " ") start();
    });
  }
    else{
      el.addEventListener("click",   priorities);
      el.addEventListener("keydown", e=>{
      if (e.key === "Enter" || e.key === " ") priorities();
    });
    }
    function priorities(){
      const select = document.createElement("select");
      const priorities = ["Low", "Medium", "High"];
      priorities.forEach(priority => {
        const el = document.createElement("option");
        el.textContent = priority;
        select.appendChild(el);
      });
      select.className = "editInline";
      el.replaceWith(select);
      el.classList.forEach(cls => {
        input.classList.add(cls);
      });
      select.focus(); 
      const finish = save => {
        if (save) {
          const txt = select.value;
          if (txt && txt !== el.textContent) commit(txt);
        }
        select.replaceWith(el);
      };
  
      select.addEventListener("blur",        () => finish(true));
      select.addEventListener("keydown", e => {
        if (e.key === "Enter")   finish(true);
        if (e.key === "Escape")  finish(false);
      });
    }
    function start() {
      const input = document.createElement("input");
      input.type = iType;
      input.className = "editInline";
      input.value = el.textContent;
      el.replaceWith(input);
      el.classList.forEach(cls => {
        input.classList.add(cls);
      });
  
      input.focus(); input.select();
  
      const finish = save => {
        if (save) {
          const txt = input.value.trim();
          if (txt && txt !== el.textContent) commit(txt);
        }
        input.replaceWith(el);
      };
  
      input.addEventListener("blur",        () => finish(true));
      input.addEventListener("keydown", e => {
        if (e.key === "Enter")   finish(true);
        if (e.key === "Escape")  finish(false);
      });
    }
  }