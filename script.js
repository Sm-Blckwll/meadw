$(document).ready(function () {
    $('#pointerLockInstruction').css('display', 'block');
        var map = L.map('map').setView([51.06, -4.2], 10.5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var marker = L.marker([50.939626, -4.5447578]).addTo(map);
        marker.on('click', function () {
          openAFrameScene('southhole.jpg');
        });

        function openAFrameScene(photoUrl) {
          var aframeContainer = document.getElementById('aframe-container');
          var aframeSky = document.querySelector('a-sky');
          aframeSky.setAttribute('src', photoUrl);
          aframeContainer.style.display = 'block';
          
          window.scrollTo(0, 0);
        }

        // Enable pointer lock on Ctrl/Command key press
    $(document).keydown(function(event) {
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
        document.addEventListener('wheel', function(event) {
          var cameraEl = document.getElementById('camera');
          var camera = cameraEl.getObject3D('camera');
          camera.fov += event.deltaY * 0.05;  // Reverse zoom direction
          camera.fov = Math.max(40, Math.min(80, camera.fov)); // Limit the FOV between 10 and 100
          camera.updateProjectionMatrix();
        });

        // Close button functionality
    $('#closeButton').click(function() {
        var aframeContainer = document.getElementById('aframe-container');
        aframeContainer.style.display = 'none';
    });
      });