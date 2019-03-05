from homeassistant.const import CONF_NAME, CONF_HOST
from homeassistant.helpers.entity import Entity
import requests, json

def setup_platform(hass, config, add_devices, discovery_info=None):
    add_devices([SunSensor()])

class SunSensor(Entity):
    def __init__(self):
        self._state = None

    @property
    def name(self):
        _name = 'Sun Sensor'
        return _name

    @property
    def state(self):
        return self._state
    
    @property
    def device_state_attributes(self):
        """Return the state attributes."""
        if self._state is not None:
            return {
                'event': self.out['event'],
                'time_until': self.out['time_until']
            }


    def update(self):
        self.out = json.loads(requests.get('http://127.0.0.1:1880/sun').text)
        self._state = self.out['state']
