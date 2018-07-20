import paper from 'paper';

export default class Person {
  constructor(args) {
    this.strokeWidth = 0.8;

    this.x = args.x;
    this.y = args.y;
    this.ctx = args.ctx;

    this.view = paper.view;
    this.render();
    this.walk_speed = 5;
  }

  drawEnemy(x, y, width, height) {
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
}