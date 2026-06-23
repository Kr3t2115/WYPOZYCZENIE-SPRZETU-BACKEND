import express from 'express';

import {login} from '../../controllers/auth/login.js';
import {isLogged} from '../../controllers/auth/isLogged.js';

import {validate} from "../../middleware/validate.js";

import {loginSchema} from "../../validators/auth/loginSchema.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post('/login', validate(loginSchema), login)

// PROTECTED ROUTES

authRoutes.use(authMiddleware)
authRoutes.get('/is-logged', isLogged)

export {authRoutes}