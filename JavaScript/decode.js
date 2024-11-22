const { JSDOM } = require("jsdom");

const URL = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub";

async function decodeUrl(url) {
  try {
    const dom = await getDom(url);

    const { items, maxY, maxX } = extractData(dom);

    //create our 2D array initially filled with spaces
    const charGrid = new Array(maxX + 1).fill(" ").map(() =>
      new Array(maxY + 1).fill(" ")
    );


    //fill in our grid with the chars form the previous step
    //remembering to inverse y becuase it increases negatively in the example
    for (var item of items) {
      charGrid[item.x][maxY - item.y] = item.c;
    }


    //print out the grid nicely
    for (var row = 0; row <= maxY; row++) {
      let line = "";
      for (var column = 0; column <= maxX; column++) {
        line += charGrid[column][row];
      }
      console.log(line);
    }

  } catch (e) {
    console.log(e);
    console.log("an error has occurred");
    return;
  }
}

function extractData(dom) {
  //extract the table
  const table = dom.window.document.querySelector('#contents > .doc-content > table');
  const rows = Array.from(table.rows).slice(1); // Skip first header row

  //organize the nodes data into a fix sized array while keeping track of max X and Y
  //in this example x moves positively and y moves negatively. 
  //we will record it in normally and inverse it when we know maxY print
  const items = new Array(rows.length);
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < rows.length; i++) {
    items[i] = {
      x: parseInt(rows[i].querySelector("td:nth-child(1)").textContent),
      y: parseInt(rows[i].querySelector("td:nth-child(3)").textContent),
      c: rows[i].querySelector("td:nth-child(2)").textContent,
    }
    maxX = Math.max(maxX, items[i].x);
    maxY = Math.max(maxY, items[i].y);
  }
  return { items, maxX, maxY };
}

async function getDom(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error from URL");
  }

  const body = await response.text();
  const dom = new JSDOM(body);
  return dom;
}



return decodeUrl(URL);