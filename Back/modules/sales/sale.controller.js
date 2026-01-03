const Joi = require('joi');
const Sale = require('./sale.model');

// ✅ Validation schema
const saleSchema = Joi.object({
  saleName: Joi.string().required(),
  status: Joi.string().valid('Open', 'Lost', 'Sold', 'Stalled').required(),
  amount: Joi.number().required(),
  stage: Joi.object({
    label: Joi.string().required(),
    percentage: Joi.number().min(0).max(100).optional()
  }).required(),
  nextActivityDate: Joi.date().optional(),
  saleDate: Joi.date().optional(),
  owner: Joi.string().optional(),
  contact: Joi.string().optional(),
  saleType: Joi.string().optional(),
  company: Joi.string().optional(),
  currency: Joi.string().optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  stakeholders: Joi.array().items(Joi.string()).optional()
});

const updateSchema = Joi.object({
  saleName: Joi.string().optional(),
  status: Joi.string().valid('Open', 'Lost', 'Sold', 'Stalled').optional(),
  amount: Joi.number().optional(),
  stage: Joi.object({
    label: Joi.string().optional(),
    percentage: Joi.number().min(0).max(100).optional()
  }).optional(),
  nextActivityDate: Joi.date().optional(),
  saleDate: Joi.date().optional(),
  owner: Joi.string().optional(),
  contact: Joi.string().optional(),
  saleType: Joi.string().optional(),
  company: Joi.string().optional(),
  currency: Joi.string().optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  stakeholders: Joi.array().items(Joi.string()).optional()
});



// ✅ Create new sale
exports.create = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ List sales with pagination
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const sales = await Sale.find().sort('-createdAt').skip(skip).limit(limit);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single sale
exports.getOne = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update sale
exports.update = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete sale
exports.remove = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Export schemas for validation middleware
exports.schemas = { saleSchema, updateSchema };