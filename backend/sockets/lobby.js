const LogManager = require('../services/Logs');

const logic = async (io, socket, mutex, LobbyController, GameController) => {
    const addToTable = async (seat) => {
        await mutex.lock();
        
        try {
            var inserted = LobbyController.RegisterPlayerInTable(socket.user, socket.actualSeat, seat);
            var gameData = null;

            if (inserted.code == 200) {
                var table = LobbyController.GetTableById(seat.table);

                if (!table.game && table.IsTableFull()) {
                    const players = LobbyController.GetPlayersByTable(table.id);
                    var gameId = GameController.RegisterNewGame(table.id, players);
                    table.game = gameId;
                    gameData = {
                        tableId: table.id,
                        gameId
                    };
                }
            }
        } catch (error) {
            LogManager.printError(error);
        } finally {
            mutex.unlock();
        }

        if (inserted.code == 200) {
            LogManager.printLog(inserted.message);
            socket.actualSeat = seat;
            socket.join(`table_${socket.actualSeat.table}`);
            io.emit('render-lobby', LobbyController.GetTables());

            if (gameData) {
                LogManager.printInfo(`Iniciando partida ${gameData.gameId} para mesa ${gameData.tableId}`);
                io.to(`table_${gameData.tableId}`).emit('game-start', gameData);
            }
        } else {
            LogManager.printError(inserted.message);
            socket.emit('error-found', inserted);
        }
    }

    const removeFromTable = async () => {
        if (!socket.actualSeat) {
            const error = {code: 400, message: `Error removing player ${socket.user.username}: actual seat not found.`};
            LogManager.printError(error.message);
            socket.emit('error-found', error);
            return;
        }

        await mutex.lock();

        try {
            var removed = LobbyController.RemovePlayerFromTable(socket.user, socket.actualSeat.team, socket.actualSeat.table, socket.actualSeat.pos);
        } catch (error) {
            LogManager.printError(error);
        } finally {
            mutex.unlock();
        }

        if (removed.code == 200) {
            LogManager.printLog(removed.message);
            socket.leave(`table_${socket.actualSeat.table}`);
            socket.actualSeat = null;
            io.emit('render-lobby', LobbyController.GetTables());
        } else {
            LogManager.printError(removed.message);
            socket.emit('error-found', removed);
        }
    }

    socket.on('add-to-table', addToTable);
    socket.on('remove-from-table', removeFromTable);
}

const disconnect = async (io, socket, mutex, LobbyController) => {
    if (socket.actualSeat) {
        await mutex.lock();

        try {
            var removed = LobbyController.RemovePlayerFromTable(
                socket.user,
                socket.actualSeat.team,
                socket.actualSeat.table,
                socket.actualSeat.pos
            );
        } catch (error) {
            LogManager.printError(error);
        } finally {
            mutex.unlock();
        }
        
        LogManager.printLog(removed.message);
        io.emit('render-lobby', LobbyController.GetTables());
    }
}

module.exports = {
    logic,
    disconnect
}