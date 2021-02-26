<?php

/*
|--------------------------------------------------------------------------
| routerlication Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an routerlication.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api/v1'], function () use ($router) {

    // users routes
    $router->get('users/me', 'UserController@showCurrentUser');
    $router->get('users', 'UserController@index');
    $router->post('test/username', 'UserController@testUsernameAvailable');
    $router->post('users', 'UserController@create');
    $router->get('users/{id}', [
        'as' => 'users',
        'uses' => 'UserController@show',
     ]);
    $router->group(['middleware' => 'members-only'], function () use ($router) {
        $router->patch('users/{id}', 'UserController@update');
        $router->delete('users/{id}', 'UserController@delete');
    });

    // users projects routes
    $router->group([
        'prefix' => 'users/{userId}',
        'middleware' => 'members-only',
    ], function () use ($router) {
        $router->get('projects', 'UserController@indexProjects');
        $router->get('projects/default', 'UserController@showDefaultProject');
    });

    // users results
    $router->group([
        'prefix' => 'users/{userId}',
        'middleware' => 'members-only',
    ], function () use ($router) {
        $router->get('results', 'UserResultController@index');
        $router->post('results', 'UserResultController@create');
        $router->delete('results', 'UserResultController@delete');
    });

    // authorizations routes
    $router->post('login', 'AuthorizationController@create');
    $router->post('logout', 'AuthorizationController@deleteCurrent');
    $router->get('authorizations', 'AuthorizationController@index');
    $router->post('authorizations', 'AuthorizationController@create');
    $router->group(['middleware' => 'members-only'], function () use ($router) {
        $router->get('authorizations/{id}', [
            'as' => 'authorizations',
            'uses' => 'AuthorizationController@show',
        ]);
        $router->delete('authorizations/{id}', 'AuthorizationController@delete');
    });

    // projects routes
    $router->get('projects', 'ProjectController@index');
    $router->get('projects/{id}', [
        'as' => 'projects',
        'uses' => 'ProjectController@show',
    ]);

    $router->group(['middleware' => 'members-only'], function () use ($router) {
        $router->post('projects', 'ProjectController@create');
        $router->patch('projects/{id}', 'ProjectController@update');
        $router->delete('projects/{id}', 'ProjectController@delete');
        $router->post('projects/import/{id}','ProjectController@import');           
    });

    // projects resources routes
    $router->get(
        'projects/{projectId}/resources', 
        'ProjectResourceController@index'
    );
    $router->get(
        'projects/{projectId}/resources/{resourceId}/' .
        'content{extension:(?:\\..+)?}',
        'ProjectResourceController@showContent'
    );
    $router->get(
        'projects/{projectId}/exercicesContent',
        'ProjectResourceController@showExercicesContent'
    );
    
    $router->group([
        'prefix' => 'projects/{projectId}',
        'middleware' => 'members-only',
    ], function () use ($router) {
        $router->post('resources', 'ProjectResourceController@create');
        $router->patch(
            'resources/{resourceId}',
            'ProjectResourceController@update'
        );
        $router->post(
            'resources/{resourceId}/content',
            'ProjectResourceController@updateContent'
        );
        $router->get('resources/{resourceId}', [
            'as' => 'resources',
            'uses' => 'ProjectResourceController@show',
        ]);
        $router->delete(
            'resources/{resourceId}',
            'ProjectResourceController@delete'
        );
    });

    $router->patch(
        'projects/{projectId}/resources/{resourceId}/contentExercise',
        'ProjectResourceController@exerciseUpdate'
    );
 
    // circuits routes
    $router->get('circuits', 'CircuitController@index');
    $router->post('circuits', 'CircuitController@create');
    $router->get('circuits/{id}', [
        'as' => 'circuits',
        'uses' => 'CircuitController@show',
    ]);
    $router->delete('circuits/{id}', 'CircuitController@delete');

    // circuits nodes routes
    $router->group(['prefix' => 'circuits/{circuitId}'], function () use ($router) {
        $router->get('nodes', 'CircuitNodeController@index');
        $router->post('nodes', 'CircuitNodeController@create');
        $router->patch('nodes/{nodeId}', 'CircuitNodeController@update');
        $router->get('nodes/{nodeId}', [
            'as' => 'nodes',
            'uses' => 'CircuitNodeController@show',
        ]);
        $router->get(
            'nodes/{nodeId}/children',
            'CircuitNodeController@indexChildren'
        );
        $router->delete('nodes/{nodeId}', 'CircuitNodeController@delete');
    });
});
