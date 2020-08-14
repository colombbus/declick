const description =
  "Montre comment utiliser l'objet Plateforme et agir sur ses briques. (flèches pour avancer, espace pour sauter)"

const resources = {}

const code = `etoiles = 14
function miam(moi, brique) {
	p.retirerBrique(brique)
	etoiles--
	if (etoiles == 0) {
		p.poserBrique('exit',18,8)
	}
}
p = new Plateforme()
p.sélectionnerCouche("stars")
p.poserBrique("entry", 18, 8)
bob = new Promeneur()
bob.définirPosition(80,40)
bob.peutTomber()
bob.définirGravité(500)
bob.définirAmplitudeSaut(400)
bob.ajouterBloc(p)
bob.siRencontre(p, miam, "star")
répéter() {
	if (clavier.nouvelAppui("espace")) {
		bob.sauter()
	}
	if (clavier.droite) {
		bob.avancerToujours()
	}
	else if (clavier.gauche) {
		bob.reculerToujours()
	} else {
		bob.arrêter()
	}
}
`

export { description, resources, code }
