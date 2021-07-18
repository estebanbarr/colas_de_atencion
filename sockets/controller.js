const TicketControl = require('../models/tickets-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
    socket.on('disconnect', () => {});

    // Cuando un cliente se conecta se ejecuta..
    socket.emit('ultimo-ticket', ticketControl.getLastTicket());
    socket.emit('ultimos-4-ticket', { tickets: ticketControl.ultimos4 });
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.next();
        callback(siguiente);

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ desktop }, callback) => {
        if (!desktop) {
            return callback({
                ok: false,
                msg: 'No se recibio el escritorio'
            });
        }

        const ticket = ticketControl.attendTicket(desktop);
        if (!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        }

        socket.broadcast.emit('ultimos-4-ticket', { tickets: ticketControl.ultimos4 });
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);

        callback({
            ok: true,
            ticket
        });
    });
}

module.exports = {
    socketController
}

