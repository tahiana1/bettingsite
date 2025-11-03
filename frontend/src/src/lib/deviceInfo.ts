import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface DeviceInfo {
  os: string;
  device: string;
  fingerPrint: string;
}

/**
 * Get OS name from user agent
 */
const getOS = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  
  if (/Win/.test(platform)) return 'Windows';
  if (/Mac/.test(platform)) return 'MacOS';
  if (/Linux/.test(platform)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  
  return 'Unknown';
};

/**
 * Get device information from user agent
 */
const getDevice = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  
  // Check for mobile devices
  if (/iPhone/.test(userAgent)) {
    return 'iPhone';
  }
  if (/iPad/.test(userAgent)) {
    return 'iPad';
  }
  if (/Android/.test(userAgent)) {
    const match = userAgent.match(/Android\s+([\d.]+)/);
    return match ? `Android ${match[1]}` : 'Android';
  }
  
  // Desktop browsers
  if (/Chrome/.test(userAgent) && !/Edge|Edg/.test(userAgent)) {
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    return match ? `Chrome ${match[1]}` : 'Chrome';
  }
  if (/Firefox/.test(userAgent)) {
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    return match ? `Firefox ${match[1]}` : 'Firefox';
  }
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    const match = userAgent.match(/Version\/([\d.]+)/);
    return match ? `Safari ${match[1]}` : 'Safari';
  }
  if (/Edge|Edg/.test(userAgent)) {
    const match = userAgent.match(/Edge?\/([\d.]+)/);
    return match ? `Edge ${match[1]}` : 'Edge';
  }
  
  return platform || 'Unknown Device';
};

/**
 * Get device fingerprint using FingerprintJS
 */
const getFingerprint = async (): Promise<string> => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error getting fingerprint:', error);
    // Fallback to a simple hash based on user agent and screen
    return btoa(
      `${window.navigator.userAgent}-${window.screen.width}x${window.screen.height}-${window.screen.colorDepth}`
    ).substring(0, 32);
  }
};

/**
 * Get all device information (OS, Device, FingerPrint)
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const os = getOS();
  const device = getDevice();
  const fingerPrint = await getFingerprint();
  
  return {
    os,
    device,
    fingerPrint,
  };
};

