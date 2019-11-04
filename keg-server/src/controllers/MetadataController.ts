import { Request, Response } from 'express';
import os from 'os';

interface NetInterface {
  ifname: string;
  alias: number;
  address: string;
}

function ip(): NetInterface[] {
  var ifaces = os.networkInterfaces();

  const result: NetInterface[] = [];
  Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
        result.push({ ifname, alias, address: iface.address });
      } else {
        // this interface has only one ipv4 adress
        result.push({ ifname, alias, address: iface.address });
      }
      ++alias;
    });
  });

  return result;
}

export interface MetadataResponse {
  ip: string;
}

export function getMetadata(req: Request, res: Response) {
  const interfaces = ip();
  const result: MetadataResponse = {
    ip: interfaces[0].address,
  };

  return res.send(result);
}
