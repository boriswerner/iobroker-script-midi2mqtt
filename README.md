# iobroker-script-midi2mqtt
midi2mqtt adaptation for iobroker Script Engine

based on https://github.com/TheOriginalAndrobot/midi2mqtt

#Installation

- In the iobroker script engine instance add the NPM modules "mqtt" and "easymidi"
- Create a new JavaScript script in iobroker Script Engine and paste the content of iobroker-script-midi2mqtt.js
    - if the "require" section is marked red with an error "Cannot find name 'require'." just try, this is at the time of writing a bug in the code editor.

#Setup

Adjust the following two lines with your information:
var MQTT_BROKER = 'mqtt://192.168.0.10';
var MIDI_DEVICE = 'Numark ORBIT:Numark ORBIT MIDI 1 20:0'