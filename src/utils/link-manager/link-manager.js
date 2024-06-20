import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppContext } from '../context';

const LinkManager = ({ children, item, className, ue = true }) => {
  const context = useContext(AppContext);
  let path = item._path ? item._path.replace(`/${context.rootPath}`, '') : '';
  let previous = '';
  const paths = path.split('/').map((item) => {
    if (item === 'article') return previous;
    previous = item;
    return item;
  });

  path = paths.join('/');

  const linkProps = {
    'data-aue-prop': 'callToActionLink',
    'data-aue-type': 'reference',
    'data-aue-label': 'Call to Action',
    'data-aue-filter': 'cf'
  };

  if (ue) {
    return (
      <Link key={path} {...linkProps} className={className} name={item.title || item.name} to={path}>
        {children}
      </Link>
    );
  } else {
    return (
      <Link key={path} className={className} name={item.title || item.name} to={path}>
        {children}
      </Link>
    );
  }
};

LinkManager.propTypes = {
  item: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.any]),
  className: PropTypes.string,
  ue: PropTypes.bool
};

export default LinkManager;