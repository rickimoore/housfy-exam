import React from "react";
import {connect} from "react-redux";
import Modal from '@material-ui/core/Modal';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import modalStyles from "./styles/modalStyles";
import Button from "@material-ui/core/Button";
import {closeReportModal, setControlView, clearDetectedCollisions} from "../redux/actions";

class CollisionReport extends React.Component {
    handleClose = () => {}
    renderDetectionMessage = () => {
        const {detectedObjects, classes} = this.props;
        return (
            <React.Fragment>
                <h1>Collision Detected!</h1>
                <p>Rover detected {`( ${detectedObjects.length} )`} obstacle {`collision${detectedObjects.length > 1 ? 's ' : ' '}`}
                on mars. {`Collision${detectedObjects.length > 1 ? 's were ' : ' was '}`} detected at the following (X, Y) {`location${detectedObjects.length > 1 ? 's' : ''}`}: </p>
                <ul className={classes.list}>
                    {detectedObjects.map((obj, key) => (
                        <li key={key}>{`( ${obj.x}, ${obj.y} )`}</li>
                    ))}
                </ul>
            </React.Fragment>
        )
    }
    renderSuccessMessage = () => {
        return (
            <React.Fragment>
                <h2>Mission Success!</h2>
                <p>Detected zero object collisions.</p>
            </React.Fragment>
        )
    }
    returnToControl = () => {
        const {dispatch} = this.props;
        dispatch(clearDetectedCollisions())
        dispatch(closeReportModal());
        setTimeout(() => dispatch(setControlView()), 0);
    }
    renderOffWorldMessage = () => {
        return (
            <React.Fragment>
                <h2>Off World Path!</h2>
                <p>Rover's path leads off world. Please provide new commands.</p>
            </React.Fragment>
        )
    }
    render() {
        const {isCollisionReportModal, isOffWorldPathDetected, detectedObjects, classes} = this.props;
        return (
            <Modal
                className={classes.modal}
                open={isCollisionReportModal}
                onClose={this.handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 200,
                }}
            >
                <Fade in={isCollisionReportModal}>
                    <Card className={classes.paper}>
                        {detectedObjects && this.renderDetectionMessage()}
                        {isOffWorldPathDetected && this.renderOffWorldMessage()}
                        {!detectedObjects && !isOffWorldPathDetected && this.renderSuccessMessage()}
                        <Button onClick={() => this.returnToControl()} style={{background: '#3BB9FF', marginBottom: 15, marginTop: 15}} variant="contained" color="primary">
                            Return To Control
                        </Button>
                    </Card>
                </Fade>
            </Modal>
        )
    }
}

CollisionReport.propTypes = {
    classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
    isCollisionReportModal: state.modalUI.isCollisionReportModal,
    isOffWorldPathDetected: state.modalUI.isOffWorldPathDetected,
    detectedObjects: state.modalUI.detectedObjects,
});

export default connect(mapStateToProps)(withStyles(modalStyles)(CollisionReport));