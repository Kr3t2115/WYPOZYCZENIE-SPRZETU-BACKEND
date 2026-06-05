import express from 'express';

import {login} from '../../controllers/auth/login.js';
import {register} from '../../controllers/auth/register.js';
import {nicknameAvailability} from '../../controllers/auth/nicknameAvailability.js';

import {isLogged} from '../../controllers/auth/isLogged.js';

import {validate} from "../../middleware/validate.js";

import {loginSchema} from "../../validators/auth/loginSchema.js";
import {registerSchema} from "../../validators/auth/registerSchema.js";
import {nicknameCheckSchema} from "../../validators/auth/nicknameCheckSchema.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post('/login', validate(loginSchema), login)
authRoutes.post('/register', validate(registerSchema), register)
authRoutes.get('/nickname-availability', validate(nicknameCheckSchema), nicknameAvailability)


// PROTECTED ROUTES

authRoutes.use(authMiddleware)
authRoutes.get('/is-logged', isLogged)


export {authRoutes}