#!/bin/bash
cd "$(dirname "$0")"

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing Node dependencies..."
  npm install
fi

LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "localhost")

echo "=========================================================="
echo " Starting Panchayat Next.js Server on Local Network"
echo "=========================================================="
echo "📱 TEST ON YOUR PHONE!"
echo "Make sure your phone is connected to the same Wi-Fi network."
echo "Open this URL in your mobile browser:" 
echo "👉 http://${LOCAL_IP}:3000"
echo "=========================================================="
echo "Scan this QR code with your phone camera to open it instantly:"
npx -y qrcode "http://${LOCAL_IP}:3000"
echo "=========================================================="

# Give the server a few seconds to start up, then open browser automatically on your mac
(sleep 3 && open http://localhost:3000) &

npm run dev

