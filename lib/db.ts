import { MongoClient, Db, Collection } from "mongodb";

interface Donor {
  name: string;
  amount: number;
  date: Date;
}

interface DonationStats {
  total: number;
  donors: { name: string; amount: number }[];
}
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('La variable MONGO_URI no está definida en las variables de entorno');
}

let cachedClient: MongoClient;
let cachedDb: Db;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db("donations");
  
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function saveDonationFromWebhook(donor: Omit<Donor, "date">) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<Donor>("donors");
    
    await collection.insertOne({ 
      ...donor, 
      date: new Date() 
    });
  } catch (error) {
    console.error("Error al guardar donación:", error);
    throw error;
  }
}

export async function getDonationStats(): Promise<DonationStats> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<Donor>("donors");

    const [totalResult, topDonors] = await Promise.all([
      collection.aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$amount" } }}
      ]).toArray(),
      
      collection.aggregate<{ _id: string; total: number }>([
        { $group: { _id: "$name", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ]).toArray()
    ]);

    return {
      total: totalResult[0]?.total || 0,
      donors: topDonors.map(d => ({ name: d._id, amount: d.total }))
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
}

// Opcional: Cerrar conexión al apagar la aplicación
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
  }
  process.exit();
});