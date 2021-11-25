import UserService from "@/services/UserService";

function useUser() {
    return [UserService.getUser()]
}

function useProvider(id) {
    return [UserService.getProvider(id)]
}

export { useUser, useProvider }