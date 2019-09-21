/**
 * Created by xhorov on 4/20/2017.
 */

SCENES = [];
sceneIndex = 1;

/**
 * Starts the program, loads data and starts routing between scenes
 */
function init() {
    $("#throbber")[0].style.display = 'none';
    $("#xClock")[0].style.display = 'block';
    prepareScenes();
    setInterval(function () {
        changeScene(sceneIndex);
    }, CONFIG.changingSceneInterval * 1000);
    downloader.downloadContent();
    downloader.listenAdminButtonClickRefresh();
}

function prepareScenes(){
    var elProgram = $("#scene_program")[0];
    var elSocial = $("#scene_social")[0];
    var elStatic = $("#scene_static")[0];
    var elGallery = $("#scene_gallery")[0];
    var elCompetition = $("#scene_competition")[0];

    if(CONFIG.program){
        SCENES.push(elProgram)
    }
    if(CONFIG.static){
        SCENES.push(elStatic)
    }
    if(CONFIG.instagram){
        SCENES.push(elSocial)
    }
    if(CONFIG.galery){
        SCENES.push(elGallery)
    }
    if(CONFIG.competition){
        SCENES.push(elCompetition)
    }
}

/**
 * Changes between scene program, social scene and insta/twitter feed
 */
function changeScene(index) {

    if(sceneIndex == SCENES.length) sceneIndex = 0;
    if(sceneIndex == 0){
        SCENES[SCENES.length-1].style.display = 'none';
    }
    else{
        SCENES[sceneIndex-1].style.display = 'none';
    }
    if(SCENES[sceneIndex].id == 'scene_static' ) {
        staticScene.renderStaticPage();
    }
    
    SCENES[sceneIndex].style.display = 'block';
    ++sceneIndex;


}


