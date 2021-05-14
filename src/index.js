const fetch = require("node-fetch")

const indirizzoIp = "192.168.1.231"

const consegna = (numeroEsercizio, risultato) => {
    console.log(`Consegna dell'esercizio n. ${numeroEsercizio} con questo payload:`, { data: risultato })

    fetch(`http://${indirizzoIp}:8080/esercizi/${numeroEsercizio}`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
          },
        body: JSON.stringify({
            data: risultato
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Risposta dal server:", data)
        })
}

const accreditamento = (nome) => {
    fetch(`http://${indirizzoIp}:8080/accreditamento`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        nome: nome
      })
    })
      .then(res => res.json())
      .then(console.log)
      .catch(console.log)
}

const risolvi = (numeroEsercizio) => {
    fetch(`http://${indirizzoIp}:8080/esercizi/${numeroEsercizio}`, {
        headers: {
            "x-data": "true"
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(`Eseguo l'esercizio ${numeroEsercizio} con questi dati:`)
            console.dir(data, { depth: null })
            switch(numeroEsercizio) {
                case 1: 
                    es1(data.data)
                    break
                case 2: 
                    es2(data.data)
                    break
                case 3: 
                    es3(data.data)
                    break
                case 4: 
                    es4(data.data)
                    break
                case 5: 
                    es5(data.data)
                    break
                default: 
                    console.log("numero esercizio sconosciuto")
            }
        })
}

const es1 = (numbers) => {
    const valoreAssoluto = (x) => x > 0 ? x : -x

    let min = numbers[0]
    let max = numbers[0]
    let totals = 0

    for (let e of numbers) {
        if (min > e) min = e
        if (max < e) max = e

        totals += e
    }

    const media = totals / numbers.length

    consegna(1, {
        maggioreMedia: valoreAssoluto(media - max),
        minoreMedia: valoreAssoluto(media - min)
    })
}

const es2 = (email) => {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(users => {
            console.log(email)
            const user = users.find(e => e.email === email)
            consegna(2, user.name)
        })
}

const es3 = (data) => {
    const {
        userId,
        nCaratteri
    } = data

    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(data => {
            const posts = data.filter(e => e.userId === userId && e.title.length > nCaratteri)
            consegna(3, posts.length)
        })
}

const es4 = (userIds) => {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(users => {
            const filteredUsers = users.filter(e => userIds.includes(e.id))
            
            const user = filteredUsers.reduce((acc, e) => {
                if (acc.address.geo.lat > e.address.geo.lat) 
                    return acc
                else 
                    return e
            }, filteredUsers[0])

            consegna(4, {
                name: user.name,
                username: user.username,
                phone: user.phone
            })
        })
}

const es5 = (userId) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => res.json())
        .then(user => {
            fetch("https://jsonplaceholder.typicode.com/todos")
                .then(res => res.json())
                .then(todos => {
                    const filteredTodos = todos
                        .filter(e => e.userId === userId && e.completed === true)
                        .map(e => e.id)
                    user.todos = filteredTodos

                    consegna(5, user)
                })
        })
}

accreditamento("Alessandro Montanari")