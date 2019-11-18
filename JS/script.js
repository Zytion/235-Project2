
let displayTerm = "";

let results;

let page = 0;

window.onload = function(){
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
    let app_id = "df268d73";
    let app_key = "97e95525fd197c05a011ec8010791668";
    let recipe = document.querySelector('#recipe').value;
    localStorage.setItem("savedRecipe", recipe);

    pre.innerHTML = "";

    var url = 'https://api.edamam.com/search?app_id=' + app_id + '&app_key=' + app_key;

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    let term = document.querySelector('#recipe').value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    url += "&q=" + term;
    url += "&to=99";

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
        alert('Woops, there was an error making the request.');
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
    pre.innerHTML = "<i>Here are " + results.length + " results for '" + displayTerm + "'</i>";
    showResults();
}

function showResults() {
    let bigString = "";

    for(let i = page; i < page + 10; i++)
    {
        let result = results[i];

        let smallURL = result.recipe.image;
        if (!smallURL) smallURL = "Media/gif_finder_images/no-image-found.png";

        let url = result.recipe.url;

        let portions = result.recipe.yield;
        let name = result.recipe.label;

        let line = `<div class='result'><div><h2>${name}</h2> yeild = ${portions}</div><img src='${smallURL}' title='${result.id}' />`;
        line += `<div><a target='_blank' href='${url}'> View Recipe </a></div></div>`;

        bigString += line;
    }

    document.querySelector('#content').innerHTML = bigString;

    document.querySelector('#status').innerHTML = "<b>Success!</b>";
    document.querySelector('#status').className
}

function navClick(e) {
    if(e.target.value == "next" && page < results.length - 10)
    {
        page += 10;
        showResults();
    }
    else if(e.target.value == "prev" && page > 0)
    {
        page -= 10;
        showResults();
    }
    else
    {
        alert("Cannot show any more Recipies")
    }
}

const navButtons = document.querySelectorAll('#navButtons button');
for(let navButton of navButtons)
{
    navButton.addEventListener("click", navClick);
}
document.querySelector("#search").addEventListener("click", makeCorsRequest);