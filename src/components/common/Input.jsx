import React, { Component } from 'react';


export default class Input extends Component {
    render() {
        const { name, type = 'text', value, onChange, label, disabled } = this.props;
        return (
            <div className="form-group  mx-sm-3 mb-2">
                <label htmlFor={name}>{label}</label>
                <input
                    className="form-control"
                    onChange={onChange}
                    name={name}
                    id={name}
                    type={type}
                    value={value}
                    disabled={disabled}
                />
            </div>
        );
    }
}

