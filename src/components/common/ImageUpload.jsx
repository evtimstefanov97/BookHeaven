import React, { Component } from 'react';


export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: this.props.loadedUrl,
            showUploadControl: true

        }
    }

    render() {
        const { imagePreviewUrl } = this.state;
        let imagePreview = null;
        if (imagePreviewUrl || this.props.loadedUrl) {
            imagePreview = (
                <span>
                    <img src={imagePreviewUrl || this.props.loadedUrl} />
                    {!this.props.disabled && <p style={{ cursor: "pointer", color: 'red', fontWeight: '600' }} onClick={this.removeImage.bind(this)}>X</p>}
                </span>

            )
        }
        return (
            <div>
                {imagePreview}

                {(this.state.showUploadControl && !this.props.loadedUrl) && <input type="file" ref={ref => this.fileInput = ref} onChange={this.handleImageChange.bind(this)} accept="image/*" />}
            </div>

        );
    }
    handleSubmit(e) {
        e.preventDefault();
    }
    removeImage() {
        this.setState({
            file: '',
            imagePreviewUrl: '',
            showUploadControl: true
        })
        if (this.props.loadedUrl) {
            this.removeLoadedUrl();
        }

    }
    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        let fileSelectionErrors = [];
        if (file) {
            let fileNameExt = file.name.split('.')[1]
            reader.onloadend = () => {

                let fileInBm = ((file.size / 1024) / 1024).toFixed(4);
                if (fileInBm > 8) {
                    fileSelectionErrors.push({ error: "File too large!" })
                }
                if (fileNameExt !== "jpg" && fileNameExt !== "png") {
                    fileSelectionErrors.push({ error: "File type not allowed!" })
                }
                if (fileSelectionErrors.length == 0) {
                    this.setState({
                        file: file,
                        imagePreviewUrl: reader.result,
                        showUploadControl: false

                    })
                } else {
                    this.fileInput.value = ""
                }

                this.props.file(this.state.file, fileSelectionErrors);
                return;

            }
            reader.readAsDataURL(file);
        } else {
            return
        }
    }
    removeLoadedUrl() {
        this.props.clearLoadedUrl();
    }
}