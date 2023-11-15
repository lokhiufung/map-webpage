<template>
  <div>
    <v-btn
      color="error"
      @click="deleteSelectedLocations"
      :disabled="selected.length === 0"
    >
      Delete
    </v-btn>
    <v-data-table
      v-model="selected"
      :items="searchedOnlyLocations"
      :items-per-page="itemsPerPage"
      item-key="id"
      show-select
    ></v-data-table>
  </div>
</template>

<script>
  export default {
    props: {
      locations: Array
    },
    data () {
      return {
        selected: [],
        itemsPerPage: 10,
      }
    },
    methods: {
      deleteSelectedLocations() {
        this.$emit('delete-locations', this.selected);
        this.selected = []; // clear the selection after emitting the event
      }
    },
    computed: {
      searchedOnlyLocations() {
        return this.locations.filter(location => location.name !== 'Current Location')
      }
    }
  }
</script>