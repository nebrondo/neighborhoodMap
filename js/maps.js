var infoWindow;
function initMap() {
    var els = {lat: 33.92, lng: -118.39};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: els
    });
    initMarkers(locations);
    infoWindow = new google.maps.InfoWindow();
}
/*
    initMarkers: creates a collection of markers to be put into the map.
                   It creates a click listener to enable animation and
                   infoWindow.
    Parameters:
        data: array of location data to be used by each marker and infoWindow


*/
function initMarkers(data) {
    markers = null;
    markers = data.map(function(location, i) {
        marker = new google.maps.Marker({
            position: {lat:location.lat,lng:location.lng},
            title: location.name,
          });

        marker.addListener('click', function() {
            if (marker.setAnimation)
            {
                setMarker(this,location.description);
            }
        });
        return marker;


    });
    showMarkers();
}
var formatLoc = function(lat,lng,name,desc) {
    return {lat:lat,lng:lng,name:name,description:desc};
}
function setMarker(marker,desc) {
    if (marker)
    {
        stopAnimation();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);
        //this.setAnimation(google.maps.Animation.BOUNCE);
    }

    if (infoWindow)
        infoWindow.close();
    infoWindow.setContent(desc);
    infoWindow.open(map,marker);

}
function stopAnimation() {
    if (markers)
    {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null)
        }
    }
}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
        markers[i].setMap(map);
    }
}
function showMarkers() {
    setMapOnAll(map);
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}