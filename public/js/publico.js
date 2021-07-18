// Objetos HTML...
const lblsTicket = [
    document.querySelector('#lblTicket1'),
    document.querySelector('#lblTicket2'),
    document.querySelector('#lblTicket3'),
    document.querySelector('#lblTicket4')
];

const lblsEscritorio = [
    document.querySelector('#lblEscritorio1'),
    document.querySelector('#lblEscritorio2'),
    document.querySelector('#lblEscritorio3'),
    document.querySelector('#lblEscritorio4')
];

const btnAudioc = document.querySelector('#btnAudioc');

// Socket funcionalidad...
const socket = io();

socket.on('disconnect', () => {
    for (let i = 0; i < lblsTicket.length; ++i) {
        lblsTicket[i].innerText     = 'Vacio';
        lblsEscritorio[i].innerText = 'Vacio';
    }
});

socket.on('ultimos-4-ticket', ({ tickets=[] }) => {
    //btnAudioc.click();
    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play();

    for (let i = 0; i < lblsTicket.length; ++i) {
        if (tickets[i]) {
            lblsTicket[i].innerText     = 'Ticket ' + tickets[i].number;
            lblsEscritorio[i].innerText = 'Escritorio ' + tickets[i].desktop;
        } else {
            lblsTicket[i].innerText     = 'Vacio';
            lblsEscritorio[i].innerText = 'Vacio';
        }
    }
});

btnAudioc.addEventListener('click', () => {
    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play();
});
