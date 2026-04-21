import { Server } from "socket.io";
import { CustomSocket } from "../helper";
import LogManager from "../services/Logs"
import Mutex from "../services/Mutex";
import LobbyController from "../controllers/LobbyController";
import SeatDTO from "../../shared/DTO/SeatDTO";
import UserDTO from "../../shared/DTO/UserDTO";
import Table from "../models/Table";
import { BasicResponse, GameData } from "../../shared/DTO/ResponseDTO";
import GameController from "../controllers/GameController";
import Player from "../models/Player";

const logic = async (io: Server, socket: CustomSocket, mutex: Mutex, lobbyController: LobbyController, gameController: GameController) => {
    const addToTable = async (seat: SeatDTO) => {
        await mutex.lock();

        try {
            var inserted = lobbyController.RegisterPlayerInTable(socket.user as UserDTO, socket.actualSeat as SeatDTO, seat);
            var gameData: GameData|null = null;

            if (inserted.code == 200) {
                var table = lobbyController.GetTableById(seat.table)!;

                if (table.GetGameId() == null && table.IsTableFull()) {
                    const players = lobbyController.GetPlayersByTable(table.GetId()) as Player[];
                    var gameId = gameController.RegisterNewGame(table.GetId(), players);
                    table.SetGameId(gameId);
                    gameData = {
                        tableId: table.GetId(),
                        gameId
                    };
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                LogManager.printError(error.message);
            } else {
                LogManager.printError("Unknown error - AddToTable");
            }
            return;
        } finally {
            mutex.unlock();
        }

        if (inserted.code == 200) {
            LogManager.printLog(inserted.message);
            socket.actualSeat = seat;
            socket.join(`table_${socket.actualSeat.table}`);
            io.emit('render-lobby', lobbyController.GetTables());

            if (gameData != null) {
                LogManager.printInfo(`Iniciando partida ${gameData.gameId} para mesa ${gameData.tableId}`);
                io.to(`table_${gameData.tableId}`).emit('game-start', gameData);
            }
        } else {
            LogManager.printError(inserted.message);
            socket.emit('error-found', inserted);
        }
    }

    const removeFromTable = async () => {
        if (socket.actualSeat == null) {
            const error = {code: 400, message: `Error removing player ${socket.user!.username}: actual seat not found.`} as BasicResponse;
            LogManager.printError(error.message);
            socket.emit('error-found', error);
            return;
        }

        await mutex.lock();

        try {
            var removed = lobbyController.RemovePlayerFromTable(socket.user!, socket.actualSeat);
        } catch (error) {
            if (error instanceof Error) {
                LogManager.printError(error.message);
            } else {
                LogManager.printError("Unknown error - RemoveFromTable");
            }
            return;
        } finally {
            mutex.unlock();
        }

        if (removed.code == 200) {
            LogManager.printLog(removed.message);
            socket.leave(`table_${socket.actualSeat.table}`);
            socket.actualSeat = null;
            io.emit('render-lobby', lobbyController.GetTables());
        } else {
            LogManager.printError(removed.message);
            socket.emit('error-found', removed);
        }
    }

    socket.on('add-to-table', addToTable);
    socket.on('remove-from-table', removeFromTable);
}

const disconnect = async (io: Server, socket: CustomSocket, mutex: Mutex, lobbyController: LobbyController) => {
    if (socket.actualSeat != null) {
        await mutex.lock();

        try {
            var removed = lobbyController.RemovePlayerFromTable(socket.user!, socket.actualSeat);
        } catch (error) {
            if (error instanceof Error) {
                LogManager.printError(error.message);
            } else {
                LogManager.printError("Unknown error - disconnect");
            }
            return;
        } finally {
            mutex.unlock();
        }
        
        LogManager.printLog(removed.message);
        io.emit('render-lobby', lobbyController.GetTables());
    }
}

export = {
    logic,
    disconnect
}