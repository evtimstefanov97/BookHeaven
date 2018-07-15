import React, { Component } from 'react';
import Input from '../../common/Input';
import { Route, Switch, withRouter } from 'react-router-dom';
import { create, uploadPicture, connectFileToBook } from '../../../api/book-api'
import Loader from 'react-loader-spinner';
import TextArea from '../../common/TextArea'
import ImageUpload from './../../common/ImageUpload';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class NewBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            author: '',
            released: '',
            rating: '',
            image: '',
            isCreatingBook: false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    componentDidMount() {
        this.props.isUserCreatingBook(true);
    }
    componentWillUnmount() {
        this.props.isUserCreatingBook(false);
    }
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleFile(file, selectionErrors) {
        if (selectionErrors.length > 0) {
            this.setState({
                errors: selectionErrors
            })
            return;
        }
        this.setState({
            image: file
        })
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
    async onSubmitHandler(e) {
        e.preventDefault();
        let errors = [];

        if (!this.state.title) {
            errors.push({ error: "Please enter a valid book title" });
        }

        if (!this.state.description || this.state.description.length > 800) {
            errors.push({ error: "Please enter a valid book description not more than 800 characters" });
        }
        if (!this.state.author) {
            errors.push({ error: "Please enter a valid book author" });
        }
        if (!this.state.released || this.state.released.length > 40) {
            errors.push({ error: "Please enter a valid book release date not more than 40 characters" });
        }
        if (!this.state.image) {
            errors.push({ error: "Attach an image for the book" });
        }
        if (!this.state.rating || isNaN(this.state.rating) || this.state.rating > 5 || this.state.rating < 0) {
            errors.push({ error: "Rating should be a number between 0 and 5" })
        }
        this.setState({
            errors: errors
        });

        if (errors.length > 0) {
            return;
        }
        this.setState({
            isCreatingBook: true
        });

        let uploadResObj = await uploadPicture(this.state.image);
        let uploadDataUrl = uploadResObj.url;

        let data = { Title: this.state.title, Description: this.state.description, Author: this.state.author, Released: this.state.released, imageUrl: uploadDataUrl, Rating: this.state.rating };
        const bookRes = await create(data);
        let bookResBody = await bookRes.body;

        let uploadedFileNewdata = uploadResObj.fileJson;

        uploadedFileNewdata["bookId"] = bookResBody._id;

        const connectFileToBookRes = await connectFileToBook(uploadResObj.fileId, uploadedFileNewdata)
        let fileBookConnectBody = await connectFileToBookRes.body;

        if (bookRes.status > 399) {
            this.setState({
                errors: [bookResBody],
                isCreatingBook: false
            });
            this.createNotification("error", bookRes.body.description)
            return;
        }

        this.props.history.push('/');
    }
    deleteBook(id) {
        this.props.deleteBook(id);
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
            <div className="container book-form" style={{ height: '2000px' }}>

                <h1>Add New</h1>
                <br />
                <div>
                    {errorsToVisualize}
                </div>
                {this.state.isCreatingBook ?
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height="100"
                        width="100"
                    />
                    :
                    <form onSubmit={this.onSubmitHandler}>
                        <ImageUpload file={this.handleFile.bind(this)} />
                        <Input
                            name="title"
                            value={this.state.title}
                            onChange={this.onChangeHandler}
                            label="Title"

                        />
                        <Input
                            name="author"
                            value={this.state.author}
                            onChange={this.onChangeHandler}
                            label="Author"
                        />
                        <TextArea name="description"
                            value={this.state.description}
                            onChange={this.onChangeHandler}
                            label="Description"
                            rows={7}
                            maxLength={800} />
                        <Input
                            name="released"
                            value={this.state.released}
                            onChange={this.onChangeHandler}
                            label="Released"
                        />
                        <Input
                            name="rating"
                            value={this.state.rating}
                            onChange={this.onChangeHandler}
                            label="Goodreads Rating"
                        />
                        <input type="submit" className="btn btn-success" value="Create" />
                    </form>

                }
                <NotificationContainer />

            </div>
        );
    }
}

export default withRouter(NewBook);