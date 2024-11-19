import { Project } from '../models/Project.js';

export class ProjectService {
  static async getAllProjects(query = {}) {
    return Project.find(query)
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
  }

  static async createProject(projectData, creatorId) {
    const project = new Project({
      ...projectData,
      creator: creatorId
    });
    return project.save();
  }

  static async getProjectById(id) {
    const project = await Project.findById(id)
      .populate('creator', 'username');
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  static async updateProject(id, updates, userId) {
    const project = await Project.findOne({ _id: id, creator: userId });
    if (!project) {
      throw new Error('Project not found or unauthorized');
    }
    Object.assign(project, updates);
    return project.save();
  }
}