import paper from 'paper';

export default class Blast {
    constructor(args) {
        this.base = new paper.Point(args.base.x, args.base.y);
        this.height = args.height;
        this.blast = this.render();
        this.angle = args.angle;
        this.orientation = args.orientation;
        this.time = Date.now();
        this.deleted = false;
    }

    animate() {
        this.path2.visible = true;
        this.path2.translate(new paper.Point(this.orientation * 20 * Math.cos(this.angle),this.orientation * 20 * Math.sin(this.angle)));
        this.path2.scale(this.scale);
        this.pieces.unshift(this.path2.clone());
        this.path2.visible = false;
        this.pieces.map(((x, index) => x.scale(this.scale-index*0.0015)));
        if(this.pieces.length > 40) {
            this.pieces[this.pieces.length - 1].remove();
            this.pieces.pop();
        }
        this.scale -= 0.0004;
        if(this.scale <= 0.05) {
            this.pieces.map((x) => x.remove());
            return;
        }
        if(Date.now() - this.time >= 1999) {
            this.pieces.map(x => x.remove());
            this.pieces = [];
            return;
        }

        this.realPath.translate(new paper.Point(this.orientation * 20 * Math.cos(this.angle),this.orientation * 20 * Math.sin(this.angle)));
        this.realPath.scale(this.scale);
        this.realPieces.unshift(this.realPath.clone());
        this.realPieces.map(((x, index) => x.scale(this.scale-index*0.0015)));
        if(this.realPieces.length > 40) {
            this.realPieces[this.realPieces.length - 1].remove();
            this.realPieces.pop();
        }
        this.scale -= 0.0004;
        if(this.scale <= 0.05) {
            this.realPieces.map((x) => x.remove());
            return;
        }
        if(Date.now() - this.time >= 1500) {
            this.realPieces.map(x => {
                x.remove();
            });
            this.realPieces = [];
            this.deleted = true;
            return;
        }
    }

    remove() {
        for(let i=0; i<this.pieces.length; i++) {
            const piece = this.pieces[i];
            const realPiece = this.realPieces[i];
            try {
                piece.remove();
                realPiece.remove();
            } catch(e) {
                console.log(e);
            }
        }
        this.realPieces = [];
        this.realPieces = [];
    }

    hit(m) {
        for(let i=0; i<this.realPieces.length; i++) {
            const piece = this.realPieces[i];
            if(piece.getIntersections(m.path.cap).length > 0 || piece.getIntersections(m.path.body).length > 0 || piece.getIntersections(m.path.bottom).length > 0) {
                return true;
            }
        }
    }

    render() {
        const path = new paper.Path();
        this.realPath = new paper.Path();
        const realPath = this.realPath;
        path.fillColor = "#e7df15";
        path.visible = false;

        const addPoint = (point1, point2) => new paper.Point(point1.x + point2.x, point1.y + point2.y);

        path.add(addPoint(this.base, new paper.Point(-1.5, -this.height/5)));
        path.add(addPoint(this.base, new paper.Point(-1.5, this.height/5)));
        path.add(addPoint(this.base, new paper.Point(1.5, this.height/15)));
        path.add(addPoint(this.base, new paper.Point(1.5, -this.height/15)));

        realPath.add(addPoint(this.base, new paper.Point(-this.height/5, -this.height/5)));
        realPath.add(addPoint(this.base, new paper.Point(-this.height/5, this.height/5)));
        realPath.add(addPoint(this.base, new paper.Point(this.height/5, this.height/5)));
        realPath.add(addPoint(this.base, new paper.Point(this.height/5, -this.height/5)));

        realPath.closed = true;

        this.path2 = path.clone();
        path.remove();
        this.path2.visible = true;
        this.path2.smooth();
        const offset = this.base.x - this.path2.bounds.x;
        this.scale = 1;
        this.path2.translate(new paper.Point(offset, 0));
        this.realPath.translate(new paper.Point(offset, 0));
        this.pieces = [];
        this.realPieces = [];
        return this.path2;
    }
}