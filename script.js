// Map captions to theme names
function getThemeFromCaption(caption) {
  const captionLower = caption.toLowerCase();
  
  // Check for partial matches first (for longer captions)
  if (captionLower.includes('libraries') || captionLower.includes('required')) {
    return 'libraries';
  }
  if (captionLower.includes('game tools')) {
    return 'game-tools';
  }
  if (captionLower.includes('ui')) {
    return 'ui';
  }
  if (captionLower.includes('qol')) {
    return 'qol';
  }
  if (captionLower.includes('moodles') || captionLower.includes('traits')) {
    return 'traits';
  }
  if (captionLower.includes('health')) {
    return 'health';
  }
  if (captionLower.includes('vehicles')) {
    return 'vehicles';
  }
  if (captionLower.includes('building')) {
    return 'building';
  }
  if (captionLower.includes('environment')) {
    return 'environment';
  }
  if (captionLower.includes('tools') || captionLower.includes('weapons')) {
    return 'tools';
  }
  if (captionLower.includes('items')) {
    return 'items';
  }
  if (captionLower.includes('sounds') || captionLower.includes('animations')) {
    return 'sounds';
  }
  if (captionLower.includes('clothing')) {
    return 'clothing';
  }
  if (captionLower.includes('ingame map') || captionLower.includes('in-game map')) {
    return 'ingame-map';
  }
  if (captionLower.includes('cool')) {
    return 'cool';
  }
  
  return 'default';
}

async function loadTables() {
    const list = await fetch("tables/files.json").then(r => r.json());
    const container = document.getElementById("tables");
    
    // Load all tables and count rows
    const tableData = await Promise.all(
      list.map(async (file) => {
        const html = await fetch("tables/" + file).then(r => r.text());
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const table = tempDiv.querySelector('.mod-table');
        if (table) {
          // Count data rows (exclude header row)
          const allRows = table.querySelectorAll('tr');
          const headerRow = table.querySelector('thead tr');
          const rowCount = allRows.length - (headerRow ? 1 : 0);
          
          // Add theme class
          const caption = table.querySelector('caption');
          if (caption) {
            const theme = getThemeFromCaption(caption.textContent.trim());
            if (theme !== 'default') {
              table.classList.add(`theme-${theme}`);
            }
          }
          
          return { table, rowCount };
        }
        return null;
      })
    );
    
    // Filter out nulls and separate cool table from others
    const allTables = tableData.filter(item => item !== null);
    const coolTable = allTables.find(item => {
      const caption = item.table.querySelector('caption');
      return caption && getThemeFromCaption(caption.textContent.trim()) === 'cool';
    });
    const otherTables = allTables.filter(item => {
      const caption = item.table.querySelector('caption');
      return !caption || getThemeFromCaption(caption.textContent.trim()) !== 'cool';
    });
    
    // Sort other tables by row count (longest to shortest)
    const sortedTables = otherTables.sort((a, b) => b.rowCount - a.rowCount);
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'tables-grid';
    
    // Append sorted tables (excluding cool)
    for (const { table } of sortedTables) {
      const card = document.createElement('div');
      card.className = 'table-card';
      card.appendChild(table.cloneNode(true));
      gridContainer.appendChild(card);
    }
    
    // Append cool table last with full-width class
    if (coolTable) {
      const card = document.createElement('div');
      card.className = 'table-card table-card-fullwidth';
      card.appendChild(coolTable.table.cloneNode(true));
      gridContainer.appendChild(card);
    }
    
    container.appendChild(gridContainer);
  }
  
  loadTables();