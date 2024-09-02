import React, { useEffect, useState } from 'react';
import { GameContent } from '../../types/types';
import NavbarComponent from '../Navbar/NavbarComponent';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';

type GameContentResponse = GameContent[];

const GameSection = () => {
    const [gameContent, setGameContent] = useState<GameContentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [feedback, setFeedback] = useState<string | null>(null);

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
        try {
            const savedGameContent = localStorage.getItem('gameContent');

            if(savedGameContent){
                setGameContent(JSON.parse(savedGameContent));
                // console.log('game loaded from localstorage')
            } else {

            
            const response = await fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/gamifyLearning', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });

            const data = await response.json();
            // console.log('Fetched gameContent:', data.gameContent);

            if (Array.isArray(data.gameContent)) {
                setGameContent(data.gameContent);
                localStorage.setItem('gameContent', JSON.stringify(data.gameContent));
            } else {
                setGameContent([data.gameContent]);
                localStorage.setItem('gameContent', JSON.stringify(data.gameContent));
            }
        }

        } catch (error) {
            console.error('Error:', error);
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
                    alert(`Game over! Your final score is: ${score + (selectedOption === currentQuestion.answer ? 1 : 0)}`);
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
        localStorage.removeItem('gameContent');
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
                                            {gameContent[currentQuestionIndex].options && gameContent[currentQuestionIndex].options.map((option, index) => (
                                                <>
                                                <Button
                                                    key={`${option} - ${index}`}
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


