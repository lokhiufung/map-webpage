<template>
  <v-app>
    <v-toolbar class="text-center" color="light-blue" dark>
      <v-toolbar-title>Demo - Web page for searching and marking locations</v-toolbar-title>
    </v-toolbar>
    <v-main>
      <v-container>
        <!-- Use Vuetify's classes for spacing and alignment -->
        <v-row class="text-center mb-4">
          <v-col>
            <LocationButton
              @update-current-location="updateCurrentLocation"
              @update-map-center="updateMapCenter"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <MapView
              :locations="locations"
              :currentLocation="currentLocation"
              :mapCenter="mapCenter"
              @add-location="addLocation"
              @update-map-center="updateMapCenter"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <LocationsTable 
              :locations="locations"
              @delete-locations="deleteLocations"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import LocationButton from './components/LocationButton.vue';
  import LocationsTable from '@/components/LocationsTable.vue'
  import MapView from '@/components/MapView.vue'

  const locations = ref(JSON.parse(localStorage.getItem('locations')) || []);

  // listen to changes in locations and write it to localstorage
  watch(locations, (newLocations) => {
    localStorage.setItem('locations', JSON.stringify(newLocations));
  }, { deep: true });

  const mapCenter = ref({ lat: 43.6425662	, lng: -79.3870568});

  // use seperate variable for displaying current location
  const currentLocation = ref(null);

  function deleteLocations(selectedLocationIds) {
    locations.value = locations.value.filter(
      location => !selectedLocationIds.some(
        selectedLocationId => selectedLocationId === location.id
      )
    );
  }

  function addLocation(newLocation) {
    const locationExists = locations.value.some(
      location => location.name === newLocation.name
    )
    if (!locationExists) {
      locations.value.push(newLocation)
    }
  }

  function updateMapCenter(newMapCenter) {
    mapCenter.value = newMapCenter
  }

  function updateCurrentLocation(newCurrentLocation) {
    currentLocation.value = newCurrentLocation
  }

</script>

