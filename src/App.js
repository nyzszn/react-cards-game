import React from "react";
import "./App.css";
import _ from "lodash";
import { async } from "q";

const cards = require("./data/cards.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOne: {
        name: "Player One",
        cards: []
      },
      playerTwo: {
        name: "Player Two",
        cards: []
      },
      deck: [],
      cutter: {},
      played: [],
      nextPlayer: "",
      gameOver: true,
      winner: "",
      requiredType:"",
      cardsToPick:1,
      canPickFromDeck:false,
      mustPickFromDeck:false
    };
  }

  componentDidMount() {
    this._start();
  }

    _start = async () => {
    console.log("Starting Game");
    await this._shuffle();
    await this._distributeCardsEvenly();
  };

  _shuffle = async () => {
    let shuffledCards = cards.sort(() => Math.random() - 0.5);
    console.log("Shuffling");
    this.setState(
      {
        deck: shuffledCards
      },
      () => {
        console.log("Done Shuffling")
      }
    );
  };
  _distributeCardsEvenly = async () => {
    const p1 = [];
    const p2 = [];
    let cutter = {};
    let whatsLeftOftheDeck = this.state.deck;
    this.state.deck.map((v, k) =>
      k <= 13 ? (k % 2 ? p1.push(v) : p2.push(v)) : ""
    );
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, p1);
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, p2);
    let counter = 0;
    while (whatsLeftOftheDeck[counter]) {
      whatsLeftOftheDeck.sort(() => Math.random() - 0.5);
      console.log("xx");
      if (whatsLeftOftheDeck[0].number != 7) {
        console.log(whatsLeftOftheDeck[0]);
        cutter = whatsLeftOftheDeck[0];
        break;
      }
      counter++;
    }
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, [cutter]);

    let playerOne = this.state.playerOne;
    let playerTwo = this.state.playerTwo;

    playerOne.cards = p1;
    playerTwo.cards = p2;
    let nextPlayer = _.shuffle([playerOne, playerTwo]);

    this.setState({
      playerOne,
      playerTwo,
      deck: whatsLeftOftheDeck,
      cutter,
      nextPlayer: nextPlayer[0].name,
      gameOver: false
    });
  };
  _handlePlayed = async (player, card, currentPlayedCards, nplayer) => {
    switch( card.number ){
      case 20:
      // ask next player to pick 2 cards of play a an equivalent card`
        this.setState({
          played: currentPlayedCards,
          cardsToPick:2,
          canPickFromDeck:true,
          mustPickFromDeck:true,
          [player.name === "Player One"
          ? "playerOne"
          : "playerTwo"]: nplayer,
          nextPlayer: player.name === "Player One" ? "Player Two" : "Player One"
      });
      break;

      case 8:
      // next player is themselves
      this.setState({
        played: currentPlayedCards,
        cardsToPick:1,
        canPickFromDeck:true,
        mustPickFromDeck:false,
        [player.name === "Player One"
        ? "playerOne"
        : "playerTwo"]: nplayer,
        nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
    });
    break;

    case 11:
    // next player is themselves
    this.setState({
      played: currentPlayedCards,
      cardsToPick:1,
      canPickFromDeck:true,
      mustPickFromDeck:false,
      [player.name === "Player One"
      ? "playerOne"
      : "playerTwo"]: nplayer,
      nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
  });
  break;
      case 15:
      // ask next player to play type of choice next
      this.setState({
        played: currentPlayedCards,
        cardsToPick:1,
        canPickFromDeck:true,
        mustPickFromDeck:false,
        requiredType:this.state.requiredType,
        [player.name === "Player One"
        ? "playerOne"
        : "playerTwo"]: nplayer,
        nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
    });
    break;

      // case card.number == 7 && card.type == this.state.cutter.type:
      // // calculate if current player has to number of cards less that 25 in total if so then calculate each player who has the least to be the winner
      // let totalCount = 0;
      // this.state[player.name].cards.map((v, k)=>
      //     totalCount +=v.number
      // );
      // if(totalCount <25){
      //   this.setState({
      //     played: currentPlayedCards,
              // cardsToPick:1,
              // canPickFromDeck:true,
              // mustPickFromDeck:false,
      //     requiredType:this.state.requiredType,
      //      [player.name === "Player One"
      //      ? "playerOne"
      //      : "playerTwo"]: nplayer,
      //     nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
      // });
      // // cut function to run after this
      // }
      // else{
      //   console.log("Total is less than 25");
      //   return false;
      // }
      
      default:
        this.setState({
          played: currentPlayedCards,
          cardsToPick:1,
          canPickFromDeck:true,
          mustPickFromDeck:false,
          [player.name === "Player One"
          ? "playerOne"
          : "playerTwo"]: nplayer,
          nextPlayer: player.name === "Player One" ? "Player Two" : "Player One"
      });
    }
  }
  _afterMath = async(player, card)=>{
    let currentPlayedCards = this.state.played;
    const lastPlayedCard =
      this.state.played.length > 0
        ? this.state.played[this.state.played.length - 1]
        : [];
    if (this.state.played.length > 0) {
      console.log("card", card);
      console.log("lastplayed card", lastPlayedCard);
      if (
        card.text == lastPlayedCard.text ||
        card.type == lastPlayedCard.type
      ) {
        console.log("Good to go!");

        currentPlayedCards.push(card);
        let nplayer =
          player.name === "Player One"
            ? this.state.playerOne
            : this.state.playerTwo;
        nplayer.cards = _.difference(player.cards, [card]);
        await this._handlePlayed(player, card, currentPlayedCards, nplayer)
      } else {
        console.log("Not the right card to play");
      }
    } else if (this.state.played.length == 0) {
      currentPlayedCards.push(card);
      let nplayer =
        player.name === "Player One"
          ? this.state.playerOne
          : this.state.playerTwo;
      nplayer.cards = _.difference(player.cards, [card]);
       await this._handlePlayed(player, card, currentPlayedCards, nplayer)
     } else {
        console.log("You ain't supposed to play 2");
        return false;
      }
  }
  _playNext = async (player, card) => {

    //check to see if right player should play
    if (player.name === this.state.nextPlayer && this.state.mustPickFromDeck == false) {
      await this._afterMath(player, card);
    } 
    else if( player.name === this.state.nextPlayer && this.state.mustPickFromDeck == true && card.number === 20 ){
      console.log("You are playing a 20 with a 20, nice one!");
      await this._afterMath(player, card);
    }

    else if( this.state.mustPickFromDeck == true && card.number != 20  ){
      console.log("You must pick from the deck");
      return false;
    }
    else {
      console.log("You ain't supposed to play 1");
      return false;
    }
  };

  _pickFromDeck = async () => {

    if(this.state.canPickFromDeck){

    
    //must be the right player
    let cardsToPick = this.state.cardsToPick;
    let cardsToAdd =[];
    let canPickFromDeck = false;
    let whatsLeftOftheDeck = this.state.deck;
    let nplayer =
          this.state.nextPlayer === "Player One"
            ? this.state.playerOne
            : this.state.playerTwo;

      //determine whether the player has eaten a dog or not
      if(this.state.mustPickFromDeck == true){
        for (var i = 0; i < cardsToPick; i++) {
          cardsToAdd.push(this.state.deck[i]);
          nplayer.cards.push(this.state.deck[i])
        }
      }else{
        //should only pick one card max
        cardsToAdd.push(this.state.deck[0]);
        nplayer.cards.push(this.state.deck[0])
      }
      
      // remove cards from deck
      whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, cardsToAdd);

      // add cards to player cards
      // upddate state not to require pick from cards{
      this.setState({
        // cannot pick again until played
        canPickFromDeck:canPickFromDeck,
        deck:whatsLeftOftheDeck,
        [this.state.nextPlayer=== "Player One"
            ? "playerOne"
            : "playerTwo"]: nplayer,
      });

      console.log("Done picking from Deck")
    }
    else{
      console.log("Can't not pick from Deck")
      return false;
    }

  };
  _regroupDeckFromPlayed = async () => {

  };
  _cut = async () => {};

  _cancel = async () => {};
  _determineWinner = async () => {};

  iconRenderer(name) {
    switch (name) {
      case "Spade":
        return <span>&#9824;</span>;
      case "Flower":
        return <span>&#9827;</span>;
      case "Heart":
        return <span>&#9829;</span>;
      case "Diamond":
        return <span>&#9830;</span>;
      default:
        return <span></span>;
    }
  }


  render() {
    let playerOneCards =
      this.state.playerOne &&
      this.state.playerOne.cards.map((value, key) => (
        <div
          onClick={() => this._playNext(this.state.playerOne, value)}
          className="card"
        >
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </div>
      ));

    let playerTwoCards =
      this.state.playerTwo &&
      this.state.playerTwo.cards.map((value, key) => (
        <span
          onClick={() => this._playNext(this.state.playerTwo, value)}
          className="card"
        >
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </span>
      ));

    let played =
      this.state.played &&
      this.state.played.map((value, key) => (
        <span className="card">
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </span>
      ));

    return (
      <div className="App">
        <div className="nextPlayer">{this.state.nextPlayer}</div>
        <h3>Player One</h3>
        {playerOneCards}
        <hr />
        <div className="played">{played}</div>
        <hr />
        <h3>Player Two</h3>
        {playerTwoCards}
        <hr />
        <h3>Deck</h3>
        <span onClick={() => this._pickFromDeck()} className="card">{this.state.deck.length}</span>
        <hr />
        <h3>Cutter</h3>
        <div className="card">
          <span>{this.state.cutter.text}</span>
          {this.iconRenderer(this.state.cutter.type)}
        </div>
      </div>
    );
  }
}

class Player extends React.Component {}
class Deck extends React.Component {}
class Played extends React.Component {}

export default App;
