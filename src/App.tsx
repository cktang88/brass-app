import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { PlusIcon, MinusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Player = { name: string; curMoney: number; moneyLog: number[] };

const BrassGameTracker: React.FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [curOp, setCurOp] = useState<string | null>(null);

  const getPlayer = () => {
    return players.find((player) => player.name === username);
  };

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    const newUsername: string = prompt("Username:")!;

    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      const user = getPlayer();
      if (!user) {
        const newPlayer: Player = {
          name: newUsername,
          curMoney: 0,
          moneyLog: [],
        };
        setPlayers([newPlayer, ...players]);
        localStorage.setItem(
          "players",
          JSON.stringify([newPlayer, ...players])
        );
        localStorage.setItem("username", newUsername); // Store the player's name
      } else {
        // load player
        setDisplay(String(user.curMoney));
      }
    }
    setUsername(newUsername);
  }, []);

  const buttons = [
    "C",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "=",
    "0",
  ];

  const updateMoney = () => {
    setCurOp(null);
    try {
      const result = eval(display);
      setDisplay(String(result));

      // Update player's score
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player, index) => {
          if (index === 0) {
            // Assuming the first player is the current player
            return { ...player, curMoney: Number(result) };
          }
          return player;
        });
        localStorage.setItem("players", JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    } catch (error) {
      setError(String(error));
    }
  };

  const handleButtonClick = (value: string) => {
    setError("");
    if (value === "=") {
      updateMoney();
    } else {
      const isOp = value === "+" || value === "-";
      if (value === "C") {
        setDisplay(String(getPlayer()?.curMoney || 0));
      } else if (isOp) {
        if (!curOp) {
          setCurOp(value);
          setDisplay((prev) => prev + value);
        }
      } else {
        setDisplay((prev) => prev + value);
      }
    }
  };

  const PlayerOrder = () => {
    return (
      <Card>
        <CardHeader>Player order</CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {players.map((player, index) => (
              <Button key={index} variant="secondary" className="p-4 text-sm">
                {player.name} {player.curMoney}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const MyMoney = () => {
    return (
      <Card className="max-w-full mx-auto p-4">
        <CardHeader className="bg-black rounded-lg p-4 text-right text-4xl font-bold text-white">
          {error ? error : display}
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn, index) => (
              <Button
                key={index}
                variant={
                  ["-", "+", "="].includes(btn) ? "destructive" : "secondary"
                }
                className={`p-4 text-xl ${btn === "=" ? "row-span-2" : ""} ${
                  btn === "0" ? "col-span-2" : ""
                }`}
                onClick={() => handleButtonClick(btn)}
              >
                {btn === "-" ? (
                  <MinusIcon className="h-5 w-5" />
                ) : btn === "+" ? (
                  <PlusIcon className="h-5 w-5" />
                ) : (
                  btn
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <PlayerOrder />
      <MyMoney />
    </>
  );
};

export default BrassGameTracker;
