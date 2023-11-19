"use strict"

const playerDeck = document.querySelectorAll("#player-deck .card")
const dealerDeck = document.querySelectorAll("#dealer-deck .card")
const cardValues = [
    10,10,10,10, 
    10,10,10,10, 
    10,10,10,10, 
    [1,11],[1,11],[1,11],[1,11],
    2,2,2,2,
    3,3,3,3,
    4,4,4,4,
    5,5,5,5,
    6,6,6,6,
    7,7,7,7,
    8,8,8,8,
    9,9,9,9,
    10,10,10,10                
]

let playerWin = false, dealerWin = false, bothDraw = false
const playerScore = [0, 0]
const dealerScore = [0, 0]
const playerActiveCards = []
const dealerActiveCards = []
const messageEl = document.querySelector(".message")
const playerBox = document.querySelector(".player")
const dealerBox = document.querySelector(".dealer")

// display card + tally score
const hitFn = function(deck, activeCards, score) {
    let random = Math.trunc(Math.random()*52)
    while (activeCards.includes(random)) {
        random = Math.trunc(Math.random()*52)
    }
    const cardSelected = deck[random]
    cardSelected.style.display = "block"
    activeCards.push(random)

    if (random >= 12 && random <= 15) {
        score[0] += cardValues[random][0]
        score[1] += cardValues[random][1]
    } else {       
        score[0] += cardValues[random]
        score[1] += cardValues[random]
    }
}

// roll
const rollBtn = document.querySelector("#roll")
rollBtn.addEventListener("click", function() {   
    for (let i=1; i<=2; i++) {
        hitFn(playerDeck, playerActiveCards, playerScore)
        hitFn(dealerDeck, dealerActiveCards, dealerScore)
    }

    messageEl.textContent = "Playing..."
    rollBtn.disabled = true
    hitBtn.disabled = false
    standBtn.disabled = false

    // end scenarios - dealt 21
    if (playerScore[0] === 21 || playerScore[1] === 21) {
        playerWin = true
    }
    if (dealerScore[0] === 21 || dealerScore[1] === 21) {
        dealerWin = true
    }

    if (playerWin && dealerWin) {
        messageEl.textContent = "It's a draw :O"
        playerBox.style.backgroundColor = "brown"
        dealerBox.style.backgroundColor = "brown"
        hitBtn.disabled = true
        standBtn.disabled = true
    } else if (playerWin) {
        messageEl.textContent = "You win :)"
        playerBox.style.backgroundColor = "green"
        dealerBox.style.backgroundColor = "red"
        hitBtn.disabled = true
        standBtn.disabled = true
    } else if (dealerWin) {
        messageEl.textContent = "Dealer wins :("
        playerBox.style.backgroundColor = "red"
        dealerBox.style.backgroundColor = "green"
        hitBtn.disabled = true
        standBtn.disabled = true
    }

    console.log(playerScore, dealerScore)
})

// hit
const hitBtn = document.querySelector("#hit")
hitBtn.disabled = true
hitBtn.addEventListener("click", function() {
    hitFn(playerDeck, playerActiveCards, playerScore)

    // player 21
    if (playerScore[0] === 21 || playerScore[1] === 21) {
        messageEl.textContent = "You win :)"
        playerBox.style.backgroundColor = "green"
        dealerBox.style.backgroundColor = "red"
        hitBtn.disabled = true
        standBtn.disabled = true
        playerWin = true
    }

    // player bust
    if (playerScore[0] > 21) {
        messageEl.textContent = "Bust - dealer wins :("
        playerBox.style.backgroundColor = "red"
        dealerBox.style.backgroundColor = "green"
        hitBtn.disabled = true
        standBtn.disabled = true
        dealerWin = true
    }

    console.log(playerScore)
})

// stand
const standBtn = document.querySelector("#stand")
standBtn.disabled = true
standBtn.addEventListener("click", function() {
    hitBtn.disabled = true
    standBtn.disabled = true

    const scoreToBeat = (playerScore[1] > playerScore[0] && playerScore[1] <= 21) ? playerScore[1] : playerScore[0]
    console.log(scoreToBeat)
       
    // playerScore > dealerScore - keep hitting until 1. beat / 2. bust
    while (dealerScore[0] < scoreToBeat || dealerScore[1] < scoreToBeat) {
        // break if min val >= 21 / draw / max value is winnable
        if ((dealerScore[0] >= 21) || 
        (dealerScore[0] === scoreToBeat || dealerScore[1] === scoreToBeat) || 
        (dealerScore[1] > scoreToBeat && dealerScore[1] <= 21)) {
            break
        }
       
        // !!! add delay to see what cards are drawn
        
        hitFn(dealerDeck, dealerActiveCards, dealerScore)
       
        console.log(dealerScore)
    }
    
    // dealer 21
    if (dealerScore[0] === 21 || dealerScore[1] === 21) {
        messageEl.textContent = "Dealer wins :("
        playerBox.style.backgroundColor = "red"
        dealerBox.style.backgroundColor = "green"
        dealerWin = true
    }

    // same score - dealer wants to draw
    if (dealerScore[0] === scoreToBeat || dealerScore[1] === scoreToBeat) {
        messageEl.textContent = "It's a draw :O"
        playerBox.style.backgroundColor = "brown"
        dealerBox.style.backgroundColor = "brown"
        bothDraw = true
    }

    // dealer win
    if (dealerScore[1] <= 21 && (dealerScore[0] > scoreToBeat || dealerScore[1] > scoreToBeat)) {
        messageEl.textContent = "Dealer wins :("
        playerBox.style.backgroundColor = "red"
        dealerBox.style.backgroundColor = "green"
        dealerWin = true
    }

    // dealer bust
    if (dealerScore[0] > 21) {
        messageEl.textContent = "Dealer bust - you win :)"
        playerBox.style.backgroundColor = "green"
        dealerBox.style.backgroundColor = "red"
        playerWin = true
    }
})

// clear
const clearBtn = document.querySelector("#clear")
clearBtn.addEventListener("click", function() {   
    while (playerActiveCards.length > 0) {
        playerDeck[playerActiveCards[0]].style.display = "none"
        playerActiveCards.shift()
    }

    while (dealerActiveCards.length > 0) {
        dealerDeck[dealerActiveCards[0]].style.display = "none"
        dealerActiveCards.shift()
    }

    for (let i=0; i<=1; i++) {
        playerScore[i] = 0
        dealerScore[i] = 0
    }

    playerWin = false
    dealerWin = false
    bothDraw = false

    playerBox.style.backgroundColor = ""
    dealerBox.style.backgroundColor = ""
    messageEl.textContent = "Roll to start"
    rollBtn.disabled = false
    hitBtn.disabled = true
    standBtn.disabled = true
    console.clear()
})