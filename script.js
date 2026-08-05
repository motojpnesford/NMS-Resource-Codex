// ================================
// NMS Resource Codex
// Ver.2.0
// script.js
// ================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultArea = document.getElementById("resultArea");

let items = [];
let recipes = [];
let info = [];
let categories = [];

// --------------------
// JSON読込
// --------------------

Promise.all([

    fetch("data/items.json").then(r => r.json()),
    fetch("data/recipes.json").then(r => r.json()),
    fetch("data/info.json").then(r => r.json()),
    fetch("data/categories.json").then(r => r.json())

])

.then(([itemsData, recipesData, infoData, categoriesData]) => {

    items = itemsData;
    recipes = recipesData;
    info = infoData;
    categories = categoriesData;

    console.log("データベース読込完了");

})

.catch(error => {

    console.error(error);

});
searchButton.addEventListener("click", searchResource);

searchInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        searchResource();

    }

});
function searchResource(){

    const keyword = searchInput.value.trim();

    if(keyword === ""){

        resultArea.innerHTML = "資源名を入力してください。";

        return;

    }

    const item = items.find(data => data.name === keyword);

    if(!item){

        resultArea.innerHTML = "見つかりませんでした。";

        return;

    }

    showResult(item);

}
function showResult(item){

    resultArea.innerHTML = `

        <h2>${item.name}</h2>

        <p>ID : ${item.id}</p>

        <p>Category : ${item.category}</p>

    `;

}
