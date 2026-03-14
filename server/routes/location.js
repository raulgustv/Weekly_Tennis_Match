import {Router} from 'express';
import { favoriteLocation, getAllLocations, getLocation, newLocation, toggleActivation, updateCourtSuface } from '../controller/location.js';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { newLocationValidator, updateSurfaceValidator } from '../validator/locationValidator.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = Router();

router.post('/new', protect,verifyAdmin, newLocationValidator, validateFields, newLocation)
router.post('/favorite/:slug', protect, verifyAdmin, favoriteLocation)
router.post('/status/:slug', protect, verifyAdmin, toggleActivation)
router.get('/view-all', protect,verifyAdmin, getAllLocations)
router.get('/view/:slug', protect,verifyAdmin, getLocation)
router.put('/:slug', protect,verifyAdmin, updateSurfaceValidator, validateFields, updateCourtSuface)

export default router