"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiMaximize } from "react-icons/fi";

export default function Home() {
  const [names, setNames] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [removeWinner, setRemoveWinner] = useState(false);
  const nameInputRef = useRef<HTMLTextAreaElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nameList = names.split("\n").filter((name) => name.trim() !== "");

  useEffect(() => {
    if (isRolling && nameList.length > 0) {
      const id = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * nameList.length);
        setWinner(nameList[randomIndex]);
      }, 10);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isRolling, names]);

  const handleToggle = () => {
    if (isRolling) {
      setIsRolling(false);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (winner && removeWinner) {
        setNames((prev) =>
          prev
            .split("\n")
            .filter((name) => name !== winner)
            .join("\n")
        );
      }
    } else {
      if (nameList.length > 0) {
        setIsRolling(true);
        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    }
  };

  const toggleFullscreen = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement === nameInputRef.current) return;
      if (event.code === "Space") {
        event.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRolling]);

  const handleSave = () => {
    setShowSidebar(false);
  };

  return (
    <div className={`flex ${isFullscreen ? "fixed top-0 left-0 w-full h-full" : "min-h-screen"} p-2`} style={{ backgroundColor: "#D1399B" }}>
      <audio ref={audioRef} src="/sounds/Casino Reward 20.wav" loop />
      {showSidebar && (
        <div className="fixed right-0 top-0 h-full w-768 bg-black shadow-lg p-4 flex flex-col space-y-4 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Pengaturan</h2>
          <h2 className="text-lg font-semibold text-white">Daftar Nama</h2>
          <textarea
            ref={nameInputRef}
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="px-4 py-3 border rounded-lg w-full text-black text-lg h-40"
            placeholder="Input Nama Undian"
          />
          <label className="flex items-center space-x-2 text-white">
            <input type="checkbox" checked={removeWinner} onChange={() => setRemoveWinner(!removeWinner)} />
            <span>Hapus Nama Dari Daftar Undian</span>
          </label>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Save
          </button>
          <button onClick={() => setShowSidebar(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Close
          </button>
        </div>
      )}
      <div className="flex flex-col items-center justify-center flex-grow">
        <Image src="/images/logo up 2.png" alt="Logo Undian" width={300} height={100} className="mb-1" />
        <h1 className="text-5xl font-bold mb-3 text-white">Pemenangnya Adalah</h1>
        <div className="bg-white text-pink-600 px-6 py-3 rounded-lg shadow-md text-8xl font-semibold">
          {winner || "Winner ?"}
        </div>
        <div className="mt-6 flex space-x-4">
          <button onClick={handleToggle} className={`px-20 py-4 text-2xl text-white rounded-lg ${isRolling ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
            {isRolling ? "Stop" : "Mulai"}
          </button>
        </div>
      </div>
      <div className="fixed top-4 right-4 flex space-x-2">
        <button onClick={toggleFullscreen} className="p-2 text-white">
          <FiMaximize size={20} />
        </button>
        <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 text-white">
          ☰
        </button>
      </div>
    </div>
  );
}
