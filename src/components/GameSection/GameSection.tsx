import React, { useEffect, useState } from 'react';
import { GameContent } from '../../types/types';
import NavbarComponent from '../Navbar/NavbarComponent';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
//import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';

type GameContentResponse = GameContent[];

const GameSection = () => {
    const [gameContent, setGameContent] = useState<GameContentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [defaultQuestionUsed, setDefaultQuestionUsed] = useState<boolean>(false);

    // const savedTranslations = localStorage.getItem('savedTranslations')
    // console.log(savedTranslations, 'savedTranslations');

    const defaultQuestions = [
        {
            question: "What is the German translation for 'I love learning languages'?",
            options: [
                "Ich liebe es, Sprachen zu lernen", 
                "Ich mag Sprachen", 
                "Ich lerne gern Sprachen"
            ],
            answer: "Ich liebe es, Sprachen zu lernen",
        },
        {
            question: "Which of the following is the correct way to say 'Where is the train station?' in German?",
            options: [
                "Wo ist der Bahnhof?", 
                "Wo ist die U-Bahn?", 
                "Wo ist das Auto?"
            ],
            answer: "Wo ist der Bahnhof?",
        },
        {
            question: "What is the German word for 'vegetables'?",
            options: [
                "Gemüse", 
                "Obst", 
                "Getreide"
            ],
            answer: "Gemüse",
        },
        {
            question: "How do you say 'I would like a coffee' in German?",
            options: [
                "Ich möchte einen Kaffee", 
                "Ich will einen Kaffee", 
                "Ich hätte gern einen Kaffee"
            ],
            answer: "Ich hätte gern einen Kaffee",
        },
        {
            question: "What does 'Guten Appetit' mean?",
            options: [
                "Enjoy your meal", 
                "Good night", 
                "Have a good trip"
            ],
            answer: "Enjoy your meal",
        },
        {
            question: "What is the plural form of 'das Buch' (the book) in German?",
            options: [
                "die Bücher", 
                "die Buchs", 
                "das Bücher"
            ],
            answer: "die Bücher",
        },
    ];
    
    

    const loadUserId = () => {
        return localStorage.getItem('userId');
    }

    const userId = loadUserId();

    useEffect(() => {
        if(!userId){
            alert('Please login to start the game')
        }
    },[userId])

    

    const startGame = async () => {
        setLoading(true);
        setDefaultQuestionUsed(false);
        try {
            const savedGameContent = localStorage.getItem('gameContent');
    
            if (savedGameContent && savedGameContent !== 'undefined') {
                try {
                    const parsedContent = JSON.parse(savedGameContent);
                    setGameContent(parsedContent);
                } catch (error) {
                    console.error('Error parsing gameContent from localStorage:', error);
                    setGameContent(defaultQuestions);
                    setDefaultQuestionUsed(true);
                }
            } else {
                // Fetching data from the API if no saved content is found
                const response = await fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/gamifyLearning', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }),
                });
    
                const textData = await response.text();
                const data = JSON.parse(textData);
        
                //console.log('raw data', textData);
    
                // Ensure gameContent is an array
                const arrayedGameContent = Array.isArray(data.gameContent) ? data.gameContent : [data.gameContent];
    
                if(arrayedGameContent.length === 0){
                    setGameContent(defaultQuestions);
                    setDefaultQuestionUsed(true);
                }else{
                // Convert options to an array of objects if it's not already
                const arrayedGameContentAndOptions = arrayedGameContent.map((item: any) => ({
                    ...item,
                    options: Array.isArray(item.options)
                        ? item.options
                        : Object.keys(item.options).map((key) => ({
                            [key]: item.options[key]
                        })),
                }));
    
                setGameContent(arrayedGameContentAndOptions);
                localStorage.setItem('gameContent', JSON.stringify(data.gameContent));
            }
            }
        } catch (error) {
            console.error('Error:', error);
            setGameContent(defaultQuestions);
            setDefaultQuestionUsed(true);
        } finally {
            setLoading(false);
        }
    };
    

    

    const handleAnswer = (selectedOption: string) => {
        if (gameContent) {
            const currentQuestion = gameContent[currentQuestionIndex];

            if (selectedOption === currentQuestion.answer) {
                setScore(score + 1);
                setFeedback('Correct!');
            } else {
                setFeedback(`Incorrect! The correct answer is: ${currentQuestion.answer}`);
            }

            setTimeout(() => {
                setFeedback(null);
                if (currentQuestionIndex < gameContent.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    const finalScore = score + (selectedOption === currentQuestion.answer ? 1 : 0);
                    alert(`Game over! Your final score is: ${finalScore}` + (defaultQuestionUsed? '\nPlease save more translations to continue playing' : ""));
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setGameContent(null);
                }
            }, 2000);
        }
    };

    const reset = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameContent(null);
        //localStorage.removeItem('gameContent');
    }
    return (
        <div>
            <NavbarComponent />
            <Container className='mt-4'>
                <Row className=' d-flex  justify-content-center' style={{marginTop: '100px'}}>
                    <Col md={6} className='d-flex justify-content-center'>
                        {!gameContent && !loading && (
                            <Button variant="primary" onClick={startGame}>Start Game</Button>
                        )}
                    </Col>
                </Row>

                <Row className='d-flex justify-content-center'>
                    <Col md={6} className='d-flex justify-content-center'>
                        {loading ? (
                            <Spinner animation='border' role='status'>
                                <span className='visually-hidden'>Loading game...</span>
                            </Spinner>
                        ) : (
                            gameContent && gameContent[currentQuestionIndex] && (
                                <div className='text-center'>
                                    <h4>{score}</h4>
                                    {feedback && (
                                        <Alert variant={feedback === 'Correct!' ? 'success' : 'danger'}>
                                            {feedback}
                                        </Alert>
                                    )}

                                    {!feedback && (
                                        <div>
                                            <p><strong>Question:</strong> {gameContent[currentQuestionIndex].question && gameContent[currentQuestionIndex].question}</p>
                                            {Array.isArray(gameContent[currentQuestionIndex].options) && gameContent[currentQuestionIndex].options.map((option, index) => (
                                                <>
                                                <Button
                                                    // key={`${option} - ${index}`}
                                                    key={index}
                                                    variant='outline-primary'
                                                    onClick={() => handleAnswer(option)}
                                                    // className='d-block mb-2'
                                                    className='mx-2'
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {option}
                                                </Button>   
                                                </>
                                            ))}
                                            <div className="mt-4">
                                                <Button variant="danger" onClick={reset}>
                                                    Exit Game
                                                </Button>
                                            </div>
                                        </div>


                                    )}
                                </div>
                                
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default GameSection;














