import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const warehouseIcon = new L.Icon({
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

const mockWarehouses = [
  { id: 1, name: "Central Hub A", lat: 28.6139, lng: 77.2090, stock: "Food, Water" },
  { id: 2, name: "North Wing B", lat: 28.7041, lng: 77.1025, stock: "Medical, Essentials" }
];

const mockCamps = [
  { id: 1, name: "Relief Camp Alpha", lat: 28.5355, lng: 77.3910, need: "High Priority Medical" },
  { id: 2, name: "Shelter Beta", lat: 28.4595, lng: 77.0266, need: "Food & Water" }
];

const MapPage = () => {
  return (
    <div className="p-8 h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Interactive Map View</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search location..." className="pl-8 bg-card" />
        </div>
      </div>

      <Card className="flex-1 bg-card border-border overflow-hidden p-0 relative min-h-[500px]">
        <MapContainer center={[28.6139, 77.2090]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {mockWarehouses.map(w => (
            <Marker key={`w-${w.id}`} position={[w.lat, w.lng]} icon={warehouseIcon}>
              <Popup>
                <div className="text-foreground">
                  <strong>{w.name}</strong><br/>
                  Stock: <span className="text-blue-500">{w.stock}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {mockCamps.map(c => (
            <Marker key={`c-${c.id}`} position={[c.lat, c.lng]} icon={campIcon}>
              <Popup>
                <div className="text-foreground">
                  <strong>{c.name}</strong><br/>
                  Needs: <span className="text-red-500 font-semibold">{c.need}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </div>
  );
};

export default MapPage;
