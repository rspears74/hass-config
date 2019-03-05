import homeassistant.remote as ha
import datetime, re, math
from influxdb import InfluxDBClient, exceptions
from homeassistant.helpers import state as state_helper

PASSWORD = 'Leader11'
STATES = ['sensor.hallway_thermostat_temperature','sensor.dark_sky_temperature','climate.hallway','device_tracker.randall_pixel','sensor.hallway_thermostat_hvac_state']
TIME = datetime.datetime.utcnow()
RE_DIGIT_TAIL = re.compile(r'^[^\.]*\d+\.?\d+[^\.]*$')
RE_DECIMAL = re.compile(r'[^\d.]+')

api = ha.API('127.0.0.1', PASSWORD)

entities = ha.get_states(api)

entities_to_push = [ent for ent in entities if ent.entity_id in STATES]

def event_to_json(state):
    try:
        include_state = include_value = False
        state_as_value = float(state.state)
        include_value = True
    except ValueError:
        try:
            state_as_value = float(state_helper.state_as_number(state))
            include_state = include_value = True
        except ValueError:
            include_state = True

    include_uom = True
    measurement = state.attributes.get('unit_of_measurement')
    if measurement in (None, ''):
        measurement = state.entity_id
    else:
        include_uom = False

    json = {
            'measurement': measurement,
            'tags': {
                'domain': state.domain,
                'entity_id': state.object_id,
                },
            'time': TIME,
            'fields': {}
            }
    if include_state:
        json['fields']['state'] = state.state
    if include_value:
        json['fields']['value'] = state_as_value

    for key, value in state.attributes.items():
        if key != 'unit_of_measurement' or include_uom:
            if key in json['fields']:
                key = key + "_"
            try:
                json['fields'][key] = float(value)
            except (ValueError, TypeError):
                new_key = "{}_str".format(key)
                new_value = str(value)
                json['fields'][new_key] = new_value
                
                if RE_DIGIT_TAIL.match(new_value):
                    json['fields'][key] = float(RE_DECIMAL.sub('', new_value))

            try:
                if not math.isfinite(json['fields'][key]):
                    del json['fields'][key]
            except (KeyError, TypeError):
                pass
    return json

ifdb = InfluxDBClient('127.0.0.1',8086,'root','root','home_assistant')
ifdb.write_points([event_to_json(e) for e in entities_to_push])
