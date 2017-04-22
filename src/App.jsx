import React, {Component} from 'react';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import {start, stop} from './game/index.js';

@observer
class App extends Component {
    render() {
        return (
            <div>
                <DevTools />
                <canvas id="webgl-canvas" style={{width: '100%', height: '100%'}}/>
            </div>
        );
    }

    onReset = () => {
        this.props.appState.resetTimer();
        stop();
        start();
    };


    componentDidMount = () => {
        start();
    };

    componentDidUpdate = () => {
        start();
    };

    componentWillUnmount = () => {
        stop();
    }
}

export default App;
