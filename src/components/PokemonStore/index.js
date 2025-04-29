import React, { Component } from 'react'
import { TailSpin } from 'react-loader-spinner'

import PokemonCard from '../PokemonCard'
import './index.css'

class PokemonStore extends Component {
  state = {
    pokemons: [],
    isLoading: true,
    searchInput: '',
    filterType: 'All',
    types: [],
  }

  componentDidMount() {
    this.getPokemonData()
  }

  getPokemonData = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
      const data = await response.json()

      console.log(data)
      const detailedData = await Promise.all(
        data.results.map(async pokemon => {
          const res = await fetch(pokemon.url)
          return res.json()
        })
      )
      const typesSet = new Set()
      detailedData.forEach(p => p.types.forEach(t => typesSet.add(t.type.name)))
      this.setState({
        pokemons: detailedData,
        isLoading: false,
        types: ['All', ...Array.from(typesSet)],
      })
    } catch (error) {
      console.error('Error fetching Pokémon data:', error)
    }
  }

  onSearchChange = event => {
    this.setState({ searchInput: event.target.value })
  }

  onFilterChange = event => {
    this.setState({ filterType: event.target.value })
  }

  getFilteredPokemons = () => {
    const { pokemons, searchInput, filterType } = this.state
    return pokemons.filter(pokemon => {
      const matchesName = pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
      const matchesType = filterType === 'All' || pokemon.types.some(t => t.type.name === filterType)
      return matchesName && matchesType
    })
  }

  render() {
    const { isLoading, searchInput, filterType, types } = this.state
    const filteredPokemons = this.getFilteredPokemons()

    return (
      <div className="app-container">
        <h1 className="app-title">PokeNova Explorer</h1>
        <div className="controls">
          <input
            type="search"
            placeholder="Search Pokémon"
            value={searchInput}
            onChange={this.onSearchChange}
            className="search-input"
          />
          <select value={filterType} onChange={this.onFilterChange} className="filter-dropdown">
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="loader-container">
            <TailSpin
  height="50"
  width="50"
  color="#00BFFF"
  ariaLabel="loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>

          </div>
        ) : filteredPokemons.length === 0 ? (
          <p className="empty-message">No Pokémon found.</p>
        ) : (
          <div className="pokemon-list">
            {filteredPokemons.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default PokemonStore
