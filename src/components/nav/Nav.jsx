import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Nav extends Component {
    render() {
        const { loggedIn, onLogout, username, isAdmin, isUserCreatingBook } = this.props;

        return (
            <header>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                            <li className="pull-left"><NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink></li>
                            <li className="centered" style={{ marginLeft: "69px" }}><h3 style={{ fontFamily: "serif" }}>Book Heaven</h3></li>
                            <li className="centered" style={{ marginLeft: "12px" }}>{((loggedIn || isAdmin) && !isUserCreatingBook) && <NavLink className="btn btn-primary btn-sm navbar-btn" activeClassName="active" to="/books/create">Add new</NavLink>}</li>

                            <li className="pull-right">{loggedIn && <span className="nav-adjustPadding">Welcome, {username}</span>}</li>
                            <li className="pull-right">{!loggedIn && <NavLink className="nav-link" activeClassName="active" to="/login">Login</NavLink>}</li>
                            <li className="pull-right">{!loggedIn && <NavLink className="nav-link " activeClassName="active" to="/register">Register</NavLink>}</li>
                            <li className="pull-right">{loggedIn && <a className="nav-link" href="javascript:void(0)" onClick={onLogout}>Logout</a>}</li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Nav;
