// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();

    var markers = [];
    var i = 0;
    var image = 'camera.png';

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            data.forEach(function(light) {
                var marker =
                {
                    mark: new google.maps.Marker({
                        position: {
                            lat: Number(light.location.latitude),
                            lng: Number(light.location.longitude)
                        },
                        map: map,
                        icon: image
                    }),
                    name: light.cameralabel
                };

                google.maps.event.addListener(marker.mark, 'click', function() {
                    var html = '<h2>' + light.cameralabel + '</h2>';
                    html += '<img src="' + light.imageurl.url + '"/>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                    map.panTo(marker.mark.getPosition());
                });
                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });
                markers[i] = marker;
                i++;
            });

        })
        .fail(function(error) {
            window.alert(error);
        })
        .always(function() {

        });

    $('#search').bind('search keyup', function(data) {
        markers.forEach(function(marker) {
            var name = marker.name.toLowerCase();
            var phrase = data.target.value.toLowerCase();
            console.log(phrase);
            if (name.indexOf(phrase) == -1) {
                marker.mark.setMap(null);
            } else {
                marker.mark.setMap(map);
            }
        });
    });

});