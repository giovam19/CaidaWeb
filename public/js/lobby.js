import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

var user = document.getElementById('username').innerHTML;

var inButtonClass = 'isplayer';
var inButtonInner = `<img src="res/img/serie/user_profile.png" alt="user_profile" class="team-player-profile"> ${user}`;
var inButtonInnerC = '<img src="res/img/serie/user_profile.png" alt="user_profile" class="team-player-profile"> ';

var outButtonClass = 'noplayer';
var outButtonInner = `Ingresar`;

let socket = io({
    auth: {
        user: user
    }
});

var previousButton = null;
var init = true;

var buttonContainers = document.getElementById('rooms');
buttonContainers.addEventListener('click', function(event) {
    if (event.target.classList.contains('noplayer')) { // Añade jugador al equipo
        var regData = {
            table: event.target.getAttribute('mesa'),
            team: event.target.getAttribute('team'),
            pos: event.target.getAttribute('pos')
        };

        var prevData = null;

        if (previousButton) {
            prevData = {
                table: previousButton.getAttribute('mesa'),
                team: previousButton.getAttribute('team'),
                pos: previousButton.getAttribute('pos')
            };
        }

        var exitButton = document.getElementById('exitB'+regData.table);

        sendRequest('PUT', '/room', { regData: regData, prevData: prevData }, (data) => {
            if (data.code == 400) {
                console.error('Error al ingresar a mesa: ', data.message);
                return;
            }

            if (previousButton) {
                previousButton.innerHTML = outButtonInner;
                previousButton.classList.remove(inButtonClass);
                previousButton.classList.add(outButtonClass);

                document.getElementById('exitB'+prevData.table).style.display = 'none';

                socket.emit('update-room', { data: prevData, state: 'out', name: user});
            }

            previousButton = event.target;
            event.target.innerHTML = inButtonInner;
            event.target.classList.remove(outButtonClass);
            event.target.classList.add(inButtonClass);
            exitButton.style.display = '';
            console.log('exitButton: ', exitButton);

            socket.emit('update-room', { data: regData, state: 'in', name: user});

            console.log('Ingreso a mesa exitoso: ', data.message);
        });
    }

    if (event.target.classList.contains('exit-room-b')) { // Elimina jugador del equipo
        var prevData = {
            table: previousButton.getAttribute('mesa'),
            team: previousButton.getAttribute('team'),
            pos: previousButton.getAttribute('pos')
        };

        var exitButton = document.getElementById('exitB'+prevData.table);
        
        sendRequest('DELETE', '/room', prevData, (data) => {
            if (data.code == 400) {
                console.error('Error al salir de mesa: ', data.message);
                return;
            }

            if (previousButton) {
                previousButton.innerHTML = outButtonInner;
                previousButton.classList.remove(inButtonClass);
                previousButton.classList.add(outButtonClass);
                previousButton = null;
                exitButton.style.display = 'none';

                socket.emit('update-room', { data: prevData, state: 'out', name: user});
            }
        });
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

        window.location.href = "/";
        console.log('Sesión cerrada: ', data.message);
    });
});

function sendRequest(method, url, data, callback) {
    const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => callback(data));
}

function setButtonState(button, state, name) {
    if (state == 'in') {
        button.innerHTML = inButtonInnerC + name;
        button.classList.remove(outButtonClass);
        button.classList.add(inButtonClass);
        if (name == user && init) {
            var mesa = button.getAttribute('mesa');
            document.getElementById('exitB'+mesa).style.display = '';
            previousButton = button;
            init = false;
        }
    } else {
        button.innerHTML = outButtonInner;
        button.classList.remove(inButtonClass);
        button.classList.add(outButtonClass);
    }
}

//-------------------------------------- Sockets --------------------------------------//
socket.on('rooms', (rooms) => {
    console.log('rooms: ', rooms);

    rooms.forEach(room => {
        room.teams.forEach(team => {
            team.players.forEach(player => {
                if (player.id != "") {
                    var button = document.getElementById(`r${room.id}p${player.position}`);
                    setButtonState(button, 'in', player.name);
                }
            });
        });
    });
});

socket.on('update-room', (data) => {
    var mesa = data.data.table;
    var team = data.data.team;
    var pos = data.data.pos;
    var state = data.state;
    var name = data.name;

    var button = document.getElementById(`r${mesa}p${pos}`);
    setButtonState(button, state, name);
});
