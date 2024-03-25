import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Blackjack from './components/Blackjack';
import Slots from './components/Slots';
import './App.css';
import { CreditsProvider } from './components/CreditsContext';

const App = () => {
    return (
        <CreditsProvider> 
            <BrowserRouter>
                <div className="App">
                    <nav>
                        <Link to="/slots">Slots</Link>
                        <Link to="/blackjack">Blackjack</Link>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Slots />} />
                        <Route path="/slots" element={<Slots />} />
                        <Route path="/blackjack" element={<Blackjack />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </CreditsProvider>
    );
};

export default App;
