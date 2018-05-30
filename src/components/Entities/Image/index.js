import React from 'react';
import './style.css';

const Image = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();

  return (
    <img 
      src={src}
      className='image'
      alt='placeholder'
      />
  );
};

export default Image;