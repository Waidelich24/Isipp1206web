import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new NextResponse("Formato no válido, se esperaba JSON", { status: 415 });
    }

    const rawBody = await req.text();
    if (!rawBody) {
      return new NextResponse("El cuerpo del request está vacío", { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      return new NextResponse("JSON malformado", { status: 400 });
    }

    const { amount = 1000, description = "Donación" } = body;

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
        notification_url: "https://7b9d-2800-2507-100-a414-c504-43f9-e737-ab00.ngrok-free.app/api/webhook"


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
    console.error("[ERROR EN /api/mercadopago]", error);
    return new NextResponse("Error generando QR", { status: 500 });
  }
}
