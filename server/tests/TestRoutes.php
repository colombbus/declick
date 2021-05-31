<?php

// namespace Laravel\Lumen\Testing\TestCase;

// use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Str;


use App\Models\User;
use Laravel\Lumen\Testing\TestCase;

class TestRoutes extends TestCase
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

    public function test_GET_not_loged()
    {
        $this->GET("api/v1/users")
            ->seeJson(['current_page' => 1])
            ->seeJson(['per_page' => 14]);

        $this->GET("api/v1/users/1")->seeJson(['username' => "benoit"]);
    }

    // public function test_all_loged()
    // {
    
        // $this->GET(
        //     'api/v1/authorizations',
        //     [ "header"=> ["Authorization" => "Token z96e3rtxjdDoDjbmDIuIMT2o8B066Ds8"]]);
            // $this->assertResponseOk();
            // ->seeJson(["owner_id" => "4840"]);
        // $this->receive_json = json_decode($this->response->getContent());
        // $this->seeJson(["owener_id" => "4840"]);
        // var_dump($this->response->getContent());
        // die();
    //     // $this->POST('api/v1/users',[
    //     //     "username" => "TESTS_AUTO_TEST",
    //     //     "password" => "TESTS",
    //     // ]);
    //     // $user = User::create([
    //     //     "username" => "el_test",
    //     //     "password_hash" => Hash::make("test")
    //     // ]);

    //     // $this->seeInDatabase("users", ["username" => "el_test"]);

    //    $this->POST("api/v1/login",[
    //         "username" =>"el_test",
    //         "password" => "test"
    //     ]);
    //     // $user = User::find(1);
    //     // $response = $this->actingAs($user)->GET("api/v1/users/" . $user->id);
    //     $this->seeJsonStructure(
    //         ['data' =>
    //             [
    //                 'token',
    //                 'owner_id',
    //                 'id'
    //             ]
    //         ]    
    //     );
    //     // var_dump($_SESSION);
    //     die();

    //     // $this->GET("api/v1/users/" . $user->id,
    //     //     ["headers"=>
    //     //         ["Authorization" => "Token $resp->token"]
    //     //     ]);
    //     // ->header
    //     //     ->seeJson([
    //     //         "username" => "el_test"
    //     //     ]);

    //     // $this->actingAs($user)
    //         // $this->delete("api/v1/users/" . $user->id)
    //         // ->assertResponseStatus(204);
    // }

    public function test_POST_routes()
    {
        // username existe
        $this->POST("api/v1/test/username", [
            'username' => "benoit",
        ])->seeJson(["result" => false]);

        // username dont existe
        $this->POST("api/v1/test/username", [
            'username' => Str::random(20),
        ])->seeJson(["result" => true]);
    }


    // circuit test
    public function test_GET_circuits()
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
