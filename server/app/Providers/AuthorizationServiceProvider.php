<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

use App\Policies\AuthorizationPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ProjectResourcePolicy;
use App\Policies\UserPolicy;

use App\Models\Authorization;
use App\Models\Project;
use App\Models\ProjectResource;
use App\Models\User;

class AuthorizationServiceProvider extends ServiceProvider
{
    /**
     * Boot the authorization services for the application.
     *
     * @return void
     */
    public function boot()
    {
        Gate::policy(Authorization::class, AuthorizationPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(ProjectResource::class, ProjectResourcePolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        Auth::viaRequest('api', function ($request) {
            if (!function_exists('getallheaders')) {
                function getallheaders()
                {
                    $headers = [];
                    foreach ($_SERVER as $name => $value) {
                        if (substr($name, 0, 5) == 'HTTP_') {
                            $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                        }
                    }
                    // return $headers;
                }
            } else {
                $headers = getallheaders();
            }

            if (isset($headers['Authorization'])) {

                list($type, $value) =
                    explode(' ', $headers['Authorization'], 2);

                if ($type === 'Token') {
                    $authorization = Authorization
                        ::where(['token' => $value])
                        ->first();

                    if ($authorization) {
                        return $authorization->owner();
                    }
                }
            }
        });
    }
}
