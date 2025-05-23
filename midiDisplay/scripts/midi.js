class MIDI_Message {
    constructor(data) {
        /*
        data is Uint8Array[3] with
        data[0] : command/channel
        data[1] : note
        data[2] : velocity
        */
        this.cmd = data[0] >> 4;
        this.channel = data[0] & 0xf; // 0-15
        this.type = data[0] & 0xf0;
        this.note = data[1];
        this.velocity = data[2];
        
        if (this.velocity === 0 && this.type === MIDI_Message.NOTE_ON) {
            this.type = MIDI_Message.NOTE_OFF;
        }
        
        this.toString = function () {
            return 'type=' + this.type +
                ' channel=' + this.channel +
                ' note=' + this.note +
                ' velocity=' + this.velocity;
        };
    }
}
MIDI_Message.NOTE_ON = 144;
MIDI_Message.NOTE_OFF = 128;

class MIDIInput {
    constructor() {
        this.onMIDISuccess = this.onMIDISuccess.bind(this);
        // request MIDI access
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(this.onMIDISuccess, this.onMIDIFailure);
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    onMIDISuccess(midiAccess_) {
        var inputs = midiAccess_.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            console.log(input.value.name);
            input.value.onmidimessage = this.onMIDIMessage;
        }
    }

    onMIDIMessage(raw_msg) {
        // IMPORTANT: This should be an empty method since you're 
        // overriding it in main.js. If you log here, it'll cause
        // duplicate MIDI handling
    }

    onMIDIFailure(e) {
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
    }
}