import React from 'react';
import PropTypes from 'prop-types';

const Selector = ({ handleOnChange, options, title, value }) => (
  <select
    value={value}
    title={title}
    onChange={e => handleOnChange(e.target.value)}
  >
    {options.map(option => {
      const key = option.id ? `key-${option.id}` : `key-${option.name}`;
      return (
        <option key={key} value={option.name}>
          {option.label}
        </option>
      );
    })}
  </select>
);

Selector.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  handleOnChange: PropTypes.func,
  title: PropTypes.string
};

export default Selector;
