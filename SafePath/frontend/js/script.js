async function initMap() {
    const response = await fetch("https://safepath-server.onrender.com/api/mapa");
    const data = await response.json();

    const script = document.createElement('script');
    script.src = data.url;
    script.async = true;

    script.onload = () => {
        getLocation(); 
    };

    document.head.appendChild(script);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getHospitais(latitude, longitude);
        }, () => {
            alert("Erro ao obter a localização.");
        });
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
}

async function getHospitais(latitude, longitude) {
    try {
        const response = await fetch(`https://safepath-server.onrender.com/api/hospitais?latitude=${latitude}&longitude=${longitude}`);
        if (!response.ok) {
            console.error("Erro ao buscar hospitais:", response.statusText);
            return;
        }

        const hospitais = await response.json();
        displayMap(hospitais, latitude, longitude);
    } catch (error) {
        console.error("Erro ao buscar hospitais:", error);
    }
}

async function displayMap(hospitais, latitude, longitude) {
    const mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(latitude, longitude),
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    const userMarker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        title: `Sua Localização`,
        icon: {
            url: 'img/location-blue-pin-sign.png',
            scaledSize: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 12.5)
        }
    });

    const userInfoWindow = new google.maps.InfoWindow({
        content: `<h3>Sua Localização</h3>`
    });

    userMarker.addListener("click", () => {
        userInfoWindow.open(map, userMarker);
    });

    const nearestHospitalButton = document.createElement("button");
    nearestHospitalButton.classList.add("map-button");
    nearestHospitalButton.innerHTML = "Ir para o hospital mais próximo";
    
    nearestHospitalButton.onclick = () => {
        const nearestHospital = getNearestHospital(latitude, longitude, hospitais);
        if (nearestHospital) {
            map.setCenter(new google.maps.LatLng(nearestHospital.latitude, nearestHospital.longitude));
            map.setZoom(15);
            
            const nearestHospitalInfoWindow = new google.maps.InfoWindow({
                content: `<h3>${nearestHospital.name}</h3>`
            });
            
            nearestHospitalInfoWindow.setPosition(new google.maps.LatLng(nearestHospital.latitude, nearestHospital.longitude));
            nearestHospitalInfoWindow.open(map);
        }
    };

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(nearestHospitalButton);

    hospitais.forEach(hospital => {
        const hospitalMarker = new google.maps.Marker({
            position: new google.maps.LatLng(hospital.latitude, hospital.longitude),
            map: map,
            title: hospital.name,
            icon: {
                url: 'img/hospital-location-pin.png',
                scaledSize: new google.maps.Size(25, 25),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 12.5)
            }
        });

        const hospitalInfoWindow = new google.maps.InfoWindow({
            content: `<h3>${hospital.name}</h3>`
        });

        hospitalMarker.addListener("click", () => {
            hospitalInfoWindow.open(map, hospitalMarker);
        });
    });
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna a distância em km
}

function getNearestHospital(userLat, userLng, hospitais) {
    let nearestHospital = null;
    let minDistance = Infinity;

    hospitais.forEach(hospital => {
        const distance = getDistance(userLat, userLng, hospital.latitude, hospital.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            nearestHospital = hospital;
        }
    });

    return nearestHospital;
}

document.addEventListener("DOMContentLoaded", initMap);
