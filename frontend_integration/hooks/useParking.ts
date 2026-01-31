import { useEffect, useState } from 'react';
import { api, socket } from '@/lib/api';

export interface ParkingSpot {
    _id: string;
    name: string;
    location: {
        coordinates: [number, number];
        address: string;
    };
    status: 'available' | 'limited' | 'full';
    capacity: number;
    pricePerHour: number;
}

export const useParkingSpots = (lat: number, lng: number) => {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);

    useEffect(() => {
        // 1. Fetch Initial Data
        const fetchSpots = async () => {
            try {
                const { data } = await api.get(`/parking/nearby?lat=${lat}&lng=${lng}`);
                setSpots(data);
            } catch (error) {
                console.error("Failed to fetch spots", error);
            }
        };

        if (lat && lng) fetchSpots();

        // 2. Connect Socket & Listen
        socket.connect();

        socket.on('statusUpdate', ({ id, status }: { id: string, status: string }) => {
            setSpots((prev) =>
                prev.map((spot) =>
                    spot._id === id ? { ...spot, status: status as any } : spot
                )
            );
        });

        return () => {
            socket.off('statusUpdate');
            socket.disconnect();
        };
    }, [lat, lng]);

    return spots;
};
