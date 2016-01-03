'use strict'

var jsonVar = {"firstName":"John", "lastName":"Doe"};

var toSearchFor = 'kitten';

//build api search string - JSON
var buildUrl = function(toSearchFor) {
  var urlPath = 'https://api.flickr.com/services/rest/?';
  var method = 'flickr.photos.search';
  var apiKey = '2aa08ff0cd754205c7d0a59f3ecda821';
  var perPage = '3';

  return urlPath + 'method=' + method + '&api_key=' + apiKey + '&text=' + toSearchFor + 
      '&per_page=' + perPage + '&format=json' + '&nojsoncallback=1';

}

var testImg = { "id": "24048668042", "owner": "48717444@N00", "secret": "115dd16bf4", "server": "1672", "farm": 2, "title": "Paint me like one of your French kittens.", "ispublic": 1, "isfriend": 0, "isfamily": 0 };

//go through json object
//for each photo, build image url and add src=url
var buildImageUrl = function(obj) {

  var urlbuilt =  'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '.jpg';
  console.log(urlbuilt);
}

var addPhotos = function(photoObj){
  console.log('length: ' + photoObj.length);
  for(var i = 0; i < photoObj.length; i++) {
    var img = document.createElement("img");
    img.src = 'https://farm' + photoObj[i].farm + '.staticflickr.com/' + photoObj[i].server + '/' + photoObj[i].id + '_' + photoObj[i].secret + '.jpg';
    document.getElementById("thumbnails").appendChild(img);
  }
}

//get request for url
var httpGet = function (theUrl){
  var xhr = new XMLHttpRequest();
  //3rd argument means async = true
  xhr.open('GET', theUrl, true);

  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        //callback with JSON data
        var photos = JSON.parse(this.responseText);
        console.log(JSON.stringify(photos.photos.photo));
        addPhotos(photos.photos.photo);
        //document.getElementById('thumbnails').innerHTML = JSON.stringify(data, null, '  ');

      }
    }
  };

  xhr.send();


}

httpGet(buildUrl(toSearchFor));

buildImageUrl(testImg);

