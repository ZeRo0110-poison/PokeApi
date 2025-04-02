document.addEventListener("DOMContentLoaded", () => {
    const modalBody = document.querySelector(".modal-body");
  
    modalBody.innerHTML += `
      <p><strong>Descripción:</strong> <span id="descripcion"></span></p>
      <p><strong>Ubicación:</strong> <span id="ubicacion"></span></p>
      <h4>Formas Shiny:</h4>
      <div id="shinyForms"></div>
      <h4>Formas Regionales:</h4>
      <div id="regionalForms"></div>
    `;
   const h1 = document.createElement("h1");
   h1.textContent = "Pokémon Info";
   document.body.appendChild(h1);
 
   const input = document.createElement("input");
   input.type = "text";
   input.id = "pokemonName";
   input.placeholder = "Escribe un Pokémon";
   document.body.appendChild(input);
 
   const button = document.createElement("button");
   button.textContent = "Buscar";
   button.classList = "btn btn-primary";
   button.onclick = buscarPokemon;
   document.body.appendChild(button);
   
   const container = document.createElement("div");
   container.id = "pokemonInfo";
   document.body.appendChild(container)});
 
  
  async function buscarPokemon() {
    const nombrePokemon = document
      .getElementById("pokemonName")
      .value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Pokémon no encontrado");
  
      const data = await response.json();
  
      const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`;
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();
  
      const descripcion = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "es"
      )?.flavor_text || "Sin descripción.";
  
      const locationUrl = `https://pokeapi.co/api/v2/pokemon/${data.id}/encounters`;
      const locationResponse = await fetch(locationUrl);
      const locationsData = await locationResponse.json();
  
      let ubicaciones =
        locationsData.length > 0
          ? locationsData
              .map((loc) => loc.location_area.name.replace(/-/g, " "))
              .join(", ")
          : "Desconocida";
  
      const shinyImages = `
        <img src="${data.sprites.front_shiny}" alt="Shiny Front" class="img-fluid">
        <img src="${data.sprites.back_shiny}" alt="Shiny Back" class="img-fluid">
      `;
  
    let regionalForms = "";
    for (const variety of speciesData.varieties) {
      if (!variety.is_default) {
        const varietyResponse = await fetch(variety.pokemon.url);
        const varietyData = await varietyResponse.json();
        regionalForms += `
          <p>${variety.pokemon.name.toUpperCase()}</p>
          <img src="${varietyData.sprites.front_default}" alt="${variety.pokemon.name}" class="img-fluid">
        `;
      }
    }

    if (!regionalForms) {
      regionalForms = "<p>No tiene formas regionales.</p>";
    }
  
      document.getElementById("nombre").textContent = data.name.toUpperCase();
      document.getElementById("pokedexNum").textContent = `N.º Pokédex: ${data.id}`;
      document.getElementById("imagen").src = data.sprites.front_default;
      document.getElementById("tipo").textContent = `Tipo: ${data.types.map((t) => t.type.name).join(", ")}`;
      document.getElementById("descripcion").textContent = descripcion;
      document.getElementById("ubicacion").textContent = ubicaciones;
      document.getElementById("shinyForms").innerHTML = shinyImages;
      document.getElementById("regionalForms").innerHTML = regionalForms;
  
      $("#pokemonModal").modal("show");
  
      await cambiarColorFondo(data.id);
    } catch (error) {
      alert("Pokémon no encontrado");
      console.error("Error:", error.message);
    }
  }
  
  async function cambiarColorFondo(id) {
    try {
      const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
      const response = await fetch(speciesUrl);
      if (!response.ok) throw new Error("No se pudo obtener el color");
  
      const speciesData = await response.json();
      const color = speciesData.color.name;
  
      const colorMap = {
        black: "#000000",
        blue: "#3B4CCA",
        brown: "#8B4513",
        gray: "#A9A9A9",
        green: "#3DA35D",
        pink: "#FF69B4",
        purple: "#A32CC4",
        red: "#D0312D",
        white: "#EDEDED",
        yellow: "#FFD700",
      };
  
      const bgColor = colorMap[color] || "white";
      const textColor = ["black", "brown", "purple", "blue", "red"].includes(color)
        ? "white"
        : "black";
  
      const modalContent = document.querySelector(".modal-content");
      modalContent.style.backgroundColor = bgColor;
      modalContent.style.color = textColor;
  
      document.querySelectorAll(".modal-body h2, .modal-body h3, .modal-body p, .modal-body h4")
        .forEach(el => el.style.color = textColor);
  
    } catch (error) {
      console.error("Error al obtener el color:", error.message);
    }
  }
  
  