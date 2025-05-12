import Wedding from './wedding.model.js';

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

export const getWeddings = async (req, res) => {
    try{
        const weddings = await Wedding.find();
        res.status(200).json(weddings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getWeddingById = async (req, res) => {
    try{
        const {id} = req.params;
        const wedding = await Wedding.findById(id);
        res.status(200).json(wedding);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
export const updateWedding = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, date, place} = req.body;
        const wedding = await Wedding.findByIdAndUpdate(id, {name, date, place}, {new: true});
        res.status(200).json(wedding);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
export const deleteWedding = async (req, res) => {
    try{
        const {id} = req.params;
        await Wedding.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
