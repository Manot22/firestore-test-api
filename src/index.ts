import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("API IS CONNECTED IN PORT:" + port);
});

app.get("/products", async (req, res) => {
  const snapshot = await db.collection("products").get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

app.post("/products", async (req, res) => {
  const docRef = await db.collection("products").add(req.body);
  res.json({ id: docRef.id });
});

const port = process.env.PORT;
app.listen(port, () => console.log("🚀 Server listening on port", port));
