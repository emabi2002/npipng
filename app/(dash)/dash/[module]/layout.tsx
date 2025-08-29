import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { module: string };
}) {
  return (
    <>
      <TopSubNav module={params.module} />
      <RedTabs module={params.module} />
      <div className="p-3">{children}</div>
    </>
  );
}
