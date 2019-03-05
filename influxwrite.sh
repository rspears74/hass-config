#!/bin/bash

source /srv/homeassistant/bin/activate
python /home/homeassistant/.homeassistant/influxwrite.py
deactivate
