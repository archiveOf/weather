export default class Model {
    constructor() {
        this.cities = JSON.parse(localStorage.getItem('cities')) || [
            // some default cities
        ];
        this.currentCity = JSON.parse(localStorage.getItem('currentCity')) || null;
    }

    bindCityListChanged(callback) {
        this.onCityListChanged = callback;
    }

    _commit(cities) {
        this.onCityListChanged(cities);
        localStorage.setItem('cities', JSON.stringify(cities))
    }

    addCurrentCity(cityName) {
        localStorage.setItem('currentCity', JSON.stringify(cityName))
    }

    addItem(cityName) {
        const city = {
            name: cityName,
        }

        this.cities.push(city)
        this._commit(this.cities)
    }

    deleteItem(cityName) {
        this.cities = this.cities.filter( item => item.name !== cityName)

        this._commit(this.cities)
    }

    hasItem(cityName) {
        return this.cities.filter( item => item.name === cityName).length > 0 ? true : false
    }

}