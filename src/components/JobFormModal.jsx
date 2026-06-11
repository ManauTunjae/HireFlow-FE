import { useState, useEffect } from "react";

const JobFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formLoading,
  formError,
  editingJob = null,
}) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    status: "open",
  });

  useEffect(() => {
    if (!isOpen) {
      if (editingJob) {
        setFormData({
          title: editingJob.titile || "",
          company: editingJob.company || "",
          location: editingJob.location || "",
          salary: editingJob.salary || "",
          description: editingJob.description || "",
          requirements: Array.isArray(editingJob.requirements)
            ? editingJob.requirements.join(", ")
            : editingJob.requirements || "",
          status: editingJob.status || "open",
        });
      } else {
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          description: "",
          requirements: "",
          status: "open",
        });
      }
      [setError];
    }
  }, [isOpen, editingJob]);

  if (!isOpen) return null;

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    // Gör om "React, Node.js" till ["React", "Node.js"] genom att dela på varje kommatecken
    const requirementsArray = formData.requirements
      ? formData.requirements
          .split(",")
          .map((req) => req.trim())
          .filter((req) => req !== "")
      : [];

    // Skicka hela paketet upp till Dashboarden
    onSubmit({
      ...formData,
      requirements: requirementsArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 className="text-lg font-bold text-white">
            {editingJob ? "✏️ Edit Job Listing" : "💼 Create New Job"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-400">
            ⚠️ {formError}
          </div>
        )}

        {/* 🎯 INFO-BANNER: Visar exakt vilket jobb som redigeras just nu! */}
        {editingJob && (
          <div className="bg-gray-950/60 border border-gray-800 p-3.5 rounded-xl space-y-3">
            <div className="border-b border-gray-800/60 pb-2">
              <span className="text-[9px] uppercase font-black tracking-wider text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                You are editing:
              </span>
              {/* 🔄 RÄTTAT: Ändrat från 'jobs' till 'editingJob' så vi ser rätt data! */}
              <h4 className="font-bold text-sm text-white mt-1 truncate">
                {editingJob.title}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                🏢 {editingJob.company} • 📍 {editingJob.location}
              </p>
            </div>

            {/* STATUS-DROPDOWN: Ligger kvar här inuti bannern, snyggt och samlat */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Job Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-auto bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="open">🟢 Open (Visible to candidates)</option>
                <option value="closed">🔴 Closed (Archive listing)</option>
              </select>
            </div>
          </div>
        )}

        <form onSubmit={handleLocalSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
              placeholder="e.g. Fullstack Developer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                placeholder="HireFlow AB"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                placeholder="Stockholm / Remote"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
              placeholder="e.g. 45,000 - 55,000 SEK"
            />
          </div>

          {/* REQUIREMENTS INPUT (HÄR ÄR DITT NYA FÄLT!) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Requirements (separated with comma)
            </label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-transparent"
              placeholder="Describe the role..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {formLoading
                ? "Saving..."
                : editingJob
                  ? "Save Changes"
                  : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
