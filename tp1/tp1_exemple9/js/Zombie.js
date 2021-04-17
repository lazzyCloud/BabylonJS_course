export default class Zombie {
    constructor(zombieMesh, speed) {
        this.zombieMesh = zombieMesh;

        if(speed)
            this.speed = speed;
        else
            this.speed = 1;

        // set a random target for zombie
        zombieMesh.Zombie = this;
        this.idleAnim = null;
        this.biteAnim = null;
        this.dyingAnim = null;
        this.runningAnim = null;
        this.walkingAnim = null;
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
      
                  // let make the Dude move towards the tank
                  if(distance > 30) {
                      this.setRunningAnim();
                      this.zombieMesh.moveWithCollisions(dir.multiplyByFloats(this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16));
                  }
                  else {
                      this.setBiteAnim();

                  }   
    }
    // if dude does not move, zombie move randomly
    move(tank,deltaTime) {
        //let tank = scene.getMeshByName("heroTank");
        let direction = tank.position.subtract(this.zombieMesh.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        if (distance > 30) {
            let ra = Math.random()*1000;
            // 0.5% chance that zombie will randomly change rotation
            if (ra < 3) {
                this.setIdleAnim();
                // generate a random target for zombie to chase
                let target = new BABYLON.Vector3( Math.floor(Math.random()*1000-500), 0,  Math.floor(Math.random()*1000-500));
                let direction = target.subtract(this.zombieMesh.position);
                      
                let dir = direction.normalize();
                let alpha = Math.atan2(-dir.x, -dir.z);
                this.zombieMesh.rotation.y += alpha;
                //this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
            } else {
                this.setWalkingAnim();
                // else zombie continue move forward
                this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
            
            }
        } else {
            this.setBiteAnim();
        }

    }

}