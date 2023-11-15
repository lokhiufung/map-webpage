<template>
    <v-btn
        color="primary"
        @click="getCurrentLocation"
    >
        Get Current Location
    </v-btn>
</template>

<script>
    export default {
        methods: {
            getCurrentLocation() {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const location = {
                            id: Date.now(),
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            name: 'Current Location',
                        }
                        this.$emit('update-map-center', { lat: location.lat, lng: location.lng });
                        this.$emit('update-current-location', location);
                    }, (error) => {
                        // error handling
                        console.error(error);
                    })
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            }
        }
    }
</script>