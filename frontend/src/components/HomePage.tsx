    import type { User } from 'firebase/auth';
    import GuestSessionStarter from './GuestSessionStarter';
import UserSessionStarter from './UserSessionStarter';

    interface HomePageProps {
        onStart: (topic:string) => void;
        onLoginClick: () => void;
        onLogOutClick: () => void;
        user: User | null;
    }


    function HomePage({onStart, onLoginClick, onLogOutClick, user} : HomePageProps) {

        return (
            <div>
                <nav>
                    <h1>POMOAI</h1>
                    {user ? (
                        <div>
                            <span>Welcome {user.displayName}!</span>
                            <button onClick={onLogOutClick}>Log out</button>
                        </div>
                    ) : (                    
                        <button onClick={onLoginClick}>
                            Log in / Register
                        </button>
                    )}
                </nav>

                <main>
                    <h2>Study smarter with AI.</h2>
                    <div>
                        {user ? (
                            <UserSessionStarter onStart={onStart}></UserSessionStarter>
                        ) : (
                            <GuestSessionStarter onStart={onStart}></GuestSessionStarter>
                        )}
                    </div>
                </main>
            </div>
        )
    }

    export default HomePage;