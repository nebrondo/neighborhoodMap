
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
function animateMarker(marker) {
    if (marker)
      marker.setAnimation(google.maps.Animation.BOUNCE);
}
function updateMarkers(data){
    markers = data.map(function(location, i) {
          return new google.maps.Marker({
            position: {lat:location.lat,lng:location.lng},
            //label: labels[i % labels.length],
            title: location.name,
            //icon: "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/green-jelly-icons-sports-hobbies/045315-green-jelly-icon-sports-hobbies-marker.png"
          });
    });
    showMarkers();
    //var markerCluster = new MarkerClusterer(map, markers);
}
var formatLoc = function(lat,lng,name,desc){
    return {lat:lat,lng:lng,name:name,description:desc};
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setAnimation(null)
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
    {lat: 33.92, lng: -118.39,name:"El Segundo",description:"El Segundo is a city in Los Angeles County, California, United States. El Segundo, from Spanish, means The Second in English."},
    {lat: 34.92, lng: -118.39,name:"Twin Lakes",description:"Fishing - What the Eastern Sierra's are known for! Please read your reg's before fishing, as they change each year."},
    {lat: 35.92, lng: -118.39,name:"Sequoia National Forest",description:"Sequoia National Forest is located in the southern Sierra Nevada mountains of California. The U.S. National Forest is named for the majestic Giant Sequoia trees which populate 38 distinct groves within the boundaries of the forest"},
    {lat: 36.92, lng: -118.39,name:"Kings Canyon National Park",description:"Kings Canyon National Park is adjacent to Sequoia National Park in California's Sierra Nevada mountains. It's known for its huge sequoia trees, notably the gigantic General Grant Tree in Grant Grove. To the east, Cedar Grove is surrounded by towering granite canyon walls. From here, trails lead to Zumwalt Meadow along the Kings River, and to Roaring River Falls. The park is home to rattlesnakes, bears and cougars."},
    {lat: 37.92, lng: -118.39,name:"White Mountain Peak",description:"White Mountain Peak, at 14,252-foot, is the highest peak in the White Mountains of California, the highest peak in Mono County, and the third highest peak in the state after Mount Whitney and Mount Williamson."},
    {lat: 38.92, lng: -118.39,name:"Walker River Reservation",description:"The Walker River Indian Reservation is an Indian reservation located in central Nevada in the United States. It belongs to the Walker River Paiute Tribe, a federally recognized tribe of Northern Paiute people."},
    {lat: 39.92, lng: -118.39,name:"Humboldt State Wildlife Management Area",description:"The Humboldt Wildlife Management Area is a wildlife management area in the U.S. state of Nevada, encompassing the salt marshes at the terminus of the Humboldt River"},
    {lat: 32.92, lng: -118.39,name:"San Clemente Island",description:"San Clemente Island is the southernmost of the Channel Islands of California. It is owned and operated by the United States Navy, and is a part of Los Angeles County"},
    {lat: 31.92, lng: -110.39,name:"Apache Peak",description:"Apache Peak Trail is a 9.7 mile moderately trafficked out and back trail located near Mountain Center, California that features beautiful wild flowers and is rated as difficult. The trail offers a number of activity options and is accessible year-round. Dogs and horses are also able to use this trail."},
    {lat: 30.92, lng: -110.39,name:"Cananea",description:"Cananea is a city in the northern Mexican state of Sonora, Northwestern Mexico. It is the seat of the Municipality of Cananea, on the U.S−Mexico border. The population of the city was 31,560 as recorded by the 2010 census."},
    {lat: 40.92, lng: -110.39,name:"Uinta-Wasatch-Cache National Forest",description:"Wasatch-Cache National Forest is a United States National Forest located primarily in northern Utah, with smaller parts extending into southeastern Idaho and southwestern Wyoming."},
    {lat: 41.92, lng: -110.39,name:"Kemmerer",description:"Kemmerer is both the largest city and the county seat of Lincoln County, Wyoming, United States. The population was 2,656 at the 2010 census. As the county seat of Lincoln County, Kemmerer is the location of the Lincoln County Courthouse."}
    ]

var Location = function(data){
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.description = ko.observable(data.description);
    this.descVisible = ko.observable(false);

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
            locations.push(formatLoc(loc.lat(),loc.lng(),loc.name(),loc.description(),loc.descVisible(false)));
        })
        clearMarkers();
        updateMarkers(locations,map)
    }

    this.filterLocations = ko.computed(function() {
        if(!self.txtFilter()) {
            return self.resultList();
        } else {
            var oTemp = ko.utils.arrayFilter(self.resultList(), function(loc) {
                 return loc.name().toLowerCase().indexOf(self.txtFilter().toLowerCase())>=0;
            });
            self.refreshLocations(oTemp);
            return oTemp;

        }
    });
    this.showDetails = function(index) {
        if(markers)
        {
            clearMarkers();
            //self.refreshDesc();
            if (self.filterLocations()[index()].descVisible()){
                self.filterLocations()[index()].descVisible(false);
            }else{
                self.filterLocations()[index()].descVisible(true);
            }
            updateMarkers(locations,map);
            animateMarker(markers[index()]);
        }
    }
    self.filter = function () {

        self.txtFilter({name:self.txtFilter()});
    }

    this.currentLocation = ko.observable(this.resultList()[0]);

}

ko.applyBindings(new ViewModel())