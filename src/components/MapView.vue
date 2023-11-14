<template>
    <div>
        <div class="search-box">
            <GMapAutocomplete
                ref="autocomplete"
                placeholder="Search for a location"
                style="font-size: medium"
                @place_changed="onPlaceChange"
            >
            </GMapAutocomplete>
            <v-btn
                @click="triggerSearch"
            >
                Search
            </v-btn>
        </div>
    </div>
    <div v-if="timeZone && localTime && name" class="location-info">
        <h3> Last Searched Location: {{ name }} </h3>
        <h3>Time Zone: {{ timeZone }} | Local Time: {{ localTime }}</h3>
    </div>
    <GMapMap
        :center="mapCenter"
        :zoom="15"
        map-type-id="terrain"
        style="width: 80%vw; height: 20rem"
    >
        <GMapMarker
            v-for="location in locations"
            :key="location.id"
            :position="{ lat: location.lat, lng: location.lng }"
        >
        </GMapMarker>
    </GMapMap>
</template>

<script>
    import axios from 'axios'

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    export default {
        props: {
            locations: Array,
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
