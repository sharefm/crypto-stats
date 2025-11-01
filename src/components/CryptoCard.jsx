import { formatNumber, formatLargeNumber } from '../utils/calculations';

export default function CryptoCard({ pairData, calculations }) {
  if (!pairData) {
    return (
      <div className="crypto-card">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const { symbol, price, bidPrice, askPrice } = pairData;
  const {
    priceChange,
    volatility,
    spread,
    cryptoFor100USDT,
    volumeUSDT
  } = calculations;

  return (
    <div className="crypto-card">
      <div className="card-header">
        <h2 className="pair-name">{symbol.replace('USDT', '/USDT')}</h2>
        <div className="status-indicator" title="Live connection"></div>
      </div>

      <div className="current-price">
        ${formatNumber(price, 4)}
      </div>

      <div className="stats-section">
        <div className="stat-row">
          <span className="stat-label">Price Change (5min)</span>
          <span className={`stat-value ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange, 2)}%
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Volatility (5min)</span>
          <span className="stat-value">
            {formatNumber(volatility, 4)}%
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Bid Price</span>
          <span className="stat-value">
            ${formatNumber(bidPrice, 4)}
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Ask Price</span>
          <span className="stat-value">
            ${formatNumber(askPrice, 4)}
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Bid/Ask Spread</span>
          <span className="stat-value">
            {formatNumber(spread, 4)}%
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">100 USDT equals</span>
          <span className="stat-value">
            {formatNumber(cryptoFor100USDT, 6)} {symbol.replace('USDT', '')}
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">24h Volume</span>
          <span className="stat-value">
            ${formatLargeNumber(volumeUSDT)}
          </span>
        </div>
      </div>
    </div>
  );
}
