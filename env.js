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


//Paramaters or something, some guy told me I should do it
const updateInterval = 25000 / 1;

let startingWolfFood = 12500;

let startingWolfWater = 100000;

let startingCowFood = 12000;

let startingCowWater = 15000;

const waterUpdateLevel = 50;

const grassUpdateLevel = 7;

const lightGrassThreshold = 500;

const thickGrassThreshold = 5000;

const defaultWolfFoodLoss = 1;

const defaultWolfWaterLoss = 1;

const defaultWolfMovementFoodLoss = 1;

const defaultWolfMovementWaterLoss = 1;

const defaultWolfRunWaterLoss = 8;

const defaultWolfRunFoodLoss = 8;

const wolfWalkSpeed = 50;

const wolfRunSpeed = 200;

const cowRunSpeed = 170;

const cowWalkSpeed = 50;

const defaultMovementFoodLoss = 4;

const defaultMovementWaterLoss = 3;

const defaultBaseFoodLoss = 3;

const defaultBaseWaterLoss = 2;

const defaultVelocity = 50;

const defaultMudThreshold = 500;

const defaultWaterThreshold = 5000;

const defaultCowFoodGain = 50;

const defaultCowWaterGain = 50;

const initialWaterLevel = 20000;

const initialThickGrassLevel = 20000;

const initialLightGrassLevel = Phaser.Math.Between(0, 1000);

const initialCows = 9;

const initialWolves = 1;

// Other initializations
let wolfGroup;
let wolves = 0;
let cowGroup;
let cows = 0;
let gameOver = false;
let mapGroup;
let predatorLocations = [];


function preload() {
    this.load.image('water', 'assets/water.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('grass', 'assets/grass.png');
    this.load.image('thick_grass', 'assets/thick_grass.png');
    this.load.spritesheet('cow', 'assets/1cow.png', { frameWidth: 32, frameHeight: 32 });
}

//initalize all starting entities
function create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 1000, 1000);

    //assign and create cowGroup for entities
    cowGroup = this.physics.add.group();
    wolfGroup = this.physics.add.group();

    //build out the map and the 'identities' of each square
    mapGroup = this.add.group();
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let terrainType = Math.floor(Math.random()*20)
            let name;
            let type;
            let quantity;
            let color;
            if (terrainType <= 8) {
                name = 'light_grass'
                type = 'grass'
                quantity = initialLightGrassLevel;
                color = 0x339966;
            } else if (terrainType <= 16) {
                name = 'thick_grass'
                type = 'grass'
                quantity = initialThickGrassLevel;
                color = 0x004d00;
            } 
            else {
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

    for (let i = 1; i <= initialWolves; i++) {
        let t = 0
        let grassSquare = false;
        //make sure they spawn on a thick grass square
        while (!grassSquare) {
            //randomize starting location
            startingLocationX = Math.floor(Math.random()*1000);
            startingLocationY = Math.floor(Math.random()*1000);
            const squareAtLocation = getSquareAt(startingLocationX, startingLocationY)
            if (squareAtLocation.name === 'thick_grass') {
                grassSquare = true;
            }
            t++
            //Safety trigger, things happen
            if (t > 300) {
                console.log('something went wrong')
                return 
            }
        }
        createWolf(wolves++, startingLocationX, startingLocationY)
    }
}
//setup functions for wolves and cows

function createWolf(id, x, y) {
    //I DONT HAVE A SPRITESHEET FOR WOLVES YET SO THEY GET TO BE A WATER SQUARE
    const wolf = wolfGroup.create(x, y);

    wolf.setCollideWorldBounds(true);
    wolf.id = id;
    wolf.age = 0;

    wolf.water = startingWolfWater;
    wolf.drinking = false;
    wolf.movingToWater = false;
    wolf.knownWater = [];
    wolf.waterHeading = [];
    wolf.thirsty = false;

    wolf.food = startingWolfFood;
    wolf.eating = false;
    wolf.chasingFood = false;
    wolf.knownPrey = [];
    wolf.foodHeading = [];
    wolf.hungry = false;
    wolf.hunting = false;

    wolf.hasChildren = false;
    wolf.cubs = 0;
    wolf.huntDirection = 0;
    wolf.huntDistance = 0;
    wolf.species = 'wolf'
    wolf.visionRange = 500;
    wolf.walkSpeed = wolfWalkSpeed;
    wolf.runSpeed = wolfRunSpeed;
    wolf.walkFoodLoss = 1;
    wolf.runFoodLoss = 20;
    wolf.walkWaterLoss = 1;
    wolf.runWaterLoss = 8;
    wolf.preyId = null;
    wolf.range = 10;
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
    cow.setCollideWorldBounds(true);
    cow.id = id;
    cow.age = 0;

    cow.water = startingCowWater;
    cow.drinking = false;
    cow.movingToWater = false;
    cow.knownWater = [];
    cow.waterHeading = [];
    cow.thirsty = false;


    cow.food = startingCowFood;
    cow.eating = false;
    cow.movingToFood = false;
    cow.knownFood = [];
    cow.foodHeading = [];
    cow.isHungry = false;

    
    cow.children = 0;
    cow.wandering = false;
    cow.wanderDistance = 0;
    cow.wanderDirection = 0;
    cow.species = 'cow'
    cow.visionRange = 500;
    cow.walkSpeed = cowWalkSpeed;
    cow.runSpeed = cowRunSpeed;
    cow.walkFoodLoss = 2;
    cow.walkWaterLoss = 2;
    cow.runWaterLoss = 20;
    cow.runFoodLoss = 20;
    cow.beingHunted = false;
    cow.isFleeing = false;
    cow.predatorID = null;
    cow.corpse = false;
}

function killAnimal(animal, causeOfDeath) {
    console.error(`${animal.species} ${animal.id} died from ${causeOfDeath}`)
    animal.destroy()
}

// function animalWalkLeft(cow) {
//     cow.setVelocityX(-defaultVelocity)
//     cow.food -= defaultBaseFoodLoss;
//     cow.water -= defaultBaseWaterLoss;
// }

// function animalWalkRight(cow) {
//     cow.setVelocityX(defaultVelocity)
//     cow.food -= defaultBaseFoodLoss;
//     cow.water -= defaultBaseWaterLoss;
// }

// function animalWalkUp(cow) {
//     cow.setVelocityY(-defaultVelocity)
//     cow.food -= defaultBaseFoodLoss;
//     cow.water -= defaultBaseWaterLoss;
// }

// function animalWalkDown(cow) {
//     cow.setVelocityY(defaultVelocity)
//     cow.food -= defaultBaseFoodLoss;
//     cow.water -= defaultBaseWaterLoss;
// }





function animalWalkLeft(animal) {
    animal.setVelocityX(-animal.walkSpeed)
    animal.food -= animal.walkFoodLoss;
    animal.water -= animal.walkWaterLoss;
}

function animalWalkRight(animal) {
    animal.setVelocityX(animal.walkSpeed)
    animal.food -= animal.walkFoodLoss;
    animal.water -= animal.walkWaterLoss;
}

function animalWalkUp(animal) {
    animal.setVelocityY(-animal.walkSpeed)
    animal.food -= animal.walkFoodLoss;
    animal.water -= animal.walkWaterLoss;
}

function animalWalkDown(animal) {
    animal.setVelocityY(animal.walkSpeed)
    animal.food -= animal.walkFoodLoss;
    animal.water -= animal.walkWaterLoss;
}






function findDistance(startX, startY, endX, endY) {
    let distanceY = Math.abs(endY - startY);
    let distanceX = Math.abs(endX - startX);

    return distanceY + distanceX;
}







function animalLookForWater(animal) {
    //set searchDistance 500px === 5 squares
    const searchRadius = animal.visionRange;
    const gridPositions = [];
    //step by 100 because squares are 100 pixels
    for (let dx = -searchRadius; dx <= searchRadius; dx += 100) {
        for (let dy = -searchRadius; dy <= searchRadius; dy += 100) {
            gridPositions.push({ dx, dy });
        }
    }
    //grab the absolute position for a set of coordinates by adding the dy and dy and the cow's xy position
    for (const { dx, dy } of gridPositions) {
        
        const targetX = Math.floor(animal.x) + dx;
        
        const targetY = Math.floor(animal.y) + dy;
        
        const square = getSquareAt(targetX, targetY);
        
        if (square && square.name === 'water') {
            animal.knownWater = [...animal.knownWater, [targetX, targetY]];
        }
    }

    animalPickWaterSource(animal);
}

function animalPickWaterSource(animal) {
    if (animal.knownWater.length > 0) {
        let holderHeading = [animal.knownWater[0][0], animal.knownWater[0][1]];
        let closestDistance = findDistance(animal.x, animal.y, holderHeading[0], holderHeading[1]);
        //identify each distance and compare to see if it is close and set the temp holder if it's closer
        for (let i = 1; i < animal.knownWater.length; i++) {
            let newDistance = findDistance(animal.x, animal.y, animal.knownWater[i][0], animal.knownWater[i][1]);

            if (newDistance < closestDistance) {
                holderHeading = [animal.knownWater[i][0], animal.knownWater[i][1]];
                closestDistance = newDistance;
            }
        }
        //set their heading to the closest set of coordinates
        animal.waterHeading = holderHeading;
        animal.movingToWater = true;
        // console.warn('Water source picked for cow:', cow.id, cow.waterHeading);
        animalMoveTowardWater(animal);
    } else {
        console.warn(`No known water sources for ${animal.species}: ${animal.id}`);
    }
}

function animalMoveTowardWater(animal) {
    
    if (animal.x < (animal.waterHeading[0])) {
        animalWalkRight(animal)
    } else if (animal.x > (animal.waterHeading[0])) {
        animalWalkLeft(animal)
    }  if (animal.y < (animal.waterHeading[1])) {
        animalWalkDown(animal)
    }  else if (animal.y > (animal.waterHeading[1])) {
        animalWalkUp(animal)
    }
    //check position and if they have arrived at water stop movement and set status to drinking
    const animalPosition = getSquareAt(animal.x, animal.y)
    if (animalPosition.name === 'water') {
        animal.setVelocityX(0);
        animal.setVelocityY(0);
        animal.drinking = true;
        animal.waterHeading = [];
        animal.movingToWater = false;
    }

    //HANDLE SITUATIONS  WHERE THE COW ARRIVES AND THE WATER IS ALL GONE

    const destinationSquare = getSquareAt(animal.waterHeading[0], animal.waterHeading[1])

    if (destinationSquare && destinationSquare.name === 'mudpit') {
        animal.movingToWater = false;
        animal.waterHeading = [];
        animal.setVelocityX(0);
        animal.setVelocityY(0);
        animal.thirsty = false;
    }
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
        // console.warn('Water source picked for cow:', cow.id, cow.waterHeading);
        cowMoveTowardWater(cow);
    } else {
        console.warn('No known water sources for cow:', cow.id);
        cowWander(cow)
    }
}

function cowMoveTowardWater(cow) {
    
    if (cow.x < (cow.waterHeading[0])) {
        animalWalkRight(cow)
    } else if (cow.x > (cow.waterHeading[0])) {
        animalWalkLeft(cow)
    }  if (cow.y < (cow.waterHeading[1])) {
        animalWalkDown(cow)
    }  else if (cow.y > (cow.waterHeading[1])) {
        animalWalkUp(cow)
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
        cow.thirsty = false;
    }
}


//COW WANDER MECHANISM  

function cowWander(cow) {
    if (cow.wandering === false) {
        cow.setVelocityX(0)
        cow.setVelocityY(0)
        cow.wandering = true;
        const wanderDirection = Phaser.Math.Between(0, 3)
        cow.wanderDirection = wanderDirection;
        cow.wanderDistance = 400
    }

    if (cow.x <= 30) {
        cow.wanderDirection = 2;
        cow.wanderDistance += 250;
    }

    if (cow.x >= 970) {
        cow.wanderDirection = 3;
        cow.wanderDistance += 250;
    }

    if (cow.y >= 970) {
        cow.wanderDistance += 250;
        cow.wanderDirection = 1;
    }

    if (cow.y <= 30) {
        cow.wanderDistance += 250;
        cow.wanderDirection = 0;
    }

    if (cow.wanderDirection === 0) {
        animalWalkDown(cow)
    }

    if (cow.wanderDirection === 1) {
        animalWalkUp(cow)
    }

    if (cow.wanderDirection === 2) {
        animalWalkRight(cow)
    }

    if (cow.wanderDirection === 3) {
        animalWalkLeft(cow)
    }

    if (cow.x <= 30 || 970 <= cow.x || cow.y <= 30 || 970 <=cow.y)  {
        if (cow.wanderDistance < 300) {
            cow.wandering = false;
            cow.wanderDirection = null;
            cow.wanderDistance = 0;
            cow.thirsty = false;
            cow.setVelocityX(0);
            cow.setVelocityY(0)
        }
    }

    cow.wanderDistance--

    if (cow.wanderDistance === 0) {
        cow.wandering = false;
        cow.wanderDirection = null;
        cow.thirsty = false;
    }
} 






//all of the food functions are all functionally identical to the water ones need to parameterize so it's all the same


function cowLookForFood(cow) {

    cow.movingToFood = true;

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
        console.warn('No known food sources for cow: ', cow.id)
        killAnimal(cow, 'being blind')
    }
}


function cowMoveTowardFood(cow) {
    if (cow.x < (cow.foodHeading[0])) {
        animalWalkRight(cow)
    } if (cow.x > (cow.foodHeading[0])) {
        animalWalkLeft(cow)
    } if (cow.y < (cow.foodHeading[1])) {
        animalWalkDown(cow)
    } if (cow.y > (cow.foodHeading[1])) {
        animalWalkUp(cow)
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
            cow.knownFood = [];
            cow.foodHeading = [];
            cow.setVelocityX(0);
            cow.setVelocityY(0);
            cow.isHungry = false;
        }
    }
}









function lookForPrey(predator) {
    predator.hunting = true;
    predator.knownPrey = [];
    const preyNearby = cowGroup.getChildren().filter(prey => {
        const areaX = predator.x - predator.visionRange;
        const areaY = predator.y - predator.visionRange;
        const areaWidth = predator.visionRange * 2;
        const areaHeight = predator.visionRange * 2;

        const isClose = areaX <= prey.x && prey.x <= areaX + areaWidth && areaY <= prey.y && prey.y <= areaY + areaHeight;
        return isClose            
    });
    if (preyNearby.length > 0) {
        let closestDistance = findDistance(predator.x, predator.y, preyNearby[0].x, preyNearby[0].y)
        let preyId = preyNearby[0].id;
        // console.warn(preyNearby)
        for (const prey of preyNearby) {
            tempDistance = findDistance(predator.x, predator.y, prey.x, prey.y)
            if (tempDistance < closestDistance) {
                closestDistance = tempDistance;
                preyId = prey.id;
            }
        }
        // console.log(closestDistance, preyId)
        predator.preyId = preyId;

        predatorIdentifyPrey(predator)
        // gameOver = true;
    }
}

function predatorIdentifyPrey(predator) {
    let preyFound = false;
    let preyNum = 0;
    while (!preyFound) {
        if (cowGroup.children.entries[preyNum] && cowGroup.children.entries[preyNum].id === predator.preyId) {
            const prey = cowGroup.children.entries[preyNum]
            preyFound = true;
            prey.beingHunted = true;
            prey.predatorId = predator.id;
            predatorChasePrey(predator, prey)
        }
        preyNum++
        if (preyNum > cowGroup.children.entries.length) {
            predator.hunting = false;
            predator.huntDirection = 0;
            // predator.preyId = null;
            predator.setVelocityX(0)
            predator.setVelocityY(0)
            predator.hungry = false;
            predator.chasingFood = false;
            return
        }
    }
    
}

function predatorChasePrey(predator, prey) {
    const predatorGiveUpChance = Math.floor(Phaser.Math.Between(0,1000))
    if (predatorGiveUpChance === 0) {
        predator.chasingFood = false;
        predator.hunting = false;
        return
    }
    if (predator.x < prey.x) {
        animalRunRight(predator)
    } if (prey.x < predator.x) {
        animalRunLeft(predator)
    } if (predator.y < prey.y) {
        animalRunDown(predator)
    } if (prey.y < predator.y) {
        animalRunUp(predator)
    }
    const inRange = isPreyInRange(predator, prey)
    if (inRange) {
        predator.setVelocityX(0)
        predator.setVelocityY(0)
        prey.setVelocityY(0)
        prey.setVelocityX(0)
        prey.corpse = true;
        // gameOver = true;
        predator.food += 8000;
        killAnimal(prey, 'caught by wolf')
        console.warn('caught the prey')
        predator.hunting = false;
        console.log(predator.hunting)
        predator.chasingFood = false;
        predator.knownPrey = [];
        predator.hungry = false;
    }
}

function animalRunRight(animal) {
    animal.setVelocityX(animal.runSpeed)
    animal.food -= animal.runFoodLoss;
    animal.water -= animal.runWaterLoss;
}

function animalRunLeft(animal) {
    animal.setVelocityX(-animal.runSpeed)
    animal.food -= animal.runFoodLoss;
    animal.water -= animal.runWaterLoss;
}
function animalRunUp(animal) {
    animal.setVelocityY(-animal.runSpeed)
    animal.food -= animal.runFoodLoss;
    animal.water -= animal.runWaterLoss;
}
function animalRunDown(animal) {
    animal.setVelocityY(animal.runSpeed)
    animal.food -= animal.runFoodLoss;
    animal.water -= animal.runWaterLoss;
}

function isPreyInRange(predator, prey) {
    const  areaX = predator.x - predator.range;
    const areaY = predator.y - predator.range;
    const areaWidth = predator.range * 2;
    const areaHeight = predator.range * 2;

    const isInrange = areaX <= prey.x && prey.x <= areaX + areaWidth && areaY <= prey.y && prey.y <= areaY + areaHeight;
    return isInrange

}


function preyFleePredator(prey) {
    if (!prey.isFleeing && prey.food >= 100 && prey.water >= 100) {
        prey.isFleeing = true;
        prey.drinking = false;
        prey.movingToWater = false;
        prey.knownWater = [];
        prey.waterHeading = [];
        prey.thirst = false;
        prey.eating = false;
        prey.movingToFood = false;
        prey.knownFood = [];
        prey.foodHeading = [];
        prey.isHungry = false;
    }
    if (prey.food <= 100 || prey.water <= 100) {
        prey.setVelocityX(0)
        prey.setVelocityY(0)
        prey.isFleeing = false;
        return
    }
    let predator = null;  // Initialize the variable to null or any default value

    wolfGroup.children.iterate(each => {
        if (each.id === prey.predatorId) {
            predator = each;
            return false;  // This breaks out of the iteration
        }
    });
        // console.warn(predator.id)
    preyRun(predator.x, predator.y, prey)
}


function preyRun(predatorX, predatorY, prey) {
    // if (prey.swerving) {
    //     if (prey.swerveDirection === 0) {

    //     }
    //     if (prey.swerveDirection === 1) {
            
    //     }
    //     if (prey.swerveDirection === 2) {
            
    //     }
    //     if (prey.swerveDirection === 3) {
            
    //     }
    // }
    if (predatorX < prey.x) {
        if (930 > prey.x) {
            animalRunRight(prey)
        } else {
            animalRunLeft(prey)
        }
        //need to add boundary contingencies
    } else if (prey.x < predatorX) {
        //need to add boundary contingencies
        if (50 < prey.x) {
            animalRunLeft(prey)
        } else {
            animalRunRight(prey)
        }
    }
    if (predatorY < prey.y) {
        if (950 < prey.y) {
            animalRunUp(prey)
        } else {
            animalRunDown(prey)
        }
        // animalRunDown(prey)
    } else if (prey.y < predatorY) {
        //need to add boundary contingencies
        if (50 > prey.y) {
            animalRunDown(prey)
        } else {
            animalRunUp(prey)
        }

    }
}



function preyIdentifyNearbyPredators(prey) {
    let predatorsNearby = false;
    for(let i = 0; i < predatorLocations.length; i++) {
        if ((predatorLocations[i][0] - 100) < prey.x && prey.x < (predatorLocations[i][0] + 100) && (predatorLocations[i][1] - 100) < prey.y && prey.y < (predatorLocations[i][1] + 100)) {
            console.log('predator nearby');
            predatorsNearby = true;
            preyRun(predatorLocations[i][0], predatorLocations[i][1], prey)
        }
    }
    if (!predatorsNearby) {
        // prey.setVelocityX(0)
        // prey.setVelocityY(0)
        
    } else {
        // preyRun(predatorLocations[i][0], predatorLocations[i][1], prey)
    }
    return predatorsNearby
}

// function preyFleeNearbyPredators(prey) {

// }

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

    wolfGroup.children.iterate(function(wolf) {
        if (wolf !== undefined) {
            wolf.food -= defaultWolfFoodLoss;
            wolf.water -= defaultWolfWaterLoss;
            wolf.age++;
            if (wolf.age > 20000) {
                predatorLocations.shift()
                killAnimal(wolf, 'being a boomer');
                return
            }

            if (wolf.food <= 0) {
                predatorLocations.shift()
                killAnimal(wolf, 'rumbly tummy');
                return
                // wolf.food += 6000;
            }

            if (wolf.water <= 0) {
                predatorLocations.shift()
                killAnimal(wolf, 'thirst');
                return
            }

            wolf.hunger = Math.floor(wolf.food / 1000);
            wolf.thirst = Math.floor(wolf.water / 1000);

            if (wolf.drinking) {
                const wolfPosition = getSquareAt(wolf.x, wolf.y);
                if (wolfPosition.data.list.water > 50) {
                    wolf.water += defaultCowWaterGain;
                } else {
                    wolf.drinking = false;
                    wolf.movingToWater = false;
                    wolf.knownWater = [];
                    wolf.waterHeading = [];
                    wolf.thirsty = false;
                }
            }

            if (wolf.thirst <= 10 && !wolf.hungry && !wolf.drinking && !wolf.hunting) {
                if (wolf.thirsty) {
                    animalMoveTowardWater(wolf)
                } else {
                    wolf.thirsty = true;
                    animalLookForWater(wolf)
                }
            }

            if (wolf.hunger <= 20 && !wolf.hungry && !wolf.eating && !wolf.drinking && !wolf.movingToWater) {
                if (!wolf.hunting) {
                    lookForPrey(wolf)
                } else {
                    predatorIdentifyPrey(wolf)
                }
            }
            predatorLocations.shift()
            predatorLocations.push([wolf.x, wolf.y])
            if (!wolf.drinking && !wolf.eating && !wolf.movingToWater && !wolf.movingToFood && !wolf.hunting) {
                const chanceToReproduce = Phaser.Math.Between(0, 800)
                if (chanceToReproduce === 0) {
                    createWolf(wolves++, wolf.x, wolf.y)
                    wolf.food -= 7000;
                    wolf.water -= 5000;
                }
            }

        }
    })

    cowGroup.children.iterate(function(cow) {
        if (cow !== undefined && !cow.corpse) {
            //update cow food and water levels
            cow.food -= defaultBaseFoodLoss;
            cow.water -= defaultBaseWaterLoss;
            cow.age++;
            //check death conditions
            if (cow.age > 50000) {
                killAnimal(cow, 'being a boomer');
                return
            }
            if (cow.food <= 0) {
                console.log(cow)
                killAnimal(cow, 'lack of food');
                return
            }
            if (cow.water <= 0) {
                killAnimal(cow, 'thirst');
                return
            }
            const predatorsNearby = preyIdentifyNearbyPredators(cow)
            if (predatorsNearby) {
                return
            }
            // if (cow.beingHunted) {
            //     // console.log(`${cow.id} is being hunted`)
            //     preyFleePredator(cow)
            //     return
            // }
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
                    cow.thirsty = false;
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
            if (cow.thirst <= 10 && !cow.isHungry && !cow.drinking && !cow.wandering) {
                if (cow.thirsty) {
                    // console.log('moving', cow.thirst, cow.drinking)
                    cowMoveTowardWater(cow)
                } else {
                    // console.log('looking', cow.thirst, cow.drinking)
                    cow.thirsty = true;
                    cowLookForWater(cow);
                }
            }

            //food search parameters and implementation are essentially identical to water

            if (cow.hunger <= 10 && !cow.eating && !cow.thirsty && !cow.drinking && !cow.wandering) {
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


                } else {
                    cowMoveTowardFood(cow);
                }
            }

            if (cow.wandering) {
                cowWander(cow)
            }

            //these desperation functions are not working well so temp disabled
            // //imminent thirst death overrides
            
            // if (cow.thirst <= 3 && !cow.drinking && !cow.wandering) {
            //     cow.eating = false;
            //     cow.movingToFood = false;
            //     cow.knownFood = [];
            //     cow.foodHeading = [];
            //     cow.isHungry = false;
            //     if (cow.thirst) {
            //         // console.log('moving', cow.thirst, cow.drinking)
            //         cowMoveTowardWater(cow)
            //     } else {
            //         // console.log('looking', cow.thirst, cow.drinking)
            //         cow.thirst = true;
            //         cowLookForWater(cow);
            //     }
            // }

            // //starvation overrides normal settings
            
            // if (cow.hunger <= 3 && !cow.eating && cow.thirst > 5) {
            //     const cowLocation = getSquareAt(cow.x, cow.y);
            //     if (cowLocation.name === 'thick_grass') {
            //         cow.eating = true;
            //         cow.movingToFood = false;
            //         cow.foodHeading = []
            //         cow.knownFood = [];
            //         cow.setVelocityX(0);
            //         cow.setVelocityY(0);
            //         cow.drinking = false;
            //         cow.thirst = false;
            //         cow.movingToWater = false;
            //         cow.knownWater = [];
            //         cow.waterHeading = [];
            //         return
            //     }
            //     if (!cow.movingToFood && !cow.eating) {
            //             cowLookForFood(cow);
            //             cowPickFoodSource(cow);


            //     } else {
            //         cowMoveTowardFood(cow);
            //     }
            // }
            
            //check for conditions where the cow would be satisfied.
            if (cow.drinking && cow.water >= 15000) {
                cow.thirsty = false;
            } else if (cow.eating && cow.food >= 15000) {
                cow.isHungry = false;
            }else if (cow.eating && cow.food >= 30000) {
                cow.eating = false;
            }
            if (cow.drinking && cow.water >= 30000) {
                cow.drinking = false;
            }

            //allow the opportunity to reproduce if they're not doing anything else

            if (!cow.drinking && !cow.eating && !cow.movingToWater && !cow.movingToFood && 100 < cow.age && cow.age < 80000) {
                const chanceToReproduce = Math.floor(Math.random() * 10000);
                //NEED TO CHANGE TO MORE REASONABLE NUMBERS THESE HAVE BEEN EDITED FOR TESTING PURPOSES
                if (chanceToReproduce < 5 && cow.children <= 5) {
                    createCow(cows++, cow.x, cow.y);
                    createCow(cows++, cow.x, cow.y);
                    cow.food -= 7500;
                    cow.water -= 4500;
                    console.log(cowGroup.children.entries.length);
                } else if (chanceToReproduce < 2) {
                    killAnimal(cow, 'overpopulation');
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

    return null;
}