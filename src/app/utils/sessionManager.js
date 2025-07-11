export function setFlowData(flowKey, data, minutes = 15) {
  const expiresAt = Date.now() + minutes * 60 * 1000;
  const payload = {
    ...data,
    expiresAt
  };
  sessionStorage.setItem(flowKey, JSON.stringify(payload));
}

export function getFlowData(flowKey) {
  const item = sessionStorage.getItem(flowKey);
  if (!item) return null;
  console.log("getFlowData", item);
  try {
    const parsed = JSON.parse(item);
    const now = Math.floor(Date.now() / 1000);
    if (now > parsed.expiresAt) {
      sessionStorage.removeItem(flowKey); // Limpia si expiró
      console.log("Flow data expired");
      return null;
    }
    console.log("Flow data retrieved", parsed);
    return parsed;
  } catch (e) {
    console.log("catch getFlowData")
    sessionStorage.removeItem(flowKey);
    console.log(e)
    return null;
  }
}

export function updatedFlowData(flowKey, newData, minutes = 15) {
  const data = JSON.parse(sessionStorage.getItem(flowKey));
  const updatedData = {
    ...data,
    ...newData
  };
  setFlowData(flowKey, updatedData, minutes);
}

export function clearFlowData(flowKey) {
  sessionStorage.removeItem(flowKey);
}
