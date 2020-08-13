const resources = []

const code = `
etoiles = 14
enAvant = true
function miam(moi, brique) {
	p.retirerBrique(brique)
	etoiles--
	if (etoiles == 0) {
		p.poserBrique('exit',18,8)
	}
}
function sortie(moi, brique) {
	if (etoiles == 0) {
		declick.écrire("gagné")
	}
}
function tir() {
	x = bob.récupérerX()
	y = bob.récupérerY()
	balle = balles.créerSprite(x+10,y+10)
	if (balle) {
		balle.définirVitesse(500)
		if (enAvant) {
			balle.avancerToujours()
		} else {
			balle.reculerToujours()
		}
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
bob.siRencontre(p, sortie, "exit")
balles = new GroupeSprites("image_default_texture", 10)
balles.définirDurée(3000)
caméra.suivre(bob)
répéter() {
	if (clavier.nouvelAppui("haut")) {
		bob.sauter()
	}
	if (clavier.nouvelAppui("espace")) {
		tir()
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

export { resources, code }
