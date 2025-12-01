import GuestSessionStarter from './GuestSessionStarter';

interface HomePageProps {
    onStart: (topic:string) => void;
    onLoginClick: () => void;
}

function HomePage({onStart, onLoginClick} : HomePageProps) {

    return (
        <div>
            <nav>
                <h1>POMOAI</h1>
                <button onClick={onLoginClick}>
                    Log in / Register
                </button>
            </nav>

            <main>
                <h2>Study smarter with AI.</h2>
                <div>
                    <GuestSessionStarter onStart={onStart}></GuestSessionStarter>
                </div>
            </main>
        </div>
    )
}

export default HomePage;