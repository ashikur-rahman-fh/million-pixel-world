"use client";

import { WorldCanvas } from "@/components/world/WorldCanvas";
import { useApi } from "@/lib/hooks/useApi";
import { helloService } from "@/services/helloService";

const Loading = () => {
  return <p>Loading...</p>;
};

const Error = ({ message }: { message: string }) => {
  return <p>Error: {message}</p>;
};

const NoData = () => {
  return <p>No data available</p>;
};

export default function Home() {
  const { data: helloResponse, error, loading } = useApi(helloService.hello);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!helloResponse) {
    return <NoData />;
  }

  return (
    <>
      <WorldCanvas />
    </>
  );
}
