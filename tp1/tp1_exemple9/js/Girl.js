export default class Girl {
    constructor(girlMesh, swordMesh, speed) {
        this.girlMesh = girlMesh;
        this.swordMesh = swordMesh;

        if(speed)
            this.speed = speed;
        else
            this.speed = 0.5;

        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        girlMesh.Girl = this;
    }
    // change move method in girl, current girl should move as previous tank
    move(inputStates, deltaTime) {

        if(inputStates.up) {
            this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            
        }    
        if(inputStates.down) {
            this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));
            this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));

        }    
        if(inputStates.left) {
            this.girlMesh.rotation.y -= 0.04*deltaTime/16;
            this.swordMesh.rotation.y -= 0.04*deltaTime/16;
            // does not work? why?
            //scene.stopAnimation(this.girlMesh);
            
        }    
        if(inputStates.right) {
            this.girlMesh.rotation.y += 0.04*deltaTime/16;
            this.swordMesh.rotation.y += 0.04*deltaTime/16;
        }
    }
}