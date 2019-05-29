<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Groupes extends Model
{
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'owner',
        'description'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // public function members()
    // {
    //     return $this->hasMany('App\UserGroupe', 'user')->get();
    // }
}
