import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import { authenticateToken } from "../middleware/auth.js";

const notesRouter = express.Router();

notesRouter.get("/", authenticateToken, getNotes);
notesRouter.post("/", authenticateToken, createNote);
notesRouter.put("/:id", authenticateToken, updateNote);
notesRouter.delete("/:id", authenticateToken, deleteNote);

export default notesRouter;
