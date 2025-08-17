'use client';

import { EmojiRain } from "@/components/EmojiRain";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const Modal = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWIxdTZsajVoY2h1Z2MycWZ0dWszcThxYmtvcGo4NWk1MTJqNmJoeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13GIgrGdslD9oQ/giphy.gif";

    img.onload = () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#78a068" size={50} />
      </div>
    );
  }

  return (
    <>
      <EmojiRain />
      <div className="max-w-100 rounded-xl mt-20 h-auto p-5 bg-white mx-auto">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWIxdTZsajVoY2h1Z2MycWZ0dWszcThxYmtvcGo4NWk1MTJqNmJoeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13GIgrGdslD9oQ/giphy.gif"
          alt="Typing Cat"
          className="w-80 sm:w-100 h-auto select-none pointer-events-none"
        />
        <h2 className="text-center mt-2">Sorry, the functionality is not implemented yet.</h2>
      </div>
      <div className="justify-center flex mt-4">
        <Link
          className="text-white/50 hover:text-white"
          href='/products'>
          🠔 Return to product selection.
        </Link>
      </div>
    </>
  );
}

export default Modal;
