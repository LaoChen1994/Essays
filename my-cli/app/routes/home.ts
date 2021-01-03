import HomeController from '../controller/home'

export default [
    {
        path: '/',
        method: 'get',
        controller: HomeController.getIndexHtml
    },
    {
        path: '/download/text',
        method: 'get',
        controller: HomeController.getDownloadFile
    }
]