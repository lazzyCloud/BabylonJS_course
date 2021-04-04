export default class Zombie {
    constructor(zombieMesh, speed) {
        this.zombieMesh = zombieMesh;

        if(speed)
            this.speed = speed;
        else
            this.speed = 1;

        // set a random target for zombie
        zombieMesh.Zombie = this;
    }
    // zombie chase dude as dude chase tank before
    chase(scene, deltaTime) {
                  // follow the tank
                  let tank = scene.getMeshByName("heroTank");
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
                      //a.restart();   
                      this.zombieMesh.moveWithCollisions(dir.multiplyByFloats(this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16, this.speed*0.5*deltaTime/16));
                  }
                  else {
                      //a.pause();
                  }   
    }
    // if dude does not move, zombie move randomly
    move(deltaTime) {
        let ra = Math.random()*1000;
        // 0.5% chance that zombie will randomly change rotation
        if (ra < 3) {
            // generate a random target for zombie to chase
            let target = new BABYLON.Vector3( Math.floor(Math.random()*1000-500), 0,  Math.floor(Math.random()*1000-500));
            let direction = target.subtract(this.zombieMesh.position);
                  
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.zombieMesh.rotation.y += alpha;
            this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
        } else {
            // else zombie continue move forward
            this.zombieMesh.locallyTranslate(new BABYLON.Vector3( this.speed*deltaTime/16, this.speed*deltaTime/16, 0));
        }
    }

}