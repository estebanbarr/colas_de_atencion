const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio..');
}

const escritorio = searchParams.get('escritorio');

//Referencias HTML...
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

// Socket funcionalidad...
const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
    lblPendientes.innerText = payload;
    const pendientes = parseInt(payload);
    if (!isNaN(pendientes) && pendientes > 0) {
        console.log('Ok ok ok ok...');
        divAlerta.style.display = 'none';
    }
});

btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { desktop: escritorio }, ({ ok, ticket, msg }) => {
        if (!ok) {
            divAlerta.innerText = msg;
            divAlerta.style.display = '';
            lblTicket.innerText = 'nadie';
            return;
        }

        lblTicket.innerText = `Ticket ${ ticket.number }`;
    });
});