import { useNuxtApp } from '#app'

import { createServices } from './services'

const createApi = () => {
    const { getToken } = useNuxtApp().$keycloak
    return createServices(Promise.resolve(getToken))
}

let api: ReturnType<typeof createServices> | null = null

export const getApi = () => {
    if (!api) api = createApi()
    return api
}
