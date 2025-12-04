import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'card' | 'chart' | 'stat' | 'text';
  rows?: number;
  columns?: number;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  rows = 5,
  columns = 4,
  height = 'h-4',
  className = ''
}) => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  if (type === 'table') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Table Header */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <div key={i} className={`${shimmerClass} h-4 rounded`}></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/50">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`${shimmerClass} ${height} rounded`}
                  style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl">
            <div className={`${shimmerClass} h-4 w-24 rounded mb-4`} style={{ animationDelay: `${i * 0.1}s` }}></div>
            <div className={`${shimmerClass} h-8 w-32 rounded mb-2`} style={{ animationDelay: `${i * 0.1 + 0.05}s` }}></div>
            <div className={`${shimmerClass} h-3 w-20 rounded`} style={{ animationDelay: `${i * 0.1 + 0.1}s` }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl ${className}`}>
        <div className={`${shimmerClass} h-6 w-48 rounded mb-6`}></div>
        <div className="flex items-end justify-between gap-2 h-64">
          {[...Array(8)].map((_, i) => {
            const randomHeight = 30 + Math.random() * 70;
            return (
              <div
                key={i}
                className={`${shimmerClass} rounded-t-lg flex-1`}
                style={{
                  height: `${randomHeight}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${shimmerClass} h-3 w-12 rounded`} style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className={`bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl ${className}`}>
        <div className={`${shimmerClass} h-4 w-32 rounded mb-3`}></div>
        <div className={`${shimmerClass} h-10 w-40 rounded mb-2`}></div>
        <div className={`${shimmerClass} h-3 w-24 rounded`}></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className={`${shimmerClass} ${height} rounded`} style={{ animationDelay: `${i * 0.05}s` }}></div>
      ))}
    </div>
  );
};

interface ReportSkeletonProps {
  reportType: 'profit-loss' | 'balance-sheet' | 'aged-reports' | 'accounts';
}

export const ReportSkeleton: React.FC<ReportSkeletonProps> = ({ reportType }) => {
  switch (reportType) {
    case 'profit-loss':
      return (
        <div className="space-y-6">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="table" rows={8} columns={3} />
        </div>
      );

    case 'balance-sheet':
      return (
        <div className="space-y-6">
          <SkeletonLoader type="card" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader type="table" rows={6} columns={2} />
            <SkeletonLoader type="table" rows={6} columns={2} />
          </div>
        </div>
      );

    case 'aged-reports':
      return (
        <div className="space-y-6">
          <SkeletonLoader type="card" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader type="chart" />
            <SkeletonLoader type="chart" />
          </div>
          <SkeletonLoader type="table" rows={10} columns={7} />
        </div>
      );

    case 'accounts':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} type="stat" />
            ))}
          </div>
          <SkeletonLoader type="table" rows={12} columns={5} />
        </div>
      );

    default:
      return <SkeletonLoader type="table" rows={8} columns={4} />;
  }
};

export default SkeletonLoader;
