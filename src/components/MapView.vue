<template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="search-box d-flex align-center">
              <GMapAutocomplete
                  ref="autocomplete"
                  placeholder="Search for a location"
                  class="flex-grow-1 mr-2"
                  @place_changed="onPlaceChange"
              />
              <v-btn color="light-blue" @click="triggerSearch">
                  Search
              </v-btn>
            </div>
          </v-col>
        </v-row>
  
        <v-row v-if="timeZone && localTime && name" class="my-4">
          <v-col>
            <div class="location-info">
              <h3 class="headline mb-2"> Last Searched Location: {{ name }} </h3>
              <h3>Time Zone: {{ timeZone }} | Local Time: {{ localTime }}</h3>
            </div>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="12">
            <GMapMap
                :center="mapCenter"
                :zoom="15"
                map-type-id="terrain"
                class="map-container"
            >
              <GMapMarker
                  v-for="location in locations"
                  :key="location.id"
                  :position="{ lat: location.lat, lng: location.lng }"
              />
              <GMapMarker
                  v-if="currentLocation"
                  :key="currentLocation.id"
                  :icon="'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'"
                  :position="{ lat: currentLocation.lat, lng: currentLocation.lng }"
              />
            </GMapMap>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script>
    import axios from 'axios'

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    export default {
        props: {
            locations: Array,
            currentLocation: Object,
            mapCenter: Object,
        },
        data() {
            return {
                name: '',
                timeZone: '',
                localTime: '',
            }
        },
        methods: {
            async fetchTimeZone(location) {
                try {
                    const res = await axios.get('https://maps.googleapis.com/maps/api/timezone/json', {
                        params: {
                            location: `${location.lat},${location.lng}`,
                            timestamp: Math.floor(Date.now() / 1000), // Current timestamp
                            key: googleMapsApiKey,
                        }
                    })

                    if (res.data && res.data.timeZoneId) {
                        const timeZone = res.data.timeZoneId;
                        const offsets = res.data.dstOffset * 1000 + res.data.rawOffset * 1000;
                        const localTime = new Date(Date.now() + offsets).toISOString();
                        
                        location.timeZone = timeZone;
                        location.localTime = localTime;

                        return location
                    }
                } catch (error) {
                    console.error('Error fetching time zone')
                }
            },
            async onPlaceChange(place) {
                if (!place.geometry) {
                    console.error('The selected place has no geometry.');
                    return;
                }

                const location = {
                    id: Date.now(),
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name || place.formatted_address || 'UNNAMED',
                }
                
                const locationWithTimeZone = await this.fetchTimeZone(location);

                // update the current time zone and the local time of the latest search result
                this.name = location.name;
                this.timeZone = location.timeZone;
                this.localTime = location.localTime;

                // update the map center
                this.$emit('update-map-center', { lat: location.lat, lng: location.lng });
                this.$emit('add-location', locationWithTimeZone);
            },
            triggerSearch() {
                const autocomplete = this.$refs.autocomplete;
                if (autocomplete) {
                    autocomplete.place_changed();
                }
            }       
        }
    }
</script>


<style scoped>
.search-box {
  margin-top: 20px;
}

.location-info {
  padding: 15px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-container {
  height: 400px;
  border-radius: 4px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .search-box {
    flex-direction: column;
  }
  
  .search-box .v-btn {
    margin-top: 10px;
  }
}
</style>