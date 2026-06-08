import { useState, useEffect } from "react";

const JobFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formLoading,
  formError,
}) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          <h3 className="text-lg font-bold text-white">Create New Job</h3>
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

        {/* Form */}
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
              {formLoading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
