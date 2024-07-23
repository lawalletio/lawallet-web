import NimiqQrScanner from 'qr-scanner';
import { CSSProperties } from 'react';
export { default as Nimiq } from 'qr-scanner';

export interface QrScannerProps {
  /**
   * Media track constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Property that represents an optional className to modify styles
   */
  className?: string;
  /**
   * Property that represents a style for the container
   */
  containerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video container
   */
  videoContainerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video
   */
  videoStyle?: CSSProperties;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
  /**
   * Property that represents the view finder component
   */
  ViewFinder?: () => React.ReactNode;
  /**
   * Start the camera as soon as the component mounts?
   */
  startOnLaunch?: boolean;
  /**
   * A handler to receive the underlying scan controller
   */
  onMount?: (controller: NimiqQrScanner) => void;
  /**
   * A handler that can handle both successful and unsuccessful scans
   */
  onScan?: (result?: NimiqQrScanner.ScanResult, error?: Error | string) => void;
  /**
   * A handler for successful scans
   */
  onDecode?: (result: NimiqQrScanner.ScanResult) => void;
  /**
   * A handler for unsuccessful scans
   */
  onDecodeError?: (error: Error | string) => void;
  /**
   *
   */
  calculateScanRegion?: (video: HTMLVideoElement) => NimiqQrScanner.ScanRegion;
  /**
   * The preffered camera, will attempt to use this first
   */
  preferredCamera?: NimiqQrScanner.FacingMode | NimiqQrScanner.DeviceId;
  /**
   *
   */
  maxScansPerSecond?: number;
  /**
   *
   */
  highlightScanRegion?: boolean;
  /**
   *
   */
  highlightCodeOutline?: boolean;
  /**
   *
   */
  overlay?: HTMLDivElement;
  /** just a temporary flag until we switch entirely to the new api */
  returnDetailedScanResult?: true;
}
