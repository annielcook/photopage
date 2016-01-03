'use strict'

var jsonVar = {"firstName":"John", "lastName":"Doe"};

var toSearchFor = 'kitten';

//build api search string - JSON
var buildUrl = function(toSearchFor) {
	var urlPath = 'https://api.flickr.com/services/rest/?';
	var method = 'flickr.photos.search';
	var apiKey = '2aa08ff0cd754205c7d0a59f3ecda821';
	var perPage = '3';

	return urlPath + 'method=' + method + '&api_key=' + apiKey + '&text=' + toSearchFor + '&per_page=' + perPage + '&format=json' + '&nojsoncallback=1';

}



function httpGet(theUrl)
{
    var xhr = new XMLHttpRequest();
    //3rd argument means async = true
		xhr.open('GET', theUrl, true);

		xhr.onreadystatechange = function() {
		    if (this.readyState === 4) {
		        if (this.status >= 200 && this.status < 400) {
		        		//callback with JSON data
		            var data = JSON.parse(this.responseText);
		            document.getElementById('thumbnails').innerHTML = JSON.stringify(data, null, '  ');
		        }
		    }
		};

		xhr.send();


}

httpGet(buildUrl(toSearchFor));

