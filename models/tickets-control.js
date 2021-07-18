const path = require('path');
const fs   = require('fs');

class Ticket {
    constructor(number, desktop) {
        this.number  = number;
        this.desktop = desktop;
    }
}

class TicketControl {
    constructor() {
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        const { ultimo, hoy, tickets, ultimos4 } = require('../db/data.json');

        if (hoy === this.hoy) {
            this.ultimo   = ultimo;
            this.tickets  = tickets;
            this.ultimos4 = ultimos4;
        } else {
            this.saveDB();
        }
    }

    saveDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    next() {
        this.ultimo += 1;

        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.saveDB();

        return `Ticket [${ ticket.number }]`;
    }

    getLastTicket() {
        return `Ticket [${ this.ultimo }]`;
    }

    attendTicket(desktop) {
        // Valido que hayan tickets por atender...
        if (this.tickets.length == 0) {
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.desktop = desktop;

        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }

        this.saveDB();

        return ticket;
    }
}

module.exports = TicketControl;

