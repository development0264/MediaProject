const HOST = 'http://localhost:3000'

export const CONSTANST = {
    permissions: {},
    routes: {
        authorization: {
            login: HOST + '/api/auth/login',
            signup: HOST + '/api/auth/signup'
        },
        person: {
            list: HOST + '/api/person',
            delete: HOST + '/api/person/delete/:id',
            save: HOST + '/api/person/save',
            get: HOST + '/api/person/:id'
        },
        user: {}
    },
    lang: {},
    session: {},
    parameters: {}
};
