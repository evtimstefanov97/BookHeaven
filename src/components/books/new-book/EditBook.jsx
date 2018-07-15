import React, { Component } from 'react';
import Input from '../../common/Input';
import { Route, Switch, withRouter } from 'react-router-dom';
import { create, uploadPicture, getBookById, removeOldImage, updateBook, remove, getBookPictureById } from '../../../api/book-api'
import Loader from 'react-loader-spinner';
import TextArea from '../../common/TextArea'
import ImageUpload from './../../common/ImageUpload';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

class EditBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            title: '',
            _acl: '',
            description: '',
            author: '',
            released: '',
            rating: '',
            image: '',
            imageUploadUrl: '',
            isEditingBook: true,
            visible: false,
            userHasRights: false,
            bookRes: ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    async componentDidMount() {
        const bookRes = await getBookById(this.props.match.params.id);
        const resData = (await bookRes.body)[0];

        let hasRights = resData._acl["creator"] == localStorage.getItem('userid') || localStorage.getItem('admin') == 'true'

        this.setState({
            id: resData._id,
            title: resData.Title,
            description: resData.Description,
            author: resData.Author,
            released: resData.Released,
            imageUploadUrl: resData.imageUrl,
            isEditingBook: false,
            rating: +resData.Rating,
            _acl: resData["_acl"],
            bookRes: resData,
            userHasRights: hasRights

        })
        console.log(bookRes);

    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleFile(file) {
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
        if (!this.state.image && !this.state.imageUploadUrl) {
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
            isEditingBook: true
        });
        let imageForBookRes = await getBookPictureById(this.state.id);
        let imageForBookData = await imageForBookRes.body;
        let uploadResObj;
        let uploadDataUrl;
        if (imageForBookData.length > 0 && !this.state.imageUploadUrl) {
            let deletePictureObj = await removeOldImage(imageForBookData[0]._id);
        }
        if (this.state.image) {
            uploadResObj = await uploadPicture(this.state.image, this.state.id);
            uploadDataUrl = uploadResObj.url;
        }





        let data = this.state.bookRes;
        data.Title = this.state.title
        data.Description = this.state.description
        data.Author = this.state.author
        data.Released = this.state.released
        data.imageUrl = uploadDataUrl ? uploadDataUrl : this.state.imageUploadUrl
        data.Rating = this.state.rating;

        const res = await updateBook(this.state.id, data);

        let body = await res.body;

        if (res.status > 399) {
            this.setState({
                errors: [body],
                isCreatingBook: false
            });
            this.createNotification("error", res.body.description)
            return;
        }

        this.props.history.push('/');
    }
    toggleDialog() {
        this.setState({
            visible: !this.state.visible
        });
    }
    clearLoadedUrl() {
        this.setState({
            imageUploadUrl: ''
        })

    }
    deleteBook() {
        this.toggleDialog();
    }
    async confirm() {
        let deleteRes = await remove(this.state.id);
        let deleteData = await deleteRes.body;

        if (deleteRes.status > 399) {
            this.createNotification("error", deleteRes.body.description)
        } else {
            this.createNotification("success", "Book deletion")

            this.setState({
                visible: !this.state.visible,
            });
        }
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
            <div className="container book-form" style={{ height: '2000px' }}>

                <h1>{this.state.userHasRights ? <span>Edit</span> : <span>Details</span>}</h1>
                <br />
                <div>
                    {errorsToVisualize}
                </div>
                {this.state.isEditingBook ?
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height="100"
                        width="100"
                    />
                    :
                    <div>
                        <form onSubmit={this.onSubmitHandler}>
                            <ImageUpload file={this.handleFile.bind(this)} loadedUrl={this.state.imageUploadUrl} clearLoadedUrl={this.clearLoadedUrl.bind(this)} disabled={!this.state.userHasRights} />
                            <Input
                                name="title"
                                value={this.state.title}
                                onChange={this.onChangeHandler}
                                label="Title"
                                disabled={!this.state.userHasRights}

                            />
                            <Input
                                name="author"
                                value={this.state.author}
                                onChange={this.onChangeHandler}
                                label="Author"
                                disabled={!this.state.userHasRights}

                            />
                            <TextArea name="description"
                                value={this.state.description}
                                onChange={this.onChangeHandler}
                                label="Description"
                                rows={7}
                                maxLength={800}
                                disabled={!this.state.userHasRights}

                            />
                            <Input
                                name="released"
                                value={this.state.released}
                                onChange={this.onChangeHandler}
                                label="Released"
                                disabled={!this.state.userHasRights}
                            />
                            <Input
                                name="rating"
                                value={this.state.rating}
                                onChange={this.onChangeHandler}
                                label="Goodreads Rating"
                                disabled={!this.state.userHasRights}
                            />
                            {this.state.userHasRights && <input type="submit" className="btn btn-success" value="Update" />}
                            {this.state.userHasRights &&
                                <button type="button" className="btn btn-danger" style={{ marginLeft: "15px" }} aria-label="Close" onClick={this.deleteBook.bind(this)}>
                                    Delete
                                </button>
                            }
                        </form>
                        {this.state.visible && <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
                            <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to delete this book?</p>
                            <DialogActionsBar>
                                <button className="k-button" onClick={this.toggleDialog}>No</button>
                                <button className="k-button" onClick={this.confirm}>Yes</button>
                            </DialogActionsBar>
                        </Dialog>}
                    </div>

                }
                <NotificationContainer />

            </div>
        );
    }
}

export default withRouter(EditBook);