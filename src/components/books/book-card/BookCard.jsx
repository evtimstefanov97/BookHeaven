import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

export default class BookCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
    }
    componentDidMount() {
        this.watchForNativeMouseLeave();
    }
    watchForNativeMouseLeave() {
        this.captionHover.addEventListener('mouseleave', (ev) => {
            this.setState({ hover: false });
            this.props.onHoverBlurrBooks(false);

        });
    }
    render() {
        const { name, author, _id, rating, description, released, imageUrl, shouldBlurr } = this.props;
        return (

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 card" >
                {this.state.hover ? (<div><img src={imageUrl} className="bookImageHover" /></div>) : null}
                <Link to={'/books/details/' + _id}>
                    <div className="thumbnail" ref="captionHover" style={{ opacity: shouldBlurr ? 0.5 : 1 }} onMouseOver={this.mouseOver.bind(this)} ref={(e) => {
                        this.captionHover = e
                    }}>

                        <div className="caption" style={{ zIndex: 0 }}>

                            <h3 className="bookTitle">
                                {name}
                                <small>Author: {author}</small>
                            </h3>
                            <hr />
                            <p className="max-lines">
                                {description}
                            </p>
                            <hr />
                            <p style={{ height: "40px" }}>
                                <b>Released</b>: {released}
                            </p>
                            <hr />
                            <p>
                                <b>Rating</b>: {rating}
                            </p>
                            <StarRatings
                                rating={rating}
                                starRatedColor="brown"
                                numberOfStars={5}
                                isSelectable={false}
                                name='rating'
                                starDimension="20px"
                            />
                        </div>
                    </div>
                </Link>
            </div >

        );
    }
    mouseOver(ev) {
        this.setState({ hover: true });
        this.props.onHoverBlurrBooks(true);
    }
}