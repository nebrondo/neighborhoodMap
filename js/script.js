
var map;
var markers;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function initMap() {
    //33.9245199,-118.3870989

    var uluru = {lat: 33.92, lng: -118.39};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: uluru
    });
    updateMarkers(locations,map);
}

function updateMarkers(data){
    markers = data.map(function(location, i) {
          return new google.maps.Marker({
            position: {lat:location.lat,lng:location.lng},
            label: labels[i % labels.length],
            title: location.name
          });
    });
    showMarkers();
    //var markerCluster = new MarkerClusterer(map, markers);
}
var formatLoc = function(lat,lng,name){
    return {lat:lat,lng:lng,name:name};
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
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
var locations = [
    {lat: 33.92, lng: -118.39,name:"El Segundo"},
    {lat: 34.92, lng: -118.39,name:"Twin Lakes"},
    {lat: 35.92, lng: -118.39,name:"Sequoia National Forest"},
    {lat: 36.92, lng: -118.39,name:"Kings Canyon National Park"},
    {lat: 37.92, lng: -118.39,name:"White Mountain Peak"},
    {lat: 38.92, lng: -118.39,name:"Walker River Reservation"},
    {lat: 39.92, lng: -118.39,name:"Humbbldt State Wildlife Management Area"},
    {lat: 32.92, lng: -118.39,name:"San Clemente Island"},
    {lat: 31.92, lng: -110.39,name:"Apache Peak"},
    {lat: 30.92, lng: -110.39,name:"Cananea"},
    {lat: 40.92, lng: -110.39,name:"Ashley National Park"},
    {lat: 41.92, lng: -110.39,name:"Kemmerer"}
    ]

var Location = function(data){
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);

}

var ViewModel = function() {
    var self = this;
    this.map =
    this.resultList = ko.observableArray([]);
    var url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFfd_W6FyD5M5YQVTwDKnP4mX4Tosj2Yw"
    this.txtFilter = ko.observable();

    $.ajax({
        'url': url,
        'dataType':'jsonp',
        'crossDomain':true,
        'success':function(data) {
            console.log(data)
            initMap();
        }
    }).done(function(){
        console.log('Done?')
    })

    locations.forEach(function(location){
        self.resultList.push(new Location(location));
    })

    this.refreshLocations = function refreshLocations(filteredLoc){
        locations = [];
        filteredLoc.forEach(function(loc,index){
            locations.push(formatLoc(loc.lat(),loc.lng(),loc.name()));
        })
        clearMarkers();
        updateMarkers(locations,map)
    }

    this.filterLocations = ko.computed(function() {
        if(!self.txtFilter()) {
            return self.resultList();
        } else {
            // return ko.utils.arrayFilter(self.resultList(), function(loc) {
            //     return loc.name().toLowerCase().indexOf(self.txtFilter().toLowerCase())>=0;
            // });
            var oTemp = ko.utils.arrayFilter(self.resultList(), function(loc) {
                 return loc.name().toLowerCase().indexOf(self.txtFilter().toLowerCase())>=0;
            });
            self.refreshLocations(oTemp);
            return oTemp;

        }
    });

    self.filter = function () {
        self.txtFilter({name:self.txtFilter()});
    }

    this.currentLocation = ko.observable(this.resultList()[0]);

}

ko.applyBindings(new ViewModel())