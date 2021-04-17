export default class Zombie {
    constructor(zombieMesh, speed, id) {
        this.zombieMesh = zombieMesh;
        this.id = id;
        if(speed)
            this.speed = speed;
        else
            this.speed = 1;
        this.bounder = null;
        // set a random target for zombie
        zombieMesh.Zombie = this;
        this.idleAnim = null;
        this.biteAnim = null;
        this.dyingAnim = null;
        this.runningAnim = null;
        this.walkingAnim = null;

        // FOR COLLISIONS, let's associate a BoundingBox to the Dude

        // singleton, static property, computed only for the first dude we constructed
        // for others, we will reuse this property.
        //if (Zombie.boundingBoxParameters == undefined) {
        //    Zombie.boundingBoxParameters = this.calculateBoundingBoxParameters();
        //}
        //this.zombieMesh.setBoundingInfo(Zombie.boundingBoxParameters);
        //this.zombieMesh.showBoundingBox = true;
        this.zombieMesh.checkCollisions = true;
        //this.bounder = this.createBoundingBox();
        //this.bounder.zombieMesh = this.zombieMesh;
        this.frontVector = new BABYLON.Vector3(Math.sin(this.zombieMesh.rotation.y), 0, Math.cos(this.zombieMesh.rotation.y));
    }
    setAnims(scene, skeleton) {
        this.idleAnim = scene.beginWeightedAnimation(skeleton,240, 361, 0.0, true);
        this.walkingAnim = scene.beginWeightedAnimation(skeleton,412, 532, 1.0, true);
        this.runningAnim = scene.beginWeightedAnimation(skeleton,372, 395, 0.0, true);
        this.dyingAnim = scene.beginWeightedAnimation(skeleton,140, 230, 0.0, true);
        this.biteAnim = scene.beginWeightedAnimation(skeleton,0, 126, 0.0, true);
    }
    resetAnims() {
        this.idleAnim.weight = 0;
        this.walkingAnim.weight = 0;
        this.runningAnim.weight = 0; 
        this.dyingAnim.weight = 0;
        this.biteAnim.weight = 0;
    }
    setWalkingAnim() {
        this.resetAnims();
        this.walkingAnim.weight = 1.0;
    }
    setRunningAnim() {
        this.resetAnims();
        this.runningAnim.weight = 1.0;

    }
    setDyingAnim() {
        this.resetAnims();
        this.dyingAnim.weight = 1.0;
    }
    setBiteAnim() {
        this.resetAnims();
        this.biteAnim.weight = 1.0;
    }
    setIdleAnim() {
        this.resetAnims();
        this.idleAnim.weight = 1.0;
    }
    // zombie chase dude as dude chase tank before
    chase(tank, deltaTime) {
        if (!this.bounder) return;
        this.zombieMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y, this.bounder.position.z);
                  // follow the tank
                  //let tank = scene.getMeshByName("heroTank");
                  // let's compute the direction vector that goes from Dude to the tank
                  let direction = tank.position.subtract(this.zombieMesh.position);
                  let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
                  //console.log(distance);
                  let dir = direction.normalize();
                  // angle between Dude and tank, to set the new rotation.y of the Dude so that he will look towards the tank
                  // make a drawing in the X/Z plan to uderstand....
                  let alpha = Math.atan2(-dir.x, -dir.z);
                  this.zombieMesh.rotation.y = alpha;
                  this.frontVector = new BABYLON.Vector3(Math.sin(this.zombieMesh.rotation.y), 0, Math.cos(this.zombieMesh.rotation.y));
                  // let make the Dude move towards the tank
                  if(distance > 25) {
                      this.setRunningAnim();
                      this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16));
                      //this.zombieMesh.moveWithCollisions(dir.multiplyByFloats(this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16));
                  }
                  else {
                      this.setBiteAnim();
                      tank.Girl.setImpactAnim();

                  }   
    }
    // if dude does not move, zombie move randomly
    move(tank,deltaTime) {
        if (!this.bounder) return;
        this.zombieMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y, this.bounder.position.z);
        //let tank = scene.getMeshByName("heroTank");
        let direction = tank.position.subtract(this.zombieMesh.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        if (distance > 25) {
            let ra = Math.random()*1000;
            // 0.5% chance that zombie will randomly change rotation
            if (ra < 3) {
                //this.setIdleAnim();
                // generate a random target for zombie to chase
                let target = new BABYLON.Vector3( Math.floor(Math.random()*1000-500), 0,  Math.floor(Math.random()*1000-500));
                let direction = target.subtract(this.zombieMesh.position);
                      
                let dir = direction.normalize();
                let alpha = Math.atan2(-dir.x, -dir.z);
                this.zombieMesh.rotation.y += alpha;
                this.frontVector = new BABYLON.Vector3(Math.sin(this.zombieMesh.rotation.y), 0, Math.cos(this.zombieMesh.rotation.y));
                //this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
            } else {
                this.setWalkingAnim();
                // else zombie continue move forward
                //this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
                //this.zombieMesh.moveWithCollisions(this.frontVector.multiplyByFloats(-this.speed*deltaTime/16, -this.speed*deltaTime/16, -this.speed*deltaTime/16));
                this.bounder.moveWithCollisions(this.frontVector.multiplyByFloats(-this.speed*deltaTime/16, -this.speed*deltaTime/16, -this.speed*deltaTime/16));
            
            }
        } else {
            
            let dir = direction.normalize();
            // angle between Dude and tank, to set the new rotation.y of the Dude so that he will look towards the tank
            // make a drawing in the X/Z plan to uderstand....
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.zombieMesh.rotation.y = alpha;
            this.setBiteAnim();
            tank.Girl.setImpactAnim();
        }

    }
    calculateBoundingBoxParameters() {
        var boundingInfo = this.zombieMesh.getBoundingInfo();
        var min = boundingInfo.minimum.add(this.zombieMesh.position);
        var max = boundingInfo.maximum.add(this.zombieMesh.position);
        //for(var i=1; i<meshes.length; i++){
        //    boundingInfo = meshes[i].getBoundingInfo();
        //    min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
        //    max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
        //}
        return new BABYLON.BoundingInfo(min, max);
    }

    createBoundingBox(scene) {
        // Create a box as BoundingBox of the Dude
        let bounder = new BABYLON.Mesh.CreateBox("bounder"+ (this.id).toString(), 1, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", scene);
        bounderMaterial.alpha = .4;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;

        bounder.position = this.zombieMesh.position.clone();

        let bbInfo = this.zombieMesh.getBoundingInfo();

        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;

        // Not perfect, but kinda of works...
        // Looks like collisions are computed on a box that has half the size... ?
        bounder.scaling.x = (max._x - min._x) * 0.3;
        bounder.scaling.y = (max._y - min._y) * 1;
        bounder.scaling.z = (max._z - min._z) * 0.2;

        bounder.isVisible = false;

        this.bounder = bounder;
        this.bounder.zombieMesh = this.zombieMesh;
        
    }

}