"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Assuming you have this component

const HomePage: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const router = useRouter();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleFormSubmit}
        className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      >
        <div>
          <Label
            htmlFor="room-code"
            className="block text-xl font-semibold mb-2 text-dark-gray"
          >
            Enter Room Code
          </Label>
          <Input
            id="room-code"
            value={roomCode}
            onChange={(e: any) => setRoomCode(e.target.value)}
            type="text"
            required
            placeholder="Enter Room Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button type="submit" className="w-full 24 9.8% 10%">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default HomePage;

// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const HomePage: React.FC = () => {
//   const [roomCode, setRoomCode] = useState<string>("");
//   const router = useRouter();

//   const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (roomCode.trim()) {
//       router.push(`/room/${roomCode}`);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-light-gray">
//       <form
//         onSubmit={handleFormSubmit}
//         className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
//       >
//         <div>
//           <label
//             htmlFor="room-code"
//             className="block text-xl font-semibold mb-2 text-dark-gray"
//           >
//             Enter Room Code
//           </label>
//           <Input
//             id="room-code"
//             value={roomCode}
//             onChange={(e: any) => setRoomCode(e.target.value)}
//             type="text"
//             required
//             placeholder="Enter Room Code"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <Button type="submit" className="w-full 24 9.8% 10%">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default HomePage;
