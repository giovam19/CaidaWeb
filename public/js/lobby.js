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

var exitButton1 = document.getElementById('exitB1');
exitButton1.style.display = 'none';

exitButton1.addEventListener('click', function(event) {
    var mesa = previousButton.getAttribute('mesa');
    var team = previousButton.getAttribute('team');
    var pos = previousButton.getAttribute('pos');
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch('/room', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code == 400) {
                console.error('Error al salir de mesa: ', data.message);
                return;
            }


            if (previousButton) {
                previousButton.innerHTML = outButtonInner;
                previousButton.classList.remove(inButtonClass);
                previousButton.classList.add(outButtonClass);
                previousButton = null;

                exitButton1.style.display = 'none';

                socket.emit('update-room', { mesa: mesa, team: team, pos: pos, state: 'out', name: user});
            }
        });
});

var botonesIngresaR1 = document.getElementById('room1');

botonesIngresaR1.addEventListener('click', function(event) {
    if (event.target.classList.contains('noplayer')) {
        var mesa = event.target.getAttribute('mesa');
        var team = event.target.getAttribute('team');
        var pos = event.target.getAttribute('pos');

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesa: mesa, team: team, pos: pos})
        };

        fetch('/room', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.code == 400) {
                    console.error('Error al ingresar a mesa: ', data.message);
                    return;
                }

                if (previousButton) {
                    previousButton.innerHTML = outButtonInner;
                    previousButton.classList.remove(inButtonClass);
                    previousButton.classList.add(outButtonClass);
                }

                previousButton = event.target;
                event.target.innerHTML = inButtonInner;
                event.target.classList.remove(outButtonClass);
                event.target.classList.add(inButtonClass);
                exitButton1.style.display = '';
                exitButton2.style.display = 'none';

                socket.emit('update-room', { mesa: mesa, team: team, pos: pos, state: 'in', name: user});

                console.log('Ingreso a mesa exitoso: ', data.message);
            });
    }
});

var exitButton2 = document.getElementById('exitB2');
exitButton2.style.display = 'none';

exitButton2.addEventListener('click', function(event) {
    var mesa = previousButton.getAttribute('mesa');
    var team = previousButton.getAttribute('team');
    var pos = previousButton.getAttribute('pos');
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch('/room', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code == 400) {
                console.error('Error al salir de mesa: ', data.message);
                return;
            }

            if (previousButton) {
                previousButton.innerHTML = outButtonInner;
                previousButton.classList.remove(inButtonClass);
                previousButton.classList.add(outButtonClass);
                previousButton = null;

                exitButton2.style.display = 'none';

                socket.emit('update-room', { mesa: mesa, team: team, pos: pos, state: 'out', name: user});
            }
        });
});

var botonesIngresaR2 = document.getElementById('room2');

botonesIngresaR2.addEventListener('click', function(event) {
    if (event.target.classList.contains('noplayer')) {
        var mesa = event.target.getAttribute('mesa');
        var team = event.target.getAttribute('team');
        var pos = event.target.getAttribute('pos');

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesa: mesa, team: team, pos: pos})
        };

        fetch('/room', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.code == 400) {
                    console.error('Error al ingresar a mesa: ', data.message);
                    return;
                }

                if (previousButton) {
                    previousButton.innerHTML = outButtonInner;
                    previousButton.classList.remove(inButtonClass);
                    previousButton.classList.add(outButtonClass);
                }

                previousButton = event.target;
                event.target.innerHTML = inButtonInner;
                event.target.classList.remove(outButtonClass);
                event.target.classList.add(inButtonClass);
                exitButton2.style.display = '';
                exitButton1.style.display = 'none';

                socket.emit('update-room', { mesa: mesa, team: team, pos: pos, state: 'in', name: user});

                console.log('Ingreso a mesa exitoso: ', data.message);
            });
    }
});

function setButtonState(button, state, name) {
    if (state == 'in') {
        button.innerHTML = inButtonInnerC + name;
        button.classList.remove(outButtonClass);
        button.classList.add(inButtonClass);
        if (name == user)
            controlInit(button);
    } else {
        button.innerHTML = outButtonInner;
        button.classList.remove(inButtonClass);
        button.classList.add(outButtonClass);
    }
}

function controlInit(button) {
    if (init) {
        var mesa = button.getAttribute('mesa');
        previousButton = button;
        if (mesa == '1') {
            exitButton1.style.display = '';
        } else {
            exitButton2.style.display = '';
        }
    }
}

//Sockets
socket.on('rooms', (tables) => {
    console.log('rooms: ', tables);
    var room1 = tables[1];
    var room2 = tables[2];

    room1.team1.forEach(player => {
        var button = document.getElementById(`r1p${player.position}`);
        setButtonState(button, 'in', player.name);
    });

    room1.team2.forEach(player => {
        var button = document.getElementById(`r1p${player.position}`);
        setButtonState(button, 'in', player.name);
    });

    room2.team1.forEach(player => {
        var button = document.getElementById(`r2p${player.position}`);
        setButtonState(button, 'in', player.name);
    });

    room2.team2.forEach(player => {
        var button = document.getElementById(`r2p${player.position}`);
        setButtonState(button, 'in', player.name);
    });
});

socket.on('update-room', (data) => {
    var mesa = data.mesa;
    var team = data.team;
    var pos = data.pos;
    var state = data.state;
    var name = data.name;

    var button = document.getElementById(`r${mesa}p${pos}`);
    setButtonState(button, state, name);
});
