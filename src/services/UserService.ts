import { v4 as uuidv4 } from 'uuid'

class UserService {
    key = 'user'
    user: string | null
    
    constructor() {
        if (localStorage.getItem(this.key) === null) {
            localStorage.setItem(this.key, uuidv4())
        }

        this.user = localStorage.getItem('user')
    }

    getUser() {
        return this.user
    }

    setProvider(list, value) {
        localStorage.setItem(`provider-${list}`, value)
    }

    getProvider(list) {
        return localStorage.getItem(`provider-${list}`)
    }

    hasProvider(list) {
        return this.getProvider(list) !== null
    }
}

export default new UserService()