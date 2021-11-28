class ShareService {
    key = 'shared-list'

    saveSharedList(id) {
        if (!this.hasSharedList(id)) {
            localStorage.setItem(this.key, JSON.stringify([...this.getSharedList(), id]))
        }
    }

    getSharedList() {
        return JSON.parse(localStorage.getItem(this.key) ?? "[]")
    }
    
    hasSharedList(id) {
        return this.getSharedList().includes(id)
    }
}

export default new ShareService()