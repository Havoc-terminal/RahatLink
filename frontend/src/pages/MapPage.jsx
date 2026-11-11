import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';

// Custom Map Icons
const whIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const campIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapPage = () => {
    const { t, theme } = useAppContext();
    const [entities, setEntities] = useState({ warehouses: [], camps: [] });
    const [center, setCenter] = useState([19.0760, 72.8777]);

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const { data } = await api.get('/map');
            setEntities(data);
            if (data.warehouses.length > 0) {
                setCenter([data.warehouses[0].lat, data.warehouses[0].lng]);
            } else if (data.camps.length > 0) {
                setCenter([data.camps[0].lat, data.camps[0].lng]);
            }
        } catch (e) {
            console.error("Map Data Error:", e);
        }
    };

    const isDark = theme === 'dark';
    const tileUrl = isDark 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Live Operations Map</h1>
                <p className="text-text-secondary mt-1">Real-time view of verified disaster zones and resource locations</p>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-border shadow-xl relative z-0">
                <MapContainer center={center} zoom={11} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                        url={tileUrl}
                    />

                    {entities.warehouses.map(wh => (
                        <Marker key={`wh-${wh.id}`} position={[wh.lat, wh.lng]} icon={whIcon}>
                            <Popup className="font-sans">
                                <div className="p-1">
                                    <strong className="text-primary block mb-1">Warehouse: {wh.name}</strong>
                                    <span className="text-sm opacity-80">Stock Available</span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {entities.camps.map(camp => (
                        <React.Fragment key={`camp-${camp.id}`}>
                            <Marker position={[camp.lat, camp.lng]} icon={campIcon}>
                                <Popup className="font-sans">
                                    <div className="p-1">
                                        <strong className="text-critical block mb-1">Camp: {camp.name}</strong>
                                        <div className="text-xs space-y-1">
                                            <p><span className="font-semibold">Urgency:</span> {camp.urgency}</p>
                                            <p><span className="font-semibold">Disaster Zone:</span> {camp.is_disaster_zone ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                            {camp.is_disaster_zone && (
                                <Circle
                                    center={[camp.lat, camp.lng]}
                                    radius={3000}
                                    pathOptions={{ 
                                        color: 'rgb(var(--critical))', 
                                        fillColor: 'rgb(var(--critical))', 
                                        fillOpacity: 0.2 
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPage;
