export default {
    loadJs(path: string) {
        const CDN_PATH = 'http://127.0.0.1:3000'

        if (process.env.NODE_ENV === 'development') {
            return `<script src="/public/js/${path}"></script>`
        } else {
            return `<script src="${CDN_PATH}/public/js/${path}"></script>`
        }
    }
}