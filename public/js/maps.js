

let pointer;

async function getpoints () {

  const response = await fetch(`/party/points`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  pointer = await response.json()

  return pointer
};

getpoints()




console.log(pointer);



ymaps.ready(init);

function init() {
  var myMap = new ymaps.Map("map", {
    center: [55.763954, 37.606397],
    zoom: 11
  });



  for (i = 0; i < pointer.location.length; ++i) {

    place = new ymaps.Placemark(pointer.location[i], {hintContent: pointer.host[i].userName, 
      iconLayout: 'default#image',
      iconImageHref: '/img/ico.jpg',
      iconImageSize: [203, 254],
      iconImageOffset: [-80, -254]});
    myMap.geoObjects.add(place);

  }
}
