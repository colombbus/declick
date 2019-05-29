<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Groupes;
use App\UserGroupes;

class GroupesController extends Controller
{

    public function index(){

        return Groupes::all();
    }

    public function show(Request $request, $groupeId){
        
        $groupe = Groupes::where('id',$groupeId)->firstOrFail();
        $users = UserGroupes::where('groupe_id',$groupeId)->get();
        $list = [];
        
        foreach ($users as $key => $user) {
            array_push($list,User::where('id',$user["user_id"])->firstOrFail());
        }
        $myResp = ['users'=>$list,'groupe'=>$groupe];
        return response($myResp);
    }

    /****
    * 
    * groupes crud
    *
    ****/
    public function create(Request $request){

        $values = array_only($request->input(), [
            'name',
            'owner'
        ]);

        if(Groupes::where('name',$values['name'])->exists()){
            
            // $groupe = Groupes::where('name',$values['name'])->first();

            return response(203);

        } else {
            $groupe = Groupes::create($values);
            return response($groupe, 201);
        }
    }

    public function delete($groupe_id){
        $groupe = Groupes::findOrFail($groupe_id);
        $groupe->delete();
        return response('', 204);
    }

    public function update(){
 
    }

    /****
    * 
    * user groupe crud
    *
    ****/
    public function registerUser(Request $request, $groupeId, $userId){
        $values = ["groupe_id" => $groupeId,"user_id" => $userId];
        if(UserGroupes::where($values)->exists()){
            return response('',203);
        }
        $resgister = UserGroupes::create($values);
        $resgister->groupe_id = $groupeId;
        $resgister->user_id = $userId;
        $resgister->save();
        return response($resgister,201);
    }

    public function  removeUser(Request $request, $groupeId, $userId){
       $unresgister = UserGroupes::where(['user_id'=>$userId,'groupe_id'=>$groupeId])->delete();
        return response($unresgister,204);
    }
}
