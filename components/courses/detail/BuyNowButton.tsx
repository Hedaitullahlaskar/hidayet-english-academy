"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function BuyNowButton({ courseSlug }: { courseSlug: string }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseSlug}/pricing`)
      .then((res) => res.json())
      .then((data) => setAvailable(Boolean(data.available)))
      .catch(() => setAvailable(false));
  }, [courseSlug]);

  // Renders nothing until pricing is confirmed available — the existing
  // WhatsApp-based CTAs already cover "contact for fees" courses, so this
  // button only needs to appear when it would genuinely work.
  if (!available) return null;

  return (
    <Button href={`/checkout/${courseSlug}`} size="lg">
      Buy Now — Pay Online →
    </Button>
  );
}
