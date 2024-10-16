import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

const GoogleStreetview = ({
  streetViewPanoramaOptions,
  onPanoChanged,
  onPositionChanged,
  onPovChanged,
  onVisibleChanged,
  onZoomChanged,
}) => {
  const nodeRef = useRef(null);
  const streetViewRef = useRef(null);

  const initialize = (canvas, prevOptions) => {
    if (window.google && window.google.maps && !streetViewRef.current) {
      streetViewRef.current = new window.google.maps.StreetViewPanorama(
        canvas,
        streetViewPanoramaOptions,
      );

      streetViewRef.current.addListener('pano_changed', () => {
        onPanoChanged(streetViewRef.current.getPano());
      });

      streetViewRef.current.addListener('position_changed', () => {
        onPositionChanged(streetViewRef.current.getPosition());
      });

      streetViewRef.current.addListener('pov_changed', () => {
        onPovChanged(streetViewRef.current.getPov());
      });

      streetViewRef.current.addListener('visible_changed', () => {
        onVisibleChanged(streetViewRef.current.getVisible());
      });

      streetViewRef.current.addListener('zoom_changed', () => {
        onZoomChanged(streetViewRef.current.getZoom());
      });
    }

    if (
      streetViewRef.current &&
      streetViewPanoramaOptions &&
      !isEqual(streetViewPanoramaOptions, prevOptions)
    ) {
      const { zoom, pov, position, ...otherOptions } = streetViewPanoramaOptions;
      const { zoom: prevZoom, pov: prevPov, position: prevPos, ...prevOtherOptions } = prevOptions;

      if (!isEqual(zoom, prevZoom)) {
        streetViewRef.current.setZoom(zoom);
      }
      if (!isEqual(pov, prevPov)) {
        streetViewRef.current.setPov(pov);
      }
      if (!isEqual(position, prevPos)) {
        streetViewRef.current.setPosition(position);
      }
      if (!isEqual(otherOptions, prevOtherOptions)) {
        streetViewRef.current.setOptions(otherOptions);
      }
    }
  };

  useEffect(() => {
    initialize(nodeRef.current, {});

    return () => {
      if (streetViewRef.current) {
        window.google.maps.event.clearInstanceListeners(streetViewRef.current);
      }
    };
  }, []);

  useEffect(() => {
    initialize(nodeRef.current, streetViewPanoramaOptions);
  }, [streetViewPanoramaOptions]);

  return <div style={{ height: '100%' }} ref={nodeRef} />;
};

GoogleStreetview.propTypes = {
  streetViewPanoramaOptions: PropTypes.object,
  onPositionChanged: PropTypes.func,
  onPovChanged: PropTypes.func,
  onZoomChanged: PropTypes.func,
  onPanoChanged: PropTypes.func,
  onVisibleChanged: PropTypes.func,
};

GoogleStreetview.defaultProps = {
  streetViewPanoramaOptions: {
    position: { lat: 46.9171876, lng: 17.8951832 },
    pov: { heading: 0, pitch: 0 },
    zoom: 1,
  },
  onPositionChanged: () => {},
  onPovChanged: () => {},
  onZoomChanged: () => {},
  onPanoChanged: () => {},
  onVisibleChanged: () => {},
};

export default GoogleStreetview;
