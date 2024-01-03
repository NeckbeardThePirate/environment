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
            debug: true
        }
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

let game = new Phaser.Game(config);


//Paramaters or something, some guy told me I should do it
const updateInterval = 25000 / 1;

let startingCowFood = 12000;

let startingCowWater = 16000;

const waterUpdateLevel = 50;

const grassUpdateLevel = 10;

const lightGrassThreshold = 500;

const thickGrassThreshold = 5000;

const defaultMovementFoodLoss = 4;

const defaultMovementWaterLoss = 3;

const defaultBaseFoodLoss = 3;

const defaultBaseWaterLoss = 2;

const defaultVelocity = 50;

const defaultMudThreshold = 500;

const defaultWaterThreshold = 5000;

const defaultCowFoodGain = 50;

const defaultCowWaterGain = 50;

const initialWaterLevel = 2000;

const initialThickGrassLevel = 2000;

const initialLightGrassLevel = Phaser.Math.Between(0, 1000);

const initialCows = 10;



// Other initializations

let cowGroup;
let cows = 0;
let gameOver = false;
let mapGroup;


function preload() {
    this.load.image('water', 'assets/water.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('thick_grass', 'assets/thick_grass.png');
    this.load.spritesheet('cow', 'assets/1cow.png', { frameWidth: 32, frameHeight: 32 })
}

//initalize all starting entities
function create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 1000, 1000);

    //assign and create cowGroup for entities
    cowGroup = this.physics.add.group();
    

    //build out the map and the 'identities' of each square
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
                quantity = initialLightGrassLevel;
                color = 0x339966;
            } else if (terrainType <= 8) {
                name = 'thick_grass'
                type = 'grass'
                quantity = initialThickGrassLevel;
                color = 0x004d00;
            } else {
                name = 'water'
                type = 'water'
                quantity = initialWaterLevel;
                color = 0x6699ff;
            }
                const square = this.add.rectangle(i * 100, j * 100, 100, 100, color);
                square.setOrigin(0, 0);
                square.setName(name);
                square.setData(type, quantity);
                mapGroup.add(square);
        }
    }

    //create all the initial cows
    for (let i = 1; i <= initialCows; i++) {
        let t = 0
        let grassSquare = false;
        //make sure they spawn on a light grass square
        while (!grassSquare) {
            //randomize starting location
            startingLocationX = Math.floor(Math.random()*1000);
            startingLocationY = Math.floor(Math.random()*1000);
            const squareAtLocation = getSquareAt(startingLocationX, startingLocationY)
            if (squareAtLocation.name === 'light_grass') {
                grassSquare = true;
            }
            t++
            //Safety trigger, things happen
            if (t > 300) {
                console.log('something went wrong')
                return 
            }
        }
        createCow(cows++, startingLocationX, startingLocationY);
    }
    startingCowFood = 6000;
    startingCowWater = 3500;
}
//set default parameters and cows
function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
    cow.setCollideWorldBounds(true);
    cow.cowId = id;
    cow.age = 0;

    cow.water = startingCowWater;
    cow.drinking = false;
    cow.movingToWater = false;
    cow.knownWater = [];
    cow.waterHeading = [];
    cow.isThirsty = false;


    cow.food = startingCowFood;
    cow.eating = false;
    cow.movingToFood = false;
    cow.knownFood = [];
    cow.foodHeading = [];
    cow.isHungry = false;

    
    cow.children = 0;
    cow.wanderDistance = 0;
    cow.wanderDirection = 0;
}

function killCow(cow, causeOfDeath) {
    console.error(`cow ${cow.cowId} died from ${causeOfDeath}`)
    cow.destroy()
}

function moveCowLeft(cow) {
    cow.setVelocityX(-defaultVelocity)
    cow.food -= defaultBaseFoodLoss;
    cow.water -= defaultBaseWaterLoss;
}

function moveCowRight(cow) {
    cow.setVelocityX(defaultVelocity)
    cow.food -= defaultBaseFoodLoss;
    cow.water -= defaultBaseWaterLoss;
}

function moveCowUp(cow) {
    cow.setVelocityY(-defaultVelocity)
    cow.food -= defaultBaseFoodLoss;
    cow.water -= defaultBaseWaterLoss;
}

function moveCowDown(cow) {
    cow.setVelocityY(defaultVelocity)
    cow.food -= defaultBaseFoodLoss;
    cow.water -= defaultBaseWaterLoss;
}

function findDistance(startX, startY, endX, endY) {
    let distanceY = Math.abs(endY - startY);
    let distanceX = Math.abs(endX - startX);

    return distanceY + distanceX;
}

function cowLookForWater(cow) {
    //set searchDistance 500px === 5 squares
    const searchRadius = 500;
    const gridPositions = [];
    //step by 100 because squares are 100 pixels
    for (let dx = -searchRadius; dx <= searchRadius; dx += 100) {
        for (let dy = -searchRadius; dy <= searchRadius; dy += 100) {
            gridPositions.push({ dx, dy });
        }
    }
    //grab the absolute position for a set of coordinates by adding the dy and dy and the cow's xy position
    for (const { dx, dy } of gridPositions) {
        
        const targetX = Math.floor(cow.x) + dx;
        
        const targetY = Math.floor(cow.y) + dy;
        
        const square = getSquareAt(targetX, targetY);
        
        if (square && square.name === 'water') {
            cow.knownWater = [...cow.knownWater, [targetX, targetY]];
        }
    }

    cowPickWaterSource(cow);
}

function cowPickWaterSource(cow) {
    if (cow.knownWater.length > 0) {
        let holderHeading = [cow.knownWater[0][0], cow.knownWater[0][1]];
        let closestDistance = findDistance(cow.x, cow.y, holderHeading[0], holderHeading[1]);
        //identify each distance and compare to see if it is close and set the temp holder if it's closer
        for (let i = 1; i < cow.knownWater.length; i++) {
            let newDistance = findDistance(cow.x, cow.y, cow.knownWater[i][0], cow.knownWater[i][1]);

            if (newDistance < closestDistance) {
                holderHeading = [cow.knownWater[i][0], cow.knownWater[i][1]];
                closestDistance = newDistance;
            }
        }
        //set their heading to the closest set of coordinates
        cow.waterHeading = holderHeading;
        cow.movingToWater = true;
        // console.warn('Water source picked for cow:', cow.cowId, cow.waterHeading);
        cowMoveTowardWater(cow);
    } else {
        console.warn('No known water sources for cow:', cow.cowId);
    }
}

function cowMoveTowardWater(cow) {
    
    if (cow.x < (cow.waterHeading[0])) {
        moveCowRight(cow)
    } else if (cow.x > (cow.waterHeading[0])) {
        moveCowLeft(cow)
    }  if (cow.y < (cow.waterHeading[1])) {
        moveCowDown(cow)
    }  else if (cow.y > (cow.waterHeading[1])) {
        moveCowUp(cow)
    }
    //check position and if they have arrived at water stop movement and set status to drinking
    const cowPosition = getSquareAt(cow.x, cow.y)
    if (cowPosition.name === 'water') {
        cow.setVelocityX(0);
        cow.setVelocityY(0);
        cow.drinking = true;
        cow.waterHeading = [];
        cow.movingToWater = false;
    }

    //HANDLE SITUATIONS  WHERE THE COW ARRIVES AND THE WATER IS ALL GONE

    const destinationSquare = getSquareAt(cow.waterHeading[0], cow.waterHeading[1])

    if (destinationSquare && destinationSquare.name === 'mudpit') {
        cow.movingToWater = false;
        cow.waterHeading = [];
        cow.setVelocityX(0);
        cow.setVelocityY(0);
        cow.isThirsty = false;
    }
}


//COW WANDER MECHANISM  

function cowWander(cow) {
    if (cow.wandering === false) {
        cow.wandering = true;
        const wanderDirection = Phaser.Math.Between(0, 4)
    }
}






//all of the food functions are all functionally identical to the water ones need to parameterize so it's all the same


function cowLookForFood(cow) {

    const searchRadius = 500;
    const gridPositions = [];

    for (let dx = -searchRadius; dx <= searchRadius; dx += 100) {
        for (let dy = -searchRadius; dy <= searchRadius; dy += 100) {

            gridPositions.push({ dx, dy})
        }
    }
    for( const { dx, dy } of gridPositions) {
        
        const targetX = Math.floor(cow.x) + dx;
        
        const targetY = Math.floor(cow.y) + dy;
        
        const square = getSquareAt(targetX, targetY);

        if (square && square.name === 'thick_grass') {
            cow.knownFood = [...cow.knownFood, [targetX, targetY]];
        }
    }

    cowPickFoodSource(cow);
}


function cowPickFoodSource(cow) {
    if (cow.knownFood.length > 0) {
        let tempHeading = [cow.knownFood[0][0], cow.knownFood[0][1]]
        let closestDistance = findDistance(cow.x, cow.y, tempHeading[0], tempHeading[1])

        for(let i = 1; i < cow.knownFood.length; i++) {
            let newDistance = findDistance(cow.x, cow.y, cow.knownFood[i][0], cow.knownFood[i][1])
            if (newDistance < closestDistance) {
                tempHeading = [cow.knownFood[i][0], cow.knownFood[i][1]];
                closestDistance = newDistance;
            }
        }
        cow.foodHeading = tempHeading;
        cow.movingToFood = true;

        cowMoveTowardFood(cow);
    } else {
        console.warn('No known food sources for cow: ', cow.cowId)
        // cowLookForFood(cow)
        killCow(cow, 'being blind')
    }
}


function cowMoveTowardFood(cow) {
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
            cow.movingToFood = false;
            cow.eating = true;
            cow.foodHeading = [];
            cow.knownFood = [];
            cow.foodPicked = false;
        }

        const destinationSquare = getSquareAt(cow.foodHeading[0], cow.foodHeading[1])
    
        if (destinationSquare.name === 'light_grass') {
            cow.movingToFood = false;
            cow.foodHeading = [];
            cow.setVelocityX(0);
            cow.setVelocityY(0);
            cow.isHungry = false;
        }
    }
}









//main game cycle


function update() {

    if (gameOver) {
        return;
    }

    if (cowGroup.countActive(true) === 0) {
        gameOver = true;
        console.log("Game Over!");
    }
    //iterate through the mapGroup updating each child with knew name and color vlaues based off the current amount of their given resource
    //and adding their base level of resource
    mapGroup.children.iterate(function(square) {
        if (square.name === 'water') {
            if (square.data.list.water < defaultMudThreshold) {
                square.setName('mudpit');
                square.fillColor = 9127187;
            }
            square.data.list.water += waterUpdateLevel;
        } else if (square.name === 'thick_grass') {
            if (square.data.list.grass < 15000) {
                square.data.list.grass += grassUpdateLevel;
                if (square.data.list.grass < lightGrassThreshold) {
                    square.setName('light_grass')
                    square.fillColor = 3381606;
                }
            }
        } else if (square.name === 'light_grass') {
            //trying it out with a random value, don't hate me for not parameterizing this one
            let gainAmount = Phaser.Math.Between(0, 1000)
            square.data.list.grass += Math.floor(gainAmount/200);
            if (square.data.list.grass > thickGrassThreshold) {
                square.setName('thick_grass');
                square.fillColor = 19712;
            }
        } else if (square.name === 'mudpit') {
            square.data.list.water += waterUpdateLevel;
            if (square.data.list.water > defaultWaterThreshold) {
                square.setName('water');
                square.fillColor = 6724095;
            }
        }
    })


    cowGroup.children.iterate(function(cow) {
        if (cow !== undefined) {
            //update cow food and water levels
            cow.food -= defaultBaseFoodLoss;
            cow.water -= defaultBaseWaterLoss;
            cow.age++;
            //check death conditions
            if (cow.age > 50000) {
                killCow(cow, 'being a boomer');
                return
            }
            if (cow.food <= 0) {
                killCow(cow, 'lack of food');
                return
            }
            if (cow.water <= 0) {
                killCow(cow, 'thirst');
                return
            }
            //set values to make math easy for determining thirst and hunger
            cow.thirst = Math.floor(cow.water / 1000);
            cow.hunger = Math.floor(cow.food / 1000);
            if (cow.drinking) {
                //if the available water is there cow gets water and water hole loses water
                const cowPosition = getSquareAt(cow.x, cow.y)
                if (cowPosition.data.list.water > 50) {
                    cow.water += defaultCowWaterGain;
                    cowPosition.data.list.water -= defaultCowWaterGain;
                } else {
                    //reset all cow parameters, some of these may be unnecessary needs reworking
                    cow.knownWater = [];
                    cow.drinking = false;
                    cow.waterHeading = [];
                    cow.movingToWater = false;
                    cow.isThirsty = false;
                }
            }

            //similar to drinking. needs update
            if (cow.eating) {
                const cowLocation = getSquareAt(cow.x, cow.y)
                if (cowLocation.data.list.grass > 50) {
                    cow.food += defaultCowFoodGain;
                    cowLocation.data.list.grass -= defaultCowFoodGain;
                } else {
                    cow.knownFood = [];
                    cow.eating = false;
                    cow.foodHeading = [];
                    cow.movingToFood = false;
                    cow.isHungry = false;
                }
            }

            //if cow needs water start the water loop, by setting the cow.isThristy flag. else move it towards the water
            if (cow.thirst <= 10 && !cow.isHungry && !cow.drinking) {
                if (cow.isThirsty) {
                    // console.log('moving', cow.isThirsty, cow.drinking)
                    cowMoveTowardWater(cow)
                } else {
                    // console.log('looking', cow.isThirsty, cow.drinking)
                    cow.isThirsty = true;
                    cowLookForWater(cow);
                }
            }

            //similar for food,, needs update

            if (cow.hunger <= 10 && !cow.eating && !cow.isThirsty && !cow.drinking) {
                const cowLocation = getSquareAt(cow.x, cow.y);
                if (cowLocation.name === 'thick_grass') {
                    cow.eating = true;
                    cow.movingToFood = false;
                    cow.foodHeading = []
                    cow.knownFood = [];
                    cow.setVelocityX(0);
                    cow.setVelocityY(0);
                    return
                }
                if (!cow.movingToFood && !cow.eating) {
                        cowLookForFood(cow);
                        cowPickFoodSource(cow);


                } else {
                    cowMoveTowardFood(cow);
                }
            }
            
            //check for conditions where the cow would be satisfied.
            if (cow.drinking && cow.water >= 20000) {
                cow.isThirsty = false;
            } else if (cow.eating && cow.food >= 20000) {
                cow.isHungry = false;
            }else if (cow.eating && cow.food >= 30000) {
                cow.eating = false;
            }
            if (cow.drinking && cow.water >= 30000) {
                cow.drinking = false;
            }

            //allow the opportunity to reproduce if they're not doing anything else

            if (!cow.drinking && !cow.eating && !cow.movingToWater && !cow.movingToFood && 1000 < cow.age && cow.age < 80000) {
                const chanceToReproduce = Math.floor(Math.random() * 10000);
                //NEED TO CHANGE TO MORE REASONABLE NUMBERS THESE HAVE BEEN EDITED FOR TESTING PURPOSES
                if (chanceToReproduce < 3 && cow.children <= 5) {
                    createCow(cows++, cow.x, cow.y);
                    cow.food -= 7500;
                    cow.water -= 4500;
                    console.log(cowGroup.children.entries.length);
                } else if (chanceToReproduce < 2) {
                    killCow(cow, 'overpopulation');
                }
            }
        }
        
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