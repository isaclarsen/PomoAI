import type { ProblemDetail } from "./types";

export class ApiError extends Error {
    status: number;
    detail: string;

    constructor(status: number, detail: string){
        super (detail);
        this.name = "ApiError";
        this.status = status;
        this.detail = detail;
    }
}

export const toApiError = async (response: Response, fallbackMessage: string) => {
    const rawBody = await response.text();
            let detail = fallbackMessage
    
            if(rawBody){
                try{
                    const parsed = JSON.parse(rawBody) as ProblemDetail;
                    detail = parsed.detail?.trim() || rawBody;
                }catch {
                    detail = rawBody
                }
            }
            throw new ApiError(response.status, detail);
}