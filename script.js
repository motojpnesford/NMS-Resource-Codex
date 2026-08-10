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
  console.log("recipes件数 =", recipes.length);
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

    const category = categories.find(data => data.id === item.category);

    let categoryName = item.category;

    if(category){

        categoryName = category.name;

    }


    let html = "";

    html += `

        <h2>${item.name}</h2>

        <p>ID : ${item.id}</p>

        <p>Category : ${categoryName}</p>

    `;


    html += showInfo(item);

   html += showRecipes(item); 

    html += showUses(item);

    resultArea.innerHTML = html;

}
// --------------------
// info表示
// --------------------

function showInfo(item){

    const data = info.find(data => data.id === item.id);


    if(!data){

        return "";

    }


    let html = "";


    // guide

    if(data.guide && data.guide.length > 0){

        html += `

            <hr>

            <h3>おすすめ手順</h3>

        `;


        data.guide.forEach(step => {

            html += `

                <p>

                <strong>
                ${step.step} ${step.title}
                </strong>
                <br>

                ${step.text}

                </p>

            `;

        });

    }



    // collect

    if(data.collect && data.collect.length > 0){

        html += `

            <hr>

            <h3>採取</h3>

        `;


        data.collect.forEach(text => {

            html += `

                <p>${text}</p>

            `;

        });

    }



    // note

    if(data.note && data.note.length > 0){

        html += `

            <hr>

            <h3>補足</h3>

        `;


        data.note.forEach(text => {

            html += `

                <p>${text}</p>

            `;

        });

    }


    return html;

}
// --------------------
// 作り方
// --------------------

function showRecipes(item){

    let html = "";

    const result = recipes.filter(recipe =>

        recipe.output.some(output => output.id === item.id)

    );

    if(result.length === 0){

        return "";

    }

    html += `
        <hr>
        <h3>作り方</h3>
    `;

    result.forEach(recipe =>{

    html += `<div class="recipeInputs">`;

    recipe.input.forEach(material =>{

        html += `
            <span>
                ${createResourceLink(material.id)}
                × ${material.amount}
            </span>
        `;

    });

    html += `</div>`;

    html += `
        <br>
        ↓
        <br>
        <small>${recipe.machine}</small>
        <br><br>
    `;

        recipe.output.forEach(output=>{

html += `
    ${createResourceLink(output.id)}
    × ${output.amount}
`;
        });

        html += "<br><br>";

    });

    return html;

}

// --------------------
// 使い道
// --------------------

function showUses(item){

    let html = "";

    const result = recipes.filter(recipe =>

        recipe.input.some(input => input.id === item.id)

    );

    if(result.length === 0){

        return "";

    }

    html += `
        <hr>
        <h3>使い道</h3>
    `;

    result.forEach(recipe =>{

        // 材料

        html += `<div class="recipeInputs">`;

recipe.input.forEach(material => {

    html += `
        <span>
            ${createResourceLink(material.id)}
            × ${material.amount}
        </span>
    `;

});

html += `</div>`;
        });

        html += `
            <br>
            ↓
            <br>
            <small>${recipe.machine}</small>
            <br><br>
        `;

        // 完成品

      recipe.output.forEach(output => {


    html += `
        ${createResourceLink(output.id)}
        × ${output.amount}
    `;

});

        html += "<br><br>";

    });

    return html;

}

// --------------------
// 資源リンク作成
// --------------------

function createResourceLink(id){

    const item = items.find(data => data.id === id);

    const name = item
        ? item.name
        : id;

    return `
        <span
            class="resourceLink"
            data-id="${id}">
            ${name}
        </span>
    `;

}
resultArea.addEventListener("click", function(event){

    if(!event.target.classList.contains("resourceLink")){

        return;

    }

    const id = event.target.dataset.id;

    const item = items.find(data => data.id === id);

    if(!item){

        return;

    }

    searchInput.value = item.name;

    searchResource();

});
