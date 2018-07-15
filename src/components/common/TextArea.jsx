import React, { Component } from 'react';


export default class TextArea extends Component {
    render() {
        const { name, value, onChange, label, maxLength, rows, disabled } = this.props;
        return (
            <div className="form-group  mx-sm-3 mb-2">
                <label htmlFor={name}>{label}</label>
                <textarea
                    className="form-control"
                    onChange={onChange}
                    name={name}
                    id={name}
                    value={value}
                    maxLength={maxLength}
                    rows={rows}
                    style={{ overflow: "auto", resize: "none" }}
                    disabled={disabled}
                />
            </div>
        );
    }
}