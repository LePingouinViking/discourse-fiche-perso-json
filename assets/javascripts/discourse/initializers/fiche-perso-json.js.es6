import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "fiche-perso-json",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      // --- Constantes communes avec la page HTML de création de fiche ---
      const MAGIES = [
        { key: "KaelrunThar", label: "Kaelrun’Thar — Feu Sourd (nain)" },
        { key: "AevoraLys", label: "Aevora’Lys — Souffle Vivant (wyverien)" },
        { key: "AerThalan", label: "Aer’Thalan — Parole de l’Orage (skayane)" },
        { key: "NarethEn", label: "Nareth’En — Art du Lien (humain)" },
        { key: "LireaNym", label: "Lirea’Nym — Mémoire des Marées (lireathi)" },
        { key: "ElyndarKaen", label: "Elyndar’Kaen — Voix du Silence (aelran)" },
        { key: "OrmahDur", label: "Ormah’Dur — Souffle Rouge (orc)" },
        { key: "SerynThalor", label: "Seryn’Thalor — Chant des Astres" },
        { key: "VaelSoth", label: "Vael’Soth — Ombre du Chant (interdite)" },
        { key: "ThalyrEn", label: "Thalyr’En — Vibration du monde" },
        { key: "MyrSael", label: "Myr’Sael — Souffle des rêves" },
        { key: "OrisTael", label: "Oris’Tael — Compas des âges" },
      ];

      const ARTS_MUETS = [
        { key: "OndeStable",        label: "L’onde stable" },
        { key: "GeometrieVide",     label: "La géométrie du vide" },
        { key: "HarmoniquePensee",  label: "L’harmonique de pensée" },
        { key: "ResonanceFractale", label: "La résonance fractale" },
        { key: "MesureAbsolue",     label: "La mesure absolue" },
        { key: "VibrationDirigee",  label: "La vibration dirigée" },
        { key: "CalculResonnant",   label: "Le calcul résonnant" },
        { key: "DisciplineNeant",   label: "La discipline du néant" },
        { key: "ArtSilencePur",     label: "L’art du silence pur" },
      ];

      const esc = (v) =>
        v
          ? String(v)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;")
          : "";

      const nl2br = (v) => (v ? esc(v).replace(/\n/g, "<br>") : "");

      const renderCardHtml = (dataRaw) => {
        const data = dataRaw || {};

        const magiesBadges = MAGIES
          .filter((m) => data.magies && data.magies[m.key])
          .map(
            (m) =>
              `<span class="fiche-perso-pill fiche-perso-pill-magic">${esc(
                m.label
              )}</span>`
          )
          .join(" ");

        const artsBadges = ARTS_MUETS
          .filter((a) => data.artsMuets && data.artsMuets[a.key])
          .map(
            (a) =>
              `<span class="fiche-perso-pill fiche-perso-pill-art">${esc(
                a.label
              )}</span>`
          )
          .join(" ");

        const traitsHtml = (data.traits || [])
          .map(
            (t) => `<span class="fiche-perso-pill">${esc(t)}</span>`
          )
          .join(" ");

        const faibHtml = (data.faiblesses || [])
          .map(
            (t) =>
              `<span class="fiche-perso-pill fiche-perso-pill-faib">${esc(
                t
              )}</span>`
          )
          .join(" ");

        const updatedAt = data.updatedAt
          ? new Date(data.updatedAt).toLocaleString("fr-FR")
          : "";

        return `
<div class="fiche-perso-card">
  <div class="fiche-perso-header">
    ${
      data.avatarUrl
        ? `<div class="fiche-perso-avatar">
            <img src="${esc(data.avatarUrl)}" alt="Avatar de ${esc(
            data.nom || "personnage"
          )}">
          </div>`
        : ""
    }
    <div class="fiche-perso-main">
      <h2 class="fiche-perso-nom">
        ${esc(data.nom) || "Nom inconnu"}
        ${
          data.surnom
            ? `<span class="fiche-perso-surnom">— « ${esc(
                data.surnom
              )} »</span>`
            : ""
        }
      </h2>
      <p class="fiche-perso-meta">
        ${[data.peuple, data.sousFaction, data.lieuOrigine]
          .filter(Boolean)
          .map(esc)
          .join(" — ") || "—"}
      </p>
      <div class="fiche-perso-tags">
        ${
          data.estFerreux
            ? `<span class="fiche-perso-badge fiche-perso-badge-ferreux">Ferreux</span>`
            : ""
        }
        ${
          data.drapeauPNJ
            ? `<span class="fiche-perso-badge fiche-perso-badge-pnj">PNJ</span>`
            : ""
        }
      </div>
      ${
        updatedAt
          ? `<div class="fiche-perso-date">Dernière mise à jour : ${esc(
              updatedAt
            )}</div>`
          : ""
      }
    </div>
  </div>

  <div class="fiche-perso-body">

    <div class="fiche-perso-section-grid">
      <section>
        <h3>Profil</h3>
        <div>Origine : ${esc(data.lieuOrigine || "—")}</div>
        <div>Alignement : ${esc(data.alignement || "—")}</div>
        <div>Âge : ${esc(data.age || "—")}</div>
        <div>Taille : ${esc(data.taille || "—")}</div>
        <div>Poids : ${esc(data.poids || "—")}</div>
      </section>
      <section>
        <h3>Description</h3>
        <p class="fiche-perso-desc">${nl2br(
          data.descriptionCourte || "—"
        )}</p>
      </section>
    </div>

    <div class="fiche-perso-section-grid">
      ${
        data.historique
          ? `<section>
              <h3>Histoire</h3>
              <p>${nl2br(data.historique)}</p>
            </section>`
          : ""
      }
      ${
        data.objectifs
          ? `<section>
              <h3>Objectifs</h3>
              <p>${nl2br(data.objectifs)}</p>
            </section>`
          : ""
      }
    </div>

    <div class="fiche-perso-section-grid">
      <section>
        <h3>Traits</h3>
        <div>${traitsHtml || "—"}</div>
        <h3 style="margin-top:1rem">Faiblesses</h3>
        <div>${faibHtml || "—"}</div>
      </section>
      <section>
        <h3>Magies maîtrisées</h3>
        <div>${magiesBadges || "—"}</div>
        ${
          data.combinaisonNotes
            ? `<h4>Notes de combinaisons (Art du Lien)</h4>
               <p class="fiche-perso-notes-combo">${nl2br(
                 data.combinaisonNotes
               )}</p>`
            : ""
        }
      </section>
    </div>

    <div class="fiche-perso-section-grid">
      <section>
        <h3>Arts muets pratiqués</h3>
        <div>${artsBadges || "—"}</div>
        ${
          data.artsMuetsNotes
            ? `<p class="fiche-perso-notes-arts">${nl2br(
                data.artsMuetsNotes
              )}</p>`
            : ""
        }
      </section>
      <section>
        ${
          data.inventaire
            ? `<h3>Inventaire</h3>
               <p>${nl2br(data.inventaire)}</p>`
            : ""
        }
        ${
          data.contacts
            ? `<h3 style="margin-top:1rem">Contacts / Alliés / Rivaux</h3>
               <p>${nl2br(data.contacts)}</p>`
            : ""
        }
      </section>
    </div>

    ${
      data.notes
        ? `<div class="fiche-perso-section">
             <h3>Notes</h3>
             <p>${nl2br(data.notes)}</p>
           </div>`
        : ""
    }

    ${
      data.drapeauPNJ
        ? `<div class="fiche-perso-section">
             <span class="fiche-perso-badge fiche-perso-badge-pnj-large">
               PERSONNAGE NON-JOUEUR (PNJ)
             </span>
           </div>`
        : ""
    }

  </div>
</div>`;
      };

      // --- Décoration des messages ---
      api.decorateCookedElement(
        (elem) => {
          // Cherche les pièces jointes JSON
          elem.querySelectorAll('a.attachment[href$=".json"]').forEach(
            (link) => {
              if (link.dataset.fichePersoEnhanced === "1") {
                return;
              }
              link.dataset.fichePersoEnhanced = "1";

              fetch(link.href)
                .then((r) => r.text())
                .then((text) => {
                  let data;
                  try {
                    data = JSON.parse(text);
                  } catch (e) {
                    console.error(
                      "JSON invalide pour fiche perso :",
                      e
                    );
                    return;
                  }

                  const card = document.createElement("div");
                  card.className = "fiche-perso-wrapper";
                  card.innerHTML = renderCardHtml(data);

                  // Le lien reste pour téléchargement
                  link.classList.add("fiche-perso-json-link");
                  link.textContent = "Télécharger la fiche (JSON)";

                  // On insère la fiche sous le lien
                  link.insertAdjacentElement("afterend", card);
                })
                .catch((e) => {
                  console.error(
                    "Erreur de chargement de la fiche perso JSON :",
                    e
                  );
                });
            }
          );
        },
        { id: "fiche-perso-json-renderer" }
      );
    });
  },
};                        ? `
                    <div class="fiche-perso-avatar">
                      <img src="${safe(
                        data.avatarUrl
                      )}" alt="Avatar de ${safe(data.nom) || "personnage"}">
                    </div>`
                        : ""
                    }
                    <div class="fiche-perso-main">
                      <h2 class="fiche-perso-nom">
                        ${safe(data.nom) || "Nom inconnu"}
                        ${
                          safe(data.surnom)
                            ? `<span class="fiche-perso-surnom">« ${safe(
                                data.surnom
                              )} »</span>`
                            : ""
                        }
                      </h2>
                      <p class="fiche-perso-meta">
                        ${[
                          safe(data.peuple),
                          safe(data.sousFaction),
                          safe(data.lieuOrigine),
                        ]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                  </div>

                  <div class="fiche-perso-body">
                    ${
                      safe(data.descriptionCourte)
                        ? `<p class="fiche-perso-desc">${safe(
                            data.descriptionCourte
                          )}</p>`
                        : ""
                    }

                    <div class="fiche-perso-stats">
                      ${
                        safe(data.age)
                          ? `<div><span>Âge</span><strong>${safe(
                              data.age
                            )}</strong></div>`
                          : ""
                      }
                      ${
                        safe(data.taille)
                          ? `<div><span>Taille</span><strong>${safe(
                              data.taille
                            )}</strong></div>`
                          : ""
                      }
                      ${
                        safe(data.poids)
                          ? `<div><span>Poids</span><strong>${safe(
                              data.poids
                            )}</strong></div>`
                          : ""
                      }
                      ${
                        safe(data.alignement)
                          ? `<div><span>Alignement</span><strong>${safe(
                              data.alignement
                            )}</strong></div>`
                          : ""
                      }
                    </div>

                    ${
                      safe(data.historique)
                        ? `
                      <div class="fiche-perso-section">
                        <h3>Histoire</h3>
                        <p>${safe(data.historique)}</p>
                      </div>`
                        : ""
                    }

                    ${
                      safe(data.objectifs)
                        ? `
                      <div class="fiche-perso-section">
                        <h3>Objectifs</h3>
                        <p>${safe(data.objectifs)}</p>
                      </div>`
                        : ""
                    }

                    ${
                      safe(data.inventaire)
                        ? `
                      <div class="fiche-perso-section">
                        <h3>Inventaire</h3>
                        <p>${safe(data.inventaire)}</p>
                      </div>`
                        : ""
                    }

                    ${
                      safe(data.contacts)
                        ? `
                      <div class="fiche-perso-section">
                        <h3>Contacts</h3>
                        <p>${safe(data.contacts)}</p>
                      </div>`
                        : ""
                    }

                    ${
                      safe(data.notes)
                        ? `
                      <div class="fiche-perso-section">
                        <h3>Notes</h3>
                        <p>${safe(data.notes)}</p>
                      </div>`
                        : ""
                    }
                  </div>
                `;

                // Le lien reste pour téléchargement
                link.classList.add("fiche-perso-json-link");
                link.textContent = "Télécharger la fiche (JSON)";

                // On insère la fiche sous le lien
                link.insertAdjacentElement("afterend", card);
              })
              .catch((e) => {
                console.error(
                  "Erreur de chargement de la fiche perso JSON :",
                  e
                );
              });
          });
        },
        { id: "fiche-perso-json-renderer" }
      );
    });
  },
};
