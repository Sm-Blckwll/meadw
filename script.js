
$(document).ready(function () {
    var map = L.map('map').setView([51.06, -4.2], 10.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var marker = L.marker([50.939626, -4.5447578]).addTo(map);
        marker.on('click', function() {
            openAFrameScene('southhole.jpg');
        });

        function openAFrameScene(photoUrl) {
            var aframeContainer = document.getElementById('aframe-container');
            var aframeSky = document.querySelector('a-sky');
            aframeSky.setAttribute('src', photoUrl);
            aframeContainer.style.display = 'block';
            window.scrollTo(0, 0);
        }

    var geojsonMarkerOptions = {
        fillColor: "#FFF",
        color: "#FFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.1
    };

    function propertySelect(feature, layer) {
        layer.on({
            click: function (e) {
                map.fitBounds(e.target.getBounds());
                var popup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent('<p><b>' + feature.properties.Name + '</b></p><p>' + feature.properties.Property + '</p>')
                    .openOn(map);
            }
        });
    }

    L.geoJSON(geojsonFeature, {
        style: geojsonMarkerOptions,
        onEachFeature: propertySelect
    }).addTo(map);

    function treeselect(feature, layer) {
        layer.on({
            click: function (e) {
                map.setView(e.latlng, 18);
                var popup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent('<p>' + feature.properties.description + '</p><p>Trees Planted: ' + feature.properties.treeCount + '</p>')
                    .openOn(map);
            }
        });
    }

    function style(feature) {
        return {
            fillColor: '#FFF',
            weight: 2,
            opacity: 1,
            color: '#FFF',
            dashArray: '7',
            fillOpacity: 0.1
        };
    }

    L.geoJson(geojsonTreeAreas, {
        style: style,
        onEachFeature: treeselect
    }).addTo(map);

    L.control.scale().addTo(map);

    var osmGeocoder = new L.Control.OSMGeocoder(options);
    map.addControl(osmGeocoder);

    var signalStrength = document.createElement('div');
    signalStrength.innerHTML = 'Signal Strength: ' + navigator.mozMobileConnection.voice.relSignalStrength;
    signalStrength.style.zIndex = 999;
    document.body.appendChild(signalStrength);

    
});