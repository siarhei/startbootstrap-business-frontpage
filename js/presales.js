/**
 * Created by sshchahratsou on 7/6/2016.
 */
var Utils = {
    selectedInstanceIdxKey : 'selectedInstanceIdx',
    jsonPath : './json/infrastructure.json',
    APP_STATUSES: ['online', 'offline', 'starting'],

    saveInstanceIdx : function (idx) {
        localStorage.setItem(this.selectedInstanceIdxKey, idx);
    },

    retrieveInstanceIdx : function () {
        return (localStorage.getItem(this.selectedInstanceIdxKey));
    },

    clearInstanceIdx : function () {
        localStorage.removeItem(this.selectedInstanceIdxKey);
    },

    /** loads root JSON object and pass it to callback function */
    loadJson : function (callback) {
        $.getJSON(this.jsonPath, function (data) {
            callback(data);
        });
    },

    /** Retrieves all applications from given instance and returns an array of them */
    prepareApplicationsJson : function (inst) {
        var nodes = inst['nodes'];
        var apps = [];
        for (i = 0; i < nodes.length; i++) {
            for (j = 0; j < nodes[i]['applications'].length; j++) {
                var app = nodes[i]['applications'][j];
                app['host'] = inst.address.internal.ip; //adding new property 'host' for template engine
                apps.push(app);
            }
        }
        
        return apps;
    },

    loadInstanceDetails : function (idx, callback) {
        $.getJSON(this.jsonPath, function (data) {
            idx = (typeof idx == 'undefined') ? 0 : idx;
            var instances = data['instances'];
            if (idx <= instances.length) {
                var selected_instance = instances[idx];
                var apps = Utils.prepareApplicationsJson(selected_instance);
                var details = {
                    applications : apps,
                    name : selected_instance.name,
                    description : selected_instance.description
                };
                callback(details);
            } else {
                console.error("cannot load instance by idx = " + idx);
            }
        });
    },

    setupStatus : function(el, status, title) {
        $(el).parent().removeClass(this.APP_STATUSES.join(',')).addClass(status);
        $(el).html(title);
        console.info($(el).attr('href') + ' is online');
    }
};