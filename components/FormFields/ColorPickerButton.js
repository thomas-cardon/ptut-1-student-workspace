'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

import Button from './FormButton';

class ColorPickerButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: false,
      color: '#ffc107'
    };

    this.handleChange = props.handleChange.bind(this);
  }

  handleClick = () => this.setState({ display: !this.state.display });
  handleClose = () => this.setState({ display: false });

  onChange = color => {
    this.setState({ color: color.hex });
    this.handleChange(color.hex);
  }

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
          marginLeft: '1em'
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <>
        <Button onClick={this.handleClick}>
          Changer
          <div style={styles.color } />
        </Button>
        {this.state.display ? <div style={styles.popover}>
          <div style={styles.cover} onClick={this.handleClose}/>
          <SketchPicker color={this.state.color} onChange={this.onChange} />
        </div> : null}
      </>
    );
  }
}

export default ColorPickerButton;
