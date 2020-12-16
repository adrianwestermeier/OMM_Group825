/**
posts image to express server
*/
function submitForm(event) {
  var payload = {
    name: event.target.elements.name.value,
    url: event.target.elements.url.value,
    width: event.target.elements.width.value,
    height: event.target.elements.height.value,
    boxCount: event.target.elements.boxCount.value
  };

  var data = new FormData();
  data.append( "json", JSON.stringify( payload ) );

  alert('sending data ' + JSON.stringify( payload ));

fetch(`http://localhost:3000/images/handle`, 
{
  method: 'POST', 
  mode: 'no-cors',
  body: JSON.stringify( payload )
})
  .then(jsonResponse => jsonResponse.json()
  .then(responseObject => {
      alert('recieved answer for post request: ' + JSON.stringify( responseObject ));
    })
    .catch(jsonParseError => {
      console.error(jsonParseError);
    })
  ).catch(requestError => {
    console.error(requestError);
  });

  return true;
}