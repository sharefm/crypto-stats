/**
 * Calculate price change percentage over a time period
 */
export function calculatePriceChange(priceHistory) {
  if (priceHistory.length < 2) return 0;

  const latestPrice = priceHistory[priceHistory.length - 1].price;
  const oldestPrice = priceHistory[0].price;

  return ((latestPrice - oldestPrice) / oldestPrice) * 100;
}

/**
 * Calculate price volatility (standard deviation of returns)
 */
export function calculateVolatility(priceHistory) {
  if (priceHistory.length < 2) return 0;

  // Calculate returns
  const returns = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const returnValue = (priceHistory[i].price - priceHistory[i - 1].price) / priceHistory[i - 1].price;
    returns.push(returnValue);
  }

  // Calculate mean
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Calculate variance
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

  // Standard deviation (volatility) as percentage
  return Math.sqrt(variance) * 100;
}

/**
 * Calculate bid-ask spread
 */
export function calculateSpread(bidPrice, askPrice) {
  if (!bidPrice || !askPrice) return 0;
  return ((askPrice - bidPrice) / askPrice) * 100;
}

/**
 * Calculate how much crypto equals 100 USDT
 */
export function calculateCryptoFor100USDT(currentPrice) {
  if (!currentPrice || currentPrice === 0) return 0;
  return 100 / currentPrice;
}

/**
 * Calculate volume metrics (24h volume in USDT)
 */
export function calculateVolumeMetrics(volume, currentPrice) {
  return {
    volume24h: volume,
    volumeUSDT: volume * currentPrice
  };
}

/**
 * Format number with appropriate decimal places
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '0.00';
  return Number(num).toFixed(decimals);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const numValue = Number(num);
  if (numValue >= 1e9) return (numValue / 1e9).toFixed(2) + 'B';
  if (numValue >= 1e6) return (numValue / 1e6).toFixed(2) + 'M';
  if (numValue >= 1e3) return (numValue / 1e3).toFixed(2) + 'K';
  return numValue.toFixed(2);
}
