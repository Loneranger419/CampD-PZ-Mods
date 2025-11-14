async function loadTables() {
    const list = await fetch("tables/files.json").then(r => r.json());
    const container = document.getElementById("tables");
  
    for (const file of list) {
      const html = await fetch("tables/" + file).then(r => r.text());
      container.innerHTML += html;
    }
  }
  
  loadTables();