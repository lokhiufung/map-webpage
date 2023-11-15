# Demo - A Simple Google Map page

This project is a simple demo of the use of Google Map API, Place API and the Time Zone API in Vue.js 3. Please visit the demo site [here](https://map-webpage.vercel.app/)


## Features

1. Can get your current location and show it on the map with a marker
2. Can search location on the search bar with auto-complete and can trigger a search through `enter` or clicking the search button
3. Can see your search history from a table with Id, Lat, Lng, Name, Time Zone
4. Can delete your selected search records from the table and the markers on the map by clicking the `DELETE` button
5. Can show the Name, Time Zone and Local Time of the last searched location
6. Can persist the search history after refresh


## TODO

1. Update current location in `locations` instead of appending a new one


## Project setup

```
# npm
npm install
```

### Compiles and hot-reloads for development

```
# npm
npm run dev
```

### Compiles and minifies for production

```
# npm
npm run build
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).


## Notes

Remember to create the project using the following command. I tried to install vuetify after I have created a vue project, but I failed to load the components from vuetify properly (i.e the checkbox of the table will be missing)
```bash
npm create vuetify
```

