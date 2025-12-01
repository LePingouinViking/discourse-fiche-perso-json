import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "fiche-perso-json",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      api.decorateCookedElement(
        (elem) => {
          // Cherche les pièces jointes JSON
          elem.querySelectorAll('a.attachment[href$=".json"]').forEach((link) => {
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
                  console.error("JSON invalide pour fiche perso :", e);
                  return;
                }

                const safe = (v) => (v ? String(v) : "");

                const card = document.createElement("div");
                card.className = "fiche-perso-card";

                card.innerHTML = `
                  <div class="fiche-perso-header">
                    ${
                      safe(data.avatarUrl)
                        ? `
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
