import { useEffect, useState, useRef } from 'react';

const PAIRS = ['BTCUSDT', 'SOLUSDT', 'DASHUSDT', 'PIVXUSDT', 'AVAXUSDT'];

export function useBinanceWebSocket() {
  const [data, setData] = useState({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const wsRefsRef = useRef({});
  const priceHistoryRef = useRef({});
  const connectionCountRef = useRef(0);

  useEffect(() => {
    // Initialize price history for each pair
    PAIRS.forEach(pair => {
      if (!priceHistoryRef.current[pair]) {
        priceHistoryRef.current[pair] = [];
      }
    });

    connectionCountRef.current = 0;

    // Create individual WebSocket connection for each pair
    PAIRS.forEach(pair => {
      const lowerPair = pair.toLowerCase();

      // Use Binance WebSocket endpoint without port
      const wsUrl = `wss://stream.binance.com/ws/${lowerPair}@ticker`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRefsRef.current[pair] = ws;

        ws.onopen = () => {
          console.log(`WebSocket connected for ${pair}`);
          connectionCountRef.current += 1;

          // If all connections are established
          if (connectionCountRef.current === PAIRS.length) {
            setConnected(true);
            setError(null);
          }
        };

        ws.onmessage = (event) => {
          try {
            const tickerData = JSON.parse(event.data);

            // The ticker stream provides comprehensive data
            const currentPrice = parseFloat(tickerData.c); // Current price
            const bidPrice = parseFloat(tickerData.b);     // Best bid
            const askPrice = parseFloat(tickerData.a);     // Best ask
            const volume = parseFloat(tickerData.v);       // Volume

            setData(prevData => {
              const currentPairData = prevData[pair] || {
                symbol: pair,
                price: 0,
                bidPrice: 0,
                askPrice: 0,
                volume: 0,
                priceChangePercent: 0,
                lastUpdate: Date.now()
              };

              let updatedPairData = {
                ...currentPairData,
                price: currentPrice,
                bidPrice: bidPrice,
                askPrice: askPrice,
                volume: volume,
                priceChangePercent: parseFloat(tickerData.P),
                high24h: parseFloat(tickerData.h),
                low24h: parseFloat(tickerData.l),
                lastUpdate: Date.now()
              };

              // Store price history
              if (!priceHistoryRef.current[pair]) {
                priceHistoryRef.current[pair] = [];
              }
              priceHistoryRef.current[pair].push({
                price: currentPrice,
                timestamp: Date.now()
              });

              // Keep only recent history (last 5 minutes of data)
              const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
              priceHistoryRef.current[pair] = priceHistoryRef.current[pair]
                .filter(item => item.timestamp > fiveMinutesAgo);

              return {
                ...prevData,
                [pair]: updatedPairData
              };
            });

          } catch (err) {
            console.error(`Error parsing WebSocket message for ${pair}:`, err);
          }
        };

        ws.onerror = (err) => {
          console.error(`WebSocket error for ${pair}:`, err);
          setError(`Connection error for ${pair}`);
          setConnected(false);
        };

        ws.onclose = (event) => {
          console.log(`WebSocket disconnected for ${pair}`, event.code, event.reason);
          connectionCountRef.current = Math.max(0, connectionCountRef.current - 1);
          if (connectionCountRef.current === 0) {
            setConnected(false);
          }
        };

      } catch (err) {
        console.error(`Failed to create WebSocket for ${pair}:`, err);
        setError(`Failed to connect to Binance for ${pair}`);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(wsRefsRef.current).forEach(ws => {
        if (ws) {
          ws.close();
        }
      });
      wsRefsRef.current = {};
    };
  }, []);

  // Function to get price history for calculations
  const getPriceHistory = (pair) => {
    return priceHistoryRef.current[pair] || [];
  };

  return {
    data,
    connected,
    error,
    getPriceHistory,
    pairs: PAIRS
  };
}
