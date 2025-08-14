// index.mjs
import express from "express";
import cors from 'cors'
import authenticationRoutes from '../app/routes/authentication/authenticationRoutes.mjs'
import { authenticateJWT } from '../app/middlewares/authenticateJWT.mjs';
import UserRoutes from '../app/routes/user/userRoutes.mjs'


const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const corsOptions = {
  origin:  '*',
  methods: ['PUT', 'GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
};
//added cors for security and connectivity to frontend
app.use(cors(corsOptions));

app.use('/api/auth', authenticationRoutes);
app.use('/api/user',UserRoutes)

export default app
