import Budget from './budget.model.js';

export const createBudget = async (req, res) => {
    try{
        const {wedding, spending, totalBudget, category, description, status} = req.body;
        const budget = new Budget({wedding, spending, totalBudget, category, description, status});
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBudgets = async (req, res) => {
    try{
        const { wedding } = req.query;
        const filter = wedding ? { wedding } : {};
        const budgets = await Budget.find(filter);
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBudgetById = async (req, res) => {
    try{
        const {id} = req.params;
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({message: 'Budget not found'});
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const updateBudget = async (req, res) => {
    try{
        const {id} = req.params;
        const {wedding, spending, totalBudget, category, description, status} = req.body;
        const budget = await Budget.findByIdAndUpdate(id, {wedding, spending, totalBudget, category, description, status}, {new: true});
        if (!budget) {
            return res.status(404).json({message: 'Budget not found'});
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteBudget = async (req, res) => {
    try{
        const {id} = req.params;
        const budget = await Budget.findByIdAndDelete(id);
        if (!budget) {
            return res.status(404).json({message: 'Budget not found'});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};