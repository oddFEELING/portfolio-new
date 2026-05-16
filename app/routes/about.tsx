import { Button } from "@/components/ui/button";
import posthog from "posthog-js";
import { Activity, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="flex flex-col gap-4 p-20">
      <p>About page</p>
      <Activity mode={isVisible ? "visible" : "hidden"}>
        <span>This is an activity</span>
      </Activity>

      <Button onClick={() => posthog.capture("Sample event", { key: "value" })}>
        Track event
      </Button>
      <Button onClick={() => setIsVisible(!isVisible)}>toggle activity</Button>
    </div>
  );
};

export default About;
