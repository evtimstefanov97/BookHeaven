import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './components/nav/Nav';
import { Route, Switch, withRouter } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import HomePage from './components/home/HomePage';
import NewBook from './components/books/new-book/NewBook';
import { getAll } from './api/book-api';
import EditBook from './components/books/new-book/EditBook';
import PrivateRoute from './components/common/PrivateRoute';
import ControlledRoute from './components/common/ControlledRoute';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userIsLoggedIn: false,
            username: "",
            userId: "",
            isAdmin: false,
            isUserCreatingBook: false
        }
    }
    async componentDidMount() {



    }
    render() {
        return (
            <div className="App">
                <Nav loggedIn={this.state.userIsLoggedIn || localStorage.getItem('authToken') !== null}
                    onLogout={this.onLogout.bind(this)}
                    username={this.state.username || localStorage.getItem('username')}
                    isAdmin={this.state.isAdmin || localStorage.getItem('admin') == 'true'}
                    isUserCreatingBook={this.state.isUserCreatingBook} />
                <Switch>
                    <Route exact path="/" render={() => <HomePage />} />
                    <PrivateRoute path="/books/create" render={() => <NewBook isUserCreatingBook={this.isUserCreatingBook.bind(this)} />} />
                    <PrivateRoute path="/books/details/:id" render={() => <EditBook />} />
                    <ControlledRoute path='/login' render={() => <Login onLoggedIn={this.onLoggedIn.bind(this)} />} />
                    <ControlledRoute path="/register" component={Register} />
                </Switch>
            </div>
        );
    }
    isUserCreatingBook(event) {
        this.setState({
            isUserCreatingBook: event
        })
    }
    onLogout() {
        localStorage.clear();
        this.setState({
            userIsLoggedIn: false,
            username: "",
            userId: "",
            role: ""
        })
        this.props.history.push('/');
    }
    onLoggedIn(username, userId, isAdmin) {
        this.setState({
            userIsLoggedIn: true,
            username: username,
            userId: userId,
            isAdmin: isAdmin
        })
    }
}

export default withRouter(App);
