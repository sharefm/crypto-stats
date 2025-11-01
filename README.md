# Crypto Stats Dashboard

Real-time cryptocurrency statistics dashboard using Binance WebSocket streams. No backend required - runs entirely in the browser!

## Features

- **Real-time price updates** via Binance WebSocket
- **Multiple crypto pairs**: BTC/USDT, SOL/USDT, DASH/USDT, PIVX/USDT, AVAX/USDT
- **Automatic recalculation** every 5 seconds

### Calculated Metrics

1. **Price Change %**: 5-minute price change percentage
2. **Volatility**: Standard deviation of returns over 5 minutes
3. **Bid/Ask Prices**: Real-time best bid and ask prices
4. **Bid/Ask Spread**: Percentage spread between bid and ask
5. **100 USDT Equivalent**: How much crypto you can buy with 100 USDT
6. **24h Volume**: Trading volume in USDT over 24 hours

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## How It Works

1. **WebSocket Connection**: Connects to Binance's public WebSocket API with multiple streams:
   - `@trade`: Real-time trade prices
   - `@bookTicker`: Best bid/ask prices
   - `@ticker`: 24-hour statistics including volume

2. **Data Collection**: Stores the last 5 minutes of price data for each pair in memory

3. **Calculations**: Every 5 seconds, calculates all metrics based on collected data

4. **Display**: Updates the UI with live data and calculations

## Project Structure

```
crypto-stats/
├── src/
│   ├── components/
│   │   └── CryptoCard.jsx       # Individual crypto pair card component
│   ├── hooks/
│   │   └── useBinanceWebSocket.js  # WebSocket connection hook
│   ├── utils/
│   │   └── calculations.js      # All calculation functions
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Binance WebSocket API**: Real-time crypto data
- **Native WebSocket API**: Browser-based WebSocket support

## Customization

### Adding More Pairs

Edit the `PAIRS` array in `src/hooks/useBinanceWebSocket.js`:

```javascript
const PAIRS = ['BTCUSDT', 'SOLUSDT', 'ETHUSDT', 'ADAUSDT'];
```

### Changing Calculation Interval

Modify the interval in `src/App.jsx`:

```javascript
const interval = setInterval(calculateMetrics, 5000); // 5000ms = 5 seconds
```

### Adding New Calculations

1. Add calculation function in `src/utils/calculations.js`
2. Use it in `src/App.jsx` inside the `calculateMetrics` function
3. Display it in `src/components/CryptoCard.jsx`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory. You can serve it with any static file server.

## License

MIT
