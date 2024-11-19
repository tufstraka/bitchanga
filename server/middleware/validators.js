import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const projectValidationRules = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('targetAmount').isNumeric().withMessage('Target amount must be a number'),
  body('walletAddress').trim().notEmpty().withMessage('Wallet address is required'),
  body('deadline').isISO8601().withMessage('Invalid deadline date'),
  body('category').trim().notEmpty().withMessage('Category is required')
];

export const userValidationRules = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['builder', 'investor']).withMessage('Invalid role')
];

export const investmentValidationRules = [
  body('projectId').isMongoId().withMessage('Invalid project ID'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('transactionHash').trim().notEmpty().withMessage('Transaction hash is required')
];