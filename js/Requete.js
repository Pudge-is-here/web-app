/**
 * Created by emericgaichet on 05/12/13.
 */
function Requete() {
    var baseURI = 'https://www.googleapis.com/freebase/v1/mqlread?';
    var recherche;
    var traiterLeResultat;
    var debut = dateSemaineDerniere();
    var fin = dateDuJour();
    var nom = null;
    var limite = 10;
    var requete;

    this.rechercherFilm = function(param, callback) {
        recherche = param;
        traiterLeResultat = callback;
        if(recherche != null) {
            initialiserLesParametres(recherche);
        }
        requete = {
                "type": "/film/film",
                "limit": limite,
                "id": null,
                "name": null,
                "initial_release_date": null,
                "genre": [],
                "tagline": [],
                "trailers": [],
                "directed_by": []
        };
        ajouterUnParametreDeRecherche("name~=", nom);
        ajouterUnParametreDeRecherche("initial_release_date>=", debut);
        ajouterUnParametreDeRecherche("initial_release_date<=", fin);
        envoyerLaRequete();
    };
    this.rechercherSerie = function(param, callback) {
        recherche = param;
        traiterLeResultat = callback;
        if(recherche != null) {
            initialiserLesParametres(recherche);
        }
        requete = {
                "type": "/tv/tv_program",
                "limit": limite,
                "id": null,
                "name": null,
                "genre": [],
                "program_creator": [],
                "original_network": [],
                "country_of_origin": []
        };
        ajouterUnParametreDeRecherche("name~=", nom);
        ajouterUnParametreDeRecherche("air_date_of_first_episode>=", debut);
        ajouterUnParametreDeRecherche("air_date_of_final_episode<=", fin);
        envoyerLaRequete();
    };
    this.rechercheSuivante = function() {
        envoyerLaRequete();
    };

    function initialiserLesParametres(param) {
        if('debut' in param) {
            debut = param.debut;
        }
        if('fin' in param) {
            fin = param.fin;
        }
        if('nom' in param) {
            nom = param.nom;
        }
        if('limite' in param) {
            limite = param.limite;
        }
    }

    function ajouterUnParametreDeRecherche(cle, valeur) {
        if(valeur != null) {
            requete[cle] = valeur;
        }
    }

    function envoyerLaRequete() {
        console.log(requete);
        $.getJSON(baseURI, {query: JSON.stringify([requete])}, function(data) {
            traiterLeResultat(data.result);
        });
    }

    function dateDuJour() {
        var dateDuJour = new Date();
        return transformerLaDateEnChaine(dateDuJour);
    }

    function dateSemaineDerniere() {
        var dateDuJour = new Date();
        var dateSemaineDerniere = new Date(dateDuJour.getFullYear(), dateDuJour.getMonth(), dateDuJour.getDate() - 7);
        return transformerLaDateEnChaine(dateSemaineDerniere);
    }

    function transformerLaDateEnChaine(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };
}