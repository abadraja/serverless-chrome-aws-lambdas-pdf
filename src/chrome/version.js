import Cdp from 'chrome-remote-interface'

export default async function version () {
  console.log(typeof Cdp.Version());
  console.log(typeof Date.now());

  // return Date.now();
  return Cdp.Version()
}
