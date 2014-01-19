/**
 * Created by Yoann on 05/12/13.
 */
$.getScript("js/Requete.js", function(){

    alert("Script loaded and executed.");
    // Here you can use anything you defined in the loaded script
});

function openMoreFilter() {
        $('#filtres-additionnels').slideToggle();

}

function recherche(){
    var _nom, _debut, _fin, _genre, _chaine, _pays, _createur;

    _nom = $('#series-nom').val();
    _debut = $('#series-date-debut').val();
    _fin = $('#series-date-fin').val();
    _genre = $('#series-genres select').val();
    _chaine = $('#series-chaines select').val();
    _pays = $('#series-pays select').val();
    _createur = $('#series-createur').val();
    alert(1);
    var uneRequete = new Requete();
    uneRequete.rechercheSerie({nom: "*"+_nom+"*", debut: null, fin: null}, function(resultat) {
        //traiter le resultat
        alert(2);
    });
}