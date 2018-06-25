import paper from 'paper';

export default class Blast {
    constructor(args) {
        this.base = new paper.Point(args.base.x, args.base.y);
        this.height = args.height;
        this.blast = this.render();
    }

    render() {
        const path = new paper.Path();
        path.fillColor = "blue";
        path.visible = false;

        const addPoint = (point1, point2) => new paper.Point(point1.x + point2.x, point1.y + point2.y);

        path.add(addPoint(this.base, new paper.Point(0, -this.height)));
        path.add(addPoint(this.base, new paper.Point(0, this.height)));
        path.add(addPoint(this.base, new paper.Point(this.height, this.height)));
        path.add(addPoint(this.base, new paper.Point(this.height, -this.height)));
        path.closed = true;
        const path2 = path.clone();
        path.remove();

        path2.visible = true;
        path2.smooth();
        const offset = this.base.x - path2.bounds.x;
        path2.translate(new paper.Point(offset, 0));
        const animate = () => {
            var clone = path2.clone();
            path2.translate(new paper.Point(4,0));
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        return path2;
    }
}