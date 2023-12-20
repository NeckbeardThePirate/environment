const terrains = ['grass', 'grass', 'grass', 'grass', 'thick_grass', 'thick_grass', 'water'];

const waterCap = 150;
const thickGrassCap = 100;
let waterAdj = false;
let map = new Array(100);
let waterNum = 0;
let thickGrassNum = 0;
for (let i = 0; i < map.length; i++) {
  map[i] = new Array(100);
}
let waterUp;
let waterLeft;
let waterLengthCount = 0;
let waterWidthCount = 0;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (0<i) {
        waterLeft = map[i - 1][j] === 'water'
    } if (0< j) {
        waterUp = map[i][j - 1] === 'water'
    }
    // if (map[i][j])
    const leftEdge = i <= 5;
    const rightEdge = 95 <= i;
    const topEdge = j <= 5;
    const bottomEdge = 95 <= j;
    if (waterCap <= waterNum || leftEdge || rightEdge || topEdge || bottomEdge) {
        if (thickGrassCap <= thickGrassNum) {
            map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 3))];
        }
        map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
    } else {
        if (waterUp || waterLeft) {
            if (waterLengthCount >= 8) {
                map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
                waterLengthCount = 0;
            } else {
                map[i][j] = 'water'
            }
        } else {
            map[i][j] = terrains[Math.floor(Math.random() * terrains.length)];
        }
    }
    if (map[i][j] === 'water') {
        waterNum++
        waterLengthCount++
        waterWidthCount++
    }//TODO Needs to not generate a longth thick line of water, but we'll get there.
  }
}

// Phaser game configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: {
        preload: preload,
        create: create
    }
};

// Create the Phaser game
let game = new Phaser.Game(config);

function preload() {
    // Preload your images
    this.load.image('water', 'assets/water.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('thick_grass', 'assets/thick_grass.png');
}

function create() {
    // Render the map in Phaser
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            // Add an image for each cell
            let image = this.add.image(i * 8, j * 8, map[i][j]);
            image.setOrigin(0, 0);
        }
    }
}