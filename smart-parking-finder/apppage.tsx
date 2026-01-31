'use client';
import { useParkingSpots } from '@/hooks/useParking';

export default function Home() {
  // Coordinates for the test spot creating by verify_system.js
  const spots = useParkingSpots(40.7128, -74.0060); 

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🚗 Smart Parking Finder</h1>
      
      {spots.length === 0 ? (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
           Loading nearby spots... (Make sure backend is running on port 5000)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map(spot => (
            <div key={spot._id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{spot.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${
                  spot.status === 'available' ? 'bg-green-500' :
                  spot.status === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {spot.status}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center text-sm">
                  📍 {spot.location.address}
                </p>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <span className="font-medium text-gray-900">${spot.pricePerHour}/hr</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Capacity: {spot.capacity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}