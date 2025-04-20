const serverStartTime = Date.now();

export function getUptimeInfo() {
  const now = Date.now();
  return {
    uptime: (now - serverStartTime) / 1000,
    timestamp: new Date(now).toISOString(),
  };
}
