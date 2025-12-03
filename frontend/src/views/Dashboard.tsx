import type { User } from '../api/pomoApi';
import UserSessionStarter from '../components/UserSessionStarter';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
    onLogoutClick: () => void;
}

function Dashboard({ user, onStart, onLogoutClick }: DashboardProps) {
    return(
        <div>
            <header>
                <div>
                    <h1>POMOAI</h1>
                    <span>DASHBOARD</span>
                </div>
                <div>
                    <span>Hi {user.displayName}, ready to study?</span>
                    <button onClick={onLogoutClick}>
                        Log out
                    </button>
                </div>
            </header>

            <main>
                <section>
                    <h2>Time to focus?</h2>
                    <p>Choose a topic and let AI generate questions for you after your session.</p>

                    <div>
                        <h3>Start Session</h3>
                        <UserSessionStarter onStart={onStart}/>
                    </div>
                </section>

                <section>
                    <h3>Your Sessions</h3>
                    <p>No sessions saved yet...</p>
                </section>
            </main>
        </div>
    )
}

export default Dashboard;