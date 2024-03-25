import { useState } from 'react';
import Reel from './Reel';
import Button from './Button';
import { useCredits } from './CreditsContext'; 

const Slots = () => {
    const { credits, setCredits } = useCredits();
    const [reels, setReels] = useState(['🚀', '🪙', '💰']);
    const [message, setMessage] = useState('');
    const [bet, setBet] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);

    const symbols = ['🚀', '🍒', '🔔', '💰', '🪙'];

    const getPayoutMultiplier = (reels) => {
        if (reels.every(symbol => symbol === '🚀')) return 100;
        if (reels.every(symbol => symbol === '💰')) return 25;
        if (reels.every(symbol => symbol === '🪙')) return 10;
        if (reels.filter(symbol => symbol === '🚀').length === 2) return 5;
        if (reels.every(symbol => symbol === '🍒')) return 3;
        if (reels.every(symbol => symbol === '🔔')) return 3;
        if (reels.filter(symbol => symbol === '💰').length === 2) return 2;
        if (reels.filter(symbol => symbol === '🪙').length === 2) return 1;
        if (reels.includes('🚀')) return 1;
        return 0;
    };


    const spinReels = () => {
        if (credits < bet || isSpinning) {
            setMessage(credits <= 0 ? 'No more credits!' : 'Not enough credits for this bet!');
            return;
        }

        setCredits(currentCredits => currentCredits - bet);
        setIsSpinning(true);
        setMessage('');
        const finalReels = new Array(reels.length).fill(null);
        let maxDelay = 0;

        reels.forEach((_, index) => {
            const delay = (index + 1) * 500 + 1000;
            maxDelay = delay;

            setTimeout(() => {
                const newSymbolIndex = Math.floor(Math.random() * symbols.length);
                finalReels[index] = symbols[newSymbolIndex];

                setReels(prevReels => {
                    const newReels = [...prevReels];
                    newReels[index] = finalReels[index];
                    return newReels;
                });

            }, delay - 1000);
        });

        setTimeout(() => {
            setIsSpinning(false);
            const payoutMultiplier = getPayoutMultiplier(finalReels);

            if (payoutMultiplier > 0) {
                const winnings = bet * payoutMultiplier;
                setCredits(currentCredits => currentCredits + winnings);
                setMessage(`You won ${winnings} credits!`);
            } else {
                setMessage('Try again!');
            }
        }, maxDelay);
    };

    const addCredits = () => {
        setCredits(10);
        setMessage('');
    }

    const changeBet = (newBet) => {
        setBet(newBet);
        setMessage('');
    }

    return (
        <div>
            <div className="reels">
                {reels.map((symbol, index) => (
                    <Reel key={index} symbol={symbol} startSpinning={isSpinning} stopAfter={(index + 1) * 500 + 1000} />
                ))}
            </div>
            {credits > 0 ? (
                <>
                    <Button onClick={spinReels}>Spin</Button>
                </>
            ) : (
                <Button onClick={addCredits}>Get More Credits</Button>
            )}
            <p className='bet'><strong>Bet: </strong><em>{bet}</em></p>
            <div className='bet-btns'>
                <button onClick={() => changeBet(1)} disabled={credits === 0}>Bet 1</button>
                <button onClick={() => changeBet(2)} disabled={credits < 2}>Bet 2</button>
                <button onClick={() => changeBet(3)} disabled={credits < 3}>Bet 3</button>
            </div>
            <p className='credits'><strong>Credits: </strong><em>{credits}</em></p>
            <p className='message'><strong>{message}</strong></p>

            <div className='legend'>
                <p><span>🚀🚀🚀</span>: Jackpot - 100x bet</p>
                <p><span>💰💰💰</span>: High Payout - 20x bet</p>
                <p><span>🪙🪙🪙</span>: Medium-High Payout - 10x bet</p>
                <p><span>🚀🚀</span>: Medium Payout - 5x bet</p>
                <p><span>🍒🍒🍒</span>: Medium Payout - 3x bet</p>
                <p><span>🔔🔔🔔</span>: Medium Payout - 3x bet</p>
                <p><span>💰💰</span>: Lower Payout - 2x bet</p>
                <p><span>🪙🪙</span>: Low Payout - 1x bet</p>
                <p><span>🚀</span>: Lowest Payout - 1x bet</p>
            </div>
        </div>
    );
}

export default Slots;