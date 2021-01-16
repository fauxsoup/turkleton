import React from 'react';
import { render } from 'react-dom';
import { App } from './components';
import { BrowserRouter as Router } from 'react-router-dom';

function start() {
    const app = (
        <Router>
            <App />
        </Router>
    );

    const root = document.querySelector('#root');

    render(app, root);
}

function whenReady(action) {
    if (document.readyState === 'complete' ||
        document.readyState === 'interactive') {
        setTimeout(action, 0);
    } else {
        document.addEventListener('DOMContentLoaded', action);
    }
}

whenReady(start);
