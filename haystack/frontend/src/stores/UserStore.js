import { extendObservable } from 'mobx';

class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            email: '',
            firstName: '',
            lastName: ''
        })
    }
}

export default new UserStore();