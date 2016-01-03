'use strict'

var jsonVar = {"firstName":"John", "lastName":"Doe"};

var toSearchFor = 'cat';

//build api search string - JSON
var buildUrl = function(toSearchFor) {
  var urlPath = 'https://api.flickr.com/services/rest/?';
  var method = 'flickr.photos.search';
  var apiKey = '2aa08ff0cd754205c7d0a59f3ecda821';
  var perPage = '3';

  return urlPath + 'method=' + method + '&api_key=' + apiKey + '&text=' + toSearchFor + 
      '&per_page=' + perPage + '&format=json' + '&nojsoncallback=1';

}


// //go through json object
// //for each photo, build image url and add src=url
// var buildImageUrl = function(obj) {
//   //150X150 square size photots
//   var size = 's';
//   var urlbuilt =  'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '_' + size + '.jpg';
//   console.log(urlbuilt);
// }

var addPhotos = function(photoObj){
  var size = 'q';
  for(var i = 0; i < photoObj.length; i++) {
    var img = document.createElement("img");
    img.src = 'https://farm' + photoObj[i].farm + '.staticflickr.com/' + photoObj[i].server + '/' + photoObj[i].id + '_' + photoObj[i].secret +  '_' + size +'.jpg';
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


