module.exports = function SettingsBill(){
    let callCost;
    let smsCost;
    let warningLevel;
    let criticalLevel;

    let combainTotals = 0;
    const moment = require('moment');

    let objList = [];
    let actionList = [];

    var setSettings = function (settings){
        callCost = Number(settings.callCost);
        smsCost = Number(settings.smsCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }
    var getSettings = function(){
        return{
            callCost,
            smsCost,
            warningLevel,
            criticalLevel

        }
    }
    var recordAction = function (action){
        let cost = 0;
        if(grandTotal () < criticalLevel){

            if (action === 'sms'){
                cost = smsCost;
            }
            else if (action === 'call'){
                cost = callCost;
            }
            if(action != undefined){
                actionList.push({
                    type: action,
                    cost,
                    timestamp : new Date()
                });
                objList.push({
                    type: action,
                    cost,
                    timestamp : new Date()
                });
            }
            for (let i = 0; i < objList.length; i++) {
                let = timestamp = moment(objList[i].timestamp).format('mmmm do yyyy, h:mm:ss a')                ;
                objList[i].timestamp = (moment(timestamp, 'mmmm do yyyy, h:mm:ss a').fromNow());
            }
        }
    }

    var actions = function (){
        return actionList;
    }

    var actionsFor = function(type){
        const filter = [];
        
        for (let i = 0; i < actionList.length; i++){
            const action = actionList[i];
            if(action.type === type){
                filter.push(action);
            }
            else if(type == 'total'){
                filter.push(action);
            }
        }

        return filter;
    }

    var getTotal = function(type){
        let total = 0;
        
        for (let i = 0; i < actionList.length; i++) {
            const action = actionList[i];
            
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;
    }
    
    var grandTotal = function(){
        let globalTotal = getTotal('sms') + getTotal('call')
        combainTotals = Number(globalTotal).toFixed(2);
        return Number(globalTotal).toFixed(2);
    }

    var totals = function(){
        let smsTotal = getTotal('sms').toFixed(2);
        let callTotal = getTotal('call').toFixed(2);
        return{
            smsTotal,
            callTotal,
            grandTotal : grandTotal()
        }
    }
    var hasReachedWarningLevel = function(){
        const total = grandTotal();

        if (total + callCost >= warningLevel && total + callCost < criticalLevel) {
            return true;
        } else if (total + smsCost >= warningLevel && total + smsCost < criticalLevel) {
            return true;
        } else if (total >= warningLevel && total < criticalLevel) {
            return true;
        }
        return false;
    }

    var hasReachedCriticalLevel = function() {
        const total = grandTotal();
        if (total + callCost >= criticalLevel || total + smsCost >= criticalLevel) {
            return true;
        } else if (total >= criticalLevel) {
            return true;
        }
        return false;  
    }

    var  BothDanger =function() {
        const total = grandTotal();
        if (total < warningLevel && total < criticalLevel) {
           return true; 
        }
        return false;
    }

    var  values = function(){
        return {
            warningLevel: warningLevel,
            criticalLevel: criticalLevel,
            combainTotals: combainTotals,
        }
    }


    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        grandTotal,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        BothDanger,
        values
    }
}