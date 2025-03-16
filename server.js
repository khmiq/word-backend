// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();

// const allowedOrigins = [
//   "https://word-frontend-rosy.vercel.app",
//   "https://word-frontend-git-main-khmiqs-projects.vercel.app",
//   "https://word-frontend-w171cpsuu-khmiqs-projects.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: "GET, POST, PUT, DELETE, PATCH",
//     allowedHeaders: "Content-Type",
//   })
// );

// app.use(express.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://localhost:27017/wordsDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("Database connection error:", err));

// // Define Schema and Model
// const wordSchema = new mongoose.Schema({ text: { type: String, unique: true, required: true } });
// const Word = mongoose.model("Word", wordSchema);

// // Get all words
// app.get("/words", async (req, res) => {
//   try {
//     const words = await Word.find().sort({ _id: 1 });
//     res.json(words);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching words", error: error.message });
//   }
// });

// // Add a new word
// app.post("/words", async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ message: "Word is required" });

//   try {
//     const existingWord = await Word.findOne({ text });
//     if (existingWord) {
//       return res.status(400).json({ message: "Word already exists", word: existingWord });
//     }
//     const newWord = new Word({ text });
//     await newWord.save();
//     res.json({ message: "Word added successfully", word: newWord });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding word", error: error.message });
//   }
// });

// // Update a word
// app.patch("/words/:id", async (req, res) => {
//   const { id } = req.params;
//   const { text } = req.body;  // It expects a 'text' field

//   if (!text) return res.status(400).json({ message: "Word is required" });

//   try {
//     const updatedWord = await Word.findByIdAndUpdate(id, { text }, { new: true });
//     if (!updatedWord) return res.status(404).json({ message: "Word not found" });
//     res.json({ message: "Word updated successfully", word: updatedWord });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating word", error: error.message });
//   }
// });


// // Delete a word
// app.delete("/words/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedWord = await Word.findByIdAndDelete(id);
//     if (!deletedWord) return res.status(404).json({ message: "Word not found" });
//     res.json({ message: "Word deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting word", error: error.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://word-manager.vercel.app",
  "https://word-frontend-git-main-khmiqs-projects.vercel.app",
  "https://word-frontend-w171cpsuu-khmiqs-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/wordsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Database connection error:", err));

// Define Schema and Model
const wordSchema = new mongoose.Schema({ text: { type: String, unique: true, required: true } });
const Word = mongoose.model("Word", wordSchema);

// Get all words
app.get("/words", async (req, res) => {
  try {
    const words = await Word.find().sort({ _id: 1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error fetching words", error: error.message });
  }
});

// Add a new word
app.post("/words", async (req, res) => {
  let { text } = req.body;
  if (!text) return res.status(400).json({ message: "Word is required" });

  // Normalize: lowercase and trim spaces
  text = text.trim().toLowerCase();

  try {
    const existingWord = await Word.findOne({ text });
    if (existingWord) {
      return res.status(400).json({ message: "Word already exists", word: existingWord });
    }

    const newWord = new Word({ text });
    await newWord.save();
    res.json({ message: "Word added successfully", word: newWord });
  } catch (error) {
    res.status(500).json({ message: "Error adding word", error: error.message });
  }
});

// Update a word
app.patch("/words/:id", async (req, res) => {
  const { id } = req.params;
  let { text } = req.body; // It expects a 'text' field

  if (!text) return res.status(400).json({ message: "Word is required" });

  // Normalize: lowercase and trim spaces
  text = text.trim().toLowerCase();

  try {
    const updatedWord = await Word.findByIdAndUpdate(id, { text }, { new: true });
    if (!updatedWord) return res.status(404).json({ message: "Word not found" });
    res.json({ message: "Word updated successfully", word: updatedWord });
  } catch (error) {
    res.status(500).json({ message: "Error updating word", error: error.message });
  }
});

// Delete a word
app.delete("/words/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWord = await Word.findByIdAndDelete(id);
    if (!deletedWord) return res.status(404).json({ message: "Word not found" });
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting word", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
