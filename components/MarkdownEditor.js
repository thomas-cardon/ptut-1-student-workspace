import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { init } from 'pell';

import 'pell/dist/pell.css'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = { html: null };
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onEditorChange(html) {
    this.setState({ html });
    localStorage.setItem('posts.lastSavedState', html);
  }

  componentDidMount () {
    this.editor = init({
      element: document.getElementById('editor'),
      onChange: this.onEditorChange,
      actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        'paragraph',
        'quote',
        'olist',
        'ulist',
        'code',
        'line'
      ]
    });

    if (localStorage.getItem('posts.lastSavedState'))
    this.editor.content.innerHTML = localStorage.getItem('posts.lastSavedState');
  }

  render() {
    return (<div id="editor" className="pell" />);
  }
}

export default App;
