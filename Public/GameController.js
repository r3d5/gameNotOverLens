// -----JS CODE-----
//@input Component.AnimationMixer fatherAnim
//@input Component.AnimationMixer boyAnim
//@input SceneObject fatherGO
//@input SceneObject boyPlaying
//@input SceneObject boyCrying
//@input SceneObject boyWalkingAwaySad

//@input float animationWeight = 1.0 {"widget":"slider", "min": 0, "max": 1, "step": 0.01}
//@input float animationStartOffset = 0.0
//@input int numberOfLoops = -1
//@input SceneObject console
//@input Component.MeshVisual visual
//@input Component.ScriptComponent behaviorScript
//@input SceneObject fatherPad
//@input SceneObject boyPad
//@input SceneObject doorGO
//@input SceneObject dayNightCircle
//@input Component.LightSource dayNightLight
//@input Component.Image transitionAnimation
 
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
var boyRotation = -8.8
var boyPosition = 0
var gameStarted = false
var DEG_TO_RAD = 0.0174533;
var X = [];
var fromAtoB = true
var animationTime = 0;
var progress = 0;
var dayLengthColorSpeed = 0
var dayLengthCircleSpeed = 0
var normalDayLengthColorSpeed = 43.2
var normalDayLengthCircleSpeed = 4.16
var fastDayLengthColorSpeed = 4.32
var fastDayLengthCircleSpeed = 41.6

function init() {
    script.boyAnim.start(boyPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.boyAnim.pause(boyPlayingLayer)
    script.fatherAnim.start(fatherPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.fatherAnim.pause(fatherPlayingLayer)
    script.visual.mainPass.baseColor = tvOffColor;
    boyPlayingAnim.speedRatio = boyPlaybackSpeed
    dayLengthCircleSpeed = normalDayLengthCircleSpeed
    dayLengthColorSpeed = normalDayLengthColorSpeed
    setStartRotationToNight()
}

init()

function startFirstScene() {
    script.visual.mainPass.baseColor = tvOnColor;
    //TODO: Check if anim is playing, then dont start
    script.boyAnim.start(boyPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    script.fatherAnim.start(fatherPlayingLayer, script.animationStartOffset, script.numberOfLoops);
    dissolveFather.reset(3);
    gameStarted = true
}

script.api.startFirstScene = startFirstScene
var dissolveFather = script.createEvent("DelayedCallbackEvent");
dissolveFather.bind(function(eventData)
{
    dissolveFatherBool = true
});

function setStartRotationToNight() {
    //PODSKAZKA: 270 = SOLNCE, 90 = LUNA, 0 = WECHER, 180 = UTRO
    var degrees = 270;
    var radians = degrees * (Math.PI / 180);
    var axis = vec3.left();
    var rotationToApply = quat.angleAxis(radians, axis);
    var oldRotation = script.dayNightCircle.getTransform().getWorldRotation();
    var newRotation = rotationToApply.multiply(oldRotation);
    script.dayNightCircle.getTransform().setWorldRotation(newRotation);
}

function lightCycles() {
    var degrees = dayLengthCircleSpeed * getDeltaTime();
    var radians = degrees * (Math.PI / 180);
    var axis = vec3.left();
    var rotationToApply = quat.angleAxis(radians, axis);
    var oldRotation = script.dayNightCircle.getTransform().getWorldRotation();
    var newRotation = rotationToApply.multiply(oldRotation);
    script.dayNightCircle.getTransform().setWorldRotation(newRotation);

     if (animationTime < dayLengthColorSpeed) {
            animationTime += getDeltaTime()          
            if (fromAtoB) {   
                X = lerp(dayLightColor, nightLightColor, animationTime/dayLengthColorSpeed);
            } else {
                X = lerp(nightLightColor, dayLightColor, animationTime/dayLengthColorSpeed);
            }
        } else {
            fromAtoB = !fromAtoB;
            animationTime = 0;
        }
        script.dayNightLight.color = new vec3(X[0], X[1], X[2])
}


function lerp(a, b, t) {
    var len = a.length;
    if(b.length != len) return;

    var x = [];
    for(var i = 0; i < len; i++)
        x.push(a[i] + t * (b[i] - a[i]));
    return x;
}

var dayLightColor = [0.55,0.55,0.9];
var nightLightColor = [0.05,0.05,0.6];
script.dayNightLight.color = new vec3(dayLightColor[0], dayLightColor[1], dayLightColor[2])
var transitionTime = 0;
var enableTransition = false;
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
function onUpdate(eventData) {
    
    if(enableTransition) {
        if (transitionTime < 0.5) {
            script.transitionAnimation.enabled = true
            transitionTime += getDeltaTime()
        } else {
            script.transitionAnimation.enabled = false
            transitionTime = 0
            enableTransition = false
        }
    }
   
    if (gameStarted) {
        
    lightCycles()
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
        if (globalTime > 9.9 && globalTime < 10) {
            enableTransition = true
        }
//  Apply change scene effect. Turn off boy playing, turn on boy crying
    if (globalTime > 10 && globalTime < 10.1) {
         script.boyPlaying.enabled = false
         script.boyCrying.enabled = true
         script.visual.mainPass.baseColor = tvOffColor;
    }
        
        if (globalTime > 13.1 && globalTime < 13.2) {
            enableTransition = true
        }
        
        if (globalTime > 13.2 && globalTime < 13.3) {
            script.doorGO.getTransform().setLocalRotation(quat.fromEulerAngles(0,0,-90 * DEG_TO_RAD))
            script.boyCrying.enabled = false
            script.boyWalkingAwaySad.enabled = true
        }
        
        if(globalTime > 13.3 && globalTime < 19) {
             script.boyWalkingAwaySad.getTransform().setLocalPosition(new vec3(script.boyWalkingAwaySad.getTransform().getLocalPosition().x,
                                                                      script.boyWalkingAwaySad.getTransform().getLocalPosition().y,
                                                                      script.boyWalkingAwaySad.getTransform().getLocalPosition().z - 1.1))
        }
        
        if(globalTime > 19 && globalTime < 19.1) {
                        enableTransition = true

        
        }
        if(globalTime > 19.1 && globalTime < 19.2) {
             script.doorGO.getTransform().setLocalRotation(quat.fromEulerAngles(0,0,0))
             script.boyWalkingAwaySad.enabled = false
        }
          
//    
//    if (globalTime > 16.5 && globalTime < 16.6) {
//        boyCryingAnim.pause() 
//        script.boyAnim.start("sadWalk", script.animationStartOffset, script.numberOfLoops);
//        
//     }
//        
//     if (globalTime > 16.6 && globalTime < 25) {
//            if (boyRotation*DEG_TO_RAD > -90*DEG_TO_RAD) {
//                  boyRotation -= (200*DEG_TO_RAD)
//                print(boyRotation)
//                
//                script.boyGO.getTransform().setWorldRotation(quat.fromEulerAngles(0,boyRotation * DEG_TO_RAD,0))
//                                script.doorGO.getTransform().setLocalRotation(quat.fromEulerAngles(0,0,boyRotation * DEG_TO_RAD))
//
//               script.boyGO.getTransform().setLocalPosition(new vec3(script.boyGO.getTransform().getLocalPosition().x - 1,
//                                                                      script.boyGO.getTransform().getLocalPosition().y,
//                                                                      script.boyGO.getTransform().getLocalPosition().z - 0.1))
//            } else {
//                 script.boyGO.getTransform().setLocalPosition(new vec3(script.boyGO.getTransform().getLocalPosition().x,
//                                                                      script.boyGO.getTransform().getLocalPosition().y,
//                                                                      script.boyGO.getTransform().getLocalPosition().z - 1.1))
//            }
//             
//          
//      }
    
    }  
}
