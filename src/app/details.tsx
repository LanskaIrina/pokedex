import {StyleSheet, View, Text, Image, ActivityIndicator} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import {typeColors} from "@/constants/pokemon-colors";

type PokemonDetails = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
};

export default function Details() {
  const {pokemonName} = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (pokemonName) {
      fetchPokemonDetails(pokemonName as string);
    }
  }, [pokemonName]);

  const fetchPokemonDetails = async (name: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  }

  if (!pokemon) {
    return (
      <>
        <Stack.Screen options={{ title: pokemonName as string, headerBackButtonDisplayMode: 'minimal' }} />
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </>
    );
  }

  const mainType = pokemon.types[0].type.name;

  return (
    <>
      <Stack.Screen options={{ title: pokemonName as string, headerBackButtonDisplayMode: 'minimal' }} />
      <SafeAreaView style={[styles.container, { backgroundColor: typeColors[mainType] + "30" }]}>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.image}
        />
        <Text style={styles.name}>{pokemon.name}</Text>

        <View style={styles.typeRow}>
          {pokemon.types.map(({ type }) => (
            <View
              key={type.name}
              style={[styles.typeBadge, { backgroundColor: typeColors[type.name] }]}
            >
              <Text style={styles.typeBadgeText}>{type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.typeRow}>
          {pokemon.abilities.map(({ ability }) => (
            <View key={ability.name} style={styles.abilityBadge}>
              <Text style={styles.abilityBadgeText}>{ability.name}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  typeBadgeText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 4,
  },
  abilityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "gray",
  },
  abilityBadgeText: {
    textTransform: "capitalize",
  },
});
