import React, { Component } from 'react';
import BookList from '../books/book-list/BookList';
import getAll from '../../api/book-api'
import remove from '../../api/book-api';
export default class HomePage extends Component {

    constructor(props) {
        super(props);


    }

    render() {
        return (
            <div className="container text-center">
                <BookList />
            </div>
        );
    }

}