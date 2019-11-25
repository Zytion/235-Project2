let displayTerm = "";
let results;
let page = 0;

//saved recipe in local storage
window.onload = function () {
    if (localStorage.getItem("savedRecipe") != null) {
        document.querySelector('#recipe').value = localStorage.getItem("savedRecipe");
        this.makeCorsRequest();
    }
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}
let pre = document.querySelector('#response');

// Make the actual CORS request.
function makeCorsRequest() {
    document.querySelector('#next').className = "";
    document.querySelector('#prev').className = "hidden";
    let app_id = "df268d73";
    let app_key = "97e95525fd197c05a011ec8010791668";
    let recipe = document.querySelector('#recipe').value;

    //if recipe is empty, enter search term
    if (recipe == "") {
        alert('Please enter a search term');
        return;
    }
    //save items
    localStorage.setItem("savedRecipe", recipe);
    pre.innerHTML = "";

    //start building URL
    var url = 'https://api.edamam.com/search?app_id=' + app_id + '&app_key=' + app_key;

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    //get term
    let term = document.querySelector('#recipe').value;
    displayTerm = term;
    term = term.trim();
    term = encodeURIComponent(term);
    //add to url
    url += "&q=" + term;
    url += "&to=99";
    //get dietary restrictions
    let checkedButtons = document.querySelectorAll('.dietaryRestrictions');
    for (let i = 0; i < checkedButtons.length; i++) {
        if (checkedButtons[i].checked) {
            if (checkedButtons[i].value == "nut-free") {
                url += "&health=peanut-free&health=tree-nut-free"
            }
            else {
                url += "&health=" + checkedButtons[i].value;
            }
        }
    }
    console.log(checkedButtons);

    console.log(url);

    // // Response handlers.
    // xhr.onload = function() {
    //   var text = xhr.responseText;
    //   pre.innerHTML = text;
    // };

    // xhr.onerror = function() {
    //   alert('Woops, there was an error making the request.');
    // };

    // pre.innerHTML = 'Loading...';
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(recipe);
    getData(url);
}

function getData(url) {

    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = function () {
        alert('Whoops, there was an error making the request.');
    };

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    console.log(obj.hits);

    if (!obj.hits || obj.hits.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    results = obj.hits;
    console.log("reulsts.length = " + results.length);
    page = 0;
    pre.innerHTML = "<i>Here are " + (results.length + 1) + " results for '" + displayTerm + "'</i>";
    showResults();
}

//SHOW RESULTS (BUILD HTML)
function showResults() {
    let bigString = "";

    for (let i = page; i < page + 10; i++) {
        let result = results[i];

        let smallURL = result.recipe.image;
        if (!smallURL) smallURL = "Media/gif_finder_images/no-image-found.png";

        //get url of recipe, yield/servings, total time
        let url = result.recipe.url;
        let portions = result.recipe.yield;
        let time = result.recipe.totalTime;
        //if there is no estimate on time (0 minutes), change phrases
        if (time == 0) {
            time = "N/A"
        }
        else {
            time += " min";
        }
        //get name of recipe, cut off name if too long
        let name = result.recipe.label;
        if (name.length > 42) {
            name = name.substring(0, 42) + "...";
        }
        //build HTML
        let line = `<div class='result'><div class="title"><h2>${name}</h2></div><div class="info">Servings: ${portions}
        <br>Time: ${time}</div><div class="foodImage"><img src='${smallURL}' title='${result.id}' /></div>`;
        line += `<div class="link"><a target='_blank' href='${url}'> View Recipe </a></div></div>`;
        bigString += line;
    }

    //put into HTML
    document.querySelector('#content').innerHTML = bigString;

    document.querySelector('#status').innerHTML = "<b>Search was successful!</b>";
}

//CLICK NEXT BUTTON/BACK BUTTON TO CHANGE PAGE
function navClick(e) {
    if (page == results.length - 29 && e.target.value == "next") {
        document.querySelector('#next').className = "hidden";
        document.querySelector('#prev').className = "";
    }
    else if (page == 10 && e.target.value == "prev") {
        document.querySelector('#prev').className = "hidden";
        document.querySelector('#next').className = "";
    }
    else {
        document.querySelector('#next').className = "";
        document.querySelector('#prev').className = "";
    }
    
    if (e.target.value == "next" && page < results.length - 10) {
        page += 10;
        showResults();
    }
    else if (e.target.value == "prev" && page > 0) {
        page -= 10;
        showResults();
    }

    console.log("Page :" + page + "\nResults: " + (results.length - 19));
}

//ADD EVENT LISTENERS TO BUTTONS
const navButtons = document.querySelectorAll('#navButtons button');
for (let navButton of navButtons) {
    navButton.addEventListener("click", navClick);
}
document.querySelector("#search").addEventListener("click", makeCorsRequest);

function hideInstructions(x) {
    let instructions = document.querySelectorAll(".instructions");

    if (x.matches) { // If media query matches
        for (let instruction of instructions) {
            instruction.className = "instructions hidden"
        }
    } else {
        for (let instruction of instructions) {
            instruction.className = "instructions"
        }
    }
}

var x = window.matchMedia("(max-width: 800px)")
hideInstructions(x) // Call listener function at run time
x.addListener(hideInstructions) // Attach listener function on state changes 