import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Timer = () => {
    const initialTime = 25 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timer, setTimer] = useState(null);

    const resetTimer = () => {
        setTimeLeft(initialTime);
        clearInterval(timer);
        setTimerRunning(false);
    };

    const startTimer = () => {
        if (!timerRunning) {
            const newTimer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            setTimer(newTimer);
            setTimerRunning(true);
        }
    };

    const stopTimer = () => {
        clearInterval(timer);
        setTimerRunning(false);
    };

    const updateTimer = () => {
        return `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`;
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            stopTimer();
        }
    }, [timeLeft]);

    const progress = (timeLeft / initialTime) * 100;

    return (
        <Card className="text-center" style={{ width: '30rem', margin: '10rem auto' }}>
            <Card.Body>
                <Card.Title>Timer</Card.Title>
                <Card.Text style={{ fontSize: '2em', margin: '2rem' }}>{updateTimer()}</Card.Text>
                <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                    <Button variant="primary" onClick={startTimer}>Start</Button>
                    <Button variant="warning" onClick={stopTimer} disabled={!timerRunning}>Stop</Button>
                    <Button variant="danger" onClick={resetTimer}>Reset</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Timer;
