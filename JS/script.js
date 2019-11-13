   // 1
   window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
   // 2
   let displayTerm = "";
   
   // 3
   function searchButtonClicked(){
       console.log("searchButtonClicked() called");

       //https://developer.edamam.com/food-database-api
       const RECIPE_URL = "http://www.recipepuppy.com/api/?";

       let url = RECIPE_URL;

       let term = document.querySelector("#searchterm").value;
       displayTerm = term;

       term = term.trim();

       term = encodeURIComponent(term);

       if(term.length < 1) return;

       url += "q=" + term;

    //    let limit = document.querySelector("#limit").value;
    //    url += "&limit=" + limit;

       document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b><br><img src='Media/gif_finder_images/spinner.gif'>";
       
       console.log(url);

       getData(url);
   }
   
   function getData(url){

       let xhr = new XMLHttpRequest();

       xhr.onload = dataLoaded;

       xhr.onerror = dataError;

       xhr.open("GET", url);
       xhr.send();
   }

   function dataLoaded(e) {
       let xhr = e.target;

       console.log(xhr.responseText);

       let obj = JSON.parse(xhr.responseText);

       if(!obj.data || obj.data.length == 0){
           document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
           return;
       }

       let results = obj.data;
       console.log("reulsts.length = " + results.length);
       let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

       for(let i = 0; i < results.length; i++){
           let result = results[i];

           let smallURL = result.images.fixed_width_small.url;
           if(!smallURL) smallURL = "Media/gif_finder_images/no-image-found.png";

           let url = result.url;
           let rating = result.rating.toUpperCase();
           let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
           line += `<span><a target='_blank' href='${url}'> View on Giphy </a></span><div>Rating: ${rating}</div></div>`;

           bigString += line;
       }

       document.querySelector('#content').innerHTML = bigString;

       document.querySelector('#status').innerHTML = "<b>Success!</b>"
   }

   function dataError(e) {
       console.log("An error occurred");
   }