import React from 'react';
import {BLOCK_TYPES, INLINE_STYLES} from './constants';

export const ImageInput = ({onChangeImage}) => {
  return (
    <div className='text-editor__controls-image-input'>
      <input
        className='file-input'
        type="file"
        id='file'
        accept="image/*"
        onChange={onChangeImage}
      />
      <label className='button' htmlFor="file">
        Add an Image
      </label>
    </div>
  );
}

export const StyleButton = (props) => {
  const onToggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  let className = 'button';
  if (props.active) {
    className += ' button_active';
  }

  return (
    <button className={className} onMouseDown={onToggle}>
      {props.label}
    </button>
  );
}

export const TextEditorControlsBlockStyle = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className='text-editor__controls-block-style'>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export const TextEditorControlsInlineStyle = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className='text-editor__controls-inline-style'>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};