interface FocusTimerViewProps {
    onTimerFinished: () => void;
}

function FocusTimerView({onTimerFinished} : FocusTimerViewProps){
    return (
        <div>
            <h2>Fokus!</h2>
            <div>25:00</div>
            <button onClick={onTimerFinished}>
                Skippa timer (dev)
            </button>
        </div>
    )
}

export default FocusTimerView