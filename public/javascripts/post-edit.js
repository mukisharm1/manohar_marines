let postEditForm = document.getElementById('postEditForm');
// add event listner
postEditForm.addEventListener('submit', function(event){

let imageUpload = document.getElementById('imageUpload').files.length;
let existingImgs = document.querySelectorAll('.imageDeletionCheckbox').length;
let imgsDeletion = document.querySelectorAll('.imageDeletionCheckbox:checked').length;

let newTotal = existingImgs- imgsDeletion + imageUpload;
if(newTotal > 4){
    event.preventDefault();
    let removalAmt = newTotal -4;
    alert(`you need to delete at ${removalAmt} image${removalAmt===1? "":"s"}`);
}

});
