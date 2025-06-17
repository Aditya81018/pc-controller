import Page from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { getWebSocket } from "@/lib/websocket";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Dot,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GameControl() {
  const navigate = useNavigate();
  const ws = getWebSocket();
  const [template, setTemplate] = useState("17 30 31 32 21 45 47 48");
  let activeLeftKey = "stop";

  const config = {
    up: 0,
    left: 0,
    down: 0,
    right: 0,
    a: 0,
    b: 0,
    x: 0,
    y: 0,
  };

  useEffect(() => {
    if (!ws || ws.readyState === ws.CLOSED) {
      navigate("/");
      return;
    }

    ws.onclose = () => {
      navigate("/");
    };
  }, []);

  useEffect(() => {
    setConfig(template);
  }, [template]);

  function setConfig(template: string) {
    const args = template.split(" ");
    config.up = Number(args[0]);
    config.left = Number(args[1]);
    config.down = Number(args[2]);
    config.right = Number(args[3]);
    config.y = Number(args[4]);
    config.x = Number(args[5]);
    config.b = Number(args[6]);
    config.a = Number(args[7]);
  }

  return (
    <Page className="p-4 gap-4 flex-row justify-around">
      <Button
        size={"icon"}
        variant={"ghost"}
        className="fixed top-4 left-4"
        onClick={() => {
          document.exitFullscreen();
          // @ts-ignore
          screen.orientation.unlock();
          navigate("/");
        }}
      >
        <ArrowLeft />
      </Button>

      <Select
        defaultValue="17 30 31 32 21 45 47 48"
        onValueChange={(value) => setTemplate(value)}
      >
        <SelectTrigger className="fixed right-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="17 30 31 32 17 31 47 48">WASD - WSVB</SelectItem>
          <SelectItem value="23 36 37 38 23 37 47 48">IJKL - IKVB</SelectItem>
          <SelectItem value="20 33 34 35 20 34 47 48">TFGH - TGVB</SelectItem>
          <SelectItem value="103 105 108 106 103 108 37 38">
            Arrows - KL
          </SelectItem>
        </SelectContent>
      </Select>

      <div
        id="left-controls"
        className="flex flex-col w-full justify-center items-center h-screen"
        onTouchStart={(event) => {
          const key = document.elementFromPoint(
            event.touches[0].clientX,
            event.touches[0].clientY
          )!.id;

          if (key !== "left-controls") {
            let args = key.split("-");
            args.forEach((arg) => {
              if (arg !== "stop" && arg !== "") {
                // @ts-ignore
                ws?.send(`$ ydotool key ${config[arg]}:1`);
                // @ts-ignore
                console.log("opened", args, config[arg]);
              }
            });
          }

          activeLeftKey = key;
        }}
        onTouchMove={(event) => {
          const key = document.elementFromPoint(
            event.touches[0].clientX,
            event.touches[0].clientY
          )!.id;
          if (activeLeftKey !== key && key !== "left-controls") {
            let activeArgs = activeLeftKey.split("-");

            activeArgs.forEach((arg) => {
              if (arg !== "stop") {
                // @ts-ignore
                ws?.send(`$ ydotool key ${config[arg]}:0`);
                // @ts-ignore
                console.log("closed", activeArgs, config[arg]);
              }
            });

            let args = key.split("-");
            args.forEach((arg) => {
              if (arg !== "stop") {
                // @ts-ignore
                ws?.send(`$ ydotool key ${config[arg]}:1`);
                // @ts-ignore
                console.log("opened", args, config[arg]);
              }
            });

            activeLeftKey = key;
          }
        }}
        onTouchEnd={() => {
          let activeArgs = activeLeftKey.split("-");

          activeArgs.forEach((arg) => {
            if (arg !== "") {
              // @ts-ignore
              ws?.send(`$ ydotool key ${config[arg]}:0`);
              // @ts-ignore
              console.log("closed", activeArgs, config[arg]);
            }
          });

          activeLeftKey = "";
        }}
      >
        <div className="flex justify-center items-center">
          <Button size={"key"} id="up-left" variant={"ghost"}>
            <ArrowUpLeft />
          </Button>
          <Button size={"key"} id="up">
            <ArrowUp />
          </Button>
          <Button size={"key"} id="up-right" variant={"ghost"}>
            <ArrowUpRight />
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Button size={"key"} id="left">
            <ArrowLeft />
          </Button>
          <Button size={"key"} id="stop" variant={"ghost"}>
            <Dot />
          </Button>
          <Button size={"key"} id="right">
            <ArrowRight />
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Button size={"key"} id="down-left" variant={"ghost"}>
            <ArrowDownLeft />
          </Button>
          <Button size={"key"} id="down">
            <ArrowDown />
          </Button>
          <Button size={"key"} id="down-right" variant={"ghost"}>
            <ArrowDownRight />
          </Button>
        </div>
      </div>

      <div
        id="right-controls"
        className="flex flex-col w-full justify-center items-center h-screen"
      >
        <Button
          className="rounded-full"
          id="y"
          size={"key"}
          onTouchStart={() => ws?.send(`$ ydotool key ${config.y}:1`)}
          onTouchEnd={() => ws?.send(`$ ydotool key ${config.y}:0`)}
        >
          Y
        </Button>
        <div className="flex justify-center items-center gap-20">
          <Button
            className="rounded-full"
            id="x"
            size={"key"}
            onTouchStart={() => ws?.send(`$ ydotool key ${config.x}:1`)}
            onTouchEnd={() => ws?.send(`$ ydotool key ${config.x}:0`)}
          >
            X
          </Button>
          <Button
            className="rounded-full"
            id="b"
            size={"key"}
            onTouchStart={() => ws?.send(`$ ydotool key ${config.b}:1`)}
            onTouchEnd={() => ws?.send(`$ ydotool key ${config.b}:0`)}
          >
            B
          </Button>
        </div>
        <Button
          className="rounded-full"
          id="a"
          size={"key"}
          onTouchStart={() => ws?.send(`$ ydotool key ${config.a}:1`)}
          onTouchEnd={() => ws?.send(`$ ydotool key ${config.a}:0`)}
        >
          A
        </Button>
      </div>
    </Page>
  );
}
