const express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');
const moment = require('moment');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});


const app = express();
const settingsBill = SettingsBill();
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir:__dirname + '/views/layouts'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    if (settingsBill.values().warningLevel === undefined ) {
        res.render('index', {
          settings: settingsBill.getSettings(),
          totals: settingsBill.totals(),
          globalTotal: 'globalTotal'
        });
      } 
      else if (settingsBill.BothDanger()) {
        res.render('index', {
          settings: settingsBill.getSettings(),
          totals: settingsBill.totals(),
          globalTotal: 'globalTotal'
        });
      }
       else if (settingsBill.hasReachedWarningLevel()) {
        res.render('index', {
          settings: settingsBill.getSettings(),
          totals: settingsBill.totals(),
          globalTotal: 'warning'
        });
      } 
      else if (settingsBill.hasReachedCriticalLevel()) {
        res.render('index', {
          settings: settingsBill.getSettings(),
          totals: settingsBill.totals(),
          globalTotal: 'danger' 
        }); 
    }
});

app.post('/settings', (req, res) => {
    
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel      
    });
    res.redirect('/');
});

app.post('/action', (req, res) => {
    // capture the call type to add 
    settingsBill.recordAction(req.body.actionType);
    res.redirect('/')
});

app.get('/actions', (req, res) => {
    res.render('actions', {
      actions : settingsBill.actions()});
 
});

app.get('/actions/:actionType', (req, res) => {
    const actionType = req.params.actionType;
    res.render('actions', {
      actions : settingsBill.actionsFor(actionType)}); 
});

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("App started at port")
});
