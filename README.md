# iobroker-script-midi2mqtt
midi2mqtt adaptation for iobroker Script Engine

based on https://github.com/TheOriginalAndrobot/midi2mqtt

## Installation

- In the iobroker script engine instance add the NPM modules "mqtt" and "easymidi"
- Create a new JavaScript script in iobroker Script Engine and paste the content of iobroker-script-midi2mqtt.js
    - if the "require" section is marked red with an error "Cannot find name 'require'." just try, this is at the time of writing a bug in the code editor.

## Setup

Adjust the following two lines with your information:

```javascript
var MQTT_BROKER = 'mqtt://192.168.0.10';
var MIDI_DEVICE = 'Numark ORBIT:Numark ORBIT MIDI 1 20:0'
```
The MIDI device information can be retrieved by starting the script and looking at the log, e.g.:

`info	javascript.0 (1381) script.js.media.MIDI2MQTT_Test: Available MIDI inputs: Midi Through:Midi Through Port-0 14:0,Samson Graphite M25:Samson Graphite M25 MIDI 1 20:0,Numark ORBIT:Numark ORBIT MIDI 1 24:0,RtMidi Output Client:RtMidi Output 131:0`

`info	javascript.0 (1381) script.js.media.MIDI2MQTT_Test: Available MIDI outputs: Midi Through:Midi Through Port-0 14:0,Samson Graphite M25:Samson Graphite M25 MIDI 1 20:0,Numark ORBIT:Numark ORBIT MIDI 1 24:0,RtMidi Input Client:RtMidi Input 130:0`

Here you can see two MIDI devices (the number might change if you add more MIDI devices, initially the Numark device had `20:0`, when I added the Samson this changed to `24:0`):

`Numark ORBIT:Numark ORBIT MIDI 1 24:0`
`Samson Graphite M25:Samson Graphite M25 MIDI 1 20:0`