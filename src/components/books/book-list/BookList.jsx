import React, { Component } from 'react';
import BookCard from './../book-card/BookCard';
import Loader from 'react-loader-spinner';
import { getAll, getBookPictureById } from '../../../api/book-api';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            collectionEmpty: false

        };

    }
    async componentDidMount() {
        const allBooks = await getAll();
        let data = await allBooks.body;

        this.setState({ books: data, collectionEmpty: data.length == 0 });
    }
    createNotification(type, message, title) {
        switch (type) {
            case 'success':
                NotificationManager.success('Success!', title);
                break;
            case 'error':
                NotificationManager.error(message, 'Error!', 5000, () => {
                    alert('callback');
                });
                break;
        }
    };
    render() {
        return (
            <div style={{ height: "1000px" }}>
                <NotificationContainer />
                {
                    this.state.books.length > 0 ?
                        <div >
                            {this.renderBookRows()}
                            <div style={{ height: "100%" }} />
                        </div>
                        :
                        this.state.collectionEmpty ?
                            <h1>No books found</h1>
                            :
                            <Loader
                                type="Rings"
                                color="#00BFFF"
                                height="180"
                                width="180"
                            />
                }
            </div >
        )
    }

    renderBookRows() {
        let multipleBooks = this.combineRows();
        let separateElements = [];

        for (let i = 0; i < multipleBooks.length; i += 4) {
            let oneRow = [];
            oneRow.push(
                multipleBooks.slice(i, i + 4).map(item => {
                    return item;
                })
            )
            separateElements.push(<div className="row" key={i}>{oneRow.map(book => {
                return book;
            })}</div>)
        }
        return separateElements;
    }
    combineRows() {
        let rows = [];
        for (let i = 0; i < this.state.books.length; i++) {
            let book = this.state.books[i]; 
            rows.push(<BookCard
                name={book.Title}
                author={book.Author}
                _id={book._id}
                key={book._id}
                rating={book.Rating ? +book.Rating : 0}
                description={book.Description}
                released={book.Released}
                _acl={book._acl}
                imageUrl={book.imageUrl}
                shouldBlurr={this.state.shouldBooksBlurr}
                onHoverBlurrBooks={this.blurrBooks.bind(this)}
            />);
        }
        return rows;
    }
    blurrBooks(event) {
        this.setState({
            shouldBooksBlurr: event
        })
    }
}