import Budget from './budget.model.js';

export const createBudget = async (req, res) => {
    try{
        const {wedding, spending, totalBudget} = req.body;
        const budget = new Budget({wedding, spending, totalBudget});
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBudget = async (req, res) => {
    try{
        const {id} = req.params;
        const budget = await Budget.findById(id);
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
