import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import AdminLayout from "../../components/admin/AdminLayout";
import { subscribeToFeedbacks } from "../../services/feedbackService";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // REAL-TIME FEEDBACK LISTENER
  // ==========================================

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToFeedbacks(
      (firebaseFeedbacks) => {
        setFeedbacks(firebaseFeedbacks);
        setLoading(false);
      },
      (error) => {
        console.error("Feedback Listener Error:", error);

        setFeedbacks([]);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // ==========================================
  // FILTER FEEDBACK
  // ==========================================

  const filteredFeedbacks = useMemo(() => {
    if (filter === "All") {
      return feedbacks;
    }

    return feedbacks.filter(
      (feedback) => Number(feedback.rating || 0) === Number(filter),
    );
  }, [feedbacks, filter]);

  // ==========================================
  // AVERAGE RATING
  // ==========================================

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) {
      return "0.0";
    }

    const totalRating = feedbacks.reduce(
      (total, feedback) => total + Number(feedback.rating || 0),
      0,
    );

    return (totalRating / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  // ==========================================
  // RENDER STARS
  // ==========================================

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-[#f5b000]" : "text-[#ddd5cd]"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <>
        <div className="min-h-screen bg-[#f9f6f1] px-4 py-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-[#171717]">Feedback</h1>

            <p className="mt-1 text-sm text-[#a17d6c]">
              Review feedback from your customers
            </p>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Average Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: 0,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-[#eadfd6] bg-white p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff6d8] text-xl">
                  ⭐
                </div>

                <div>
                  <p className="text-2xl font-semibold text-[#171717]">
                    {loading ? "..." : averageRating}
                  </p>

                  <p className="mt-1 text-sm text-[#8c786d]">Average Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Total Feedback */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: 0.07,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-[#eadfd6] bg-white p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4ece4] text-xl">
                  💬
                </div>

                <div>
                  <p className="text-2xl font-semibold text-[#171717]">
                    {loading ? "..." : feedbacks.length}
                  </p>

                  <p className="mt-1 text-sm text-[#8c786d]">Total Feedback</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "5", "4", "3", "2", "1"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  filter === item
                    ? "bg-[#d15d2c] text-white"
                    : "border border-[#e2d8ce] bg-white text-[#806b60] hover:bg-[#f3ece5]"
                }`}
              >
                {item === "All" ? "All" : `${item} ★`}
              </button>
            ))}
          </div>

          {/* Feedback List */}
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-[#eadfd6] bg-white py-14 text-center">
                <p className="text-sm text-[#8c786d]">Loading feedback...</p>
              </div>
            ) : (
              <>
                {filteredFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.07,
                      ease: "easeOut",
                    }}
                    className="rounded-2xl border border-[#eadfd6] bg-white p-5"
                  >
                    {/* Top */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4ece4] text-sm font-semibold text-[#d15d2c]">
                          {feedback.name?.charAt(0) || "U"}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#171717]">
                            {feedback.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-[11px] text-[#a17d6c]">
                            {feedback.orderId || "-"} · {feedback.date || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderStars(Number(feedback.rating || 0))}

                        <span className="text-xs text-[#8c786d]">
                          {feedback.rating || 0}/5
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-4 rounded-xl bg-[#faf7f2] p-4">
                      <p className="text-sm leading-6 text-[#594c45]">
                        {feedback.message}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {filteredFeedbacks.length === 0 && (
                  <div className="rounded-2xl border border-[#eadfd6] bg-white py-14 text-center">
                    <div className="text-4xl">💬</div>

                    <h2 className="mt-3 text-base font-semibold text-[#171717]">
                      No feedback found
                    </h2>

                    <p className="mt-1 text-sm text-[#8c786d]">
                      There is no feedback for this rating.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default Feedback;
