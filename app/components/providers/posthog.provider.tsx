import type { PostHogConfig } from "posthog-js";
import {
  PostHogErrorBoundary,
  PostHogProvider as PostHogProviderBase,
} from "posthog-js/react";

type PostHogProviderProps = {
  children: React.ReactNode;
};

const posthogOptions: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string,
  defaults: "2025-05-24",
};

export const PostHogProvider: React.FC<PostHogProviderProps> = ({
  children,
}) => (
  <PostHogProviderBase
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={posthogOptions}
  >
    <PostHogErrorBoundary fallback={<div>An Error occured</div>}>
      {children}
    </PostHogErrorBoundary>
  </PostHogProviderBase>
);
