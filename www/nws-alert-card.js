class NWSAlertCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.style.position = 'relative';
            this.content = document.createElement('div');
            this.content.style.padding = '16px';
            this.content.style.backgroundColor = '#E45E65';
            this.style.display = 'block';
            card.appendChild(this.content);
            this.appendChild(card);
        }

        const alerts = hass.states['sensor.nws_weather_alert'];
        const attr = alerts.attributes;
        const event0 = attr.event_0;
	    const event1 = attr.event_1;
	    const event2 = attr.event_2;
        const headline0 = attr.headline_0;
        const headline1 = attr.headline_1;
        const headline2 = attr.headline_2;
        const desc0 = attr.desc_0;
        const desc1 = attr.desc_1;
        const desc2 = attr.desc_2;

        if (event0 == undefined) {
            this.content.innerHTML = ``;
        }
        else if (event1 == undefined) {
            this.content.innerHTML = `
            <div>
            <ha-icon icon='mdi:alert' style='width: 40px; vertical-align: middle'></ha-icon>
            <span style='font-size: 22px; vertical-align: middle'>NWS Weather Alerts</span>
            </div>
            <br>
            <div>
              <div><strong>${event0}</strong></div>
            </div>
            `;
        }
        else if (event2 == undefined) {
            this.content.innerHTML = `
            <div>
            <ha-icon icon='mdi:alert' style='width: 40px; vertical-align: middle'></ha-icon>
            <span style='font-size: 22px; vertical-align: middle'>NWS Weather Alerts</span>
            </div>
            <br>
            <div>
              <div><strong>${event0}</strong></div>
              <div><strong>${event1}</strong></div>
            </div>
            `;
        }
        else {
            this.content.innerHTML = `
            <div>
            <ha-icon icon='mdi:alert' style='width: 40px; vertical-align: middle'></ha-icon>
            <span style='font-size: 22px; vertical-align: middle'>NWS Weather Alerts</span>
            </div>
            <br>
            <div>
              <div><strong>${event0}</strong></div>
              <div><strong>${event1}</strong></div>
              <div><strong>${event2}</strong></div>
            </div>
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

customElements.define('nws-alert-card', NWSAlertCard);
