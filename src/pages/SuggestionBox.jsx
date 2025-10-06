import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Suggestion } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "Feature Requests",
  "Technical Issues/Bugs", 
  "User Experience",
  "Charts & Discovery",
  "Artist Tools",
  "Account & Billing"
];

export default function SuggestionBoxPage() {
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    User.me().then(setUser).catch(() => {
      User.login();
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !message.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await Suggestion.create({
        category,
        message: message.trim(),
        user_email: user.email
      });
      setSubmitted(true);
      setCategory("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Error submitting suggestion. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="material-shadow p-8 max-w-md w-full text-center">
          <CardContent>
            <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to submit suggestions.
            </p>
            <Button onClick={() => User.login()} className="w-full">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="material-shadow p-8 max-w-md w-full">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your suggestion has been submitted. We'll review it and get back to you if we need more information.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Submit Another Suggestion
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Suggestion Box</h1>
          <p className="text-lg text-gray-600">
            Help us improve DripCharts! Share your ideas, report issues, or suggest new features.
          </p>
        </div>

        <Card className="material-shadow">
          <CardHeader>
            <CardTitle>Submit Your Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Suggestion *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your idea, report a bug, or suggest an improvement..."
                  className="h-32"
                  maxLength={1000}
                  required
                />
                <div className="text-xs text-gray-500 text-right">
                  {message.length}/1000 characters
                </div>
              </div>

              <Button
                type="submit"
                disabled={!category || !message.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}