import { create } from "zustand";
import store from "../data/store.json"

// export const useMapStore = create((set, get) => ({
//     map: null,

//     //지도 생성 매서드
//     initMap: ({ lat, lang }) => {
//         const mapContainer = document.getElementById("map")
//         window.kakao.maps.load(() => {
//             const options = {
//                 center: new window.kakao.maps.LatLng(lat, lang),
//                 level: 4,
//             };

//             const map = new window.kakao.maps.Map(mapContainer, options);

//             set({ map });
//         });
//     },
//     //마커 생성 매서드


// }));

export const useMapStore = create((set, get) => ({
    map: null,
    markers: [],

    initMap: (lat, lng) => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) return;

        const { kakao } = window;

        kakao.maps.load(() => {
            const options = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 4,
            };

            if (!get().map) {
                const map = new kakao.maps.Map(mapContainer, options);
                set({ map });
            } else {
                const moveLatLon = new kakao.maps.LatLng(lat, lng);
                get().map.setCenter(moveLatLon);
            }
        });
    },

    setMarkers: (lat, lng) => {
        const { map, markers } = get();
        if (!map) return;


        markers.forEach(m => m.setMap(null));

        const { kakao } = window;
        const imgsrc = "/images/sub-about/maker.svg";
        const imgsize = new kakao.maps.Size(64, 69);
        const imgoption = { offset: new kakao.maps.Point(27, 69) };
        const markerImg = new kakao.maps.MarkerImage(imgsrc, imgsize, imgoption);
        const markerPosition = new kakao.maps.LatLng(lat, lng);

        const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImg
        });

        marker.setMap(map);

        map.setCenter(markerPosition);

        set({ markers: [marker] }); // ✅ 배열로 저장
    },
    stores: [],
    country: [],

    ///셀렉트박스에 넣을 나라 찾기
    onFetchStore: () => {
        const existing = get().stores;
        if (existing.length > 0) return;


        const firstShow = store["offline_store"]
        const selectCountry = ["ALL", ...store["offline_store"].map((item) => item.country)];
        const upperCountry = selectCountry.map((m) => m.toUpperCase())

        console.log(selectCountry);

        set({
            stores: firstShow,
            country: upperCountry
        })
    },


    //처음에는 오프라인 스토어들 보여주고 선택하면 셀렉트샵
    onShows: (m) => {
        console.log(m)
    },
    onMenus: (menu) => {
        if (menu === "select_shop") {
            const select_shop = store[menu];
            const select_shop_country = store[menu].map((item) => item.country);
            const upperCountry = select_shop_country.map((m) => m.toUpperCase())
            return set({
                stores: select_shop,
                country: upperCountry
            })
        }
        if (menu === "offline_store") {
            const select_shop = store[menu]

            const selectCountry = ["ALL", ...store["offline_store"].map((item) => item.country)];
            const upperCountry = selectCountry.map((m) => m.toUpperCase())
            return set({
                stores: select_shop,
                country: upperCountry
            })
        }




    }
}));