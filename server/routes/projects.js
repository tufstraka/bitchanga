import express from 'express';
import { ProjectService } from '../services/projectService.js';
import { auth } from '../middleware/auth.js';
import { projectValidationRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.post('/', [auth, ...projectValidationRules, validate], async (req, res, next) => {
  try {
    const project = await ProjectService.createProject(req.body, req.user._id);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

export { router as projectRoutes };