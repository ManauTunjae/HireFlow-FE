import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../api/axiosInstance";
import JobCard from "../components/JobCard";
import AuthModal from "../components/AuthModal";
import { AuthContext } from "../context/AuthContext";

const JobBoard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("api/jobs");
        console.log("Jobs fetched from Render:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setJobs(response.data);
        } else if (response.data && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else if (response.data && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
        } else {
          setJobs([]);
        }
        setLoading(false);
      } catch (error) {
        console.log("Error fetching jobs from Render:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      {/* Login */}
      {/* Responsiv Nav */}
      <nav className="sticky top-0 bg-green-900/80 backdrop-blur-md border-b border-green-800 px-6 py-4 z-40">
        <div className="max-w-auto mx-auto flex justify-between items-center relative">
          {/* Logga */}
          <span
            onClick={() => navigate("/")}
            className="text-2xl font-black text-white tracking-tighter cursor-pointer"
          >
            Hire<span className="text-green-400">Flow</span>
          </span>

          {/* 💻 DESKTOP-MENY: Visas från surfplatta/dator (lg:flex) */}
          <div className="hidden lg:flex items-center gap-6 pr-2">
            {user ? (
              <>
                <button
                  onClick={() =>
                    navigate(
                      user.role === "candidate"
                        ? "/candidate-dashboard"
                        : "/recruiter-dashboard",
                    )
                  }
                  className="text-black bg-white/10 border border-white/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase cursor-pointer rounded-full shadow-[0_4px_10px_rgba(63,65,68,0.386)] transition-all duration-300 hover:scale-110 hover:bg-white/45 hover:border-white/60"
                >
                  Dashboard 📊
                </button>
                <button
                  onClick={() => logout(navigate)}
                  className="text-white bg-red-600/80 border border-red-500/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase cursor-pointer rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              /* Sign In på datorn */
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-black bg-white border border-white px-4 py-1.5 text-xs font-bold tracking-widest uppercase cursor-pointer rounded-full transition-all duration-300 hover:scale-110"
              >
                Sign In
              </button>
            )}
          </div>

          {/* 📱 MOBIL-HÖGERSIDA: Visas under 1024px (lg:hidden) */}
          <div className="lg:hidden flex items-center gap-2 pr-3">
            {user ? (
              /* Om inloggad: Visa bara hamburgarknappen på mobilen 🍔 */
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-green-300 focus:outline-none text-3xl transition-transform duration-200 active:scale-90"
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* 🍔 MOBIL DROPDOWN: Nu helt dedikerad till inloggade funktioner! */}
          {user && (
            <div
              className={`fixed top-[52px] sm:top-[60px] right-0 w-[200px] sm:w-[250px] bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-l-2xl shadow-[0_10px_30px_rgba(142,170,205,0.25)] p-5 flex flex-col items-end transition-all duration-300 lg:hidden ${
                isMobileMenuOpen
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-4 pointer-events-none"
              }`}
            >
              <div className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2 w-full text-right truncate">
                👤 {user.username}
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(
                    user.role === "candidate"
                      ? "/candidate-dashboard"
                      : "/recruiter-dashboard",
                  );
                }}
                className="w-full text-right py-3 text-sm font-bold text-gray-700 border-b border-gray-100 hover:text-green-600 transition-colors"
              >
                Dashboard 📊
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout(navigate);
                }}
                className="w-full text-right py-3 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                Sign Out 🛑
              </button>
            </div>
          )}
        </div>
      </nav>

      <header className="w-full border-b border-gray-200 flex justify-center">
        {/* 📱 MOBILBILD: Visas på små skärmar, göms från surfplatta/dator (md:hidden) */}
        <img
          src="/hireflow-banner-mobile.png" // 👈 Din nya kvadratiska Canva-bild!
          alt="HireFlow Banner Mobile"
          className="w-full h-[300px] object-cover object-center md:hidden"
        />

        {/* 💻 DESKTOPBILD: Gömmas på mobilen (hidden), visas från surfplatta/dator (md:block) */}
        <img
          src="/hireflow-banner.png" // 👈 Din nuvarande breda Canva-bild!
          alt="HireFlow Banner Desktop"
          className="hidden md:block w-full h-auto aspect-[3.5/1] object-cover object-center"
        />
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12">
        <div className="mb-10">
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          <div className="max-w-md mx-auto text-md">
            <label
              htmlFor="search"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              Search opportunities
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, company or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {searchQuery ? "Search Results" : "Latest Jobs Listings"}
        </h2>

        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600 font-medium">
                Fetching jobs from Render...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-500 py-4">
                {searchQuery
                  ? "No jobs match your search."
                  : "No jobs available at the moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobBoard;
