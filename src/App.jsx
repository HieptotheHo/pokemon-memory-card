import { useState, useEffect } from "react";
import Card from "./Card/Card";
import "./App.css";
let clickedCards = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [numberOfCards, setNumberOfCards] = useState(20);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch data when component mounts
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then((response) => response.json())
      .then((data) => {
        const fetchPromises = [...data.results]
          .sort(() => 0.5 - Math.random())
          .slice(0, numberOfCards)
          .map((url) => {
            return fetch(url.url)
              .then((response) => response.json())
              .then((data) => ({
                id: data.order,
                name: data.species.name,
                imageUrl: data.sprites.other["official-artwork"].front_default,
              }))
              .catch((error) => {
                console.error("Error fetching pokemon:", error);
              });
          });

        Promise.all(fetchPromises)
          .then((results) => {
            setPokemons(results);
            setLoading(false);
            clickedCards = [];
            setScore(0);
          })
          .catch((error) => {
            console.error("Error fetching pokemons:", error);
            // setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        // setLoading(false);
      });
  }, [numberOfCards, loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="header">
        <h1>Pokemon Memory Card</h1>
        <div className="operation">
          <label htmlFor="">
            #Cards:{" "}
            <input
              type="number"
              value={numberOfCards}
              onChange={(e) => {
                setNumberOfCards(e.target.value);
              }}
            />
          </label>

          <label htmlFor="">Score: {score}</label>
        </div>
      </div>
      <div className="card-container">
        {pokemons.map((pokemon, i) => (
          <Card
            key={pokemon.id}
            {...pokemon}
            onClick={() => {
              if (!clickedCards.includes(pokemon.id)) {
                if (score + 1 == numberOfCards) {
                  alert("You win!");
                  setLoading(true);
                  return;
                }
                clickedCards.push(pokemon.id);
                setScore(score + 1);
                setPokemons(shuffleArray(pokemons));
              } else {
                alert("You already clicked this card!");
                setLoading(true);
              }
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
