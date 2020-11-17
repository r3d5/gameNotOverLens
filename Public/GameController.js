// -----JS CODE-----
//@input Component.AnimationMixer fatherAnim
//@input Component.AnimationMixer boyAnim
//@input SceneObject fatherGO
//@input float animationWeight = 1.0 {"widget":"slider", "min": 0, "max": 1, "step": 0.01}
//@input float animationStartOffset = 0.0
//@input int numberOfLoops = -1
//@input SceneObject console
//@input Component.MeshVisual visual
//@input Component.ScriptComponent behaviorScript
//@input SceneObject fatherPad
//@input SceneObject boyPad

var tvOnColor = new vec4(1.0,1.0,1.0,1.0)
var tvOffColor = new vec4(0,0,0,1.0)
var test = 0
var boyPlayingLayer = "boyPlaying"
var fatherPlayingLayer = "fatherPlaying"
var dissolveAnimTime = 12
var dissolveFatherBool = false
var boyPlaybackSpeed = 1.75
var boyPlayingAnim = script.boyAnim.getLayers()[1];
var boyCryingAnim = script.boyAnim.getLayers()[2];
var globalTime = 0
print(boyCryingAnim.name)
function init() {
    script.boyAnim.start(boyPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.boyAnim.pause(boyPlayingLayer)
    script.fatherAnim.start(fatherPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.fatherAnim.pause(fatherPlayingLayer)
    script.visual.mainPass.baseColor = tvOffColor;
    boyPlayingAnim.speedRatio = boyPlaybackSpeed
}

init()
function startFirstScene() {
    script.visual.mainPass.baseColor = tvOnColor;
    //TODO: Check if anim is playing, then dont start
    script.boyAnim.start(boyPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.fatherAnim.start(fatherPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    dissolveFather.reset(3);
}
script.api.startFirstScene = startFirstScene
var dissolveFather = script.createEvent("DelayedCallbackEvent");
dissolveFather.bind(function(eventData)
{
    dissolveFatherBool = true
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
function onUpdate(eventData) {
    globalTime += getDeltaTime()
    if(dissolveAnimTime > 0 && dissolveFatherBool) {
        script.fatherGO.getComponent("Component.RenderMeshVisual").mainMaterial.mainPass.disintegrate = (1 - dissolveAnimTime/12)
        dissolveAnimTime = dissolveAnimTime - 0.12
    } 
    
    if (globalTime > 6 && globalTime < 10) {
        script.fatherPad.enabled = false
        boyPlaybackSpeed -= 0.024
        boyPlayingAnim.speedRatio = Math.max(boyPlaybackSpeed, 1e-20);
    }
    
    if (globalTime > 10 && globalTime < 10.1) {
         boyPlayingAnim.pause()
         script.visual.mainPass.baseColor = tvOffColor;
         script.boyAnim.start("boyCrying", script.animationStartOffset, script.numberOfLoops);
    }
    
    
    
    
}
