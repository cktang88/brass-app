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

type Player = { name: string; moneyLog: number[] };

const getLastLog = (player: Player) => {
  return player.moneyLog.length > 0
    ? player.moneyLog[player.moneyLog.length - 1]
    : 0;
};

const curMoney = (player: Player) => {
  const sum = player.moneyLog.reduce((acc, log) => acc + log, 0);
  return sum;
};

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

    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
    const newUsername: string = "f"; //prompt("Username:")!;
    const user = getPlayer();
    if (!user) {
      const newPlayer: Player = {
        name: newUsername,
        moneyLog: [0],
      };
      setPlayers([newPlayer, ...players]);
      localStorage.setItem("players", JSON.stringify([newPlayer, ...players]));
      localStorage.setItem("username", newUsername); // Store the player's name
      setDisplay("0");
    } else {
      // load player
      setDisplay(String(getLastLog(user)));
      setUsername(user.name);
    }
  }, [username]);

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
            return {
              ...player,
              moneyLog: [...player.moneyLog, result - curMoney(player)],
            };
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
        setDisplay(String(curMoney(getPlayer()!)));
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

  return (
    <>
      <PlayerOrder players={players} />
      <MyMoney
        handleClick={handleButtonClick}
        error={error}
        display={display}
      />
    </>
  );
};

const PlayerOrder: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <Card>
      <CardHeader>Player order</CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2">
          {players.map((player, index) => (
            <Card key={index} className="p-4 text-xl w-full">
              <span className="block font-bold">
                {player.name.toUpperCase()}
              </span>
              <span className="block">
                ${curMoney(player)}{" "}
                <span
                  style={{
                    color:
                      getLastLog(player) === 0
                        ? "black"
                        : getLastLog(player) < 0
                        ? "red"
                        : "green",
                  }}
                >
                  ({getLastLog(player) > 0 && "+"}
                  {(getLastLog(player) || "").toString().replace("$", "")})
                </span>
              </span>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MyMoney: React.FC<{
  handleClick: (value: string) => void;
  error: string;
  display: string;
}> = ({ handleClick, error, display }) => {
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
              onClick={() => handleClick(btn)}
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

export default BrassGameTracker;
