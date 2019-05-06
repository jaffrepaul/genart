const canvasSketch = require('canvas-sketch');
/* lerp = linear interpolation -> give grid a margin using 
min,max bounds & a num between min&max */
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [2048, 2048]
};

const sketch = () => {
    const createGrid = () => {
        const points = [];
        const count = 40;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                points.push({
                    radius: Math.abs(random.gaussian() * 0.01),
                    position: [u, v]
                });
            }
        }
        return points;
    };

    /*
     * set deterministic seed (randomization value) so abstract pattern persists
     * on page refresh, must be set before using random module
     * then, create grid & randomly pull out cells for abstract pattern ->
     * use random module to work with setSeed, otherwise pattern will be truly
     * random on every page refresh with native Math.random()
     */
    random.setSeed(10);
    const points = createGrid().filter(() => random.value() > 0.5);
    const margin = 400;

    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        points.forEach(data => {
            // destructure vals from data obj, then coordinates from position
            const { radius, position } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, width - margin, v);

            context.beginPath();
            context.arc(x, y, radius * width, 0, Math.PI * 2, false);
            context.strokeStyle = 'black';
            context.lineWidth = 10;
            context.fillStyle = 'red';
            context.fill();
        });
    };
};

canvasSketch(sketch, settings);
