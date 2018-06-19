export default class Person {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.ctx = args.ctx;
    this.color = "white";
    this.width = 50;
    this.height = 50;

    this.left_arm = [this.x + this.width/2,this.y + 0.75*this.height, this.width, this.height]; //X, Y, Width, Height
    this.right_arm = [this.x + this.width/2,this.y + 0.75*this.height, this.width, this.height]; //X, Y, Width, Height

    this.left_leg = {x:this.x, y:this.y, width:this.width, height:this.height};
    this.right_leg = {x:this.x+this.width, y:this.y, width:-this.width, height:this.height};

    this.inAnimation = false;

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

    ctx.beginPath();
    ctx.moveTo(arms[0], arms[1]);
    ctx.lineTo(arms[0]-0.5*arms[2], arms[1]+1.25*arms[3]);
    ctx.stroke();
    ctx.closePath();
  }

  drawRightArm() {
    const ctx = this.ctx;
    const arms = this.right_arm;

    ctx.beginPath();
    ctx.moveTo(arms[0], arms[1]);
    ctx.lineTo(arms[0]+0.5*arms[2], arms[1]+1.25*arms[3]);
    ctx.stroke();
    ctx.closePath();
  }

  drawLeg(type) {
    const leg = (type === "left") ? this.left_leg : this.right_leg;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(leg.x+leg.width*0.5,leg.y+3*leg.height);
    ctx.lineTo(leg.x,leg.y+4.5*leg.height);
    ctx.stroke();
    ctx.closePath();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1500, 1500);
    this.drawPerson(this.x, this.y, this.width, this.height);
  }

  shoot() {
    const arms = this.right_arm;
    const length_square = 2*arms[3]*arms[3] + 2*arms[2]*arms[2];
    const interval = setInterval(() => {
      arms[3] = arms[3] - 5;
      arms[2] = Math.sqrt(length_square - arms[3]*arms[3]); //Pythagorean Theorem
      this.arms = arms;
      this.render();
      if(arms[3] <= 0) {
        clearInterval(interval);
      }
    },60);
  }

  stepForward() {
    const temp = this.x;
    const interval = setInterval(() => {
      this.x += 1;
      this.left_leg.width += 1;
      this.render();
      if(this.x - temp >= this.width) {
        clearInterval(interval);
      }
    },10);
  }
}
