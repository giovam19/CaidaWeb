import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { common } from "./common.js";

var globalUser = {};
const result = await common.sendRequest("GET", "/me", null, true);

if (!result.token) {
    localStorage.removeItem("token");
    window.location.href = "/";        
} else {
    globalUser = result.user;
    document.getElementById('username').innerText = result.user.username;
}

const socket = io(common.BACK_URL_BASE, {
    auth: {
        token: localStorage.getItem("token")
    }
});

function setButtonAsPlayer(username, button) {
    var inButtonClass = 'isplayer';
    var inButtonInner = `<img src="res/img/serie/user_profile.png" alt="user_profile" class="team-player-profile"> ${username}`;
    var outButtonClass = 'noplayer';

    button.innerHTML = inButtonInner;
    button.classList.remove(outButtonClass);
    button.classList.add(inButtonClass);
}

function setButtonAsAvailable(button) {
    var outButtonInner = 'Ingresar';
    var outButtonClass = 'noplayer';
    var inButtonClass = 'isplayer';

    button.innerHTML = outButtonInner;
    button.classList.remove(inButtonClass);
    button.classList.add(outButtonClass);
}

function showExitButton(mesa) {
    document.getElementById(`exitB${mesa}`).style.display = '';
}

function hideExitButton(mesa) {
    document.getElementById(`exitB${mesa}`).style.display = 'none';
}

function renderLobby(rooms) {
    var userTable = 0;
    
    rooms.forEach(room => {
        hideExitButton(room.id);

        room.teams.forEach(team => {
            var count = 0;
            team.players.forEach(player => {
                count++;
                if (player.position != 0) {
                    var button = document.getElementById(`r${room.id}t${team.id}p${player.position}`);
                    setButtonAsPlayer(player.username, button);
                    if (player.username == globalUser.username && player.id == globalUser.id) {
                        userTable = room.id;
                    }
                } else {
                    if (team.id == 1) {
                        var button = document.getElementById(`r${room.id}t${team.id}p${count}`);
                        setButtonAsAvailable(button);
                    } else if (team.id == 2) {
                        var button = document.getElementById(`r${room.id}t${team.id}p${count+2}`);
                        setButtonAsAvailable(button);
                    }
                }
            });
        });
    });

    if (userTable != 0) {
        showExitButton(userTable);
    }
}

//-------------------------------------- Buttons --------------------------------------//
var buttonContainers = document.getElementById('rooms');
buttonContainers.addEventListener('click', function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    if (action == "join") { /* ---- Añade jugador al equipo ---- */
        const seat = {
            table: button.dataset.table,
            team: button.dataset.team,
            pos: button.dataset.pos
        };

        socket.emit('add-to-table', seat);
    }
    
    if (action == "leave") { /* ---- Elimina jugador del equipo ---- */
        socket.emit('remove-from-table');
    }
});

var logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function(event) {
    localStorage.removeItem("token");
    window.location.href = "/";
});

//-------------------------------------- Sockets --------------------------------------//
socket.on('render-lobby', (rooms) => {
    renderLobby(rooms);
});

socket.on('error-found', (error) => {
    console.error("Socket: " + error.message);
});

socket.on('game-start', (gameData) => {
    window.location.href = `/mesa?id=${gameData.tableId}&game=${gameData.gameId}`;
});
