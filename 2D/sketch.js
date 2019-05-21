const canvasSketch = require('canvas-sketch');
/* lerp = linear interpolation -> give grid a margin using 
min,max bounds & a num between min&max */
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
    dimensions: [2048, 2048]
};

const sketch = () => {
    /* set count range
     * pick a shuffled palette
     * remove some numbers for increased control over randomization
     */
    const colorCount = random.rangeFloor(2, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    const createGrid = () => {
        const points = [];
        const count = 40;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                const radius = Math.abs(random.noise2D(u, v)) * 0.1;
                points.push({
                    radius: radius,
                    position: [u, v],
                    color: random.pick(palette),
                    rotation: random.noise2D(u, v)
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
    // random.setSeed(10);
    const points = createGrid().filter(() => random.value() > 0.5);
    const margin = 400;

    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        points.forEach(data => {
            // destructure vals from data obj, then coordinates from position
            const { radius, position, color, rotation } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, width - margin, v);

            /* canvas is state-based, so...
             * save context
             * translate from grid coordinates
             * rotate at random value before drawing
             * fill text with character & set back to 0 point
             * restore back to original state
             */
            context.save();
            context.fillStyle = color;
            context.font = `${radius * width}px "Helvetica"`;
            context.translate(x, y);
            context.rotate(rotation);
            context.fillText('=', 0, 0);

            context.restore();
        });
    };
};

canvasSketch(sketch, settings);
