import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });

export default function HomePage() {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-white ${raleway.className}`}>
      <Image src="/logo.jpg" alt="Fridge Recipes Logo" width={300} height={100.8} className="mb-4" />
      <div className="grid grid-cols-1 gap-4">
        <Link href="/whats-in-my-fridge">
          <Button className="w-64 bg-green-600 hover:bg-green-700">What's in My Fridge</Button>
        </Link>
        <Link href="/whats-for-my-next-meal">
          <Button className="w-64 bg-green-600 hover:bg-green-700">What's for My Next Meal</Button>
        </Link>
      </div>
    </div>
  );
}
