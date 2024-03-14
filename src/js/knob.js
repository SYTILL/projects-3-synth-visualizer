let app = new Vue({
    el: '#app',
    data: {
        knobs:
            {
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
                    rotation: -132,
                    value: { cur: 2, low: 0, high: 48 },
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
                2: {
                    label: 'Blend',
                    osc: "B", knobType: "circle", row: "upper",
                    rotation: -132,
                    value: { cur: 1, low: 1, high: 16 },
                    color: '#0060df',
                    active: true, selected: false,
                },
                3: {
                    label: 'Pitch',
                    osc: "B", knobType: "circle", row: "upper",
                    rotation: -132,
                    value: { cur: 1, low: 1, high: 16 },
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
                    rotation: -132,
                    value: { cur: 2, low: 0, high: 48 },
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
                12: {
                    label: 'Blend',
                    osc: "A", knobType: "circle", row: "upper",
                    rotation: -132,
                    value: { cur: 1, low: 1, high: 16 },
                    color: '#0060df',
                    active: true, selected: false,
                },
                13: {
                    label: 'Pitch',
                    osc: "A", knobType: "circle", row: "upper",
                    rotation: -132,
                    value: { cur: 1, low: 1, high: 16 },
                    color: '#0060df',
                    active: true, selected: false,
                },
            },
        currentY: 0,
        mousemoveFunction: function (e) {
            let selectedKnob = Object.entries(app.knobs).filter(function (i) { return i[1].selected === true; })[0][1];

            if (selectedKnob) {
                console.log(selectedKnob);
                if (selectedKnob.knobType == "updown") {
                    app.updownCounter(selectedKnob.value, -(e.pageY - app.currentY) / 10);
                    app.currentY = e.pageY;
                }
                else {
                    // Knob Rotation
                    if (e.pageY - app.currentY !== 0) { selectedKnob.rotation -= (e.pageY - app.currentY); }
                    app.currentY = e.pageY;

                    // Setting Max rotation
                    if (selectedKnob.rotation >= 132) { selectedKnob.rotation = 132; }
                    else if (selectedKnob.rotation <= -132) { selectedKnob.rotation = -132; }

                    // Calculate value.cur based on rotation
                    let range = selectedKnob.value.high - selectedKnob.value.low;
                    let valueRange = 264; // 132 (max rotation) - (-132) (min rotation)
                    let rotationRatio = (selectedKnob.rotation + 132) / valueRange; // Normalize rotation to range [0, 1]
                    selectedKnob.value.cur = Math.round(selectedKnob.value.low + rotationRatio * range);

                    // Ensure value.cur stays within bounds
                    if (selectedKnob.value.cur > selectedKnob.value.high) {
                        selectedKnob.value.cur = selectedKnob.value.high;
                    } else if (selectedKnob.value.cur < selectedKnob.value.low) {
                        selectedKnob.value.cur = selectedKnob.value.low;
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
        unselectKnobs: function () {
            for (var i in this.knobs) { this.knobs[i].selected = false; }
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