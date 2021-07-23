module.exports = function SettingsBill(){
    let callCost;
    let smsCost;
    let warningLevel;
    let criticalLevel;

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

        if (action === 'sms'){
            cost = smsCost;
        }
        else if (action === 'call'){
            cost = callCost;
        }
        actionList.push({
            type: action,
            cost,
            timestamp : new Date()
        });
    }

    var actions = function (){
        return actionList;
    }

    var actionsFor = function(type){
        return actionList.filter((action) => action.type === type)
    }

    var getTotal = function(type){
        return actionList.reduce((total, action) =>{
            let val = action.type === type ? action.cost : 0;
            return total + val;
        }, 0);
    }
    var grandTotal = function(){
        return getTotal('sms') + getTotal('call');
    }

    var totals = function(){
        let smsTotal = getTotal('sms');
        let callTotal = getTotal('call');
        return{
            smsTotal,
            callTotal,
            grandTotal : grandTotal()
        }
    }
    var hasReachedWarningLevel = function(){
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel && total < criticalLevel;
        return reachedWarningLevel;
    }

    var hasReachedCriticalLevel = function() {
        const total = grandTotal();
        return total >= criticalLevel;
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel
    }
}