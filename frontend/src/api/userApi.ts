import type { PomoSettings } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080/api/";

export const getUserPomoSettingsApi = async(token: string) : Promise<PomoSettings> => {
    const url = BASE_URL + "user/pomo-settings";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if(!response.ok){
        throw new Error("Failed to fetch Pomo Settings")
    }

    const result = await response.json()

    return result;
}

export const updateUserPomoSettingsApi = async(token: string, patch: PomoSettings) : Promise<PomoSettings> => {
    const url = BASE_URL + "user/pomo-settings";

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
            patch
        )
    });

    if(!response.ok){
        const text = await response.text();
        throw new Error(`Failed to patch Pomo Settings: ${response.status} ${text}`)
    }

    const result = await response.json()

    return result;
}