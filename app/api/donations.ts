import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount = 1000, description = "Donación" } = await req.json();

  try {
    const preferenceRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: description,
            quantity: 1,
            unit_price: amount,
          },
        ],
        payment_methods: {
          excluded_payment_types: [{ id: "credit_card" }],
          default_payment_method_id: "qr",
          installments: 1,
        },
        notification_url: "https://2cc6-187-102-219-241.ngrok-free.app/api/weephook",
      }),
    });

    const preferenceData = await preferenceRes.json();

    if (!preferenceData.id) {
      return new NextResponse("Error generando preferencia de pago", { status: 500 });
    }

    return NextResponse.json({
      qrData: `https://www.mercadopago.com.ar/mpqr/instore/qr/${preferenceData.id}`,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error generando QR", { status: 500 });
  }
}
