const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: true, // Use the geocoder's default marker style
    bbox: [-77.210763, 38.803367, -76.853675, 39.052643] // Set the bounding box coordinates
  });
  
  map.addControl(geocoder, 'top-left');

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbHVjYWRzcyIsImEiOiJjbTJ1dDNkdTkwNHZwMnNxMWc3Z3FmbjZqIn0.eirw3kZ1WkMs5HhdVptqdQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-42.754129, -5.093700,],
    zoom: 13,
    scrollZoom: false
});

// Obtenha a localização do usuário e busque os lugares próximos
navigator.geolocation.getCurrentPosition(position => {
    const userCoords = [position.coords.longitude, position.coords.latitude];
    fetchNearbyPlaces(userCoords);
});

// Função para buscar lugares próximos da API do Mapbox
function fetchNearbyPlaces(coords) {
const radius = 5000; // Raio de busca em metros
const query = 'hospital';
const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${coords[0]},${coords[1]}&limit=10&radius=${radius}&access_token=${mapboxgl.accessToken}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
    const stores = {
        type: 'FeatureCollection',
        features: data.features.map((feature, i) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: feature.geometry.coordinates
        },
        properties: {
            id: i,
            address: feature.text,
            city: feature.context.find(c => c.id.includes('place')).text || '',
            phoneFormatted: feature.properties && feature.properties.phone || '',
        }
        }))
    };

    // Adiciona o GeoJSON ao mapa
    map.addSource('places', {
        type: 'geojson',
        data: stores
    });

    // Construir listagem e adicionar marcadores
    buildLocationList(stores);
    addMarkers(stores);
    })
    .catch(error => console.error('Erro ao buscar lugares próximos:', error));
}

// Função para adicionar marcadores ao mapa
function addMarkers(stores) {
for (const marker of stores.features) {
    const el = document.createElement('div');
    el.id = `marker-${marker.properties.id}`;
    el.className = 'marker';

    new mapboxgl.Marker(el, { offset: [0, -23] })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

    el.addEventListener('click', (e) => {
    flyToStore(marker);
    createPopUp(marker);
    const activeItem = document.getElementsByClassName('active');
    e.stopPropagation();
    if (activeItem[0]) activeItem[0].classList.remove('active');
    const listing = document.getElementById(`listing-${marker.properties.id}`);
    listing.classList.add('active');
    });
}
}

// Função para criar listagem na barra lateral
function buildLocationList(stores) {
const listings = document.getElementById('listings');
listings.innerHTML = ''; // Limpar listagens antigas
for (const store of stores.features) {
    const listing = listings.appendChild(document.createElement('div'));
    listing.id = `listing-${store.properties.id}`;
    listing.className = 'item';
    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${store.properties.id}`;
    link.innerHTML = store.properties.address;
    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = store.properties.city;
    if (store.properties.phoneFormatted) {
    details.innerHTML += ` &middot; ${store.properties.phoneFormatted}`;
    }
    link.addEventListener('click', function () {
    flyToStore(store);
    createPopUp(store);
    const activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) activeItem[0].classList.remove('active');
    this.parentNode.classList.add('active');
    });
}
}

function flyToStore(currentFeature) {
map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
});
}

function createPopUp(currentFeature) {
const popUps = document.getElementsByClassName('mapboxgl-popup');
if (popUps[0]) popUps[0].remove();
new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
    `<h3>Sweetgreen</h3><h4>${currentFeature.properties.address}</h4>`
    )
    .addTo(map);
}