import { toApiError } from "../../../shared/api/errors";
import type { User } from "../../../shared/api/types";

const rawBaseUrl = import.meta.env.VITE_API_URL_DEV || "/api/";
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

export const syncUser = async(
    token: string,
    email: string,
    displayName?: string | null,
    educationLevel?: string | null
) : Promise<User> => {
    const url = BASE_URL + "auth/sync"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            email,
            displayName,
            educationLevel
        })
    });

    if(!response.ok){
        await toApiError(response, `Failed to sync user: ${response.status}`)
    }
    return await response.json()
}
