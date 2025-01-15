import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

app.use(express.json());

// Configurazione del database
const db = new sqlite3.Database('./magazzino.db', (err) => {
    if (err) {
        console.error('Errore nella connessione al DB:', err.message);
    } else {
        console.log('Connesso al database SQLite.');

        // Creazione della tabella e inserimento dei dati
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS "Snack" (
                    "nome" TEXT NOT NULL,
                    "categoria" TEXT NOT NULL,
                    "prezzo" NUMERIC NOT NULL CHECK(prezzo >= 0),
                    "peso" INTEGER NOT NULL CHECK(peso > 0),
                    "calorie" INTEGER NOT NULL CHECK(calorie > 0),
                    PRIMARY KEY("nome")
                )
            `);

            db.run(`
                INSERT OR IGNORE INTO "Snack" ("nome", "categoria", "prezzo", "peso", "calorie")
                VALUES
                ('Patatine Classiche', 'Salato', 1.99, 100, 500),
                ('Patatine Paprika', 'Salato', 2.49, 80, 420),
                ('Cioccolato al Latte', 'Dolce', 1.50, 50, 250),
                ('Barretta Energetica', 'Salute', 1.99, 45, 180),
                ('Biscotti Integrali', 'Dolce', 2.39, 120, 480)
            `);
        });
    }
});

app.get("/api/snack", (req, res) => {

    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM Snack;");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    // Eseguiamo la query con stmt.all
    stmt.all((err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

});

app.get("/snack/:nome_snack", (req, res) => {
    const nomeSnack = req.params.nome_snack;

    // Apri il database
    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send("Errore server.");
        }
    });

    // Esegui la query SQL con il parametro
    db.get("SELECT * FROM Snack WHERE nome = ?", [nomeSnack], (err, row) => {
        if (err) {
            console.error("Errore Query:", err.message);
            return res.status(500).send("Errore durante la ricerca.");
        }
        if (!row) {
            return res.status(404).send("Snack non trovato.");
        }
        res.json(row); // Restituisci i dati dello snack
        db.close((closeErr) => {
            if (closeErr) {
                console.error("Errore chiusura DB:", closeErr.message);
            } else {
                console.log("Database chiuso correttamente.");
            }
        });
    });
});

app.get("/cat/:nome_categoria", (req, res) => {
    const nomeCategoria = req.params.nome_categoria;

    // Apri il database
    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send("Errore server.");
        }
    });

    // Esegui la query SQL con il parametro
    db.all("SELECT * FROM Snack WHERE categoria = ?", [nomeCategoria], (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            return res.status(500).send("Errore durante la ricerca.");
        }
        if (rows.length === 0) {
            return res.status(404).send("Nessuno snack trovato per questa categoria.");
        }
        res.json(rows); // Restituisci tutti gli snack della categoria
        db.close((closeErr) => {
            if (closeErr) {
                console.error("Errore chiusura DB:", closeErr.message);
            } else {
                console.log("Database chiuso correttamente.");
            }
        });
    });
});

app.get("/cal/:calorie_snack", (req, res) => {
    const calorieSnack = Number(req.params.calorie_snack);

    // Apri il database
    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send("Errore server.");
        }
    });

    // Esegui la query SQL con il parametro
    db.all("SELECT * FROM Snack WHERE ((calorie/100) * peso) < ?", [calorieSnack], (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            return res.status(500).send("Errore durante la ricerca.");
        }
        if (rows.length === 0) {
            return res.status(404).send("Nessuno snack trovato al di sotto di queste calorie.");
        }
        res.json(rows); // Restituisci tutti gli snack al di sotto del numero di calorie richieste
        db.close((closeErr) => {
            if (closeErr) {
                console.error("Errore chiusura DB:", closeErr.message);
            } else {
                console.log("Database chiuso correttamente.");
            }
        });
    });
});



app.put("/api/snack", (req, res) => {
    
    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    let stmt = db.prepare("INSERT INTO Snack (nome, categoria, peso, prezzo, calorie) VALUES (?,?,?,?,?);");

     // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    const snack = req.body;

    stmt.run(snack.nome, snack.categoria, snack.peso, snack.prezzo, snack.calorie, (err) => {
        if (err) {
            console.error("Errore Run:", err.message);
            res.status(500).send(err.message);
        } else {
            res.send("Prodotto inserito correttamente");
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    })

});

app.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
});
