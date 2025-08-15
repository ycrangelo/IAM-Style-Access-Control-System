// index.mjs
import express from "express";
import cors from 'cors'
import authenticationRoutes from '../app/routes/authentication/authenticationRoutes.mjs'
import { authenticateJWT } from '../app/middlewares/authenticateJWT.mjs';
import UserRoutes from '../app/routes/user/userRoutes.mjs'
import groupRoutes from '../app/routes/group/groupRoutes.mjs'
import roleRoutes from './routes/role/roleRoutes.mjs'
import moduleRoutes from './routes/module/moduleRoutes.mjs'
import permissionRoutes from './routes/permission/permissionRoutes.mjs'
import accessControlRoutes from './routes/accessControl/accessControlRoutes.mjs'


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
app.use('/api/user', UserRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/module', moduleRoutes)
app.use('/api/permission', permissionRoutes)
app.use('/api/accessControl',accessControlRoutes)

export default app
