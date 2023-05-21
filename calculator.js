
const carbs100g = document.querySelector("#carbs-100g");
const portion = document.querySelector("#portion");
const decimalPointButton = document.querySelector("#decimal-point-button");
const numericButtons = document.querySelectorAll(".numeric-button");
const equalButton = document.querySelector("#equal-button");
const clearButton = document.querySelector("#clear-button");
const output = document.querySelector("#output");
const warning = document.querySelector("#warning");

let activeInput = carbs100g;


carbs100g.addEventListener("click", function () {
  makeActive(carbs100g);
});

portion.addEventListener("click", function () {
  makeActive(portion);
});

function makeActive(input) {
  activeInput.classList.remove("active");
  input.classList.add("active");
  activeInput = input;
}

decimalPointButton.addEventListener("click", function () {
  if (!activeInput.innerHTML.includes(".")) {
    activeInput.innerHTML += ".";
  }
});

numericButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let inputValue = activeInput.innerHTML;
    if (inputValue.length < 7) {
      activeInput.innerHTML += button.innerHTML;
    }
  });
});

equalButton.addEventListener("click", function () {
  let carbs100gValue = parseFloat(carbs100g.innerHTML);
  let portionValue = parseFloat(portion.innerHTML);
  if (!isNaN(carbs100gValue) && !isNaN(portionValue)) {
    let result = (carbs100gValue * portionValue) / 100;
    result = Math.round(result);
    output.innerHTML = `Carbs: ${result}g`;
    warning.style.visibility = "hidden";
    localStorage.setItem("carbs100gValue", carbs100gValue);
    localStorage.setItem("portionValue", portionValue);
  } else {
    output.innerHTML = "Carbs: 0g";
    warning.style.visibility = "visible";
  }
});

clearButton.addEventListener("click", function () {
  activeInput.innerHTML = "";
});

window.onload = function () {
  carbs100gValue = localStorage.getItem("carbs100gValue");
  portionValue = localStorage.getItem("portionValue");
  if (carbs100gValue && portionValue) {
    carbs100g.innerHTML = carbs100gValue;
    portion.innerHTML = portionValue;
  }
};


let activeTab = "home";
let savedItems = [];

// Load saved items from local storage
const savedItemsStr = localStorage.getItem("savedItems");
if (savedItemsStr) {
  savedItems = JSON.parse(savedItemsStr);
}

// Function to save a new item
function saveItem() {
  const carbsper100g = parseFloat(document.querySelector("#carbs-100g").textContent);
  if (isNaN(carbsper100g) || carbsper100g == 0) {
    alert("Please enter the carbs per 100g before saving");
    return;
  }

  const itemName = prompt("Enter a name for the item:");
  if (!itemName) {
    return;
  }

  savedItems.push({ name: itemName, carbsper100g });
  localStorage.setItem("savedItems", JSON.stringify(savedItems));
  renderSavedItems();
}

// Function to render the saved items
function renderSavedItems() {
  const savedItemsList = document.getElementById("savedItemsList");
  console.log(savedItemsList);
  savedItemsList.innerHTML = "";
  for (const item of savedItems) {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.addEventListener("click", function () {
      activeTab = "home";
      document.querySelector("#carbs-100g").textContent = item.carbsper100g;
      console.log(item.carbsper100g);
      document.querySelector('.home-btn').classList.add("active");
      document.querySelector('.star-btn').classList.remove("active");
      document.getElementById("homeTab").style.display = "block";
      document.getElementById("savedTab").style.display = "none";
    });
    savedItemsList.appendChild(li);
  }
}

// Event listener for the save button
document.getElementById("saveBtn").addEventListener("click", saveItem);

// Event listeners for the tabs
document.getElementById("home").addEventListener("click", function () {
  activeTab = "home";
  document.querySelector('.home-btn').classList.add("active");
  document.querySelector('.star-btn').classList.remove("active");
  document.getElementById("homeTab").style.display = "block";
  document.getElementById("searchTab").style.display = "none";
  document.getElementById("savedTab").style.display = "none";
});

document.getElementById("star").addEventListener("click", function () {
  activeTab = "saved";
  document.querySelector('.home-btn').classList.remove("active");
  document.querySelector('.star-btn').classList.add("active");
  document.getElementById("homeTab").style.display = "none";
  document.getElementById("searchTab").style.display = "none";
  document.getElementById("savedTab").style.display = "block";
});

document.getElementById("search-icon").addEventListener("click", function () {
  activeTab = "search";
  document.getElementById("homeTab").style.display = "none";
  document.getElementById("savedTab").style.display = "none";
  document.getElementById("searchTab").style.display = "block";
});

// Initial render
renderSavedItems();


if (navigator.onLine) {
  console.log('Online');
  const searchBar = document.querySelector("#search-bar");
  const searchButton = document.querySelector("#search-icon");
  const searchResults = document.querySelector("#search-results");


  searchButton.addEventListener("click", function () {
    const searchTerm = encodeURIComponent(searchBar.value);

    if (searchTerm.length < 4) {
      alert("Search term must be at least 4 characters long.");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://devweb2022.cis.strath.ac.uk/~aes02112/food/?s=${searchTerm}`);
    xhr.responseType = 'text';
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        searchResults.innerHTML = "";
        data.forEach(function (item) {
          const listItem = document.createElement("li");
          listItem.textContent = item.name;
          searchResults.appendChild(listItem);
          listItem.addEventListener("click", function () {
            savedItems.push({ name: item.name, carbsper100g: item.carbsper100g });
            localStorage.setItem("savedItems", JSON.stringify(savedItems));
            renderSavedItems();
            activeTab = "saved";
            document.getElementById("homeTab").style.display = "none";
            document.getElementById("searchTab").style.display = "none";
            document.getElementById("savedTab").style.display = "block";
          });
        });

      } else {
        alert("An error occurred while searching.");
      }
    };
    xhr.send();
  });

  // Perform online operations, such as fetching data from the server
} else {
  const searchResults = document.querySelector("#search-results");
  console.log('Offline');
  searchResults.innerHTML = "";
  const listItem = document.createElement("li");
  listItem.textContent = "Search not available when offline";
  listItem.style.color = "blue";
  listItem.style.background = "none";
  listItem.style.fontSize = "25px";
  listItem.style.marginTop = "3rem";
  searchResults.appendChild(listItem);
}

