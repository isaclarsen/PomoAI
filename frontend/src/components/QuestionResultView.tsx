import { useState, useMemo } from "react"; // <--- OBS: Vi behöver useMemo för blandningen
import type { QuestionDTO } from "../api/pomoApi";

interface QuestionResultViewProps {
    onReset: () => void;
    questions: QuestionDTO[];
}

function QuestionResultView({ onReset, questions }: QuestionResultViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isOptionsRevealed, setIsOptionsRevealed] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];
    const isQuizFinished = currentIndex >= questions.length
    
    //Shuffle the options since AI is tending to always pick the first one as correct
    const shuffledOptions = useMemo(() => {
        if (!currentQuestion) return [];

        const currentOptionsCopy = [...currentQuestion.options];
        currentOptionsCopy.sort(() => Math.random() - 0.5)
        
        return currentOptionsCopy; 
    }, [currentQuestion]);
    
    const handleOptionClick = (option: string) => {
        //If a guess is already made, dont change the guess
        if (selectedOption !== null) return;

        setSelectedOption(option)
        
        if(option === currentQuestion.correctAnswer){
            setScore(score + 1)
        }
    };

    const handleNextQuestion = () => {
        setIsOptionsRevealed(false);
        setSelectedOption(null)
        setCurrentIndex(currentIndex + 1)
    };

    if(!questions || questions.length === 0){
        return(
            <div>
                <p>AI genererar frågor...</p>
            </div>
        )
    }

    //Render when quiz is done
    if (isQuizFinished) {
        return (
            <div>
                <h2>Bra jobbat!</h2>
                <p>Du fick {score} poäng av {questions.length} möjliga!</p>
                <button onClick={onReset}>Börja om</button>
            </div>
        )
    }

    return (
        <div>
            <p>Fråga {currentIndex + 1} av {questions.length}</p>
            <h2>{questions[currentIndex].text}</h2>

            {!isOptionsRevealed && (
                <div>
                    <p>Fundera på svaret...</p>
                    <button onClick={() => setIsOptionsRevealed(true)}>Visa alternativ</button>
                </div>
            )}

            {isOptionsRevealed && (
                <div>
                    {shuffledOptions.map((option) => {                       
                        let buttonColor = 'white'; // Standardcolor

                            //Checking if selected option is correct or wrong, paint button based on result
                            if(selectedOption){
                                if(option === currentQuestion.correctAnswer){
                                    buttonColor = "green"
                                }else if(option === selectedOption){
                                    buttonColor = "red"
                                }
                            }
                            
                            return (
                                <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                style={{ backgroundColor: buttonColor }}
                                >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {selectedOption && (
                <button onClick={handleNextQuestion}>
                    Nästa fråga
                </button>
            )}

        </div>
    );
}

export default QuestionResultView;