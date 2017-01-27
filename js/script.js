var map;
var markers;

var currentIndex = ko.observable(0);
var currentLocation = ko.observable();
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
function getDescription(name,index,cb){
    if (locations[index].description == '') {
        url = 'http://en.wikipedia.org/w/api.php'
        url += '?' + $.param({
          'action': 'opensearch',
          'search': name,
          'format':'json'
        });
        var w_items = [];
        $.ajax({
            'url': url,
            'dataType':'jsonp',
            'crossDomain':true,
            'success':function(data) {
                console.log(data);
                locations[index].description = 'No descriptions found in Wikipedia';
                $.each( data[2], function( key, val ) {
                    if (val.length > 10)
                        locations[index].description = val;
                });
                cb(locations[index].description);

                //wikiData.push(data);
            }
        }).fail(function(jqXHR, textStatus){
            console.log('No descriptions found in Wikipedia: '+textStatus);
            locations[index].description ='Error getting description: ' + textStatus;
            cb(locations[index].description);
        })
    } else {
        cb(locations[index].description);
    }
}
var filteredLocations;
var Location = function(data,index) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = ko.observable(data.description);
    this.getDescription = ko.computed(function() {
        getDescription(self.name,index,function(desc){self.description(desc);});

    },this);
    this.descVisible = ko.observable(false);
}
/*
    ViewModel: View Model for the App
*/
var ViewModel = function() {
    var self = this;
    this.txtFilter = ko.observable("");
    this.resultList = ko.observableArray([]);
    this.initLocations = ko.computed(function(){
        locations.forEach(
            function(location,index){
                self.resultList.push(new Location(location,index));
            }
        );
    });

    /*
        refreshLocations: Refreshes locations array based on contents of filteredLoc

        Parameters:
            data: array of location data to be used by each marker and infoWindow


    */
    this.refreshLocations = function refreshLocations(filteredLoc) {
        filteredLocations = [];
        filteredLoc.forEach(function(loc,index) {
            filteredLocations.push(formatLoc(loc.lat,loc.lng,loc.name,loc.description(),loc.descVisible(false)));
        })
    }
    /*
        filterLocations: sets computed object based on resultList observableArray
        Parameters:
            Anonymous function: filters list or returns resultList Array

    */
    this.filterLocations = ko.computed(function() {
        if(!self.txtFilter()) {
            // return self.resultList();
            return "";
        } else {
            var oTempArr = ko.utils.arrayFilter(self.resultList(), function(loc,index) {
                var match = loc.name.toLowerCase().indexOf(self.txtFilter().toLowerCase())>=0;
                markers[index].setVisible(match);
                return match;
            });
            //self.refreshLocations(oTempArr);
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
            var lat = self.filterLocations()[index()].lat;
            var lng = self.filterLocations()[index()].lng;
            var name = self.filterLocations()[index()].name;
            self.refreshLocations(self.filterLocations());
            self.filterLocations()[index()].descVisible(true);
            setMarker(markers[index()],index(),name);
            map.setCenter({lat:lat,lng:lng});
        }

    }
    self.filter = function () {
        self.txtFilter({name:self.txtFilter()});
    }

} // End ViewModel

ko.applyBindings(new ViewModel())