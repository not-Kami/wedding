import Guest from './guest.model';

export const createGuest = async (req, res) => {
    try{
        const {wedding, name, rsvp, plusOne} = req.body;
        const guest = new Guest({wedding, name, rsvp, plusOne});
        await guest.save();
        res.status(201).json(guest);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getGuest = async (req, res) => {
    try{
        const {id} = req.params;
        const guest = await Guest.findById(id);
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


