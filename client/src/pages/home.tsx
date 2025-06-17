import Page from "@/components/layout/page";
import Row from "@/components/layout/row";
import H3 from "@/components/typography/h3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { connectWebSocket, getWebSocket } from "@/lib/websocket";
import { Label } from "@radix-ui/react-dropdown-menu";
import { LoaderCircle, PlusIcon, Power, PowerOff, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(getWebSocket());

  const [wsUrl, setWsUrl] = useState("ws://192.168.155.64:8765");
  const [isWsConnected, setIsWsConnected] = useState<boolean | null>(
    ws.current !== null && ws.current.readyState === ws.current.OPEN
  );
  const [message, setMessage] = useState("");

  function handleConnectWebsocket() {
    if (isWsConnected === false) {
      connectWebSocket(wsUrl);
      ws.current = getWebSocket();
      setIsWsConnected(null);
      if (ws.current) {
        ws.current.onopen = () => {
          setIsWsConnected(true);
          toast("Connected");
        };
        ws.current.onmessage = (msg) => {
          toast("Received: " + msg.data);
        };
        ws.current.onerror = () => {
          setIsWsConnected(false);
          toast(`Error`);
        };
        ws.current.onclose = (event) => {
          setIsWsConnected(false);
          toast(`Closed [${event.code}]`);
          console.log(event);
        };
      }
    } else if (isWsConnected === true && ws.current) {
      ws.current.onclose = (event) => {
        setIsWsConnected(false);
        toast(`Closed [${event.code}]`);
        console.log(event);
      };
      ws.current?.close();
    }
  }

  function handleSendMessage() {
    if (!ws.current) {
      toast("Failed to send message");
      return;
    }
    ws.current.send(message);
    toast("Sent: " + message);
  }

  return (
    <Page className="p-4">
      <H3>PC Controller</H3>

      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          placeholder="ws://your-url:port"
          value={wsUrl}
          onChange={(event) => setWsUrl(event.target.value)}
          disabled={isWsConnected === true || isWsConnected === null}
        />
        <Button
          disabled={isWsConnected === null}
          type="submit"
          variant="outline"
          size={"icon"}
          onClick={handleConnectWebsocket}
        >
          {isWsConnected === false ? (
            <Power />
          ) : isWsConnected === null ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <PowerOff />
          )}
        </Button>
      </div>

      <div>
        <Label>Command</Label>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            type="text"
            placeholder="command..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isWsConnected !== true}
          />
          <Button
            type="submit"
            variant="outline"
            size={"icon"}
            disabled={isWsConnected !== true}
            onClick={handleSendMessage}
          >
            <Send />
          </Button>
        </div>
      </div>

      <Row
        className={`${
          !isWsConnected && "pointer-events-none opacity-75"
        } gap-2`}
      >
        <Link to="/pc-control">
          <Button>PC Control</Button>
        </Link>
        <Button
          onClick={() => {
            document.body.requestFullscreen();
            // @ts-ignore
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation
                // @ts-ignore
                .lock("landscape")
                .then(() => {
                  navigate("/game-control");
                })
                .catch(() => {
                  navigate("/game-control");
                });
            }
          }}
        >
          Game Control
        </Button>

        <Button
          onClick={() => {
            document.body.requestFullscreen();
            // @ts-ignore
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation
                // @ts-ignore
                .lock("landscape")
                .then(() => {
                  navigate("/console");
                })
                .catch(() => {
                  navigate("/console");
                });
            }
          }}
        >
          Console
        </Button>
      </Row>

      <Button size={"floating"}>
        <PlusIcon />
      </Button>
      <Toaster />
    </Page>
  );
}
