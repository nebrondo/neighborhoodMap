var map;
var markers;
var infoWindow;
var infoWindowMsg;
var wikiData=ko.observableArray([]);
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var locations = [
    {lat: 33.92, lng: -118.39,name:'El Segundo',description:''},
    {lat: 34.92, lng: -118.39,name:'Twin Lakes',description:''},
    {lat: 35.92, lng: -118.39,name:'Sequoia National Forest',description:''},
    {lat: 36.92, lng: -118.39,name:'Kings Canyon National Park',description:''},
    {lat: 37.92, lng: -118.39,name:'White Mountain Peak',description:''},
    {lat: 38.92, lng: -118.39,name:'Walker River Reservation',description:''},
    {lat: 39.92, lng: -118.39,name:'Humboldt State Wildlife Management Area',description:''},
    {lat: 32.92, lng: -118.39,name:'San Clemente Island',description:''},
    {lat: 31.92, lng: -110.39,name:'Apache Peak',description:''},
    {lat: 30.92, lng: -110.39,name:'Cananea',description:''},
    {lat: 40.92, lng: -110.39,name:'Uinta-Wasatch-Cache National Forest',description:''},
    {lat: 41.92, lng: -110.39,name:'Kemmerer',description:''}
];

var filteredLocations;

/*
    loadData: Used to load data for the map to display description in markers
*/
function loadData() {
    locations.forEach(function(location,index) {
        url = 'http://en.wikipedia.org/w/api.php'
        url += '?' + $.param({
          'action': 'opensearch',
          'search': location.name,
          'format':'json'
        });
        var w_items = [];
        var wikiRequestTimeout = setTimeout(function(){
            locations[index].description = 'Failed do get descriptions from Wikipedia.';
        },8000)
        $.ajax({
            'url': url,
            'dataType':'jsonp',
            'crossDomain':true,
            'success':function(data) {
                console.log(data);
                $.each( data[2], function( key, val ) {
                    if (val.length > 10)
                        locations[index].description = val;
                });
                wikiData.push(data);
                clearTimeout(wikiRequestTimeout);
            }
        })
    });
};
/*
    loadMap: Makes Ajax call prior to initialize the Map in the page.
*/
function loadMap() {
    var url='https://maps.googleapis.com/maps/api/js?key=AIzaSyBFfd_W6FyD5M5YQVTwDKnP4mX4Tosj2Yw'
    $.ajax({
        'url': url,
        'dataType':'jsonp',
        'crossDomain':true,
        'success':function(data) {
            console.log(data)
            initMap();
        }
    });
}
var Location = function(data,index) {
    var self = this;
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.description = ko.observable('');
    this.getDescription = ko.computed(function() {
        this.description('No data received for this location');
        url = 'http://en.wikipedia.org/w/api.php'
        url += '?' + $.param({
          'action': 'opensearch',
          'search': this.name,
          'format':'json'
        });
        var w_items = [];
        $.ajax({
            'url': url,
            'dataType':'jsonp',
            'crossDomain':true,
            'success':function(data) {
                console.log(data);
                $.each( data[2], function( key, val ) {
                    if (val.length > 10)
                        self.description(val);
                });
                wikiData.push(data);
            }
        })
    },this);
    this.descVisible = ko.observable(false);
}
/*
    ViewModel: View Model for the App
*/
var ViewModel = function() {
    var self = this;
    this.txtFilter = ko.observable();
    this.resultList = ko.observableArray([]);
    this.initLocations = ko.computed(function(){
        locations.forEach(
            function(location,index){
                self.resultList.push(new Location(location,index));
            }
        );
    });
    loadData();
    loadMap();

/*
    refreshLocations: Refreshes locations array based on contents of filteredLoc

    Parameters:
        data: array of location data to be used by each marker and infoWindow


*/
    this.refreshLocations = function refreshLocations(filteredLoc) {
        filteredLocations = [];
        filteredLoc.forEach(function(loc,index) {
            filteredLocations.push(formatLoc(loc.lat(),loc.lng(),loc.name(),loc.description(),loc.descVisible(false)));
        })
        clearMarkers();
        initMarkers(filteredLocations);
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
            map.setCenter({lat:lat,lng:lng});
            setMarker(markers[index()],desc);
        }

    }
    self.filter = function () {
        self.txtFilter({name:self.txtFilter()});
    }
    this.currentLocation = ko.observable(this.resultList()[0]);
}

ko.applyBindings(new ViewModel())