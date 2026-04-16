import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const path = window.location.pathname;
const id = path.split('/')[2];

let socket = io();

var table_cards = [
    document.getElementById('table_card1'),
    document.getElementById('table_card2'),
    document.getElementById('table_card3'),
    document.getElementById('table_card4'),
    document.getElementById('table_card5'),
    document.getElementById('table_card6'),
    document.getElementById('table_card7'),
    document.getElementById('table_card8'),
    document.getElementById('table_card9'),
    document.getElementById('table_card10'),
];

var p1_cards = [
    document.getElementById('p1_card1'),
    document.getElementById('p1_card2'),
    document.getElementById('p1_card3'),
]
var p2_cards = [
    document.getElementById('p2_card1'),
    document.getElementById('p2_card2'),
    document.getElementById('p2_card3'),
]
var p3_cards = [
    document.getElementById('p3_card1'),
    document.getElementById('p3_card2'),
    document.getElementById('p3_card3'),
]
var p4_cards = [
    document.getElementById('p4_card1'),
    document.getElementById('p4_card2'),
    document.getElementById('p4_card3'),
]

/* table_cards.forEach(element => {
    element.style.visibility = 'hidden'
});
p1_cards.forEach(element => {
    element.style.visibility = 'hidden'
});
p2_cards.forEach(element => {
    element.style.visibility = 'hidden'
});
p3_cards.forEach(element => {
    element.style.visibility = 'hidden'
});
p4_cards.forEach(element => {
    element.style.visibility = 'hidden'
}); */

socket.emit('prepare-game', id);

//-------------------------------------- Sockets --------------------------------------//
socket.on('', () => {

});