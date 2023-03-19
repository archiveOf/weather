import {qs, qsAll, $on,
        hideElement, showElement,
        getUTCDateFromTimestamp,
        textContent} from './helpers.js'

export default class View {

    constructor() {
        this.searchForm = qs('.search-form');
        this.searchInputField = qs('.search-input-field', this.searchForm);

        this.weatherStateContainer = qs('.weather-state__container');
        this.weatherBlocks = qsAll('.weather-state', this.weatherStateContainer)
        this.tabsList = qs('.weather-state__tabs');

        this.activeTab = qs('.weather-state__tab.active');

        this.favBtn = qs('.current-fav-btn');

        this.cityList = qs('.weather-locations__list');

        this._initListeners();
    }

    _initListeners() {
        this.displayTab();
        this.displayWeatherStateByTab();
    }

    get _searchText() {
        return this.searchInputField.value
    }

    _resetSearchText() {
        this.searchInputField.value = ''
    }

    _resetCities() {
        // ПЛОХАЯ ПРАКТИКА ?!
        this.cityList.innerHTML = '';
    }

    bindSearchFetch(handler) {
        $on(this.searchForm, 'submit', event => {
          event.preventDefault()
      
          if (this._searchText) {
            handler(this._searchText)
            this._resetSearchText()
          }
        })
    }

    bindDeleteCity(handler) {
        $on(this.cityList, 'click', event => {
            if ( !event.target.classList.contains('weather-locations__item-remove-btn') ) return;
            let item = event.target.closest('li');

            let currentCity = item.querySelector('.weather-locations__item-text').textContent;
            handler(currentCity)
        })
    }

    bindToggleCity(handler) {
        $on(this.cityList, 'click', event => {
            if ( !event.target.closest('li') ) return;
            let item = event.target.closest('li');

            let currentCity = item.querySelector('.weather-locations__item-text').textContent;
            handler(currentCity);
        })
    }

    bindAddCity(handler) {
        $on(this.favBtn, 'click', event => {
            let icon = this.favBtn.querySelector('i');
         if ( icon.classList.contains('fa-heart-o') ) {
            icon.className = 'fa fa-heart fa-2x'
         } else {
            icon.className = 'fa fa-heart-o fa-2x'
         }
          handler()
        })
    }

    displayCities(cities) {
        this._resetCities();

        cities.map( city => {
            let item = document.createElement('li');
            item.classList.add('weather-locations__item');

            let spanText = document.createElement('span');
            spanText.classList.add('weather-locations__item-text')
            spanText.textContent = city.name

            let iconDelete = document.createElement('i');
            iconDelete.className = 'weather-locations__item-remove-btn fa fa-remove';
            
            item.append(spanText, iconDelete)
            this.cityList.append(item)
        })
    }

    displayTab() {
        $on(this.tabsList, 'click', event => {
            if (event.target.tagName !== 'LI') return;

            if (this.activeTab) {
                this.activeTab.classList.remove('active');
            }
        
            this.activeTab = event.target;
            this.activeTab.classList.add('active');

            this.displayWeatherStateByTab()
        })

    }
    

    updateWeatherState(data) {
        let weatherStateContainer = this.weatherStateContainer;

        // Weather state title
        this.weatherStateContainer.querySelectorAll('.city-title')
                             .forEach( cityTitle => cityTitle.textContent = data.name);


        // Weather current state
        textContent(weatherStateContainer, '.current-temp', `${Math.round(data.main.temp)}°`)

        // Weather details state
        textContent(weatherStateContainer, '.details-temp', `Temperature: ${Math.round(data.main.temp)}°`)
        textContent(weatherStateContainer, '.details .temp-feels-like', `Feels like: ${Math.round(data.main.feels_like)}°`)
        textContent(weatherStateContainer, '.weather-desc', `Weather: ${data.weather[0].main}`)

        const sunrise = getUTCDateFromTimestamp(data.sys.sunrise);
        textContent(weatherStateContainer, '.temp-sunrise', `Sunrise: ${sunrise}`)

        const sunset = getUTCDateFromTimestamp(data.sys.sunset);
        textContent(weatherStateContainer, '.temp-sunset', `Sunset: ${sunset}`)


        // Weather forecast state
        textContent(weatherStateContainer, '.forecast .temp-feels-like', `Feels like: ${Math.round(data.main.feels_like)}`)
        textContent(weatherStateContainer, '.forecast-temp', `Temperature: ${Math.round(data.main.temp)}`)

    }

    displayWeatherStateByTab() {
        let filterName = this.activeTab.textContent.toLowerCase();
        for(const weatherBlock of this.weatherBlocks) {
            weatherBlock.dataset.state !== filterName ? hideElement(weatherBlock) : showElement(weatherBlock);
        }
}
}