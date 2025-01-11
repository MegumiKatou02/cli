import * as os from 'os';

export function getNetworkInfo(): Array<{ interface: string; ip: string }> {
  const interfaces = os.networkInterfaces();
  const info: Array<{ interface: string; ip: string }> = [];

  for (const dev in interfaces) {
    if (interfaces.hasOwnProperty(dev)) {
      const iface = interfaces[dev];
      if (iface) {
        for (const addr of iface) {
          if (addr.family === 'IPv4' && !addr.internal) {
            info.push({
              interface: dev,
              ip: addr.address,
            });
          }
        }
      }
    }
  }

  return info;
}