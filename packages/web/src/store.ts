import { create } from 'zustand/react'
import { persist } from 'zustand/middleware'

type AnonymousUser = {id: string, token: string}

type AppStoreState = { 
    user: AnonymousUser | null,
    sharedList: string[],
    participations: Record<string, string>,
    disabledListPrivacy: string[]
}
type AppStoreActions = {
    setUser: (user: AnonymousUser) => void, 
    resetUser: () => void,
    addSharedList: (id: string) => void,
    setParticipation: (listId: string, participant: string) => void,
    saveDisabledPrivacy: (listId: string) => void,
    resetPrivacy: (listId: string) => void,
}
type HydratationStoreState = { _hydrated: boolean }
type HydratationStoreActions = { _setHydrated: (value: boolean) => void }

type AppStore = AppStoreState & AppStoreActions & HydratationStoreState & HydratationStoreActions

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
        user: null,
        sharedList: [],
        participations: {},
        disabledListPrivacy: [],
        _hydrated: false,
        setUser: (user: AnonymousUser) => set({user}),
        addSharedList: (id: string) => set((state) => {
            if (state.sharedList.includes(id)) return {}
            return {sharedList: [...state.sharedList, id]}
        }),
        saveDisabledPrivacy: (id: string) => set((state) => {
            if (state.disabledListPrivacy.includes(id)) return {}
            return {disabledListPrivacy: [...state.disabledListPrivacy, id]}
        }),
        resetPrivacy: (id: string) => set((state) => {
            const listIdIndex = state.disabledListPrivacy.findIndex(list => list === id)
            if(listIdIndex === -1) return {}

            const newPrivacyArray = [
                ...state.disabledListPrivacy.slice(0, listIdIndex),
                ...state.disabledListPrivacy.slice(listIdIndex+1)
            ]
            
            return {disabledListPrivacy: newPrivacyArray}
        }),
        setParticipation: (listId, participant) => set(state => ({participations: {...state.participations, [listId]: participant}})),
        resetUser: () => set({user: null}),
        _setHydrated: (value) => set({_hydrated: value})
    }),
    { name: 'app-storage', onRehydrateStorage: ({_setHydrated}) => { return () => _setHydrated(true) }},
  ),
)