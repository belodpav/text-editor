import React, {Component} from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertToRaw,
  convertFromRaw
} from 'draft-js';

import TextEditorControls from './Controls';
import {Image} from '../Entities';
import addImage from './addImage';
import styleMap from './styleMap';

import './style.css';

const {hasCommandModifier} = KeyBindingUtil;

class TextEditor extends Component {
  constructor(props) {
    super(props);
    let initEditorState = null;
    const storeRaw = localStorage.getItem('draftRaw');

    if (storeRaw) {
      const rawContentFromStore = convertFromRaw(JSON.parse(storeRaw));
      initEditorState = EditorState.createWithContent(rawContentFromStore);
    } else {
      initEditorState = EditorState.createEmpty();
    }

    this.state = {
      editorState: initEditorState
    };
  }

  onChange = (editorState) => this.setState({editorState});

  focus = () => this.refs['text-editor'].focus();
  
  saveEditorState = () => {
    var contentRaw = convertToRaw(this.state.editorState.getCurrentContent());
    console.log(JSON.stringify(contentRaw, null, 2));
    localStorage.setItem('draftRaw', JSON.stringify(contentRaw));
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
  
    if (command === 'save-state') {
      this.saveEditorState();
      return 'handled';
    }
    
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  
  onChangeImage = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const url = 'http://localhost:8080/upload/image';
    const options = {
      method:'POST',
      body: formData
    };
    const {editorState} = this.state;

    fetch(url, options)
    .then(async (res) => {
      if (res.status === 200) {
        const src = await res.text();

        addImage.call(this, editorState, src);
      }
    });

    if (file.type.indexOf('image/') === 0) {
      const src = URL.createObjectURL(file);

      addImage.call(this, editorState, src);
    }
  }


  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;
    const {
      toggleBlockType,
      toggleInlineStyle,
      onChangeImage,
      onChange,
      handleKeyCommand
    } = this;
    
    return (
      <div className='text-editor'>
        <div className='text-editor__header'>
          <TextEditorControls 
            editorState={editorState}
            toggleBlockType={toggleBlockType}
            toggleInlineStyle={toggleInlineStyle}
            onChangeImage={onChangeImage}
          />
        </div>
        <div className='text-editor__body' onClick={this.focus}>
          <Editor
            customStyleMap={styleMap}
            blockStyleFn={myBlockStyleFn}
            blockRendererFn={mediaBlockRenderer}
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
            ref='text-editor'
          />
        </div>
      </div>
    );
  }
}

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();

  //  в общем случае имя типа не совпадает с именем класса
  switch(type) {
    case 'blockquote':
      return 'blockquote';
    case 'code-block':
      return 'code-block';
    case 'text-align_left':
      return 'text-align_left';
    case 'text-align_right':
      return 'text-align_right';
    case 'text-align_center':
      return 'text-align_center';
    default:
      return;
  }
}

function keyBindingFn(e) {
  if (e.keyCode === 83 && hasCommandModifier(e)) {
    return 'save-state';
  }
  return getDefaultKeyBinding(e);
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Image,
      editable: false,
    };
  }
  return null;
}

export default TextEditor;