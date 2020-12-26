import React from 'react';
import roverImage from "./rover.svg"
import {connect} from "react-redux";
import {openReportModal, setCollisionsDetected} from "../redux/actions";
import {CARDINAL_POSITIONS, SPEED} from "../helpers/constants";

const styles = {
    container: {
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: '100%',
        width: '100%'
    },
    mars: {
        background: '#DD6A67'
    }
}


class MarsMission extends React.Component {
    constructor() {
        super();
        this.state = {
            canvas: null,
            rover: null,
            hitBox: null,
            mission: null,
            isImminentCollision: false,
            activeCommand: 0,
            detectedObjects: null,
            obstacles: []
        }
    }
    componentDidMount() {
        this.setState({
            canvas: this.refs.canvas.getContext("2d")
        });

        setTimeout(() => {
            this.generateObstacles();
            this.generateRover();
        }, 0)
    }

    nextCoordinate = (cardinalPos, x, y) => {
        switch (cardinalPos) {
            case 0:
                return {x, y: y - SPEED}
            case 1:
                return {x: x + SPEED, y}
            case 2:
                return {x, y: y + SPEED}
            case 3:
                return {x: x - SPEED, y}
            default:
                return {x,y}
        }
    }

    setRoverState = (field) => {
        this.setState(state => {
            return {
                rover: {
                    ...state.rover,
                    ...field
                },
                hitBox: {
                    ...state.hitBox,
                    ...field
                }
            }
        })
    }

    executeSequence = () => {
        const {isImminentCollision, activeCommand, detectedObjects} = this.state;
        const {dispatch, commands} = this.props;

        if(isImminentCollision) {
            console.log('COLLISION DETECTED...')
            console.log('END SEQUENCE...')
            dispatch(setCollisionsDetected({detectedObjects}))
            dispatch(openReportModal());
            return;
        }

        if(activeCommand > commands.length - 1) {
            console.log('SEQUENCE COMPLETE...')
            dispatch(openReportModal());
            return;
        }
        this.move(commands[activeCommand]);

        this.setState({
            activeCommand: activeCommand + 1
        });

        setTimeout(() => this.executeSequence(), 500);
    }

    move = (command) => {
        const {rover} = this.state;

        console.log(`rover-log(${new Date().getTime()}): executing command --- ${command}`)

        if(command === 'L') {
            let nextPos = rover.cardinalPos - 1;

            if(nextPos < 0) {
                nextPos = 3;
            }
            this.setRoverState({cardinalPos: nextPos})
        }

        if(command === 'R') {
            let nextPos = rover.cardinalPos + 1;

            if(nextPos > 3) {
                nextPos = 0;
            }
            this.setRoverState({cardinalPos: nextPos})
        }

        if(command === 'F'){
            const direction = this.nextCoordinate(rover.cardinalPos, parseInt(rover.x), parseInt(rover.y));
            this.setRoverState({x: direction.x, y: direction.y})
        }
    }

    draw = () => {
        const {canvas} = this.state;
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        this.renderObstacles();
        this.renderRover();
        this.detectCollision();
    }

    detectCollision = () => {
        const {obstacles, hitBox, mission} = this.state;
        if(obstacles.length === 0 || !hitBox) return false;
        const hits = obstacles.filter(obs => this.detectHitBoxCollision(hitBox, obs))
        if(hits.length >= 1) {
            clearInterval(mission)
            this.setState({
                isImminentCollision: true,
                detectedObjects: hits
            })
        }
    }

    detectHitBoxCollision = (hitBox, obs) => {
        let distX = Math.abs(hitBox.x - obs.x - obs.w / 2);
        let distY = Math.abs(hitBox.y - obs.y - obs.h / 2);

        if (distX > (obs.w / 2 + hitBox.r)) {
            return false;
        }
        if (distY > (obs.h / 2 + hitBox.r)) {
            return false;
        }

        if (distX <= (obs.w / 2)) {
            return true;
        }
        if (distY <= (obs.h / 2)) {
            return true;
        }

        let dx = distX - obs.w / 2;
        let dy = distY - obs.h / 2;
        return (dx * dx + dy * dy <= (hitBox.r * hitBox.r));
    }

    randInRange = (min, max) => {
        return Math.floor(Math.random() * max) + min
    }

    generateObstacles = () => {
        const {canvas} = this.state;
        const count = this.randInRange(1, 10);
        const w = 40;
        const h = 40;

        let obstacles = [];

        for(let i = 0; i < count; i++) {
            obstacles.push({
                x: this.randInRange(0, canvas.canvas.width - w),
                y: this.randInRange(0, canvas.canvas.height - h),
                color: '#A12E2B',
                w,
                h
            })
        }
        this.setState({obstacles})
    }

    generateRover = () => {
        const {startPos, orientation} = this.props;
        const img = new Image();
        img.src = roverImage;
        const x = startPos.x;
        const y = startPos.y;
        this.generateHitBox(x, y)
        img.onload = () => {
            this.setState({
                rover: {
                    x,
                    y,
                    w: 50,
                    h: 50,
                    cardinalPos: orientation,
                    orientation: 'N',
                    icon: img
                }
            });

            const mission = setInterval(() => this.draw(), 1000/60);

            this.setState({mission});

            setTimeout(() => this.executeSequence(), 1000);
        };
    }

    generateHitBox = (x,y) => {
        const r = 35;

        this.setState({
            hitBox: {x, y, r}
        });
    }

    renderRover =  () => {
        const {canvas, rover} = this.state;

        const centerX = rover.w / 2.0;
        const centerY = rover.h / 2.0;

        this.renderHitBox();



        // save context's current transform state
        canvas.save();

        // move context's origin to image position
        canvas.translate( rover.x, rover.y );

        // apply transformations
        canvas.rotate(CARDINAL_POSITIONS[rover.cardinalPos] * Math.PI / 180);
        canvas.scale( 1, 1 );

        // draw image centered on its position
        canvas.drawImage( rover.icon, -centerX, -centerY, rover.w, rover.h );

        // restore context's previous transform state
        canvas.restore();
    };

    renderHitBox = () => {
        const {canvas, hitBox, rover} = this.state;
        canvas.save();
        canvas.translate( hitBox.x, hitBox.y );
        canvas.beginPath();
        canvas.arc(rover.h / 20, rover.w / 20, hitBox.r, 0, Math.PI * 2);
        canvas.strokeStyle = "rgba(255, 255, 255, 0)";
        canvas.stroke()
        canvas.closePath();
        canvas.restore();
    }

    renderObstacles = () => {
        const {canvas, obstacles} = this.state;
        obstacles.forEach(obstacle => {
            canvas.fillStyle = obstacle.color;
            canvas.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        })
    }
    
    render() {
        return (
            <div style={styles.container}>
                <canvas ref="canvas" id="myCanvas" width="600" height="600" style={styles.mars}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    commands: state.control.commands,
    startPos: state.control.pos,
    orientation: state.control.orientation
});

export default connect(mapStateToProps)(MarsMission);