
                // TO MAKE THE MAP APPEAR YOU MUST
                // ADD YOUR ACCESS TOKEN FROM
                // https://account.mapbox.com

            

                mapboxgl.accessToken = mapToken;

                const map = new mapboxgl.Map({
                    container: 'map', // container ID
                    style:"mapbox://styles/mapbox/streets-v12", // style URL
                    center: [73.8567, 18.5204], // starting position [lng, lat]
                    zoom: 9 // starting zoom
                });
