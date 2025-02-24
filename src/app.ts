import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { routes } from './app/routes/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
const app = express();

const allowedOrigins: string[] = [
  'http://localhost:5173',
  // 'https://invmanage-opal.vercel.app',
  'https://invmanage-eight.vercel.app',
];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/api/v1', routes);

app.use(globalErrorHandler);
app.use(notFound);

export { app };
