import type { User } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080/api/";

export const syncUser = async(token : string,
    email : string,
    displayName: string,
    educationLevel: string
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
        throw new Error("Failed to sync user")
    }

    const result = await response.json()

    return result;
}