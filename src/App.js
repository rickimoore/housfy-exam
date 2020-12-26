import './App.css';
import MarsMission from "./components/MarsMission";
import CollisionReport from "./components/CollisionReport";
import React from "react";
import MissionControl from "./components/MissionControl";
import {connect} from "react-redux";
import {CONTROL, MISSION} from "./helpers/constants";

class App extends React.Component {
    render() {
        const {view} = this.props;
        return (
            <div className="App">
                {view === CONTROL && <MissionControl/>}
                {view === MISSION && <MarsMission/>}
                <CollisionReport/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    view: state.app.view,
});

export default connect(mapStateToProps)(App);
