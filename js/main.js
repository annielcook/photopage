'use strict'

//initial api parameters on page load
var toSearchFor = 'kitten';
var urlPath = 'https://api.flickr.com/services/rest/?';
var method = 'flickr.photos.search';
var apiKey = '2aa08ff0cd754205c7d0a59f3ecda821';
var perPage = '32';
var format = 'json';
var callback = '1';

var imgSm = 'q';
var imgMed = 'z';


var buildUrl = function (data){
  var ret = "";
  for (var i = 0; i < data.length; i++){
    ret+= data[i];
  }
  return ret;
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


//take in the phot and the size and return the constructed url
var buildImgUrl = function(selectedPhoto, size) {
  return buildUrl(['https://farm', selectedPhoto.farm, '.staticflickr.com/', selectedPhoto.server, 
    '/', selectedPhoto.id, '_', selectedPhoto.secret, '_', size, '.jpg']);
}

var movePhoto = function(direction, arr, i){
  //only move if not at the first or last photo
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

  var thumbSize = imgMed;
  // var selectedPhoto = arrOfPhotoObj[curr];

  //es7 concatenation
  img.src = buildImgUrl(arrOfPhotoObj[curr], thumbSize);//`https://farm${selectedPhoto.farm}.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}_${thumbSize}.jpg`;
  console.log(img.src);
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
    img.src = buildImgUrl(photoObj[i], imgSm)
    img.alt = photoObj[i].title;



    aTag.onclick = (function() {
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
  //3rd argument means async == true
  xhr.open('GET', theUrl, true);

  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        var photos = JSON.parse(this.responseText);
        //callback with JSON data
        addPhotos(photos.photos.photo);
      }
    }
  };

  xhr.send();
}

var apiParams = [urlPath, 'method=', method, '&api_key=', apiKey, '&text=', toSearchFor, 
'&per_page=', perPage, '&format=', format, '&nojsoncallback=', callback];

httpGet(buildUrl(apiParams));


