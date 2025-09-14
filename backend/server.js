import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import authRoutes from './routes/auth.js';
import txnRoutes from './routes/transactions.js';


const app = express();
app.use(cors({
    origin:"*",
   credentials:true
}));
app.use(express.json());


const PORT = process.env.PORT || 4000;


// routes
app.use('/auth', authRoutes);
app.use('/transactions', txnRoutes);


// error handler
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


// connect
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
console.error('MongoDB connection error', err);
process.exit(1);
});