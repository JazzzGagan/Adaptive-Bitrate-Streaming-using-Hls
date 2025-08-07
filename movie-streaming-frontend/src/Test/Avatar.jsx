// components/Avatar.jsx
import React, { useState } from "react";
<<<<<<< HEAD
import multiavatar from "@multiavatar/multiavatar"

const usernames = ["alice", "bob", "charlie", "dave", "emma", "frank", "hero", "elon"];
=======
import multiavatar from "@multiavatar/multiavatar";

const usernames = [
  "alice",
  "bob",
  "charlie",
  "dave",
  "emma",
  "frank",
  "hero",
  "elon",
];
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)

export default function Avatar({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (name) => {
    setSelected(name);
    onSelect(multiavatar(name));
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {usernames.map((name) => (
        <div
          key={name}
          className={`cursor-pointer border-2 rounded-full p-1 ${
            selected === name ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => handleSelect(name)}
          dangerouslySetInnerHTML={{ __html: multiavatar(name) }}
        />
      ))}
    </div>
  );
}
