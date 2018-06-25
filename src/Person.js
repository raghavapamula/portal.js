import paper from 'paper';
import Blast from './Blast.js';

export default class Person {
  constructor(args) {
    this.strokeWidth = 1;

    this.x = args.x;
    this.y = args.y;
    this.ctx = args.ctx;
    
    this.inStep = false;
    this.rightFootFront = true;
    this.shooting = false;

    this.view = paper.view;
    //this.clear();
    this.render();
    this.walk_speed = 2;
  }

  drawPerson(x, y, width, height) {
    this.head = this.drawHead(x, y, width, height);
    this.body = this.drawBody(100);
    this.drawArms();
    this.drawLegs();
  }

  drawHead(x, y, width, height) {
    var center = this.view.center;
    var path = new paper.Path();
    path.strokeColor = 'black';
    path.strokeWidth = this.strokeWidth;
    path.add(new paper.Point(center.x - 15, center.y + 25));
    path.add(new paper.Point(center.x - 17, center.y - 25));
    path.add(new paper.Point(center.x + 17, center.y - 25));
    path.add(new paper.Point(center.x + 15, center.y + 25));
    path.closed = true;

    path.position.x -= 100;

    // Create a copy of the path and move it 100pt to the right:
    var copy = path.clone();
    path.remove();
    copy.position.x += 100;

    // Smooth the segments of the copy:
    copy.smooth();

    return copy;
  }

  drawBody(length) {
    const path = new paper.Path();
    const base_point = this.head.bounds.bottomCenter;
    const x = base_point.x;
    const y = base_point.y;
    path.strokeColor = 'black';
    path.strokeWidth = this.strokeWidth;
    path.add(new paper.Point(x, y));
    path.add(new paper.Point(x, y + length));
    return path;
  }

  drawArms() {
    this.left_arm = this.drawArm("left");
    this.right_arm = this.drawArm("right");
  }

  drawArm(type) {
    const upperArm = new paper.Path();
    var x = this.body.bounds.x;
    var y = this.body.bounds.y;
    const x_multiplier = (type === "right") ? 0.3: -0.3;

    upperArm.strokeColor = 'black';
    upperArm.strokeWidth = this.strokeWidth;
    upperArm.add(new paper.Point(x, y));
    x += x_multiplier*this.head.bounds.width;
    y += this.body.bounds.height * 0.6;
    upperArm.add(x, y);

    const foreArm = new paper.Path();
    foreArm.strokeColor = 'black';
    foreArm.strokeWidth = this.strokeWidth;
    foreArm.add(x, y);
    x += x_multiplier*this.head.bounds.width*0.2;
    y += this.body.bounds.height * 0.2;
    foreArm.add(x,y);

    return({upperArm:upperArm, foreArm:foreArm});
  }

  drawLegs() {
    this.left_leg = this.drawLeg("left");
    this.right_leg = this.drawLeg("right");
  }

  drawLeg(type) {
    const upperLeg = new paper.Path();
    const leg = (type === "left") ? this.left_leg : this.right_leg;
    var x = this.body.bounds.x;
    var y = this.body.bounds.y + this.body.bounds.height;
    const x_multiplier = (type === "right") ? 0.2: -0.2;

    upperLeg.strokeColor = 'black';
    upperLeg.strokeWidth = this.strokeWidth;
    upperLeg.add(new paper.Point(x, y));
    x += x_multiplier*this.head.bounds.width;
    y += this.body.bounds.height * 0.5;
    upperLeg.add(x, y);

    const lowerLeg = new paper.Path();
    lowerLeg.strokeColor = 'black';
    lowerLeg.strokeWidth = this.strokeWidth;
    lowerLeg.add(x, y);
    x += x_multiplier*this.head.bounds.width*0.3;
    y += this.body.bounds.height * 0.5;
    lowerLeg.add(x,y);

    return({upperLeg: upperLeg, lowerLeg: lowerLeg});
  }

  clear() {
    const ctx = this.ctx;
    if (!this.shooting) {
      ctx.clearRect(this.x - 5, this.y - this.height, this.totalWidth() + 5, this.totalHeight());
    } else {
      ctx.clearRect(this.x - 5, this.y - this.height, this.totalWidth() + this.right_arm.elbow * this.totalWidth() / 2 + 5, this.totalHeight());
    }
  }

  render() {
    this.drawPerson(this.x, this.y, this.width, this.height);
  }

  rotateArm(which, angle, direction, speed) {
    const arm = (which === "right") ? this.right_arm : this.left_arm;
    const arm_point = segment => arm.upperArm.segments[segment].point;
    const starting_angle = new paper.Point(arm_point(1).x - arm_point(0).x, arm_point(1).y - arm_point(0).y).angle;
    const interval = () => {
      let fulcrum = new paper.Point(arm.upperArm.bounds.x, arm.upperArm.bounds.y);
      let arm_vector = new paper.Point(arm_point(1).x - arm_point(0).x, arm_point(1).y - arm_point(0).y);
      if(arm_vector.angle <= 0) {
        const new_base = arm.foreArm.segments[1];
        return new_base;
      }
      else {
        arm.upperArm.rotate(-5, fulcrum);
        arm.foreArm.rotate(-5, fulcrum);
        requestAnimationFrame(interval);
      }
    }
    requestAnimationFrame(interval);
    return this.right_arm.foreArm.segments[1];
  }

  shoot() {
    if (this.shooting) {
      return;
    }
    this.shooting = true;
    const new_base = this.rotateArm("right", 0, -1, 3);
    //create bullet
    const base = new paper.Point(this.body.bounds.x + this.right_arm.upperArm.length + this.right_arm.foreArm.length, this.body.bounds.y);
    setTimeout(() => {const blast = new Blast({base: base, height: 100})}, 600);

    this.shooting = false;
  }

  rave() {
    if (this.shooting) {
      return;
    }
    this.shooting = true;

    this.rotateArm("right", 0, -1, 3);

    this.shooting = false;
  }

  rightLegForward() {
    this.right_leg.lowerLeg.rotate(-3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
    this.right_leg.upperLeg.rotate(-3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
  }

  rightLegBackward() {
    this.right_leg.upperLeg.rotate(3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
    this.right_leg.lowerLeg.rotate(3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
  }

  leftLegForward() {
    this.left_leg.lowerLeg.rotate(-3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
    this.left_leg.upperLeg.rotate(-3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
  }

  leftLegBackward() {
    this.left_leg.upperLeg.rotate(3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
    this.left_leg.lowerLeg.rotate(3, new paper.Point(this.body.bounds.x, this.body.bounds.y + this.body.bounds.height));
  }

  step(direction) {
    console.log("stepping " + direction);
    if (this.inStep) {
      return;
    }
    this.rightFootFront = !this.rightFootFront;
    this.inStep = true;
    const temp = this.x;
    const movements = () => {
      const multiplier = (direction === "forward" ? 1 : -1);
      this.x += multiplier * this.walk_speed;

      if (this.rightFootFront) {
        this.rightLegForward();
        this.leftLegBackward();
      } else {
        this.rightLegBackward();
        this.leftLegForward();
      }
      requestAnimationFrame(movements);
    }
    requestAnimationFrame(movements);
  }
}