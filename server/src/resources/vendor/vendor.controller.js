import Vendor from './vendor.model.js';

export const createVendor = async (req, res) => {
    try{
        const {name, type, contact} = req.body;
        const vendor = new Vendor({name, type, contact});
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getVendor = async (req, res) => {
    try{
        const {id} = req.params;
        const vendor = await Vendor.findById(id);
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


