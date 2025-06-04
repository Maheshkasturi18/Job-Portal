import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useStore } from "../store";

function JobCardSkeleton() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div
      className={`p-8 rounded-lg shadow-md transition ${
        isDarkMode ? "dark bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            <Skeleton
              width={200}
              height={24}
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
          </h2>
          <div className="flex items-center text-gray-500 mb-2">
            <Skeleton
              width={120}
              height={20}
              className="mr-4"
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
            <Skeleton
              width={80}
              height={20}
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Skeleton
              width={60}
              height={28}
              borderRadius={999}
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
            <Skeleton
              width={80}
              height={28}
              borderRadius={999}
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
          </div>
        </div>
        <div className="text-right">
          <Skeleton
            width={120}
            height={20}
            baseColor={isDarkMode ? "#444" : "#ebebeb"}
            highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
          />
          <div className="mt-2">
            <Skeleton
              width={100}
              height={16}
              baseColor={isDarkMode ? "#444" : "#ebebeb"}
              highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 text-end">
        <Skeleton
          width={100}
          height={40}
          borderRadius={8}
          baseColor={isDarkMode ? "#444" : "#ebebeb"}
          highlightColor={isDarkMode ? "#666" : "#f5f5f5"}
        />
      </div>
    </div>
  );
}

export default JobCardSkeleton;
