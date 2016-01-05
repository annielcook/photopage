'use strict'

//initial api parameters on page load
var initialParams = {
  toSearchFor: 'kitten',
  urlPath:'https://api.flickr.com/services/rest/?',
  method: 'flickr.photos.search',
  apiKey: '2aa08ff0cd754205c7d0a59f3ecda821',
  perPage: '32',
  format: 'json',
  callback: '1',
}

//image size definitions from Flickr API
var imgSm = 'q';
var imgMed = 'z';

//location of the search param in the array I build url from
var searchParamLocation = 6;


var buildUrl = function (data){
  var ret = "";
  for (var i = 0; i < data.length; i++){
    ret+= data[i];
  }
  return ret;
}


//add outer div for sizing then within add 'a' div
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


//take in the photo object and the size and return the constructed url
var buildImgUrl = function(selectedPhoto, size) {
  return buildUrl(['https://farm', selectedPhoto.farm, '.staticflickr.com/', selectedPhoto.server, 
    '/', selectedPhoto.id, '_', selectedPhoto.secret, '_', size, '.jpg']);
}


//called when arrow on lightbox clicked
var movePhoto = function(direction, arr, i){
  //only move if not at the first or last photo
  if(!(direction == 'left' && i == 0) && !(direction == 'right' && i == arr.length - 1)){
    closeLightbox();
    var j = direction === 'left' ? i-1 : i +1;
    openLightbox(arr, j);
  }
}


//open the lightbox image
var openLightbox = function(arrOfPhotoObj, curr){
  var insideBox = document.getElementById('lightbox_content');

  var img = createImgElt(arrOfPhotoObj[curr], imgMed);
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
    document.getElementById('lightbox_content').removeChild(document.getElementById('lightbox_image'));
    document.getElementById('lightbox').style.display='none';
}

var createImgElt = function(photo, size) {
  var img = document.createElement('img');
  img.src = buildImgUrl(photo, size);
  img.alt = photo.title;
  return img;
}

//remove photos when a new search is executed
var removePhotos = function(){
  var photos = document.getElementById("thumbnails");
  while (photos.firstChild) {
      photos.removeChild(photos.firstChild);
  }
}

//called on page load and adds photos returned from API request
var addPhotos = function(photoObj){

  for(var i = 0; i < photoObj.length; i++) {
    var aTag = addNestedDivs();
    var img = createImgElt(photoObj[i], imgSm);

    aTag.onclick = (function() {
      var curr = i;
      var wholeObj = photoObj;
      return function () {
        openLightbox(wholeObj, curr);
      }
    }())

    aTag.appendChild(img);
  }
}

//get request for url
var httpGet = function (theUrl){

  var xhr = new XMLHttpRequest();
  //3rd argument means async == true
  xhr.open('GET', theUrl, true);

  xhr.onreadystatechange = function() {
    //4 means request finished and response is ready
    if (this.readyState === 4) {
      //status that indicate no error
      if (this.status >= 200 && this.status < 400) {
        var photos = JSON.parse(this.responseText);
        //callback with JSON data
        addPhotos(photos.photos.photo);
      }
    }
  };
  //send the request
  xhr.send();
}

var newSearch = function(){
  removePhotos();
  apiParams[searchParamLocation] = document.getElementById('search-field').value;
  httpGet(buildUrl(apiParams));
}

var apiParams = [initialParams.urlPath, 'method=', initialParams.method, '&api_key=', initialParams.apiKey, '&text=', initialParams.toSearchFor, 
'&per_page=', initialParams.perPage, '&format=', initialParams.format, '&nojsoncallback=', initialParams.callback];

httpGet(buildUrl(apiParams));


