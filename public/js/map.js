
                // TO MAKE THE MAP APPEAR YOU MUST
                // ADD YOUR ACCESS TOKEN FROM
                // https://account.mapbox.com

            

                mapboxgl.accessToken = mapToken;

                const map = new mapboxgl.Map({
                    container: 'map', // container ID
                    style:"mapbox://styles/mapbox/streets-v12", // style URL
                    center: [77.209, 28.6139], // starting position [lng, lat]
                    zoom: 9 // starting zoom
                });

                // create new marker 
                console.log(coordinates);

                const marker = new mapboxgl.Marker({color:"red"})
                .setLngLat(coordinates)
                .setPopup(
                    new mapboxgl.Popup({offset:25}).setHTML(
                    `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`
                    )
                )
                .addTo(map);