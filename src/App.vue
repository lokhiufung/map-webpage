<template>
  <v-app>
    <v-main>
      <LocationButton
        @add-location="addLocation"
        @update-map-center="updateMapCenter"
      />
      <MapView
        :locations="locations"
        :mapCenter="mapCenter"
        @add-location="addLocation"
        @update-map-center="updateMapCenter"
      />
      <LocationsTable 
        :locations="locations"
        @delete-locations="deleteLocations"
      />
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue';
  import LocationButton from './components/LocationButton.vue';
  import LocationsTable from '@/components/LocationsTable.vue'
  import MapView from '@/components/MapView.vue'

  const locations = ref([
  ]);

  const mapCenter = ref({ lat: 0.0, lng: 0.0});

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
    console.log({locationExists: locationExists})
    if (!locationExists) {
      locations.value.push(newLocation)
    }
  }

  function updateMapCenter(newMapCenter) {
    mapCenter.value = newMapCenter
  }

</script>
