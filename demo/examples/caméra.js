const description =
  "Montre comment utiliser l'objet caméra pour suivre un Sprite"

const resources = {}

const code = `p = new Plateforme()
bob = new Promeneur()
bob.définirPosition(80,40)
bob.peutTomber()
bob.définirGravité(500)
bob.définirAmplitudeSaut(400)
bob.ajouterBloc(p)
caméra.suivre(bob)
répéter() {
	if (clavier.nouvelAppui("espace")) {
		bob.sauter()
	}
	if (clavier.droite) {
		enAvant = true
		bob.avancerToujours()
	}
	else if (clavier.gauche) {
		enAvant = false
		bob.reculerToujours()
	} else {
		bob.arrêter()
	}
}
`

export { description, resources, code }
