const terrains = ['grass', 'grass', 'grass', 'grass', 'thick_grass', 'thick_grass', 'water'];

// const waterCap = 150;
const waterCap = 10;
const thickGrassCap = 15;
// const thickGrassCap = 150;
let waterAdj = false;
// let map = new Array(100);
let map = new Array(10);
let waterNum = 0;
let thickGrassNum = 0;
for (let i = 0; i < map.length; i++) {
//   map[i] = new Array(100);
  map[i] = new Array(10);
}
let chanceOfWater = 25;
let bodiesOfWater = 0;
let waterMap = [];
let waterUp;
let waterLeft;
let waterLengthCount = 0;
let waterWidthCount = 0;
// const maxCows = 40;
let waterAvailable = 10000;
let foodAvailable = 18000;


let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    scene: {
        preload: preload,
        create: create,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        }
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

let game = new Phaser.Game(config);

let updateInterval = 25000 / 1;

let cowGroup;
let cows = 0;
let gameOver = false;
let initialCows = 12;
let mapGroup;
function preload() {
    this.load.image('water', 'assets/water.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('thick_grass', 'assets/thick_grass.png');
    this.load.spritesheet('cow', 'assets/1cow.png', { frameWidth: 32, frameHeight: 32 })
}

function create() {
    // for (let i = 0; i < map.length; i++) {
    //     for (let j = 0; j < map[i].length; j++) {
    //         let image = this.add.image(i * 100, j * 100, map[i][j]);
    //         image.setOrigin(0, 0);
    //     }
    // }
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 1000, 1000);
    cowGroup = this.physics.add.group();
    

    mapGroup = this.add.group();
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let terrainType = Math.floor(Math.random()*10)
            if (terrainType <= 5) {
                const square = this.add.rectangle(i * 100, j * 100, 100, 100, 0x339966);
                square.setOrigin(0, 0);
                square.setName('light_grass');
                square.setData('grass', 100);
                mapGroup.add(square);

            } else if (terrainType <= 8) {
                const square = this.add.rectangle(i * 100, j * 100, 100, 100, 0x004d00);
                square.setOrigin(0, 0);
                square.setData('grass', 1000);
                square.setName('thick_grass');
                mapGroup.add(square);

            } else {
                const square = this.add.rectangle(i * 100, j * 100, 100, 100, 0x6699ff);
                square.setData('water', 1000);
                square.setOrigin(0, 0);
                square.setName('water');
                mapGroup.add(square);
                console.log(square)
                
            }
        }
    }
    for (let i = 1; i <= initialCows; i++) {
        // let startingLocationX = Math.floor(Math.random()*100);
        // let startingLocationY = Math.floor(Math.random()*100);
        let t = 0
        console.log(mapGroup)
        let grassSquare = false;
        while (!grassSquare) {
            startingLocationX = Math.floor(Math.random()*100);
            startingLocationY = Math.floor(Math.random()*100);
            const squareAtLocation = getSquareAt(startingLocationX*10, startingLocationY*10)
            if (squareAtLocation.name === 'light_grass') {
                grassSquare = true;
            }
            console.log('HERE: ', squareAtLocation.name)
            // console.log(map[startingLocationX*10][startingLocationY*10], startingLocationY, startingLocationX)
            t++
            if (t > 300) {
                console.log('something went wrong')
                return 
            }
        }
        console.log('grass found!', startingLocationX, startingLocationY)
        createCow(`${cows++}`, startingLocationX*10, startingLocationY*10);
    }
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
    console.log('cow created', cow.x, cow.y)
    console.log(cow)
    cow.tabIndex = 1;
    cow.setCollideWorldBounds(true);
    cow.cowId = id;
    cow.food = 8000;
    cow.age = 0;
    cow.water = 20000;
    cow.drinking = false;
    cow.movingToWater = false;
    cow.knownWater = [];
    cow.knownFood = [];
    cow.movingToFood = false;
    cow.eating = false;
    cow.moving = false;
    cow.hunger = 0;
    cow.thirst = 0;
    cow.satisfied = false;
    cow.children = 0;
    cow.wandering = false;
    cow.wanderDistance = 0;
    cow.wanderDirection = 0;
    cow.waterHeading = [];
    cow.waterPicked = false;
    cow.foodHeading = [];
    cow.foodPicked = false;
    cow.closestWater = [];
    cow.currentDistance = 0;
}


function getSquareAt(x, y) {
    // Iterate through the map squares and find the one that corresponds to the given coordinates
    for (let i = 0; i < mapGroup.getChildren().length; i++) {
        const square = mapGroup.getChildren()[i];

        if (square.getBounds().contains(x, y)) {
            return square;
        }
    }

    // Return null if no square is found at the given coordinates
    return null;
}

function getSquareInfo() {
        for (let square in mapGroup) {
        console.log(square)
    }
}

getSquareInfo()