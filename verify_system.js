const axios = require('axios');
const io = require('socket.io-client');

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Test Data
const user = {
    name: "Test Owner",
    email: "owner" + Date.now() + "@test.com",
    password: "password123"
};

const parkingSpot = {
    name: "Downtown Parking",
    description: "Secure parking in city center",
    latitude: 40.7128,
    longitude: -74.0060, // New York
    address: "123 Broadway, NY",
    capacity: 50,
    pricePerHour: 10
};

let token = null;
let parkingSpotId = null;

async function runVerification() {
    console.log('--- Starting System Verification ---');

    try {
        // 1. Register User
        console.log('\n[1] Registering User...');
        const regRes = await axios.post(`${API_URL}/auth/register`, user);
        token = regRes.data.token;
        console.log('✅ User Registered. Token received.');

        // 2. Add Parking Spot
        console.log('\n[2] Adding Parking Spot...');
        const spotRes = await axios.post(`${API_URL}/parking`, parkingSpot, {
            headers: { 'x-auth-token': token }
        });
        parkingSpotId = spotRes.data._id;
        console.log(`✅ Parking Spot Created: ${parkingSpotId}`);

        // 3. Get Nearby Spots
        console.log('\n[3] Searching Nearby Spots...');
        const searchRes = await axios.get(`${API_URL}/parking/nearby?lat=40.7128&lng=-74.0060&radius=1000`);
        if (searchRes.data.length > 0) {
            console.log(`✅ Found ${searchRes.data.length} nearby spots.`);
        } else {
            console.error('❌ No spots found nearby (Unexpected).');
        }

        // 4. Test Real-time Updates
        console.log('\n[4] Testing Real-time Socket Updates...');
        const socket = io(SOCKET_URL);

        socket.on('connect', async () => {
            console.log('✅ Socket Connected');

            // Listen for status update
            socket.on('statusUpdate', (data) => {
                if (data.id === parkingSpotId && data.status === 'full') {
                    console.log('✅ Received Real-time Update:', data);
                    console.log('\n🎉 Verification Complete! System is fully functional.');
                    socket.disconnect();
                    process.exit(0);
                }
            });

            // Trigger update via API
            console.log('   - Triggering status update to "full"...');
            await axios.patch(`${API_URL}/parking/${parkingSpotId}/availability`, {
                status: 'full'
            }, {
                headers: { 'x-auth-token': token }
            });

        });

    } catch (error) {
        console.error('❌ Verification Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

// Run if specific dependencies are installed
try {
    require.resolve('axios');
    require.resolve('socket.io-client');
    runVerification();
} catch (e) {
    console.log('Please install "axios" and "socket.io-client" to run this script.');
    console.log('npm install axios socket.io-client');
}
