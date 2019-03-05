from homeassistant.const import TEMP_FAHRENHEIT, CONF_NAME, CONF_HOST
from homeassistant.helpers.entity import Entity
import requests

def setup_platform(hass, config, add_devices, discovery_info=None):
    add_devices([TempSensor()])

class TempSensor(Entity):
    def __init__(self):
        self._state = None

    @property
    def name(self):
        _name = 'Grow Room Temperature'
        return _name

    @property
    def state(self):
        return self._state

    @property
    def unit_of_measurement(self):
        return TEMP_FAHRENHEIT

    def update(self):
        ip = '192.168.0.116'
        self._state = round(float(requests.get('http://'+ip+':8080/temp').text), 1)
