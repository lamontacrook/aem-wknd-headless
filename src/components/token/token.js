import React from 'react';
import PropTypes from 'prop-types';
import './token.css';

const Token = ({ content }) => {
  const { defaultValue } = content;
  return (
    <span className='token'>{defaultValue}</span>
  );
};

Token.propTypes = {
  content: PropTypes.object,
};

export default Token;
