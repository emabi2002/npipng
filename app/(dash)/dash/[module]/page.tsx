import { redirect } from "next/navigation";
import { SUBNAV } from "@/components/nav/menuConfig";

export async function generateStaticParams() {
  return [
    { module: 'academic' },
    { module: 'finance' },
    { module: 'hr' },
    { module: 'welfare' },
    { module: 'library' },
    { module: 'industry' },
    { module: 'setup' },
  ];
}

export default function ModuleIndex({
  params,
}: {
  params: { module: string };
}) {
  const first = SUBNAV[params.module]?.[0];
  if (first) redirect(first.href);
  return <div className="panel p-4">No sub-menu configured.</div>;
}
