let app = new Vue({
    el: '#app',
    data: {
        knobs:
            [
                {
                    id: 0,
                    ocs: "B",
                    knobType: "updown",
                    label: 'Unison',
                    value: {
                        cur: 1,
                        low: 1,
                        high: 16
                    },
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
                {
                    id: 1,
                    ocs: "B",
                    knobType: "circle",
                    label: 'Detune',
                    rotation: -132,
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
                {
                    id: 2,
                    ocs: "B",
                    knobType: "circle",
                    label: 'Blend',
                    rotation: -132,
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
                {
                    id: 3,
                    ocs: "B",
                    knobType: "circle",
                    label: 'Pitch',
                    rotation: -132,
                    color: '#0060df',
                    active: true,
                    selected: false,
                },
            ],
        currentY: 0,
        mousemoveFunction: function (e) {
            let selectedKnob = app.knobs.filter(function (i) { return i.selected === true; })[0];

            if (selectedKnob) {
                // Knob Rotation
                if (e.pageY - app.currentY !== 0) { selectedKnob.rotation -= (e.pageY - app.currentY); }
                app.currentY = e.pageY;

                // Setting Max rotation
                if (selectedKnob.rotation >= 132) { selectedKnob.rotation = 132; }
                else if (selectedKnob.rotation <= -132) { selectedKnob.rotation = -132; }

                // Knob method to update parameters based on the know rotation
                // selectedKnob.method(selectedKnob.rotation, selectedKnob.modifier);
            }
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