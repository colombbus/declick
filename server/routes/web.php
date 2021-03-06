<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->group(['prefix' => 'api/v1'], function () use ($app) {

    // return groupes lists
    $app->get('groupes','GroupesController@index');
    $app->post('groupes/create', 'GroupesController@create');
    $app->delete('groupes/delete/{groupeId}', 'GroupesController@delete');
    // return user in groupe
    $app->get('groupes/{groupeId}', 'GroupesController@show');
    // register user in groups
    $app->post('groupes/{groupeId}/register/{userId}','GroupesController@registerUser');
    $app->post('groupes/{groupeId}/unregister/{userId}','GroupesController@removeUser');
    // list groups where userId is registered
    $app->get('groupes/member/{userId}','GroupesController@memberOf');
    // list groups user have created
    $app->get('groupes/owner/{userId}','GroupesController@myGroups');

    // users routes
    $app->get('users/me', 'UserController@showCurrentUser');
    $app->get('users', 'UserController@index');
    $app->post('test/username', 'UserController@testUsernameAvailable');
    $app->post('users', 'UserController@create');
    $app->get('users/{id}', [
        'as' => 'users',
        'uses' => 'UserController@show',
     ]);
    $app->group(['middleware' => 'members-only'], function () use ($app) {
        $app->patch('users/{id}', 'UserController@update');
        $app->delete('users/{id}', 'UserController@delete');
    });

    // users projects routes
    $app->group([
        'prefix' => 'users/{userId}',
        'middleware' => 'members-only',
    ], function () use ($app) {
        $app->get('projects', 'UserController@indexProjects');
        $app->get('projects/default', 'UserController@showDefaultProject');
    });

    // users results
    $app->group([
        'prefix' => 'users/{userId}',
        'middleware' => 'members-only',
    ], function () use ($app) {
        $app->get('results', 'UserResultController@index');
        $app->post('results', 'UserResultController@create');
        $app->delete('results', 'UserResultController@delete');
    });

    $app->post('token/{token}/set-results','UserResultController@createByToken');
    $app->get('token/{token}/step-id/{step_id}/get-results','UserResultController@getByToken');
    $app->post('token/{token}/step-id/{step_id}/visited','UserResultController@stepVisited');

    $app->delete('reset/{circuitId}/user-id/{userId}','UserResultController@resetCircuitResults');


    // authorizations routes
    $app->post('login', 'AuthorizationController@create');
    $app->post('logout', 'AuthorizationController@deleteCurrent');
    $app->get('authorizations', 'AuthorizationController@index');
    $app->post('authorizations', 'AuthorizationController@create');
    $app->group(['middleware' => 'members-only'], function () use ($app) {
        $app->get('authorizations/{id}', [
            'as' => 'authorizations',
            'uses' => 'AuthorizationController@show',
        ]);
        $app->delete('authorizations/{id}', 'AuthorizationController@delete');
    });

    // projects routes
    $app->get('projects/exercices','ProjectController@show_exercices');
    $app->get('projects', 'ProjectController@index');
    $app->get('projects/{id}', [
        'as' => 'projects',
        'uses' => 'ProjectController@show',
    ]);

    $app->group(['middleware' => 'members-only'], function () use ($app) {
        $app->post('projects', 'ProjectController@create');
        $app->patch('projects/{id}', 'ProjectController@update');
        $app->delete('projects/{id}', 'ProjectController@delete');
        $app->post('projects/import/{id}','ProjectController@import');           
    });

    // projects resources routes
    $app->get('projects/{projectId}/resources', 'ProjectResourceController@index');

    $app->get(
        'projects/{projectId}/resources/{resourceId}/' .
        'content{extension:(?:\\..+)?}',
        'ProjectResourceController@showContent'
    );

    $app->get(
        'projects/{projectId}/exercicesContent',
        'ProjectResourceController@showExercicesContent'
    );
    
    $app->group([
        'prefix' => 'projects/{patch}',
        'middleware' => 'members-only',
    ], function () use ($app) {
        $app->post('resources', 'ProjectResourceController@create');
        $app->patch(
            'resources/{resourceId}',
            'ProjectResourceController@update'
        );
        $app->post(
            'resources/{resourceId}/content',
            'ProjectResourceController@updateContent'
        );
        $app->get('resources/{resourceId}', [
            'as' => 'resources',
            'uses' => 'ProjectResourceController@show',
        ]);
        $app->delete(
            'resources/{resourceId}',
            'ProjectResourceController@delete'
        );
     
    });

    $app->patch(
        'projects/{projectId}/resources/{resourceId}/contentExercise',
        'ProjectResourceController@exerciseUpdate'
    );
 

    // circuits routes
    $app->get('circuits', 'CircuitController@index');
    $app->post('circuits', 'CircuitController@create');
    $app->get('circuits/{id}', [
        'as' => 'circuits',
        'uses' => 'CircuitController@show',
    ]);
    $app->delete('circuits/{id}', 'CircuitController@delete');

    $app->get('check-step-id','CircuitController@getByUrl');

    // circuits nodes routes
    $app->group(['prefix' => 'circuits/{circuitId}'], function () use ($app) {
        $app->get('nodes', 'CircuitNodeController@index');
        $app->post('nodes', 'CircuitNodeController@create');
        $app->patch('nodes/{nodeId}', 'CircuitNodeController@update');
        $app->get('nodes/{nodeId}', [
            'as' => 'nodes',
            'uses' => 'CircuitNodeController@show',
        ]);
        $app->get(
            'nodes/{nodeId}/children',
            'CircuitNodeController@indexChildren'
        );
        $app->delete('nodes/{nodeId}', 'CircuitNodeController@delete');
    });
});
