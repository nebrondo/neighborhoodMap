
var map;
var markers;
var infoWindow;
var infoWindowMsg;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $svImg = $('#svImg')
    var $inputStreet = $('#street')
    var $inputCity = $('#city')
    var nytAPIKey = "49a224ee282d4eb68da6e9f97e81e2fd"
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    var sCity=$inputCity[0].value,sAddress=$inputStreet[0].value;
    var imgSrc
    var imgTag = "<img id='svImg' class='bgimg' src=''>"
    // load streetview
    imgSrc = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location="

    imgSrc += (sAddress).replace(/ /g,"%20") + "," + (sCity).replace(/ /g,"%20")
    imgTag = imgTag.replace("src=''","src='"+imgSrc+"'")
    $body.append($(imgTag))
    // YOUR CODE GOES HERE!

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "49a224ee282d4eb68da6e9f97e81e2fd",
      'q': sCity,
      'begin_date': "20100101"
    });

    var items = [];
    $.getJSON(url,function(data){
        console.log(data)
        $.each( data.response.docs, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val.headline.main + "</li>" );
        });
        var nytItems = items.join("");
        $nytElem.append(nytItems);
    }).fail(function(e){
        $nytElem.append("<b>Articles could not be loaded</b>");
    });

    url = "http://en.wikipedia.org/w/api.php"
    url += '?' + $.param({
      'action': 'opensearch',
      'search': sCity,
      'format':'json'

    });
    var w_items = [];
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed do get wikipedia resources.")
    },8000)
    $.ajax({
        'url': url,
        'dataType':'jsonp',
        'crossDomain':true,
        'success':function(data) {
            console.log(data)
            $.each( data[1], function( key, val ) {
                w_items.push( "<li id='" + key + "'><a href='" + data[3][key] + "'>" + val + "</a></li>" );
            });
            var wikiItems = w_items.join("");
            $wikiElem.append(wikiItems);
            clearTimeout(wikiRequestTimeout);
        }
    }).done(function(){
        console.log('Done?')
    })

    return false;
};



function initMap() {
    //33.9245199,-118.3870989

    var uluru = {lat: 33.92, lng: -118.39};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: uluru
    });

    initMarkers(locations);
}
/*
    initMarkers: creates a collection of markers to be put into the map.
                   It creates a click listener to enable animation and
                   infoWindow.
    Parameters:
        data: array of location data to be used by each marker and infoWindow


*/
function initMarkers(data){
    markers = null;
    markers = data.map(function(location, i) {
        marker = new google.maps.Marker({
            position: {lat:location.lat,lng:location.lng},
            //label: labels[i % labels.length],
            title: location.name,
            //icon: "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/green-jelly-icons-sports-hobbies/045315-green-jelly-icon-sports-hobbies-marker.png"
          });

        marker.addListener('click', function() {
            if (marker.setAnimation)
            {
                //stopAnimation();
                setMarker(this,location.description);
                //this.setAnimation(google.maps.Animation.BOUNCE);
            }
            // if (infoWindow)
            //     infoWindow.close();
            // infoWindow = new google.maps.InfoWindow({content:location.description});
            // infoWindow.open(map,this);
        });
        return marker;


    });
    showMarkers();
    //var markerCluster = new MarkerClusterer(map, markers);
}
var formatLoc = function(lat,lng,name,desc){
    return {lat:lat,lng:lng,name:name,description:desc};
}
function setMarker(marker,desc) {
    // if (marker)
    // {
    //     marker.setAnimation(google.maps.Animation.BOUNCE);
    //     setTimeout(function () {
    //         marker.setAnimation(null);
    //     }, 3000);
    // }

    if (marker)
    {
        stopAnimation();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 3000);
        //this.setAnimation(google.maps.Animation.BOUNCE);
    }
    if (infoWindow)
        infoWindow.close();
    infoWindow = new google.maps.InfoWindow({content:desc});
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
/*
    refreshLocations: Refreshes locations array based on contents of filteredLoc

    Parameters:
        data: array of location data to be used by each marker and infoWindow


*/
    this.refreshLocations = function refreshLocations(filteredLoc){
        locations = [];
        filteredLoc.forEach(function(loc,index){
            locations.push(formatLoc(loc.lat(),loc.lng(),loc.name(),loc.description(),loc.descVisible(false)));
        })
        clearMarkers();
        initMarkers(locations);
    }
/*
    filterLocations: sets computed object based on resultList observableArray
    Parameters:
        Anonymous function: filters list or returns resultList Array

*/
    this.filterLocations = ko.computed(function() {
        if(!self.txtFilter()) {
            return self.resultList();
        } else {
            var oTempArr = ko.utils.arrayFilter(self.resultList(), function(loc) {
                 return loc.name().toLowerCase().indexOf(self.txtFilter().toLowerCase())>=0;
            });
            self.refreshLocations(oTempArr);
            return oTempArr;

        }
    });
/*
    showDetails: Enables details for a particular location fro the list
    Parameters:
        index: array of location data to be used by each marker and infoWindow
*/
    this.showDetails = function(index) {
        if(markers)
        {
            var desc = self.filterLocations()[index()].description();
            var lat = self.filterLocations()[index()].lat();
            var lng = self.filterLocations()[index()].lng();
            self.refreshLocations(self.filterLocations());
            self.filterLocations()[index()].descVisible(true);
            setMarker(markers[index()],desc);
            //initMarkers(locations);
            map.setCenter({lat:lat,lng:lng})
            setMarker(markers[index()],desc);
        }

    }
    self.filter = function () {

        self.txtFilter({name:self.txtFilter()});
    }

    this.currentLocation = ko.observable(this.resultList()[0]);

}

ko.applyBindings(new ViewModel())