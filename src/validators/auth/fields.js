import { z } from 'zod';

const emailField = z.string().email();
const passwordField = z.string().min(8, '');



export { passwordField, emailField };