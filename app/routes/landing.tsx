import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

export default function Home() {
  return <div />;
}
