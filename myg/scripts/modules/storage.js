export function saveSetting(key, value) {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(`myg:${key}`, v);
    return true;
  } catch (err) {
    console.warn('Could not save setting', err);
    return false;
  }
}

export function getSetting(key) {
  try {
    const raw = localStorage.getItem(`myg:${key}`);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return raw; }
  } catch (err) {
    console.warn('Could not read setting', err);
    return null;
  }
}

export function removeSetting(key) {
  try {
    localStorage.removeItem(`myg:${key}`);
    return true;
  } catch { return false; }
}