// Custom fetch wrapper that logs requests into a global state for the Chrome DevTools Network Monitor simulator.
export async function loggedFetch(url, options = {}) {
  const startTime = Date.now();
  const method = options.method || 'GET';
  
  try {
    const response = await window.fetch(url, options);
    const latency = Date.now() - startTime;
    
    // Clone response to compute its size in bytes
    let resSizeStr = '0 B';
    try {
      const clone = response.clone();
      const text = await clone.text();
      const bytes = text.length;
      if (bytes >= 1024) {
        resSizeStr = `${(bytes / 1024).toFixed(2)} KB`;
      } else {
        resSizeStr = `${bytes} B`;
      }
    } catch (e) {
      resSizeStr = '120 B'; // Fallback approximation
    }
    
    // Parse URL into a concise name
    let name = url;
    try {
      const parsedUrl = new URL(url, window.location.origin);
      name = parsedUrl.pathname + parsedUrl.search;
    } catch (e) {}

    // Add to global network logs
    if (!window.__networkLogs) window.__networkLogs = [];
    
    window.__networkLogs = [
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        name: name,
        url: url,
        method: method,
        status: response.status,
        statusText: response.status === 200 ? '200 OK' : response.status === 201 ? '201 Created' : `${response.status} Error`,
        size: resSizeStr,
        latency: `${latency}ms`,
        isError: !response.ok
      },
      ...window.__networkLogs
    ];
    
    window.dispatchEvent(new Event('network-log'));
    return response;
  } catch (err) {
    const latency = Date.now() - startTime;
    
    // Add failed request to global logs
    if (!window.__networkLogs) window.__networkLogs = [];
    
    window.__networkLogs = [
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        name: url,
        url: url,
        method: method,
        status: 500,
        statusText: 'Failed',
        size: '0 B',
        latency: `${latency}ms`,
        isError: true
      },
      ...window.__networkLogs
    ];
    
    window.dispatchEvent(new Event('network-log'));
    throw err;
  }
}
