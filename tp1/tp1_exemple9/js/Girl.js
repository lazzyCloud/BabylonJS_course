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

        // FOR COLLISIONS, let's associate a BoundingBox to the Dude

        // singleton, static property, computed only for the first dude we constructed
        // for others, we will reuse this property.
        if (Girl.boundingBoxParameters == undefined) {
            Girl.boundingBoxParameters = this.calculateBoundingBoxParameters();

        }
        //sphere.setBoundingInfo(new BABYLON.BoundingInfo(newMin, newMax));
        this.girlMesh.setBoundingInfo(Girl.boundingBoxParameters);
        //this.girlMesh.showBoundingBox = true;

        this.girlMesh.checkCollisions = true;
        this.frontVector = new BABYLON.Vector3(Math.sin(this.girlMesh.rotation.y), 0, Math.cos(this.girlMesh.rotation.y));
        this.bounder = null;
        //
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
        if (!this.bounder) return;
        this.girlMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y, this.bounder.position.z);
        
        //if (this.impactAnim.weight == 1.0) return;
        if(inputStates.up) {
            this.setWalkAnim();
            this.bounder.moveWithCollisions(this.frontVector.multiplyByFloats(-this.speed*deltaTime/16, -this.speed*deltaTime/16, -this.speed*deltaTime/16));
            //this.girlMesh.moveWithCollisions(this.frontVector.multiplyByFloats(-this.speed*deltaTime/16, -this.speed*deltaTime/16, -this.speed*deltaTime/16));
            this.swordMesh.moveWithCollisions(this.frontVector.multiplyByFloats(-this.speed*deltaTime/16, -this.speed*deltaTime/16, -this.speed*deltaTime/16));
            //this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            //this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0, this.speed*deltaTime/16,0));
            
        } else if(inputStates.down) {
            this.setBackWalkAnim();
            this.bounder.moveWithCollisions(this.frontVector.multiplyByFloats(this.speed*deltaTime/16, this.speed*deltaTime/16, this.speed*deltaTime/16));
            //this.girlMesh.moveWithCollisions(this.frontVector.multiplyByFloats(this.speed*deltaTime/16, this.speed*deltaTime/16, this.speed*deltaTime/16));
            this.swordMesh.moveWithCollisions(this.frontVector.multiplyByFloats(this.speed*deltaTime/16, this.speed*deltaTime/16, this.speed*deltaTime/16));
            //this.girlMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));
            //this.swordMesh.locallyTranslate(new BABYLON.Vector3( 0,-this.speed*deltaTime/16, 0));

        } else if(inputStates.left) {
            this.setIdleAnim();
            this.girlMesh.rotation.y -= 0.02*deltaTime/16;
            this.swordMesh.rotation.y -= 0.02*deltaTime/16;
            this.bounder.rotation.y -= 0.02*deltaTime/16;
            this.frontVector = new BABYLON.Vector3(Math.sin(this.girlMesh.rotation.y), 0, Math.cos(this.girlMesh.rotation.y));
            // does not work? why?
            //scene.stopAnimation(this.girlMesh);
            
        } else if(inputStates.right) {
            this.setIdleAnim();
            this.girlMesh.rotation.y += 0.02*deltaTime/16;
            this.swordMesh.rotation.y += 0.02*deltaTime/16;
            this.bounder.rotation.y += 0.02*deltaTime/16;
            this.frontVector = new BABYLON.Vector3(Math.sin(this.girlMesh.rotation.y), 0, Math.cos(this.girlMesh.rotation.y));
        } else {
            this.setIdleAnim();
        }
    }
    calculateBoundingBoxParameters() {
        // Compute BoundingBoxInfo for the Dude, for this we visit all children meshes
        //let childrenMeshes = this.girlMesh.getChildren();
        //console.log(this.girlMesh);
        var boundingInfo = this.girlMesh.getBoundingInfo();
        var min = boundingInfo.minimum.add(this.girlMesh.position);
        var max = boundingInfo.maximum.add(this.girlMesh.position);

        boundingInfo = this.swordMesh.getBoundingInfo();
        min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(this.swordMesh.position));
        max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(this.swordMesh.position));
        let sum = min.add(max);
        let center = sum.divide(new BABYLON.Vector3(2,2,2));

        return new BABYLON.BoundingInfo(min, max);
    }

    createBoundingBox(scene) {
        // Create a box as BoundingBox of the Dude
        let bounder = new BABYLON.Mesh.CreateBox("bounderGirl", 1, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", scene);
        bounderMaterial.alpha = .4;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;

        bounder.position = this.girlMesh.position.clone();

        let bbInfo = Girl.boundingBoxParameters;

        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;

        // Not perfect, but kinda of works...
        // Looks like collisions are computed on a box that has half the size... ?
        bounder.scaling.x = (max._x - min._x) * 0.4;
        bounder.scaling.y = (max._y - min._y) * 0.4;
        bounder.scaling.z = (max._z - min._z) * 0.2;

        bounder.isVisible = false;

        this.bounder = bounder;
        this.bounder.girlMesh = this.girlMesh;
        
    }
    
}