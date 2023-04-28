$(function () {
    
    Dropzone.autoDiscover = false;

    const dropzones = []
    $('.dropzone').each(function (i, el) {
        const name = $(el).attr('id')
        var myDropzone = new Dropzone(el, {
            url: window.location.pathname,
            autoProcessQueue: false,
            uploadMultiple: false,
            parallelUploads: 100,
            maxFiles: 100,
            paramName: name,
            addRemoveLinks: true,
        })
        dropzones.push(myDropzone)
    })

    document.querySelector("button[type=submit]").addEventListener("click", function (e) {
        // Make sure that the form isn't actually being sent.
        e.preventDefault();
        e.stopPropagation();
        let form = new FormData($('form')[0])

        dropzones.forEach(dropzone => {
            let { paramName } = dropzone.options
            dropzone.files.forEach((file, i) => {
                form.append(paramName, file)
            })
        })
        console.log(form);
        $.ajax({
            method: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                window.location = response.path;
            }
        });
    });

    $(document).ajaxStart(function(){
        // Show image container
        $("#loader").css({ visibility: 'visible' });
        $("#main-form").hide();
      });
      $(document).ajaxComplete(function(){
        $("#loader").hide();
      });
});