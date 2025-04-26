import Link from "next/link";
import React from "react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link href="/" className={`text-white text-xl ${className}`}>
      Job<b className="text-primary">Insight</b>
    </Link>
  );
};

export default Logo; 