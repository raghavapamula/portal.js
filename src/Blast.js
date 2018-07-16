import paper from 'paper';

export default class Blast {
    constructor(args) {
        this.base = new paper.Point(args.base.x, args.base.y);
        this.height = args.height;
        this.blast = this.render();
        this.angle = args.angle;
        this.orientation = args.orientation;
    }

    render() {
        const path = new paper.Path();
        path.fillColor = "blue";
        path.visible = false;

        const addPoint = (point1, point2) => new paper.Point(point1.x + point2.x, point1.y + point2.y);

        path.add(addPoint(this.base, new paper.Point(0, -this.height/5)));
        path.add(addPoint(this.base, new paper.Point(0, this.height/5)));
        path.add(addPoint(this.base, new paper.Point(1, this.height/15)));
        path.add(addPoint(this.base, new paper.Point(1, -this.height/15)));
        path.closed = true;
        let path2 = path.clone();
        path.remove();
        path2.visible = true;
        path2.smooth();
        const offset = this.base.x - path2.bounds.x;
        let scale = 1;
        path2.translate(new paper.Point(offset, 0));
        let pieces = [];
        const animate = () => {
            path2.visible = true;
            path2.translate(new paper.Point(this.orientation * 20 * Math.cos(this.angle),this.orientation * 20 * Math.sin(this.angle)));
            path2.scale(scale);
            pieces.unshift(path2.clone());
            path2.visible = false;
            pieces.map(((x, index) => x.scale(scale-index*0.0015)));
            if(pieces.length > 40) {
                pieces[pieces.length - 1].remove();
                pieces.pop();
            }
            scale = scale - 0.0004;
            if(scale <= 0.05) {
                return;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        return path2;
    }
}