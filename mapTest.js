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
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 1000, 1000);
    cowGroup = this.physics.add.group();
    

    mapGroup = this.add.group();
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let terrainType = Math.floor(Math.random()*10)
            let name;
            let type;
            let quantity;
            let color;
            if (terrainType <= 5) {
                name = 'light_grass'
                type = 'grass'
                quantity = 1000;
                color = 0x339966;
            } else if (terrainType <= 8) {
                name = 'thick_grass'
                type = 'grass'
                quantity = 10000;
                color = 0x004d00;
            } else {
                name = 'water'
                type = 'water'
                quantity = 10000;
                color = 0x6699ff;
            }
                const square = this.add.rectangle(i * 100, j * 100, 100, 100, color);
                square.setOrigin(0, 0);
                square.setName(name);
                square.setData(type, quantity);
                mapGroup.add(square);
        }
    }
    for (let i = 1; i <= initialCows; i++) {
        let t = 0
        console.log(mapGroup)
        let grassSquare = false;
        while (!grassSquare) {
            startingLocationX = Math.floor(Math.random()*1000);
            startingLocationY = Math.floor(Math.random()*1000);
            const squareAtLocation = getSquareAt(startingLocationX, startingLocationY)
            if (squareAtLocation.name === 'light_grass') {
                grassSquare = true;
            }
            console.log('HERE: ', squareAtLocation.name)
            t++
            if (t > 300) {
                console.log('something went wrong')
                return 
            }
        }
        console.log('grass found!', startingLocationX, startingLocationY)
        createCow(`${cows++}`, startingLocationX, startingLocationY);
    }
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
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
