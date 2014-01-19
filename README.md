web-app
=======

Utilisation de la recherche Film :

var uneRequete = new Requete();
uneRequete.rechercherFilm({nom: "*odzilla*", debut: null, fin: null}, function(resultat) {
    //traiter le resultat
});

Paramètres de la recherche sur les films :
nom, debut, fin, genre, realisateur
ex : {nom: "*odzilla*", debut: '2010-1-1', fin: '2010-12-31', genre: "Drama", realisateur: "Corki"}

Attention : 
Ne pas mettre de date de début la met par défaut à la date d'il y a une semaine
Ne pas mettre de date de fin la met par défaut à la date du jour
Format de la date : annee-mois-jour

Propriétés du résultat :
id, nom, genres, image, dateSortie, resume, trailers, realisateurs

Attention :
genres, resume, trailers et realisateurs sont des tableaux
image est une URL, on peut y ajouter le paramètre ?&maxwidth=960 (par exemple) pour la redimensionner

------------------------------------------------------------------------------------------------------

Utilisation de la recherche Serie :

var uneRequete = new Requete();
uneRequete.rechercheSerie({nom: "*ost*", debut: null, fin: null}, function(resultat) {
    //traiter le resultat
});

Paramètres de la recherche sur les séries :
nom, debut, fin, genre, realisateur, origine, chaine
exe: {nom: "*ost", debut: null, fin: '2012-7-23', genre:"Drama", realisateur: "Poulou", origine: "Pouet", chaine: "Plop"}

Attention : 
Ne pas mettre de date de début la met par défaut à la date d'il y a une semaine
Ne pas mettre de date de fin la met par défaut à la date du jour
Format de la date : annee-mois-jour

Propriétés du résultat :
id, nom, genres, image, dateSortie, nombreSaisons, chaines, realisateurs, debut, fin

Attention
genres, chaines et realisateurs sont des tableaux
image est une URL, on peut y ajouter le paramètre ?&maxwidth=960 (par exemple) pour la redimensionner
