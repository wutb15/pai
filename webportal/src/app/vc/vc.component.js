// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//

require('datatables.net/js/jquery.dataTables.js');
require('datatables.net-bs/js/dataTables.bootstrap.js');
require('datatables.net-bs/css/dataTables.bootstrap.css');
require('datatables.net-plugins/sorting/natural.js');
require('datatables.net-plugins/sorting/title-numeric.js');
const url = require('url');
//
require('./vc.component.scss');
const vcComponent = require('./vc.component.ejs');
const breadcrumbComponent = require('../job/breadcrumb/breadcrumb.component.ejs');
const webportalConfig = require('../config/webportal.config.json');
//
let table = null;

//

const loadData = (specifiedVc) => {
  $.ajax({
    type: 'GET',
    url: webportalConfig.restServerUri + '/api/v1/jobs',
    success: function(data) {
      const vcHtml = vcComponent({
        breadcrumb: breadcrumbComponent,
        specifiedVc: specifiedVc,
        data: {
          vc1: {
            description: 'VC of Alice\'s team.',
            activeJobs: 10,
            activeGpus: 42,
            configuredGpus: 4,
            configuredGpusInHadoop: 4,
          },
        vc2: {
            description: 'VC of Bob\'s team.',
            activeJobs: 2,
            activeGpus: 8,
            configuredGpus: 16,
            configuredGpusInHadoop: 16,
          },
        vc3: {
            description: 'VC of Charlie\'s team.',
            activeJobs: 7,
            activeGpus: 7,
            configuredGpus: 64,
            configuredGpusInHadoop: 64,
          },
        default: {
            description: 'Default VC.',
            activeJobs: 1,
            activeGpus: 4,
            configuredGpus: 4,
            configuredGpusInHadoop: 4,
          },
        },
        grafanaUri: webportalConfig.grafanaUri
      });
      $('#content-wrapper').html(vcHtml);
      table = $('#vc-table').dataTable({
        scrollY: (($(window).height() - 265)) + 'px',
        lengthMenu: [[20, 50, 100, -1], [20, 50, 100, 'All']],
        columnDefs: [
          {type: 'natural', targets: [0]},
          {type: 'title-numeric', targets: [1]},
        ],
      }).api();
    },
    error: function() {
      alert('Error when loading data.');
    },
  });
};

//

const resizeContentWrapper = () => {
  $('#content-wrapper').css({'height': $(window).height() + 'px'});
  if (table != null) {
    $('.dataTables_scrollBody').css('height', (($(window).height() - 265)) + 'px');
    table.columns.adjust().draw();
  }
};

//

$(document).ready(() => {
  $('#sidebar-menu--vc').addClass('active');
  window.onresize = function(envent) {
    resizeContentWrapper();
  };
  resizeContentWrapper();
  loadData(url.parse(window.location.href, true).query['vcName']);
});
