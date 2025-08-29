// app/(dash)/dash/[module]/[feature]/page.tsx

export async function generateStaticParams() {
  return [
    { module: 'academic', feature: 'academic-management' },
    { module: 'academic', feature: 'student-portals' },
    { module: 'academic', feature: 'staff-portals' },
    { module: 'finance', feature: 'billing' },
    { module: 'finance', feature: 'payments' },
  ];
}

export default function FeatureHome({
  params,
}:{ params:{ module:string; feature:string }}) {
  return (
    <div className="panel p-4">
      <h1 className="text-lg font-semibold capitalize">
        {params.module} / {params.feature}
      </h1>
      <p className="text-sm text-gray-600">
        Placeholder – we'll plug in real screens next.
      </p>
    </div>
  );
}
