import { useState, useEffect } from 'react';
import { useCredits } from './CreditsContext';
import Logo from '../assets/eth.svg';

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    if (card.value === 'A') {
      aces += 1;
      score += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value, 10);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
};

const Blackjack = () => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const { credits, setCredits } = useCredits();
  const [currentBet, setCurrentBet] = useState(0);
  const [betInput, setBetInput] = useState('');
  const [status, setStatus] = useState('Place bet to deal cards.');
  const [gameOver, setGameOver] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [dealerSecondCardVisible, setDealerSecondCardVisible] = useState(false);

  const startNewGame = () => {
    const betAmount = parseInt(betInput, 10);
    if (isNaN(betAmount) || betAmount <= 0) {
      setStatus('Invalid bet amount.');
      return;
    }
    if (betAmount > credits) {
      setStatus('Not enough credits.');
      return;
    }


    setCurrentBet(betAmount);
    setCredits(credits - betAmount);
    setStatus('');
    setGameOver(false);
    setDealerSecondCardVisible(false);
    setBetInput('');

    setDeck(createDeck());
    setPlayerHand([deck.pop(), deck.pop()]);
    setDealerHand([{ ...deck.pop(), isVisible: true }, { ...deck.pop(), isVisible: false }]);

  };

  const hit = () => {
    if (!gameOver) {
      const newCard = deck.pop();
      const newHand = [...playerHand, newCard];

      setPlayerHand(newHand);

      const newScore = calculateScore(newHand);
      if (newScore >= 21) {
        setTimeout(() => endGame(newHand, dealerHand), 0);
      }
    }
  };

  const stand = () => {
    if (!gameOver) {
      let newDealerHand = dealerHand.map((card, index) =>
        index === 1 ? { ...card, isVisible: true } : card
      );

      while (calculateScore(newDealerHand.filter(card => card.isVisible)) < 17) {
        newDealerHand.push({ ...deck.pop(), isVisible: true });
      }

      setDealerHand(newDealerHand);
      setTimeout(() => endGame(playerHand, newDealerHand), 0);
    }
  };


  const endGame = (playerFinalHand, dealerFinalHand) => {
    const playerScore = calculateScore(playerFinalHand || playerHand);
    const dealerScore = calculateScore(dealerFinalHand);

    if (playerScore > 21) {
      setStatus(`You bust with a score of ${playerScore}. You lose!`);
    } else if (dealerScore > 21) {
      setStatus(`Dealer busts with a score of ${dealerScore}. You win!`);
      setCredits(credits + currentBet * 2);
    } else if (dealerScore <= 21 && dealerScore > playerScore) {
      setStatus(`Dealer wins with ${dealerScore} against your ${playerScore}.`);
    } else if (playerScore <= 21 && playerScore > dealerScore) {
      setStatus(`You win with ${playerScore} against dealer's ${dealerScore}!`);
      setCredits(credits + currentBet * 2);
    } else {
      setStatus(`Push! Both you and dealer have ${playerScore}.`);
      setCredits(credits + currentBet);
    }

    const id = setTimeout(() => {
      setGameOver(true);
      setCurrentBet(0);
      setStatus('Place bet to deal cards.');
    }, 3000);

    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const addCredits = () => {
    setCredits(10);
  }


  return (
    <div className='blackjack'>
      <p className='credits'><strong>Credits: </strong><em>{credits}</em></p>
      <p className='bet'><strong>Bet: </strong><em>{currentBet || 0}</em></p>

      <div className='blackjack'>
        {!gameOver && (
          <>
            <p><strong>Dealer: </strong>
              <em>{dealerSecondCardVisible ? calculateScore(dealerHand) : calculateScore(dealerHand.filter(card => card.isVisible))}</em>
            </p>   

            <div className="hands dealer">
              {dealerHand.map((card, index) => {
                return card.isVisible ?
                  <span key={index} data-suit={card.suit} data-value={card.value}></span> :
                  <span key={index} className="card-back"><img src={Logo} alt='⧫'/></span>;
              })}
            </div>

            <div className="hands">
              {playerHand.map((card, index) => (
                <span key={index} data-suit={card.suit} data-value={card.value}></span>
              ))}
            </div>
            <p><strong>Player: </strong><em>{calculateScore(playerHand)}</em></p>
            <div className='blackjack-btns'>
              <button onClick={hit} disabled={gameOver || currentBet === 0}>Hit</button>
              <button onClick={stand} disabled={gameOver || currentBet === 0}>Stand</button>
            </div>
          </>
        )}

        {gameOver && (
          <>


            {credits > 0 ? (
              <>
                <input
                  className='bet-input'
                  value={betInput}
                  onChange={(e) => setBetInput(e.target.value)}
                  placeholder="Enter bet amount"
                />
                <button className='newGame-btn' onClick={startNewGame}>Buy In</button>
              </>
            ) : (
              <button className='newGame-btn' onClick={addCredits}>Get More Credits</button>
            )}
          </>
        )}
      </div>
      {status && <div className='blackjack-message'>{status}</div>}
    </div>
  );

};

export default Blackjack;
