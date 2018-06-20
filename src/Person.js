export default class Person {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.ctx = args.ctx;
    this.color = "white";
    this.width = 50;
    this.height = 50;
    this.walk_speed = 1.5;

    this.left_arm = {x:this.width/2, y: 0.75*this.height, width: 0.5*this.width, height: 1.25*this.height}; //X, Y, Width, Height
    this.right_arm = {x: this.width/2,y: 0.75*this.height, width: 0.5*this.width, height: 1.25*this.height}; //X, Y, Width, Height

    this.arm_length = 0; //Replaced during left arm construction;

    this.left_leg = {x:0, y:0, width:this.width, height:this.height};
    this.right_leg = {x:0+this.width, y:0, width:-this.width, height:this.height};

    this.inStep = false;
    this.rightFootFront = true;

    this.render();
  }

  drawPerson(x, y, width, height) {
    this.drawHead(x, y, width, height);
    this.drawBody(x, y, width, height);
    this.drawLeg('left');
    this.drawLeg('right');
    this.drawArms();
  }

  drawHead(x, y, width, height) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x,y);
    //bottom half
    ctx.bezierCurveTo(x,y+height,x+0.9*width,y+height,x+0.9*width,y);
    //top half
    ctx.bezierCurveTo(x+width,y-height,x-0.1*width,y-height,x,y);
    ctx.stroke();
    ctx.closePath();
  }

  drawBody(x, y, width, height) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x+width*0.5,y+0.75*height);
    ctx.lineTo(x+width*0.5,y+3*height);
    ctx.stroke();
    ctx.closePath();
  }

  drawArms() {
    this.drawLeftArm();
    this.drawRightArm();
  }

  drawLeftArm() {
    const ctx = this.ctx;
    const arms = this.left_arm;

    const from_x = this.x + arms.x;
    const from_y = this.y + arms.y;

    const to_x = this.x + arms.x - arms.width;
    const to_y = this.y + arms.y + arms.height;
    ctx.beginPath();
    ctx.moveTo(from_x, from_y);
    ctx.lineTo(to_x, to_y);
    //Pythagorean Theorem
    this.arm_length = Math.sqrt(Math.pow(to_x - from_x, 2) + Math.pow(to_y - from_y, 2));
    ctx.stroke();
    ctx.closePath();
  }

  drawRightArm() {
    const ctx = this.ctx;
    const arms = this.right_arm;

    const from_x = this.x + arms.x;
    const from_y = this.y + arms.y;

    const to_x = this.x + arms.x + arms.width;
    const to_y = this.y + arms.y + arms.height;

    ctx.beginPath();
    ctx.moveTo(from_x, from_y);
    ctx.lineTo(to_x, to_y);
    ctx.stroke();
    ctx.closePath();
  }

  drawLeg(type) {
    const leg = (type === "left") ? this.left_leg : this.right_leg;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(this.x + leg.x+ leg.width*0.5,this.y + leg.y+3*leg.height);
    ctx.lineTo(this.x + leg.x,this.y + leg.y+4.5*leg.height);
    ctx.stroke();
    ctx.closePath();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1500, 1500);
    this.drawPerson(this.x, this.y, this.width, this.height);
  }

  rotateArm(which, angle, direction) {
    const arm = (which === "right") ? this.right_arm : this.left_arm;
    let increment = direction * this.walk_speed;
    arm.width = Math.sin(angle) * this.arm_length;
    arm.height = Math.cos(angle) * this.arm_length;

    if(which === "right") {
      this.right_arm = arm;
    }
    else {
      this.left_arm = arm;
    }
  }

  shoot() {
    const store_arm = Object.assign({},this.right_arm);
    console.log(store_arm);
    const arm = this.right_arm;
    let right_arm_angle = Math.asin(this.right_arm.width/this.arm_length);
    const interval = async () => {
      this.rotateArm("right", right_arm_angle, 1);
      right_arm_angle += (this.walk_speed * Math.PI / 180);
      this.render();
      if(right_arm_angle >= Math.PI/2) {
        return;
      }
      requestAnimationFrame(interval);
    };

    var temp = new Promise(function(resolve,reject) {
      resolve(requestAnimationFrame(interval));
    });

    var self = this;

    temp.then(function(value) {
      self.right_arm = store_arm;
      self.render();
      alert("done");
    });
  }

  rightLegForward() {
    this.right_leg.width -= 2*this.walk_speed;
    this.right_leg.x += this.walk_speed;
  }

  rightLegBackward() {
    this.right_leg.width += 2*this.walk_speed;
    this.right_leg.x -= this.walk_speed;
  }

  leftLegForward() {
    this.left_leg.width -= 2*this.walk_speed;
    this.left_leg.x += this.walk_speed;
  }

  leftLegBackward() {
    this.left_leg.width += 2*this.walk_speed;
    this.left_leg.x -= this.walk_speed;
  }

  stepForward() {
    console.log("stepping forward");
    if(this.inStep) {
      return;
    }
    this.rightFootFront = !this.rightFootFront;
    this.inStep = true;
    const temp = this.x;
    const movements = () => {
      this.x += this.walk_speed;

      if(this.rightFootFront) {
        this.rightLegForward();
        this.leftLegBackward();
      }

      else {
        this.rightLegBackward();
        this.leftLegForward();
      }

      this.render();
      if(this.x - temp >= this.width) {
        this.inStep = false;
        return;
      }
      requestAnimationFrame(movements);
    }
    requestAnimationFrame(movements);
  }
}
