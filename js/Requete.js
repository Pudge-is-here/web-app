/**
 * Created by emericgaichet on 05/12/13.
 */
function Requete() {
    var formateur = new FormateurRequete();
    var recherche = new ParametreRequete();
    var traiterLeResultat;
    var requete;
    var curseur;

    this.rechercherFilm = function(param, callback) {
        recherche = new ParametreRequete(param);
        recherche.initialiserLesParametres(formateur);
        traiterLeResultat = callback;
        requete = {
            "type": "/film/film",
            "id": null,
            "name": null,
            "initial_release_date": null,
            "genre": [],
            "tagline": [],
            "trailers": [],
            "directed_by": [],
            "/common/topic/image": {
                "id": null,
                "limit": 1,
                "optional": true
            }
        };
        requete = recherche.ajouterLaRecherchePourLesFilms(requete);
        envoyerLaRequete();
    };
    this.rechercherSerie = function(param, callback) {
        recherche = new ParametreRequete(param);
        recherche.initialiserLesParametres(formateur);
        traiterLeResultat = callback;
        requete = {
            "type": "/tv/tv_program",
            "id": null,
            "name": null,
            "genre": [],
            "air_date_of_first_episode": null,
            "program_creator": [],
            "original_network": [],
            "country_of_origin": [],
            "/tv/tv_network_duration/from": null,
            "/tv/tv_network_duration/to": null,
            "number_of_seasons": null,
            "/common/topic/image": {
                "id": null,
                "limit": 1,
                "optional": true
            }
        };
        requete = recherche.ajouterLaRecherchePourLesSeries(requete);
        envoyerLaRequete();
    };
    this.rechercheSuivante = function(callback) {
        if(callback != null) {
            traiterLeResultat = callback;
        }
        envoyerLaRequete();
    };
    this.recupererLeFilm = function(id, callback) {
      var requeteDetail = {
        "/common/topic/image": {
            "id": null,
            "limit": 1,
            "optional": true
          },
          "directed_by": [],
          "genre": [],
          "id": id,
          "initial_release_date": null,
          "name": null,
          "tagline": [],
          "trailers": [],
          "type": "/film/film"
      };
      envoyerLaRequeteDetail(requeteDetail, callback);
    };
    this.recupererLaSerie = function(id, callback) {
        var requeteDetail = {
            "type": "/tv/tv_program",
            "id": id,
            "name": null,
            "genre": [],
            "air_date_of_first_episode": null,
            "program_creator": [],
            "original_network": [],
            "country_of_origin": [],
            "/tv/tv_network_duration/from": null,
            "/tv/tv_network_duration/to": null,
            "number_of_seasons": null,
            "/common/topic/image": {
              "id": null,
              "limit": 1,
              "optional": true
            }
          };

        envoyerLaRequeteDetail(requeteDetail, callback);

    }

    function envoyerLaRequete() {
        $.getJSON(formateur.formaterLURLRequete(curseur), {query: JSON.stringify([requete])}, function(donnees) {
            curseur = donnees.cursor;
            var donneesFormate = formateur.formaterLeResultat(donnees.result);
            traiterLeResultat(donneesFormate);
        });
    }
    function envoyerLaRequeteDetail(requeteDetail, callback) {
         $.getJSON(formateur.formaterLURLRequete(), {query: JSON.stringify([requeteDetail])}, function(donnees) {
             var donneesFormate = formateur.formaterLeResultat(donnees.result);
             callback(donneesFormate[0]);
           });
    }

}

function ParametreRequete(param) {
    var recherche = param;
    var limite = 10;

    this.ajouterLaRecherchePourLesFilms = function(requete) {
        requete = ajouterUnParametre(requete,"limit", limite);
        requete = ajouterUnParametre(requete,"name~=", recherche.nom);
        requete = ajouterUnParametre(requete,"initial_release_date>=", recherche.debut);
        requete = ajouterUnParametre(requete,"initial_release_date<=", recherche.fin);
        requete = ajouterUnParametre(requete, "genre", recherche.genre);
        requete = ajouterUnParametre(requete, "directed_by", recherche.realisateur);
        return requete;
    }
    this.ajouterLaRecherchePourLesSeries = function(requete) {
        requete = ajouterUnParametre(requete,"limit", limite);
        requete = ajouterUnParametre(requete,"name~=", recherche.nom);
        requete = ajouterUnParametre(requete,"air_date_of_first_episode>=", recherche.debut);
        requete = ajouterUnParametre(requete,"air_date_of_final_episode<=", recherche.fin);
        requete = ajouterUnParametre(requete, "genre", recherche.genre);
        requete = ajouterUnParametre(requete, "program_creator", recherche.realisateur);
        requete = ajouterUnParametre(requete, "country_of_origin", recherche.origine);
        requete = ajouterUnParametre(requete, "original_network", recherche.chaine);
        return requete;
    }
    this.initialiserLesParametres = function (formateur) {
        if(formateur instanceof FormateurRequete) {
            initialiser(formateur);
        }
    }

    function ajouterUnParametre(requete, cle, valeur) {
        if(valeur != null) {
            requete[cle] = valeur;
        }
        return requete;
    }
    function initialiser(formateur) {
        if(!'debut' in recherche) {
            recherche.debut = formateur.dateSemaineDerniere();
        }
        if(!'fin' in param) {
            recherche.fin = formateur.dateDuJour();
        }
    }
}

function FormateurRequete(){
    var baseURLAPI = 'https://www.googleapis.com/freebase/v1/';

    this.dateDuJour = function () {
        var dateDuJour = new Date();
        return transformerLaDateEnChaine(dateDuJour);
    }
    this.dateSemaineDerniere = function () {
        var dateDuJour = new Date();
        var dateSemaineDerniere = new Date(dateDuJour.getFullYear(), dateDuJour.getMonth(), dateDuJour.getDate() - 7);
        return transformerLaDateEnChaine(dateSemaineDerniere);
    }
    this.formaterLURLRequete = function(curseur) {
        var URLRequete = baseURLAPI + 'mqlread?';
        URLRequete += '&cursor';
        if(curseur != null) {
            URLRequete += '=' + curseur;
        }
        return URLRequete;
    }
    this.formaterLeResultat = function (data) {
        resultat = [];
        for(var i = 0; i < data.length; i++) {
            resultat.push(formaterUnElement(data[i]));
        }
        return resultat;
    }

    function transformerLaDateEnChaine(date) {
        return date.getFullYear() + '-' + recupererLeMois() + '-' + recupererLeJour();

        function recupererLeMois() {
            var mois;
            if(date.getMonth() + 1 < 10)
                mois = '0' + date.getMonth() + 1;
            else
                mois = date.getMonth() + 1;
            return mois;
        }
        function recupererLeJour() {
            var jour;
            if(date.getData() < 10)
                jour = '0' + date.getData();
            else
                jour = date.getData();
            return jour;
        }
    }
    function formaterUnElement(element) {
        var elementFormate = {};
        elementFormate.id = element.id;
        elementFormate.nom = element.name;
        elementFormate.genres = element.genre;
        elementFormate.image = ajouterUneImage(element);
        elementFormate = ajouterLesProprietesDesFilms(element, elementFormate);
        elementFormate = ajouterLesProrpietesDesSeries(element, elementFormate);
        return elementFormate;
    }
    function ajouterUneImage(element) {
        var URLImage = baseURLAPI + 'image';
        var image = element["/common/topic/image"];
        if(image != null) {
            return URLImage + image.id;
        }
        return null;
    }
    function ajouterLesProprietesDesFilms(elementSource, elementFormate) {
        if('initial_release_date' in elementSource) {
            elementFormate.dateSortie = elementSource.initial_release_date;
        }
        if('tagline' in elementSource) {
            elementFormate.resume = elementSource.tagline;
        }
        if('trailers' in elementSource) {
            elementFormate.trailers = elementSource.trailers;
        }
        if('directed_by' in elementSource) {
            elementFormate.realisateurs = elementSource.directed_by;
        }
        return elementFormate;
    }
    function ajouterLesProrpietesDesSeries(elementSource, elementFormate) {
        if('air_date_of_first_episode' in elementSource) {
            elementFormate.dateSortie = elementSource.air_date_of_first_episode;
        }
        if('number_of_seasons' in elementSource) {
            elementFormate.nombreSaisons = elementSource.number_of_seasons;
        }
        if('original_network' in elementSource) {
            elementFormate.chaines = elementSource.original_network;
        }
        if('program_creator' in elementSource) {
            elementFormate.realisateurs = elementSource.program_creator;
        }
        if('/tv/tv_network_duration/from' in elementSource) {
            elementFormate.debut= elementSource["/tv/tv_network_duration/from"];
        }
        if('/tv/tv_network_duration/to' in elementSource) {
            elementFormate.fin = elementSource["/tv/tv_network_duration/to"];
        }
        return elementFormate;
    }
}
