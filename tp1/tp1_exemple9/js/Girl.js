export default class Girl {
    constructor(girlMesh, swordMesh, speed) {
        this.girlMesh = girlMesh;
        this.swordMesh = swordMesh;

        if(speed)
            this.speed = speed;
        else
            this.speed = 0.5;
        this.idleAnim = null;
        this.walkAnim = null;
        this.backWalkAnim = null;
        this.deathAnim = null; 
        this.impactAnim = null;
        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        girlMesh.Girl = this;
    }
    setAnims(scene, skeleton) {
        this.idleAnim = scene.beginWeightedAnimation(skeleton,143, 252, 1.0, true);
        this.walkAnim = scene.beginWeightedAnimation(skeleton,462, 500, 0.0, true);
        this.backWalkAnim = scene.beginWeightedAnimation(skeleton,0, 40, 0.0, true);
        this.deathAnim = scene.beginWeightedAnimation(skeleton,50, 129, 0.0, true);
        this.impactAnim = scene.beginWeightedAnimation(skeleton,260, 299, 0.0, true);
    }
    resetAnims() {
        this.idleAnim.weight = 0;
        this.walkAnim.weight = 0;
        this.backWalkAnim.weight = 0; 
        this.deathAnim.weight = 0;
        this.impactAnim.weight = 0;
    }
    setWalkAnim() {
        this.resetAnims();
        this.walkAnim.weight = 1.0;
    }
    setBackWalkAnim() {
        this.resetAnims();
        this.backWalkAnim.weight = 1.0;

    }
    setDeathAnim() {
        this.resetAnims();
        this.deathAnim.weight = 1.0;
    }
    setImpactAnim() {
        this.resetAnims();
        this.impactAnim.weight = 1.0;
    }
    setIdleAnim() {
        this.resetAnims();
        this.idleAnim.weight = 1.0;
    }
    // change move method in girl, current girl should move as previous tank
    move(inputStates, deltaTime) {

        if(inputStates.up) {
            this.setWalkAnim();
            this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            
        } else if(inputStates.down) {
            this.setBackWalkAnim();
            this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));
            this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));

        } else if(inputStates.left) {
            this.setIdleAnim();
            this.girlMesh.rotation.y -= 0.04*deltaTime/16;
            this.swordMesh.rotation.y -= 0.04*deltaTime/16;
            // does not work? why?
            //scene.stopAnimation(this.girlMesh);
            
        } else if(inputStates.right) {
            this.setIdleAnim();
            this.girlMesh.rotation.y += 0.04*deltaTime/16;
            this.swordMesh.rotation.y += 0.04*deltaTime/16;
        } else {
            this.setIdleAnim();
        }
    }
}