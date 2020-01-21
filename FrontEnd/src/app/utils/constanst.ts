const HOST = 'http://192.168.0.140:3000'

export const CONSTANST = {
    permissions: {},
    routes: {
        authorization: {
            login: HOST + '/api/auth/login',
            signup: HOST + '/api/auth/signup',
            resend: HOST + '/api/auth/resend',
            forgotpassword: HOST + '/api/auth/forgotpassword',
            request: HOST + '/api/auth/request',
            confirm: HOST + '/api/auth/confirm'
        },
        media: {
            list: HOST + '/api/media/list',
            sharedlist: HOST + '/api/media/sharedlist',
            photo: HOST + '/api/media/photo',
            video: HOST + '/api/media/video',
            photoandvideo: HOST + '/api/media/photoandvideo',
            share: HOST + '/api/media/share',
            notificationcount: HOST + '/api/media/notificationcount',
            notificationupdate: HOST + '/api/media/notificationupdate',

        },
        generic: {
            terms: HOST + '/api/terms',
            contactus: HOST + '/api/contactus',
            accesstoken: HOST + '/api/accesstoken',
        }
    },
    lang: {},
    session: {},
    parameters: {}
};
