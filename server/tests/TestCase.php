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

    public function testGetHome()
    {
        $this->GET("api/v1/users")->seeJson(['current_page' => 1]);
        $this->GET("api/v1/users/1")->seeJson(['username' => "benoit"]);

    }

    public function testApplication()
    {
        $user = factories('App\User')->create();

        $this->actingAs($user)
            ->get('/user');
    }


    // circuit test
    public function testGetCircuits()
    {
        $this->GET("api/v1/circuits")->seeJson(['name' => "Bob & Max"]);
        $this->GET("api/v1/circuits/1")->seeJson(['name' => "Bob & Max"]);
        $this->GET("api/v1/circuits/1/nodes")->seeJson(['name' => "Quelques rappels"]);
        $this->GET("api/v1/circuits/1/nodes/1")->seeJson(['name' => null]);
        $this->GET("api/v1/circuits/1/nodes/1/children")->seeJson(['name' => "Création d'un compte"]);
    }
}