/**
 * Created by xhorov on 5/4/2017.
 */

/**
 * Checks for adding/removing static pages
 */
staticPages = getSynchronizedArray(database.ref('settings/urls'), function () {
}, function () {
}, function (snap) {
    staticScene.currentStaticPage = 0;
    staticScene.staticPages = staticPages;
});



var staticScene = {
    currentStaticPage : 0,

    /**
     * Renders and changes static pages loaded from firebase
     */
    renderStaticPage: function() {
        if(staticPages.length == 0) return;
        if(this.staticPages.length == this.currentStaticPage){
            this.currentStaticPage = 0;
        }
        var elStatic = $("#scene_static")[0];
        elStatic.style.backgroundImage = "url('" + this.staticPages[this.currentStaticPage].url + "')";

        this.currentStaticPage++;
    },

};

