let app = new Vue({
    el: '#app',
    data: {
        osc: {
            A: {
                onOff: true,
            },
            B: {
                onOff: true,
            },
            SUB: {
                onOff: true,
            },
            NOISE: {
                onOff: true,
            }
        },
        knobs:
        {
            //---------------------OSC A-----------------------
            10: {
                label: 'Unison',
                osc: "A", knobType: "updown", row: "upper",
                value: { real: 1, cur: 1, low: 1, high: 16 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            11: {
                label: 'Detune',
                osc: "A", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48, ratio: 1, points: 0 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            12: {
                label: 'Blend',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0.5, low: 0, high: 100, ratio: 100, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            13: {
                label: 'Pitch',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            14: {
                label: 'Volume',
                osc: "A", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                color: '#0060df',
                active: true, selected: false,
            },

            //---------------------OSC B-----------------------
            0: {
                label: 'Unison',
                osc: "B", knobType: "updown", row: "upper",
                value: { real: 1, cur: 1, low: 1, high: 16 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            1: {
                label: 'Detune',
                osc: "B", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48, ratio: 1, points: 0 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            2: {
                label: 'Blend',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0.5, low: 0, high: 100, ratio: 100, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            3: {
                label: 'Pitch',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            4: {
                label: 'Volume',
                osc: "B", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                color: '#0060df',
                active: true, selected: false,
            },


            //---------------------ENV-----------------------
            60: {
                label: 'Attack',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            61: {
                label: 'Decay',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            62: {
                label: 'Sustain',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            63: {
                label: 'Release',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
        },
        currentY: 0,
        mousemoveFunction: async function (e) {
            if (e.pageY - app.currentY == 0) { return; }

            let selectedKnob = Object.entries(app.knobs).filter(function (i) { return i[1].selected === true; });
            if (selectedKnob.length <= 0) { return; }
            selectedKnob = selectedKnob[0][1];

            if (selectedKnob.knobType == "updown") {
                app.updownCounter(selectedKnob.value, -(e.pageY - app.currentY) / 10);
                app.currentY = e.pageY;
            }
            else if (selectedKnob.knobType == "circle") {
                app.currentY = e.pageY;

                console.log(selectedKnob);
                setKnob(selectedKnob, (e.pageY - app.currentY));
            }
            else { throw Error("Wrong Knob Type"); }



            //real time volume change
            if (['Volume', 'Blend'].includes(selectedKnob.label)) {
                if (selectedKnob.osc == 'A') {
                    let volume = app.knobs[14].value.cur;
                    let blend = app.knobs[12].value.cur;
                    oscA.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
                    oscA.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
                }
                else if (selectedKnob.osc == 'B') {
                    let volume = app.knobs[4].value.cur;
                    let blend = app.knobs[2].value.cur;
                    oscB.volCenter.volume.value = 40 * Math.log10(((volume + 80) / 160) * (1 - blend));
                    oscB.volSide.volume.value = 40 * Math.log10(((volume + 80) / 160) * (blend));
                }
            }

            //show unison bar on canvas
            if (['Blend', 'Detune', 'Unison'].includes(selectedKnob.label)) {
                if (selectedKnob.osc == 'A') {
                    await drawWaveform(oscA, 'A');
                }
                else if (selectedKnob.osc == 'B') {
                    await drawWaveform(oscB, 'B');
                }
            }
        },
        updownCounter: (value, amount) => {
            value.real += amount;
            if (value.real >= value.high) {
                value.real = value.high;
            }
            else if (value.real <= value.low) {
                value.real = value.low;
            }
            value.cur = Math.round(value.real);
        },
    },
    methods: {
        unselectKnobs: async function () {
            for (var i in this.knobs) {
                this.knobs[i].selected = false;
            }
            await drawWaveform(oscA);
            await drawWaveform(oscB);
        },
        setKnob: function (knob, diff) {

            // Knob Rotation
            knob.rotation -= diff;

            // Setting Max rotation
            if (knob.rotation >= 132) { knob.rotation = 132; }
            else if (knob.rotation <= -132) { knob.rotation = -132; }

            // Calculate value.cur based on rotation
            let range = knob.value.high - knob.value.low;
            let rotationRatio = (knob.rotation + 132) / 264; //[0,1]

            let temp = knob.value.low + rotationRatio * range;

            if (temp > knob.value.high) { temp = knob.value.high; }
            else if (temp < knob.value.low) { temp = knob.value.low; }

            knob.value.cur = Number((temp / knob.value.ratio).toFixed(knob.value.points));



            if (label == "unison") {

            }
            else if (label == "detune") {

            }
        }
    },
    mounted() {
        // Bind mousemove and mouseup events to the window
        window.addEventListener('mousemove', this.mousemoveFunction);
        window.addEventListener('mouseup', this.unselectKnobs);
    },
    beforeDestroy() {
        // Unbind mousemove and mouseup events when the component is destroyed
        window.removeEventListener('mousemove', this.mousemoveFunction);
        window.removeEventListener('mouseup', this.unselectKnobs);
    },
});