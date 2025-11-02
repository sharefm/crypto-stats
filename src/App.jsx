import { useState, useEffect } from 'react';
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket';
import CryptoCard from './components/CryptoCard';
import {
  calculatePriceChange,
  calculateVolatility,
  calculateSpread,
  calculateCryptoFor100USDT,
  calculateVolumeMetrics
} from './utils/calculations';

function App() {
  const { data, connected, error, getPriceHistory, pairs } = useBinanceWebSocket();
  const [calculations, setCalculations] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  // Recalculate all metrics every 2 seconds
  useEffect(() => {
    const calculateMetrics = () => {
      const newCalculations = {};

      pairs.forEach(pair => {
        const pairData = data[pair];
        if (!pairData || !pairData.price) return;

        const priceHistory = getPriceHistory(pair);
        const { price, bidPrice, askPrice, volume } = pairData;

        // Perform all calculations
        newCalculations[pair] = {
          priceChange: calculatePriceChange(priceHistory),
          volatility: calculateVolatility(priceHistory),
          spread: calculateSpread(bidPrice, askPrice),
          cryptoFor100USDT: calculateCryptoFor100USDT(price),
          volumeUSDT: calculateVolumeMetrics(volume, price).volumeUSDT
        };
      });

      if (Object.keys(newCalculations).length > 0) {
        setCalculations(newCalculations);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    // Set up interval for recalculation every 2 seconds
    const interval = setInterval(calculateMetrics, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount, calculations happen via interval

  return (
    <div className="app">
      <div className="header">
        <h1>Crypto Stats Dashboard</h1>
        <p>Real-time data from Binance WebSocket</p>
        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </p>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      <div className="stats-grid">
        {pairs.map(pair => (
          <CryptoCard
            key={pair}
            pairData={data[pair]}
            calculations={calculations[pair] || {}}
          />
        ))}
      </div>

      {lastUpdate && (
        <div className="last-update">
          Last calculation update: {lastUpdate}
        </div>
      )}
    </div>
  );
}

export default App;
