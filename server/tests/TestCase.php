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
        return require __DIR__.'/../bootstrap/app.php';
    }

    public function testGetHome(){
        $this->GET("api/v1/users")->seeJson(['current_page' => 1]);
    }

    // public function testCreateUser(){
    //     $this->POST("api/v1/users")->seeJson(['current_page' => 1]);

    // }

    // public function testApplication()
    // {
    //     $user = factory('App\User')->create();

    //     $this->actingAs($user)
    //          ->get('api/v1/users/me');
    // }
    
    public function testGeUsers_1(){
        $this->GET("api/v1/users/1")->seeJson(['username' => "benoit"]);
    }
}
