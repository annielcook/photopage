'use strict'

var toSearchFor = 'kitten';

//build api search string - JSON
var buildUrl = function(toSearchFor) {
  var urlPath = 'https://api.flickr.com/services/rest/?';
  var method = 'flickr.photos.search';
  var apiKey = '2aa08ff0cd754205c7d0a59f3ecda821';
  var perPage = '32';

  //**is there a better way to do this?
  return urlPath + 'method=' + method + '&api_key=' + apiKey + '&text=' + toSearchFor + 
      '&per_page=' + perPage + '&format=json' + '&nojsoncallback=1';

}


// //go through json object
// //for each photo, build image url and add src=url
var addNestedDivs = function() {

  var innerDiv = document.createElement('div');
  innerDiv.className = 'col-xs-6 col-md-3';
  document.getElementById('thumbnails').appendChild(innerDiv);

  var aTag = document.createElement('a');
  aTag.className = 'thumbnail';
  aTag.href='javascript:void(0)';
  innerDiv.appendChild(aTag);
  
  return aTag;

}

var buildImgUrl = function(photoObj, size) {
  return 'https://farm' + photoObj.farm + '.staticflickr.com/' + photoObj.server + 
        '/' + photoObj.id + '_' + photoObj.secret +  '_' + size +'.jpg';
}

var movePhoto = function(direction, arr, i){
  // if(direction == 'left' && i == 0) alert('Beginning');
  // else if(direction == 'right' && i == arr.length - 1) alert('End');
  // else {
  //   closeLightbox();
  //   var j = direction === 'left' ? i-1 : i +1;
  //   console.log("j: ", j)
  //   openLightbox(arr, j);
  //   console.log('made it')
  // }
  if(!(direction == 'left' && i == 0) && !(direction == 'right' && i == arr.length - 1)){
    
    closeLightbox();
    var j = direction === 'left' ? i-1 : i +1;
    console.log("j: ", j)
    openLightbox(arr, j);
    console.log('made it')
  }
}

var openLightbox = function(arrOfPhotoObj, curr){
  console.log("current: ", curr);
  var insideBox = document.getElementById('lightbox_content');

  var img = document.createElement('img');
  //size q = 150x150 image
  img.src = buildImgUrl(arrOfPhotoObj[curr], 'z')
  img.alt = arrOfPhotoObj[curr].title;
  img.id = 'lightbox_image';

  document.getElementById('button-left').addEventListener('click', function(ev){
    movePhoto('left', arrOfPhotoObj, curr);
    ev.stopPropagation();
  });
  document.getElementById('button-right').addEventListener('click', function(ev){
    movePhoto('right', arrOfPhotoObj, curr);
    ev.stopPropagation()
  });

  insideBox.appendChild(img);
  document.getElementById('lightbox').style.display='inline';
}

var closeLightbox = function(){
  //return function(){
    document.getElementById('lightbox_content').removeChild(document.getElementById('lightbox_image'));
    document.getElementById('lightbox').style.display='none';
 // }
}

var addPhotos = function(photoObj){

  for(var i = 0; i < photoObj.length; i++) {
    var aTag = addNestedDivs();

    var img = document.createElement('img');
    //size q = 150x150 image
    img.src = buildImgUrl(photoObj[i], 'q')
    img.alt = photoObj[i].title;

    aTag.onclick = (function() {

      //var currUrl = buildImgUrl(photoObj[i], 'z');
      var curr = i;
      var wholeObj = photoObj;
      return function () {
        openLightbox(wholeObj, curr);
      }

    })()

    aTag.appendChild(img);
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
        addPhotos(photos.photos.photo);

      }
    }
  };

  xhr.send();


}

httpGet(buildUrl(toSearchFor));


