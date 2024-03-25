import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Reel = ({ symbol, startSpinning, stopAfter }) => {
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        if (startSpinning) {
            setSpinning(true);
            setTimeout(() => {
                setSpinning(false);
            }, stopAfter);
        }
    }, [startSpinning, stopAfter]);

    return <div className={spinning ? 'reel spinning' : 'reel'}>{symbol}</div>;
};

Reel.propTypes = {
    symbol: PropTypes.string.isRequired,
    startSpinning: PropTypes.bool.isRequired,
    stopAfter: PropTypes.number.isRequired,
};

export default Reel;
