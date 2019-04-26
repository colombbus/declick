<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\UserResult;
use App\Authorization;
use App\CircuitNode;

class UserResultController extends Controller
{
    public function index($userId)
    {
        $user = User::findOrFail($userId);

        return response()->json($user->results)->setEncodingOptions(JSON_NUMERIC_CHECK);
    }

    public function createByToken(Request $req, $token){
        $user = Authorization::where('token',$token)->first()->owner();
        $solution = $req->input('solution');
        $step_id = $req->input('step_id');

        $previousResult = UserResult::where([
            'step_id' => $step_id,
            'user_id' => $user->id
        ])->get();
        
        if(!empty($previousResult)){
            foreach($previousResult as $key => $item){
                $item->delete();
            }
        }

        $values = array_only($req->input(), [
            'step_id',
            'passed',
            'solution'
        ]);

        $result = $user->results()->create($values);
        return response($result, 201);

    }
    public function getByToken(Request $req, $token,$step_id) {
        $user = Authorization::where('token',$token)->first()->owner();
        $previousResult = UserResult::where([
            'step_id' => $step_id,
            'user_id' => $user->id
        ])->first();
        //         // var_dump($previousResult);

   
        // print_r($previousResult);
        if(!empty($previousResult)){
            return response($previousResult, 201);
        } else {
            return response(404);
        }
    }
    public function create(Request $request, $userId)
    {
     
        $user = User::findOrFail($userId);

        $previousResult = UserResult::where([
            'step_id' => $request->input('step_id'),
            'user_id' => $userId
        ])->first();

    $values = array_only($request->input(), [
            'step_id',
            'passed',
            'solution'
        ]);

         if(empty($previousResult)){
            $result = $user->results()->create($values);
        }

        return response(200);
    }
    public function stepVisited(Request $request, $token, $step_id){
        $user = Authorization::where('token',$token)->first()->owner();

        $values = array_only($request->input(), [
            'step_id',
            'passed'
        ]);
        $result = $user->results()->create($values);

        return response($result, 200);
    }

    public function delete($userId)
    {
        $user = User::findOrFail($userId);

        $user->results()->delete();

        return response('', 204);
    }

    public function resetCircuitResults($circuitId, $userId) {
        $userResults = User::findOrFail($userId)->results()->get();
        $circuitNodes = CircuitNode::where(['circuit_id'=>$circuitId])->get();

        foreach ($userResults as $index => $result) {
            foreach ($circuitNodes as $key => $value) {
                if($value->id === $result->step_id){
                    $result->delete();
                }
            }
        }

        return response('',204);
    }
}
