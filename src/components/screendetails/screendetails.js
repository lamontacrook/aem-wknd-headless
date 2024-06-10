import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import Header from '../header';
import Footer from '../footer';
import './screendetails.css';
import { prepareRequest } from '../../utils';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import { Helmet } from 'react-helmet-async';
import Delayed from '../../utils/delayed';
import { editorProps } from '../../utils/ue-definitions';
import { mapJsonRichText } from '../../utils/renderRichText';

const Screendetails = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();

  const [config, setConfiguration] = useState('');
  const [content, setContent] = useState({});
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState({});
  const [itinerary, setItinerary] = useState({});
  const [whatToBring, setWhatToBring] = useState({});
  const [adventure, setAdventure] = useState('');

  const props = useParams();

  const navigate = useNavigate();

  const version = localStorage.getItem('rda') === 'v1' ? 'v1' : 'v2';

  const configPath = `/content/dam/${context.project}/site/configuration/configuration-v2`;

  useEffect(() => {
    let path = Object.values(props).pop();

    // const findOverlap = (a, b) => {
    //   if (b.length === 0) return '';
    //   if (a.endsWith(b)) return b;
    //   if (a.indexOf(b) > 0) return b;
    //   return findOverlap(a, b.substring(0, b.length - 1));
    // };

    const sdk = prepareRequest(context);

    const params = { path: configPath };
    if (context.serviceURL.includes('author')) params['ts'] = new Date().getTime();
    else params['version'] = context.version;


    sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.config}`, params)
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);

          const items = { 'overview': setOverview, 'itinerary': setItinerary, 'whatToBring': setWhatToBring };

          const { item } = data.configurationByPath;
          Object.keys(items).forEach((key) => {
            if (!item[key]) items[key] = '';
            else {
              if (Object.keys(item[key]).includes('_dynamicUrl'))
                items[key]({ backgroundImage: 'url("' + `${context.serviceURL.replace(/\/$/, '')}${item[key]._dynamicUrl}` + '")' });
              else if (Object.keys(item[key]).includes('_authorUrl'))
                items[key]({ backgroundImage: 'url("' + `${data.configurationByPath.item[key]._authorUrl}/jcr:content/renditions/${data.configurationByPath.item.renditionsConfiguration[900]}` + '")' });
            }
          });

          path = context.rootPath + '/aem-demo-assets/' + path;
          params['path'] = path !== '' ? '/' + path : data.configurationByPath.item.homePage._path;
          sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.adventure}`, params)
            .then(({ data }) => {
              if (data) {
                let pretitle = data.adventureByPath.item.description.plaintext;
                pretitle = pretitle && pretitle.substring(0, pretitle.indexOf('.'));
               
                let content = {
                  screen: {
                    body: {
                      header: {
                        navigationColor: 'light-nav',
                        teaser: {
                          __typename: 'TeaserModel',
                          asset: data.adventureByPath.item.primaryImage,
                          title: data.adventureByPath.item.title,
                          preTitle: pretitle,
                          _metadata: data.adventureByPath.item._metadata,
                          style: 'hero',
                          _path: data.adventureByPath.item._path,
                          _variation: data.adventureByPath.item._variation || 'master'
                        }
                      }
                    }
                  }
                };
                setTitle(data.adventureByPath.item.title);
                setAdventure(data);
                setContent(content);
              }
            })
            .catch((error) => {
              handleError(error);
            });
        }
      })
      .catch((error) => {
        handleError(error);
      });


  }, [handleError, navigate, configPath, props, version, context]);

  return (
    <React.Fragment>
      <Helmet>
        <title>WKND: {title}</title>
      </Helmet>
      {overview && itinerary && whatToBring && adventure && adventure.adventureByPath && (
        <div className='screen' {...editorProps(adventure.adventureByPath?.item, adventure.adventureByPath?.item?.title, '', 'reference')}>
          {content && content.screen && config.configurationByPath &&
            <Header content={content.screen.body.header} config={config} className='screendetail' />
          }


          <div className='main-body screendetail' {...editorProps(adventure.adventureByPath.item, 'Screen Components', 'block', 'container', 'container')}>
            <div className='inner-content'>
              <h4 data-aue-prop='title' data-aue-type='text' data-aue-label='Title'>{adventure.adventureByPath.item.title}</h4>

              <div className='adventure-details'>
                <ul>
                  <li>
                    <h6>Activity</h6>
                    <hr />
                    <p data-aue-prop='activity' data-aue-type='text' data-aue-label='Activity'>{adventure.adventureByPath.item.activity}</p>
                  </li>
                  <li>
                    <h6>Adventure Type</h6>
                    <hr />
                    <p>{adventure.adventureByPath.item.adventureType}</p>
                  </li>
                  <li>
                    <h6>Trip Length</h6>
                    <hr />
                    <p>{adventure.adventureByPath.item.tripLength}</p>
                  </li>
                  <li>
                    <h6>Group Size</h6>
                    <hr />
                    <p>{adventure.adventureByPath.item.groupSize}</p>
                  </li>
                  <li>
                    <h6>Difficulty</h6>
                    <hr />
                    <p>{adventure.adventureByPath.item.difficulty}</p>
                  </li>
                  <li>
                    <h6>Price</h6>
                    <hr />
                    <p>{adventure.adventureByPath.item.price}</p>
                  </li>
                </ul>
              </div>

              <div>
                <div className="tab">
                  <div className="item item-1" style={overview}>
                    <div>
                      <span>Overview</span>
                      {Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.description, 'json') && (
                        <div data-aue-prop='description' data-aue-type='richtext' data-aue-label='Description' className="inner-text">{mapJsonRichText(adventure.adventureByPath.item.description.json)}</div>
                      )}
                      {!Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.description, 'json') && (
                        <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.description.html }} />
                      )}
                    </div>
                  </div>
                  <div className="item item-2" style={itinerary}>
                    <div>
                      <span>Itinerary</span>
                      {Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.itinerary, 'json') && (
                        <div data-aue-prop='itinerary' data-aue-type='richtext' data-aue-label='Itinerary' className="inner-text">{mapJsonRichText(adventure.adventureByPath.item.itinerary.json)}</div>
                      )}
                      {!Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.itinerary, 'json') && (
                        <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.itinerary.html }} />
                      )}
                    </div>
                  </div>
                  <div className="item item-3" style={whatToBring}>
                    <div>
                      <span>What to Bring</span>
                      {Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.gearList, 'json') && (
                        <div data-aue-prop='gearList' data-aue-type='richtext' data-aue-label='What to Bring' className="inner-text">{mapJsonRichText(adventure.adventureByPath.item.gearList.json)}</div>
                      )}
                      {!Object.prototype.hasOwnProperty.call(adventure.adventureByPath.item.gearList, 'json') && (
                        <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.gearList.html }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>




          <footer>
            {config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
              <Delayed waitBeforeShow={700}><Footer config={config.configurationByPath.item.footerExperienceFragment} /></Delayed>
            }
          </footer>
        </div>
      )}
    </React.Fragment >
  );
};

Screendetails.propTypes = {
  context: PropTypes.object
};

export default Screendetails;