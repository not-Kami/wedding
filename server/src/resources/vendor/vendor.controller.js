import e from 'express';
import Vendor from './vendor.model.js';

export const createVendor = async (req, res) => {
    try{
        const {name, type, contact, wedding} = req.body;
        const vendor = new Vendor({name, type, contact, wedding});
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const getVendors = async (req, res) => {
    try{
        const { wedding } = req.query;
        const filter = wedding ? { wedding } : {};
        const vendors = await Vendor.find(filter);
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getVendorById = async (req, res) => {
    try{
        const {id} = req.params;
        const vendor = await Vendor.findById(id);
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateVendor = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, type, contact, wedding} = req.body;
        const vendor = await Vendor.findByIdAndUpdate(id, {name, type, contact, wedding}, {new: true});
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
export const deleteVendor = async (req, res) => {
    try{
        const {id} = req.params;
        await Vendor.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};