export default class Dude {
    constructor(dudeMesh, speed) {
        this.dudeMesh = dudeMesh;

        if(speed)
            this.speed = speed;
        else
            this.speed = 0.5;

        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        dudeMesh.Dude = this;
    }

    move(inputStates) {
        if(inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            this.dudeMesh.locallyTranslate(new BABYLON.Vector3( 0, 0,-this.speed));
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            this.dudeMesh.locallyTranslate(new BABYLON.Vector3( 0, 0,this.speed));

        }    
        if(inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            this.dudeMesh.rotation.y -= 0.02;
        }    
        if(inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            this.dudeMesh.rotation.y += 0.02;
        }
    }
}