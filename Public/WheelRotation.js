// object you want to rotate assuming its attached to this script
var object = script.getSceneObject()

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(rotate);


// note, this wont rotate it down. You'll have to play around with it. It was copy and pasted from this example: https://lensstudio.snapchat.com/api/classes/quat/
function rotate() {
    // Degrees to rotate by
    var degrees = 35;

    // Convert degrees to radians
    var radians = degrees;

    // Axis to rotate around
    var axis = vec3.left();

    // Rotation we will apply to the object's current rotation
    var rotationToApply = quat.angleAxis(radians, axis);

    // Get the object's current world rotation
    var oldRotation = object.getTransform().getLocalRotation();

    // Get the new rotation by rotating the old rotation by rotationToApply
    var newRotation = rotationToApply.multiply(oldRotation);

    // Set the object's world rotation to the new rotation
    object.getTransform().setLocalRotation(newRotation);


     
    // NOTE: IMPORTANT
    // when you want to stop the rotation you will call this
    // ie: when jaw is at your desired rotation
    
//    onFrameUpdate() = function() {} // stops update script
}