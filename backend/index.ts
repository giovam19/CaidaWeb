import express from "express";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import dotenv from "dotenv"

import Mutex from './services/Mutex'
import Users from './services/Users'
import LogManager from './services/Logs'
import { AuthRequest, validateJWT } from './middleware/Auth'
import { CustomSocket } from "./helper";
import { AuthResponse, JWTResponse } from "../shared/DTO/ResponseDTO";
import LobbyController from './controllers/LobbyController'
import GameController from './controllers/GameController'
import LobbySockets from './sockets/lobby'
import UserDTO from "../shared/DTO/UserDTO";

const mutex = new Mutex();
const lobbyController = new LobbyController();
const gameController = new GameController();
const PORT = 3001; // Puerto
const app = express();

const servidor = http.createServer(app);
const io = new Server(servidor, {
    cors: {
        origin: "*"
    }
});

dotenv.config()

app.use(cors({
    origin: "*"
}));

//inicializacion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Metodos HTTP
//-------------------------------- GET --------------------------------//
app.get('/me', validateJWT, function(req: AuthRequest, res) {
    res.status(200).json({ token: true, message: "Valid token", user: req.user } as JWTResponse);
});

//-------------------------------- POST --------------------------------//
app.post('/auth', async function (req, res) {
    const { email, password } = req.body;
    var data = await Users.loggin(email, password);

    if (data.isError) {
        let token = "null";
        return res.status(400).json({ token, data } as AuthResponse);
    }

    const user = data.user as UserDTO;
    const token = jwt.sign(
        user,
        process.env.JWT_KEY as string,
        { expiresIn: "24h" }
    );

    res.status(200).json({ token, data } as AuthResponse);
});

app.post('/register', async function (req, res) {
    const { name, username, email, password } = req.body;
    var data = await Users.register(email, name, username, password);

    if (data.isError) {
        res.status(400).json(data);
    } else {
        res.status(200).json(data);
    }
});

app.post('/checkGame', function (req, res) {
    const params = req.body;
    var game = gameController.CheckGameId(params.id, params.gameId);

    if (game) {
        res.status(200).json(game);
    } else {
        res.status(400).json(null);
    }
});

app.post('/logout', async function(req, res) {
    //por ver
});

//-------------------------------- PUT --------------------------------//


//-------------------------------- DELETE --------------------------------//


//-------------------------------- SOCKETS --------------------------------//
io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token as string;

    if (!token) {
        return next(new Error("No token"));
    }

    try {
        const user = jwt.verify(token, process.env.JWT_KEY as string) as UserDTO;
        socket.user = user;
        socket.actualSeat = null;
        LogManager.printInfo(`Socket user ${socket.user.username} connected`);
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on('connection', async (socket: CustomSocket) => {
    socket.emit('render-lobby', lobbyController.GetTables());

    await LobbySockets.logic(io, socket, mutex, lobbyController, gameController);

    socket.on('disconnecting', async () => {
        await LobbySockets.disconnect(io, socket, mutex, lobbyController);
        LogManager.printInfo(`Socket user ${socket.user!.username} disconnected`);
    });
});

//-------------------------------- INIT --------------------------------//
servidor.listen(PORT, "0.0.0.0", () => {
    LogManager.printInfo(`Servidor escuchando en el puerto ${PORT}`);
});
