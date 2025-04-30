import Wedding from './wedding.model';

export const createWedding = async (req, res) => {
    try{
        const {name, date, place} = req.body;
        const wedding = new Wedding({name, date, place});
        await wedding.save();
        res.status(201).json(wedding);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getWedding = async (req, res) => {
    try{
        const {id} = req.params;
        const wedding = await Wedding.findById(id);
        res.status(200).json(wedding);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


