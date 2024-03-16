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
                value: { real: 1.0, cur: 1, low: 1, high: 16 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            11: {
                label: 'Detune',
                osc: "A", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            12: {
                label: 'Blend',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { real: 50, cur: 0.5, low: 0, high: 100, ratio: 100 },
                color: '#0060df',
                active: true, selected: false,
            },
            13: {
                label: 'Pitch',
                osc: "A", knobType: "circle", row: "upper",
                rotation: 0,
                value: { real: 0, cur: 0, low: -240, high: 240, ratio: 10 },
                color: '#0060df',
                active: true, selected: false,
            },
            14: {
                label: 'Volume',
                osc: "A", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80 },
                color: '#0060df',
                active: true, selected: false,
            },

            //---------------------OSC B-----------------------
            0: {
                label: 'Unison',
                osc: "B", knobType: "updown", row: "upper",
                value: { real: 1.0, cur: 1, low: 1, high: 16 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            1: {
                label: 'Detune',
                osc: "B", knobType: "circle", row: "upper",
                rotation: -110,
                value: { cur: 4, low: 0, high: 48 },
                color: '#0060df',
                active: true,
                selected: false,
            },
            2: {
                label: 'Blend',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { real: 50, cur: 0.5, low: 0, high: 100, ratio: 100 },
                color: '#0060df',
                active: true, selected: false,
            },
            3: {
                label: 'Pitch',
                osc: "B", knobType: "circle", row: "upper",
                rotation: 0,
                value: { real: 0, cur: 0, low: -240, high: 240, ratio: 10 },
                color: '#0060df',
                active: true, selected: false,
            },
            4: {
                label: 'Volume',
                osc: "B", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: -80, high: 80 },
                color: '#0060df',
                active: true, selected: false,
            },


            //---------------------ENV-----------------------
            60: {
                label: 'Attack',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000 },
                color: '#0060df',
                active: true, selected: false,
            },
            61: {
                label: 'Decay',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000 },
                color: '#0060df',
                active: true, selected: false,
            },
            62: {
                label: 'Sustain',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000 },
                color: '#0060df',
                active: true, selected: false,
            },
            63: {
                label: 'Release',
                osc: "ENV", knobType: "circle", row: "lower",
                rotation: 0,
                value: { cur: 0, low: 0, high: 2000, ratio: 1000 },
                color: '#0060df',
                active: true, selected: false,
            },
        },
        currentY: 0,
        mousemoveFunction: async function (e) {
            let selectedKnob = Object.entries(app.knobs).filter(function (i) { return i[1].selected === true; });

            if (selectedKnob.length > 0) {
                selectedKnob = selectedKnob[0][1];
                if (selectedKnob.knobType == "updown") {
                    app.updownCounter(selectedKnob.value, -(e.pageY - app.currentY) / 10);
                    app.currentY = e.pageY;
                }

                if (selectedKnob.knobType == "circle") {
                    // Knob Rotation
                    if (e.pageY - app.currentY !== 0) { selectedKnob.rotation -= (e.pageY - app.currentY); }
                    app.currentY = e.pageY;

                    // Setting Max rotation
                    if (selectedKnob.rotation >= 132) { selectedKnob.rotation = 132; }
                    else if (selectedKnob.rotation <= -132) { selectedKnob.rotation = -132; }

                    // Calculate value.cur based on rotation
                    let range = selectedKnob.value.high - selectedKnob.value.low;
                    let rotationRatio = (selectedKnob.rotation + 132) / 264; //[0,1]

                    //apply ratio
                    if (['Blend', 'Pitch', 'Attack', 'Decay', 'Sustain', 'Release'].includes(selectedKnob.label)) {
                        selectedKnob.value.real = selectedKnob.value.low + rotationRatio * range;

                        if (selectedKnob.value.real > selectedKnob.value.high) {
                            selectedKnob.value.real = selectedKnob.value.high;
                        } else if (selectedKnob.value.real < selectedKnob.value.low) {
                            selectedKnob.value.real = selectedKnob.value.low;
                        }

                        selectedKnob.value.cur = (selectedKnob.value.real / selectedKnob.value.ratio).toFixed(2);

                        if (['Blend'].includes(selectedKnob.label)) {
                            if (selectedKnob.osc == 'A') {
                                oscA.blend = selectedKnob.value.cur;
                            }
                            else if (selectedKnob.osc == 'B') {
                                oscB.blend = selectedKnob.value.cur;
                            }
                        }
                    }

                    else {
                        selectedKnob.value.cur = Math.round(selectedKnob.value.low + rotationRatio * range);

                        if (selectedKnob.value.cur > selectedKnob.value.high) {
                            selectedKnob.value.cur = selectedKnob.value.high;
                        } else if (selectedKnob.value.cur < selectedKnob.value.low) {
                            selectedKnob.value.cur = selectedKnob.value.low;
                        }


                        if (['Volume'].includes(selectedKnob.label)) {
                            if (selectedKnob.osc == 'A') {
                                oscA.vol = selectedKnob.value.cur;
                            }
                            else if (selectedKnob.osc == 'B') {
                                oscB.vol = selectedKnob.value.cur;
                            }
                        }
                    }
                }

                if (['Volume', 'Blend'].includes(selectedKnob.label)) {
                    if (selectedKnob.osc == 'A') {
                        oscA.volCenter.volume.value = 40 * Math.log10(((oscA.vol + 80) / 160) * (1 - oscA.blend));
                        oscA.volSide.volume.value = 40 * Math.log10(((oscA.vol + 80) / 160) * (oscA.blend));
                    }
                    else if (selectedKnob.osc == 'B') {
                        oscB.volCenter.volume.value = 40 * Math.log10(((oscB.vol + 80) / 160) * (1 - oscB.blend));
                        oscB.volSide.volume.value = 40 * Math.log10(((oscB.vol + 80) / 160) * (oscB.blend));
                    }
                }

                if (['Blend', 'Detune', 'Unison'].includes(selectedKnob.label)) {
                    if (selectedKnob.osc == 'A') {
                        await drawWaveform(oscA, 'A');
                    }
                    else if (selectedKnob.osc == 'B') {
                        await drawWaveform(oscB, 'B');
                    }
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