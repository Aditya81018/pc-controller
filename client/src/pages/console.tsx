import Page from "@/components/layout/page";
import { Button, type ButtonProps } from "@/components/ui/button";
import Keymaps from "@/keymaps.json";
import { cn } from "@/lib/utils";
import { getWebSocket } from "@/lib/websocket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Command,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Column from "@/components/layout/column";
import Row from "@/components/layout/row";
import Keys from "@/assets/keys.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Key({
  keyId,
  className,
  children,
  ...props
}: ButtonProps & { keyId: string | string[] | undefined }) {
  const ws = getWebSocket();

  function convertKeys(input: string): string {
    const parts = input.trim().split(/\s+/); // Split by whitespace
    const result: string[] = [];
    for (const part of parts) {
      const [key, state] = part.split(":");
      // @ts-ignore
      const keyCode = Keys[key.toUpperCase()];
      if (keyCode === undefined) {
        throw new Error(`Unknown key: ${key}`);
      }
      result.push(`${keyCode}:${state}`);
    }
    return result.join(" ");
  }

  return (
    <Button
      className={cn(
        keyId === undefined ? "invisible pointer-events-none" : "",
        className
      )}
      {...props}
      onTouchStart={() => {
        if (typeof keyId === "string")
          ws?.send(`$ ydotool key ${convertKeys(keyId + ":1")}`);
        else
          ws?.send(
            `$ ydotool key ${keyId
              ?.map((id) => convertKeys(id + ":1"))
              .join(" ")}`
          );
      }}
      onTouchEnd={() => {
        if (typeof keyId === "string")
          ws?.send(`$ ydotool key ${convertKeys(keyId + ":0")}`);
        else
          ws?.send(
            `$ ydotool key ${keyId
              ?.map((id) => convertKeys(id + ":0"))
              .join(" ")}`
          );
      }}
    >
      {children}
      <div className="text-[0.5rem] opacity-50 fixed translate-y-4">
        {typeof keyId === "string" ? keyId : keyId?.join(" ")}
      </div>
    </Button>
  );
}

function HotKey({
  keyId,
  className,
  children,
  ...props
}: ButtonProps & { keyId: string | undefined }) {
  const ws = getWebSocket();

  function convertKeys(input: string): string {
    const parts = input.trim().split(/\s+/); // Split by whitespace
    const result: string[] = [];
    for (const part of parts) {
      const [key, state] = part.split(":");
      // @ts-ignore
      const keyCode = Keys[key.toUpperCase()];
      if (keyCode === undefined) {
        throw new Error(`Unknown key: ${key}`);
      }
      result.push(`${keyCode}:${state}`);
    }
    return result.join(" ");
  }

  return (
    <Button
      className={cn(
        keyId === undefined ? "invisible pointer-events-none" : "w-full",
        className
      )}
      variant={"outline"}
      {...props}
      onClick={() => {
        ws?.send(
          `$ ydotool key ${convertKeys(keyId + ":1")} ${convertKeys(
            keyId + ":0"
          )}`
        );
      }}
    >
      {children}
      <div className="text-[0.5rem] opacity-50 absolute translate-y-2 right-4">
        {keyId}
      </div>
    </Button>
  );
}

export default function Console() {
  const navigate = useNavigate();
  const ws = getWebSocket();
  const [template, setTemplate] = useState(Keymaps["RetroArch Port 1"]);

  console.log(Keymaps);

  useEffect(() => {
    if (!ws || ws.readyState === ws.CLOSED) {
      navigate("/");
      return;
    }

    ws.onclose = () => {
      navigate("/");
    };
  }, []);

  return (
    <Page className="p-4 gap-4 justify-around items-center">
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
        defaultValue="RetroArch Port 1"
        // @ts-ignore
        onValueChange={(value) => setTemplate(Keymaps[value])}
      >
        <SelectTrigger className="fixed right-8 top-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(Keymaps).map((key) => (
            <SelectItem value={key}>{key}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Row className="w-full justify-around">
        <Key className="w-32 h-12" keyId={template.L1}>
          L1
        </Key>
        <Key className="w-32 h-12" keyId={template.R1}>
          R1
        </Key>
      </Row>

      <Row className="w-full justify-around">
        <Column className="items-center w-fit">
          <Row>
            <Key
              variant={"secondary"}
              keyId={[template.UP, template.LEFT]}
              className="w-20 h-20"
            >
              <ArrowUpLeft />
            </Key>
            <Key className="w-20 h-20" id="UP" keyId={template.UP}>
              <ArrowUp />
            </Key>
            <Key
              variant={"secondary"}
              className="w-20 h-20"
              keyId={[template.UP, template.RIGHT]}
            >
              <ArrowUpRight />
            </Key>
          </Row>
          <Row className="gap-20">
            <Key className="w-20 h-20" keyId={template.LEFT}>
              <ArrowLeft />
            </Key>
            <Key className="w-20 h-20" keyId={template.RIGHT}>
              <ArrowRight />
            </Key>
          </Row>
          <Row>
            <Key
              keyId={[template.DOWN, template.LEFT]}
              className="w-20 h-20"
              variant={"secondary"}
            >
              <ArrowDownLeft />
            </Key>
            <Key className="w-20 h-20" keyId={template.DOWN}>
              <ArrowDown />
            </Key>
            <Key
              keyId={[template.DOWN, template.RIGHT]}
              className="w-20 h-20"
              variant={"secondary"}
            >
              <ArrowDownRight />
            </Key>
          </Row>
        </Column>

        <Column className="items-center w-fit">
          <Key className="w-20 h-20" keyId={template.X}>
            X
          </Key>
          <Row className="gap-20">
            <Key className="w-20 h-20" keyId={template.Y}>
              Y
            </Key>
            <Key className="w-20 h-20" keyId={template.A}>
              A
            </Key>
          </Row>
          <Key className="w-20 h-20" keyId={template.B}>
            B
          </Key>
        </Column>
      </Row>

      <Row className="w-full justify-center gap-4">
        <Key className="w-32 h-12" keyId={template.SELECT}>
          Select
        </Key>
        <Key className="w-32 h-12" keyId={template.START}>
          Start
        </Key>
        <Key className="w-32 h-12" keyId={template.BACK}>
          BACK
        </Key>
      </Row>

      <DropdownMenu>
        <DropdownMenuTrigger className="fixed bottom-4 right-4">
          <Command />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {template.HOTKEYS &&
            Object.keys(template.HOTKEYS).map((key) => (
              <DropdownMenuItem>
                {/* @ts-ignore */}
                <HotKey keyId={template.HOTKEYS[key]}>{key}</HotKey>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Page>
  );
}
