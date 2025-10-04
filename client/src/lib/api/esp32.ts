export const connectToWiFi = async (ssid: string, password: string, userId: string) => {
  const response = await fetch('192.168.72.1/configure', {
    method: 'POST',

    body: JSON.stringify({
      ssid,
      password,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to connect to WiFi');
  }

  return response.json();
};
