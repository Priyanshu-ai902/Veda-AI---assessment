import { Router } from 'express';
import { upload } from '../middlewares/upload';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
  getOutputByAssignmentId,
  downloadPDF
} from '../controllers/assignmentController';

const router = Router();

router.post('/', upload.single('file'), createAssignment as any);
router.get('/', getAssignments as any);
router.get('/:id', getAssignmentById as any);
router.delete('/:id', deleteAssignment as any);
router.get('/:id/output', getOutputByAssignmentId as any);
router.get('/pdf/:id', downloadPDF as any);

export default router;
