"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Travel } from "@/types/travel";

// Leaflet 기본 마커 아이콘 CDN으로 교체 (Next.js 번들 경로 문제 해결)
function FixLeafletIcons() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
  return null;
}

interface TravelMapProps {
  travels: Travel[];
}

export default function TravelMap({ travels }: TravelMapProps) {
  // 좌표가 있는 목적지만 추출
  const destinations = travels.flatMap((travel) =>
    (travel.destinations || [])
      .filter((d) => d.lat != null && d.lng != null)
      .map((d) => ({ ...d, travelTitle: travel.title }))
  );

  if (destinations.length === 0) return null;

  const center: [number, number] = [
    destinations.reduce((s, d) => s + d.lat!, 0) / destinations.length,
    destinations.reduce((s, d) => s + d.lng!, 0) / destinations.length,
  ];

  // 여행별 폴리라인 (같은 여행 내 목적지를 선으로 연결)
  const polylines = travels
    .map((travel) => {
      const coords = (travel.destinations || [])
        .filter((d) => d.lat != null && d.lng != null)
        .map((d) => [d.lat!, d.lng!] as [number, number]);
      return { id: travel.id, title: travel.title, coords };
    })
    .filter((p) => p.coords.length >= 2);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">여행지 지도</h2>
      <div className="rounded-xl overflow-hidden border shadow-sm" style={{ height: 400 }}>
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <FixLeafletIcons />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {destinations.map((dest, i) => (
            <Marker key={i} position={[dest.lat!, dest.lng!]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{dest.name}</p>
                  <p className="text-gray-500 text-xs">{dest.travelTitle}</p>
                  {dest.category && (
                    <p className="text-purple-600 text-xs">{dest.category}</p>
                  )}
                  {dest.cost != null && dest.cost > 0 && (
                    <p className="text-gray-600 text-xs">
                      {dest.cost.toLocaleString("ko-KR")}원
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {polylines.map((line) => (
            <Polyline
              key={line.id}
              positions={line.coords}
              color="#8b5cf6"
              weight={2}
              dashArray="6"
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
