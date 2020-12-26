import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import missionControlStyles from "./styles/missionControlStyles";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import {setMissionControl, setMissionView} from "../redux/actions";
import {INSTRUCTIONS, COORDINATES, POSITION, COMMANDS} from "../helpers/constants";
import cardinalDirectionToOrientation from "../helpers/cardinalDirectionToOrientation";

class MissionControl extends React.Component {
    constructor() {
        super();
        this.state = {
            view: INSTRUCTIONS,
            commandInput: '',
            form: {
                x: null,
                y: null,
                orientation: null,
                commands: []
            }
        }
    }
    moveToView = view => {
        this.setState({view})
    }
    renderInstructions = () => {
        return (
            <div>
                <h3 style={{color: '#3BB9FF'}}>Welcome To Mission Mars</h3>
                <p>Your Task:</p>
                <p>Provide the rover with a starting position (x,y) on Mars. Pass a list of movement instructions to the rover, (E.g.) FFRRFFFRL. The rover will detect and report obstacles if it is compromised.</p>
                <p>Good Luck</p>
                <Button onClick={() => this.moveToView(COORDINATES)} style={{background: '#3BB9FF', marginBottom: 15}} variant="contained" color="primary">
                    Start
                </Button>
            </div>
        )
    }
    setField = field => {
        this.setState(state => {
            return {
                ...state,
                form: {
                    ...state.form,
                    ...field
                }
            }
        })
    }
    isInvalidValidCoordinates = () => {
        const {form} = this.state;

        if(!form.x || !form.y) return true;

        return form.y && form.y < 0 || form.y && form.y > 600 || form.x && form.x < 0 || form.x && form.x > 600;


    }
    renderCoordinateForm = () => {
        return (
            <div>
                <h3>Choose your coordinates</h3>
                <p>Your rover operates on a weird world that is 600x600 pixels. Add an X and Y coordinate between 0 and 600 respectfully.</p>
                <div>
                    <TextField
                        id="outlined-basic"
                        label="Pos: X"
                        variant="outlined"
                        type='number'
                        InputProps={{
                            inputProps: {
                                max: 600, min: 1
                            }
                        }}
                        onChange={(event) => this.setField({x: event.target.value})}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Pos: Y"
                        variant="outlined"
                        type='number'
                        InputProps={{
                            inputProps: {
                                max: 600, min: 1
                            }
                        }}
                        style={{marginLeft: 15}}
                        onChange={(event) => this.setField({y: event.target.value})}
                    />
                </div>
                <Button disabled={this.isInvalidValidCoordinates()} onClick={() => this.moveToView(POSITION)} style={{background: '#3BB9FF', marginBottom: 15, marginTop: 15}} variant="contained" color="primary">
                    Next
                </Button>
            </div>
        )
    }
    addInput = () => {
        this.setState(state => {
            return {
                ...state,
                form: {
                    ...state.form,
                    commands: [...state.form.commands, ...[state.commandInput.toUpperCase()]]
                }
            }
        })
    }
    removeLastInput = () => {
        this.setState(state => {
            return {
                ...state,
                form: {
                    ...state.form,
                    commands: state.form.commands.slice(0, -1)
                }
            }
        })
    }
    executeCommands = () => {
        const {dispatch} = this.props;
        const {form} = this.state;
        dispatch(setMissionControl(form))
        setTimeout(() => setMissionView(), 0);
    }
    renderCommandForm = () => {
        const {form, commandInput} = this.state;
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.flexWrap} style={{marginBottom: 15}}>
                    {form.commands.map((command, index) => (
                        <Chip style={{marginRight: 15, marginBottom: 15}} key={index} label={command} />
                    ))}
                    {form.commands.length > 0 && <Chip
                        style={{marginBottom: 15}}
                        label=" <---- delete"
                        onClick={this.removeLastInput}
                    />}
                </div>
                <p>Provide the mars rover with a list of instructions. Instructions may include: F (forward), L (left), R (right). </p>
                <div className={classes.flexRow}>
                    <TextField value={commandInput} onChange={(e) => this.setState({commandInput: e.target.value})} id="outlined-basic" label="Outlined" variant="outlined" />
                    <Button disabled={!commandInput || (commandInput.toUpperCase() !== 'F' && commandInput.toUpperCase() !== 'L' && commandInput.toUpperCase() !== 'R')}
                            onClick={() => this.addInput()}
                            style={{background: '#3BB9FF', marginBottom: 15, marginTop: 15, marginLeft: 15}}
                            variant="contained" color="primary">
                        Add
                    </Button>
                </div>
                <Button disabled={form.commands.length === 0} onClick={() => this.executeCommands()}
                        style={{background: '#3BB9FF', marginBottom: 15, marginTop: 15}} variant="contained" color="primary">
                    Initiate Rover
                </Button>
            </div>
        )
    }
    submitOrientation = () => {
        const {form} = this.state;
        this.setField({orientation: cardinalDirectionToOrientation(form.orientation)})
        this.moveToView(COMMANDS)
    }
    renderPositionForm = () => {
        const {form} = this.state;
        return (
            <div>
                <p>Set the rover's landing orientation. You may use any of the four cardinal directions, N, S, E, or W.</p>
                <TextField onChange={(e) => this.setField({orientation: e.target.value.toUpperCase()})} id="outlined-basic" label="Outlined" variant="outlined" />
                <div>
                    <Button disabled={!form.orientation || (form.orientation.toUpperCase() !== 'N' && form.orientation.toUpperCase() !== 'S' && form.orientation.toUpperCase() !== 'E' && form.orientation.toUpperCase() !== 'W')}
                            onClick={() => this.submitOrientation()}
                            style={{background: '#3BB9FF', marginBottom: 15, marginTop: 15, marginLeft: 15}}
                            variant="contained" color="primary">
                        Next
                    </Button>
                </div>
            </div>
        )
    }
    render() {
        const {classes} = this.props;
        const {view} = this.state;
        return (
            <div className={classes.container}>
                <Paper className={classes.paper} elevation={3}>
                    {view === INSTRUCTIONS && this.renderInstructions()}
                    {view === COORDINATES && this.renderCoordinateForm()}
                    {view === POSITION && this.renderPositionForm()}
                    {view === COMMANDS && this.renderCommandForm()}
                </Paper>
            </div>
        )
    }
}

MissionControl.propTypes = {
    classes: PropTypes.shape({}).isRequired,
};

export default connect()(withStyles(missionControlStyles)(MissionControl));