import { withPluginApi } from "discourse/lib/plugin-api";

function escapeHtml(value) {
  if (!value && value !== 0) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeText(value) {
  return value ? String(value) : "";
}

// Convertit les sauts de lignes en <br>
function nl2br(value) {
  if (!value) {
    return "";
  }
  return escapeHtml(value).replace(/\n/g, "<br>");
}

// Mapping des magies (doit correspondre aux clés de la page HTML)
const MAGIES_LABELS = {
  KaelrunThar: "Kaelrun’Thar — Feu Sourd (nain)",
  AevoraLys: "Aevora’Lys — Souffle Vivant (wyverien)",
  AerThalan: "Aer’Thalan — Parole de l’Orage (skayane)",
  NarethEn: "Nareth’En — Art du Lien (humain)",
  LireaNym: "Lirea’Nym — Mémoire des Marées (lireathi)",
  ElyndarKaen: "Elyndar’Kaen — Voix du Silence (aelran)",
  OrmahDur: "Ormah’Dur — Souffle Rouge (orc)",
  SerynThalor: "Seryn’Thalor — Chant des Astres",
  VaelSoth: "Vael’Soth — Ombre du Chant (interdite)",
  ThalyrEn: "Thalyr’En — Vibration du monde",
  MyrSael: "Myr’Sael — Souffle des rêves",
  OrisTael: "Oris’Tael — Compas des âges",
  // 🔹 Nouvelle entrée pour la magie indéterminée / inconnue
  MagieInconnue: "Magie indéterminée ou inconnue",
};

// Arts muets
const ARTS_MUETS_LABELS = {
  OndeStable: "L’onde stable",
  GeometrieVide: "La géométrie du vide",
  HarmoniquePensee: "L’harmonique de pensée",
  ResonanceFractale: "La résonance fractale",
  MesureAbsolue: "La mesure absolue",
  VibrationDirigee: "La vibration dirigée",
  CalculResonnant: "Le calcul résonnant",
  DisciplineNeant: "La discipline du néant",
  ArtSilencePur: "L’art du silence pur",
};

function renderCardFromData(data) {
  const nom = escapeHtml(data.nom || "(Sans nom)");
  const surnom = safeText(data.surnom);
  const avatar = safeText(data.avatarUrl);
  const peuple = escapeHtml(data.peuple || "—");
  const sousFaction = escapeHtml(data.sousFaction || "");
  const origine = escapeHtml(data.lieuOrigine || "—");
  const alignement = escapeHtml(data.alignement || "—");
  const age = escapeHtml(data.age || "—");
  const taille = escapeHtml(data.taille || "—");
  const poids = escapeHtml(data.poids || "—");
  const estFerreux = !!data.estFerreux;
  const estPNJ = !!data.drapeauPNJ;

  const descriptionCourte = nl2br(data.descriptionCourte || "");
  const historique = nl2br(data.historique || "");
  const objectifs = nl2br(data.objectifs || "");
  const inventaire = nl2br(data.inventaire || "");
  const contacts = nl2br(data.contacts || "");
  const notes = nl2br(data.notes || "");
  const comboNotes = nl2br(data.combinaisonNotes || "");
  const artsMuetsNotes = nl2br(data.artsMuetsNotes || "");
  // 🔹 Nouveau : description de la magie inconnue
  const magieInconnueDesc = nl2br(data.magieInconnueDesc || "");

  const traits = Array.isArray(data.traits) ? data.traits : [];
  const faiblesses = Array.isArray(data.faiblesses) ? data.faiblesses : [];

  const magies =
    data.magies && typeof data.magies === "object" ? data.magies : {};
  const artsMuets =
    data.artsMuets && typeof data.artsMuets === "object" ? data.artsMuets : {};

  const magiesHtml = Object.keys(magies)
    .filter((key) => magies[key])
    .map((key) => {
      const label = MAGIES_LABELS[key] || key;
      return `<span class="fiche-perso-badge">${escapeHtml(label)}</span>`;
    })
    .join(" ");

  const artsMuetsHtml = Object.keys(artsMuets)
    .filter((key) => artsMuets[key])
    .map((key) => {
      const label = ARTS_MUETS_LABELS[key] || key;
      return `<span class="fiche-perso-pill">${escapeHtml(label)}</span>`;
    })
    .join(" ");

  const traitsHtml = traits
    .map((t) => `<span class="fiche-perso-pill">${escapeHtml(t)}</span>`)
    .join(" ");

  const faiblessesHtml = faiblesses
    .map(
      (t) =>
        `<span class="fiche-perso-pill fiche-perso-pill-weak">${escapeHtml(
          t
        )}</span>`
    )
    .join(" ");

  const metaParts = [];
  if (peuple && peuple !== "—") {
    metaParts.push(peuple);
  }
  if (sousFaction) {
    metaParts.push(sousFaction);
  }
  if (origine && origine !== "—") {
    metaParts.push(origine);
  }

  const metaLine = metaParts.join(" • ");

  const hasMagieInconnue = !!magies.MagieInconnue;

  return `
<div class="fiche-perso-card">
  <div class="fiche-perso-header">
    ${
      avatar
        ? `<div class="fiche-perso-avatar">
          <img src="${escapeHtml(
            avatar
          )}" alt="Avatar de ${nom}">
        </div>`
        : ""
    }
    <div class="fiche-perso-main">
      <div class="fiche-perso-title-row">
        <h2 class="fiche-perso-nom">
          ${nom}
          ${
            surnom
              ? `<span class="fiche-perso-surnom">« ${escapeHtml(
                  surnom
                )} »</span>`
              : ""
          }
        </h2>
        ${
          estPNJ
            ? `<span class="fiche-perso-badge fiche-perso-badge-pnj">PNJ</span>`
            : ""
        }
        ${
          estFerreux
            ? `<span class="fiche-perso-badge fiche-perso-badge-ferreux">Ferreux</span>`
            : ""
        }
      </div>
      ${
        metaLine
          ? `<p class="fiche-perso-meta">${metaLine}</p>`
          : ""
      }
    </div>
  </div>

  <div class="fiche-perso-body">
    ${
      descriptionCourte
        ? `<div class="fiche-perso-section">
            <h3>Description</h3>
            <p class="fiche-perso-desc">${descriptionCourte}</p>
          </div>`
        : ""
    }

    <div class="fiche-perso-section fiche-perso-stats">
      ${
        age !== "—"
          ? `<div><span>Âge</span><strong>${age}</strong></div>`
          : ""
      }
      ${
        taille !== "—"
          ? `<div><span>Taille</span><strong>${taille}</strong></div>`
          : ""
      }
      ${
        poids !== "—"
          ? `<div><span>Poids</span><strong>${poids}</strong></div>`
          : ""
      }
      ${
        alignement !== "—"
          ? `<div><span>Alignement</span><strong>${alignement}</strong></div>`
          : ""
      }
      ${
        origine !== "—"
          ? `<div><span>Origine</span><strong>${origine}</strong></div>`
          : ""
      }
    </div>

    <div class="fiche-perso-grid">
      <div>
        <div class="fiche-perso-section">
          <h3>Traits</h3>
          <div>${traitsHtml || "<em>Aucun renseigné</em>"}</div>
        </div>
        <div class="fiche-perso-section">
          <h3>Faiblesses</h3>
          <div>${faiblessesHtml || "<em>Aucune renseignée</em>"}</div>
        </div>
      </div>

      <div>
        <div class="fiche-perso-section">
          <h3>Magies maîtrisées</h3>
          <div>${magiesHtml || "<em>Aucune magie renseignée</em>"}</div>
        </div>
        ${
          comboNotes
            ? `<div class="fiche-perso-section">
                <h4>Notes de combinaisons</h4>
                <p>${comboNotes}</p>
              </div>`
            : ""
        }
        ${
          hasMagieInconnue && magieInconnueDesc
            ? `<div class="fiche-perso-section">
                <h4>Magie indéterminée / inconnue</h4>
                <p>${magieInconnueDesc}</p>
              </div>`
            : ""
        }
      </div>
    </div>

    <div class="fiche-perso-grid">
      <div>
        <div class="fiche-perso-section">
          <h3>Arts muets pratiqués</h3>
          <div>${artsMuetsHtml || "<em>—</em>"}</div>
        </div>
        ${
          artsMuetsNotes
            ? `<div class="fiche-perso-section">
                <h4>Notes d’art muet</h4>
                <p>${artsMuetsNotes}</p>
              </div>`
            : ""
        }
      </div>

      <div>
        <div class="fiche-perso-section">
          <h3>Inventaire & ressources</h3>
          <p>${inventaire || "<em>—</em>"}</p>
        </div>
        <div class="fiche-perso-section">
          <h3>Contacts / Alliés / Rivaux</h3>
          <p>${contacts || "<em>—</em>"}</p>
        </div>
      </div>
    </div>

    ${
      historique
        ? `<div class="fiche-perso-section">
            <h3>Histoire</h3>
            <p>${historique}</p>
          </div>`
        : ""
    }

    ${
      objectifs
        ? `<div class="fiche-perso-section">
            <h3>Objectifs</h3>
            <p>${objectifs}</p>
          </div>`
        : ""
    }

    ${
      notes
        ? `<div class="fiche-perso-section">
            <h3>Notes</h3>
            <p>${notes}</p>
          </div>`
        : ""
    }
  </div>
</div>
`;
}

function decorateCooked(elem) {
  if (!elem) {
    return;
  }

  const links = elem.querySelectorAll('a.attachment[href$=".json"]');

  links.forEach((link) => {
    if (link.dataset.fichePersoEnhanced === "1") {
      return;
    }
    link.dataset.fichePersoEnhanced = "1";

    fetch(link.href)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Réponse HTTP incorrecte");
        }
        return response.text();
      })
      .then((text) => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON invalide pour fiche perso :", e);
          return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "fiche-perso-wrapper";
        wrapper.innerHTML = renderCardFromData(data);

        link.classList.add("fiche-perso-json-link");
        link.textContent = "Télécharger la fiche (JSON)";

        link.insertAdjacentElement("afterend", wrapper);
      })
      .catch((e) => {
        console.error("Erreur de chargement de la fiche perso JSON :", e);
      });
  });
}

export default {
  name: "fiche-perso-json",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      api.decorateCookedElement(decorateCooked, {
        id: "fiche-perso-json-renderer",
      });
    });
  },
};
