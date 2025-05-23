import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Obtener elementos esenciales
    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('❌ Missing x-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Leer el body como texto crudo (IMPORTANTE: no parsear aún)
    const rawBody = await request.text();
    const secret = process.env.MP_WEBHOOK_SECRET?.trim();
    
    if (!secret) {
      console.error('❌ MP_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 3. Parsear la firma según formato de MP: "ts=123456789,v1=abc123"
    const [tsPart, v1Part] = signature.split(',');
    const timestamp = tsPart?.split('=')[1];
    const receivedHash = v1Part?.split('=')[1];
    
    if (!timestamp || !receivedHash) {
      console.error('❌ Invalid signature format:', signature);
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 400 });
    }

    // 4. Crear el payload EXACTO que usa MP (timestamp + body)
    const payload = `${timestamp}.${rawBody}`;
    
    // 5. Calcular HMAC-SHA256
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // 6. Comparación segura de hashes
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedHash, 'hex'),
      Buffer.from(receivedHash, 'hex')
    );

    if (!isValid) {
      console.error('❌ FINAL HASH MISMATCH:', {
        receivedHash,
        generatedHash,
        payloadSample: payload.slice(0, 100),
        timestamp,
        secret: '***' + secret.slice(-4),
        rawBodyLength: rawBody.length
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 7. Parsear y procesar el webhook
    const webhookData = JSON.parse(rawBody);
    console.log('✅ Webhook validado:', {
      id: webhookData.data?.id,
      action: webhookData.action,
      type: webhookData.type
    });

    // 8. Responder éxito (IMPORTANTE: MP espera 200 OK)
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}