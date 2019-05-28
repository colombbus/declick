<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Users;
use App\Groupes;
use App\UserGroupes;

class GroupesController extends Controller
{

    public function index(){

        return Groupes::all();
    }

    public function show(Request $request, $groupeId){

        return UserGroupes::where('groupe_id',$groupeId)->get();
    }

    /****
    * 
    * groupes crud
    *
    ****/
    public function create(Request $request){

        $values = array_only($request->input(), [
            'name',
            'user_id'
        ]);
        
        if(Groupes::where('name',$values['name'])->exists()){
            
            // $groupe = Groupes::where('name',$values['name'])->first();

            return response(402);

        } else {

            $groupe = Groupes::create($values);
            return response($groupe, 201);
        }
    }

    public function delete(){

    }

    public function update(){

    }

    /****
    * 
    * user groupe crud
    *
    ****/
    public function registerUser(){

    }

    public function  removeUser(){

    }
}
