

//--------------#drag & drop----------------------------
selectBoxes = document.querySelectorAll(".ENV-select-box");

let selectedDragItem = null;
let i = 1;
selectBoxes.forEach(box => {
    box.setAttribute('data-envnum', i++);

    const img = new Image();
    img.src = "src/images/drag-image.png";

    box.addEventListener("dragstart", function (e) {
        e.dataTransfer.setDragImage(img, 25, 10);
        selectedDragItem = Number(box.dataset.envnum);
    }, false);
});


//-------------------#add wavetable images #images #wavetable------------------
const createOSC = (checkBox, selectionBody, canvasBody, type) => {
    return {
        type,
        onOff: true,
        checkBox: document.getElementById(checkBox),
        body: document.getElementById(selectionBody),
        canvas: document.getElementById(canvasBody),
        waveform: null,
        oscillator: new Tone.Oscillator({
            type: "sine",
            frequency: 440
        }),
        volENV: 0,
    };
};

envs = [
    new Tone.Envelope(0, 0, 1, 0), // 0 - default (not shown)
    new Tone.Envelope(0.1, 0.3, 0.8, 0.3), // ENV 1
    new Tone.Envelope(0.5, 0.5, 1, 0.5), // ENV 2
    new Tone.Envelope(0.5, 0.5, 0.5, 0.5,), // ENV 3
]

oscA = createOSC('checkbox-osc-A', 'wavetable-selection-A', 'wavetable-canvas-A', 'A');
oscA["knobs"] = {
    unison: app.knobs[10],
    detune: app.knobs[11],
    blend: app.knobs[12],
    pitch: app.knobs[13],
    volume: app.knobs[14],
};

oscB = createOSC('checkbox-osc-B', 'wavetable-selection-B', 'wavetable-canvas-B', 'B');
oscB["knobs"] = {
    unison: app.knobs[0],
    detune: app.knobs[1],
    blend: app.knobs[2],
    pitch: app.knobs[3],
    volume: app.knobs[4],
};

oscSUB = createOSC('checkbox-osc-SUB', 'wavetable-selection-SUB', 'NULL', 'SUB');
oscSUB["knobs"] = {
    pitch: app.knobs[23],
    volume: app.knobs[24],
};

oscNOISE = createOSC('checkbox-osc-NOISE', 'NULL', 'NULL', 'SUB');
oscNOISE["knobs"] = {
    pitch: app.knobs[33],
    volume: app.knobs[34],
};




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

    let volCenter = new Tone.Volume(-12);
    let volSide = new Tone.Volume(-12);
    for (let i = 0; i < unison; i++) {
        //ADD OSC
        let oscTEMP = new Tone.Oscillator(obj.frequency, osc.oscillator.type);

        if (unison > 1) { oscTEMP.detune.value = i * (detune * 2 / (unison - 1)) - detune; }

        if (mid1 == i || mid2 == i) {
            oscTEMP.connect(volENV);
            volENV.connect(volCenter);
            volCenter.toDestination();
            oscTEMP.start(start);
        }
        else {
            oscTEMP.connect(volENV);
            volENV.connect(volSide);
            volSide.toDestination();
            oscTEMP.start(start);
        }
        oscTEMParray.push(oscTEMP);
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
    }).triggerAttack(start - 0.01);

    let volCenter = new Tone.Volume(-12);
    let oscTEMP = new Tone.Oscillator(obj.frequency, osc.oscillator.type);

    oscTEMP.connect(volENV);
    volENV.connect(volCenter);
    volCenter.toDestination();

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

const releaseKey = (keyset, note) => {
    if (!note) { return; }
    console.log(keyset.offset);
    let e = keyset.activeNote[note][keyset.offset[note]++];

    let start = Tone.immediate() + 0.1;
    e.volENV.triggerRelease(start); // necessary?

    Object.keys(e.env).forEach(function (k) {
        e.env[k].triggerRelease(start);
    });
    setTimeout(() => {
        let e = keyset.activeNote[note][0];
        e.oscArray.forEach((oscTEMP) => { oscTEMP.stop(); });
        keyset.activeNote[note].shift();
        keyset.offset[note]--;
        if (keyset.activeNote[note].length == 0) { delete keyset.activeNote[note]; }
    }, e.volENV.release * 1000);
};

const rotateENV = (knob, envValue, showRotation) => {
    let ratio = knob.value.ratio;
    let v = ((knob.value.cur * ratio) - knob.value.low) / ratio * envValue;
    if (showRotation) { knob.env.rotation = (v / ((knob.value.high - knob.value.low) / ratio)) * 264 - 132; }
    return v;
}

const adjustSound = (keyset, osc) => {
    //for each pressed KEY
    Object.keys(keyset.activeNote).forEach(function (note) {
        let showRotation = (note == lastPressed);

        e = keyset.activeNote[note][keyset.activeNote[note].length - 1];

        //let start = e.start; //not used
        let unison = e.unison;

        key = "detune";
        if (key in e.env) {
            let v = rotateENV(osc.knobs[key], e.env[key].value, showRotation);

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

        // key = "blend";
        // if (key in e.env) {
        //     let v = rotateENV(osc.knobs[key], e.env[key].value, showRotation);

        //     let volume = osc.knobs['volume'].value.cur;
        //     let blend = osc.knobs['blend'].value.cur;
        //     e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
        //     e.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
        //     console.log('???');
        // }

        key = "volume";
        if (key in e.env) {
            if (e.type == "OSC") {
                rotateENV(osc.knobs[key], e.volENV.value, showRotation);

                let volume = osc.knobs['volume'].value.cur;
                let blend = osc.knobs['blend'].value.cur;
                e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
                e.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
            }
            else if (e.type == "SUB") {
                rotateENV(osc.knobs[key], e.volENV.value, showRotation);

                let volume = osc.knobs['volume'].value.cur;
                e.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160));
            }
        }

    });
}

//-------------------------------update - ENV----------------------------

let releaseKeyOnce = true;
Tone.Transport.scheduleRepeat((time) => {
    releaseKey(keySetA, keySetA.toRelease.shift());
    //releaseKey(keySetB, keySetB.toRelease.shift());
    releaseKey(keySetSUB, keySetSUB.toRelease.shift());

    adjustSound(keySetA, oscA);
    //adjustSound(keySetB, oscB);
    adjustSound(keySetSUB, oscSUB);
}, "32n");

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

    // addOSC({
    //     osc: oscB,
    //     activeNote: keySetB.activeNote,
    //     frequency: key.frequency,
    //     note: key.note,
    // });

    addSUB({
        osc: oscSUB,
        activeNote: keySetSUB.activeNote,
        frequency: key.frequency,
        note: key.note,
    });
};

const stopOSC = async (key) => {
    if (oscA.checkBox.checked) {
        keySetA.toRelease.push(key.note);
    }
    //keySetB.toRelease.push(key.note);
    if (oscSUB.checkBox.checked) {
        keySetSUB.toRelease.push(key.note);
    }
}