import { useState, useEffect } from "react";
import { LogOut, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { notesService } from "../services/api";

export default function Dashboard({ onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showNewNote, setShowNewNote] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await notesService.getAll();
      setNotes(data);
      setError("");
    } catch (err) {
      setError("Failed to load notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    try {
      await notesService.create(newNote.title, newNote.content);
      setNewNote({ title: "", content: "" });
      setShowNewNote(false);
      await loadNotes();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create note");
    }
  };

  const handleUpdateNote = async (id) => {
    if (!editingNote.title.trim()) return;

    try {
      await notesService.update(id, editingNote.title, editingNote.content);
      setEditingNote(null);
      await loadNotes();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to update note");
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesService.delete(id);
      await loadNotes();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowNewNote(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-6 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>

        {showNewNote && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleCreateNote}>
              <input
                type="text"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent"
                autoFocus
              />
              <textarea
                placeholder="Note content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-32 focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewNote(false);
                    setNewNote({ title: "", content: "" });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                {editingNote?._id === note._id ? (
                  <div>
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <textarea
                      value={editingNote.content || ""}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          content: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3 h-24 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateNote(note._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded transition text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
