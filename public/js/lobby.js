import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

var user = document.getElementById('username').innerHTML;
var previousButton = null;

var socket = io();

function setButtonAsPlayer(username, button) {
    var inButtonClass = 'isplayer';
    var inButtonInner = `<img src="res/img/serie/user_profile.png" alt="user_profile" class="team-player-profile"> ${username}`;
    var outButtonClass = 'noplayer';

    button.innerHTML = inButtonInner;
    button.classList.remove(outButtonClass);
    button.classList.add(inButtonClass);
}

function setButtonAsAvailable(button) {
    var outButtonInner = `Ingresar`;
    var outButtonClass = 'noplayer';
    var inButtonClass = 'isplayer';

    button.innerHTML = outButtonInner;
    button.classList.remove(inButtonClass);
    button.classList.add(outButtonClass);
}

function showExitButton(mesa) {
    document.getElementById('exitB'+mesa).style.display = '';
}

function hideExitButton(mesa) {
    document.getElementById('exitB'+mesa).style.display = 'none';
}

//-------------------------------------- Buttons --------------------------------------//
var buttonContainers = document.getElementById('rooms');
buttonContainers.addEventListener('click', function(event) {

    /* --------------------- Añade jugador al equipo --------------------- */
    if (event.target.classList.contains('noplayer')) {
        var prevData = null
        var newData = {
            table: event.target.getAttribute('mesa'),
            team: event.target.getAttribute('team'),
            pos: event.target.getAttribute('pos'),
            id: event.target.getAttribute('id')
        }
    
        if (previousButton) {
            prevData = {
                table: previousButton.getAttribute('mesa'),
                team: previousButton.getAttribute('team'),
                pos: previousButton.getAttribute('pos'),
                id: previousButton.getAttribute('id')
            };
        }
    
        socket.emit('add-to-table', newData, prevData)
    }

    /* --------------------- Elimina jugador del equipo --------------------- */
    if (event.target.classList.contains('exit-room-b')) {
        var prevData = {
            table: previousButton.getAttribute('mesa'),
            team: previousButton.getAttribute('team'),
            pos: previousButton.getAttribute('pos')
        };

        socket.emit('remove-from-table', prevData)
    }
});

var logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function(event) {
    var prevData = null;

    if (previousButton) {
        prevData = {
            table: previousButton.getAttribute('mesa'),
            team: previousButton.getAttribute('team'),
            pos: previousButton.getAttribute('pos')
        };
    }
    
    sendRequest('POST', '/logout', { data: prevData }, (data) => {
        if (data.code == 400) {
            console.error('Error al cerrar sesión: ', data.message);
            return;
        }

        if (previousButton) {
            socket.emit('update-room', { data: prevData, state: 'out', name: user});
        }

        console.log('Sesión cerrada: ', data.message);

        window.location.href = "/";
    });
});

function sendRequest(method, url, data, callback) {
    const requestOptionsBody = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (method == 'GET') {
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => callback(data));
    } else {
        fetch(url, requestOptionsBody)
            .then(response => response.json())
            .then(data => callback(data));
    }
}

//-------------------------------------- Sockets --------------------------------------//
socket.on('load-rooms', (rooms) => {
    rooms.forEach(room => {
        room.teams.forEach(team => {
            team.players.forEach(player => {
                if (player.id != "") {
                    var button = document.getElementById(`r${room.id}p${player.position}`);
                    setButtonAsPlayer(player.name, button);
                    if (player.name == user) {
                        showExitButton(room.id);
                    }
                }
            });
        });
    });
});

socket.on('add-to-table', (res, newData, prevData) => {
    if (res.code == 400) {
        console.error('Error al ingresar a mesa: ', data.message);
        return;
    }

    if (previousButton) {
        setButtonAsAvailable(previousButton);
        hideExitButton(prevData.table);

        socket.emit('update-room', { data: prevData, state: 'out', name: user});
    }

    var target = document.getElementById(newData.id)
    previousButton = target;
    setButtonAsPlayer(user, target);
    showExitButton(newData.table);

    socket.emit('update-room', { data: newData, state: 'in', name: user});
    socket.emit('init-game', newData);

    console.log('Ingreso a mesa exitoso: ', res.message);
});

socket.on('remove-from-table', (res, prevData) => {
    if (res.code == 400) {
        console.error('Error al salir de mesa: ', res.message);
        return;
    }

    if (previousButton) {
        setButtonAsAvailable(previousButton);
        hideExitButton(prevData.table);
        previousButton = null;

        socket.emit('update-room', { data: prevData, state: 'out', name: user});

        console.log("Salida de mesa exitosa: " + res.message)
    }
});

socket.on('update-room', (data) => {
    var mesa = data.data.table;
    var team = data.data.team;
    var pos = data.data.pos;
    var state = data.state;
    var name = data.name;

    var button = document.getElementById(`r${mesa}p${pos}`);
    if (state == 'in') {
        setButtonAsPlayer(name, button);
    } else {
        setButtonAsAvailable(button);
    }

    console.log('mesa: ', mesa, ' actualizada.');
});

socket.on('init-game', (roomID, players) => {
    console.log('init-game: socket');
    console.log(roomID);
    console.log(players);
    var player = players.find(player => player.name == user);
    if (player.name == user) {
        window.location.href = '/mesa/'+roomID;
    }
});
