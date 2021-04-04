import Dude from "./Dude.js";
import Zombie from "./Zombie.js";

let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?F

        let tank = scene.getMeshByName("heroTank");
        if (tank) {
            tank.Dude.move(inputStates);
        }
        
 
        // if tank move, zombie will hear the sound and chase tank
        // otherwise zombie randomly move
        let tmpZombie = scene.getMeshByName("zombie");
        if (tmpZombie)
            if (inputStates.up || inputStates.down) {
                tmpZombie.Zombie.chase(scene);
            } else {
                tmpZombie.Zombie.move();
            }
        if(scene.zombies) {
            for(var i = 0 ; i < scene.zombies.length ; i++) {

                if (inputStates.up || inputStates.down) {
                    scene.zombies[i].Zombie.chase(scene);
                } else {
                    scene.zombies[i].Zombie.move();
                }
                
            }
        }    


        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);
    createTank(scene);
    // second parameter is the target to follow



    createLights(scene);


    createZombie(scene);

   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene,target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera",target.position, scene,target);

    camera.radius = 40; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

let zMovement = 5;
function createTank(scene) {

    BABYLON.SceneLoader.ImportMesh("him", "models/Dude/", "Dude.babylon", scene,  (newMeshes, particleSystems, skeletons) => {
        let tank = newMeshes[0];
        tank.position = new BABYLON.Vector3(0, 0, 5);  // The original dude
        // make it smaller 
        tank.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
        //heroDude.speed = 0.1;

        // give it a name so that we can query the scene to get it by name
        tank.name = "heroTank";

        let a = scene.beginAnimation(skeletons[0], 0, 120, true, 1);

        let dude = new Dude(tank, 1);

        let followCamera = createFollowCamera(scene, tank);
        scene.activeCamera = followCamera;
    });

}

function createZombie(scene) {

    BABYLON.SceneLoader.ImportMesh("Zombie_Geo", "models/Zombie/", "Zombie.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        let zombie = newMeshes[0];
        
        // make zombie smaller, rotate zombie
        zombie.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
        zombie.name = "zombie";
        let xrand = Math.floor(Math.random()*1000 - 500);
        let zrand = Math.floor(Math.random()*1000 - 500);
    
        zombie.position = new BABYLON.Vector3(xrand, 0, zrand);
        zombie.rotation = new BABYLON.Vector3( -Math.PI/2 , 0, 0);
        scene.beginAnimation(zombie.skeleton, 0, 122, true, 1);
        let oneZombie = new Zombie(zombie, 0.2);
        
        // make clones
        scene.zombies = [];
        for(let i = 0; i < 10; i++) {
            scene.zombies[i] = doClone(zombie, skeletons, i);
            scene.beginAnimation(scene.zombies[i].skeleton, 0, 122, true, 1);
            var temp = new Zombie(scene.zombies[i], 0.2);

        }

    });	
}


function doClone(originalMesh, skeletons, id) {
    let myClone;
    let xrand = Math.floor(Math.random()*1000-500);
    let zrand = Math.floor(Math.random()*1000-500);

    myClone = originalMesh.clone("clone_" + id);
    myClone.position = new BABYLON.Vector3(xrand, 0, zrand);
    myClone.rotation.y = Math.random() * Math.PI;
    if(!skeletons) return myClone;

    // The mesh has at least one skeleton
    if(!originalMesh.getChildren()) {
        myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
        return myClone;
    } else {
        if(skeletons.length === 1) {
            // the skeleton controls/animates all children, like in the Dude model
            let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            myClone.skeleton = clonedSkeleton;
            let nbChildren = myClone.getChildren().length;

            for(let i = 0; i < nbChildren;  i++) {
                myClone.getChildren()[i].skeleton = clonedSkeleton
            }
            return myClone;
        } else if(skeletons.length === originalMesh.getChildren().length) {
            // each child has its own skeleton
            for(let i = 0; i < myClone.getChildren().length;  i++) {
                myClone.getChildren()[i].skeleton() = skeletons[i].clone("clone_" + id + "_skeleton_" + i);
            }
            return myClone;
        }
    }

    return myClone;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function move() {
    let yMovement = 0;
    let tank = scene.getMeshByName("heroTank");
   
    if (tank.position.y > 2) {
        zMovement = 0;
        yMovement = -2;
    } 
    //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

    if(inputStates.up) {
        //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
        tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
    }    
    if(inputStates.down) {
        //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
        tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));

    }    
    if(inputStates.left) {
        //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
        tank.rotation.y -= 0.02;
    }    
    if(inputStates.right) {
        //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
        tank.rotation.y += 0.02;
    }
}
function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })

    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}

