import axios from 'axios';
import inquirer from 'inquirer';

const menù = [
    {
        type: 'list',
        name: 'menù',
        message: 'Cosa vuoi fare?',
        choices: ['Visualizza prodotti', 'Visualizza prodotto richiesto', 'Visualizza snack di una categoria', 'Inserisci prodotto', 'Esci']
    }
];

const domandaCategoria = [
    {
        type: 'input',
        name: 'nomeCategoria',
        message: 'Categoria Snack richiesta:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci una categoria!';
            }
        }
    }
];
const domandaNomeSnack = [
    {
        type: 'input',
        name: 'nomeSnack',
        message: 'Nome Snack richiesto:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un nome!';
            }
        }
    }
];
const domandeInserimento = [
    {
        type: 'input',
        name: 'nome',
        message: 'Nome Snack:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un nome!';
            }
        }
    },
    {
        type: 'input',
        name: 'categoria',
        message: 'Categoria Snack:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci una categoria valida!';
            }
        }
    },
    {
        type: 'number',
        name: 'peso',
        message: 'Peso Snack:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un peso non negativo!';
            }
        }
    },
    {
        type: 'number',
        name: 'prezzo',
        message: 'Prezzo Snack:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un prezzo non negativo!';
            }
        }
    },
    {
        type: 'number',
        name: 'calorie',
        message: 'Calorie Snack per 100 grammi:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un numero non negativo!';
            }
        }
    }
];

function main() {
    inquirer.prompt(menù).then((answers) => {
        switch(answers.menù) {
            case 'Visualizza prodotti':
                axios.get('http://localhost:3000/api/snack').then((response) => {
                    console.log(response.data);
                });
            break;
            case 'Visualizza prodotto richiesto':
                inquirer.prompt(domandaNomeSnack).then((answers) => {
                    const nomeSnack = answers.nomeSnack.trim(); // Rimuovi spazi in eccesso
                    axios.get(`http://localhost:3000/api/snack/${encodeURIComponent(nomeSnack)}`)
                        .then((response) => {
                            console.log("Dati dello snack:", response.data);
                        })
                        .catch((err) => {
                            if (err.response) {
                                console.log("Errore:", err.response.status, err.response.data);
                            } else {
                                console.log("Errore nella connessione:", err.message);
                            }
                        });
                });
            break;
            case 'Visualizza snack di una categoria':
                inquirer.prompt(domandaCategoria).then((answers) => {
                    const nomeCategoria = answers.nomeCategoria.trim(); // Rimuovi spazi in eccesso
                    axios.get(`http://localhost:3000/api/snack/categoria/${encodeURIComponent(nomeCategoria)}`)
                    .then((response) => {
                        console.log("Dati degli snack appartenenti alla categoria richiesta:");
                        console.log(response.data);
                    })
                    .catch((err) => {
                        if (err.response) {
                            console.log("Errore:", err.response.status, err.response.data);
                        } else {
                            console.log("Errore nella connessione:", err.message);
                        }
                    });
                });
            break;
            case 'Inserisci prodotto':
                inquirer.prompt(domandeInserimento).then((answers) => {
                    axios.put('http://localhost:3000/api/snack', {
                        nome: answers.nome,
                        categoria: answers.categoria,
                        peso: answers.peso,
                        prezzo: answers.prezzo,
                        calorie: answers.calorie,
                    }).then((response) => {
                        console.log(response.data);        
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'Esci':
            console.log("Bye!");
            return;
        }
    });
}


main();