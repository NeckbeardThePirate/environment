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

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false 
        }
    },
};

let game = new Phaser.Game(config);
let cowGroup;
let cows = 0;
let gameOver = false;
function preload() {
    this.load.image('water', 'assets/water.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('thick_grass', 'assets/thick_grass.png');
    this.load.spritesheet('cow', 'assets/1cow.png', { frameWidth: 32, frameHeight: 32 })
}

function create() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let image = this.add.image(i * 8, j * 8, map[i][j]);
            image.setOrigin(0, 0);
        }
    }
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 800, 600);
    cowGroup = this.physics.add.group();
    createCow(`${cows++}`, 100, 100);
    createCow(`${cows++}`, 200, 200);
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');

    cow.setCollideWorldBounds(true);
    cow.cowId = id;
    cow.food = 10;
}

function killCow(id) {
    const cowToKill = cowGroup.getFirst(function (cow) {
        return cow.cowId === id;
    }, this)
    if (cowToKill) {
        console.log(`killing cow with id: ${id}`)
        cowToKill.disableBody(true, true)
        cowToKill.destroy(true);
        cowGroup.remove(cowToKill, true);
        cowToKill.setActive(false)
        console.log(`killed cow with id: ${id}`)
    }
}


function update() {

    if (gameOver) {
        return;
    }

    cowGroup.children.iterate(function(cow) {
        cow.food--;
        if (cow.food <= 0) {
            killCow(cow.cowId)
        }
    })
    if (cowGroup.countActive(false) === 0) {
        gameOver = true;
        console.log("Game Over!");
    }
}