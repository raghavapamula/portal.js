import paper from 'paper';

export default class Background {
    constructor(view) {
        this.view = view;
        this.render();
    }

    render() {
        this.drawSky();
        this.stars = []
        for(var i = 0; i < 300 + Math.random() * 1000; i++) {this.stars.push(this.drawStar());}
        this.drawMountains();
        for(var i = 0; i < Math.random() * 5; i++) {this.drawGround();}
    }

    drawGround() {
        const ground = new paper.Path();
        var y = this.view.bounds.height * 7/8;
        var center = this.view.center;
        ground.add(new paper.Point(0, y));
        const segments = Math.random() * 90 + 30;
        for(let i = 0; i <= segments + 1; i++) {
            let x = i * this.view.bounds.width / segments;
            let temp = new paper.Point(x, y + Math.sin(i) * Math.random() * 10);
            ground.add(temp);
        }
        ground.smooth();
        ground.add(new paper.Point(this.view.bounds.width, this.view.bounds.height));
        ground.add(new paper.Point(0, this.view.bounds.height));

        ground.fillColor = '#31b640';
        ground.closed = true;
        ground.strokeColor = 'green';
        ground.strokeWidth = 3;
    }

    drawMountains() {
        const mts = new paper.Path();
        var y = this.view.bounds.height * 7/8;
        var center = this.view.center;
        mts.add(new paper.Point(0, y));
        const segments = Math.random() * 30 + 15;
        for(let i = 0; i <= segments + 1; i++) {
            let x = i * this.view.bounds.width / segments;
            if( i == 1 ) {
                i -= 0.1;
            }
            let temp = new paper.Point(x, y + Math.sin(i) * Math.random() * 300 - this.view.bounds.height / 5);
            mts.add(temp);
        }
        mts.add(new paper.Point(this.view.bounds.width, this.view.bounds.height));
        mts.add(new paper.Point(0, this.view.bounds.height));

        var stops = []
        var colors = ["#8bc2e3", "#83c3ea", "#73bae5", "#317ba7"];

        for(let i = 0; i < 28 * Math.random() + 2; i++) {
            let color = colors[Math.floor(Math.random()*colors.length)];
            stops.push(color)
        }
        mts.fillColor = {
            gradient: {
                stops: stops
            },
            origin: new paper.Point(0,0),
            destination: new paper.Point(this.view.bounds.width, 0)
        }
        mts.closed = true;
        mts.strokeColor = 'white';
        mts.strokeWidth = 3;

        mts.translate(new paper.Point(0, -this.view.bounds.height * 1/8 + 25));
    }

    drawSky() {      
        var topLeft = new paper.Point(0, 0);
        var bottomRight = new paper.Point(this.view.bounds.width, this.view.bounds.height * 7/8);

        var sky = new paper.Path.Rectangle({
            topLeft: topLeft,
            bottomRight: bottomRight,
            // Fill the path with a gradient of three color stops
            // that runs between the two points we defined earlier:
            fillColor: {
                gradient: {
                    stops: ['#040085', '#600ccc']
                },
                origin: topLeft,
                destination: bottomRight
            }
        });
    }

    drawStar() {
        const x = this.view.bounds.width * Math.random();
        const y = this.view.bounds.height * Math.random();
        const radius = 0.05 + 3.25 * Math.random();
        var center = new paper.Point(x, y);

        var star = new paper.Path.Circle({
            center: center,
            radius: radius,
        });

        star.fillColor = {
            gradient: {
                stops: [['white', 0.5], ['yellow', 0.5]],
                radial: true
            },
            origin: star.position,
            destination: star.bounds.rightCenter
        }
    return star;
    }
}