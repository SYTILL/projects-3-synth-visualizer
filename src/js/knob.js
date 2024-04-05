let app = new Vue({
    el: '#app',
    data: {
        noiseTypes: ["pink", "white", "brown"],
        filterTypes: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"],
        osc: {
            A: {
                onOff: true,
            },
            B: {
                onOff: true,
            },
            SUB: {
                onOff: false,
            },
            NOISE: {
                onOff: false,
                type: 1,
            },
            FILTER: {
                onOff: false,
                type: 1,
                target: {
                    A: false,
                    B: false,
                    S: false,
                    N: false,
                }
            }
        },
        selectedENV: 1,
        selectedLFO: 1,
        knobs:
        {
            //---------------------SUB-----------------------
            23: {
                label: 'Pitch',
                osc: "SUB", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            24: {
                label: 'Volume',
                osc: "SUB", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },

            //---------------------NOISE-----------------------
            33: {
                label: 'Pitch',
                osc: "NOISE", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            34: {
                label: 'Volume',
                osc: "NOISE", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },

            //---------------------FILTER-----------------------
            40: {
                label: 'Cutoff',
                osc: "FILTER", knobType: "circle", row: "upper",
                rotation: -15,
                value: { cur: 440, low: 0, high: 1000, ratio: 1, points: 0 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            41: {
                label: 'Q',
                osc: "FILTER", knobType: "circle", row: "upper",
                rotation: -79,
                value: { cur: 1.0, low: 0, high: 50, ratio: 10, points: 1 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            42: {
                label: 'Rolloff',
                osc: "FILTER1", knobType: "updown", row: "upper",
                value: { real: 0, cur: -12, low: 0, high: 3 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            43: {
                label: 'Gain',
                osc: "FILTER", knobType: "circle", row: "upper",
                rotation: -132,
                value: { cur: 0, low: 0, high: 10, ratio: 1, points: 0 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },

            //---------------------OSC A-----------------------
            10: {
                label: 'Unison',
                osc: "A", knobType: "updown", row: "upper",
                value: { real: 1, cur: 1, low: 1, high: 16 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                active: true, selected: false,
            },
            11: {
                label: 'Detune',
                osc: "A", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48, ratio: 1, points: 0 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            12: {
                label: 'Blend',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0.5, low: 0, high: 100, ratio: 100, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            13: {
                label: 'Pitch',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            14: {
                label: 'Volume',
                osc: "A", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },

            //---------------------OSC B-----------------------
            0: {
                label: 'Unison',
                osc: "B", knobType: "updown", row: "upper",
                value: { real: 1, cur: 1, low: 1, high: 16 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                active: true, selected: false,
            },
            1: {
                label: 'Detune',
                osc: "B", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48, ratio: 1, points: 0 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            2: {
                label: 'Blend',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0.5, low: 0, high: 100, ratio: 100, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            3: {
                label: 'Pitch',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { cur: 0, low: -240, high: 240, ratio: 10, points: 2 },
                env: { target: -1, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },
            4: {
                label: 'Volume',
                osc: "B", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80, ratio: 1, points: 0 },
                env: { target: 0, rotation: -132 },
                color: '#0060df',
                automation: { selected: false, percent: -100 },
                active: true, selected: false,
            },


            //---------------------ENV-----------------------
            60: {
                label: 'Attack',
                osc: "ENV", knobType: "circle", row: "lower",
                value: { cur: 0, low: 0, high: 1000, ratio: 1000, points: 2 },
                rotation: -132,
                color: '#0060df',
                active: true, selected: false,
            },
            61: {
                label: 'Decay',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: -132,
                value: { cur: 0, low: 0, high: 1000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            62: {
                label: 'Sustain',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 500, low: 0, high: 1000, ratio: 1000, points: 2 },
                color: '#0060df',
                active: true, selected: false,
            },
            63: {
                label: 'Release',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: -132,
                value: { cur: 0, low: 0, high: 1000, ratio: 1000, points: 2 },
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

            //automation apply percentage change
            if ("automation" in selectedKnob && selectedKnob.automation.selected){
                selectedKnob.automation.percent -= (e.pageY - app.currentY)/10;

                if(selectedKnob.automation.percent < -100) selectedKnob.automation.percent = -100;
                else if(selectedKnob.automation.percent > 100) selectedKnob.automation.percent = 100;
                return;
            }

            if (selectedKnob.knobType == "updown") {
                app.updownCounter(selectedKnob.value, -(e.pageY - app.currentY) / 10, selectedKnob.label);
            }
            else if (selectedKnob.knobType == "circle") {
                app.setKnob(selectedKnob, -(e.pageY - app.currentY));
            }
            else { throw Error("Wrong Knob Type"); }
            app.currentY = e.pageY;

            //update change on canvas
            if (['Attack', 'Decay', 'Sustain', 'Release'].includes(selectedKnob.label)) {
                envs[app.selectedENV][selectedKnob.label.toLowerCase()] = selectedKnob.value.cur;
                drawENV();
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

            //update FILTER canvas
            if (['FILTER'].includes(selectedKnob.osc)) {
                visualizeFilter(oscFILTER);
            }
        },
        updownCounter: (value, amount, type = null) => {
            value.real += amount;
            if (value.real >= value.high) {
                value.real = value.high;
            }
            else if (value.real <= value.low) {
                value.real = value.low;
            }
            value.cur = Math.round(value.real);
            if (type == "Rolloff") {
                value.cur = -12 * (2 ** value.cur);
                oscFILTER.filter.rolloff = value.cur;
                visualizeFilter(oscFILTER);
            }
        },
    },
    methods: {
        changeFilterType: function (value) {
            //adjust filter type by +-value
            len = app.filterTypes.length;
            typeValue = (app.osc.FILTER.type + len + value) % len
            app.osc.FILTER.type = typeValue;

            oscFILTER.filter.type = app.filterTypes[typeValue];
            visualizeFilter(oscFILTER);
        },

        unselectKnobs: async function () {
            for (var i in this.knobs) {
                this.knobs[i].selected = false;
                if ("automation" in this.knobs[i])
                    this.knobs[i].automation.selected = false;
            }
            await drawWaveform(oscA);
            await drawWaveform(oscB);
        },

        setKnob: function (knob, diff = 0) {
            if (knob.label == "unison") {
                throw Error("It has Circle Knob prop but It is Unison");
            }

            knob.rotation += diff;
            if (knob.rotation >= 132) { knob.rotation = 132; }
            else if (knob.rotation <= -132) { knob.rotation = -132; }

            // Calculate value.cur based on rotation
            let range = knob.value.high - knob.value.low;
            let rotationRatio = (knob.rotation + 132) / 264; //[0,1]

            let temp = knob.value.low + rotationRatio * range;

            if (temp > knob.value.high) { temp = knob.value.high; }
            else if (temp < knob.value.low) { temp = knob.value.low; }

            if (knob.label == "Cutoff") {
                const logMin = 20;
                const logMax = 20000;
                value = Number((Math.exp((temp / knob.value.high) * (Math.log(logMax) - Math.log(logMin)) + Math.log(logMin))).toFixed(0));

                knob.value.cur = value;
                oscFILTER.filter.frequency.value = value;
            }
            else {
                knob.value.cur = Number((temp / knob.value.ratio).toFixed(knob.value.points));

                if (knob.label == "Q") {
                    oscFILTER.filter.Q.value = knob.value.cur;
                }
                else if (knob.label == "Gain") {
                    oscFILTER.filter.gain.value = knob.value.cur;
                }
            }


        },

        setENVknobRotation: function () {
            env = envs[app.selectedENV];

            attackKnob = app.knobs[60];
            decayKnob = app.knobs[61];
            sustainKnob = app.knobs[62];
            releaseKnob = app.knobs[63];

            attackKnob.rotation = Math.round(264 * env.attack) - 132;
            decayKnob.rotation = Math.round(264 * env.decay) - 132;
            sustainKnob.rotation = Math.round(264 * env.sustain) - 132;
            releaseKnob.rotation = Math.round(264 * env.release) - 132;

            app.setKnob(attackKnob);
            app.setKnob(decayKnob);
            app.setKnob(sustainKnob);
            app.setKnob(releaseKnob);

            drawENV();
        },

        setENVtype: function (knob, value) {
            if (knob.env.target == value) {
                knob.env.target = (knob.label == 'Volume' ? 0 : -1);
            }
            else {
                knob.env.target = value;
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