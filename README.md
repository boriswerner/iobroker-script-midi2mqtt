# iobroker-script-midi2mqtt
midi2mqtt adaptation for iobroker Script Engine

based on https://github.com/TheOriginalAndrobot/midi2mqtt

The script is just a temporary solution. 
I am currently using it to send messages to the MQTT adapter in iobroker.

I initially installed the midi2mqtt on the same Raspberry Pi 4 as the iobroker was running on and the delay between MIDI command recognized in the midi2mqtt and received mqtt message in iobroker MQTT was about a minute (using timestamps with both in debug mode).
So I checked whether I could send a message directly from the script engine in iobroker using the same mqtt library and it was without a delay.
Last but not least I adjusted the whole script to run in the script engine.
I just checked the receiving of MIDI signals to control some hue devices (dimming, switching on/off).

Next is to implement MIDI directly into iobroker as an adapter.
For more flexibility RTP-MIDI (MIDI over network) should  be used either by a direct implementation or via a virtual device/proxy (some references on the topic are available below).

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

## References

Original script:
https://github.com/TheOriginalAndrobot/midi2mqtt

### RTP-MIDI
https://github.com/ravelox/pimidi --RTP MIDI proxy for raspberry pi
https://github.com/jdachtera/node-rtpmidi
https://github.com/mik3y/pymidi
https://github.com/lathoub/Arduino-AppleMIDI-Library
http://www.humatic.de/htools/nmj