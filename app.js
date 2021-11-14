import {MongoClient} from 'mongodb'
import colors from 'colors'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'CRUD';

//connecting to the server
client.connect();
console.log('Połączono z serwerem\n');
const db = client.db(dbName);
const toDo = db.collection('toDo');

const procesType = process.argv[2]
const expresion = process.argv[3]

//functions//
function add(toDo, expresion) {
    toDo.find({
        title: expresion
    }).toArray((err, data) => {
        if (err) console.log('Nie udało się', err)
        else if (data.length > 0) console.log('Jest już takie zadanie'.red)
        else {
            toDo.insertOne({
                title: `${expresion}`,
                done: false
            })
            console.log('Dodano do bazy danych')
        }
    })
    
}

function read(toDo) {
    toDo.find({}).toArray((err, todos) => {
        if (err) console.log("nie udalo sie odczytac")
        else {
            const todosToDo = todos.filter(todo => !todo.done);
            const todosDone = todos.filter(todo => todo.done);
            console.log('Do zrobienia:\n '.green)
            for (const todo of todosToDo) {
                console.log("-", todo.title)
            }
            console.log('Zrobione:\n '.yellow)
            for (const todo of todosDone) {
                console.log("-", todo.title)
            }
        }
    })
}

function update(toDo, expresion) {
    toDo.find({
        title: expresion
    }).toArray((err, data) => {
        if (err) console.log('Nie udało się', err)
        else if (data.length < 1) console.log('Nie ma takiego zadania')
        else if (data[0].done) {
            console.log("Jest już oznaczone jako zrobione".red)
        } else {
            toDo.updateOne({
                title: expresion
            }, {
                $set: {
                    done: true
                }
            })
            console.log("Zadanie oznaczono jako zrobione".green)
        }
    })

}

function delete1(toDo, expresion) {
    toDo.find({
        title: expresion
    }).toArray((err, data) => {
        if (err) console.log('Nie udało się', err)
        else if (data.length !== 1) console.log('Nie ma takiego zadania'.red)
        else {
            toDo.deleteOne({
                title: expresion
            })
            console.log('Usunięto zadanie'.green)
        }
    })

}

//


switch (procesType) {
    case 'add':
        add(toDo, expresion)
        break;
    case 'read':
        read(toDo)
        break;
    case 'update':
        update(toDo, expresion)
        break;
    case 'delete':
        delete1(toDo, expresion)
        break;
    default:
        console.log(`Lista zadań:\n 
        add <nazwa zadania> - dodaje zadanie\n
        read - wyświetla zadania\n
        update <nazwa zadania> - dodaje zadanie do zakończonych\n
        delete <nazwa zadania> - usuwa zadanie`)
}

function wait() {
    client.close()
}
setTimeout(wait, 100)