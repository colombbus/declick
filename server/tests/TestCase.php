<?php


class TestCase extends Laravel\Lumen\Testing\TestCase
{
    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }


    // users test

    public function testGetNotLoged()
    {
        $this->GET("api/v1/users")->seeJson(['current_page' => 1]);
        $this->GET("api/v1/users/1")->seeJson(['username' => "benoit"]);
    }

    // public function testAllLoged()
    // {
    //     $user = factories('App\User')->create();

    //     $this->actingAs($user)
    //         ->get('/user');
    // }


    // circuit test
    public function testGetCircuits()
    {

        $this->GET("api/v1/circuits")
            ->seeJson(['name' => "Bob & Max"])
            ->seeJson(['short_description' => "Apprends à créer un petit jeu de plateforme avec un seul personnage."])
            ->seeJson(['id' => 1]);

        $this->GET("api/v1/circuits/1")
            ->seeJson(['name' => "Bob & Max"])
            ->seeJson(['short_description' => "Apprends à créer un petit jeu de plateforme avec un seul personnage."])
            ->seeJson(['id' => 1]);

        $this->GET("api/v1/circuits/1/nodes")
            ->seeJson(['name' => "Création d'un compte"])
            ->seeJson(['name' => "Quelques rappels"])
            ->seeJson(['name' => "Robot"]);

        $this->GET("api/v1/circuits/1/nodes/2")
            ->seeJson(['id' => 2])
            ->seeJson(['name' => "Création d'un compte"])
            ->seeJson(['parent_id' => 1]);

        $this->GET("api/v1/circuits/1/nodes/1/children")
            ->seeJson(['id' => 2])
            ->seeJson(['name' => "Création d'un compte"])
            ->seeJson(['parent_id' => 1])
            ->seeJson(['id' => 3])
            ->seeJson(['name' => "Quelques rappels"])
            ->seeJson(['position' => 1]);
    }
}
