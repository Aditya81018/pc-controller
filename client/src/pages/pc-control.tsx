import Page from "@/components/layout/page";
import Row from "@/components/layout/row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { getWebSocket } from "@/lib/websocket";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  ArrowBigUp,
  ArrowLeft,
  ChevronUp,
  Clipboard,
  Copy,
  CornerDownLeft,
  Delete,
  Redo2,
  Save,
  Send,
  Undo2,
} from "lucide-react";
import { useEffect, useState, type MouseEvent, type TouchEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function PcControl() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isControlOn, setIsControlOn] = useState(false);
  const [isShiftOn, setIsShiftOn] = useState(false);

  const ws = getWebSocket();
  let mouseX = 0;
  let mouseY = 0;
  let mouseMoveOpen = true;

  useEffect(() => {
    if (!ws || ws.readyState === ws.CLOSED) {
      navigate("/");
      return;
    }

    ws.onclose = () => {
      navigate("/");
    };
  }, []);

  function handleTouchpadMove(event: TouchEvent<HTMLDivElement>) {
    if (mouseMoveOpen) {
      mouseMoveOpen = false;
      setTimeout(() => {
        mouseMoveOpen = true;
      }, 1000 / 24);

      const newMouseX = event.touches[0].clientX;
      const newMouseY = event.touches[0].clientY;

      const dx = (newMouseX - mouseX) * 2.4;
      const dy = (newMouseY - mouseY) * 2.4;

      ws?.send(`$ ydotool mousemove -x ${dx} -y ${dy}`);

      mouseX = newMouseX;
      mouseY = newMouseY;
    }
  }

  function handleTouchpadClick(event: MouseEvent<HTMLDivElement>) {
    const newMouseX = event.clientX;
    // const newMouseY = event.clientY;
    const targetRect = event.currentTarget.getBoundingClientRect();
    const unit = targetRect.width / 6;

    if (newMouseX < 5 * unit + targetRect.x) {
      ws?.send("$ ydotool click 0xC0");
    } else {
      ws?.send("$ ydotool click 0xC1");
    }
  }

  return (
    <Page className="p-4 gap-4 justify-end">
      <Link to="/">
        <Button size={"icon"} variant={"ghost"} className="fixed top-4 left-4">
          <ArrowLeft />
        </Button>
      </Link>
      <AspectRatio ratio={3 / 2}>
        <div
          className="bg-dotted w-full h-full rounded-md"
          onTouchStart={(event) => {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
          }}
          onTouchMove={handleTouchpadMove}
          onClick={handleTouchpadClick}
        ></div>
      </AspectRatio>
      <Row className="justify-between">
        <Toggle
          variant={"outline"}
          onClick={() => {
            if (isControlOn) ws?.send("$ ydotool key 29:0");
            else ws?.send("$ ydotool key 29:1");
            setIsControlOn(!isControlOn);
          }}
        >
          <ChevronUp />
        </Toggle>
        <Toggle
          variant={"outline"}
          onClick={() => {
            if (isShiftOn) ws?.send("$ ydotool key 54:0");
            else ws?.send("$ ydotool key 54:1");
            setIsShiftOn(!isShiftOn);
          }}
        >
          <ArrowBigUp />
        </Toggle>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 29:1 31:1 31:0 29:0")}
        >
          <Save />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 29:1 46:1 46:0 29:0")}
        >
          <Copy />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 29:1 47:1 47:0 29:0")}
        >
          <Clipboard />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 29:1 44:1 44:0 29:0")}
        >
          <Undo2 />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 29:1 21:1 21:0 29:0")}
        >
          <Redo2 />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 14:1 14:0")}
        >
          <Delete />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => ws?.send("$ ydotool key 28:1 28:0")}
        >
          <CornerDownLeft />
        </Button>
      </Row>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          placeholder="command..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          type="submit"
          variant="outline"
          size={"icon"}
          onClick={() => {
            // @ts-ignore
            ws?.send(`$ ydotool type ${text.replaceAll(" ", "%57%")}`),
              setText("");
          }}
        >
          <Send />
        </Button>
      </div>
    </Page>
  );
}
