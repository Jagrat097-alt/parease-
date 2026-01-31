const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ParkingSpot = require('../models/ParkingSpot');

// @route   POST api/parking
// @desc    Add a new parking spot
// @access  Private (Owner only)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is an owner (Simple RBAC)
        if (req.user.role !== 'owner' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Owners only' });
        }

        const { name, description, latitude, longitude, address, capacity, pricePerHour } = req.body;

        const newSpot = new ParkingSpot({
            owner: req.user.id,
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)], // GeoJSON expects [lng, lat]
                address
            },
            capacity,
            pricePerHour
        });

        const spot = await newSpot.save();
        res.json(spot);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/parking/mine
// @desc    Get all parking spots for the logged-in owner
// @access  Private
router.get('/mine', auth, async (req, res) => {
    try {
        const spots = await ParkingSpot.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(spots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/parking/:id
// @desc    Update parking spot
// @access  Private (Owner)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description, capacity, pricePerHour, status } = req.body;

        let spot = await ParkingSpot.findById(req.params.id);

        if (!spot) return res.status(404).json({ message: 'Parking spot not found' });

        // Make sure user owns the spot
        if (spot.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Build update object
        const spotFields = {};
        if (name) spotFields.name = name;
        if (description) spotFields.description = description;
        if (capacity) spotFields.capacity = capacity;
        if (pricePerHour) spotFields.pricePerHour = pricePerHour;
        if (status) spotFields.status = status;

        spot = await ParkingSpot.findByIdAndUpdate(
            req.params.id,
            { $set: spotFields },
            { new: true }
        );

        // If status changed, emit realtime update
        if (status) {
            req.io.emit('statusUpdate', { id: spot._id, status: spot.status });
        }

        res.json(spot);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/parking/:id/availability
// @desc    Update only the status (availability)
// @access  Private (Owner)
router.patch('/:id/availability', auth, async (req, res) => {
    try {
        const { status } = req.body;

        let spot = await ParkingSpot.findById(req.params.id);

        if (!spot) return res.status(404).json({ message: 'Parking spot not found' });

        // Make sure user owns the spot
        if (spot.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        spot.status = status;
        await spot.save();

        // Emit real-time update
        req.io.emit('statusUpdate', { id: spot._id, status: spot.status });

        res.json(spot);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/parking/nearby
// @desc    Get parking spots near a location
// @access  Public
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query; // radius in meters

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Please provide lat and lng' });
        }

        const maxDistance = radius ? parseInt(radius) : 5000; // Default 5km

        const spots = await ParkingSpot.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: maxDistance
                }
            }
        });

        res.json(spots);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
