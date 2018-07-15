import React, { Component } from 'react';
import Input from '../common/Input';
import { Route, Switch, withRouter } from 'react-router-dom';
import { remote } from '../../api/remote';
import { register } from '../../api/remote';
import Loader from 'react-loader-spinner';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            errors: false,
            isRegisteringUser: false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmitHandler(e) {
        e.preventDefault();
        let errors = [];
        if (this.state.password !== this.state.confirmPassword) {
            errors.push({ error: "Passwords don't match" })
        }
        if (!this.state.username || this.state.username.length < 6) {
            errors.push({ error: "Please enter a valid username with atleast 6 characters" });
        }

        if (this.state.password.length < 3) {
            errors.push({ error: "Please enter a password atleast 3 characters long" })
        }

        this.setState({
            errors: errors
        });

        if (errors.length > 0) {
            return;
        }
        this.setState({
            isRegisteringUser: true
        })
        let data = { username: this.state.username, password: this.state.password };
        const res = await register(data);

        let body = await res.body;

        if (res.status > 399) {
            this.setState({
                errors: [body],
                isRegisteringUser: false
            });
            return;
        }

        this.props.history.push('/login');
    }

    render() {
        let errorsToVisualize = [];
        if (this.state.errors) {

            this.state.errors.forEach(error => {
                Object.keys(error).map(k => {
                    if (error[k].length > 0) {
                        errorsToVisualize.push(<p key={error[k]} className="alert alert-danger">{error[k]}</p>);

                    }
                })
            })


        }

        return (
            <div className="container form" style={{ height: "1500px" }}>
                <h1>Register</h1>
                <div>
                    {errorsToVisualize}
                </div>
                {this.state.isRegisteringUser ?
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height="100"
                        width="100"
                    />
                    :
                    <form onSubmit={this.onSubmitHandler}>
                        <Input
                            name="username"
                            value={this.state.username}
                            onChange={this.onChangeHandler}
                            label="Username"

                        />
                        <Input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChangeHandler}
                            label="Password"
                        />
                        <Input
                            name="confirmPassword"
                            type="password"
                            value={this.state.repeat}
                            onChange={this.onChangeHandler}
                            label="Repeat password"
                        />
                        <input type="submit" className="btn btn-primary" value="Register" />
                    </form>

                }

            </div>
        );
    }
}

export default withRouter(Register);