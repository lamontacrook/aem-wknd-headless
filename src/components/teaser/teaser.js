
import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { TextWithPlaceholders } from '../../utils/placeholders';
import LinkManager from '../../utils/link-manager';
import './teaser.css';

const imageSizes = [
  {
    imageWidth: '660px',
    renditionName: 'web-optimized-large.webp',
    size: '(min-width: 1000px) 660px'
  },
  {
    imageWidth: '1000px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '800px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '600px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '412px',
    renditionName: 'web-optimized-medium.webp',
  },
  {
    size: '100vw',
  }
];


const imageSizesHero = [
  {
    imageWidth: '1600px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1200px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1000px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '800px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '600px',
    renditionName: 'web-optimized-medium.webp',
  },
  {
    imageWidth: '412px',
    renditionName: 'web-optimized-small.webp',
  },
  {
    size: '100vw',
  }
];

const Teaser = ({ content }) => {
  const id = useId();
  let inFrame = false;
  if (window.location !== window.parent.location) {
    inFrame = true;
  }
  const [style, setStyle] = useState('');
  // let style = content.style;
  const divRef = useRef(document.body); // Ref for HTML Element

  useEffect(() => {
    setStyle(content.style);
  }, [content.style, content.title]);

  divRef.current.addEventListener('aue:content-patch', (event) => {
    if (event.detail) {
      const { name, value } = event.detail.patch;
      const section = event.target.querySelector('section');
      if (name === 'style' && section.classList.contains('teaser')) {
        section.setAttribute('class', `teaser ${value} iframe`);
        event.stopPropagation();
      }
    }
  });

  const renderAsset = ({ asset }) => {
    const imageProps = {
      'data-aue-prop': 'asset',
      'data-aue-type': 'media',
      'data-aue-label': 'Asset'
    };
    if (asset && Object.prototype.hasOwnProperty.call(content.asset, 'format'))
      return (<Video content={content.asset} />);
    else if (asset && Object.prototype.hasOwnProperty.call(content.asset, 'mimeType'))
      return (<Image imageProps={imageProps} asset={content.asset} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes} />);
    else
      return (<Image imageProps={imageProps} asset={content.asset} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes} />);
  };


  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/${content?._variation}`,
    'data-aue-type': 'reference',
    'data-aue-label': content?.title,
    'data-aue-model': content?._model?._path,
    'data-aue-behavior': 'component'
  };

  return (
    <div {...editorProps}>
      <section className={'teaser ' + style + (inFrame ? ' iframe' : '')} id={id} ref={divRef}>
        <div className='container'>
          {renderAsset(content)}
          <div className='content-block'>
            <span className='title' data-aue-prop='title' data-aue-type='text' data-aue-label='Title'>{content.title}</span>
            <span className='seperator'></span>
            {content.preTitle && (
              <span className='preTitle' data-aue-prop='preTitle' data-aue-type='text' data-aue-label='Pre-Title'>{content.preTitle}</span>
            )}
            {content.description && content.description.plaintext && (
              <p className='description' data-aue-prop='description' data-aue-type='richtext' data-aue-label='Description'><TextWithPlaceholders>{content.description.plaintext}</TextWithPlaceholders></p>
            )}
            {content.callToAction && (
              <LinkManager item={content} className='button'>{content.callToAction}</LinkManager>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

Teaser.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Teaser;
