import paper from 'paper';
import Blast from './Blast.js';

let mouse_x = 0;
let mouse_y = 0;

export default class Person {
  constructor(args) {
    this.strokeWidth = 2.5;

    this.ctx = args.ctx;
    this.center = args.center;

    this.fillColor = "#b8b6af";
    this.strokeColor = "#505150";
    this.inStep = [false, "forward"];
    this.rightFootFront = true;
    this.shooting = false;

    this.view = paper.view;
    this.render();
    this.walk_speed = 10;

    this.right = false;
    this.left = false;
    this.blasts = []

    // keeps track of player movements for next rerender
    this.step_forward = false;
    this.step_backward = false;

    // keeps track of which direction player is facing
    this.orientation = "right";
  }

  drawPerson(x, y, width, height) {
    this.head = this.drawHead(x, y, width, height);
    this.body = this.drawBody(100);
    this.drawArms();
    this.drawLegs();
    const right_leg_point = (n) => this.right_leg.upperLeg.segments[n].point;
    const left_leg_point = (n) => this.left_leg.upperLeg.segments[n].point;
    this.left_angle = () => new paper.Point(left_leg_point(1).x - left_leg_point(0).x, left_leg_point(1).y - left_leg_point(0).y).angle;
    this.right_angle = () => new paper.Point(right_leg_point(1).x - right_leg_point(0).x, right_leg_point(1).y - right_leg_point(0).y).angle;
    this.starting_left_leg_angle = this.left_angle();
    this.starting_right_leg_angle = this.right_angle();
  }

  drawHead(x, y, width, height) {
    var center = this.center;
    var path = new paper.Path();
    path.strokeWidth = this.strokeWidth;
    path.strokeColor = this.strokeColor;
    path.add(new paper.Point(center.x - 15, center.y + 25));
    path.add(new paper.Point(center.x - 17, center.y - 25));
    path.add(new paper.Point(center.x + 17, center.y - 25));
    path.add(new paper.Point(center.x + 15, center.y + 25));
    path.closed = true;
    path.fillColor = this.fillColor;

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
    path.strokeWidth = this.strokeWidth;
    path.add(new paper.Point(x, y));
    path.add(new paper.Point(x, y + length));
    path.strokeColor = this.strokeColor;
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

    upperArm.strokeColor = this.strokeColor;
    upperArm.strokeWidth = this.strokeWidth;
    upperArm.add(new paper.Point(x, y));
    x += x_multiplier*this.head.bounds.width;
    y += this.body.bounds.height * 0.6;
    upperArm.add(x, y);

    const foreArm = new paper.Path();
    foreArm.strokeColor = this.strokeColor;
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

    upperLeg.strokeColor = this.strokeColor;
    upperLeg.strokeWidth = this.strokeWidth;
    upperLeg.add(new paper.Point(x, y));
    x += x_multiplier*this.head.bounds.width;
    y += this.body.bounds.height * 0.5;
    upperLeg.add(x, y);

    const lowerLeg = new paper.Path();
    lowerLeg.strokeColor = this.strokeColor;
    lowerLeg.strokeWidth = this.strokeWidth;
    lowerLeg.add(x, y);
    x += x_multiplier*this.head.bounds.width*0.3;
    y += this.body.bounds.height * 0.5;
    lowerLeg.add(x,y);

    return({upperLeg: upperLeg, lowerLeg: lowerLeg});
  }

  render() {
    this.drawPerson(this.x, this.y, this.width, this.height);
  }

  positionArm(mouse_x, mouse_y) {
    let fulcrum = new paper.Point(this.body.bounds.x, this.body.bounds.y);
    const orientation = (mouse_x >= this.body.bounds.x) ? "right" : "left";
    var arm = this.right_arm;
    if(orientation == "right") {
      if(orientation !== this.orientation) {
        this.orientation = orientation;
        this.left_arm.upperArm.remove();
        this.left_arm.foreArm.remove();
        this.left_arm = this.drawArm("left");
      }
    }
    else {
      arm = this.left_arm;
      if(orientation !== this.orientation) {
        this.orientation = orientation;
        this.right_arm.upperArm.remove();
        this.right_arm.foreArm.remove();
        this.right_arm = this.drawArm("right");
      }
    }
    const arm_point = segment => arm.upperArm.segments[segment].point;
    const starting_angle = new paper.Point(arm_point(1).x - arm_point(0).x, arm_point(1).y - arm_point(0).y).angle;
    const mouse_angle = new paper.Point(mouse_x - arm_point(0).x, mouse_y - arm_point(0).y).angle;
    const rotation = mouse_angle - starting_angle;
    arm.upperArm.rotate(rotation, fulcrum);
    arm.foreArm.rotate(rotation, fulcrum);
  }

  shoot(mouse_x, mouse_y) {
    if (this.shooting) {
      return;
    }
    const orientation = 1;
    const arm_point = segment => this.right_arm.foreArm.segments[segment].point;
    const starting_angle = new paper.Point(arm_point(1).x - arm_point(0).x, arm_point(1).y - arm_point(0).y).angle;
    const mouse_point = new paper.Point(mouse_x - this.body.bounds.x, mouse_y - this.body.bounds.y);
    let angle = 0;
    if(mouse_point.x != 0) {
      angle = Math.atan(mouse_point.y/mouse_point.x);
    } else {
      angle = Math.PI/2;
    }
    this.shooting = true;
    const which = orientation ? "right": "left";
    const arm = orientation ? this.right_arm : this.left_arm;
    let direction = (mouse_x >= this.body.bounds.x) ? 1 : -1;
    const base = new paper.Point(this.body.bounds.x + direction * Math.cos(angle) * (this.right_arm.upperArm.length + this.right_arm.foreArm.length), this.body.bounds.y + direction * Math.sin(angle) * (this.right_arm.upperArm.length + this.right_arm.foreArm.length));
    setTimeout(async () => {
      this.blasts.push(new Blast({base: base, height: 100, angle: angle, orientation: direction}));
      setTimeout(() => {
        this.shooting = false;
      }, 150);
    },
    100);
  }

  rightLegForward() {
    const x = this.body.bounds.x;
    const y = this.body.bounds.y + this.body.bounds.height;
    const x2 = this.right_leg.upperLeg.segments[1].point.x;
    const y2 = this.right_leg.upperLeg.segments[1].point.y;
    this.right_leg.lowerLeg.rotate(-2, new paper.Point(x, y));
    this.right_leg.upperLeg.rotate(-2, new paper.Point(x, y));
    this.right_leg.lowerLeg.rotate(4/3, new paper.Point(x2, y2));
    this.right_leg.lowerLeg.bounds.y = this.right_leg.upperLeg.segments[1].point.y;
  }

  rightLegBackward() {
    const x = this.body.bounds.x;
    const y = this.body.bounds.y + this.body.bounds.height;
    const x2 = this.right_leg.upperLeg.segments[1].point.x;
    const y2 = this.right_leg.upperLeg.segments[1].point.y;
    this.right_leg.lowerLeg.rotate(2, new paper.Point(x, y));
    this.right_leg.upperLeg.rotate(2, new paper.Point(x, y));
    this.right_leg.lowerLeg.rotate(-4/3, new paper.Point(x2, y2));
    this.right_leg.lowerLeg.bounds.y = this.right_leg.upperLeg.segments[1].point.y;
  }

  leftLegForward() {
    const x = this.body.bounds.x;
    const y = this.body.bounds.y + this.body.bounds.height;
    const x2 = this.left_leg.upperLeg.segments[1].point.x;
    const y2 = this.left_leg.upperLeg.segments[1].point.y;
    this.left_leg.lowerLeg.rotate(-2, new paper.Point(x, y));
    this.left_leg.upperLeg.rotate(-2, new paper.Point(x, y));
    this.left_leg.lowerLeg.rotate(4/3, new paper.Point(x2, y2));
    this.left_leg.lowerLeg.bounds.y = this.left_leg.upperLeg.segments[1].point.y;
  }

  leftLegBackward() {
    const x = this.body.bounds.x;
    const y = this.body.bounds.y + this.body.bounds.height;
    const x2 = this.left_leg.upperLeg.segments[1].point.x;
    const y2 = this.left_leg.upperLeg.segments[1].point.y;
    this.left_leg.lowerLeg.rotate(2, new paper.Point(x, y));
    this.left_leg.upperLeg.rotate(2, new paper.Point(x, y));
    this.left_leg.lowerLeg.rotate(-4/3, new paper.Point(x2, y2));
    this.left_leg.lowerLeg.bounds.y = this.left_leg.upperLeg.segments[1].point.y;
  }

  step(direction) {
    console.log("stepping " + direction);
    if (!this.inStep) {
      this.inStep = [true, direction]
    }

    const movements = () => {
      const multiplier = (direction === "forward" ? 1 : -1);
      const x = multiplier * this.walk_speed;

      this.head.translate(new paper.Point(x, 0));
      this.body.translate(new paper.Point(x, 0));
      this.right_leg.upperLeg.translate(new paper.Point(x, 0));
      this.right_leg.lowerLeg.translate(new paper.Point(x, 0));
      this.left_leg.upperLeg.translate(new paper.Point(x, 0));
      this.left_leg.lowerLeg.translate(new paper.Point(x, 0));
      this.right_arm.foreArm.translate(new paper.Point(x, 0));
      this.right_arm.upperArm.translate(new paper.Point(x, 0));
      this.left_arm.foreArm.translate(new paper.Point(x, 0));
      this.left_arm.upperArm.translate(new paper.Point(x, 0));

      if (!this.rightFootFront) {
        if(this.right_angle() < 100) {
          this.rightLegBackward();
          this.leftLegForward();
          return;
        }
        else {
          this.inStep = false;
          this.rightFootFront = !this.rightFootFront;
          return;
        }
      } else {
        if(this.left_angle() < 100) {
          this.rightLegForward();
          this.leftLegBackward();
          return;
        }
        else {
          this.inStep = false;
          this.rightFootFront = !this.rightFootFront;
          return;
        }
      }
    }
    movements();
    return;
  }
}