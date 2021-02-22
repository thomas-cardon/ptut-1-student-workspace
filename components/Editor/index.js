import React, { Component } from 'react';
import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './tools';

class Editor extends Component {
  constructor (props) {
    super(props)
    this.state = { data: props.data || JSON.parse(localStorage.getItem('posts.lastSavedState') || '{}') };
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onEditorChange(editor) {
    editor.saver.save().then(data => {
      localStorage.setItem('posts.lastSavedState', JSON.stringify(data));
    });
  }

  render() {
    return (<div style={{ ...{ boxShadow: '0  5px 10px rgba(154,160,185,0.05),  0 15px 40px rgba(166,173,201,0.2)' }, ...(this.props.style || {})}}>
      <EditorJs readOnly={this.props.readOnly} placeholder="Commencez à écrire ici. Cliquez sur du texte pour faire apparaître les outils. Vous pouvez aussi coller le lien d'une image pour la faire apparaitre." onChange={!this.props.readOnly ? this.onEditorChange : () => {}} tools={EDITOR_JS_TOOLS} instanceRef={instance => this.editorInstance = instance} data={this.state.data} />
    </div>);
  }
}

export default Editor;
