<?php

// use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

use App\Models\Authorization;
use Laravel\Lumen\Testing\TestCase;

use Illuminate\Support\Str;


use App\Models\User;


class TestAuthorizationController extends TestCase
{

    public $username = "testElTest";
    public $password = "testElTesttestElTest";
    // public $token    = Str::random(32);

    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../../bootstrap/app.php';
    }

    public function testCreateUser()
    {

        $this->POST("api/v1/users", [
            "username" => $this->username,
            "password" => $this->password
        ])
            ->assertResponseStatus(201);

        // $this->seeInDatabase("users", ["username" => "testElTest"]);
    }


    public function testLoginUser()
    {
        // // no-user
        // $this->GET("api/v1/users");
        // // $this->assertResponseOk();
        // $this->assertResponseOk();
        // // ->seeJson([]);



        // $user = User::create([
        //     "username" => "el_test",
        //     "password_hash" => Hash::make("test")
        // ]);



        $this->POST("api/v1/login", [
            "username" => $this->username,
            "password" => $this->password
        ])
            ->assertResponseStatus(201);


        // var_dump($user->response->baseResponse);




        // $this->seeJsonStructure(
        //     [
        //         'token',
        //         'owner_id',
        //         'id'
        //     ]
        // );

        // var_dump($resp->response->baseResponse->original);
    }

    // public function testUserId(){

    //     $user =  User::where(["username" => $this->username])->first();

    //     $this->GET("api/v1/users/".$user->id)
    //     ->assertJson("username");
    // }

    public function testDeleteUser()
    {

        $owner = User::where(["username" => $this->username])->first();

        $token_val = Str::random(32);

        $values = ['token' => $token_val];

        $owner->authorizations()->create($values);

        $this->headers["Authorization"] = "Token " . $token_val;

        $this->DELETE(
            "api/v1/users/" . $owner->id,
            // [],
            // ["Authorization" => "Token " . $token_val]
        );
        // ->assertResponseStatus(204);

        var_dump($this->response);

    }
}
