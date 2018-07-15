import React, { Component } from 'react';
import Input from '../common/Input';
import { withRouter } from 'react-router-dom';
import { login, getUserRole, getRoleInfo } from '../../api/remote.js';
import { APP_KEY, APP_SECRET, GUEST_PSSWRD, GUEST_USRNM, BASE_URL, ADMIN_ROLE } from './../../constants/constants';
import Loader from 'react-loader-spinner';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isUserLoggingIn: false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmitHandler(e) {
        e.preventDefault();
        if (!this.state.username) {
            this.setState({
                errors: ["Username cannot be empty!"]
            });

            return;
        }
        if (!this.state.password) {
            this.setState({
                errors: ["Password cannot be empty!"]
            });

            return;
        }
        this.setState({
            isUserLoggingIn: true
        })
        let data = {
            username: this.state.username,
            password: this.state.password
        }


        const res = await login(data);

        let body = await res.body;

        if (res.status > 399) {
            if (!body) {
                this.setState({
                    errors: ["An error occured while trying to login. Make sure username and password are correct!"],
                    isUserLoggingIn: false

                });
            } else {
                this.setState({
                    errors: [body],
                    isUserLoggingIn: false
                });
            }

            return;
        }

        localStorage.setItem('authToken', body['_kmd']['authtoken']);
        localStorage.setItem('username', body.username)
        let userId = body["_id"];
        let username = body.username;
        localStorage.setItem('userid', userId);
        let rolesRes = await getUserRole(userId);
        let rolesData = await rolesRes.body;
        let isUserAdmin = false;
        if (rolesData.length > 0) {
            let roleId = rolesData[0]["roleId"];

            if (roleId == ADMIN_ROLE) {
                isUserAdmin = true
                localStorage.setItem('admin', 'true');

            }
        }


        this.props.onLoggedIn(username, userId, isUserAdmin);
        this.props.history.push('/');
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
            <div style={{ height: "1500px" }}>
                {this.state.isUserLoggingIn ?
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height="100"
                        width="100"
                    />
                    :

                    <div className="container form">
                        <h1>Login</h1>
                        <div>
                            {errorsToVisualize}
                        </div>

                        <form onSubmit={this.onSubmitHandler}>
                            <div className="row">

                                <Input
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.onChangeHandler}
                                    label="Username"
                                />
                            </div>
                            <div className="row">
                                <Input
                                    name="password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.onChangeHandler}
                                    label="Password"
                                />
                            </div>
                            <input type="submit" className="btn btn-primary" value="Login" />
                        </form>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(Login);