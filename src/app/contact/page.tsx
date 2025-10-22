"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit form");

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center pt-24 px-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Thank you!</h2>
          <p className="text-white mb-6">
            Your message has been sent successfully.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-align-green text-black font-semibold px-6 py-3 rounded-full"
          >
            Send another message
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Contact Us
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-align-green focus:border-transparent text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-align-green focus:border-transparent text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-white mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-align-green focus:border-transparent text-white"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-align-green focus:border-transparent text-white resize-none"
                placeholder="Your message..."
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-align-green text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-align-green/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}