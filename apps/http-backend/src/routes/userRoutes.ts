/*External Dependencies*/
import express from 'express';

/*Internal Dependencies*/
import * as UserController from '../controllers/userController';
import { authentication as authMiddleware } from '../middlewares'
const router: any = express.Router();

router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);

router.use(authMiddleware);

router.get('/auth-test' , (req : any , res : any) => res.json({ message: 'Authenticated successfully' }));

export default router;