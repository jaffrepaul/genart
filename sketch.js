const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [2048, 2048]
};

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = 'orange';
        context.fillRect(0, 0, width, height);

        context.beginPath();
        /*
         * args:
         * center point...aka -> x coor(width), y coor(height)
         * radius
         * start & end angle...aka -> how far around should the circle draw
         * movement direction -> true = clockwise, false = counterclockwise
         */
        context.arc(width / 2, height / 2, 200, 0, Math.PI * 2, false);
        context.fillStyle = 'white';
        // fill or stroke the arc
        context.fill();
    };
};

canvasSketch(sketch, settings);
