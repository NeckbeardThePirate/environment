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
//test
// for (let i = 0; i < map.length; i+=10) {
//   for (let j = 0; j < map[i].length; j+=10) {
//     if (0<i) {
//         waterLeft = map[i - 1][j] === 'water'
//     } if (0< j) {
//         waterUp = map[i][j - 1] === 'water'
//     }
//     // const terrainTypeNumber = Math.floor(Math.random()*1000)
//     // // console.log(terrainTypeNumber)
//     // if (70 < i && bodiesOfWater <= 1) {
//     //     if (90 < i && bodiesOfWater === 0) {
//     //         console.log('almost none')
//     //         chanceOfWater+=50
//     //     }
//     //     chanceOfWater +=10
//     //     if (terrainTypeNumber <= chanceOfWater) {
//     //         bodiesOfWater++
//     //         map[i][j] = 'water'
//     //         waterMap.push({'i':i, 'j':j, timesAddedTo: 0, continueAdding: true})
//     //         chanceOfWater = chanceOfWater/2;
//     //     }
//     // } else {
//     //     if (terrainTypeNumber <= chanceOfWater) {
//     //         bodiesOfWater++
//     //         map[i][j] = 'water'
//     //     }
//     // }
//     // if (3 <=bodiesOfWater) {
//     //     break
//     // }

//     ///Might add back just unnecessary for testing
//     const leftEdge = i <= 5;
//     const rightEdge = 95 <= i;
//     const topEdge = j <= 5;
//     const bottomEdge = 95 <= j;
//     if (waterCap <= waterNum || leftEdge || rightEdge || topEdge || bottomEdge) {
//         if (thickGrassCap <= thickGrassNum) {
//             map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 3))];
//         }
//         map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
//     } else {
//         if (waterUp || waterLeft) {
//             if (waterLengthCount >= 8) {
//                 map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
//                 waterLengthCount = 0;
//             } else {
//                 map[i][j] = 'water'
//             }
//         } else {
//             map[i][j] = terrains[Math.floor(Math.random() * terrains.length)];
//         }
//     }
//     if (map[i][j] === 'water') {
//         waterNum++
//         waterLengthCount++
//         waterWidthCount++
//     }//TODO Needs to not generate a longth thick line of water, but we'll get there.
//   }
// }

for (let i = 0; i < map.length; i+=1) {
    for (let j = 0; j < map[i].length; j+=1) {
      if (0<i) {
          waterLeft = map[i - 1][j] === 'water'
      } if (0< j) {
          waterUp = map[i][j - 1] === 'water'
      }
      // const terrainTypeNumber = Math.floor(Math.random()*1000)
      // // console.log(terrainTypeNumber)
      // if (70 < i && bodiesOfWater <= 1) {
      //     if (90 < i && bodiesOfWater === 0) {
      //         console.log('almost none')
      //         chanceOfWater+=50
      //     }
      //     chanceOfWater +=10
      //     if (terrainTypeNumber <= chanceOfWater) {
      //         bodiesOfWater++
      //         map[i][j] = 'water'
      //         waterMap.push({'i':i, 'j':j, timesAddedTo: 0, continueAdding: true})
      //         chanceOfWater = chanceOfWater/2;
      //     }
      // } else {
      //     if (terrainTypeNumber <= chanceOfWater) {
      //         bodiesOfWater++
      //         map[i][j] = 'water'
      //     }
      // }
      // if (3 <=bodiesOfWater) {
      //     break
      // }
  
      ///Might add back just unnecessary for testing
      const leftEdge = i <= 1;
      const rightEdge = 95 <= i;
      const topEdge = j <= 1;
      const bottomEdge = 95 <= j;
      if (waterCap <= waterNum || leftEdge || rightEdge || topEdge || bottomEdge) {
          if (thickGrassCap <= thickGrassNum) {
              map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 3))];
          }
          map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
      } else {
        //COMMENTED OUT FOR THE TEST
        //   if (waterUp || waterLeft) {
        //       if (waterLengthCount >= 8) {
        //           map[i][j] = terrains[Math.floor(Math.random() * (terrains.length - 1))];
        //           waterLengthCount = 0;
        //       } else {
        //           map[i][j] = 'water'
        //       }
        //   } else {
        //       map[i][j] = terrains[Math.floor(Math.random() * terrains.length)];
        //   }
        map[i][j] = terrains[Math.floor(Math.random() * terrains.length)];
      }
      if (map[i][j] === 'water') {
          waterNum++
          waterLengthCount++
          waterWidthCount++
      }//TODO Needs to not generate a longth thick line of water, but we'll get there.
    }
  }

// while(waterNum <= waterCap) {
//     if (bodiesOfWater > 1) {
//         let goToBody = Math.floor(Math.random()*10)
//         while(goToBody >= waterMap.length) {
//             goToBody -= waterMap.length
//         }    
//     }
//     if (waterMap[goToBody].continueAdding === false) {
//         continue
//     } else {
//         waterMap[goToBody]
//     }
// }
// console.log(map)

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
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let image = this.add.image(i * 100, j * 100, map[i][j]);
            image.setOrigin(0, 0);
        }
    }
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 1000, 1000);
    cowGroup = this.physics.add.group();
    for (let i = 1; i <= initialCows; i++) {
        // console.log(singleCow)
        let startingLocationX = Math.floor(Math.random()*10);;
        let startingLocationY = Math.floor(Math.random()*10);;
        let t = 0
        while (map[startingLocationX*1][startingLocationY*1] !== 'grass') {
            startingLocationX = Math.floor(Math.random()*10);
            startingLocationX = Math.floor(Math.random()*10);
            // console.log(map[startingLocationX*10][startingLocationY*10], startingLocationY, startingLocationX)
            t++
            if (t > 300) {
                console.log('something went wrong')
                return 
            }

        }
        // console.log('grass found!', startingLocationX, startingLocationY)
        createCow(`${cows++}`, startingLocationX*100, startingLocationY*100);
    }

    mapGroup = this.add.group();
    
}

function createCow(id, x, y) {
    const cow = cowGroup.create(x, y, 'cow');
    // console.log(x, y)
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

function killCow(cow, causeOfDeath) {
    console.error(`cow ${cow.cowId} died from ${causeOfDeath}`)
    cow.destroy()
}

function moveCowLeft(cow) {
    cow.x-=1
    cow.water-=3
    cow.food -= 3
}

function moveCowRight(cow) {
    cow.x+=1
    cow.food -= 3
    cow.water-=3
}

function moveCowUp(cow) {
    cow.y-=1
    cow.food -= 3
    cow.water-=3
}

function moveCowDown(cow) {
    cow.y+=1
    cow.food -= 3
    cow.water-= 3
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

function cowLookForWater(cow) {
    const searchRadius = 100;

    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        for (let dy = -searchRadius; dy <= searchRadius; dy++) {
            // console.log('looking')
            const targetX = Math.floor(cow.x / 100) + dx;
            const targetY = Math.floor(cow.y / 100) + dy;

            if (isWaterSquare(map, targetX, targetY)) {
                // cow.drinkingWater = true;
                cow.movingToWater = true;
                // console.log(`Cow ${cow.cowId} found water at (${targetX}, ${targetY})!`);
                const waterX = (targetX*100) + 50
                const waterY = (targetY*100) + 50
                cow.knownWater = [...cow.knownWater, [waterX, waterY]]
                // return;
                console.log(cow.closestWater)
                if (cow.closestWater.length === 0) {
                    console.log('firstClosest')
                    cow.closestWater[0] = waterX;
                    cow.closestWater[1] = waterY;
                } else {
                    let currentDistance = findDistance(cow.x, cow.y, waterX, waterY)
                    let activeDistance = findDistance(cow.x, cow.y, cow.closestWater[0], cow.closestWater[1])
                    console.log(currentDistance, activeDistance)
                    if (currentDistance < activeDistance) {
                        cow.closestWater[0] = waterX;
                        cow.closestWater[1] = waterY;
                        console.log('new closest water: ', cow.closestWater[0], cow.closestWater[1])
                    }
                }
            }
        }
    }

}



function cowLookForFood(cow) {
    const searchRadius = 10;

    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        for (let dy = -searchRadius; dy <= searchRadius; dy++) {
            // console.log('looking')
            const targetX = Math.floor(cow.x / 100) + dx;
            const targetY = Math.floor(cow.y / 100) + dy;

            if (isFoodSquare(map, targetX, targetY)) {
                cow.movingToFood = true;
                const foodX = (targetX*100) + 50
                const foodY = (targetY*100) + 50
                cow.knownFood = [...cow.knownFood, [foodX, foodY]]
                // return
            }
        }
    }
}

function isWaterSquare(map, x, y) {
    return map[x] && map[x][y] === 'water';
}


function isFoodSquare(map, x, y) {
    return map[x] && map[x][y] === 'thick_grass';
}

function cowPickWaterSource(cow) {
    let waterArrSpot = Math.floor(Math.random()*10);
    while (cow.knownWater.length < waterArrSpot) {
        waterArrSpot -= cow.knownWater.length
    }
    cow.waterHeading = [cow.knownWater[waterArrSpot][0],cow.knownWater[waterArrSpot][1]]
    // console.log(cow.waterHeading)
    // console.log(waterArrSpot)
}

function cowPickFoodSource(cow) {
    console.log('we are picking a food source')
    let foodArrSpot = Math.floor(Math.random()*100);
    while (cow.knownFood.length < foodArrSpot) {
        foodArrSpot -= cow.knownFood.length
    }
    cow.foodHeading = [cow.knownFood[foodArrSpot][0],cow.knownFood[foodArrSpot][1]]
    console.log(cow.foodHeading)
    console.log(foodArrSpot)
}


function cowMoveTowardWater(cow) {
    if (!cow.wandering) {
        const offCourseChance = Math.floor(Math.random() * 200);
        if (10 < offCourseChance && offCourseChance < 15) {
            cow.wandering = true;
            cow.wanderDistance = 30;
            if (offCourseChance === 11) {
                cow.wanderDirection = 1;
            }
            if (offCourseChance === 12) {
                cow.wanderDirection = 2;
            }
            if (offCourseChance === 13) {
                cow.wanderDirection = 3;
            }
            if (offCourseChance === 14) {
                cow.wanderDirection = 4;
            }
        }
    }
    if (cow.wanderDistance === 0) {
        cow.wandering = false;
        cow.wanderDirection = 0;
    }
    
    if (cow.wandering) {
        cow.wanderDistance--
        const randomDirection = Math.floor(Math.random() * 10);

        if (cow.wanderDirection = 1) {
            moveCowDown(cow);
        } else if (cow.wanderDirection === 2) {
            moveCowLeft(cow);
        } else if (cow.wanderDirection === 3) {
            moveCowRight(cow);
        } else if (cow.wanderDirection === 4) {
            moveCowUp(cow);
        }
        return
    }


    if (cow.x < (cow.waterHeading[0])) {
        moveCowRight(cow)
    } if (cow.x > (cow.waterHeading[0])) {
        moveCowLeft(cow)
    }  if (cow.y < (cow.waterHeading[1])) {
        moveCowDown(cow)
    }  if (cow.y > (cow.waterHeading[1])) {
        moveCowUp(cow)
    }

    if (cow.x === cow.waterHeading[0] && cow.y === cow.waterHeading[1]) {
        // console.log(`cow ${cow.cowId} is at the water`)
        cow.movingToWater = false;
        cow.drinking = true;
    }
}

function cowMoveTowardFood(cow) {
    if (!cow.wandering) {
        const offCourseChance = Math.floor(Math.random() * 100);
        if (10 < offCourseChance && offCourseChance < 15) {
            cow.wandering = true;
            cow.wanderDistance = 10;
            if (offCourseChance === 11) {
                cow.wanderDirection = 1;
            }
            if (offCourseChance === 12) {
                cow.wanderDirection = 2;
            }
            if (offCourseChance === 13) {
                cow.wanderDirection = 3;
            }
            if (offCourseChance === 14) {
                cow.wanderDirection = 4;
            }
        }
    }
    if (cow.wanderDistance === 0) {
        cow.wandering = false;
        cow.wanderDirection = 0;
    }
    
    if (cow.wandering) {
        cow.wanderDistance--
        const randomDirection = Math.floor(Math.random() * 10);

        if (cow.wanderDirection = 1) {
            moveCowLeft(cow);
            cow.food += 2
            cow.water += 2
        } else if (cow.wanderDirection === 2) {
            moveCowDown(cow);
            cow.food += 2
            cow.water += 2
        } else if (cow.wanderDirection === 3) {
            moveCowRight(cow);
            cow.food += 2
            cow.water += 2
        } else if (cow.wanderDirection === 4) {
            moveCowUp(cow);
            cow.food += 2
            cow.water += 2
        }
        return
    }
    if (cow.x < (cow.foodHeading[0])) {
        moveCowRight(cow)
    } if (cow.x > (cow.foodHeading[0])) {
        moveCowLeft(cow)
    } if (cow.y < (cow.foodHeading[1])) {
        moveCowDown(cow)
    } if (cow.y > (cow.foodHeading[1])) {
        moveCowUp(cow)
    } else {
        // console.log(`cow ${cow.cowId} is at the food`)
        cow.movingToFood = false;
        cow.eating = true;
    }
}

function update() {

    if (gameOver) {
        return;
    }

    if (cowGroup.countActive(true) === 0) {
        gameOver = true;
        console.log("Game Over!");
    }
    foodAvailable += 100;
    waterAvailable += 100;
    cowGroup.children.iterate(function(cow) {
        if (cow !== undefined) {
            cow.food -= 4;
            cow.water -= 2;
            cow.age++;
            if (cow.age > 50000) {
                killCow(cow, 'being a boomer');
            }
            if (cow.food <= 0) {
                killCow(cow, 'lack of food');
            }
            if (cow.water <= 0) {
                killCow(cow, 'thirst');
            }
            cow.thirst = Math.floor(cow.water / 1000);
            cow.hunger = Math.floor(cow.food / 1000);
            if (cow.drinking) {
                if (waterAvailable > 50) {
                    cow.water += 50;
                    waterAvailable -= 50;
                } else {
                    // console.log('LOW ON WATER')
                }
            }
            if (cow.eating) {
                if (foodAvailable > 50) {
                    cow.food += 50;
                    foodAvailable -= 50;
                }
                // console.log('cow eating')
            }
            if (cow.thirst === 2 && !cow.drinking) {
                if (!cow.movingToWater) {
                    if (cow.waterHeading.length === 0) {
                        if (cow.knownWater.length === 0) {
                            cowLookForWater(cow);
                            console.log('looking for water');
                        }
                        cowPickWaterSource(cow);
                    } else {
                        cow.movingToWater = true;
                        cow.movingToFood = false;
                        cow.eating = false;
                    }
                } else {
                    cowMoveTowardWater(cow);
                }
            } else if (cow.hunger === 2 && !cow.eating) {
                if (!cow.movingToFood) {
                    if (cow.foodHeading.length === 0) {
                        if (cow.knownFood.length === 0) {
                            cowLookForFood(cow);
                        }
                        cowPickFoodSource(cow);
                    } else {
                        cow.movingToFood = true;
                        cow.movingToWater = false;
                        cow.drinking = false;
                    }
                } else {
                    cowMoveTowardFood(cow);
                }
            } else {
                if (cow.thirst <= 10 && !cow.drinking && !cow.movingToFood) {
                    if (!cow.movingToWater) {
                        if (cow.waterHeading.length === 0) {
                            if (cow.knownWater.length === 0) {
                                cowLookForWater(cow);
                                console.log('looking for water');
                            }
                            cowPickWaterSource(cow);
                        } else {
                            cow.eating = false;
                            cow.movingToWater = true;
                        }
                    } else {
                        cowMoveTowardWater(cow);
                    }
                } else if (cow.hunger <= 10 && !cow.eating && !cow.movingToWater) {
                    if (!cow.movingToFood) {
                        if (cow.knownFood.length === 0) {
                            cowLookForFood(cow);
                        } else {
                            cowPickFoodSource(cow);
                            cow.movingToFood = true;
                        }
                    } else {
                        cowMoveTowardFood(cow);
                    }
                }
    
                if (cow.drinking && cow.water >= 20000) {
                    cow.drinking = false;
                    cow.waterHeading = [];
                    // console.log('cow drank their fill')
                } else if (cow.eating && cow.food >= 20000) {
                    cow.eating = false;
                    cow.foodHeading = [];
                    // console.log('cow is full')
                }
    
                if (!cow.drinking && !cow.eating && !cow.movingToFood && !cow.movingToWater && 10000 < cow.age && cow.age < 80000) {
                    const chanceToReproduce = Math.floor(Math.random() * 10000);
                    if (chanceToReproduce < 3 && cow.children <= 2) {
                        createCow(`${cows++}`, cow.x, cow.y);
                        console.log(cowGroup.children.entries.length);
                    } else if (chanceToReproduce < 3) {
                        killCow(cow, 'overpopulation');
                        console.log('WATER:', waterAvailable);
                    }
                }
            }
        }
    });
    
    setTimeout(function() {
        game.scene.scenes[0].time.addEvent({ delay: 0, callback: update, callbackScope: this })
    }, updateInterval);
}