$('.upload-btn').on('click', function (){
    $('#upload').click();
    $('.progress-bar').width('0%');
});

$('#upload').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          $('.panel-body').fadeOut();
          $('input.link').val(window.location.host + '/d/' + data);
          
          setTimeout(function() {
            $('.share-link').fadeIn();
          }, 400);
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            $('.progress-bar').width(percentComplete + '%');

            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }
          }
        }, false);

        return xhr;
      }
    });
  }
});
