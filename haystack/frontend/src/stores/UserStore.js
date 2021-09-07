import { extendObservable } from 'mobx';

class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            isNewUser: false,
            email: '',
            firstName: '',
            lastName: '',
            bio: '',
            birthday: '',
            location: '',
            phone: ''
        })
    }
}

export default new UserStore();