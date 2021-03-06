<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\filesystem\Filesystem;

use App\Project;
use App\ProjectResource;

class ProjectResourceController extends Controller
{
    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);

        return $project->resources()->get();
    }

    public function create(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $this->authorize('create', [ProjectResource::class, $project]);

        $this->validate($request, [
            'file_name' => 'required|max:255',
            'media_type' => 'required|max:255',
        ]);

        $values = array_only($request->input(), [
            'file_name',
            'media_type',
        ]);

        $resource = $project->resources()->create($values);

        return response($resource, 201, [
            'Location' => route('resources', [
                'projectId' => $project->id,
                'resourceId' => $resource->id,
             ])
        ]);
    }

    public function update(Request $request, $resourceId, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $resource = $project->resources()->findOrFail($resourceId);

        $this->authorize('update', $resource);

        $this->validate($request, [
            'file_name' => 'max:255',
            'media_type' => 'max:255',
        ]);

        $values = array_only($request->input(), [
            'file_name',
            'media_type',
        ]);

        $resource->update($values);

        return $resource;
    }

    public function exerciseUpdate(Request $request,$projectId,$resourceId){
        
        $project = Project::findOrFail($projectId);

        $resource = $project->resources()->findOrFail($resourceId);

        // $this->authorize('updateContent', $resource);

        $directoryPath =
            storage_path('app/projects/' . $projectId . '/resources');
        $filePath = $directoryPath . '/' . $resourceId;

        if (!file_exists($directoryPath)) {
            mkdir($directoryPath, 0755, true);
        }

        if ($request->hasFile('data')) {
            \Illuminate\Support\Facades\File::move(
                $request->file('data')->getPath() .
                DIRECTORY_SEPARATOR .
                $request->file('data')->getFileName(),
                $filePath
            );
        } else {
            $fileContents = $request->getContent();
            $index = strpos($fileContents, 'data:image/png;base64,');
            if ($index === 0) {
                $fileContents = substr($fileContents, 22);
                $fileContents = base64_decode($fileContents);
            }
            file_put_contents($filePath, $fileContents);
        }

        return response('', 204);
    }
    public function updateContent(
        Request $request,
        // weird error oblige us to interveting resourceID and projectID
        $resourceId,
        $projectId)
    {
        $project = Project::findOrFail($projectId);

        $resource = $project->resources()->findOrFail($resourceId);

        $this->authorize('updateContent', $resource);

        $directoryPath =
            storage_path('app/projects/' . $projectId . '/resources');
        $filePath = $directoryPath . '/' . $resourceId;

        if (!file_exists($directoryPath)) {
            mkdir($directoryPath, 0755, true);
        }

        if ($request->hasFile('data')) {
            \Illuminate\Support\Facades\File::move(
                $request->file('data')->getPath() .
                DIRECTORY_SEPARATOR .
                $request->file('data')->getFileName(),
                $filePath
            );
        } else {
            $fileContents = $request->getContent();
            $index = strpos($fileContents, 'data:image/png;base64,');
            if ($index === 0) {
                $fileContents = substr($fileContents, 22);
                $fileContents = base64_decode($fileContents);
            }
            file_put_contents($filePath, $fileContents);
        }

        return response('', 204);
    }

    public function show($projectId, $resourceId)
    {
        $project = Project::findOrFail($projectId);

        return $project->resources()->findOrFail($resourceId);
    }

    public function showContent($projectId, $resourceId)
    {
        $project = Project::findOrFail($projectId);

        $resource = $project->resources()->findOrFail($resourceId);
        
        $directoryPath =
            storage_path('app/projects/' . $projectId . '/resources');
        $filePath = $directoryPath . '/' . $resourceId;

        $fileContent = '';

        if (file_exists($filePath)) {
            $fileContent = file_get_contents($filePath);
        }

        return response($fileContent, 200, [
            'Content-Type' => $resource->media_type,
        ]);
    }

    public function showExercicesContent($projectId){
        
        $project = Project::findOrFail($projectId);

        if($project->is_exercise){

            $resources = $project->resources()->get();
            $resourcesContent = [];
            foreach ($resources as $key => $resource) {
                
                // $resource = $project->resources()->findOrFail($resourceId);
                $directoryPath = storage_path('app/projects/' . $resource->project_id . '/resources');
                $filePath = $directoryPath . '/' . $resource->id;
        
                $fileContent = '';
        
                if (file_exists($filePath)) {
                    if( $resource->media_type === "text/vnd.colombbus.declick.script" 
                        || $resource->media_type === "text/html" ) {
                        $resourcesContent[$resource->file_name] =  [$resource->id,file_get_contents($filePath),$project->id];
                    }
                    else{
                        // $fileSys = new FileSystem();
                        // TODO: return URL not path of img
                        $resourcesContent["img"][$resource->id] =  [$resource->file_name,$filePath,$project->id];
                    }
                }
            }
            return response($resourcesContent,200);
        } else {
            return response('not authorized', 401);
        }
        

    }

    // ATTENTION il y a un gros souci ici projec_id et ressource_id sont interverti .... 
    // va comprendre pourquoi
    public function delete($projectId, $resourceId)
    {
        $project = Project::findOrFail($resourceId);

        $resource = $project->resources()->findOrFail($projectId);

        $this->authorize('delete', $resource);

        $directoryPath =
            storage_path('app/projects/' . $resourceId . '/resources');
        $filePath = $directoryPath . '/' . $projectId;

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $resource->delete();

        return response('', 204);
    }
}
