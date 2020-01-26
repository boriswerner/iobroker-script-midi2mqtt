
//
// MIDI to MQTT bridge
//
// Original-Author: Andy Swing
// Adapted for iobroker by Boris Werner


var Mqtt = require('mqtt');
var Midi = require('easymidi');

var MQTT_BROKER = 'mqtt://192.168.178.54';
var MIDI_DEVICE = 'Numark ORBIT:Numark ORBIT MIDI 1 20:0';

var mqttConnected;


//
// MQTT
//

log('mqtt trying to connect to'+ MQTT_BROKER);
var mqtt = Mqtt.connect(MQTT_BROKER, {will: {topic: 'midi' + '/connected', payload: '0'}});

// Shotcut for publishing to MQTT and logging it
function pubMQTT(topic, payload){
    var fullTopic = 'midi' + '/' + topic;
    log('mqtt >'+ fullTopic+ payload);
    mqtt.publish(fullTopic, payload);
}

mqtt.on('connect', function () {
    mqttConnected = true;
    log('mqtt connected ' + MQTT_BROKER);
    mqtt.publish('midi' + '/connected', '1');
    log('mqtt subscribe'+ 'midi' + '/in/+/+/+');
    mqtt.subscribe('midi' + '/in/+/+/+');

});

mqtt.on('close', function () {
    if (mqttConnected) {
        mqttConnected = false;
        log('mqtt closed ' + MQTT_BROKER);
    }
});

mqtt.on('error', function (error) {
    log('mqtt error ' + error);
});

mqtt.on('message', function (topic, payload) {
    payload = payload.toString();
    log('mqtt <'+ topic+ payload);

    var parts = topic.split('/');
    var channel = parseInt(parts[parts.length-3]);
    var type = parts[parts.length-2].toString();
    var param = parseInt(parts[parts.length-1]);
    var value = parseInt(payload);
    
    log('midi > channel:'+ channel+ 'type:'+ type+ 'parameter:'+ param+ 'value:'+ value);
    
    switch (type) {
        case 'noteon':
        case 'noteoff':
            var data = Object();
            data['note'] = param;
            data['velocity'] = value;
            data['channel'] = channel;
            midiOut.send(type, data);
            break;
        case 'cc':
            var data = Object();
            data['controller'] = param;
            data['value'] = value;
            data['channel'] = channel;
            midiOut.send(type, data);
            break;
        case 'poly_aftertouch':
            var data = Object();
            data['note'] = param;
            data['velocity'] = value;
            data['channel'] = channel;
            midiOut.send('poly aftertouch', data);
            break;
        default:
            log('Unsupported command \'' + type + '\' recieved via MQTT');
            break;
    }

});


//
// Midi connections
//
log('Available MIDI inputs: '+ Midi.getInputs());
log('Available MIDI outputs: '+ Midi.getOutputs());

var midiIn = new Midi.Input(MIDI_DEVICE);
var midiOut = new Midi.Output(MIDI_DEVICE);

midiIn.on('noteoff', function (msg) {
  log('midi < noteoff'+ msg.note+ msg.velocity+ msg.channel);
  pubMQTT('out/' + msg.channel + '/noteoff/' + msg.note, msg.velocity.toString());
});

midiIn.on('noteon', function (msg) {
  log('midi < noteon'+ msg.note+ msg.velocity+ msg.channel);
  pubMQTT('out/' + msg.channel + '/noteon/' + msg.note, msg.velocity.toString());
});

midiIn.on('poly aftertouch', function (msg) {
  log('midi < poly aftertouch'+ msg.note+ msg.pressure+ msg.channel);
  pubMQTT('out/' + msg.channel + '/poly_aftertouch/' + msg.note, msg.pressure.toString());
});

midiIn.on('cc', function (msg) {
  log('midi < cc'+ msg.controller+ msg.value+ msg.channel);
  pubMQTT('out/' + msg.channel + '/cc/' + msg.controller, msg.value.toString());
});

midiIn.on('program', function (msg) {
  log('midi < program'+ msg.number+ msg.channel);
});

midiIn.on('channel aftertouch', function (msg) {
  log('midi < channel aftertouch'+ msg.pressure+ msg.channel);
});

midiIn.on('pitch', function (msg) {
  log('midi < pitch'+ msg.value+ msg.channel);
});

midiIn.on('position', function (msg) {
  log('midi < position'+ msg.value);
});

midiIn.on('select', function (msg) {
  log('midi < select'+ msg.song);
});

midiIn.on('clock', function () {
  //log('midi < clock');
});

midiIn.on('start', function () {
  log('midi < start');
});

midiIn.on('continue', function () {
  log('midi < continue');
});

midiIn.on('stop', function () {
  log('midi < stop');
});

midiIn.on('reset', function () {
  log('midi < reset');
});


//
// Catch ctrl-c to exit program
//
onStop(function (callback) {
    log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    midiIn.close();
    midiOut.close();
    mqtt.publish('midi' + '/connected', '0');
    mqtt.end(function() {
    log("Exiting...");
    callback();
}, 2000 /*ms*/);


});