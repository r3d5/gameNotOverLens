// -----JS CODE-----
// @input SceneObject cameraObject
// @input float triggerRadius
var gameObject = script.getSceneObject()
var isRotating = global.tweenManager.isPaused(gameObject, "test")

function onUpdateEvent(eventData) {
    if (script.cameraObject) {
        // Distance between the camera and the object is used to determine when to trigger the approach animations
        var dist = script.cameraObject.getTransform().getWorldPosition().distance(script.getSceneObject().getTransform().getWorldPosition());

        // If the approach anim isn't already playing then it's ok to trigger it
        if (!isRotating && dist <= script.triggerRadius) {
            onApproach();
        } else {
            global.tweenManager.pauseTween(gameObject, "test");
        }
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);

// Function for handling approach animations
function onApproach(eventData) {
    if (global.scene.getCameraType() == "back") {
        global.tweenManager.startTween(gameObject, "test");
    }
}
