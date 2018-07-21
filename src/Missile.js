import paper from 'paper';

export default class Missile {
  constructor(args) {
    this.strokeWidth = 0.8;

    this.x = args.x;
    this.y = args.y;
    this.ctx = args.ctx;
    this.target = args.target;

    this.view = paper.view;
    this.path = this.render();

    this.vel_x = 0;
    this.vel_y = 0;

    this.rot_accel = Math.random() * 0.1 + 0.1;
    this.rot_vel = 0;

    this.fly_speed = 0;
    this.max_fly_speed = 1 + this.length / 30
    this.accel = Math.random() * 0.4 + 0.1;
    this.rotation = 1;

    this.correctAngle(true);
  }

  render() {
    return(this.drawMissile(this.x, this.y));
  }

  correctAngle(constructor) {
    const p1 = this.path.cap.segments[0].point;
    const p2 = this.path.body.segments[0].point;
    const t = this.target;

      const a1 = Math.atan(((p2.y - p1.y)/(p2.x - p1.x)));
      let a2 = Math.atan(((t.y - p1.y)/(t.x - p1.x)));

      this.angle = a2; //Used for calculating vector components

      const rot = (a2 - a1 < a1 - a2) ? -1/100 : 1/100;
      const temp_rot_vel = rot * this.rot_accel + this.rot_vel;
      if(temp_rot_vel < this.max_fly_speed) {this.rot_vel = temp_rot_vel};

      let rotation = ((this.rot_vel) * 180/Math.PI);
      rotation = rotation / (this.fly_speed + 1);

      const adjuster = (p1.x < t.x) ? 0 : 180;

      if(constructor) {rotation = (a2 - a1)*180/Math.PI - adjuster;} // Starts off with missile pointing at player
        this.path.cap.rotate(rotation, this.path.cap.segments[0].point);
        this.path.body.rotate(rotation, this.path.cap.segments[0].point);
        this.path.bottom.rotate(rotation, this.path.cap.segments[0].point);
        this.path.flame.rotate(rotation, this.path.cap.segments[0].point);
  }

  delete() {
    this.path.bottom.remove();
    this.path.body.remove();
    this.path.cap.remove();
    this.path.flame.remove();
  }

  translate() {
    this.correctAngle(false); //Heatseaking doesn't work as well as I'd like

    const x_direction = (this.path.cap.segments[0].point.x < this.path.bottom.segments[0].point.x) ? -1 : 1;
    const y_direction = (this.path.cap.segments[0].point.y < this.path.bottom.segments[0].point.y) ? -1 : 1;

    const temp_vel_x = this.vel_x + this.accel * Math.abs(Math.cos(this.angle)) * x_direction;
    const temp_vel_y = this.vel_y + this.accel * Math.abs(Math.sin(this.angle)) * y_direction;

    if(temp_vel_x < this.max_fly_speed * 5) {
      this.vel_x = temp_vel_x;
    }
    if(temp_vel_y < this.max_fly_speed * 5) {
      this.vel_y = temp_vel_y;
    }

    const body = this.path.body;
    const bottom = this.path.bottom;
    const cap = this.path.cap;
    const flame = this.path.flame;

    const x = this.vel_x;
    const y = this.vel_y;

    body.translate(new paper.Point(x, y));
    bottom.translate(new paper.Point(x, y));
    cap.translate(new paper.Point(x, y));
    flame.translate(new paper.Point(x, y));
  }

  drawMissile(x, y) {
    const body = new paper.Path();

    this.length = 70 + Math.random() * 70;
    this.height = this.length / 10
    this.segments = 5 + Math.random() * 5
    body.add(new paper.Point(x, y));
    body.add(new paper.Point(x + this.length, y + 0.05 * this.height));
    body.add(new paper.Point(x + this.length, y + 0.95 * this.height));
    body.add(new paper.Point(x, y + this.height));

    const cap = new paper.Path();
    cap.add(new paper.Point(x + this.length, y + 0.05 * this.height));
    cap.add(new paper.Point(x + 1.3 * this.length, y + 0.5 * this.height));
    cap.add(new paper.Point(x + this.length, y + 0.95 * this.height));

    const bottom = new paper.Path();
    //left prong
    bottom.add(new paper.Point(x, y + this.height * 1.2));
    bottom.add(new paper.Point(x - 0.2 * this.length, y + this.height * 1.2));
    bottom.add(new paper.Point(x, y + this.height * 0.7));

    //middle prong
    bottom.add(new paper.Point(x - 0.14 * this.length, y + this.height * 0.5));
    bottom.add(new paper.Point(x, y + this.height * 0.3));

    //right prong
    bottom.add(new paper.Point(x - 0.2 * this.length, y - this.height * 0.2));
    bottom.add(new paper.Point(x, y - this.height * 0.2));

    const flame = new paper.Path();
    flame.add(new paper.Point(x, y + this.height * 1.2));
    flame.add(new paper.Point(x - 0.64 * this.length, y + this.height * 0.5));
    flame.add(new paper.Point(x, y - this.height * 0.2));

    body.fillColor = {
      gradient: {
          stops: ['#9aa5ab', '#dbecf6', '#9aa5ab'],
      },
      origin: new paper.Point(body.bounds.x, body.bounds.y),
      destination: new paper.Point(body.bounds.x, body.bounds.y + body.bounds.height)
    }
    body.strokeWidth = this.strokeWidth;
    body.closed = true;

    bottom.fillColor = 'red';
    bottom.closed = true;
    bottom.strokeWidth = this.strokeWidth;

    cap.fillColor = {
      gradient: {
          stops: ['red', '#ff7a7a', 'red'],
      },
      origin: new paper.Point(cap.bounds.x, cap.bounds.y),
      destination: new paper.Point(cap.bounds.x, cap.bounds.y + cap.bounds.height)
    }
    cap.closed = true;
    cap.strokeWidth = this.strokeWidth;

    flame.fillColor = 'yellow';
    flame.closed = true;
    flame.strokeWidth = this.strokeWidth;

    return({body: body, bottom: bottom, cap: cap, flame: flame});
  }
}