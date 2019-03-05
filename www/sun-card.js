class SunCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            this.content = document.createElement('div');
            this.content.style.padding = '0 16px 16px';
            card.appendChild(this.content);
            this.appendChild(card);
        }

        const state = hass.states['sun.sun'];
        const attr = state.attributes;
        const nextSunsetTimeUTC = attr.next_setting;
        const nextSunriseTimeUTC = attr.next_rising;
        const now = Date.now();
        const nextSunsetTime = new Date(nextSunsetTimeUTC);
        const nextSunriseTime = new Date(nextSunriseTimeUTC);
        const totMinUntilSunrise = (nextSunriseTime.getTime() - now) / 60000;
        const totMinUntilSunset = (nextSunsetTime.getTime() - now) / 60000;
        const hrsUntilSunrise = Math.floor(totMinUntilSunrise / 60);
        const minUntilSunrise = Math.floor(totMinUntilSunrise % 60);
        const hrsUntilSunset = Math.floor(totMinUntilSunset / 60);
        const minUntilSunset = Math.floor(totMinUntilSunset % 60);
        const sunriseTimeStr = nextSunriseTime.toLocaleTimeString();
        const sunsetTimeStr = nextSunsetTime.toLocaleTimeString();
        const sunsetTimeStrTime = sunsetTimeStr.split(" ")[0];
        const sunsetTimeStrAmPm = sunsetTimeStr.split(" ")[1];
        const sunsetTime = sunsetTimeStrTime.substring(0, sunsetTimeStrTime.length - 3) + " " + sunsetTimeStrAmPm;
        const sunriseTimeStrTime = sunriseTimeStr.split(" ")[0];
        const sunriseTimeStrAmPm = sunriseTimeStr.split(" ")[1];
        const sunriseTime = sunriseTimeStrTime.substring(0, sunriseTimeStrTime.length - 3) + " " + sunriseTimeStrAmPm;

        if (nextSunriseTime > nextSunsetTime) {
            this.content.innerHTML = `
              <br>
              <ha-icon icon=hass:weather-night style='color: var(--paper-item-icon-color)'></ha-icon>
              Next sunset at <strong>${sunsetTime}</strong> (${hrsUntilSunset} hrs ${minUntilSunset} min)
              <br><br>
              <ha-icon icon=hass:weather-sunny style='color: var(--paper-item-icon-color)'></ha-icon>
              Next sunrise at <strong>${sunriseTime}</strong> (${hrsUntilSunrise} hrs ${minUntilSunrise} min)
            `;
        }
        else {
            this.content.innerHTML = `
              <br>
              <ha-icon icon=hass:weather-sunny style='color: var(--paper-item-icon-color)'></ha-icon>
              Next sunrise at <strong>${sunriseTime} (${hrsUntilSunrise} hrs ${minUntilSunrise} min)</strong>
              <br><br>
              <ha-icon icon=hass:weather-night style='color: var(--paper-item-icon-color)'></ha-icon>
              Next sunset at <strong>${sunsetTime} (${hrsUntilSunset} hrs ${minUntilSunset} min)</strong>
            `;
        }
    }

    setConfig(config) {
	//if (!config.entity) {
	//    throw new Error('You need to define an entity');
	//}
	this.config = config;
    }

    getCardSize() {
	return 3;
    }
}

customElements.define('sun-card', SunCard);
