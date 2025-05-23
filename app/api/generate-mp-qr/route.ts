import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  
  try {
    const { amount, description } = await request.json();

    // 1. Mantenemos el payload base que ya funciona
    const mpPayload = {
      items: [{
        title: description || 'Donación',
        quantity: 1,
        unit_price: Number(amount) || 1000,
        currency_id: 'ARS',
      }],
      payer: {
        email: 'comprador@ejemplo.com' // Email obligatorio
      },
      payment_methods: {
        excluded_payment_types: [{ id: 'atm' }] // Excluye métodos no deseados
      },
      point_of_interaction: {
        type: "QR"
      },
      // 2. Añadimos los nuevos campos SIN modificar la estructura existente
      notification_url: process.env.NEXTAUTH_URL ? 
        `${process.env.NEXTAUTH_URL}/api/mp-webhook` : undefined,
      external_reference: `QR_${Date.now()}`,
      metadata: {
        source: 'DONACION_QR',
        created_at: new Date().toISOString()
      }
    };

    // 3. La petición a MP se mantiene igual
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      mpPayload,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 4. Extracción del QR igual que antes
    const qrData = response.data.point_of_interaction?.transaction_data?.qr_code 
                || response.data.point_of_interaction?.transaction_data?.qr_code_base64
                || response.data.init_point;

    if (!qrData) {
      throw new Error('No se pudo obtener código QR de la respuesta');
    }

    // 5. Respuesta ampliada pero compatible
    return NextResponse.json({
      qr_code: qrData,
      preference_id: response.data.id,
      // Añadimos estos nuevos campos pero el frontend antiguo puede ignorarlos
      reference_id: mpPayload.external_reference,
      notification_url: mpPayload.notification_url
    });

  } catch (error: any) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
    });

    return NextResponse.json(
      {
        error: 'Error al generar QR',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}