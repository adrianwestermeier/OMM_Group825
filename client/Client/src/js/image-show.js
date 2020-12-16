function postJSON(url, callback, params) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4){
        callback(JSON.parse(xhr.responseText));
      }
    }
    xhr.send(params)
  }

//top caption
  var topForm = document.querySelector('#topForm');
  var topIn = document.querySelector('input[name=top]');
  var topOut = document.querySelector('#topOut');

  topForm.addEventListener('submit', function(e) {
    var params;
    e.preventDefault(); 
    // with params!
    params = JSON.stringify({top: topIn.value});
    postJSON('http://httpbin.org/post', function(res) {
      topOut.innerHTML = res.json.top;
    }, params)
  });

//bottom caption
  var bottomForm = document.querySelector('#bottomForm');
  var bottomIn = document.querySelector('input[name=bottom]');
  var bottomOut = document.querySelector('#bottomOut');

  bottomForm.addEventListener('submit', function(e) {
    var params;
    e.preventDefault(); 
    // with params!
    params = JSON.stringify({bottom: bottomIn.value});
    postJSON('http://httpbin.org/post', function(res) {
      bottomOut.innerHTML = res.json.bottom;
    }, params)
  });


  'use strict';
window.addEventListener('DOMContentLoaded', function () {
            const backButton = document.getElementById('backButton');
            const nextButton = document.getElementById('nextButton');
            let memes;

            function fillArray(text){
                memes = text
                console.log(memes[0]);
            }

            const numberOfImages = () => memes.length;
            // this is a counter that holds the id/number of the currently displayed image.
            let currentImageID = 0;
  

            /**
             * shows the image by giving it the 'current' class
             * the CSS in the <style> block above specifies that only the slides
             * with the .current class are shown, the rest has display: none
             *
             * @param number {Number} id of the image.
             */
            function showImage(number) {
            	let meme = memes[number]
				      document.getElementById('slideShowImages').innerHTML = ''
				      document.getElementById('slideShowImages').append(renderImage(meme.url, meme.width, meme.height, meme.name))

                console.log(`showing image ${number}`)
            }

            function renderImage(url, width, height, name){
                const figure = document.createElement('figure');
                figure.className = "slidecurrent";
                const newImage = document.createElement('img');
                newImage.src = url;
                newImage.width = width;
                newImage.height = height;
                const figCaption = document.createElement('figcaption');
                figCaption.innerHTML = `${name}   ${url}`;

                figure.appendChild(newImage);
                figure.appendChild(figCaption);

                return figure
            }



            backButton.addEventListener('click', function () {
                currentImageID = currentImageID == 0 ? numberOfImages()-1 : currentImageID - 1;
                showImage(currentImageID);
            });
            nextButton.addEventListener('click', function () {
                currentImageID = currentImageID == numberOfImages()-1 ? 0 : currentImageID + 1;
                showImage(currentImageID);
            });

            /**
            (re)loads the images for the current filter config
            */
            function loadImageUrls() {
              fetch(`http://localhost:3000/images/`, {method: 'GET'})
              .then(jsonResponse => jsonResponse.json()
              .then(responseObject => {
                  console.log('length of received images: ' + responseObject.images.length);
                  return responseObject.images;
                })
                .catch(jsonParseError => {
            			console.error(jsonParseError);
            		})
                .then(data => {
                      fillArray(data); 
                      showImage(0);
                      console.log('added image');
                    })
              ).catch(requestError => {
            		console.error(requestError);
            	});
            }

            loadImageUrls();
        });