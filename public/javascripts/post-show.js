
           mapboxgl.accessToken ='pk.eyJ1IjoibXVraXNoYXJtMSIsImEiOiJja2w5Z2thMGgwOWRwMnFueWtmdXVzZ3dlIn0.R4OLJ3A9takNqLr89p_NxA';
           
           var map = new mapboxgl.Map({
             container: 'map',
             style: 'mapbox://styles/mapbox/light-v9',
             center:  post.geometry.coordinates,
             zoom: 3
           });
           
       
             // create a HTML element our location feature
             var el = document.createElement('div');
             el.className = 'marker';
           
             // make a marker for location and add to the map
             new mapboxgl.Marker(el)
              .setLngLat(post.geometry.coordinates) // <--- AND HERE
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
                      .addTo(map);
           
           
           
             // Toggle edit review form
                $('.toggle-edit-form').on('click', function() {
            	// toggle the edit button text on click
            	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
        	// toggle visibility of the edit review form
                	$(this).siblings('.edit-review-form').toggle();
});

// adding clicklistiner for clearing the rating 
$('.clear-rating').click(function(){
  $(this).siblings('.input-no-rate').click();
});
