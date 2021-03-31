module.exports = {
  maps: {
    LatLng: (lat, lng) => ({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      lat: () => this.latitude,
      lng: () => this.longitude,
    }),
    LatLngBounds: (ne, sw) => ({
      getSouthWest: () => sw,
      getNorthEast: () => ne,
      extend: () => {},
    }),
    OverlayView: () => ({}),
    InfoWindow: () => ({}),
    Marker: () => ({}),
    MarkerImage: () => ({}),
    Map: () => ({
      addListener: () => {},
      fitBounds: () => {},
      setCenter: () => {},
      panTo: () => {},
    }),
    Point: () => ({}),
    Size: () => ({}),
    event: {
      addListener: () => {},
      trigger: () => {},
    },
    Geocoder: () => {
      return {
        geocode: (address, cb) => {
          cb(
            [
              {
                geometry: {
                  location: {
                    lat: () => '1.11111',
                    lng: () => '2.22222',
                  },
                },
              },
            ],
            'OK'
          )
        },
      }
    },
    GeocoderStatus: {
      OK: 'OK',
    },
    places: {
      AutocompleteService: () => {
        return {
          getPlacePredictions: (obj, func) => {
            func(
              [
                {
                  description: '',
                  storeId: '',
                },
              ],
              200
            )
          },
        }
      },
      AutocompleteSessionToken: () => {},
      PlacesServiceStatus: {
        OK: 200,
      },
    },
  },
}
