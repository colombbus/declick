define(['jquery', 'TUtils', 'TEnvironment', 'TError', 'TParser'],
function($, TUtils, TEnvironment, TError, TParser) {
  /**
   * TLink is the bridge between client and server.
   * It loads projects.
   * @exports TLink
   */

    var TLink = function () {

    /*
    var token = false;
    var userId = false;
    var projectId = false;
    var defaultprojectId = false;

    var resources = false;
    */

    this.setProjectId = function (value) {
      store.setProjectId(value);
    }

    var self = this

    var api = {

      authorizationToken: null,

      makeRequest: function (parameters, successCallback, errorCallback) {
        var defaultParameters = {
          global: false,
          beforeSend: function (request) {
            if (api.authorizationToken) {
              request.setRequestHeader(
                'Authorization',
                'Token ' + api.authorizationToken
              )
            }
          },
          success: function (data) {
            successCallback.call(this, data)
          },
          error: function (data, status, error) {
            errorCallback.call(this, new TError(error))
          }
        }
        $.ajax($.extend(defaultParameters, parameters))
      },

      createResource: function (target, data, successCallback, errorCallback) {
        this.makeRequest({
          type: 'POST',
          url: TEnvironment.getBackendUrl(target),
          contentType: 'application/json',
          data: JSON.stringify(data)
        }, successCallback, errorCallback)
      },

      modifyResource: function (target, modifications, successCallback,
        errorCallback
      ) {
        this.makeRequest({
          type: 'PATCH',
          url: TEnvironment.getBackendUrl(target),
          contentType: 'application/json',
          data: JSON.stringify(modifications)
        }, successCallback, errorCallback)
      },

      getResource: function (target, successCallback, errorCallback) {
        this.makeRequest({
          type: 'GET',
          url: TEnvironment.getBackendUrl(target),
          dataType: 'json'
        }, successCallback, errorCallback)
      },

      deleteResource: function (target, successCallback, errorCallback) {
        this.makeRequest({
          type: 'DELETE',
          url: TEnvironment.getBackendUrl(target)
        }, successCallback, errorCallback)
      },

      getTextFile: function (target, successCallback, errorCallback) {
        this.makeRequest({
          type: 'GET',
          url: TEnvironment.getBackendUrl(target),
          dataType: 'text'
        }, successCallback, errorCallback)
      },

      setTextFile: function (target, code, successCallback, errorCallback) {
        this.makeRequest({
          type: 'POST',
          url: TEnvironment.getBackendUrl(target),
          contentType: 'text/plain',
          data: code
        }, successCallback, errorCallback)
      },

      getBinaryFile: function (target, successCallback, errorCallback) {
        this.makeRequest({
          type: 'GET',
          url: TEnvironment.getBackendUrl(target),
          dataType: 'text'
        }, successCallback, errorCallback)
      },

      setBinaryFile: function (target, data, successCallback, errorCallback) {
        this.makeRequest({
          type: 'POST',
          url: TEnvironment.getBackendUrl(target),
          contentType: 'text/plain',
          data: data
        }, successCallback, errorCallback)
      }
    }

    var store = {

      userId: null,
      projectId: null,
      projectResources: null,

      resetUser: function() {
        store.userId = null;
        store.projectId = null;
        store.projectResources = null;
      },

      setProjectId: function(value) {
        store.projectId = value;
        store.projectResources = null;
      },

      getUserId: function (successCallback, errorCallback) {
        if (store.userId) {
          return successCallback.call(self, store.userId)
        }
        api.getResource('authorizations', function (authorizations) {
          if (authorizations.length >= 1) {
            store.userId = authorizations[0].owner_id
            successCallback.call(self, store.userId)
          } else {
            errorCallback.call(new TError('user not connected'))
          }
        }, errorCallback)
      },

      getDefaultProjectId: function (successCallback, errorCallback) {
        this.getUserId(function (userId) {
          api.getResource(
            'users/' + userId + '/projects/default',
            function (project) {
              successCallback.call(self, project.id);
            },
            errorCallback
          )
        }, errorCallback)
      },

      getProjectId: function (successCallback, errorCallback) {
        if (store.projectId) {
          successCallback.call(self, store.projectId);
        } else {
          this.getDefaultProjectId(function(projectId) {
            store.projectId = projectId;
            successCallback.call(self, projectId);
            }
            , errorCallback);
        }
      },

      getProjectResources: function (successCallback, errorCallback) {
        if (store.projectId && store.projectResources) {
          return successCallback.call(self, store.projectResources,
            store.projectId);
        }
        this.getProjectId(function (projectId) {
          api.getResource(
            'projects/' + projectId + '/resources',
            function (resources) {
              store.projectResources = resources;
              successCallback.call(self, store.projectResources, projectId);
            },
            errorCallback
          )
        }, errorCallback)
      },

      getProjectResource: function (name, successCallback, errorCallback) {
        this.getProjectResources(function (resources, projectId) {
          var match = resources.filter(function (resource) {
            return resource.file_name === name;
          })[0]
          if (match) {
            successCallback.call(self, match, projectId);
          } else {
            errorCallback.call(self, new TError('resource not found'));
          }
        }, errorCallback);
      },

      deleteProjectResource: function (name, successCallback, errorCallback) {
        this.getProjectResource(name, function (resource, projectId) {
          api.deleteResource(
            'projects/' + projectId + '/resources/' + resource.id,
            function () {
              var index = store.projectResources.indexOf(resource);
              store.projectResources.splice(index, 1);
              successCallback.call(self, resource, projectId);
            },
            errorCallback
          )
        }, errorCallback);
      },

      createProjectScript: function (name, successCallback, errorCallback) {
        this.getProjectResources(function (resources, projectId) {
          var script = {
              file_name: name,
              media_type: SCRIPT_MEDIA_TYPE
          }
          api.createResource(
            'projects/' + projectId + '/resources',
            script,
            function (resource) {
              resources.push(resource);
              successCallback.call(self, resources, projectId);
            },
            errorCallback
          )
        }, errorCallback)
      },

      renameProjectScript: function (name, newName, successCallback,
        errorCallback
      ) {
        this.getProjectResource(name, function (resource, projectId) {
          api.modifyResource(
            'projects/' + projectId + '/resources/' + resource.id,
            modifications = {
              file_name: newName
            },
            function (resources) {
              resource.file_name = newName;
              successCallback.call(self, resources, projectId);
            },
            errorCallback
          )
        })
      },

      getProjectScriptContent: function (name, successCallback,
        errorCallback
      ) {
        this.getProjectResource(name, function (resource, projectId) {
          api.getTextFile(
            'projects/' + projectId + '/resources/' + resource.id + '/content',
            successCallback,
            errorCallback
          )
        }, errorCallback);
      },

      setProjectScriptContent: function (name, code, successCallback,
        errorCallback
      ) {
        this.getProjectResource(name, function (resource, projectId) {
          api.setTextFile(
            'projects/' + projectId + '/resources/' + resource.id + '/content',
            code,
            successCallback,
            errorCallback
          )
        }, errorCallback);
      },

      createProjectAsset: function (name, successCallback, errorCallback) {
        this.getProjectResources(function (resources, projectId) {
          var extension = ''
          if (name.indexOf('.') !== -1) {
            extension = name.split('.').pop();
          }
          var media_type = IMAGE_MEDIA_TYPES[extension];
          if (!media_type) {
            if (extension === 'html' || extension === 'htm') {
              media_type = HTML_MEDIA_TYPE;
            } else {
              media_type = 'application/octet-stream';
            }
          }
          var asset = {
              file_name: name,
              media_type: media_type
          }
          api.createResource(
            'projects/' + projectId + '/resources',
            asset,
            function (resource) {
              resources.push(resource);
              successCallback.call(self, resources, projectId);
            },
            errorCallback
          )
        }, errorCallback);
      },

      setProjectAssetContent: function (
        name,
        content,
        successCallback,
        errorCallback
      ) {
        this.getProjectResource(name, function (resource, projectId) {
          api.setBinaryFile(
            'projects/' + projectId + '/resources/' + resource.id + '/content',
            content,
            function () {
              successCallback.call(this, resource);
            },
            errorCallback
          )
        }, errorCallback);
      },

      renameProjectAsset: function (name, newBaseName, successCallback,
        errorCallback
      ) {
        this.getProjectResource(name, function (resource, projectId) {
          var newName = newBaseName;
          var extension = name.split('.').pop();
          if (extension) {
            newName += '.' + extension;
          }
          api.modifyResource(
            'projects/' + projectId + '/resources/' + resource.id,
            modifications = {
              file_name: newName
            },
            function (resources) {
              resource.file_name = newName;
              successCallback.call(self, newName);
            },
            errorCallback
          )
        }, errorCallback);
      },

      getProjectAssetContentLocation: function (name, withExtension) {
        // optimistic
        var resource = this.projectResources.filter(function (resource) {
          return resource.file_name === name;
        })[0];
        var target =
          'projects/' + (this.projectId || this.defaultProjectId) +
          '/resources/' + resource.id +
          '/content';
        if (withExtension) {
          for (var extension in IMAGE_MEDIA_TYPES) {
            if (resource.media_type === IMAGE_MEDIA_TYPES[extension]) {
              target += '.' + extension
              break
            }
          }
        }
        return TEnvironment.getBackendUrl(target);
      },

      getProjectAssetContent: function (name, successCallback, errorCallback) {
        this.getProjectResource(name, function (resource, projectId) {
          api.getBinaryFile(
            'projects/' + projectId + '/resources/' + resource.id + '/content',
            successCallback,
            errorCallback
          );
        }, errorCallback)
      }
    }

    TEnvironment.registerParametersHandler(function (parameters) {
        for (var name in parameters) {
            var value = parameters[name];
            switch (name) {
              case 'token':
                if (api.authorizationToken != value) {
                  api.authorizationToken = value;
                  store.resetUser();
                }
                break
            }
        }
    })

    this.getAuthorizationToken = function () {
      return api.authorizationToken
    }

    var SCRIPT_MEDIA_TYPE = 'text/vnd.colombbus.declick.script'

    this.getProgramList = function (callback) {
      store.getProjectResources(function (resources, projectId) {
        var scriptNames = []
        resources.forEach(function (resource) {
          if (resource.media_type === SCRIPT_MEDIA_TYPE) {
            scriptNames.push(resource.file_name)
          }
        })
        callback.call(self, scriptNames, projectId)
      }, function() {
        callback.call(self, new TError('not connected'));
      })
    }

    var IMAGE_MEDIA_TYPES = {
      'gif': 'image/gif',
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png'
    }

    var HTML_MEDIA_TYPE = 'text/html'

    this.getResources = function (callback) {
      store.getProjectResources(function (resources, projectId) {
        var formattedResources = {}
        resources.forEach(function (resource) {
          var isImage = false
          var isHtml = false
          for (var extension in IMAGE_MEDIA_TYPES) {
            if (resource.media_type === IMAGE_MEDIA_TYPES[extension]) {
              isImage = true
              break
            }
          }
          if (resource.media_type === HTML_MEDIA_TYPE) {
            isHtml = true
          }
          if (isImage || isHtml) {
            var parts = resource.file_name.split('.')
            var extension = (parts.length >= 2) ? parts.pop() : ''
            var baseName = parts.join('.')
            formattedResources[resource.file_name] = {
              type: (isImage && 'image') || (isHtml && 'text'),
              version: 0,
              extension: extension,
              'base-name': baseName
            }
          }
        })
        callback.call(self, formattedResources, projectId)
      }, function() {
        callback.call(self, new TError('cannot retrieve resources'));
      })
    }

    this.getResource = function (name, callback) {
      this.getResources(function (resources) {
        callback.call(self, resources[name])
      }, callback)
    }

    this.getProgramCode = function (name, callback) {
      store.getProjectScriptContent(name, callback, callback)
    }

    this.getProgramStatements = function (name, callback) {
      store.getProjectScriptContent(name, function (content) {
        var statements = TParser.parse(content, name)
        callback.call(self, statements)
      }, callback)
    }

    this.saveProgram = function (name, code, callback) {
      store.getProjectResource(name, function (resource) {
        store.setProjectScriptContent(name, code, function () {
          callback.call(self)
        }, callback)
      }, callback)
    }

    this.createProgram = function (name, callback) {
      store.createProjectScript(name, function () {
        callback.call(self)
      }, callback)
    }

    this.renameProgram = function (name, newName, callback) {
      store.renameProjectScript(name, newName, function () {
        callback.call(self)
      }, callback)
    }

    this.deleteProgram = function (name, callback) {
      store.deleteProjectResource(name, function () {
        callback.call(self)
      }, callback)
    }

    this.createResource = function (name, callback) {
      store.createProjectAsset(name, function () {
        callback.call(self, name)
      }, callback)
    }

    this.saveResource = function (name, data, callback) {
      store.getProjectResource(name, function (resource) {
        store.setProjectAssetContent(name, data, function () {
          self.getResource(name, callback)
        }, callback)
      }, callback)
    }

    this.getResourceContent = function (name, version, callback) {
      store.getProjectAssetContent(name, callback, callback)
    }

    this.setResourceContent = function (name, data, callback) {
      this.saveResource(name, data, callback)
    }

    this.getResourceLocation = function (name) {
      return store.getProjectAssetContentLocation(name, true)
    }

    this.getResourceUploadLocation = function (name) {
      return store.getProjectAssetContentLocation(name, false)
    }

    this.renameResource = function (name, newBaseName, callback) {
      store.renameProjectAsset(name, newBaseName, callback, callback)
    }

    this.getSlideContent = function (id, callback) {
      var slideUrl = TEnvironment.getConfig("slide-url")+id+'?access_token=jWNoVhWCng6odNLK';
      $.ajax({
          type: 'GET',
          url: slideUrl,
          dataType: 'json',
          success: function (data) {
            callback.call(this, data.content);
          },
          error: function (data, status, error) {
            callback.call(this, new TError(error))
          }
        })
    }

    this.deleteResource = this.deleteProgram
  };

  var linkInstance = new TLink();

  return linkInstance;
});
