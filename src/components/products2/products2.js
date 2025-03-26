import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { mapJsonRichText } from '../../utils/renderRichText';
import { AppContext } from '../../utils/context';
import './products2.css';

const Products2 = ({ content }) => {
  const context = useContext(AppContext);
  const [products, setProducts] = useState(null);
  
  useEffect(() => {
  
  }, []);

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/${content?._variation}`,
    'data-aue-type': 'reference',
    'data-aue-label': content?.adventure,
    'data-aue-model': content?._model?._path,
    'data-aue-behavior': 'component'
  };
  console.log(content);

  return (
    <div className='product' {...editorProps}>
      <div className='list-items'>
        <span data-aue-prop='adenture' data-aue-type='text' data-aue-label='Adventure'>{content.adventure}</span>
        <span data-aue-prop='sku' data-aue-type='reference' data-aue-data-aue-model='products1' data-aue-filter='cf' data-aue-label='SKU1'>{content.sku}</span>
      </div>
    </div>
  );
};

Products2.propTypes = {
  content: PropTypes.object,
  editorProps: PropTypes.object
};

export default Products2;


//https://author-p124331-e1227315.adobeaemcloud.com/content/dam/amazon/assets/products/ullaj2263510687_1709571240895_2-0-_QL90_UX282_.jpg/_jcr_content/renditions/original?ch_ck=1711387638000