import {API} from './constants.js'

export default class Controller {
    constructor(store, view) {
        this.store = store;
        this.view = view;
        this.defaultCity = 'London';

        this.store.bindCityListChanged(this.onCityListChanged.bind(this))
        this.view.bindSearchFetch(this.handleSearchFetch.bind(this))
        this.view.bindAddCity(this.handleAddCIty.bind(this))
        this.view.bindDeleteCity(this.handleDeleteCity.bind(this))
        this.view.bindToggleCity(this.handleToggleCity.bind(this))

        this.currentCity = this.store.currentCity || this.defaultCity;

        // First render
        this.onCityListChanged(this.store.cities);
        this.handleSearchFetch(this.currentCity);
    }

    onCityListChanged(cities) {
        this.view.displayCities(cities)
    }

    handleDeleteCity(currentCity) {
        this.store.deleteItem(currentCity);
    }

    handleToggleCity(currentCity) {
        if ( !this.store.hasItem(currentCity) ) return;
        this.handleSearchFetch(currentCity);
    }

    handleAddCIty() {
        let currentCity = this.currentCity;
        if( !currentCity ) return;
        this.store.hasItem(currentCity) ? this.store.deleteItem(currentCity) : this.store.addItem(currentCity)
    }

    async handleSearchFetch(searchText) {
        let city = searchText;
        let data = await this.getData(city);

        if (!data) return;

        this.store.addCurrentCity(data.name);
        this.currentCity = data.name;

        // ПЛОХАЯ ПРАКТИКА !?
        let icon = this.view.favBtn.querySelector('i');
        icon.className = this.store.hasItem(this.currentCity) ? 'fa fa-heart fa-2x' : 'fa fa-heart-o fa-2x';

        this.view.updateWeatherState(data);
    }

    async getData(city) {
        let cityName = city;
        const url = `${API.serverUrl}?q=${cityName}&appid=${API.apiKey}&units=metric`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.cod !== 200 ) throw new Error(`City named "${city}" not found`)

            return data;

        } catch (err) { 
            alert(err.message);
            return null
        }
    }

}