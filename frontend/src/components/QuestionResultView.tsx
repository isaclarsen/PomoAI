import type { QuestionDTO } from "../api/pomoApi";

interface QuestionResultViewProps {
    onReset: () => void;
    questions: QuestionDTO[];
}

function QuestionResultView({ onReset, questions }: QuestionResultViewProps) {

    return (
        <div>
            <h2>Dina AI-genererade frågor</h2>
            <p>Försök svara på dessa muntligt eller i anteckningar.</p>

            <div>
                
                {questions.map((question : QuestionDTO) => (
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