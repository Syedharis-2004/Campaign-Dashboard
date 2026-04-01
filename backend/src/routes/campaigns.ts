import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';

const router = express.Router();

// Apply protect middleware to all campaign routes
router.use(protect);

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .put(updateCampaign)
  .delete(deleteCampaign);

export default router;
