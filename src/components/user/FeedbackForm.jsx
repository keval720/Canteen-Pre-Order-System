import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { addFeedback } from "../../services/feedbackService";

const FeedbackForm = ({ order, onSubmitted, onCancel }) => {
  const { user, profile } = useAuth();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("Please login to submit feedback.");
      return;
    }

    if (!order?.id) {
      setError("Order information is missing.");
      return;
    }

    if (order.status !== "Delivered") {
      setError("Feedback is available only for delivered orders.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      setError("Please write your feedback.");
      return;
    }

    try {
      setSubmitting(true);

      const feedbackData = {
        userId: user.uid,
        name: profile?.name || user.displayName || "User",
        orderId: order.id,
        rating,
        message: message.trim(),
        date: new Date().toLocaleDateString("en-IN"),
      };

      await addFeedback(feedbackData);

      setRating(0);
      setMessage("");

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (error) {
      console.error("Submit Feedback Error:", error);

      setError("Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#eadfd6] bg-white p-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-[#171717]">
          Give Your Feedback
        </h2>

        <p className="mt-1 text-xs text-[#8c786d]">
          Share your experience with this order.
        </p>
      </div>

      {/* Rating */}
      <div className="mt-5">
        <p className="text-xs font-medium text-[#594c45]">
          How was your experience?
        </p>

        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              disabled={submitting}
              className={`text-3xl leading-none transition ${
                star <= rating
                  ? "text-[#f5b000]"
                  : "text-[#ddd5cd] hover:text-[#f5b000]"
              }`}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="mt-2 text-xs text-[#8c786d]">
            {rating === 1 && "Very Poor"}
            {rating === 2 && "Poor"}
            {rating === 3 && "Average"}
            {rating === 4 && "Good"}
            {rating === 5 && "Excellent"}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mt-5">
        <label
          htmlFor="feedback-message"
          className="text-xs font-medium text-[#594c45]"
        >
          Your Feedback
        </label>

        <textarea
          id="feedback-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setError("");
          }}
          disabled={submitting}
          rows={4}
          placeholder="Tell us about your experience..."
          className="mt-2 w-full resize-none rounded-xl border border-[#ded2c7] bg-[#faf7f2] px-3 py-3 text-xs text-[#29231f] outline-none transition focus:border-[#d15d2c]"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-lg bg-[#fff3f3] px-3 py-2 text-xs text-[#d9534f]">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="mt-5 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-[#ded2c7] bg-white px-4 py-2.5 text-xs font-medium text-[#806b60] transition hover:bg-[#f7f1eb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-xl bg-[#d15d2c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#b84d20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
