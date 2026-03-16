const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="w-16 h-4" />
    </div>
    <Skeleton className="w-3/4 h-6" />
    <Skeleton className="w-full h-12" />
    <div className="flex justify-between pt-4">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
);

export const TaskSkeleton = () => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
    <Skeleton className="w-full h-5" />
    <Skeleton className="w-2/3 h-4" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="w-16 h-4 rounded-full" />
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
