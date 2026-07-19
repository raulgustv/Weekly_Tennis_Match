import {Router} from 'express';
import { favoriteLocation, getAllLocations, getLocation, newLocation, toggleActivation, toggleFavoriteCourt, updateCourtSuface } from '../controller/location.js';
import { protect, verifyAdmin, verifyBookerOrAdmin } from '../middlewares/auth.js';
import { newLocationValidator, updateSurfaceValidator } from '../validator/locationValidator.js';
import { validateFields } from '../middlewares/validateFields.js';
import { urlShortener } from '../controller/shortener.js';

const router = Router();

router.post('/new', protect,verifyAdmin, newLocationValidator, validateFields, newLocation)
router.post('/favorite/:slug', protect, verifyAdmin, favoriteLocation)
router.post('/status/:slug', protect, verifyAdmin, toggleActivation)
router.get('/view-all', protect,verifyBookerOrAdmin, getAllLocations)
router.get('/view/:slug', protect,verifyBookerOrAdmin, getLocation)
router.put('/:slug', protect,verifyAdmin, updateSurfaceValidator, validateFields, updateCourtSuface)
router.patch('/:slug/courts/:courtNumber/favorite', protect, verifyAdmin, toggleFavoriteCourt)


router.post('/shorten', urlShortener)

export default router