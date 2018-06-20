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
    this.shooting = false;

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
    if(this.shooting) {
      return;
    }
    this.shooting = true;
    const temp_width = this.right_arm.width;
    const temp_height = this.right_arm.height;
    
    const arm = this.right_arm;
    let right_arm_angle = Math.asin(this.right_arm.width/this.arm_length);
    let interval = () => {
      this.rotateArm("right", right_arm_angle, 1);
      right_arm_angle += (this.walk_speed * Math.PI / 180);
      this.render();
      if(right_arm_angle >= Math.PI/2) {
        return;
      }
      requestAnimationFrame(interval);
    }

    requestAnimationFrame(interval);
    
    setTimeout(() => {
      const ctx = this.ctx;
      var x = this.x + this.right_arm.width + 5 + this.right_arm.x;
      var y = this.y + this.right_arm.height + this.right_arm.y;

      this.right_arm.width = temp_width;
      this.right_arm.height = temp_height;
      this.render();
      this.shooting = false;

      ctx.beginPath();
      let interval = () => {
      ctx.beginPath();
      ctx.bezierCurveTo(x, y, x+5, y+5, x+10, y);
      ctx.bezierCurveTo(x+10, y, x+5, y-5, x, y);
      ctx.fill();
      ctx.closePath();
      x+= this.walk_speed * 4;
      ctx.clearRect(x-25,y-10,15,20);
      requestAnimationFrame(interval);
      }
      requestAnimationFrame(interval);
    },1000)
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
