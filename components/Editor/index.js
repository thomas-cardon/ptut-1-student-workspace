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
    return (<div style={{ ...{ width: '100%', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)', padding: '1em', margin: '2em auto 0 auto' }, ...(this.props.style || {})}}>
      <EditorJs readOnly={this.props.readOnly} placeholder="Commencez à écrire ici. Cliquez sur du texte pour faire apparaître les outils. Vous pouvez aussi coller le lien d'une image pour la faire apparaitre." onChange={!this.props.readOnly ? this.onEditorChange : () => {}} tools={EDITOR_JS_TOOLS} instanceRef={instance => this.editorInstance = instance} data={this.state.data} />
    </div>);
  }
}

export default Editor;
