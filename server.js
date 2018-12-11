const cheerio = require('cheerio')
const inquirer = require('inquirer')
const axios = require('axios')
const mongo = require('mongojs')

console.log('Hello!')
console.log('Where would you like to go in Reddit?')
pickCategory()

function pickCategory() {
    inquirer.prompt([
        {
            name: "category",
            message: "Please pick a subReddit."
        }
    ]).then(function(answer) {
        let choice = answer.category
        console.log(choice)
        showResults(choice)
    })
}

function showResults(choice) {
    axios.get(`https://www.reddit.com/r/${choice}`)
        .then(r => {
            const $ = cheerio.load(r.data)
            $('.scrollerItem h2').each((i, elem) => {
                if (i <= 4) {
                    const db = mongo('reddit')
                    db.subReddit.insert({'title': `${$(elem).text()}`})
                    console.log(`
                        Post #${i+1}
                        ${$(elem).text()}
                    `)
                }

            })
        })
        .catch(e => console.log(e))
}