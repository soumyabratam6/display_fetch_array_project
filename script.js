document.getElementById("fetchDataButton").addEventListener("click", () => {
  fetchDataInSequence();
});

function fetchData(url, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          let items;
          if (url.includes("posts")) {
            items = data.posts;
            // console.log(items);
          } else if (url.includes("products")) {
            items = data.products;
          } else if (url.includes("todos")) {
            items = data.todos;
          }
          if (items && Array.isArray(items)) {
            displayData(items);
            resolve(true);
          } else {
            throw new Error("Invalid data format");
          }
        })
        .catch((error) => reject(error));
    }, delay);
  });
}

function promiseAPI1() {
  return fetchData("https://dummyjson.com/posts", 1000);
}

function promiseAPI2() {
  return fetchData("https://dummyjson.com/products", 2000);
}

function promiseAPI3() {
  return fetchData("https://dummyjson.com/todos", 3000);
}

function displayData(data) {
  console.log(data);
  const container = document.getElementById("dataContainer");
  const table = document.createElement("table");
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    console.log(keys);
    const headerRow = document.createElement("tr");
    keys.forEach((key) => {
      const th = document.createElement("th");
      th.innerText = key;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach((item) => {
      const row = document.createElement("tr");
      keys.forEach((key) => {
        const td = document.createElement("td");
        const value = item[key];
        td.innerText = formatValue(value);
        row.appendChild(td);
      });
      table.appendChild(row);
    });
  } else {
    const messageRow = document.createElement("tr");
    const messageCell = document.createElement("td");
    messageCell.colSpan = 100;
    messageCell.innerText = "No data available";
    messageRow.appendChild(messageCell);
    table.appendChild(messageRow);
  }
  container.appendChild(table);
}

function formatValue(value) {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return value.map(formatValue).join(", ");
    } else {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join(", ");
    }
  }
  return value;
}

function fetchDataInSequence() {
  promiseAPI1()
    .then((result) => {
      if (result === true) {
        return promiseAPI2();
      } else {
        throw new Error("PromiseAPI1 did not resolve to true");
      }
    })
    .then((result) => {
      if (result === true) {
        return promiseAPI3();
      } else {
        throw new Error("PromiseAPI2 did not resolve to true");
      }
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
}
