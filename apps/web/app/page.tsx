'use client'

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "./components";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleJoin = () => {
    const roomId = inputRef.current?.value.trim();
    if (roomId) {
      router.push(`/join-room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <Input
        label="Room Id:"
        className="px-1 rounded-md"
        ref={inputRef}
      />
      <Button
        label="Join Room"
        className="bg-gray-400 hover:bg-gray-600 duration-200"
        onClick={handleJoin}
      />
    </div>
  );
}
