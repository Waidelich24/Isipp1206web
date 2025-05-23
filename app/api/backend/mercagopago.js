// backend/api/mercadopago.js

import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/generate-mp-qr', async (req, res) => {
  const { amount, description } = req.body;

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN; // Accede al token desde el archivo .env.local

    // Llamada a la API de MercadoPago para crear la preferencia
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title: description,
            quantity: 1,
            unit_price: amount,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const paymentLink = response.data.init_point;  // MercadoPago proporciona el enlace de pago

    res.json({ payment_link: paymentLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar el QR' });
  }
});

export default router;
