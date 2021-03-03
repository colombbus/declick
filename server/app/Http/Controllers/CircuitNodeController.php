<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

use App\Models\Circuit;
use App\Models\CircuitNode;

class CircuitNodeController extends Controller
{
    public function index($circuitId)
    {
        $circuit = Circuit::findOrFail($circuitId);

        return $circuit->nodes()->get();
    }

    public function create(Request $request, $circuitId)
    {
        $circuit = Circuit::findOrFail($circuitId);

        $values = Arr::only($request->input(), [
            'name',
            'link',
            'parent_id',
            'position',
        ]);

        $node = $circuit->nodes()->create($values);

        return response($node, 201, [
            'Location' => route('nodes', [
                'circuitId' => $circuit->id,
                'nodeId' => $node->id,
             ])
        ]);
    }

    public function update(Request $request, $circuitId, $nodeId)
    {
        Circuit::findOrFail($circuitId);

        $node = CircuitNode::findOrFail($nodeId);

        $values = Arr::only($request->input(), [
            'name',
            'link',
            'parent_id',
            'position',
        ]);

        $node->update($values);

        return $node;
    }

    public function show($circuitId, $nodeId)
    {
        $circuit = Circuit::findOrFail($circuitId);

        return CircuitNode::findOrFail($nodeId);
    }

    public function indexChildren($circuitId, $nodeId)
    {
        $circuit = Circuit::findOrFail($circuitId);

        $node = CircuitNode::findOrFail($nodeId);

        return $node->children()->get();
    }

    public function delete($circuitId, $nodeId)
    {
        $circuit = Circuit::findOrFail($circuitId);

        $node = CircuitNode::findOrFail($nodeId);

        $node->delete();

        return response('', 204);
    }
}
