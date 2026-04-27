"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface KakaoPlace {
  place_name: string;
  address_name: string;
  x: string; // lng
  y: string; // lat
}

interface KakaoMapPickerProps {
  onSelect: (lat: number, lng: number, placeName: string) => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function KakaoMapPicker({
  onSelect,
  initialLat,
  initialLng,
}: KakaoMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placeMarker = useCallback((latlng: any, name: string) => {
    if (!mapInstanceRef.current) return;
    if (markerRef.current) markerRef.current.setMap(null);

    markerRef.current = new window.kakao.maps.Marker({
      position: latlng,
      map: mapInstanceRef.current,
    });
    mapInstanceRef.current.setCenter(latlng);
    setSelectedPlace(name);
    onSelectRef.current(latlng.getLat(), latlng.getLng(), name);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      if (cancelled || !mapRef.current) return;

      const center = new window.kakao.maps.LatLng(
        initialLat ?? 36.5,
        initialLng ?? 127.5
      );
      const newMap = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: initialLat ? 4 : 8,
      });
      mapInstanceRef.current = newMap;

      if (initialLat && initialLng) {
        markerRef.current = new window.kakao.maps.Marker({
          position: center,
          map: newMap,
        });
      }

      window.kakao.maps.event.addListener(
        newMap,
        "click",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          const lng = latlng.getLng();
          const lat = latlng.getLat();
          const geocoder = new window.kakao.maps.services.Geocoder();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          geocoder.coord2Address(lng, lat, (result: any, status: any) => {
            const addr =
              status === window.kakao.maps.services.Status.OK && result[0]
                ? (result[0].road_address?.address_name ?? result[0].address.address_name)
                : "";

            const ps = new window.kakao.maps.services.Places();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ps.keywordSearch(addr || "장소", (places: any[], placeStatus: any) => {
              if (placeStatus === window.kakao.maps.services.Status.OK && places.length > 0) {
                placeMarker(latlng, places[0].place_name);
              } else {
                placeMarker(latlng, addr);
              }
            }, { x: lng, y: lat, radius: 30, size: 1, sort: window.kakao.maps.services.SortBy.DISTANCE });
          });
        }
      );

      setIsLoaded(true);
    };

    // kakao.maps가 이미 있으면 load() 콜백으로 초기화
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        if (!cancelled) initMap();
      });
      return () => { cancelled = true; };
    }

    // 스크립트가 없으면 autoload=false로 추가 후 load() 콜백 사용
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.onload = () => {
      if (!cancelled) {
        window.kakao.maps.load(() => {
          if (!cancelled) initMap();
        });
      }
    };
    script.onerror = () => {
      if (!cancelled) setLoadError(true);
    };
    document.head.appendChild(script);

    return () => { cancelled = true; };
  }, [initialLat, initialLng, placeMarker]);

  const handleSearch = () => {
    if (!searchQuery.trim() || !window.kakao?.maps?.services) return;
    setSearchResults([]);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchQuery, (data: KakaoPlace[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data.slice(0, 6));
      }
    });
  };

  const handleSelectResult = (place: KakaoPlace) => {
    const latlng = new window.kakao.maps.LatLng(
      Number(place.y),
      Number(place.x)
    );
    mapInstanceRef.current?.setLevel(4);
    placeMarker(latlng, place.place_name);
    setSearchResults([]);
    setSearchQuery(place.place_name);
  };

  if (loadError) {
    return (
      <div className="border rounded-lg mt-2 p-4 bg-red-50 text-center">
        <p className="text-xs text-red-500 mb-1">지도를 불러오지 못했습니다.</p>
        <p className="text-xs text-gray-400">
          API 키 또는 네트워크 연결을 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden mt-2 bg-white">
      {/* 검색창 */}
      <div className="p-2 bg-gray-50 border-b space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="장소 검색 (예: 남산타워, 해운대 맛집)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="flex-1 border p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-3 py-1.5 bg-yellow-400 rounded text-xs font-semibold hover:bg-yellow-500 shrink-0"
          >
            검색
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className="bg-white border rounded shadow-sm max-h-36 overflow-y-auto">
            {searchResults.map((place, i) => (
              <li
                key={i}
                onClick={() => handleSelectResult(place)}
                className="px-3 py-2 text-xs hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
              >
                <p className="font-medium text-gray-800">{place.place_name}</p>
                <p className="text-gray-400 truncate">{place.address_name}</p>
              </li>
            ))}
          </ul>
        )}

        {selectedPlace && (
          <p className="text-xs text-green-600 font-medium">📍 {selectedPlace}</p>
        )}
      </div>

      {/* 지도 — div는 항상 렌더링, 로딩 중엔 오버레이로 가림 */}
      <div className="relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400 z-10">
            지도 로딩 중...
          </div>
        )}
        <div ref={mapRef} style={{ height: 240 }} />
      </div>

      <p className="text-xs text-gray-400 text-center py-1.5 bg-gray-50 border-t">
        검색하거나 지도를 클릭해 위치를 선택하세요
      </p>
    </div>
  );
}
