import asyncio
import websockets
import socket
import subprocess

connected_clients = set()
ORIGIN = "0.0.0.0"
PORT = 8765

hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)


async def handler(websocket):
    connected_clients.add(websocket)
    print(f"Client connected: {websocket.remote_address[0]}")
    try:
        async for message in websocket:
            print(f"Received [{websocket.remote_address[0]}]: {message}")
            args = message.split(" ")
            try:
                if args[0] == "$" and ["ydotool"].index(args[1]) != 1:
                    args.pop(0)

                    i = 0
                    for arg in args:
                        args[i] = arg.replace("%57%", " ")
                        i += 1

                    subprocess.run(args)
            except:
                await websocket.send("Error: Invalid Command")
    finally:
        print(f"Client disconnected: {websocket.remote_address[0]}")
        connected_clients.remove(websocket)


async def main():
    async with websockets.serve(handler, ORIGIN, PORT):
        print(f"WebSocket server started on ws://{local_ip}:{PORT}")
        await asyncio.Future()  # run forever


asyncio.run(main())
