
let displayTerm = "";

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

// Make the actual CORS request.
function makeCorsRequest() {
    let app_id = "df268d73";
    let app_key = "97e95525fd197c05a011ec8010791668";
    let recipe = document.querySelector('#recipe').value;
    let pre = document.querySelector('#response');

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

    let results = obj.hits;
    console.log("reulsts.length = " + results.length);
    let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let smallURL = result.recipe.image;
        if (!smallURL) smallURL = "Media/gif_finder_images/no-image-found.png";

        let url = result.recipe.url;
        let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'> View on Edamam </a></span></div>`;

        bigString += line;
    }

    document.querySelector('#content').innerHTML = bigString;

    document.querySelector('#status').innerHTML = "<b>Success!</b>"
}


document.querySelector("#search").addEventListener("click", makeCorsRequest);