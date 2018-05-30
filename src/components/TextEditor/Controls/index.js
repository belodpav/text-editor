import React from 'react';
import './style.css';
import {
  TextEditorControlsBlockStyle,
  TextEditorControlsInlineStyle,
  ImageInput
} from './controls';

const TextEditorControls = ({
    editorState,
    toggleBlockType,
    toggleInlineStyle,
    onChangeImage
  }) => {

  return (
    <div className='text-editor__controls'>
      <div className='text-editor__controls-row'>
        <TextEditorControlsBlockStyle
          editorState={editorState}
          onToggle={toggleBlockType}
        />
      </div>
      <div className='text-editor__controls-row'>
        <TextEditorControlsInlineStyle
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <ImageInput 
          onChangeImage={onChangeImage}
        />
      </div>
    </div>
  );
}


export default TextEditorControls;