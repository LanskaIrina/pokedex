import {Text, StyleSheet, ScrollView, Image, Pressable} from "react-native";
import {useEffect, useState} from "react";
import {Link} from "expo-router";
import {typeColors} from "../constants/pokemon-colors";

type Pokemon = {
  name: string;
  url: string;
  types: PokemonType[];
};


type PokemonType = {
  type: {
    name: string;
    url: string;
  };
};

export default function Index() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10");
      const data = await response.json();

      const pokemonData = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const response = await fetch(pokemon.url);
          const detailedData = await response.json();
          return {
            name: detailedData.name,
            url: detailedData.sprites.front_default,
            types: detailedData.types,
          };
        })
      );
      setPokemonData(pokemonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} contentInsetAdjustmentBehavior="automatic">
        {pokemonData?.map((pokemon:Pokemon, index) => (
          <Link key={index}
                href={{ pathname: "/details", params: { pokemonName: pokemon.name } }}
                asChild>
            <Pressable style={StyleSheet.flatten([styles.container, { backgroundColor: typeColors[pokemon.types[0].type.name] + "50" }])}>
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

              <Image
                source={{ uri: pokemon.url }}
                style={{ width: 100, height: 100 }}
              />
            </Pressable>
          </Link>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
  },
  container: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  }
});
