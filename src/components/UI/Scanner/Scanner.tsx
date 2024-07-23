import * as React from 'react';
import NimiqQrScanner from 'qr-scanner';
import { QrScannerProps } from './types';

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'fixed',
  },
  video: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    overflow: 'hidden',
    position: 'absolute',
  },
};

const QrScanner = (props: QrScannerProps) => {
  const {
    className,
    containerStyle,
    videoContainerStyle,
    videoStyle,
    videoId,
    ViewFinder,
    startOnLaunch,
    onMount,
    onScan,
    onDecode,
    onDecodeError,
    calculateScanRegion,
    preferredCamera,
    maxScansPerSecond,
    highlightScanRegion,
    highlightCodeOutline,
    overlay,
    returnDetailedScanResult,
  } = props;

  const video = React.createRef<HTMLVideoElement>();

  React.useEffect(() => {
    if (video.current) {
      // create scanner bound to video html element
      const target = video.current;

      const scanner = new NimiqQrScanner(
        target,
        (result) => {
          if (onDecode) onDecode(result);
          if (onScan) onScan(result);
        },
        {
          onDecodeError: (error) => {
            if (onDecodeError) onDecodeError(error);
            if (onScan) onScan(undefined, error);
          },
          calculateScanRegion,
          preferredCamera,
          maxScansPerSecond,
          highlightScanRegion,
          highlightCodeOutline,
          overlay,
          returnDetailedScanResult,
        },
      );

      if (startOnLaunch) {
        scanner.setInversionMode('both');
        scanner.start().then(
          () => {
            /*Started successfully*/
          },
          (err) => console.log('Error starting scanner: ', err),
        );
      }

      if (onMount) onMount(scanner);

      return () => {
        scanner.destroy();
      };
    }
  }, []);

  return (
    <section className={className} style={containerStyle}>
      <div
        style={{
          ...styles.container,
          ...videoContainerStyle,
        }}
      >
        {!!ViewFinder && <ViewFinder />}
        <video
          ref={video}
          muted
          id={videoId}
          style={{
            ...styles.video,
            ...videoStyle,
          }}
        />
      </div>
    </section>
  );
};

export default QrScanner;
