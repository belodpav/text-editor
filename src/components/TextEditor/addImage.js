import {
  EditorState,
  AtomicBlockUtils,
} from 'draft-js';

export default function addImage(editorState, src) {    
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    'image',
    'IMMUTABLE',
    {src: src}
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(
    editorState,
    {currentContent: contentStateWithEntity}
  );

  this.setState({
    editorState: AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' '
    ),
  });
}