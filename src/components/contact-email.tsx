"use client";

import { useState } from "react";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus("Message sent successfully!");
                setForm({ name: "", email: "", message: "" });
            } else {
                setStatus("Something went wrong. Try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus("Something went wrong. Try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
                suppressHydrationWarning={true}
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
                suppressHydrationWarning={true}
            />
            <textarea
                name="message"
                placeholder="Your Message"
                required
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 h-32 rounded bg-gray-800 text-white border border-gray-600"
                suppressHydrationWarning={true}
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
                suppressHydrationWarning={true}
            >
                Send Message
            </button>
            {status && (
                <p className="text-sm text-gray-400" suppressHydrationWarning={true}>
                    {status}
                </p>
            )}
        </form>
    );
}