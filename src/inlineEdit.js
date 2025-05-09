export function makeEditable(el, commit, iType) {
    el.addEventListener("click",   start);
    el.addEventListener("keydown", e=>{
      if (e.key === "Enter" || e.key === " ") start();
    });

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