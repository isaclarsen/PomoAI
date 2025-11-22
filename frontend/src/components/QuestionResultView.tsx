interface QuestionResultViewProps {
    onReset: () => void;
}

function QuestionResultView({ onReset }: QuestionResultViewProps) {

    const mockQuestions = [
        { id: 1, text: "Vad är skillnaden mellan en klass och ett objekt i Java?" },
        { id: 2, text: "Förklara begreppet 'State' i React med egna ord." },
        { id: 3, text: "Varför ska man inte ändra state direkt utan använda en setter?" }
    ];

    return (
        <div>
            <h2>Dina AI-genererade frågor</h2>
            <p>Försök svara på dessa muntligt eller i anteckningar.</p>

            <div>
                
                {mockQuestions.map((question) => (
                    <div key={question.id}>{question.text}</div>
                ))}

            </div>

            <button onClick={onReset}>
                Klar / Börja om
            </button>
        </div>
    );
}

export default QuestionResultView;