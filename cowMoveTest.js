let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
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
                quantity = 10;
                color = 0x339966;
            } else if (terrainType <= 8) {
                name = 'thick_grass'
                type = 'grass'
                quantity = 100;
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
                console.log(square)
        }
    }
    for (let i = 1; i <= initialCows; i++) {
        let t = 0
        ////console.log(mapGroup)
        let grassSquare = false;
        while (!grassSquare) {
            startingLocationX = Math.floor(Math.random()*1000);
            startingLocationY = Math.floor(Math.random()*1000);
            const squareAtLocation = getSquareAt(startingLocationX, startingLocationY)
            if (squareAtLocation.name === 'light_grass') {
                grassSquare = true;
            }
            t++
            if (t > 300) {
                ////console.log('something went wrong')
                return 
            }
        }
        ////console.log('grass found!', startingLocationX, startingLocationY)
        createCow(`${cows++}`, startingLocationX, startingLocationY);
    }
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
    cow.setCollideWorldBounds(true);
    cow.cowId = id;
    cow.food = 8000;
    cow.age = 0;
    cow.knownFood = [];
    cow.movingToFood = false;
    cow.eating = false;
    cow.moving = false;
    cow.hunger = 0;
    cow.satisfied = false;
    cow.children = 0;
    cow.foodHeading = [];
    cow.foodPicked = false;
    cow.closestFood = [];
}

function killCow(cow, causeOfDeath) {
    console.error(`cow ${cow.cowId} died from ${causeOfDeath}`)
    cow.destroy()
}

function moveCowLeft(cow) {
    cow.setVelocityX(-100)
    cow.food -= 3
}

function moveCowRight(cow) {
    cow.setVelocityX(100)
    cow.food -= 3
}

function moveCowUp(cow) {
    cow.setVelocityY(-100)
    cow.food -= 3
}

function moveCowDown(cow) {
    cow.setVelocityY(100)

    cow.food -= 3
}

function findDistance(startX, startY, endX, endY) {
    let distanceY;
    let distanceX;
    if (endX < startX) {
        distanceX = startX - endX;
    } else if (startX < endX) {
        distanceX = endX - startX
    }
    if (endY < startY) {
        distanceY = startY - endY;
    } else if (startY < endY) {
        distanceY = endY - startY
    }

    return distanceY + distanceX
}



function cowLookForFood(cow) {
    const searchRadius = 500;
    for (let dx = -searchRadius; dx <= searchRadius; dx += 100) {
        for (let dy = -searchRadius; dy <= searchRadius; dy += 100) {
            const targetX = Math.floor(cow.x / 100) + dx;
            const targetY = Math.floor(cow.y / 100) + dy;
            let square = getSquareAt(targetX, targetY);
            if (square && square.name === 'thick_grass') {
                const foodX = targetX;
                const foodY = targetY;
                cow.knownFood = [...cow.knownFood, [foodX, foodY]];
            }
        }
    }
    cowPickFoodSource(cow);
}

function cowPickFoodSource(cow) {
    for (let i = 0; i < cow.knownFood.length; i++) {
        if (cow.foodHeading.length === 0) {
            cow.foodHeading = [cow.knownFood[i][0], cow.knownFood[i][1]];
        }
        // console.log('IS THIS UNDEFINED: ',cow.knownFood[i][0])
        let currentDistance = findDistance(cow.x, cow.y, cow.foodHeading[0], cow.foodHeading[1])
        let newDistance = findDistance(cow.x, cow.y, cow.knownFood[i][0], cow.knownFood[i][1])
        if (newDistance < currentDistance) {
            cow.foodHeading = [cow.knownFood[i][0], cow.knownFood[i][1]];

        }
    }
    cow.movingToFood = true;


    // // cow.foodHeading = [cow.closestFood[0], cow.closestFood[1]]
    // console.log('picked: ', cow.foodHeading);


    // let foodArrSpot = Math.floor(Math.random() * 100);
    
    // // Create a copy of the knownFood array
    // const knownFoodCopy = [...cow.knownFood];

    // if (knownFoodCopy.length > 0) {
    //     // Check if foodArrSpot is within the bounds of the array
    //     if (foodArrSpot >= knownFoodCopy.length) {
    //         foodArrSpot = knownFoodCopy.length - 1;
    //     }

    //     cow.foodHeading = [knownFoodCopy[foodArrSpot][0], knownFoodCopy[foodArrSpot][1]];
    //     // console.log(knownFoodCopy[0]);
    //     cow.movingToFood = true;
    // } else {
    //     killCow(cow, 'failed to see food');
    // }
}

function cowMoveTowardFood(cow) {
    // console.log('moving to food')
    if (cow.x < (cow.foodHeading[0])) {
        moveCowRight(cow)
    } if (cow.x > (cow.foodHeading[0])) {
        moveCowLeft(cow)
    } if (cow.y < (cow.foodHeading[1])) {
        moveCowDown(cow)
    } if (cow.y > (cow.foodHeading[1])) {
        moveCowUp(cow)
    } else {
        const cowPosition = getSquareAt(cow.x, cow.y);
        if (cowPosition.name === 'thick_grass') {
            cow.setVelocityX(0);
            cow.setVelocityY(0);
            // console.log(`cow ${cow.cowId} is at the food`)
            cow.movingToFood = false;
            cow.eating = true;
            cow.foodHeading = [];
            cow.knownFood = [];
            cow.foodPicked = false;
        } else {
            // console.log(`cow ${cow.cowId} arrived and there was no food at `, cow.x, cow.y)
            cow.knownFood = [];
            cow.eating = false;
            cow.foodHeading = [];
            cow.foodPicked = false;
            cow.movingToFood = false;
        }
    }
}


function update() {

    if (gameOver) {
        return;
    }

    if (cowGroup.countActive(true) === 0) {
        gameOver = true;
        ////console.log("Game Over!");
    }

    mapGroup.children.iterate(function(square) {
        if (square.name === 'water') {
            square.data.list.water +=2;
        } else if (square.name === 'thick_grass') {
            square.data.list.grass +=2;
            if (square.data.list.grass < 500) {
                square.setName('light_grass')
                square.fillColor = 3381606;
                console.log('this square is now low on grass')
            }
        } else if (square.name === 'light_grass') {
            square.data.list.grass +=2;
            if (square.data.list.grass > 1500) {
                square.setName('thick_grass');
                square.fillColor = 19712;
            }
        }
    })
    cowGroup.children.iterate(function(cow) {
        if (cow !== undefined) {
            cow.food -= 4;
            cow.age++;
            if (cow.age > 50000) {
                killCow(cow, 'being a boomer');
            }
            if (cow.food <= 0) {
                killCow(cow, 'lack of food');
            }
            cow.hunger = Math.floor(cow.food / 1000);
            if (cow.eating) {
                const cowLocation = getSquareAt(cow.x, cow.y)
                if (cowLocation.data.list.grass > 50) {
                    cow.food += 50;
                    cowLocation.data.list.grass -= 50;
                } else {
                    cow.knownFood = [];
                    cow.eating = false;
                    cow.foodHeading = [];
                    cow.foodPicked = false;
                    cow.movingToFood = false;
                }
                // console.log('cow eating')
            }
            if (cow.hunger <= 10 && !cow.eating) {
                const cowLocation = getSquareAt(cow.x, cow.y);
                if (cowLocation.name === 'thick_grass') {
                    cow.eating = true;
                    cow.movingToFood = false;
                    cow.heading = []
                    cow.knownFood = [];
                    // console.log('cow is on food game will now end')
                    cow.setVelocityX(0);
                    cow.setVelocityY(0);
                    return
                }
                if (!cow.movingToFood) {
                        cowLookForFood(cow);
                        // console.log('cow just looked for food')
                        cowPickFoodSource(cow);
                        // console.log('cow just picked a food source')


                } else {
                    cowMoveTowardFood(cow);
                    // console.log('cow just moved towards food')
                    //console.log(`cow ${cow.cowId} moving towards: `, cow.foodHeading)
                    //console.log(cow)
                }
            }
    
             if (cow.eating && cow.food >= 30000) {
                    cow.eating = false;
                    cow.foodHeading = [];
                    //console.log('cow is full')
                }
    
                if (!cow.eating && !cow.movingToFood && 10000 < cow.age && cow.age < 80000) {
                    const chanceToReproduce = Math.floor(Math.random() * 10000);
                    if (chanceToReproduce < 10 && cow.children <= 5) {
                        createCow(`${cows++}`, cow.x, cow.y);
                        //console.log(cowGroup.children.entries.length);
                    } else if (chanceToReproduce < 3) {
                        killCow(cow, 'overpopulation');
                        //console.log('WATER:', waterAvailable);
                    }
                }
                cow.knownFood = []
            }
            // if (cow.eating) {
            //     gameOver = true;
            // }
    });

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

//SUBTRACTED THE + 50'S FROM THE FOODX AND FOODY WHEN THEY ARE SET