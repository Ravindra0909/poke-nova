import React from 'react'
import './index.css'

const PokemonCard = ({ pokemon }) => {
  const { id, name, sprites, types } = pokemon
  return (
    <div className="pokemon-card">
      <img src={sprites.front_default} alt={name} className="pokemon-image" />
      <h3 className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <p className="pokemon-id">#{id}</p>
      <div className="pokemon-types">
        {types.map(t => (
          <span key={t.type.name} className={`pokemon-type ${t.type.name}`}>
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PokemonCard