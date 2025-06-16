import Guest from './guest.model.js';

export const createGuest = async (req, res) => {
    try{
        const {wedding, name, RSVP, plusOne, status} = req.body;
        const guest = new Guest({wedding, name, RSVP, plusOne, status});
        await guest.save();
        res.status(201).json(guest);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getGuests = async (req, res) => {
    try{
        const { wedding } = req.query;
        const filter = wedding ? { wedding } : {};
        const guests = await Guest.find(filter);
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getGuestById = async (req, res) => {
    try{
        const {id} = req.params;
        const guest = await Guest.findById(id);
        if (!guest) {
            return res.status(404).json({message: 'Guest not found'});
        }
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const updateGuest = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, RSVP, plusOne, status} = req.body;
        const guest = await Guest.findByIdAndUpdate(id, {name, RSVP, plusOne, status}, {new: true});
        if (!guest) {
            return res.status(404).json({message: 'Guest not found'});
        }
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteGuest = async (req, res) => {
    try{
        const {id} = req.params;
        const guest = await Guest.findByIdAndDelete(id);
        if (!guest) {
            return res.status(404).json({message: 'Guest not found'});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};