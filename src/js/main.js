//-------------------#add wavetable images #images #wavetable------------------
const createOSC = (type, checkBox) => {
    return {
        type,
        onOff: true,
        checkBox: document.getElementById(checkBox),
        volENV: 0,
    };
};

const createOSCAddOsc = (osc) => {
    osc["waveform"] = null;
    osc["oscillator"] = new Tone.Oscillator({
        type: "sine",
        frequency: 440
    });
};

const createOSCAddFilterType = (osc, type) => {
    osc["filterType"] = type;
}

const createOSCAddBody = (osc, selectionBody) => {
    osc["body"] = document.getElementById(selectionBody);
};

const createOSCAddCanvas = (osc, canvasBody) => {
    osc["canvas"] = document.getElementById(canvasBody);
};

const createOSCAddFilter = (osc) => {
    osc["filter"] = new Tone.Filter({
        type: 'highpass',
        frequency: 440,
        Q: 1,
        rolloff: -12,
        gain: 2,
    }).toDestination();
};

const createLFO = () => {
    
};







envs = [
    new Tone.Envelope(0, 0, 1, 0), // 0 - default (not shown)
    new Tone.Envelope(0.1, 0.3, 0.8, 0.3), // ENV 1
    new Tone.Envelope(0.5, 0.5, 1, 0.5), // ENV 2
    new Tone.Envelope(0.5, 0.5, 0.5, 0.5,), // ENV 3
]



lfos = [
    new Tone.LFO(3, 0, 2),
    new Tone.LFO(2, 0, 1),
    new Tone.LFO(2, 0, 1),
    new Tone.LFO(2, 0, 1),
];

//----------------oscA
oscA = createOSC('A', 'checkbox-osc-A');
createOSCAddOsc(oscA);
createOSCAddBody(oscA, 'wavetable-selection-A');
createOSCAddCanvas(oscA, 'wavetable-canvas-A');
createOSCAddFilterType(oscA, 'A');
oscA["knobs"] = {
    unison: app.knobs[10],
    detune: app.knobs[11],
    blend: app.knobs[12],
    pitch: app.knobs[13],
    volume: app.knobs[14],
};

//----------------oscB
oscB = createOSC('B', 'checkbox-osc-B');
createOSCAddOsc(oscB);
createOSCAddBody(oscB, 'wavetable-selection-B');
createOSCAddCanvas(oscB, 'wavetable-canvas-B');
createOSCAddFilterType(oscB, 'B');
oscB["knobs"] = {
    unison: app.knobs[0],
    detune: app.knobs[1],
    blend: app.knobs[2],
    pitch: app.knobs[3],
    volume: app.knobs[4],
};

//----------------oscSUB
oscSUB = createOSC('SUB', 'checkbox-osc-SUB');
createOSCAddOsc(oscSUB);
createOSCAddBody(oscSUB, 'wavetable-selection-SUB');
createOSCAddFilterType(oscSUB, 'S');
oscSUB["knobs"] = {
    pitch: app.knobs[23],
    volume: app.knobs[24],
};

//----------------oscNOISE
oscNOISE = createOSC('NOISE', 'checkbox-osc-NOISE');
createOSCAddFilterType(oscNOISE, 'N');
oscNOISE["knobs"] = {
    pitch: app.knobs[33],
    volume: app.knobs[34],
};

//----------------oscFILTER
oscFILTER = createOSC('FILTER', 'checkbox-osc-FILTER');
createOSCAddFilter(oscFILTER);
oscFILTER["knobs"] = {
    cutoff: app.knobs[40],
    Q: app.knobs[41],
    rolloff: app.knobs[42],
};

//meter
const meter = new Tone.Meter();
Tone.Master.connect(meter);

const fft = new Tone.Analyser('fft', 1024);
Tone.Master.connect(fft);








//------------------------------tone-------------------------

const createENVobject = (osc) => {
    temp = {};
    Object.keys(osc.knobs).forEach(function (k) {
        if (osc.knobs[k].env.target != -1) {
            temp[k] = new Tone.Envelope({
                attack: envs[osc.knobs[k].env.target].attack,
                decay: envs[osc.knobs[k].env.target].decay,
                sustain: envs[osc.knobs[k].env.target].sustain,
                release: envs[osc.knobs[k].env.target].release,
            }).triggerAttack();
        }
    })
    return temp;
};

const addOSC = (obj) => {
    let unison = obj.osc.knobs["unison"].value.cur;
    let detune = obj.osc.knobs["detune"].value.cur;
    let pitch = obj.osc.knobs["pitch"].value.cur;
    let blend = obj.osc.knobs["blend"].value.cur;
    let volumeKnob = obj.osc.knobs["volume"];

    let osc = obj.osc;
    if (!osc.checkBox.checked) { return; }

    const oscTEMParray = [];
    let mid1 = Math.round((unison % 2 == 0 ? (unison) : (unison - 1)) / 2);
    let mid2 = Math.round(unison % 2 == 0 ? (unison / 2) : (unison / 2 - 1));

    obj.frequency = obj.frequency * Math.pow(2, pitch / 12);

    //ADD ENV
    let start = Tone.immediate() + 0.1;
    let target = volumeKnob.env.target != -1 ? volumeKnob.env.target : 3;
    let volENV = new Tone.AmplitudeEnvelope({
        attack: envs[target].attack,
        decay: envs[target].decay,
        sustain: envs[target].sustain,
        release: envs[target].release,
    }).triggerAttack(start);

    let volCenter = new Tone.Volume(-800);
    let volSide = new Tone.Volume(-800);

    volCenter.volume.value = 40 * Math.log10(((volumeKnob.value.cur + 80) / 160) * (1 - blend));
    volSide.volume.value = 40 * Math.log10(((volumeKnob.value.cur + 80) / 160) * (blend));


    if (app.osc.FILTER.target[osc.filterType] && app.osc.FILTER.onOff) {
        for (let i = 0; i < unison; i++) {
            //ADD OSC
            let oscTEMP = new Tone.Oscillator(obj.frequency, osc.oscillator.type);

            if (unison > 1) { oscTEMP.detune.value = i * (detune * 2 / (unison - 1)) - detune; }

            if (mid1 == i || mid2 == i) {
                oscTEMP.chain(volCenter, volENV, oscFILTER.filter);
                oscTEMP.start(start);
            }
            else {
                oscTEMP.chain(volSide, volENV, oscFILTER.filter);
                oscTEMP.start(start);
            }
            oscTEMParray.push(oscTEMP);
        }
    }
    else {
        volENV.toDestination();
        for (let i = 0; i < unison; i++) {
            //ADD OSC
            let oscTEMP = new Tone.Oscillator(obj.frequency, osc.oscillator.type);

            if (unison > 1) { oscTEMP.detune.value = i * (detune * 2 / (unison - 1)) - detune; }

            if (mid1 == i || mid2 == i) {
                oscTEMP.chain(volCenter, volENV);
                oscTEMP.start(start);
            }
            else {
                oscTEMP.chain(volSide, volENV);
                oscTEMP.start(start);
            }
            oscTEMParray.push(oscTEMP);
        }
    }

    let activeNoteObj = {
        oscArray: oscTEMParray,
        unison,
        frequency: obj.frequency,
        env: createENVobject(osc),
        volENV,
        volCenter,
        volSide,
        type: "OSC",
    };

    if (obj.note in obj.activeNote) { obj.activeNote[obj.note].push(activeNoteObj); }
    else { obj.activeNote[obj.note] = [activeNoteObj]; }
};

const addSUB = (obj) => {
    let pitch = obj.osc.knobs["pitch"].value.cur;
    let volumeKnob = obj.osc.knobs["volume"];

    let osc = obj.osc;
    if (!osc.checkBox.checked) { return; }

    const oscTEMParray = [];
    obj.frequency = obj.frequency * Math.pow(2, pitch / 12);

    //ADD ENV
    let start = Tone.immediate() + 0.1;
    let target = volumeKnob.env.target != -1 ? volumeKnob.env.target : 3;
    let volENV = new Tone.AmplitudeEnvelope({
        attack: envs[target].attack,
        decay: envs[target].decay,
        sustain: envs[target].sustain,
        release: envs[target].release,
    }).triggerAttack(start);

    let volCenter = new Tone.Volume(-800);
    let oscTEMP = new Tone.Oscillator(obj.frequency, osc.oscillator.type);

    //connect all
    isFilterOn = app.osc.FILTER.target[osc.filterType];
    connectFilter(oscTEMP, volENV, volCenter, isFilterOn);

    oscTEMP.start(start);
    oscTEMParray.push(oscTEMP);

    let activeNoteObj = {
        oscArray: oscTEMParray,
        unison: 1,
        frequency: obj.frequency,
        env: createENVobject(osc),
        volENV,
        volCenter,
        type: "SUB",
    };

    if (obj.note in obj.activeNote) { obj.activeNote[obj.note].push(activeNoteObj); }
    else { obj.activeNote[obj.note] = [activeNoteObj]; }
};

const addNOISE = (obj) => {
    let volumeKnob = obj.osc.knobs["volume"];

    let osc = obj.osc;
    if (!osc.checkBox.checked) { return; }

    const oscTEMParray = [];

    //ADD ENV
    let start = Tone.immediate() + 0.1;
    let target = volumeKnob.env.target != -1 ? volumeKnob.env.target : 3;
    let volENV = new Tone.AmplitudeEnvelope({
        attack: envs[target].attack,
        decay: envs[target].decay,
        sustain: envs[target].sustain,
        release: envs[target].release,
    }).triggerAttack(start - 0.01);

    let volCenter = new Tone.Volume(-800);
    let noise = ["pink", "white", "brown"];
    let oscTEMP = new Tone.Noise(noise[app.osc.NOISE.type]);

    //connect all
    isFilterOn = app.osc.FILTER.target[osc.filterType];
    connectFilter(oscTEMP, volENV, volCenter, isFilterOn);

    oscTEMP.start(start);
    oscTEMParray.push(oscTEMP);

    let activeNoteObj = {
        oscArray: oscTEMParray,
        unison: 1,
        env: createENVobject(osc),
        volENV,
        volCenter,
        type: "NOISE",
    };

    if (obj.note in obj.activeNote) { obj.activeNote[obj.note].push(activeNoteObj); }
    else { obj.activeNote[obj.note] = [activeNoteObj]; }
};

const addFILTER = (obj) => {
    let osc = obj.osc;
    if (!osc.checkBox.checked) { return; }

    let activeNoteObj = {
        env: createENVobject(osc),
        type: "FILTER",
    };

    if (obj.note in obj.activeNote) { obj.activeNote[obj.note].push(activeNoteObj); }
    else { obj.activeNote[obj.note] = [activeNoteObj]; }
};

const connectFilter = (oscTEMP, ENV, vol, isFilterOn) => {
    oscTEMP.connect(ENV);
    ENV.connect(vol);
    if (isFilterOn && app.osc.FILTER.onOff) {
        vol.connect(oscFILTER.filter);
    }
    else {
        vol.toDestination();
    }
};











const keySet = () => {
    return {
        toRelease: [],
        activeNote: {},
        offset: new Array(128).fill(0),
    }
};

keySetA = keySet();
keySetB = keySet();
keySetSUB = keySet();
keySetNOISE = keySet();
keySetFILTER = keySet();

const releaseKey = (keyset, note) => {
    if (!note) { return; }
    //console.log(note, keyset.offset[note], keyset.activeNote);
    let e = keyset.activeNote[note][keyset.offset[note]++];

    let start = Tone.immediate() + 0.1;
    e.volENV.triggerRelease(start); // necessary?

    Object.keys(e.env).forEach(function (k) {
        e.env[k].triggerRelease(start);
    });

    setTimeout(() => {
        let e = keyset.activeNote[note][0];

        //dispose all
        e.oscArray.forEach((oscTEMP) => {
            oscTEMP.stop();
            oscTEMP.dispose();
        });
        Object.keys(e.env).forEach(function (k) {
            e.env[k].dispose();
        });
        if (e.volENV) e.volENV.dispose();
        if (e.volCenter) e.volCenter.dispose();
        if (e.volSide) e.volSide.dispose();

        keyset.activeNote[note].shift();
        keyset.offset[note]--;
        if (keyset.activeNote[note].length == 0) {
            delete keyset.activeNote[note];
        }
    }, e.volENV.release * 1000);
};

const releaseFILTER = (keyset, note) => {
    if (!note) { return; }
    let e = keyset.activeNote[note][keyset.offset[note]++];
    let start = Tone.immediate() + 0.1;
    let longest = 0;
    Object.keys(e.env).forEach(function (k) {
        if (e.env[k].release > longest) longest = e.env[k].release;
        e.env[k].triggerRelease(start);
    });
    setTimeout(() => {
        let e = keyset.activeNote[note][0];

        //dispose all
        Object.keys(e.env).forEach(function (k) {
            e.env[k].dispose();
        });
        keyset.activeNote[note].shift();
        keyset.offset[note]--;
        if (keyset.activeNote[note].length == 0) {
            delete keyset.activeNote[note];
        }
    }, longest * 1000);
};

const rotateENV = (knob, envValue, showRotation) => {
    let ratio = knob.value.ratio;
    let x = (((knob.value.cur * ratio) - knob.value.low) / ratio); //LENGTH of low~cur -> in cur value

    let v = (x * (knob.automation.percent / -100));
    if (showRotation) {
        knob.env.rotation = ((v * envValue) / ((knob.value.high - knob.value.low) / ratio)) * 264 - 132;
    }
    return v * envValue - v;
}

const adjustSound = (keyset, osc) => {
    //for each pressed KEY
    Object.keys(keyset.activeNote).forEach(function (note) {
        let showRotation = (note == lastPressed);
        e = keyset.activeNote[note][keyset.activeNote[note].length - 1];

        let unison = e.unison;

        key = "detune";
        if (key in e.env) {
            let v = rotateENV(osc.knobs[key], e.env[key].value, showRotation);
            v += osc.knobs[key].value.cur;
            if (unison > 1) {
                for (let i = 0; i < unison; i++) {
                    e.oscArray[i][key].value = i * (v * 2 / (unison - 1)) - v;
                }
            }
        }

        key = "pitch";
        if (key in e.env) {
            let v = rotateENV(osc.knobs[key], e.env[key].value, showRotation);
            frequency = e.frequency * Math.pow(2, v / 12);
            for (let i = 0; i < unison; i++) {
                e.oscArray[i].frequency.value = frequency;
            }
        }

        key = "blend";
        if (key in e.env) {
            rotateENV(osc.knobs[key], e.env[key].value, showRotation);

            let volume = osc.knobs['volume'].value.cur;
            let blend = osc.knobs['blend'].value.cur;
            e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
            e.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
        }

        //always active (since volume has env of 0)
        key = "volume";
        if (key in e.env) {
            if (e.type == "OSC") {
                rotateENV(osc.knobs[key], e.volENV.value, showRotation);

                let volume = osc.knobs['volume'].value.cur;
                let blend = osc.knobs['blend'].value.cur;
                e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
                e.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
            }
            else if (["SUB", "NOISE"].includes(e.type)) {
                rotateENV(osc.knobs[key], e.volENV.value, showRotation);

                let volume = osc.knobs['volume'].value.cur;
                e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160));
            }
        }

    });

    if (oscFILTER.onOff) {

    }
}

const adjustFILTER = (keyset, osc) => {
    Object.keys(keyset.activeNote).forEach(function (note) {
        let showRotation = (note == lastPressed);
        e = keyset.activeNote[note][keyset.activeNote[note].length - 1];

        console.log('hi');

        key = "Cutoff";
        if (key in e.env) {
            let v = rotateENV(osc.knobs[key], e.env[key].value, showRotation);
            v += osc.knobs[key].value.cur;
            if (unison > 1) {
                for (let i = 0; i < unison; i++) {
                    e.oscArray[i][key].value = i * (v * 2 / (unison - 1)) - v;
                }
            }
        }
    });
}







//-------------------------------update - ENV----------------------------

let releaseKeyOnce = true;
Tone.Transport.scheduleRepeat((time) => {
    drawMeter(meter.getValue());
    drawFFT(fft);

    releaseKey(keySetA, keySetA.toRelease.shift());
    releaseKey(keySetB, keySetB.toRelease.shift());
    releaseKey(keySetSUB, keySetSUB.toRelease.shift());
    releaseKey(keySetNOISE, keySetNOISE.toRelease.shift());
    releaseFILTER(keySetFILTER, keySetFILTER.toRelease.shift());

    adjustSound(keySetA, oscA);
    adjustSound(keySetB, oscB);
    adjustSound(keySetSUB, oscSUB);
    adjustSound(keySetNOISE, oscNOISE);
    adjustFILTER(keySetFILTER, oscFILTER);
}, "128n");

Tone.Transport.start();


lastPressed = null;
const startOSC = (key) => {
    lastPressed = key.note;

    addOSC({
        osc: oscA,
        activeNote: keySetA.activeNote,
        frequency: key.frequency,
        note: key.note,
    });

    addOSC({
        osc: oscB,
        activeNote: keySetB.activeNote,
        frequency: key.frequency,
        note: key.note,
    });

    addSUB({
        osc: oscSUB,
        activeNote: keySetSUB.activeNote,
        frequency: key.frequency,
        note: key.note,
    });

    addNOISE({
        osc: oscNOISE,
        activeNote: keySetNOISE.activeNote,
        note: key.note,
    });

    addFILTER({
        osc: oscFILTER,
        activeNote: keySetFILTER.activeNote,
        note: key.note,
    });
};

const stopOSC = async (key) => {
    if (oscA.checkBox.checked) {
        keySetA.toRelease.push(key.note);
    }
    if (oscB.checkBox.checked) {
        keySetB.toRelease.push(key.note);
    }
    if (oscSUB.checkBox.checked) {
        keySetSUB.toRelease.push(key.note);
    }
    if (oscNOISE.checkBox.checked) {
        keySetNOISE.toRelease.push(key.note);
    }
    if (oscFILTER.checkBox.checked) {
        keySetFILTER.toRelease.push(key.note);
    }
}