$(document).ready(function () {
    $('#pointerLockInstruction').css('display', 'block');
    var map = L.map('map').setView([51.00, -4.4], 10.5);

    L.esri.basemapLayer('Imagery').addTo(map)

    var popupContent = `
    <div class="custom-popup">
        <img src="photos/DJI_0580.JPG" alt="Placeholder Image">
        
    </div>
`;

// Define a custom icon
var smallIcon = L.icon({
    iconUrl: 'font/pin.svg',  // Replace with the path to your icon
    iconSize: [40, 40],  // Set the size of the icon
    iconAnchor: [20, 40],  // Set the anchor point of the icon
});

// Create a marker with the custom icon
var southholemarker = L.marker([50.939626, -4.5447578], {icon: smallIcon}).addTo(map);
southholemarker.bindPopup(popupContent, {
    className: 'custom-popup',
    closeButton: false
});

// Show the popup when the mouse is over the marker
southholemarker.on('mouseover', function () {
    this.openPopup();
});

// Hide the popup when the mouse is out of the marker
southholemarker.on('mouseout', function () {
    this.closePopup();
});

// Use jQuery to bind a click event to the popup
southholemarker.on('click', function () {
    openAFrameScene('skyTexture');
    console.log("Popup clicked");
});

    // Define the function to open the A-Frame scene
    function openAFrameScene(photoId) {
        var aframeScene = document.querySelector('a-scene');
        var aframeSky = document.querySelector('a-sky');
        aframeSky.setAttribute('src', '#' + photoId);
        aframeScene.style.display = 'block';  // Show the A-Frame scene
        console.log("Photo ID:", photoId);
        $('#map').hide();
        $('#fullscreenButton').show();
    }

    // Enable pointer lock on Ctrl/Command key press
    $(document).keydown(function (event) {
        if (event.ctrlKey || event.metaKey) {
            if (document.pointerLockElement === document.body) {
                document.exitPointerLock();
            } else {
                document.body.requestPointerLock();
            }
        }
    });

    // Exit pointer lock on Esc key press
    document.addEventListener('pointerlockchange', function () {
        if (document.pointerLockElement !== document.body) {
            document.exitPointerLock();
        }
    });

    // Handle zoom with mouse wheel (reversed direction)
    var aframeScene = document.querySelector('a-scene');

    aframeScene.addEventListener('wheel', function (event) {
        event.preventDefault();  // Prevent the main site from scrolling

        var cameraEl = document.getElementById('camera');
        var camera = cameraEl.getObject3D('camera');
        camera.fov += event.deltaY * 0.05;  // Reverse zoom direction
        camera.fov = Math.max(40, Math.min(80, camera.fov)); // Limit the FOV between 10 and 100
        camera.updateProjectionMatrix();
    });

    // Close button functionality
    $('#closeButton').click(function () {
        var aframeScene = document.querySelector('a-scene');
        aframeScene.style.display = 'none';  // Hide the A-Frame scene
        $('#map').show();  // Show the map
        $('#fullscreenButton').hide();
    });

    //fullscreen button functionality
    $('#fullscreenButton').click(function () {
        var aframeScene = document.querySelector('a-scene');
        var cameraEl = document.querySelector('a-camera');
        var camera = cameraEl.getObject3D('camera');

        if (!aframeScene.classList.contains('full-window')) {
            aframeScene.classList.add('full-window');
            camera.aspect = window.innerWidth / window.innerHeight;
        } else {
            aframeScene.classList.remove('full-window');
            camera.aspect = aframeScene.offsetWidth / aframeScene.offsetHeight;
        }

        camera.updateProjectionMatrix();
    });

    // Handle zoom with touch pinch gestures
    var initialPinchDistance = null;
    var initialFov = null;

    $(document).on('touchstart', function (event) {
        if (event.touches.length === 2) {
            initialPinchDistance = getPinchDistance(event.touches);
            var cameraEl = $('#camera')[0];
            var camera = cameraEl.getObject3D('camera');
            initialFov = camera.fov;
        }
    });

    $(document).on('touchmove', function (event) {
        if (event.touches.length === 2 && initialPinchDistance !== null) {
            var newPinchDistance = getPinchDistance(event.touches);
            var scaleFactor = initialPinchDistance / newPinchDistance;
            var cameraEl = $('#camera')[0];
            var camera = cameraEl.getObject3D('camera');
            camera.fov = initialFov * scaleFactor;
            camera.fov = Math.max(40, Math.min(80, camera.fov));
            camera.updateProjectionMatrix();
        }
    });

    $(document).on('touchend', function (event) {
        if (event.touches.length < 2) {
            initialPinchDistance = null;
            initialFov = null;
        }
    });

    function getPinchDistance(touches) {
        var dx = touches[0].clientX - touches[1].clientX;
        var dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});