import Note from "../models/Note.js";
// Get all Notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.user_id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ error: "Server error fetching notes" });
  }
};

// Create Notes
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const note = await Note.create({
      title,
      content: content || "",
      owner: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully 🎉",
      data: note,
    });
  } catch (err) {
    console.error("Create note error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error creating note" });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, owner: req.user.user_id },
      { title, content },
      { new: true, runValidators: true }
    ).lean();

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.json({
      success: true,
      message: "Note updated successfully!",
      data: note,
    });
  } catch (err) {
    console.error("Update note error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error updating note" });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Note.deleteOne({ _id: id, owner: req.user.user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting note" });
  }
};
