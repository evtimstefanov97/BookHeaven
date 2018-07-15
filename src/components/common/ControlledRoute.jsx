import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class ControlledRoute extends Component {
    render() {
        if (localStorage.getItem('authToken') !== null) {
            return <Redirect to="/" />;
        };

        return (
            <Route {...this.props}>
                this.props.children
                </Route>
        );
    }
}