import axios from 'axios';
import inquirer from 'inquirer';

const menù = [
    {
        type: 'list',
        name: 'menù',
        message: 'Cosa vuoi fare?',
        choices: [
            'Visualizza prodotti',
            'Visualizza prodotto richiesto',
            'Visualizza snack di una categoria',
            'Visualizza snack sotto calorie richieste',
            'Inserisci prodotto',
            'Esci'
        ]
    }
];

const domandaCalorie = [
    {
        type: 'number',
        name: 'calorieSnack',
        message: 'Calorie Snack massime richieste:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un numero non negativo!';
            }
        }
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
        type: 'input',
        name: 'prezzo',
        message: 'Prezzo Snack:',
        validate: (value) => {
            const numero = parseFloat(value);
            if (!isNaN(numero) && numero >= 0) {
                return true;
            } else {
                return 'Inserisci un prezzo valido (numero non negativo, anche decimale).';
            }
        },
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
        switch (answers.menù) {
            case 'Visualizza prodotti':
                axios.get('http://localhost:3000/api/snack').then((response) => {
                    console.log(response.data);
                    main(); // Torna al menu
                });
                break;
            case 'Visualizza prodotto richiesto':
                inquirer.prompt(domandaNomeSnack).then((answers) => {
                    axios.get(`http://localhost:3000/snack/`+answers.nomeSnack.trim())
                        .then((response) => {
                            console.log("Dati dello snack:", response.data);
                            main(); // Torna al menu
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                            main(); // Torna al menu
                        });
                });
                break;
            case 'Visualizza snack di una categoria':
                inquirer.prompt(domandaCategoria).then((answers) => {
                    axios.get(`http://localhost:3000/cat/`+answers.nomeCategoria.trim())
                        .then((response) => {
                            console.log("Dati degli snack appartenenti alla categoria richiesta:");
                            console.log(response.data);
                            main(); // Torna al menu
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                            main(); // Torna al menu
                        });
                });
                break;
            case 'Visualizza snack sotto calorie richieste':
                inquirer.prompt(domandaCalorie).then((answers) => {
                    axios.get(`http://localhost:3000/cal/`+answers.calorieSnack)
                        .then((response) => {
                            console.log("Snack sotto calorie indicate:", response.data);
                            main(); // Torna al menu
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                            main(); // Torna al menu
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
                        main(); // Torna al menu
                    }).catch((err) => {
                        console.log(err.response.data);
                        main(); // Torna al menu
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
