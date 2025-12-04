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
                    <h1 className='text-white'>POMOAI</h1>
                    <span className='text-white'>DASHBOARD</span>
                </div>
                <div>
                    <span className='text-white'>Hi {user.displayName}, ready to study?</span>
                    <button onClick={onLogoutClick} className='text-white'>
                        Log out
                    </button>
                </div>
            </header>

            <main>
                <section>
                    <h2 className='text-white'>Time to focus?</h2>
                    <p className='text-white'>Choose a topic and let AI generate questions for you after your session.</p>

                    <div>
                        <h3 className='text-white'>Start Session</h3>
                        <UserSessionStarter onStart={onStart}/>
                    </div>
                </section>

                <section>
                    <h3 className='text-white'>Your Sessions</h3>
                    <p className='text-white'>No sessions saved yet...</p>
                </section>
            </main>
        </div>
    )
}

export default Dashboard;