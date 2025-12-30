const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let gifts = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    to: "Jon Doe",
    price: "1499",
    purchased: false,
  },
  {
    id: 2,
    name: "AirPods Max",
    to: "Jon Doe",
    price: "549",
    purchased: false,
  },
  {
    id: 3,
    name: "Sweater",
    to: "Real Name",
    price: "59,99",
    purchased: true,
  },
];

const port = 3001;
let nextId = 4;

app.get("/api/gifts", (req, res) => {
  try {
    res.json(gifts);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/gift", (req, res) => {
  try {
    const { name, to, price } = req.body;
    if (!name || !to || !price) {
      return res.status(400).json({
        message: "Missing data, please fill out all fields.",
      });
    }
    const newGift = {
      id: nextId++,
      name,
      to,
      price: price.toString(),
      purchased: false,
    };
    gifts.push(newGift);
    return res.status(201).json(newGift);
  } catch (error) {
    console.error("Failed post: ", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.patch("/api/gift/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { purchased } = req.body;
    const gift = gifts.find((g) => g.id === id);
    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }
    gift.purchased = purchased;
    return res.json(gift);
  } catch (error) {
    console.error("Failed to updated field:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/gift/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = gifts.findIndex((g) => g.id === id);
    if (index === -1) {
      return res.status(404).json({
        message: "Gift not found",
      });
    }
    const deletedGift = gifts.splice(index, 1)[0];
    return res.json(deletedGift);
  } catch (error) {
    console.error("Failed to delete gift:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is up. http://localhost:${port}`);
});
