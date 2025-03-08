"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiMaximize } from "react-icons/fi";

export default function Home() {
  const [names, setNames] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [soundEffect, setSoundEffect] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nameList = names.split("\n").filter((name) => name.trim() !== "");

  useEffect(() => {
    if (isRolling && nameList.length > 0) {
      let currentSpeed = speed;
      const id = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * nameList.length);
        setWinner(nameList[randomIndex]);

        if (!isRolling) {
          currentSpeed += 200;
          if (currentSpeed > 2000) {
            clearInterval(id);
            setIsRolling(false);
            if (winner && removeWinner) {
              setNames((prev) =>
                prev
                  .split("\n")
                  .filter((name) => name !== winner)
                  .join("\n")
              );
            }
            if (soundEffect && audioRef.current) {
              audioRef.current.play();
            }
          }
        }
      }, currentSpeed);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isRolling, names, winner, removeWinner]);

  const handleStart = () => {
    if (!isRolling && nameList.length > 0) {
      setSpeed(100);
      setIsRolling(true);
    }
  };

  const handleStop = () => {
    setIsRolling(false);
  };

  const toggleFullscreen = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className={`flex ${
        isFullscreen ? "fixed top-0 left-0 w-full h-full" : "min-h-screen"
      } p-2`}
      style={{ backgroundColor: "#D1399B" }}
    >
      <audio ref={audioRef} src="/sounds/win.mp3" preload="auto" />
      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed right-0 top-0 h-full w-64 bg-black shadow-lg p-4 flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-white">Pengaturan</h2>
          <h2 className="text-lg font-semibold text-white">Daftar Nama</h2>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="px-4 py-3 border rounded-lg w-full text-black text-lg h-40"
            placeholder="Input Nama Undian"
          />
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={removeWinner}
              onChange={() => setRemoveWinner(!removeWinner)}
            />
            <span>Hapus Nama Dari Daftar Undian</span>
          </label>
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={soundEffect}
              onChange={() => setSoundEffect(!soundEffect)}
            />
            <span>Efek Suara Pemenang</span>
          </label>
          <button
            onClick={() => setShowSidebar(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Logo */}
        <Image
          src="/images/logo up 2.png"
          alt="Logo Undian"
          width={300}
          height={100}
          className="mb-1"
        />

        <h1 className="text-2xl font-bold mb-2 text-white">Lucky Draw</h1>

        <div className="bg-white text-pink-600 px-6 py-3 rounded-lg shadow-md text-2xl font-semibold">
          {winner || "Winner ?"}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleStart}
            disabled={isRolling || nameList.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Mulai
          </button>
          <button
            onClick={handleStop}
            disabled={!isRolling}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>

      {/* Fullscreen & Sidebar Buttons */}
      <div className="fixed top-4 right-4 flex space-x-2">
        <button onClick={toggleFullscreen} className="p-2 text-white">
          <FiMaximize size={20} />
        </button>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 text-white"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
