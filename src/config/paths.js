import { URL } from 'url'

const paths = {
    __dirname: new URL('..', import.meta.url).pathname,
    __filename: new URL('', import.meta.url).pathname
}

export default paths;