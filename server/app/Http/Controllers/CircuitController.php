<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Circuit;
use App\CircuitNode;

class CircuitController extends Controller
{
    public function index()
    {
        return Circuit::all();
    }

    public function create(Request $request)
    {
        $values = array_only($request->input(), [
            'name',
            'short_description',
            'description'
        ]);

        $circuit = Circuit::create($values);

        $rootNode = $circuit->nodes()->create([
            'name' => null,
            'link' => null
        ]);

        $circuit->rootNode()->associate($rootNode);

        $circuit->save();

        return response($circuit, 201, [
            'Location' => route('circuits', ['id' => $circuit->id])
        ]);
    }

    public function show($id)
    {
        return Circuit::findOrFail($id);
    }

    public function delete($id)
    {
        $circuit = Circuit::findOrFail($id);

        $circuit->delete();

        return response('', 204);
    }

    public function getByUrl(Request $request){
         $values = array_only($request->input(), [
             'type',
             'id'
        ]);

        $urlSearch = "http://www.declick.net/client/".$values['type']."#".$values['id'];
    // var_dump($urlSearch);

        $node = CircuitNode::where([
            'link' => $urlSearch
        ])->first();
    // var_dump($node);

        $circuit = CircuitNode::where([
            'circuit_id' => $node->circuit_id
        ])->get();
    // var_dump($circuit);
        foreach ($circuit as $key => $value) {
            if($value->link === $urlSearch){
                return response($key + 1,200);
            }
        }
    }
}
