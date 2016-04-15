/**
 * Horizontal and vertical numeric measurements.
 */
interface IDirectionMeasurements {
    /**
     * The horizontal measurement.
     */
    horizontal: number;

    /**
     * The vertical measurement.
     */
    vertical: number;
}

(() => {
    /**
     * Polyfill for window.requestAnimationFrame, which runs a callback
     * at the next available animation frame (visual screen update).
     */
    const requestAnimationFrame = (
        window.requestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).msRequestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (callback => setTimeout(callback, 1000 / 60)));

    /**
     * A summary of position and velocity for a rectangle. 
     */
    class BoundingBox {
        /**
         * Where this is, relative from the top-left corner of the page.
         */
        public position: IDirectionMeasurements;

        /**
         * How big this element should be.
         */
        private size: IDirectionMeasurements;

        /**
         * How much this element should move each tick.
         */
        private velocity: IDirectionMeasurements;

        /**
         * Initializes a new instance of the BoundingBox class.
         * 
         * @param width   How wide it should be.
         * @param height   How tall it should be.
         */
        constructor(width: number, height: number) {
            this.position = {
                horizontal: randomBetween(0, innerWidth - width),
                vertical: randomBetween(0, innerHeight - height)
            };

            this.size = { 
                horizontal: width,
                vertical: height 
            };

            this.velocity = {
                horizontal: (Math.random() >= .5) ? 3.5 : -3.5,
                vertical: (Math.random() >= .5) ? 3.5 : -3.5
            };
        }

        /**
         * Adjusts the position by the current velocity. 
         */
        public tickVelocity(): void {
            this.position.horizontal += this.velocity.horizontal;
            this.position.vertical += this.velocity.vertical;
        }

        /**
         * Adjusts position to fit within boundaries if overflowing.
         * 
         * @param direction   Which direction to adjust for.
         * @param boundary   How much space is available in the direction.
         */
        public checkBoundaries(direction: "horizontal" | "vertical", boundary: number): void {
            if (this.position[direction] < 0) {
                this.position[direction] = 0;
                this.velocity[direction] = Math.abs(this.velocity[direction]);
            }

            if (this.position[direction] + this.size[direction] > boundary) {
                this.position[direction] = boundary - this.size[direction];
                this.velocity[direction] = -Math.abs(this.velocity[direction]);
            }
        }
    }

    /**
     * Generates a random number between two numbers.
     * 
     * @param minimum   A minimum, inclusive.
     * @param minimum   A maximum, exclusive.
     * @returns A number between minimum and maximum.
     */
    function randomBetween(minimum: number, maximum: number): number {
        return Math.floor(Math.random() * (maximum - minimum)) + minimum;
    }

    /**
     * Initializes the rectangle and generates its bounding box.
     * 
     * @param rectangle   An element to initialize.
     * @returns A new bounding box for the element.
     */
    function initializeRectangleBox(rectangle: HTMLElement): BoundingBox {
        const width: number = randomBetween(35, 70);
        const height: number = randomBetween(35, 70);

        rectangle.style.top = "0px";
        rectangle.style.left = "0px";
        rectangle.style.width = `${width}px`;
        rectangle.style.height = `${height}px`;

        return new BoundingBox(width, height);
    }

    document.onreadystatechange = () => {
        if (document.readyState !== "interactive") {
            return;
        }

        let rectangle = document.getElementById("rectangle");
        let boundingBox = initializeRectangleBox(rectangle);

        /**
         * Moves the bounding box for its velocity and checks its boundaries.
         */
        function tick() {
            boundingBox.tickVelocity();

            boundingBox.checkBoundaries("horizontal", innerWidth);
            boundingBox.checkBoundaries("vertical", innerHeight);

            rectangle.style.left = boundingBox.position.horizontal + "px";
            rectangle.style.top = boundingBox.position.vertical + "px";

            requestAnimationFrame(tick);
        }

        tick();
        rectangle.className = "active";
    };
})();
