// index.mjs
import express from "express";
import cors from 'cors'
import authenticationRoutes from '../app/routes/authentication/authenticationRoutes.mjs'

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin:  '*',
  methods: ['PUT', 'GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
};
//added cors for security and connectivity to frontend
app.use(cors(corsOptions));

app.use('/api/auth', authenticationRoutes);


export default app
