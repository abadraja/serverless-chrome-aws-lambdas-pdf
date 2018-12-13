import Cdp from 'chrome-remote-interface'

export default async function magic (event) {
    console.log(`pass: ${event}, ${Cdp.Version()}`);
    return event;
}
