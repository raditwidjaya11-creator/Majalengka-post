import React, { useState } from "react";
import { Layers, Plus, Edit2, Trash2, RefreshCw, Check } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsSceneManager() {
  const { scenes, state, changeScene, addScene, renameScene, removeScene, fetchScenes } = useObsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState("");

  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState("");

  const handleAddScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneName.trim()) return;
    await addScene(newSceneName.trim());
    setNewSceneName("");
    setShowAddModal(false);
  };

  const handleRenameSubmit = async (oldName: string) => {
    if (!editNameInput.trim() || editNameInput === oldName) {
      setEditingScene(null);
      return;
    }
    await renameScene(oldName, editNameInput.trim());
    setEditingScene(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Scene Management ({scenes.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchScenes()}
            title="Refresh Scene List"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            disabled={!state.connected}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Scene</span>
          </button>
        </div>
      </div>

      {/* Add Scene Form Modal */}
      {showAddModal && (
        <form onSubmit={handleAddScene} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
          <input
            type="text"
            required
            value={newSceneName}
            onChange={(e) => setNewSceneName(e.target.value)}
            placeholder="Nama Scene Baru (Misal: Studio 2 / Kamera Kamera 1)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold"
          >
            Batal
          </button>
        </form>
      )}

      {/* Scenes List Grid */}
      {scenes.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">
          {state.connected ? "Tidak ada scene terdeteksi di OBS." : "Hubungkan ke OBS Studio untuk melihat daftar scene."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {scenes.map((sc) => {
            const isActive = state.activeScene === sc.sceneName;
            const isEditing = editingScene === sc.sceneName;

            return (
              <div
                key={sc.sceneName}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 relative ${
                  isActive
                    ? "bg-red-950/40 border-red-500/80 text-white shadow-lg shadow-red-950/50"
                    : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {/* Scene Name or Edit Input */}
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRenameSubmit(sc.sceneName)}
                      className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-mono">
                        Scene #{sc.sceneIndex + 1}
                      </span>
                      <h4 className="text-xs font-extrabold truncate max-w-[140px]" title={sc.sceneName}>
                        {sc.sceneName}
                      </h4>
                    </div>
                    {isActive && (
                      <span className="text-[8px] uppercase font-black tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded shadow">
                        ON AIR
                      </span>
                    )}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                  <button
                    type="button"
                    disabled={isActive}
                    onClick={() => changeScene(sc.sceneName)}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      isActive
                        ? "bg-red-600 text-white cursor-default"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    }`}
                  >
                    {isActive ? "Program Active" : "Switch Scene"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScene(sc.sceneName);
                        setEditNameInput(sc.sceneName);
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                      title="Rename Scene"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeScene(sc.sceneName)}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                      title="Hapus Scene"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
