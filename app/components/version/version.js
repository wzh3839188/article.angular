'use strict';

angular.module('wzArticle.version', [
  'wzArticle.version.interpolate-filter',
  'wzArticle.version.version-directive'
])

.value('version', '0.1');
