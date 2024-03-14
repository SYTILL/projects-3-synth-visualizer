let app = new Vue({
    el: '#app',
    data: {
        knobs: [
            {
                id: 0,
                label: 'Test Knob',
                rotation: -132,
                color: '#FA9C34',
                active: true,
                selected: false,
                style: 1
            },
            {
                id: 2,
                label: 'Test Knob 3',
                rotation: -132,
                color: '#ED31A2',
                active: true,
                selected: false,
                style: 3
            },
            {
                id: 4,
                label: 'Test Knob 5',
                rotation: -132,
                color: '#23CDE8',
                active: true,
                selected: false,
                style: 2
            }, 
        ],
        currentY: 0,
        mousemoveFunction: function(e) {
            let selectedKnob = app.knobs.filter(function(i){return i.selected === true;})[0];
            
            if(selectedKnob) {
                // Knob Rotation
                if(e.pageY - app.currentY !== 0) { selectedKnob.rotation -= (e.pageY - app.currentY); }
                app.currentY = e.pageY;
                
                // Setting Max rotation
                if(selectedKnob.rotation >= 132) { selectedKnob.rotation = 132; } 
                else if(selectedKnob.rotation <= -132) { selectedKnob.rotation = -132; }
                
                // Knob method to update parameters based on the know rotation
                // selectedKnob.method(selectedKnob.rotation, selectedKnob.modifier);
            }
        },
    },
    methods: {
        unselectKnobs: function() {
            for(var i in this.knobs) { this.knobs[i].selected = false; }
        }
    }
});
window.addEventListener('mousemove', app.mousemoveFunction);