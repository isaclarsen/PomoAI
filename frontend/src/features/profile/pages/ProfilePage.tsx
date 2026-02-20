import type { User } from "../../../shared/api/types";
import { AppBackground } from "../../../shared/components/AppBackground";

interface ProfilePageProps{
    user: User
}

export function ProfilePage({ user } : ProfilePageProps){

    return(
        <div>
            <AppBackground />
            <p className="text-white">{user.displayName}</p>
            <p className="text-white">{user.educationLevel}</p>
            <p className="text-white">{user.email}</p>
            <p className="text-white">{user.userId}</p>
        </div>
    )
}